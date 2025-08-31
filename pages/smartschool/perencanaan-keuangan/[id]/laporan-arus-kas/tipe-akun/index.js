import { ssURL } from "client/clientAxios";
import { getKeuanganSekolah } from "client/KeuanganSekolahClient";
import {
  deleteTipeAkun,
  getArus,
  postTipeAkun,
  putTipeAkun,
} from "client/LaporanRencanaClient";
import ModalKategoriTemplateLaporanKeuangan from "components/Keuangan/ModalKategoriTemplateLaporanKeuangan";
import ModalKenaikanPenurunanKas from "components/Keuangan/ModalKenaikanPenurunanKas";
import ModalSaldoKasAkhir from "components/Keuangan/ModalSaldoKasAkhir";
import ModalSaldoKasAwal from "components/Keuangan/ModalSaldoKasAwal";
import ModalTipeAkun from "components/Keuangan/ModalTipeAkun";
import HeaderLaporanArusKasPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderLaporanArusKasPerencanaanKeuangan";
import LayoutDetail from "components/Layout/LayoutDetail";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useRencana from "hooks/useRencanaKeuangan";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { hideModal } from "utilities/ModalUtils";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ subnav, id }) => {
  const [formData, setFormData] = useState({
    nama: "",
    warna: "",
    btnBio: "idle",
    akun: [],
    kategori: "",
    format: "",
    periode1: "",
    periode2: "",
    rumus: "",
    pilihanPeriode: "",
  });

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (idx, value) => {
    let temp = formData.akun;
    temp[idx] = { ...temp[idx], mKeuAkunId: value };
    setFormData({
      ...formData,
      akun: [...temp],
    });
  };

  const tambahAkun = () => {
    setFormData({
      ...formData,
      akun: [...formData.akun, { mKeuAkunId: "" }],
    });
  };

  const [arus, setArus] = useState([]);
  const [rumus, setRumus] = useState([]);
  const [tipeAkun, setTipeAkun] = useState([]);
  const [keuangan, setKeuangan] = useState([]);

  const _getKeuanganSekolah = async () => {
    const { data } = await getKeuanganSekolah();

    if (data) {
      setKeuangan(data?.akun);
    }
  };

  const _getArus = async () => {
    const { data } = await getArus(id);

    if (data) {
      setArus(data?.kategori);
      setRumus(data?.rumus);
      setTipeAkun(data?.tipeAkun);

      // const temp = [];
      // data?.rumus?.map((d) => {
      //   temp.push(...JSON.parse(d?.rumus || "[]"));
      // });
      // setAllRumus([...temp]);
    }
  };

  const _postKategori = async () => {
    if (!formData?.nama) {
      toast.error("harap memasukan nama");
      return;
    }
    if (!formData.akun?.filter((d) => d.mKeuAkunId).length) {
      toast.error("harap menambahkan minimal 1 akun");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postTipeAkun(id, {
      nama: formData.nama,
      mKeuAkunId: formData.akun?.filter((d) => d.mKeuAkunId),
      pengaturan: JSON.stringify({
        format: formData?.format,
        periode1: formData?.periode1,
        periode2: formData?.periode2,
        pilihanPeriode: formData?.pilihanPeriode,
        rumus: formData?.rumus,
      }),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalTipeAkun");
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _putKategori = async (id) => {
    if (!formData?.nama) {
      toast.error("harap memasukan nama");
      return;
    }
    if (!formData.akun?.filter((d) => d.mKeuAkunId).length) {
      toast.error("harap menambahkan minimal 1 akun");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putTipeAkun(id, {
      nama: formData.nama,
      mKeuAkunId: formData.akun?.filter((d) => d.mKeuAkunId),
      pengaturan: JSON.stringify({
        format: formData?.format,
        periode1: formData?.periode1,
        periode2: formData?.periode2,
        pilihanPeriode: formData?.pilihanPeriode,
        rumus: formData?.rumus,
      }),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalTipeAkun");
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _deleteKategori = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setFormData({ ...formData, btnBio: "loading" });
        const { data } = await deleteTipeAkun(id);

        if (data) {
          toast.success(data?.message);
          _getArus();
          setFormData({ ...formData, btnBio: "success" });
          return;
        }
      }
    });
  };

  useEffect(() => {
    _getArus();
    _getKeuanganSekolah();
  }, []);
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const [tipe, setTipe] = useState("");

  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [collapseOpen, setcollapseOpen] = useState([]);

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;
  const { rencana } = useRencana();

  const listDropdownValue = [
    {
      label: "Semua Periode",
      value: "",
    },
    {
      label: "Mingguan",
      value: "mingguan",
    },
    {
      label: "Bulanan",
      value: "bulanan",
    },
    {
      label: "Tahunan",
      value: "tahunan",
    },
  ];

  const handleChangeDropdown = (value) => {
    setTipe(value.value);
  };

  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/perencanaan-keuangan/${id}/laporan`}
      title={rencana?.nama}
      id={id}
    >
      <AnimatePage>
        <HeaderLaporanArusKasPerencanaanKeuangan
          ssURL={ssURL}
          id={id}
          rencana={rencana}
        />
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss p-4 mb-4">
              <div className="card-header card-header-ss m-0 p-0">
                <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                  <h4 className="fw-extrabold color-dark mb-md-0 text-center text-md-start">
                    Daftar Tipe Akun
                  </h4>
                  <button
                    role="button"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTipeAkun"
                    onClick={() => {
                      setFormData({
                        nama: "",
                        warna: "",
                        btnBio: "idle",
                        akun: [{ mKeuAkunId: "" }],
                      });
                    }}
                  >
                    <div>
                      <FaPlus className="me-2" />
                      Buat Tipe Akun
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row gy-4">
          <div className="col-md-12 mb-4">
            {tipeAkun?.map((d) => {
              return (
                <div className="card card-ss card-biaya-pendaftaran p-0 mb-4">
                  <div className="">
                    <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4 flex-sm-row flex-column">
                      <h4 className="fw-bold color-dark mb-sm-0 mb-4 mt-sm-1">
                        {d?.nama}
                      </h4>
                      <div className="d-flex ms-sm-0 ms-auto">
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target={"#modalTipeAkun"}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              ...d,
                            })
                          }
                        >
                          <FaPen className="color-secondary" />
                        </button>
                        <button
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => _deleteKategori(d?.id)}
                        >
                          <FaTrashAlt className="color-secondary" />
                        </button>
                        <a
                          data-bs-toggle="collapse"
                          href={`#collapseExample${d?.id}`}
                          role="button"
                          aria-expanded="false"
                          aria-controls={`collapseExample${d?.id}`}
                          className={`btn-collapse ${
                            !collapseOpen ? "active" : ""
                          }`}
                          // onClick={() =>
                          //   setcollapseOpen({
                          //     ...collapseOpen,
                          //     [d?.id]: !collapseOpen[d?.id],
                          //   })
                          // }
                        >
                          <span
                            class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <img
                              className="dropdown"
                              src="/img/arrow-bottom.svg"
                              alt=""
                            />
                          </span>
                        </a>
                      </div>
                    </div>

                    <div class="collapse" id={`collapseExample${d?.id}`}>
                      <hr className="mb-4 mt-0" />
                      <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                        {d?.akun?.map((e) => {
                          return (
                            <p className="color-dark fw-semibold fs-16-ss">
                              {e?.akun?.kode} - {e?.akun?.nama}
                            </p>
                          );
                        })}
                        {/* <p className="color-dark fw-semibold fs-16-ss">
                          11100 - Kas
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ModalTipeAkun
          formData={formData}
          handleChangeForm={handleChangeForm}
          keuangan={keuangan}
          tambahAkun={tambahAkun}
          handleChangeSelect={handleChangeSelect}
          _postKategori={() => {
            formData?.id ? _putKategori(formData?.id) : _postKategori();
          }}
        />
        <ModalSaldoKasAwal />
        <ModalSaldoKasAkhir />
        <ModalKenaikanPenurunanKas />
        <ModalKategoriTemplateLaporanKeuangan />
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({
  query: { subnav },
  params: { id },
}) {
  return {
    props: {
      id: id || null,
      subnav: subnav || null,
    },
  };
}

export default index;
