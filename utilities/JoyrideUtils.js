export const joyridePrestasi = [
  {
    target: '[data-joyride="btn-tambah-prestasi"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Ingin Menambah Prestasi ?</h5>
        <p className="color-secondary fw-semibold">
          Tekan tombol untuk menambahkan prestasi dari siswa ke dalam sekolah
          anda.
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '[data-joyride="tingkat-prestasi"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Tingkat Prestasi</h5>
        <p className="color-secondary fw-semibold">
          Anda dapat melihat prestasi berdasarkan tingkat prestasi mulai dari
          tingkat internasional, nasional, provinsi, dan kabupaten / kota.
          Tekan tombol untuk memilih tingkat prestasi.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="cari-prestasi-siswa"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Cari Prestasi Siswa</h5>
        <p className="color-secondary fw-semibold">
          Masukkan nama prestasi siswa ke dalam kolom pencarian untuk mencari
          prestasi siswa.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="cari-siswa"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Cari Siswa</h5>
        <p className="color-secondary fw-semibold">
          Masukkan nama siswa ke dalam kolom pencarian untuk mencari siswa.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="table-prestasi"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Daftar Prestasi</h5>
        <p className="color-secondary fw-semibold">
          Ini merupakan daftar prestasi siswa yang ada di sekolah anda.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="edit-prestasi"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Edit Prestasi</h5>
        <p className="color-secondary fw-semibold">
          Tekan tombol jika anda ingin mengedit informasi mengenai prestasi
          yang sudah ditambahkan.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="delete-prestasi"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Hapus Prestasi</h5>
        <p className="color-secondary fw-semibold">
          Tekan tombol jika anda ingin menghapus prestasi yang sudah
          ditambahkan.
        </p>
      </div>
    ),
  },
];

export const joyrideKehadiranGTK = [
  {
    target: '[data-joyride="sidebar-data"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Data GTK</h5>
        <p className="color-secondary fw-semibold">
          Pada menu ini berisikan semua data data dari GTK. Tekan pada menu
          untuk masuk ke menu data dari GTK.
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '[data-joyride="sidebar-kehadiran"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Kehadiran GTK</h5>
        <p className="color-secondary fw-semibold">
          Pada menu ini berisikan semua informasi kehadiran dari GTK. Tekan
          pada menu untuk masuk ke menu kehadiran dari GTK.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="filter-tanggal"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Tanggal Kehadiran</h5>
        <p className="color-secondary fw-semibold">
          Untuk melihat kehadiran anda dapat memilih tanggal sesuai tanggal
          yang anda ingin lihat. Pilih tanggal lalu tekan tombol cari berwarna
          biru untuk melihat daftar kehadiran.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="btn-download-rekapan"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Rekap Absen</h5>
        <p className="color-secondary fw-semibold">
          Anda dapat merekap absensi kehadiran menjadi file excel. Tekan
          tombol untuk merekap absensi kehadiran sesuai tanggal yang anda
          pilih.
        </p>
      </div>
    ),
  },
  {
    target: '[data-joyride="table-kehadiran"]',
    content: (
      <div className="text-start">
        <h5 className="color-dark fw-black">Daftar Kehadiran GTK</h5>
        <p className="color-secondary fw-semibold">
          Ini merupakan daftar kehadiran GTK yang sudah ditambahkan ke sekolah
          anda.
        </p>
      </div>
    ),
  },
];