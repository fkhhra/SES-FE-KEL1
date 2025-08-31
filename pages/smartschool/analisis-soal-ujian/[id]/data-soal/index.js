import { DatePicker, Tooltip } from "antd";
import { downloadURL } from "client/clientAxios";
import { downloadNeraca } from "client/MutasiClient";
import { getNeraca } from "client/NeracaClient";
import HeaderLaporanNeraca from "components/Keuangan/HeaderLaporanNeraca";
import ListAktivaNeraca from "components/Keuangan/ListAktivaNeraca";
import ListPasivaNeraca from "components/Keuangan/ListPasivaNeraca";
import Layout from "components/Layout/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaFilter, FaChevronDown } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
import {
  hitungKategoriNeraca,
  neracaHitungLevelAkun,
} from "utilities/KeuanganUtils";
import { baseURL, ssURL } from "client/clientAxios";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import HeaderAnalisisSoal from "components/Ujian/HeaderAnalisisSoal";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import {
  downloadAnalisisSoal,
  getAnalisisSoalDetail,
} from "client/AnalisisSoalClient";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ id, m_ujian_id, tipe_soal, search, kesukaran }) => {
  const [neraca, setNeraca] = useState([]);
  const [searchSoal, setSearchSoal] = useState("");
  const [akun, setAkun] = useState([]);
  const [analisisData, setAnalisisData] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [levelAkun, setLevelAkun] = useState([]);
  const [debounceSearch] = useDebounce(searchSoal, 300);

  // console.log(id);

  const {
    dataSoal,
    bentukSoal,
    jumlahSoalPg,
    jumlahSoalEsai,
    jumlahSoalPgKompleks,
    jumlahSoalUraian,
    jumlahSoalMenjodohkan,
    jumlahBankSoal,
    template = [],
    materi,
    bankSoalData = [],
  } = analisisData;

  const _getAnalisisData = async () => {
    const { data } = await getAnalisisSoalDetail(id, {
      m_ujian_id,
      tipe_soal,
      search: searchSoal,
      kesukaran,
    });

    if (data) {
      setAnalisisData(data);
      // console.log(kategori);
    }
  };
  useEffect(() => {
    _getAnalisisData();
  }, [id, m_ujian_id, tipe_soal, debounceSearch, kesukaran]);

  //   useEffect(() => {
  //     router.push({
  //       pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
  //       query: {
  //         ...router.query,
  //         search: debounceSearch,
  //       },
  //     });
  //   }, [debounceSearch]);

  const [, setKesukaran] = useState();
  const changeKesukaran = (value) => {
    setKesukaran(value);
    router.push({
      pathname: router?.pathname,
      query: { ...router?.query, kesukaran: value.value },
    });
  };
  const [, setUjian] = useState();
  const changeUjian = (value) => {
    setUjian(value);
    router.push({
      pathname: router?.pathname,
      query: { ...router?.query, m_ujian_id: value.value },
    });
  };
  const [, setTipeSoal] = useState();
  const changeTipeSoal = (value) => {
    setTipeSoal(value);
    router.push({
      pathname: router?.pathname,
      query: { ...router?.query, tipe_soal: value.value },
    });
  };
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const [showTable, setShowTable] = useState([]);

  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [collapseOpen, setcollapseOpen] = useState([]);

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;

  const listDropdownValue = [
    {
      label: "Semua",
      value: "",
    },
    {
      label: "Pilihan Ganda",
      value: "Pilihan Ganda",
    },
    {
      label: "Pilihan Ganda Kompleks",
      value: "Pilihan Ganda Kompleks",
    },
    {
      label: "Isian",
      value: "Isian",
    },
    {
      label: "Uraian",
      value: "Uraian",
    },
    {
      label: "Menjodohkan",
      value: "Menjodohkan",
    },
  ];

  const _downloadAnalisisSoal = async () => {
    const { data, error } = await downloadAnalisisSoal(id);

    window.open(`${downloadURL}${data}`, "_blank");
  };
  return (
    <Layout>
      <AnimatePage>
        <HeaderAnalisisSoal ssURL={ssURL} id={id} materi={materi} />
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-body py-4 px-0 pb-0">
                <div className="d-flex jusitfy-content-start align-items-lg-center flex-lg-row flex-column mb-4 mx-4">
                  <input
                    type="text"
                    className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 mb-lg-0 mb-3 lg-w-100"
                    style={{ height: "42px" }}
                    id="exampleFormControlInput1"
                    placeholder="Cari soal"
                    value={search}
                    onChange={(e) => setSearchSoal(e.target.value)}
                  />
                  <button
                    className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white fw-bold me-lg-3 mb-lg-0 mb-3 color-secondary ${
                      !collapseOpen && "active"
                    }`}
                    data-bs-toggle="collapse"
                    href="#collapseExample0001"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample0001"
                    onClick={() => setcollapseOpen(!collapseOpen)}
                    data-joyride="filter-perpus-collapse"
                  >
                    <FaFilter className="me-3 fs-14-ss color-secondary" />
                    Filter
                  </button>
                  <button
                    onClick={() => _downloadAnalisisSoal()}
                    className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss`}
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Unduh Soal
                  </button>
                </div>
                <div className="collapse mx-4" id="collapseExample0001">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <div className="select-akun-keuangan">
                        <SelectShared
                          name="selectTa"
                          placeholder="Pilih bank soal"
                          handleChangeSelect={changeUjian}
                          value={m_ujian_id}
                          options={[
                            { label: "Semua", value: "" },
                            ...bankSoalData?.map((d) => {
                              return {
                                label: `${d?.nama}`,
                                value: d?.id,
                              };
                            }),
                          ]}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="select-akun-keuangan">
                        <SelectShared
                          name="selectTa"
                          placeholder="Pilih tingkat kesukaran"
                          handleChangeSelect={changeKesukaran}
                          value={kesukaran}
                          options={[
                            { label: "Semua", value: "" },
                            ...template?.map((d) => {
                              return {
                                label: `${d?.judul}`,
                                value: d?.judul,
                              };
                            }),
                          ]}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="select-akun-keuangan">
                        <SelectShared
                          name="selectTa"
                          placeholder="Pilih tipe soal"
                          handleChangeSelect={changeTipeSoal}
                          value={tipe_soal}
                          options={bentukSoal}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-lg-0 mb-3">
                    Daftar Soal
                  </h4>
                </div>
                <div className="row g-4">
                  <div className="col-lg-9">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between mt-4"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">PG</h6>
                        <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                          {jumlahSoalPg} Soal
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">Uraian</h6>
                        <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                          {jumlahSoalUraian} Soal
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">Isian</h6>
                        <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                          {jumlahSoalEsai} Soal
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">
                          PG. Kompleks
                        </h6>
                        <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                          {jumlahSoalPgKompleks} Soal
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">
                          Menjodohkan
                        </h6>
                        <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                          {jumlahSoalMenjodohkan} Soal
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between mt-4"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">
                          Jumlah Bank Soal
                        </h6>
                        <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                          {jumlahBankSoal} Soal
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pb-4 p-0">
                <div className="table-responsive">
                  <table className="table-ss table-analisis-soal-ujian">
                    <thead>
                      <tr>
                        <th style={{ width: "8%" }} className="pe-1">
                          No
                        </th>
                        <th style={{ width: "21%" }} className="text-truncate">
                          Soal
                        </th>
                        <th style={{ width: "21%" }} className="text-truncate">
                          Bank Soal
                        </th>
                        <th style={{ width: "21%" }} className="text-truncate">
                          Tipe Soal
                        </th>
                        <th style={{ width: "21%" }} className="text-md-center">
                          Kesukaran
                        </th>
                        <th style={{ width: "8%" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataSoal?.map((data, idx) => (
                        <>
                          <tr
                            key={idx}
                            data-bs-toggle="collapse"
                            href={`#collapseExample${idx}`}
                            role="button"
                            aria-expanded="false"
                            aria-controls={`collapseExample${idx}`}
                            className={`tr-collapse-button ${
                              showTable[idx] ? "show" : ""
                            }`}
                            onClick={() => {
                              if (!showTable[idx]) {
                                setShowTable({ ...showTable, [idx]: true });
                              } else {
                                setShowTable({ ...showTable, [idx]: false });
                              }
                            }}
                          >
                            <td data-th="No" className="pe-1">
                              {idx + 1}
                            </td>
                            <td className="text-truncate" data-th="Soal">
                              <p
                                className="text-truncate mb-0"
                                // dangerouslySetInnerHTML={{ __html: data?.soal }}
                              >
                                <Tooltip
                                  placement="topLeft"
                                  title={`${data.soal.replace(
                                    /(<([^>]+)>)/gi,
                                    ""
                                  )}`}
                                >
                                  {data.soal.replace(/(<([^>]+)>)/gi, "")}
                                </Tooltip>
                              </p>
                            </td>
                            <td className="text-truncate" data-th="Bank Soal">
                              <p className="text-truncate mb-0">
                                <Tooltip
                                  placement="topLeft"
                                  title={`  ${data.namaBank}`}
                                >
                                  {" "}
                                  {data.namaBank}
                                </Tooltip>
                              </p>
                            </td>
                            <td className="text-truncate" data-th="Tipe Soal">
                              <p className="text-truncate mb-0">
                                <Tooltip
                                  placement="topLeft"
                                  title={`  ${data.bentuk}`}
                                >
                                  {" "}
                                  {data.bentuk}
                                </Tooltip>
                              </p>
                            </td>
                            <td data-th="Kesukaran" className="text-md-center">
                              {data.kesukaran ? (
                                <span
                                  className={`label-ss ${data.warna} rounded-pill fs-12-ss`}
                                >
                                  {data.kesukaran}
                                </span>
                              ) : (
                                "Belum Diujikan"
                              )}
                            </td>
                            <td data-th="Tipe Soal">
                              <FaChevronDown
                                className={`${
                                  showTable[idx] ? "rotate-180" : ""
                                }`}
                                style={{ transition: "0.3s" }}
                              />
                            </td>
                          </tr>

                          <tr
                            className="collapse"
                            id={`collapseExample${idx}`}
                            key={idx}
                          >
                            <td
                              data-th="No"
                              className="pe-1 bg-white border border-light-secondary-ss border-start-0 border-top-0 border-end-0"
                            ></td>
                            <td
                              colSpan={5}
                              className="bg-white border border-light-secondary-ss border-start-0 border-top-0 border-end-0"
                            >
                              <div>
                                <div className="d-flex">
                                  <h5 className="fw-bold fs-18-ss color-dark mb-2">
                                    Jumlah Siswa Menjawab Soal :{" "}
                                  </h5>
                                  <p> {data.jumlahSiswa} Siswa</p>
                                </div>

                                <div className="d-flex">
                                  <h5 className="fw-bold fs-18-ss color-dark mb-2">
                                    Jumlah Siswa Menjawab Benar :{" "}
                                  </h5>
                                  <p> {data.jumlahSiswaBenar} Siswa</p>
                                </div>
                                <div className="d-flex">
                                  <h5 className="fw-bold fs-18-ss color-dark mb-2">
                                    Jumlah Siswa Menajawab Salah :{" "}
                                  </h5>
                                  <p> {data.jumlahSiswaSalah} Siswa</p>
                                </div>
                                <h5 className="fw-bold fs-18-ss color-dark mb-2">
                                  Bank Soal
                                </h5>
                                <p className="mb-4">{data.namaBank}</p>
                                <h5 className="fw-bold fs-18-ss color-dark mb-2">
                                  Soal
                                </h5>
                                <p
                                  className="mb-4"
                                  dangerouslySetInnerHTML={{
                                    __html: data?.soal,
                                  }}
                                ></p>
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { m_ujian_id, tipe_soal, search, kesukaran },
}) {
  return {
    props: {
      id: id,
      m_ujian_id: m_ujian_id || null,
      tipe_soal: tipe_soal || null,
      search: search || null,
      kesukaran: kesukaran || null,
    },
  };
}

export default index;
