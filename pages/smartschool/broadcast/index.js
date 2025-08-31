import { DatePicker, Pagination } from "antd";
import {
  deleteBroadcast,
  getBroadcast,
  getKepada,
} from "client/BroadcastClient";
import { ssURL } from "client/clientAxios";
import Broadcast from "components/Broadcast/Broadcast";
import ModalBuatBroadcast from "components/Broadcast/ModalBuatBroadcast";
import ModalPenerimaBroadcast from "components/Broadcast/ModalPenerimaBroadcast";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import AsyncSelect from "react-select/async";
import Navbar from "components/Shared/Navbar/Navbar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import router from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaSearch, FaExclamation } from "react-icons/fa";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { momentPackage, queryFormatter } from "utilities/HelperUtils";

const { RangePicker } = DatePicker;

function index({ query }) {
  const { subnav } = query;

  const [editData, setEditData] = useState(null);
  const [broadcastData, setBroadcastData] = useState({});

  const [searchNama, setSearchNama] = useState(query?.search || "");
  const [debounceSearch] = useDebounce(searchNama, 400);

  const _getData = async () => {
    const { data, error } = await getBroadcast({
      jenis: !subnav || subnav == "semua" ? "" : subnav,
      search: query?.search,
      tanggalAwal: query?.tanggalAwal,
      tanggalAkhir: query?.tanggalAkhir,
      kepada: query?.kepada,
      page: query?.page,
    });

    if (data) {
      setBroadcastData(data?.broadcast);
    }
  };

  const handleDelete = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteBroadcast(id);
        if (data) {
          toast.success(data?.message);
          _getData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const _getKepada = async (search) => {
    const { data, error } = await getKepada({ search });

    if (data) {
      const temp = [
        { value: "semua", label: "Semua Siswa" },
        ...data?.jurusan?.map((d) => {
          return { tipe: "jurusan", value: d?.id, label: d?.nama };
        }),
        ...data?.rombel?.map((d) => {
          return { tipe: "rombel", value: d?.id, label: d?.nama };
        }),
        ...data?.siswa?.map((d) => {
          return { tipe: "siswa", value: d?.id, label: d?.nama };
        }),
      ];

      return temp;
    }
  };

  const loadKepada = async (input) => {
    const list = await _getKepada(input);

    return list;
  };

  const broadcast = [
    { status: "draf" },
    { status: "terjadwal" },
    { status: "terkirim" },
  ];

  const navItems = [
    {
      url: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "semua"
      )}`,
      as: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "semua"
      )}`,
      text: "Semua",
      active: subnav == "semua" || subnav == undefined,
    },
    {
      url: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "terjadwal"
      )}`,
      as: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "terjadwal"
      )}`,
      text: "Terjadwal",
      active: subnav == "terjadwal",
    },
    {
      url: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "terkirim"
      )}`,
      as: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "terkirim"
      )}`,
      text: "Terkirim",
      active: subnav == "terkirim",
    },
    {
      url: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "draf"
      )}`,
      as: `${ssURL}/broadcast?${queryFormatter(
        { ...query, page: 1 },
        "subnav",
        "draf"
      )}`,
      text: "Draf",
      active: subnav == "draf",
    },
  ];

  useEffect(() => {
    _getData();
  }, [query]);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);

  return (
    <Layout>
      <AnimatePage>
        <div className="container">
          <div
            className="row justify-content-center align-items-center"
            style={{
              minHeight: "100vh",
            }}
          >
            <div className="col-md-8">
              <div
                className="rounded-ss bg-soft-primary p-md-5 p-4"
                style={{ border: "1px solid #2680eb50" }}
              >
                <div className="row g-4">
                  <div className="col-12 d-flex justify-content-center align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center p-1"
                      style={{
                        width: "75px",
                        height: "75px",
                        backgroundColor: "#FFFFFF85",
                      }}
                    >
                      <FaExclamation className="fs-2 color-dark" />
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <h4 className="color-dark fw-black mb-5">Pemberitahuan</h4>
                    <p className="color-dark text-start">
                      Sehubungan update WhatsApp multi-device yang diluncurkan
                      baru-baru ini menjadi versi stable. Ada penyesuaian dalam
                      penggunaan API layanan WhatsApp yang perlu disesuaikan
                      kembali. Oleh karena itu, fitur WhatsApp saat ini tidak
                      bisa digunakan sambil menunggu update dari WhatsApp.
                    </p>
                    <p className="color-dark text-start">
                      Terimakasih Atas Perhatiannya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <>
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-body py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Broadcast
                  </h4>
                  <button
                    type="button"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalBuatBroadcast"
                  >
                    <FaPlus /> Buat Broadcast
                  </button>
                </div>
                <hr className="my-4" />
                <div className="d-flex row mb-4 px-4">
                  <div className="col-lg-6 mb-lg-0 mb-3">
                    <div className="position-relative lg-w-100 flex-grow-1">
                      <input
                        type="text"
                        className="form-control rounded-pill fw-semibold border-secondary-ss w-100 ps-4"
                        style={{
                          height: "42px",
                          paddingRight: "60px",
                          borderRadius: "50rem",
                        }}
                        id="exampleFormControlInput1"
                        placeholder="Cari broadcast"
                        autoComplete="off"
                        value={searchNama}
                        onChange={(e) => setSearchNama(e.target.value)}
                      />
                      <FaSearch
                        className="position-absolute"
                        style={{
                          right: "24px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                    <RangePicker
                      placeholder={["Awal", "Akhir"]}
                      value={[
                        query?.tanggalAwal
                          ? momentPackage(query?.tanggalAwal)
                          : "",
                        query?.tanggalAkhir
                          ? momentPackage(query?.tanggalAkhir)
                          : "",
                      ]}
                      className="rounded-pill d-flex align-items-center date-picker-mutasi py-2"
                      onChange={(date, datestr) => {
                        router.push({
                          pathname: router.pathname,
                          query: {
                            ...query,
                            tanggalAwal: datestr[0],
                            tanggalAkhir: datestr[1],
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="select-akun-keuangan">
                      <AsyncSelect
                        type="text"
                        placeholder="Pilih penerima.."
                        cacheOptions
                        value={query?.kepada ? JSON.parse(query?.kepada) : ""}
                        onChange={(data) => {
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...query,
                              kepada: data ? JSON.stringify(data) : "",
                            },
                          });
                        }}
                        defaultOptions
                        menuPlacement={"auto"}
                        loadOptions={loadKepada}
                        noOptionsMessage={() =>
                          "Data Tidak ditemukan, masukan kata kunci baru"
                        }
                        isClearable
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4">
          <Navbar nav={navItems} />
        </div>
        <div className="row gy-4">
          {broadcastData?.data?.map((d, idx) => {
            const status = d?.draft
              ? "draf"
              : momentPackage() > momentPackage(d?.tanggalDibagikan)
              ? "terkirim"
              : "terjadwal";
            return (
              <div className="col-md-12">
                <Broadcast
                  setEditData={setEditData}
                  data={d}
                  id={idx + 1}
                  status={status}
                  handleDelete={handleDelete}
                />
              </div>
            );
          })}
        </div>
        <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
          <Pagination
            total={broadcastData?.total}
            showSizeChanger={false}
            current={parseInt(query.page || "1")}
            pageSize={10}
            onChange={(e) =>
              router.push({
                pathname: router.pathname,
                query: { ...query, page: e },
              })
            }
          />
        </div>
        <ModalBuatBroadcast
          editData={editData}
          _getData={() => {
            _getData();
          }}
        />
        <ModalPenerimaBroadcast />
     </> */}
      </AnimatePage>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      query: query || {},
    },
  };
}

export default index;
