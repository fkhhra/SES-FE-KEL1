import { ssURL } from "client/clientAxios";
import HeaderBukuKerjaGuru from "components/BukuKerjaGuru/HeaderBukuKerjaGuru";
import HeaderLaporanNeraca from "components/Keuangan/HeaderLaporanNeraca";
import LayoutPengawasanBukuKerjaGuru from "components/Layout/LayoutPengawasanBukuKerjaGuru";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { getBukuKerjaDinas } from "client/BukuKerjaGuruClient";
import ModalUnduhInstrumen from "components/BukuKerjaGuru/ModalUnduhInstrumen";
import { showModal } from "utilities/ModalUtils";
import { getPreviewURL } from "utilities/FileViewer";
import Skeleton from "react-loading-skeleton";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ user_id }) => {
  const [bukuKerjaData, setBukuKerjaData] = useState(null);
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    guru: listGuru,
    alokasi,
    ikrar,
    jurnal,
    kalender,
    kodeEtik,
    pembiasaan,
    psemester,
    ptahunan,
    tataTertib,
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
      id: "kode etik guru",
      instrumen: "Kode Etik Guru",
      files: kodeEtik
    },
    {
      id: "ikrar guru",
      instrumen: "Ikrar Guru",
      files: ikrar
    },
    {
      id: "tata tertib guru",
      instrumen: "Tata Tertib Guru",
      files: tataTertib
    },
    {
      id: "pembiasaan guru",
      instrumen: "Pembiasaan Guru",
      files: pembiasaan
    },
    {
      id: "kalender pendidikan",
      instrumen: "Kalender Pendidikan",
      files: kalender
    },
    {
      id: "alokasi waktu",
      instrumen: "Alokasi Waktu",
      files: alokasi
    },
    {
      id: "program tahunan",
      instrumen: "Program Tahunan",
      files: ptahunan
    },
    {
      id: "program semester",
      instrumen: "Program Semester",
      files: psemester
    },
    {
      id: "jurnal agenda guru",
      instrumen: "Jurnal Agenda Guru",
      files: jurnal
    },
  ];

  const filteredTableData = tableData.filter(data => data.id.indexOf(search.toLowerCase()) > -1);

  const _getBukuKerjaDinas = async () => {
    const { data } = await getBukuKerjaDinas({
      tipe: "bukuKerja2",
      userId: user_id,
    });
    if (data) {
      setBukuKerjaData(data);
    }
  };

  const onClickDetail = (data) => {
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
                    <span className={`${total == 9 ? "label-light-success-ss" : "label-light-danger-ss"} label-ss fs-12-ss fw-semibold rounded-pill ms-4`}>
                      {`${total}/9 Instrumen`}
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
                            <td data-th="Jumlah">{`${data?.files?.length} File`}</td>
                            <td data-th="Detail">
                              <a
                                disabled={(data?.files?.length == 0 || data?.files?.length == undefined)}
                                className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none"
                                onClick={() => data?.files?.length > 0 && onClickDetail(data?.files)}
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
        <ModalUnduhInstrumen modalData={modalData} />
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
