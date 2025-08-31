export const getStepsBankSoal = (user) => {
  const steps = [];

  if (user?.role == "guru") {
    steps.push(
      {
        target: '[data-joyride="btn-edit-ujian"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Edit Ujian</h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol jika anda ingin mengedit informasi mengenai ujian
              yang sudah dibuat.
            </p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: '[data-joyride="informasi-ujian"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Informasi Ujian</h5>
            <p className="color-secondary fw-semibold">
              Anda dapat melihat informasi singkat mengenai bank soal dari ujian
              yang anda buat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-pratinjau-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Melihat Pratinjau Soal ?
            </h5>
            <p className="color-secondary fw-semibold">
              Klik pada tombol untuk melihat pratinjau dari bank ujian yang
              sudah dibuat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-unduh-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Kartu Soal</h5>
            <p className="color-secondary fw-semibold">
              Bank soal yang sudah anda buat dapat diunduh menjadi file excel.
              Tekan tombol untuk mengunduh bank soal.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-unggah-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Unggah Soal</h5>
            <p className="color-secondary fw-semibold">
              Apabila anda ingin memasukkan soal dalam jumlah yang banyak dalam
              waktu yang bersamaan, anda bisa mengunggah soal yang sudah anda
              buat dengan mengnekan tombol unggah soal.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-buat-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Menambahkan Soal Baru ?
            </h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol untuk nambahkan soal baru ke dalam bank soal anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="pilihan-ganda"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Soal Pilihan Ganda</h5>
            <p className="color-secondary fw-semibold">
              Menu ini berisi semua soal berbentuk pilihan ganda. Klik menu
              apabila anda ingin melihat soal berbentuk pilihan ganda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="esai"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Soal Esai</h5>
            <p className="color-secondary fw-semibold">
              Menu ini berisi semua soal berbentuk esai. Klik menu apabila anda
              ingin melihat soal berbentuk esai.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="list-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Daftar Soal</h5>
            <p className="color-secondary fw-semibold">
              Daftar soal yang sudah anda buat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-edit-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Edit Soal</h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol jika anda ingin mengedit soal yang sudah dibuat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-delete-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Hapus Soal</h5>
            <p className="color-secondary fw-semibold">
              Jika anda ingin menghapus soal yang sudah anda buat, anda dapat
              menekan tombol ini untuk menghapus soal.
            </p>
          </div>
        ),
      }
    );
  }

  return steps;
};

export const getInitialFormDataSoal = (id) => {
  return {
    bentuk: "",
    kd: "",
    kdKontenMateri: "",
    levelKognitif: "",
    kjPg: "",
    nilaiSoal: 0,
    mUjianId: id,
    soalEdit: false,
    rubrikKj: [],
    audio: "",
    pertanyaan: "",

    //
    akmKontenMateri: "",
    akmKonteksMateri: "",
    akmProsesKognitif: "",
    opsiAUraian: "",
    opsiBUraian: "",
    kjUraian: "",
    pilihanMenjodohkan: [],
    soalMenjodohkan: [],
  };
};
