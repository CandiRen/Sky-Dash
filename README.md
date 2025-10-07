# Sky Dash

Sky Dash adalah gim bergaya Flappy Bird dengan tema pesawat yang melintasi langit kota. Tugas kamu sederhana: jaga pesawat tetap terbang dan hindari badai awan yang terbentuk dari gedung pencakar langit.

## Fitur
- Latar belakang kota dengan gedung tinggi yang bergerak parallax.
- Kontrol sederhana (klik/tap atau tombol spasi/arrow up).
- Sistem skor yang bertambah setiap berhasil melewati badai awan.
- Antarmuka ringan yang kompatibel dengan desktop dan perangkat sentuh.

## Cara Menjalankan
1. Pastikan kamu berada di folder proyek ini.
2. Jalankan server statis lokal, misalnya menggunakan Python 3:
   ```bash
   python3 -m http.server 8000
   ```
3. Buka browser ke `http://localhost:8000/index.html`.
4. Jika ingin menghentikan server, tekan `Ctrl + C` di terminal.

## Cara Bermain
- Klik tombol **Mulai** atau tekan `Space` untuk memulai gim sekaligus melakukan dorongan pertama.
- Klik/tap di dalam area gim atau tekan `Space`/`Arrow Up` untuk menjaga pesawat tetap naik.
- Hindari menabrak badai awan yang muncul dari atas dan bawah.
- Setelah Game Over, tekan tombol **Ulangi** atau tombol `R` untuk bermain kembali.

## Struktur Proyek
```
.
├── index.html      # Markup utama dan HUD permainan
├── styles.css      # Styling antarmuka dan kanvas permainan
├── scripts/
│   └── game.js     # Logika permainan dan rendering kanvas
└── README.md       # Dokumentasi proyek
```

## Pengembangan
- Aset digambar langsung menggunakan API canvas sehingga mudah dimodifikasi.
- Untuk melakukan perubahan pada logika permainan, fokuskan pada file `scripts/game.js`.
- Gim ini menggunakan modul ES6 bawaan browser, sehingga tidak memerlukan bundler.
