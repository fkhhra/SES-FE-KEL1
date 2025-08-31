import { ssURL } from "client/clientAxios";
import HeaderBukuKerjaGuru from "components/BukuKerjaGuru/HeaderBukuKerjaGuru";
import HeaderLaporanNeraca from "components/Keuangan/HeaderLaporanNeraca";
import LayoutPengawasanBukuKerjaGuru from "components/Layout/LayoutPengawasanBukuKerjaGuru";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { downloadBukuKerjaDinas, getBukuKerjaDinas } from "client/BukuKerjaGuruClient";
import ModalUnduhInstrumen from "components/BukuKerjaGuru/ModalUnduhInstrumen";
import { getPreviewURL } from "utilities/FileViewer";
import { showModal } from "utilities/ModalUtils";
import Skeleton from "react-loading-skeleton";
import { downloadURL } from "client/clientAxios";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ user_id }) => {
  const [bukuKerjaData, setBukuKerjaData] = useState(null);
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    guru: listGuru,
    akhlak,
    bukuPegangan,
    butirSoal,
    dayaSerap,
    kehadiran,
    kisiSoal,
    nilai,
    perbaikanSoal,
    progPerbaikan,
    soal,
    jadwalMengajarTotal,
    hasilUlangan,
    total=0
  } = bukuKerjaData || {};

  const currentUser = listGuru?.find(guru => guru?.id == parseInt(user_id));
  
  const temp = [];
  const currentUserRppCount = currentUser?.rpp?.filter((e) => {
    if (!temp.includes(e?.tipe)) {
      temp.push(e?.tipe);
      return 1;
    } else {
      return 0;
    }
  })?.length;

  const tableData = [
    {
      id: "daftar hadir",
      instrumen: "Daftar Hadir",
      files: kehadiran,
      type: "daftar-hadir"
    },
    {
      id: "Daftar Nilai",
      instrumen: "Daftar Nilai",
      files: nilai,
      type: "daftar-nilai"
    },
    {
      id: "Penilaian Akhlak",
      instrumen: "Penilaian Akhlak",
      files: akhlak
    },
    {
      id: "Analisis Hasil Ulangan",
      instrumen: "Analisis Hasil Ulangan",
      files: hasilUlangan
    },
    {
      id: "Prog. pelaks Perbaikan & Pengayaan",
      instrumen: "Prog. Pelaks Perbaikan & Pengayaan",
      files: progPerbaikan
    },
    {
      id: "Daftar Buku Pegangan Guru/Siswa",
      instrumen: "Daftar Buku Pegangan Guru/Siswa",
      files: bukuPegangan
    },
    {
      id: "Jadwal Mengajar",
      instrumen: "Jadwal Mengajar",
      totalFiles: jadwalMengajarTotal,
      type: "jadwal-mengajar"
    },
    {
      id: "Daya Serap Siswa",
      instrumen: "Daya Serap Siswa",
      files: dayaSerap
    },
    {
      id: "Kumpulan Kisi Soal",
      instrumen: "Kumpulan Kisi Soal",
      files: kisiSoal
    },
    {
      id: "Kumpulan Kisi Soal",
      instrumen: "Kumpulan Kisi Soal",
      files: soal
    },
    {
      id: "Analisis Butir Soal",
      instrumen: "Analisis Butir Soal",
      files: butirSoal
    },
    {
      id: "Perbaikan Soal",
      instrumen: "Perbaikan Soal",
      files: perbaikanSoal
    },
  ];

  const filteredTableData = tableData.filter(data => data.id.indexOf(search.toLowerCase()) > -1);

  const _getBukuKerjaDinas = async () => {
    const { data } = await getBukuKerjaDinas({
      tipe: "bukuKerja3",
      userId: user_id,
    });
    if (data) {
      setBukuKerjaData(data);
    }
  };

  const onClickDetail = async (data, type) => {
    if (type == "jadwal-mengajar") {
      const { data } = await downloadBukuKerjaDinas({ userId: user_id })
      if (data) {
        window.open(`${downloadURL}${data}`);
        return;
      }
    }

    if (type == "daftar-hadir" || type == "daftar-nilai") {
      setModalData(data);
      setModalType(type);
      showModal("modalUnduhInstrumen");
      return;
    }

    if (data?.length == 0) {
      return;
    }

    if (data?.length == 1) {
      window.open(getPreviewURL(data?.[0]?.lampiran));
      return;
    }

    if (data?.length > 0) {
      showModal("modalUnduhInstrumen");
      setModalData(data);
    }
  }

  const onSearch = (e) => {
    setIsLoading(true);
    setSearch(e.target.value);
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  }

  useEffect(() => {
    _getBukuKerjaDinas();
  }, [user_id]);

  return (
    <LayoutPengawasanBukuKerjaGuru listGuru={listGuru} currentUser={currentUser}>
      <AnimatePage>
        <HeaderBukuKerjaGuru
          ssURL={ssURL}
          listGuru={listGuru}          
          currentUser={currentUser}
          currentUserRppCount={currentUserRppCount}
        />
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="row">
                  <div className="col-md-8 col-12 d-flex align-items-center">
                    <h4 className="fw-extrabold color-dark mb-0">
                      Daftar Instrumen
                    </h4>
                    <span className={`${total == 12 ? "label-light-success-ss" : "label-light-danger-ss"} label-ss fs-12-ss fw-semibold rounded-pill ms-4`}>
                      {`${total}/12 Instrumen`}
                    </span>
                  </div>
                  <div className="col-md-4 d-flex flex-md-row flex-column justify-content-lg-end justify-content-between mt-md-0 mt-3">
                    <div className="flex-grow-1 mb-md-0 mb-3">
                      <input
                        type="text"
                        className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                        style={{ height: "42px", width: "100%" }}
                        id="exampleFormControlInput1"
                        placeholder="Cari instrumen"
                        autoComplete="off"
                        value={search}
                        onChange={onSearch}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" data-joyride="table-rombel">
                  <table className="table-ss">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Instrumen</th>
                        <th>Jumlah</th>
                        <th>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      { isLoading
                        ? <tr>
                            <td data-th="No">
                              <Skeleton />
                            </td>
                              <td data-th="Instrumen">
                              <Skeleton />
                              </td>
                              <td data-th="Jumlah">
                              <Skeleton />
                              </td>
                              <td data-th="Detail">
                                <Skeleton />
                              </td>
                          </tr>
                        : filteredTableData?.length > 0 ? filteredTableData?.map((data, index) =>
                          <tr>
                            <td data-th="No">{index+1}</td>
                            <td data-th="Instrumen">{data?.instrumen}</td>
                            <td data-th="Jumlah">{`${data?.files?.length || data?.totalFiles || 0} File`}</td>
                            <td data-th="Detail">
                              <a
                                className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none"
                                onClick={() => onClickDetail(data?.files, data?.type)}
                              >
                                Lihat
                              </a>
                            </td>
                          </tr>
                        ) : <tr>
                        <td colSpan="4">
                        <div className="text-center">
                          <img src="/img/empty-state-data.svg" alt="" width="200" />
                          <h6 className="color-dark fw-bold mt-3">Tidak ada data</h6>
                        </div>
                      </td>
                      </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalUnduhInstrumen modalType={modalType} modalData={modalData} />
      </AnimatePage>
    </LayoutPengawasanBukuKerjaGuru>
  );
};

export async function getServerSideProps({ query: { user_id } }) {
  return {
    props: {
      user_id: user_id || null,
    },
  };
}

export default index;
