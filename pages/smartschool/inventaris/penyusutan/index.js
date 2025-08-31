import { DatePicker } from "antd";
import HeaderInventaris from "components/Keuangan/Inventaris/HeaderInventaris";
import React from "react";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { baseURL, downloadURL, ssURL } from "../../../../client/clientAxios";
import { useEffect, useRef, useState } from "react";
import { FaCloudDownloadAlt, FaFilter, FaPlus } from "react-icons/fa";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import ListAsetAktif from "components/Keuangan/Inventaris/ListAsetAktif";
import NewModalTambahTransaksi from "components/Shared/NewModalTambahTransaksi/NewModaTambahTransaksi";
import {
  deleteInventarisPenyusutan,
  getInventarisPenyusutan,
} from "client/InventarisClient";
import { deleteMutasiV2, downloadMutasiAset } from "client/MutasiClient";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { momentPackage } from "utilities/HelperUtils";
import { useDebounce } from "use-debounce";
import ListPenyusutan from "components/Keuangan/Inventaris/ListPenyusutan";
import ModalPenyusutan from "components/Keuangan/Inventaris/ModalPenyusutan";
const { RangePicker } = DatePicker;

const index = ({ rencanaId, akun: akunId, search, page }) => {
  const [collapseOpen, setcollapseOpen] = useState(false);
  // const [rencana, setRencana] = useState([]);
  // const [akun, setAkun] = useState([]);
  const router = useRouter();
  const { tanggalAwal, tanggalAkhir } = router.query;
  // const [transaksi, setTransaksi] = useState({});
  const [penyusutan, setPenyusutan] = useState([]);
  const [editData, setEditData] = useState(null);
  const [date, setDate] = useState([]);

  const [searchNama, setSearchNama] = useState(search);
  const [debounceSearch] = useDebounce(searchNama, 400);

  const firstRender = useRef(true);

  const _getInventarisPenyusutan = async () => {
    const { data, error } = await getInventarisPenyusutan({
      tanggalAkhir,
      tanggalAwal,
      search: debounceSearch,
      // tipeAkun: akunId,
      // page,
    });

    if (data) {
      setPenyusutan(data);
    }
  };

  const handleChangeDate = (date) => {
    setDate(date);
  };

  const _deletePenyusutan = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteInventarisPenyusutan(id);
        if (data) {
          toast.success(data?.message);
          _getInventarisPenyusutan();
        }
      }
    });
  };

  const handleClickEdit = (editData) => {
    setEditData(editData);
  };

  const _deleteMutasi = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteMutasiV2(id);
        if (data) {
          toast.success(data?.message);
          _getInventarisPenyusutan();
        }
      }
    });
  };

  const _rekap = async () => {
    const payload = {
      ...router.query,
      search: searchNama,
      tanggalAkhir: tanggalAkhir,
      tanggalAwal: tanggalAwal,
    };
    document.getElementById("downloadIframe").src = ``;
    const { data, error } = await downloadMutasiAset(payload);

    if (data) {
      setDownloaded(true);
      document.getElementById("downloadIframe").src = `${downloadURL}${data}`;
    } else {
      toast.error("Silahkan Coba beberapa saat lagi");
    }
  };

  useEffect(() => {
    _getInventarisPenyusutan();
  }, [debounceSearch, tanggalAwal, tanggalAkhir]);
  console.log(date);

  const setFilter = () => {
    const queryParams = {
      search: searchNama,
      tanggalAwal: date?.[0]
        ? momentPackage(date?.[0]).format("YYYY-MM-DD HH:mm:ss")
        : "",
      tanggalAkhir: date?.[1]
        ? momentPackage(date?.[1]).format("YYYY-MM-DD HH:mm:ss")
        : "",
    };

    // delete queryParams if value is null
    Object.keys(queryParams)?.map((query) => {
      !queryParams[query] && delete queryParams[query];
    });

    router.push({
      pathname: router.pathname,
      query: queryParams,
    });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      setFilter();
    }
  }, [date]);
  console.log(editData);

  return (
    <Layout
      isFluid={true}
      modalWrapper={
        <>
          {/* <NewModalTambahTransaksi
            editData={editData}
            akun={akun}
            _getMutasi={_getInventarisPenyusutan}
            rencana={rencana}
          /> */}
          <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
        </>
      }
    >
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <HeaderInventaris ssURL={ssURL} />
          </div>
        </div>
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Daftar Penyusutan Aset
                  </h4>
                  <button
                    type="button"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPenyusutanAset"
                    onClick={() => setEditData(null)}
                    data-joyride="btn-tambah-penyusutan"
                  >
                    <FaPlus /> Tambah
                  </button>
                </div>
                <hr className="my-4" />

                <div className="row d-flex jusitfy-content-start align-items-lg-center flex-lg-row flex-column mb-4 mx-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 mb-lg-0 mb-3 lg-w-100 w-100"
                      style={{ height: "42px" }}
                      onChange={(e) => setSearchNama(e.target.value)}
                      value={searchNama}
                      // id="exampleFormControlInput1"
                      placeholder="Cari Aset"
                      data-joyride="cari-aset"
                    />
                  </div>
                  <div className="col-md-6">
                    <RangePicker
                      className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi"
                      style={{
                        height: "42px",
                        paddingLeft: "14px",
                        paddingRight: "14px",
                      }}
                      placeholder={["Tanggal Mulai", "Tanggal Selesai"]}
                      onChange={(date) => handleChangeDate(date)}
                      value={[
                        momentPackage(tanggalAwal),
                        momentPackage(tanggalAkhir),
                      ]}
                      // value={
                      //   tanggal?.length > 0
                      //     ? [momentPackage(tanggal[0]), momentPackage(tanggal[1])]
                      //     : ""
                      // }
                      // onChange={(date) =>
                      //   date?.length > 0
                      //     ? setTanggal([date[0], date[1]])
                      //     : setTanggal([])
                      // }
                    />
                  </div>
                </div>
                {/* <div className="col-md-6 mb-4"> */}

                {/* </div> */}

                <div className="collapse mx-4" id="collapseExample">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <RangePicker
                        onChange={(date, dateString) =>
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              tanggalAwal: dateString[0],
                              tanggalAkhir: dateString[1],
                            },
                          })
                        }
                        placeholder={["Tanggal Awal", "Tanggal Akhir"]}
                        className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                        autoComplete="off"
                        style={{
                          height: "42px",
                          paddingLeft: "14px",
                          paddingRight: "14px",
                        }}
                        value={[
                          tanggalAwal ? momentPackage(tanggalAwal) : "",
                          tanggalAkhir ? momentPackage(tanggalAkhir) : "",
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* {tanggalAwal && tanggalAkhir && rencanaId ? ( */}
              <div className="card-body p-0 pb-4">
                {/* {transaksi?.data?.length ? ( */}
                <table className="table-ss table-mutasi">
                  <thead>
                    <tr>
                      <th>Tanggal Pembelian</th>
                      <th>Nama Transaksi</th>
                      <th className="text-center">Nilai Perolehan</th>
                      <th className="text-center">Masa Pakai</th>
                      <th className="text-center">Akumulasi Penyusutan</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {listMutasi?.data?.map((d) => { */}
                    {/* return ( */}
                    {penyusutan?.data?.map((d) => {
                      return (
                        <ListPenyusutan
                          data={d}
                          setEditData={setEditData}
                          _deletePenyusutan={_deletePenyusutan}
                          handleClickEdit={handleClickEdit}
                        />
                      );
                    })}

                    {/* ); */}
                    {/* })} */}
                    {/* {listMutasi?.data?.map((mutasi, idx) => (
                            <tr>
                              <td className="border-start-0">
                                {momentPackage(mutasi?.waktuDibuat).format(
                                  "DD/MM/YY"
                                )}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center flex-column">
                                  <p className="mb-1 color-dark">
                                    {mutasi?.nama}
                                  </p>
                                  <p className="mb-0 color-secondary fs-ss-14">
                                    {mutasi?.kategori}
                                  </p>
                                </div>
                              </td>
                              <td>
                                {rekeningSekolah?.find(
                                  (d) => d?.id == mutasi?.mRekSekolahId
                                )?.jenis || "Dana Sekolah"}
                              </td>
                              <td>
                                <span
                                  className={`color-${
                                    mutasi?.tipe == "kredit"
                                      ? "success"
                                      : "danger"
                                  } fw-bold`}
                                >
                                  {mutasi?.tipe == "kredit" ? "+" : "-"}
                                  {currencyFormatter(mutasi?.nominal)}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row">
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalTambahTransaksi"
                                    onClick={() => onClickEdit(mutasi)}
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => _deleteMutasi(mutasi?.id)}
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))} */}
                  </tbody>
                </table>
                {/* ) : ( */}
                {/* <div className="card-body p-4">
                    <div className="row justify-content-center">
                      <div className="col-md-6 col-sm-8 col-10 text-center">
                        <img
                          src="/img/empty-state-data.svg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-md-12 text-center">
                        <h4 className="color-dark fw-black mt-4 mb-2">
                          Tidak Ada Data
                        </h4>
                      </div>
                    </div>
                  </div> */}
                {/* )} */}
                {/* <div className="my-4 text-center">
<Pagination
total={listMutasi?.total}
showSizeChanger={false}
current={parseInt(page) || 1}
pageSize={25}
onChange={(e) => setPage(e)}
/>
</div> */}
              </div>
              {/* ) : ( */}
              {/* )} */}
            </div>
          </div>
        </div>
        <ModalPenyusutan
          _getInventarisPenyusutan={_getInventarisPenyusutan}
          akun={penyusutan?.akun}
          transaksi={penyusutan?.transaksi}
          editData={editData}
          setEditData={setEditData}
          handleClickEdit={handleClickEdit}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { akun, page, search } }) {
  return {
    props: {
      akun: akun || null,
      search: search || null,
      page: page || null,
    },
  };
}

export default index;
