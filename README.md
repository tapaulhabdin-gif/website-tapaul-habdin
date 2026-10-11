# Website Tapa’ul Habdin — Shalawat Terbaru Otomatis

Website personal branding Tapa’ul Habdin, Lc., MA, dengan bagian YouTube **@MajelisNurillah**, sekarang dilengkapi mekanisme sinkronisasi video shalawat otomatis dari **RSS resmi YouTube**. Tidak diperlukan API key. **Mekanisme ini mulai berjalan ketika berkas situs diunggah ke repositori GitHub, GitHub Actions aktif, dan website dipublikasikan dengan hosting yang sesuai.** Mengunduh ZIP atau membuka `index.html` di komputer saja tidak menjalankan sinkronisasi.

## Apa yang otomatis?

- Setiap **enam jam**, GitHub Actions menjalankan `tools/update_youtube.py` untuk mengambil RSS kanal `https://www.youtube.com/@MajelisNurillah`.
- Script mengenali judul yang mengandung istilah shalawat (misalnya shalawat, sholawat, salawat, selawat, صلوات, اللهم صل). Kriterianya dapat diedit pada `config/youtube.json`.
- Data terbaru disimpan ke `data/shalawat-videos.json`. Video shalawat lama yang pernah terdeteksi tetap disimpan (maksimum 24 entri bawaan), meskipun unggahan terbaru memuat kajian lain.
- Halaman website membaca berkas JSON dari domainnya sendiri, menampilkan maksimal **enam video** dengan judul asli, tanggal unggah, thumbnail, dan pemutar `youtube-nocookie.com` yang terbuka ketika diklik.
- Situs memeriksa ulang data JSON setiap 10 menit selama halaman tetap terbuka. Pemutar video tidak di-reset kecuali data baru tersedia.
- Timestamp sinkronisasi muncul di bawah judul “Shalawat terbaru”. Jika belum ada data, website memperlihatkan penjelasan dan tautan kanal resmi—**tidak mengarang daftar video**.

**Batasan resmi RSS**: RSS YouTube lazimnya menyediakan sekitar 15 unggahan paling baru, bukan semua arsip kanal. Video lama baru dapat dipertahankan setelah pernah tercatat saat pembaruan terjadwal. Jika video shalawat diberi judul yang tidak mengandung kata kunci, video itu tidak akan otomatis terpilih. Video privat/tidak terdaftar tidak disertakan. Jadwal GitHub Actions bisa tertunda saat layanan sibuk.

## Cara mengaktifkan secara gratis dengan GitHub Pages

1. Buat repositori **GitHub** baru, misalnya `website-tapaul-habdin`. Unggah **isi folder `tapaul-habdin-website`**, termasuk folder tersembunyi `.github`. Pastikan file `index.html` ada di akar repositori, bukan di subfolder.
2. Buka **Settings → Pages**, pada **Build and deployment → Source** pilih **GitHub Actions**. Bila perlu, aktifkan Pages untuk repositori ini.
3. Buka **Settings → Actions → General → Workflow permissions** dan pilih **Read and write permissions** (serta izinkan tindakan untuk mengakses Pages). Di beberapa organisasi, kebijakan ini diatur oleh admin.
4. Buka tab **Actions → Sinkronisasi Shalawat YouTube → Run workflow** untuk menjalankan sekarang. Setelah proses selesai, website GitHub Pages akan diterbitkan secara otomatis oleh langkah `deploy_pages`. **Website tetap diterbitkan meskipun sinkronisasi YouTube gagal**, sehingga Anda dapat menyelesaikan konfigurasi Channel ID kemudian tanpa menghalangi publikasi situs.
5. Selanjutnya pembaruan akan berjalan **setiap enam jam**, dengan deploy ulang otomatis. Link publik biasanya `https://NAMA-AKUN.github.io/NAMA-REPO/`.

### Jika GitHub Actions gagal mendapatkan Channel ID

Script dirancang menemukan Channel ID langsung dari halaman `@MajelisNurillah`, tetapi akses YouTube bisa dibatasi dan kanal belum dapat diverifikasi live pada saat pengemasan. Jika log Action menunjukkan `Channel ID belum ditemukan`:

1. Masuk ke akun kanal YouTube, buka **YouTube Studio → Settings → Channel → Advanced settings**, lihat **Channel ID** yang dimulai dengan `UC`.
2. Buka `config/youtube.json`, isi `"channel_id": "UCxxxxxxxxxxxxxxxxxxxxxx"` dengan **ID kanal asli** (bukan ID contoh), lalu commit.
3. Kembali ke Actions, jalankan **Run workflow**. Script kini dapat menggunakan RSS tanpa mengambil metadata handle setiap kali.

Jangan menebak Channel ID. Anda juga dapat mencari Channel ID dari halaman publik kanal jika YouTube sedang mengizinkan akses metadata.

### Jika menggunakan Netlify, Vercel, atau hosting lain

GitHub Actions tetap dapat berjalan jika sumber website terhubung ke repositori GitHub. Saat script mengubah JSON dan commit, platform yang terhubung ke repo dapat melakukan deploy ulang otomatis. `deploy_pages` juga akan mencoba deploy ke GitHub Pages, sehingga untuk deployment murni di platform lain tanpa Pages, boleh hapus job `deploy_pages` dari workflow. Jika hanya mengunggah berkas ZIP langsung ke hosting tanpa GitHub Actions atau scheduler lain, **daftar video tidak diperbarui otomatis**.

## Mengubah kata kunci judul video

Buka `config/youtube.json`, sesuaikan `title_keywords` dan `maximum_videos`. Filter bekerja **berdasarkan judul** agar ceramah yang kebetulan mencantumkan shalawat dalam deskripsinya tidak salah digolongkan sebagai video shalawat. Contoh tambahan untuk judul: `"burdah"`, `"shalawat hidayah nur"` atau variasi ejaan yang biasa dipakai di kanal. Jangan tambah kata terlalu umum seperti `"kajian"` jika hanya ingin video shalawat.

## Menguji sinkronisasi tanpa internet

```bash
python -m unittest discover -s tests -v
```

Pengujian memakai RSS **simulasi** di memori, bukan konten video nyata. Anda bisa menguji file RSS lokal dengan `python tools/update_youtube.py --feed-file CONTOH-FEED.xml`; perintah tersebut mengubah data lokal sehingga **jangan digunakan pada paket siap terbit dengan XML fiktif**.

## Susunan utama

- `index.html`, `styles.css`, `app.js`: website, bagian galeri, dan asisten profil.
- `data/shalawat-videos.json`: data terverifikasi hasil sinkronisasi; dikirim kosong saat pengemasan karena belum bisa mengambil sumber langsung.
- `tools/update_youtube.py`: mesin pengambil RSS, pengelompok judul, dan penyusun JSON.
- `config/youtube.json`: handle, Channel ID opsional, dan kata kunci.
- `.github/workflows/sync-youtube.yml`: tugas terjadwal + deploy GitHub Pages.
- `tests/test_youtube_sync.py`: unit test sinkron tanpa jaringan.
- `assets/tapaul-habdin-foto-asli.jpg`: foto asli dari CV, tanpa mengubah wajah maupun bentuk tubuh.
- `RESEARCH_SOURCES.md`: catatan sumber profil dan publikasi.

## Catatan keandalan dan privasi

Website tidak memiliki akses ke akun Google/YouTube pribadi; data diambil hanya dari unggahan **publik**. Thumbnail YouTube dimuat dari `i.ytimg.com` dan video ditampilkan dari `youtube-nocookie.com`. Tidak ada API key atau kata sandi yang harus dimasukkan ke dalam `app.js`. Asisten profil adalah respons berbasis informasi terkurasi, bukan AI generatif. Formulir kontak belum otomatis mengirim email tanpa alamat resmi yang diatur. Data alamat rumah dan tanggal lahir dari CV tidak dipublikasikan.

## Catatan penerbitan revisi

Setiap perubahan pada halaman website (`index.html`, `styles.css`, `app.js`), aset, dan data video akan menjalankan workflow dan menerbitkan website kembali. Untuk mempublikasikan di repositori yang telah ada, pindahkan **isi** folder ini ke akar repositori. Tidak ada kredensial GitHub atau tindakan login dalam paket ini; pemilik repositori harus menggunakan sesi GitHub yang telah terotorisasi untuk mengunggah serta mengaktifkan Pages.
