"""Tes tanpa jaringan; ID dan judul dalam XML di sini fiktif untuk pengujian."""
import json
import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from update_youtube import channel_id_from_html, parse_feed, combine_cache, sync, is_shalawat

FAKE_CHANNEL = 'UC' + 'A' * 22
FAKE_VIDEO = 'AbCdEfG1234'
UNRELATED_VIDEO = 'QrStUvW5678'
XML = f'''<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">
<yt:channelId>{FAKE_CHANNEL}</yt:channelId>
<entry><yt:videoId>{FAKE_VIDEO}</yt:videoId><yt:channelId>{FAKE_CHANNEL}</yt:channelId><title>Sholawat Hidayah Nur</title><published>2026-10-10T10:00:00+00:00</published><media:group><media:description>Sholawat bersama jamaah</media:description></media:group></entry>
<entry><yt:videoId>{UNRELATED_VIDEO}</yt:videoId><yt:channelId>{FAKE_CHANNEL}</yt:channelId><title>Kajian Tafsir</title><published>2026-10-09T10:00:00+00:00</published><media:group><media:description>Sholawat disebut di deskripsi ini, tapi bukan video shalawat</media:description></media:group></entry>
</feed>'''

class TestYoutubeSync(unittest.TestCase):
    def test_channel_id_extraction(self):
        self.assertEqual(channel_id_from_html(f'<meta itemprop="channelId" content="{FAKE_CHANNEL}">'), FAKE_CHANNEL)
        self.assertEqual(channel_id_from_html(f'{{"externalId":"{FAKE_CHANNEL}"}}'), FAKE_CHANNEL)
        self.assertEqual(channel_id_from_html('<html>tidak ada id</html>'), '')

    def test_matching_titles_only(self):
        self.assertTrue(is_shalawat('SHOLAWAT Hidayah Nur', ['shalawat', 'sholawat']))
        self.assertFalse(is_shalawat('Kajian Tafsir Sufi', ['shalawat', 'sholawat']))

    def test_feed_filter(self):
        found, count = parse_feed(XML.encode(), FAKE_CHANNEL, ['shalawat', 'sholawat'])
        self.assertEqual(count, 2)
        self.assertEqual([x['id'] for x in found], [FAKE_VIDEO])
        with self.assertRaises(ValueError):
            parse_feed(XML.encode(), 'UC' + 'B' * 22, ['shalawat'])

    def test_cache_preserves_old_and_deduplicates(self):
        old = {'channel_id': FAKE_CHANNEL, 'videos': [
            {'id': UNRELATED_VIDEO, 'title': 'Salawat lawas', 'published_at': '2025-01-01T00:00:00Z', 'url': f'https://www.youtube.com/watch?v={UNRELATED_VIDEO}'}
        ]}
        found = [{'id': FAKE_VIDEO, 'title': 'Sholawat baru', 'published_at': '2026-10-10T00:00:00Z', 'url': f'https://www.youtube.com/watch?v={FAKE_VIDEO}'}]
        combined = combine_cache(found, old, FAKE_CHANNEL, 24)
        self.assertEqual([v['id'] for v in combined], [FAKE_VIDEO, UNRELATED_VIDEO])
        self.assertEqual(len(combine_cache(found, old, 'UC' + 'B' * 22, 24)), 1)

    def test_end_to_end_with_local_fixture(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / 'config').mkdir()
            (root / 'data').mkdir()
            (root / 'config/youtube.json').write_text(json.dumps({'handle': 'MajelisNurillah', 'channel_id': FAKE_CHANNEL, 'maximum_videos': 6, 'title_keywords': ['sholawat']}), encoding='utf-8')
            (root / 'data/shalawat-videos.json').write_text(json.dumps({'videos': [], 'channel_id': None}), encoding='utf-8')
            feedfile = root / 'test.xml'
            feedfile.write_text(XML, encoding='utf-8')
            result = sync(root, feedfile)
            self.assertEqual(len(result['videos']), 1)
            saved = json.loads((root / 'data/shalawat-videos.json').read_text(encoding='utf-8'))
            self.assertEqual(saved['videos'][0]['id'], FAKE_VIDEO)
            self.assertTrue(saved['updated_at'])

if __name__ == '__main__':
    unittest.main()
