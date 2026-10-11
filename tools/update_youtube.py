#!/usr/bin/env python3
"""Sinkronisasi shalawat @MajelisNurillah dari YouTube Atom (tanpa API key).

Dijalankan oleh GitHub Actions. Berkas data JSON yang dihasilkan dibaca oleh
website statis. RSS resmi YouTube hanya memuat kira-kira 15 unggahan terbaru;
video shalawat lama yang pernah terdeteksi disimpan dalam cache JSON.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

BASE = Path(__file__).resolve().parents[1]
ATOM = "http://www.w3.org/2005/Atom"
YT = "http://www.youtube.com/xml/schemas/2015"
MEDIA = "http://search.yahoo.com/mrss/"
YT_ID = re.compile(r"UC[A-Za-z0-9_-]{22}$")
VIDEO_ID = re.compile(r"[A-Za-z0-9_-]{11}$")
USER_AGENT = "Mozilla/5.0 (compatible; NurillahWebsiteFeedSync/1.0)"


def get_url(url: str, attempts: int = 3) -> bytes:
    error = None
    for attempt in range(attempts):
        try:
            req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/atom+xml,text/html,*/*"})
            with urlopen(req, timeout=24) as response:
                payload = response.read(3_000_000)
                if len(payload) >= 3_000_000:
                    raise ValueError("Respon YouTube melewati batas 3 MB")
                return payload
        except (URLError, HTTPError, TimeoutError, OSError) as exc:
            error = exc
            if attempt < attempts - 1:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"Tidak dapat mengakses sumber YouTube: {error}")


def channel_id_from_html(document: str) -> str:
    """Ambil ID kanal dari metadata resmi halaman handle, bukan menebak."""
    decoded = html.unescape(document)
    patterns = [
        r'<meta\s+itemprop=["\']channelId["\']\s+content=["\'](UC[A-Za-z0-9_-]{22})',
        r'"channelId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"',
        r'"externalId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"',
        r'"browseId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"',
        r'https?://www\.youtube\.com/channel/(UC[A-Za-z0-9_-]{22})',
    ]
    for pattern in patterns:
        found = re.search(pattern, decoded, re.I)
        if found and YT_ID.fullmatch(found.group(1)):
            return found.group(1)
    return ""


def resolve_channel_id(handle: str, configured_id: str, cached_id: str) -> str:
    if YT_ID.fullmatch(configured_id or ""):
        return configured_id
    if YT_ID.fullmatch(cached_id or ""):
        return cached_id
    safe_handle = handle.lstrip("@").strip()
    if not re.fullmatch(r"[A-Za-z0-9._-]{3,50}", safe_handle):
        raise ValueError("Handle YouTube tidak valid dalam config/youtube.json")
    for tail in ("", "/videos", "/about"):
        try:
            page = get_url(f"https://www.youtube.com/@{safe_handle}{tail}").decode("utf-8", "replace")
            channel_id = channel_id_from_html(page)
            if channel_id:
                return channel_id
        except RuntimeError as exc:
            print(f"Peringatan: {exc}", file=sys.stderr)
    raise RuntimeError(
        "Channel ID belum ditemukan dari @handle. Buka YouTube Studio → Settings → "
        "Channel → Advanced settings, lalu isi channel_id di config/youtube.json."
    )


def is_shalawat(title: str, keywords: list[str]) -> bool:
    title_folded = " ".join((title or "").casefold().split())
    return any(word.casefold() in title_folded for word in keywords if word.strip())


def parse_feed(payload: bytes, expected_channel_id: str, keywords: list[str]) -> tuple[list[dict], int]:
    root = ET.fromstring(payload)
    root_channel_id = root.findtext(f"{{{YT}}}channelId", default="").strip()
    if root_channel_id and root_channel_id != expected_channel_id:
        raise ValueError("ID kanal pada RSS tidak sama dengan kanal yang dikonfigurasi.")
    matched: list[dict] = []
    count = 0
    for entry in root.findall(f"{{{ATOM}}}entry"):
        count += 1
        video_id = (entry.findtext(f"{{{YT}}}videoId") or "").strip()
        title = (entry.findtext(f"{{{ATOM}}}title") or "").strip()
        published = (entry.findtext(f"{{{ATOM}}}published") or "").strip()
        author_id = (entry.findtext(f"{{{YT}}}channelId") or "").strip()
        if author_id and author_id != expected_channel_id:
            continue
        if not VIDEO_ID.fullmatch(video_id) or not title or not is_shalawat(title, keywords):
            continue
        try:
            datetime.fromisoformat(published.replace("Z", "+00:00"))
        except ValueError:
            continue
        description = (entry.findtext(f"{{{MEDIA}}}group/{{{MEDIA}}}description") or "").strip()
        matched.append({
            "id": video_id,
            "title": title[:180],
            "description": description[:220],
            "published_at": published,
            "url": f"https://www.youtube.com/watch?v={video_id}"
        })
    return matched, count


def combine_cache(found: list[dict], previous: dict, channel_id: str, limit: int) -> list[dict]:
    carry = previous.get("videos", []) if previous.get("channel_id") == channel_id else []
    by_id = {}
    for item in [*carry, *found]:
        if not isinstance(item, dict):
            continue
        video_id = item.get("id", "")
        if VIDEO_ID.fullmatch(video_id) and isinstance(item.get("title"), str):
            by_id[video_id] = item
    return sorted(by_id.values(), key=lambda v: v.get("published_at", ""), reverse=True)[:limit]


def sync(root: Path, fixture: Path | None = None) -> dict:
    settings = json.loads((root / "config" / "youtube.json").read_text(encoding="utf-8"))
    data_path = root / "data" / "shalawat-videos.json"
    try:
        existing = json.loads(data_path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        existing = {}
    handle = settings["handle"].lstrip("@").strip()
    configured_id = settings.get("channel_id", "")
    previous_channel_id = existing.get("channel_id", "")
    if fixture:
        xml_data = fixture.read_bytes()
        feed_root = ET.fromstring(xml_data)
        channel_id = configured_id or feed_root.findtext(f"{{{YT}}}channelId", default="")
        if not YT_ID.fullmatch(channel_id):
            raise ValueError("Fixture XML atau konfigurasi tidak memiliki channel_id yang valid")
    else:
        channel_id = resolve_channel_id(handle, configured_id, previous_channel_id)
        xml_data = get_url(f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}")
    keywords = settings.get("title_keywords", [])
    if not isinstance(keywords, list) or not all(isinstance(k, str) for k in keywords):
        raise ValueError("Daftar title_keywords tidak valid")
    found, scanned = parse_feed(xml_data, channel_id, keywords)
    maximum = min(100, max(1, int(settings.get("maximum_videos", 24))))
    videos = combine_cache(found, existing, channel_id, maximum)
    # Untuk unggahan tanpa video shalawat baru, updated_at diperbarui jika sinkron berhasil.
    now = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    result = {
        "schema": "majelis-nurillah-youtube-v1",
        "handle": handle,
        "channel_id": channel_id,
        "updated_at": now,
        "scan_count": scanned,
        "videos": videos,
    }
    data_path.parent.mkdir(parents=True, exist_ok=True)
    data_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Sinkron berhasil: {scanned} unggahan RSS diperiksa; {len(found)} cocok; {len(videos)} video disimpan.")
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=BASE, help="Direktori website")
    parser.add_argument("--feed-file", type=Path, default=None, help="RSS XML lokal untuk pengujian (tanpa jaringan)")
    args = parser.parse_args()
    try:
        sync(args.root, args.feed_file)
    except (ValueError, RuntimeError, ET.ParseError, KeyError, OSError) as exc:
        print(f"Sinkron gagal: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
