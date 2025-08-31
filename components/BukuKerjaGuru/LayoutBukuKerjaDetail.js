import { getBukuKerjaDetail } from "client/BukuKerjaGuruClient";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaPlus } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { showModal } from "utilities/ModalUtils";
import BukuKerjaModal from "./BukuKerjaModal";
import SidebarBukuKerjaGuruDetail from "./SidebarBukuKerjaGuruDetail";

const LayoutBukuKerjaDetail = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;
  const { buku_kerja } = router.query;

  const {
    bukuKerjaDetailData,
    setBukuKerjaDetailData,
    refetchData,
    additionalParams,
  } = useBukuKerjaDetail();
  const { setEditModal } = useEditModal();

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);

  const getTipe = () => {
    if (pathname?.includes("skl")) {
      return "skl";
    }
    if (pathname?.includes("silabus")) {
      return "silabus";
    }
    if (pathname?.includes("kkm")) {
      return "kkm";
    }
    if (pathname?.includes("evaluasi-diri-kerja-guru")) {
      return "daftar evaluasi";
    }
    if (pathname?.includes("program-tindak-lanjut-kerja-guru")) {
      return "tindak lanjut";
    }
    if (pathname?.includes("kode-etik")) {
      return "kode etik";
    }
    if (pathname?.includes("ikrar-guru")) {
      return "ikrar";
    }
    if (pathname?.includes("tata-tertib-guru")) {
      return "tata tertib";
    }
    if (pathname?.includes("pembiasaan-guru")) {
      return "pembiasaan";
    }
    if (pathname?.includes("kalender-pendidikan")) {
      return "kalender";
    }
    if (pathname?.includes("alokasi-waktu")) {
      return "alokasi";
    }
    if (pathname?.includes("program-tahunan")) {
      return "ptahunan";
    }
    if (pathname?.includes("program-semester")) {
      return "psemester";
    }
    if (pathname?.includes("jurnal-agenda-guru")) {
      return "jurnal";
    }
    if (pathname?.includes("analisis-hasil-ulangan")) {
      return "hasil ulangan";
    }
    if (pathname?.includes("daftar-buku-pegangan-guru")) {
      return "buku pegangan";
    }
    if (pathname?.includes("daya-serap-siswa")) {
      return "daya serap";
    }
    if (pathname?.includes("analisis-butir-soal")) {
      return "butir soal";
    }
    if (pathname?.includes("perbaikan-soal")) {
      return "perbaikan soal";
    }
    if (pathname?.includes("kumpulan-soal")) {
      return "soal";
    }
    if (pathname?.includes("kumpulan-kisi-soal")) {
      return "kisi soal";
    }
    if (pathname?.includes("daftar-kehadiran")) {
      return "kehadiran";
    }
    if (pathname?.includes("daftar-nilai")) {
      return "nilai";
    }
    if (pathname?.includes("penilaian-akhlak")) {
      return "akhlak";
    }
    if (pathname?.includes("prog-pelaks-perbaikan-pengayaan")) {
      return "program perbaikan";
    }
    if (pathname?.includes("jadwal-mengajar")) {
      return "jadwal";
    }
    return "";
  };

  const _getBukuKerjaDetail = async () => {
    let params = {
      tipe: getTipe(),
      ...(search && { search }),
      ...(pathname?.includes("jadwal-mengajar") && {
        kodeHari: new Date().getDay(),
      }),
      ...additionalParams,
    };

    const { data } = await getBukuKerjaDetail(params);
    if (data) {
      setBukuKerjaDetailData(data);
    }
  };

  const showModalBukuKerja = () => {
    let modalId = "";

    if (pathname?.includes("skl-ki-kd")) {
      modalId = "modalTambahSklKiKd";
    } else if (pathname?.includes("silabus")) {
      modalId = "modalTambahSilabus";
    } else if (pathname?.includes("kkm")) {
      modalId = "modalTambahKKM";
    } else if (pathname?.includes("evaluasi-diri-kerja-guru")) {
      modalId = "modalEvaluasiDiriKerjaGuru";
    } else if (pathname?.includes("program-tindak-lanjut-kerja-guru")) {
      modalId = "modalTindakLanjutKerjaGuru";
    } else if (pathname?.includes("kode-etik")) {
      modalId = "modalTambahKodeEtikGuru";
    } else if (pathname?.includes("ikrar-guru")) {
      modalId = "modalTambahIkrarGuru";
    } else if (pathname?.includes("tata-tertib-guru")) {
      modalId = "modalTambahTataTertibGuru";
    } else if (pathname?.includes("pembiasaan-guru")) {
      modalId = "modalTambahPembiasaanGuru";
    } else if (pathname?.includes("kalender-pendidikan")) {
      modalId = "modalTambahKalenderPendidikan";
    } else if (pathname?.includes("alokasi-waktu")) {
      modalId = "modalTambahAlokasiWaktu";
    } else if (pathname?.includes("program-tahunan")) {
      modalId = "modalTambahProgramTahunan";
    } else if (pathname?.includes("program-semester")) {
      modalId = "modalTambahProgramSemester";
    } else if (pathname?.includes("jurnal-agenda-guru")) {
      modalId = "modalTambahJurnalAgendaGuru";
    } else if (pathname?.includes("analisis-hasil-ulangan")) {
      modalId = "modalTambahAnalisisHasilUlangan";
    } else if (pathname?.includes("daftar-buku-pegangan-guru")) {
      modalId = "modalTambahBukuPeganganGuru";
    } else if (pathname?.includes("daya-serap-siswa")) {
      modalId = "modalTambahDayaSerapSiswa";
    } else if (pathname?.includes("analisis-butir-soal")) {
      modalId = "modalTambahAnalisisButirSoal";
    } else if (pathname?.includes("perbaikan-soal")) {
      modalId = "modalTambahPerbaikanSoal";
    } else if (pathname?.includes("kumpulan-soal")) {
      modalId = "modalTambahKumpulanSoal";
    } else if (pathname?.includes("kumpulan-kisi-soal")) {
      modalId = "modalTambahKumpulanKisiSoal";
    } else if (pathname?.includes("penilaian-akhlak")) {
      modalId = "modalTambahPenilaianAkhlak";
    } else if (pathname?.includes("prog-pelaks-perbaikan-pengayaan")) {
      modalId = "modalTambahProgramPelaksanaanDanPerbaikan";
    } else if (pathname?.includes("rpp")) {
      modalId = "modalTambahRPP";
    }

    setEditModal(modalId, null);
    showModal(modalId);
  };

  useEffect(() => {
    if (!pathname?.includes("rpp")) {
      _getBukuKerjaDetail();
    }
  }, [refetchData, debounceSearch]);

  const showButtonTambah =
    !pathname?.includes("daftar-kehadiran") &&
    !pathname?.includes("daftar-nilai") &&
    !pathname?.includes("jadwal-mengajar");

  return (
    <Layout>
      <AnimatePage>
        <Link href={`${ssURL}/buku-kerja-guru`}>
          <a className="text-decoration-none fw-bolder color-primary">
            <FaChevronLeft />
            <span className="ms-2">Kembali</span>
          </a>
        </Link>

        <div className="card-ss py-4 px-4 mt-4">
          <div className="row">
            <div className="col-sm-12 col-lg-6">
              <h2 className="color-dark fw-black mb-0">
                {`Buku Kerja ${buku_kerja}`}
              </h2>
            </div>
            <div className="col-sm-12 col-lg-6 mt-4 mt-lg-0 d-flex flex-sm-row flex-column">
              <div className="flex-grow-1 me-sm-3 mb-sm-0 mb-3 d-flex flex-column">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100 sm-w-100"
                  id="exampleFormControlInput1"
                  placeholder="Cari"
                  onChange={(e) => setSearch(e.target.value)}
                  search={search}
                  // style={{ height: "42px", width: "100%" }}
                />
              </div>
              {showButtonTambah && (
                <button
                  className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold fs-18-ss"
                  onClick={showModalBukuKerja}
                >
                  <FaPlus className="me-2" />
                  Tambah
                </button>
              )}
            </div>
          </div>
          {/* <div className="d-flex justify-content-between flex-column flex-sm-column flex-md-row">
            
            <div className="d-flex align-items-center flex-column flex-sm-column flex-md-row">
              <input
                type="text"
                className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-3"
                id="exampleFormControlInput1"
                placeholder="Cari Nama Siswa"
                // style={{ height: "42px", width: "100%" }}
              />
              { showButtonTambah &&
                <button className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold fs-18-ss" onClick={showModalBukuKerja}>
                  <FaPlus className="me-2" />
                  Tambah
                </button>
              }
            </div>
          </div> */}
        </div>

        <hr className="mt-4 mb-4" />
        <div className="row">
          <div className="col-md-3">
            <SidebarBukuKerjaGuruDetail />
          </div>
          <div className="col-md-9">{children}</div>
        </div>
        <BukuKerjaModal
          bukuKerjaDetailData={bukuKerjaDetailData}
          _getBukuKerjaDetail={_getBukuKerjaDetail}
        />
      </AnimatePage>
    </Layout>
  );
};

export default LayoutBukuKerjaDetail;
