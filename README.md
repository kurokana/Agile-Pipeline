# Agile Pipeline UTS Demo

## 1. Deskripsi Project
Nama aplikasi: **TaskFlow Lite**  
Tujuan: menampilkan mini aplikasi manajemen task berbasis Kanban dan menunjukkan proses standar kode melalui pipeline CI pada branch `master/main`.

Fitur singkat:
- Tambah task baru
- Simpan task di browser (localStorage)
- Pindah status task: Todo -> Doing -> Done -> Todo
- Pipeline otomatis: lint, unit test, build, artifact upload

## 2. Susunan Tim (contoh, silakan ganti)
- Product Owner: Nama 1
- Scrum Master: Nama 2
- Developer: Nama 3
- QA/Tester: Nama 4

## 3. Ringkasan Aplikasi
Aplikasi web statis sederhana untuk membantu tim memantau task harian. Aplikasi ini dipilih karena ringan, mudah dipresentasikan, dan fokus penilaian ada pada proses pipeline serta gitflow.

## 4. Version Control
- Platform: GitHub
- Branch utama: `master` (boleh `main`, sesuaikan repository)
- Strategi gitflow sederhana:
  1. Buat branch fitur dari `master`: `feature/nama-fitur`
  2. Commit perubahan
  3. Push dan buat Pull Request ke `master`
  4. CI pipeline berjalan otomatis
  5. Jika lolos, merge ke `master`

## 5. Task Management
- Tool: Trello / Jira / GitHub Projects (pilih salah satu)
- Alur board: Backlog -> To Do -> In Progress -> Done
- Setiap task dihubungkan dengan branch fitur dan Pull Request

## 6. Tools Agile yang Dipakai
- Sprint planning
- Daily standup singkat
- Kanban/Scrum board
- Pull Request review
- CI pipeline untuk quality gate

## 7. Pipeline yang Diimplementasikan
File pipeline ada di `.github/workflows/ci.yml`.

Tahapan otomatis saat push/PR ke `master/main`:
1. Checkout code
2. Setup Node.js
3. Install dependencies (`npm ci`)
4. Lint (`npm run lint`)
5. Unit test (`npm run test`)
6. Build (`npm run build`)
7. Upload artifact folder `dist`

## 8. Cara Menjalankan Lokal
1. Install dependency
   - `npm install`
2. Jalankan quality check
   - `npm run check`
3. Jalankan website lokal
   - `npm run start`
4. Buka browser ke URL dari terminal (umumnya `http://localhost:3000`)

## 9. Script Demo Presentasi (singkat)
1. Tunjukkan board task di aplikasi web
2. Tunjukkan struktur branch (`master`, `feature/*`)
3. Buat perubahan kecil di branch fitur
4. Buat Pull Request ke `master`
5. Tunjukkan pipeline berjalan (lint, test, build)
6. Tunjukkan status hijau lalu merge

## 10. Catatan Deadline
Sesuai instruksi: presentasi minggu depan di hari yang sama. Pastikan pipeline sudah pernah berhasil minimal 1 kali sebelum demo.
