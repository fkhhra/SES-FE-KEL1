import ctl from "@netlify/classnames-template-literals";
import { Tooltip } from "antd";
import { ssURL } from "client/clientAxios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const SidebarBukuKerjaGuruDetail = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const { buku_kerja } = router.query;

  const listAllMenu = [
    {
      url: `${ssURL}/buku-kerja-guru/skl-ki-kd?buku_kerja=1`,
      text: "SKL, KI / CP, dan KD / TP",
      isVisible: buku_kerja?.includes(1),
    },
    {
      url: `${ssURL}/buku-kerja-guru/rpp?buku_kerja=1`,
      text: "RPP / Modul Ajar",
      isVisible: buku_kerja?.includes(1),
    },
    {
      url: `${ssURL}/buku-kerja-guru/silabus?buku_kerja=1`,
      text: "Silabus / Alur Tujuan Pembelajaran (ATP)",
      isVisible: buku_kerja?.includes(1),
    },
    {
      url: `${ssURL}/buku-kerja-guru/kkm?buku_kerja=1`,
      text: "KKM / KKTP",
      isVisible: buku_kerja?.includes(1),
    },
    {
      url: `${ssURL}/buku-kerja-guru/kode-etik?buku_kerja=2`,
      text: "Kode Etik Guru",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/ikrar-guru?buku_kerja=2`,
      text: "Kode Ikrar Guru",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/tata-tertib-guru?buku_kerja=2`,
      text: "Tata Tertib Guru",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/pembiasaan-guru?buku_kerja=2`,
      text: "Pembiasaan Guru",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/kalender-pendidikan?buku_kerja=2`,
      text: "Kalender Pendidikan",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/alokasi-waktu?buku_kerja=2`,
      text: "Alokasi Waktu",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/program-tahunan?buku_kerja=2`,
      text: "Program Tahunan",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/program-semester?buku_kerja=2`,
      text: "Program Semester",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/jurnal-agenda-guru?buku_kerja=2`,
      text: "Jurnal Agenda Guru",
      isVisible: buku_kerja?.includes(2),
    },
    {
      url: `${ssURL}/buku-kerja-guru/daftar-kehadiran?buku_kerja=3`,
      text: "Daftar Kehadiran",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/daftar-nilai?buku_kerja=3`,
      text: "Daftar Nilai",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/penilaian-akhlak?buku_kerja=3`,
      text: "Penilaian Akhlak",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/analisis-hasil-ulangan?buku_kerja=3`,
      text: "Analisis Hasil Ulangan",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/prog-pelaks-perbaikan-pengayaan?buku_kerja=3`,
      text: "Prog. Pelaksanaan Perbaikan dan Pengayaan",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/daftar-buku-pegangan-guru?buku_kerja=3`,
      text: "Daftar Buku Pegangan Guru",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/jadwal-mengajar?buku_kerja=3`,
      text: "Jadwal Mengajar",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/daya-serap-siswa?buku_kerja=3`,
      text: "Daya Serap Siswa",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/kumpulan-kisi-soal?buku_kerja=3`,
      text: "Kumpulan Kisi Soal",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/kumpulan-soal?buku_kerja=3`,
      text: "Kumpulan Soal",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/analisis-butir-soal?buku_kerja=3`,
      text: "Analisis Butir Soal",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/perbaikan-soal?buku_kerja=3`,
      text: "Perbaikan Soal",
      isVisible: buku_kerja?.includes(3),
    },
    {
      url: `${ssURL}/buku-kerja-guru/evaluasi-diri-kerja-guru?buku_kerja=4`,
      text: "Daftar Evaluasi Diri Kerja Guru",
      isVisible: buku_kerja?.includes(4),
    },
    {
      url: `${ssURL}/buku-kerja-guru/program-tindak-lanjut-kerja-guru?buku_kerja=4`,
      text: "Program Tindak Lanjut Kerja Guru",
      isVisible: buku_kerja?.includes(4),
    },
  ];

  const menus = listAllMenu.filter(({ isVisible }) => isVisible);

  const listMenuCN = (url) => {
    return ctl(`
      nav-link color-dark fw-bold
      fs-18-ss d-flex align-items-center
      px-4
      ${url?.includes(pathname) && "active"}
    `);
  };

  return (
    <div className="mb-4 mb-lg-0">
      <ul className="nav side-nav-ss bg-white rounded-ss px-3 py-4 flex-column">
        <h5 className="color-dark fw-bold ms-4">Instrumen</h5>
        {menus.map((menu, index) => (
          <li
            className="nav-item w-100"
            key={`${index}-${new Date().getTime()}`}
            style={{ marginTop: index != 0 ? "8px" : "0px" }}
          >
            <Link href={menu.url}>
              <a className={listMenuCN(menu.url)} aria-current="page">
                <img
                  src={
                    menu?.url?.includes(pathname)
                      ? "/img/icon-buku-kerja-guru-blue.svg"
                      : "/img/icon-buku-kerja-gray.svg"
                  }
                  className="me-2"
                />
                <Tooltip title={menu.text}>
                  <p className="text-truncate mb-0">{menu.text}</p>
                </Tooltip>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarBukuKerjaGuruDetail;
