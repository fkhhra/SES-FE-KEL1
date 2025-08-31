import { DatePicker } from "antd";
import HeaderInventaris from "components/Keuangan/Inventaris/HeaderInventaris";
import React from "react";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { baseURL, downloadURL, ssURL } from "../../../../client/clientAxios";
import { useEffect, useRef, useState } from "react";
import { FaCloudDownloadAlt, FaFilter } from "react-icons/fa";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import ListAsetAktif from "components/Keuangan/Inventaris/ListAsetAktif";
import NewModalTambahTransaksi from "components/Shared/NewModalTambahTransaksi/NewModaTambahTransaksi";
import { getInventarisAktif } from "client/InventarisClient";
import { deleteMutasiV2, downloadMutasiAset } from "client/MutasiClient";
import swal from "sweetalert";
import toast from "react-hot-toast";
import router from "next/router";
import { momentPackage } from "utilities/HelperUtils";
import { useDebounce } from "use-debounce";
const { RangePicker } = DatePicker;

const index = ({
  rencanaId,
  tanggalAwal,
  tanggalAkhir,
  akun: akunId,
  search,
  page,
}) => {
  const [collapseOpen, setcollapseOpen] = useState(false);
  const [rencana, setRencana] = useState([]);
  const [akun, setAkun] = useState([]);
  const [transaksi, setTransaksi] = useState({});
  const [editData, setEditData] = useState(null);

  const [searchNama, setSearchNama] = useState(search);
  const [debounceSearch] = useDebounce(searchNama, 400);

  const _getInventarisAktif = async () => {
    const { data, error } = await getInventarisAktif({
      sampaiTanggal: tanggalAkhir,
      dariTanggal: tanggalAwal,
      search: search,
      tipeAkun: akunId,
      page,
    });

    if (data) {
      setRencana(data?.rencana);
      setAkun(data?.akun);
      setTransaksi(data?.transaksi);
    }
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
          _getInventarisAktif();
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
    _getInventarisAktif();
  }, [tanggalAkhir, tanggalAwal, search, akunId, page]);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);

  return (
    <Layout
      isFluid={true}
      modalWrapper={
        <>
          <NewModalTambahTransaksi
            editData={editData}
            akun={akun}
            _getMutasi={_getInventarisAktif}
            rencana={rencana}
          />
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
                    Daftar Inventaris
                  </h4>
                </div>
                <hr className="my-4" />

                <div className="d-flex jusitfy-content-start align-items-lg-center flex-lg-row flex-column mb-4 mx-4">
                  <input
                    type="text"
                    className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 mb-lg-0 mb-3 lg-w-100"
                    style={{ height: "42px" }}
                    onChange={(e) => setSearchNama(e.target.value)}
                    value={searchNama}
                    // id="exampleFormControlInput1"
                    placeholder="Cari Inventaris"
                    data-joyride="cari-inventaris"
                  />
                  <button
                    className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white fw-bold me-lg-3 mb-lg-0 mb-3 color-secondary ${
                      collapseOpen && "active"
                    }`}
                    data-bs-toggle="collapse"
                    href="#collapseExample"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    onClick={() => setcollapseOpen(!collapseOpen)}
                    data-joyride="filter-perpus-collapse"
                  >
                    <FaFilter className="me-3 fs-14-ss color-secondary" />
                    Filter
                  </button>
                  <button
                    className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss`}
                    onClick={_rekap}
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Inventaris
                  </button>
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
                    <div className="col-md-6 mb-4">
                      <div className="select-akun-keuangan">
                        <SelectShared
                          options={akun?.map((d) => {
                            return {
                              label: `${d?.nama}`,
                              value: d?.id,
                            };
                          })}
                          value={parseInt(akunId)}
                          handleChangeSelect={(e) => {
                            router.push({
                              pathname: router.pathname,
                              query: {
                                ...router.query,
                                akun: e?.value,
                              },
                            });
                          }}
                          isClearable
                          className="w-100"
                          isDropdownMutasi
                          placeholder="Semua Akun"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {tanggalAwal && tanggalAkhir && rencanaId ? ( */}
              <div className="card-body p-0 pb-4">
                {transaksi?.data?.length ? (
                  <table className="table-ss table-mutasi">
                    <thead>
                      <tr>
                        <th>Tanggal Transaksi</th>
                        <th>Tanggal Perubahan</th>
                        <th style={{ width: "30%" }}>Nama</th>
                        <th>Nama Akun</th>
                        <th>Debit</th>
                        <th>Kredit</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {listMutasi?.data?.map((d) => { */}
                      {/* return ( */}
                      {transaksi?.data?.map((d) => {
                        return (
                          <ListAsetAktif
                            data={d}
                            setEditData={setEditData}
                            _deleteMutasi={_deleteMutasi}
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
                ) : (
                  <div className="card-body p-4">
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
                        <p className="fw-bold">
                          Atur{" "}
                          <a href="#peride-laporan" className="color-primary">
                            barang di menu Sarpras
                          </a>{" "}
                          di atas untuk mendapatkan data
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  query: { akun, tanggalAwal, tanggalAkhir, page, search },
}) {
  return {
    props: {
      akun: akun || null,
      tanggalAwal: tanggalAwal || null,
      tanggalAkhir: tanggalAkhir || null,
      search: search || null,
      page: page || null,
    },
  };
}

export default index;
