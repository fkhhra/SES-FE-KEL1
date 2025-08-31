import { momentPackage } from "utilities/HelperUtils";

export const kelasJoyrideSteps = [ {
  target: '[data-joyride="kelas-info"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Informasi kelas</h5>
      <p className="color-secondary fw-semibold">
        Klik tombol ini, untuk melihat informasi dari kelas anda. Disini
        anda bisa melihat siapa saja anggota dari kelas anda dan informasi
        dari setiap anggota kelas anda.
      </p>
    </div>
  ),
  disableBeacon: true,
},
{
  target: '[data-joyride="timeline"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Timeline</h5>
      <p className="color-secondary fw-semibold">
        Menu ini berisi mengenai kesimpulan dari semua aktivitas kelas
        anda. Disini anda bisa melihat semua aktivitas terbaru yang ada
        pada kelas anda, seperti pertemuan kelas, tugas kelas dan juga
        diskusi kelas.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="analisis-materi"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Analisis Materi</h5>
      <p className="color-secondary fw-semibold">
        Pada menu ini berisi mengenai materi pelajaran yang anda buat
        untuk kelas anda. Disini anda dapat menganalisis aktivitas belajar
        siswa terkait materi yang anda berikan untuk kelas anda.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="tugas"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Tugas</h5>
      <p className="color-secondary fw-semibold">
        Pada menu ini berisi mengenai semua aktivitas tugas dari kelas
        anda. Pada menu ini anda dapat membuat tugas, memonitor aktivitas
        pengerjaan tugas dan juga melakukan penilaian tugas siswa anda.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="pertemuan"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Pertemuan</h5>
      <p className="color-secondary fw-semibold">
        Pada menu ini berisi semua aktivitas mengenai pertemuan yang ada
        dikelas. Disini anda dapat membuat pertemuan untuk kelas anda
        untuk melakukan pembelajaran di kelas.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="analisis-nilai"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Analisis Nilai</h5>
      <p className="color-secondary fw-semibold">
        Disini anda dapat melihat nilai nilai dari siswa di kelas anda.
        Pada menu ini juga disajikan informasi mengenai ketertiban siswa
        dalam mengerjakan tugas anda. Anda dapat menganalisis seberapa
        rajin siswa anda dalam mengerjakan tugas pada kelas anda.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="grup-kelas"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Grup Kelas</h5>
      <p className="color-secondary fw-semibold">
        Lakukan diskusi kelas lebih lanjut dengan menggunakan sosial media
        dengan menggunaka menekan tombol ini. Grup ini akan secara
        otomatis terintegrasi dengan grup kelas yang anda.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="add-postingan"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">
        Ingin melakukan diskusi dengan kelas?
      </h5>
      <p className="color-secondary fw-semibold">
        Klik pada bagian ini untuk melakukan diskusi dengan kelas atau
        memberikan postingan pada kelas anda.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="topik-materi"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Topik Materi</h5>
      <p className="color-secondary fw-semibold">
        Topik dari BAB materi yang anda berikan untuk kelas anda. Untuk
        melihat lebih detail mengenai aktivitas baca siswa terkait topik
        materi ini, anda dapat menekan pada bagian ini.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="progres-materi"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Progres Materi</h5>
      <p className="color-secondary fw-semibold">
        Anda dapat melihat berapa banyak siswa yang sudah membaca materi
        yang anda bagikan.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="saat-ini"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Tugas Saat Ini</h5>
      <p className="color-secondary fw-semibold">
        Berisi tugas tugas yang sedang diberikan saat ini. Anda dapat
        melihat berapa banyak tugas saat ini dengan memilih menu ini.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="terjadwal"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Tugas Terjadwal</h5>
      <p className="color-secondary fw-semibold">
        Berisi tugas tugas yang dijadwalkan untuk diberikan ke kelas
        nanti. Anda dapat melihat berapa banyak tugas terjadwal dengan
        memilih menu ini.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="sudah-selesai"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Tugas Sudah Selesai</h5>
      <p className="color-secondary fw-semibold">
        Berisi tugas tugas yang sudah selesai dikerjakan siswa atau sudah
        lewat dari batas pengumpulan. Anda dapat melihat berapa banyak
        tugas sudah selesai dengan memilih menu ini.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="terperiksa"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Tugas Terperiksa</h5>
      <p className="color-secondary fw-semibold">
        Berisi tugas tugas yang sudah anda nilai. Anda dapat melihat
        berapa banyak tugas terperiksa dengan memilih menu ini.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="draf"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Tugas Draf</h5>
      <p className="color-secondary fw-semibold">
        Berisi tugas tugas yang anda draf dan belum dibagikan kepada kelas
        anda. Anda dapat melihat berapa banyak tugas draf dengan memilih
        menu ini.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="btn-buat-tugas"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">
        Ingin Membuat Tugas Untuk Kelas Anda?
      </h5>
      <p className="color-secondary fw-semibold">
        Tekan tombol ini jika anda ingin membuat tugas untuk kelas anda.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="unduh-absen"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">Unduh Absen</h5>
      <p className="color-secondary fw-semibold">
        Anda dapat merekap semua pertemuan yang sudah anda buat dan dapat
        melihat informasi mengenai absen siswa. Tekan tombol ini untuk
        mengunduh rekap pertemuan berupa file excel.
      </p>
    </div>
  ),
},
{
  target: '[data-joyride="btn-buat-pertemuan"]',
  content: (
    <div className="text-start">
      <h5 className="color-dark fw-black">
        Ingin Membuat Pertemuan Dengan Kelas?
      </h5>
      <p className="color-secondary fw-semibold">
        Tekan tombol ini jika anda ingin melakukan pertemuan dengan kelas
        anda.
      </p>
    </div>
  ),
} ];

export const restructureData = (data, additionalData) => {
  // This function will restructure data to be as below : 
  // const data = {
  //   "tanggal": {
  //     tatapMaya: [{ id: "", name: "" }],
  //     tugas: [{ id: "", name: "" }],
  //     tugasKuis: [{ id: "", name: "" }],
  //     materi: [{ id: "", name: "" }],
  //   }
  // }

  let newData = {};

  const { daftarBab, anggotaRombel } = additionalData || {};

  data?.forEach(dt => {
    if (dt?.tipe === "absen") {
      const tanggalPertemuan = dt?.tanggalPertemuan || dt?.timeline?.tanggalPertemuan;
      if (!newData[tanggalPertemuan]?.tatapMaya) { // 13 Oktober 2021
        newData[tanggalPertemuan] = { ...newData[tanggalPertemuan], tatapMaya: [] };
        newData[tanggalPertemuan]["tatapMaya"].push(dt)
      } else {
        newData[tanggalPertemuan]["tatapMaya"].push(dt)
      }
    } else if (dt?.tipe === "tugas" && (dt?.tugas?.soal?.length > 0 || dt?.timeline?.tugas?.soal?.length > 0)) {
      const formatTanggalPembagian = momentPackage(dt?.tugas?.tanggalPembagian || dt?.timeline?.tugas?.tanggalPembagian).format("DD MMMM YYYY");
      if (!newData[formatTanggalPembagian]?.tugasKuis) {
        newData[formatTanggalPembagian] = { ...newData[formatTanggalPembagian], tugasKuis: [] };
        newData[formatTanggalPembagian]["tugasKuis"].push(dt);
      } else {
        newData[formatTanggalPembagian]["tugasKuis"].push(dt);
      }
    } else if (dt?.tipe === "tugas") {
      const formatTanggalPembagian = momentPackage(dt?.tugas?.tanggalPembagian || dt?.timeline?.tugas?.tanggalPembagian).format("DD MMMM YYYY");
      if (!newData[formatTanggalPembagian]?.tugas) {
        newData[formatTanggalPembagian] = { ...newData[formatTanggalPembagian], tugas: [] };
        newData[formatTanggalPembagian]["tugas"].push(dt);
      } else {
        newData[formatTanggalPembagian]["tugas"].push(dt);
      }
    } else if (dt?.tipe === "materi") {
      const formatTanggalPembagian = momentPackage(dt?.tanggalPembagian || dt?.timeline?.tanggalPembagian).format("DD MMMM YYYY");
      const materiId = dt?.id
      if (!newData[formatTanggalPembagian]?.materi) {
        newData[formatTanggalPembagian] = { ...newData[formatTanggalPembagian], materi: [] };
        (dt?.materi || dt?.timeline?.materi)?.length > 0 && (dt?.materi || dt?.timeline?.materi)?.forEach(item => {
          const babNumber = daftarBab?.findIndex(({ id: babId }) => babId === item?.bab?.id) + 1;
          const sudahBaca = item?.meta?.totalKesimpulan;
          newData[formatTanggalPembagian]["materi"].push({ ...dt, ...item, babNumber, materiId, sudahBaca, anggotaRombel });
        });
      } else {
        (dt?.materi || dt?.timeline?.materi)?.length > 0 && (dt?.materi || dt?.timeline?.materi)?.forEach(item => {
          const babNumber = daftarBab?.findIndex(({ id: babId }) => babId === item?.bab?.id) + 1;
          const sudahBaca = item?.meta?.totalKesimpulan;
          newData[formatTanggalPembagian]["materi"].push({ ...dt, ...item, babNumber, materiId, sudahBaca, anggotaRombel });
        });
      }
    }
  });

  return newData;
}

export const restructureAbsenKegiatanData = (data, detailRombel) => {
  // const data = {
  //   "tanggal": {
  //     "mataPelajaran": [
  //       tatapMaya: [{ id: "", name: "" }],
  //       tugas: [{ id: "", name: "" }],
  //       tugasKuis: [{ id: "", name: "" }],
  //       materi: [{ id: "", name: "" }],
  //     ]
  //   }
  // }

  const daftarBab = detailRombel?.analisisMateri?.materi?.bab;
  const anggotaRombel = detailRombel?.jadwalMengajar?.rombel?.anggotaRombel;


  let newData = {};
  
  data?.forEach(dt => {
    let tempTugasData = {...dt}
    const mataPelajaran = tempTugasData?.mataPelajaran?.nama;

    if (tempTugasData?.tipe == "absen") {
      tempTugasData.tipeKegiatan = "tatap-maya";
      const tanggalPertemuan = tempTugasData?.tanggalPertemuan;

      if (!newData?.hasOwnProperty(tanggalPertemuan)) {
        newData[tanggalPertemuan] = {
          [mataPelajaran]: [tempTugasData]
        };
      } else {
        if (!newData[tanggalPertemuan][mataPelajaran]) {
          newData[tanggalPertemuan][mataPelajaran] = [tempTugasData];
        } else {
          newData[tanggalPertemuan][mataPelajaran].push(tempTugasData);
        }
      }
    } else

    if (tempTugasData?.tipe == "materi") {
      const formatTanggalPembagian = momentPackage(tempTugasData?.tanggalPembagian).format("DD MMMM YYYY");
      const materi = dt?.materi?.[0];
      tempTugasData.tipeKegiatan = "materi";
      tempTugasData.materiId = tempTugasData?.id;
      tempTugasData.bab = materi?.bab;;
      tempTugasData.babNumber = (daftarBab?.findIndex(({ id: babId }) => babId === materi?.bab?.id) || 0) + 1;;
      tempTugasData.sudahBaca = materi?.meta?.totalKesimpulan;
      tempTugasData.anggotaRombel = anggotaRombel;
      tempTugasData.judul = materi?.judul

      if (!newData?.hasOwnProperty(formatTanggalPembagian)) {
        newData[formatTanggalPembagian] = {
          [mataPelajaran]: [tempTugasData]
        };
      } else {
        if (!newData[formatTanggalPembagian][mataPelajaran]) {
          newData[formatTanggalPembagian][mataPelajaran] = [tempTugasData];
        } else {
          newData[formatTanggalPembagian][mataPelajaran].push(tempTugasData);
        }
      }
    }

    if (tempTugasData?.tipe == "tugas") {
      const formatTanggalPembagian = momentPackage(tempTugasData?.tugas?.tanggalPembagian).format("DD MMMM YYYY");
      if (tempTugasData?.tugas?.soal?.length > 0) {
        tempTugasData.tipeKegiatan = "tugas-kuis"
      } else {
        tempTugasData.tipeKegiatan = "tugas"
      }
      
      if (!newData?.hasOwnProperty(formatTanggalPembagian)) {
        newData[formatTanggalPembagian] = {
          [mataPelajaran]: [tempTugasData]
        };
      } else {
        if (!newData[formatTanggalPembagian][mataPelajaran]) {
          newData[formatTanggalPembagian][mataPelajaran] = [tempTugasData];
        } else {
          newData[formatTanggalPembagian][mataPelajaran].push(tempTugasData);
        }
      }
    }
  });

  return newData;
}