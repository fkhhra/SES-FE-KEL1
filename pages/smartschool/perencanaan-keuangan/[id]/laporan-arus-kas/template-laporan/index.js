import { ssURL } from "client/clientAxios";
import { getKeuanganSekolah } from "client/KeuanganSekolahClient";
import {
  deleteAktivitas,
  deleteKategoriArus,
  getArus,
  postAktivitas,
  postKategoriArus,
  postRumusKasAkhir,
  postRumusKasAwal,
  postRumusKenaikan,
  putAktivitas,
  putKategoriArus,
  putRumusKasAkhir,
  putRumusKasAwal,
  putRumusKenaikan,
} from "client/LaporanRencanaClient";
import ModalKategoriTemplateLaporanKeuangan from "components/Keuangan/ModalKategoriTemplateLaporanKeuangan";
import ModalKenaikanPenurunanKas from "components/Keuangan/ModalKenaikanPenurunanKas";
import ModalSaldoKasAkhir from "components/Keuangan/ModalSaldoKasAkhir";
import ModalSaldoKasAwal from "components/Keuangan/ModalSaldoKasAwal";
import ModalTipeAkun from "components/Keuangan/ModalTipeAkun";
import HeaderLaporanArusKasPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderLaporanArusKasPerencanaanKeuangan";
import ModalTambahAktivitasRencana from "components/Keuangan/PerencanaanKeuangan/ModalTambahAktivitasRencana";
import LayoutDetail from "components/Layout/LayoutDetail";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useRencana from "hooks/useRencanaKeuangan";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { FaChevronDown, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { hideModal } from "utilities/ModalUtils";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ subnav, id }) => {
  const [formData, setFormData] = useState({
    nama: "",
    warna: "",
    btnBio: "idle",
  });

  const [arus, setArus] = useState([]);
  const [rumus, setRumus] = useState({});
  const { rumusKenaikan, rumusAwal, rumusAkhir } = rumus;
  const [currentRumus, setCurrentRumus] = useState([]);
  const [tipeAKun, setTipeAKun] = useState([]);
  const [ditambah, setDitambah] = useState({});
  const [edit, setEdit] = useState({});
  const [keuangan, setKeuangan] = useState([]);
  const [labaRugi, setLabaRugi] = useState([]);

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const _postKategori = async () => {
    if (!formData?.nama?.trim()) {
      toast.error("Harap Memasukan nama kategori");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postKategoriArus(id, {
      ...formData,
    });

    if (data) {
      toast.success(data?.message);
      hideModal("modalBuatKategoriTemplateLaporanKeuangan");
      _getArus();
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _putKategori = async (id) => {
    if (!formData?.nama?.trim()) {
      toast.error("Harap Memasukan nama kategori");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putKategoriArus(id, {
      ...formData,
    });

    if (data) {
      toast.success(data?.message);
      hideModal("modalBuatKategoriTemplateLaporanKeuangan");
      _getArus();
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _deleteKategori = async (id) => {
    // if (allRumus?.find((d) => d?.id == id)) {
    //   toast.error(
    //     "Kategori sedang dipakai dalam sebuah rumus, harap ubah rumus lalu hapus kategori"
    //   );
    //   return;
    // }
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setFormData({ ...formData, btnBio: "loading" });
        const { data } = await deleteKategoriArus(id);

        if (data) {
          toast.success(data?.message);
          _getArus();
          setFormData({ ...formData, btnBio: "success" });
          return;
        }
      }
    });
  };

  const _getArus = async () => {
    const { data } = await getArus(id);

    if (data) {
      setArus(data?.kategori);
      setRumus(data?.rumus);
      setTipeAKun(data?.tipeAkun);
      setLabaRugi(data?.labaRugi);

      if (!data?.kategori?.length) {
        _getArus();
      }

      // const temp = [];
      // data?.rumus?.map((d) => {
      //   temp.push(...JSON.parse(d?.rumus || "[]"));
      // });
      // setAllRumus([...temp]);
    }
  };

  const _postAktivitas = async () => {
    if (!formData?.judul?.trim()) {
      toast.error("Harap Memasukan judul aktivitas");
      return;
    }
    if (!formData.mRencanaKategoriTipeAkunId) {
      toast.error("Harap memilih tipe akun");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postAktivitas({
      ...formData,
      mRencanaKategoriTipeAkunId: formData.mRencanaKategoriTipeAkunId,
    });

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahAktivitas");
      _getArus();
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _deleteAktivitas = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setFormData({ ...formData, btnBio: "loading" });
        const { data } = await deleteAktivitas(id);

        if (data) {
          toast.success(data?.message);
          _getArus();
          setFormData({ ...formData, btnBio: "success" });
          return;
        }
      }
    });
  };

  const _putAktivitas = async (id, form) => {
    const payload = form || formData;
    if (!payload?.judul?.trim()) {
      toast.error("Harap Memasukan judul aktivitas");
      return;
    }
    if (!payload.mRencanaKategoriTipeAkunId && !payload.laba) {
      toast.error("Harap memilih tipe akun");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putAktivitas(id || formData?.id, {
      ...payload,
      m_rencana_kategori_tipe_akun_id: payload.mRencanaKategoriTipeAkunId,
    });

    if (data) {
      // toast.success(data?.message);
      hideModal("modalTambahAktivitas");
      _getArus();
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _postRumusKenaikan = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postRumusKenaikan(id, {
      rumus: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalKenaikanPenurunanKas");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _putRumusKenaikan = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putRumusKenaikan(formData?.id, {
      rumus: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalKenaikanPenurunanKas");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _postRumusKasAwal = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postRumusKasAwal(id, {
      rumus: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalSaldoKasAwal");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _putRumusKasAwal = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putRumusKasAwal(formData?.id, {
      rumus: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalSaldoKasAwal");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _postRumusKasAkhir = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postRumusKasAkhir(id, {
      rumus: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalSaldoKasAkhir");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _putRumusKasAkhir = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putRumusKasAkhir(formData?.id, {
      rumus: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data?.message);
      _getArus();
      hideModal("modalSaldoKasAkhir");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _getKeuanganSekolah = async () => {
    const { data } = await getKeuanganSekolah();

    if (data) {
      setKeuangan(data?.akun);
    }
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

  const shiftArray = ({ source, destination, draggableId }, kategori) => {
    if (!destination || source.index == destination.index) {
      return;
    }
    const { id: sumberKategori, tipeAkun: sumberData } = kategori.find(
      (item) => item.id == source.droppableId
    );
    const { id: targetKategori, tipeAkun: targetData } = kategori.find(
      (item) => item.id == destination.droppableId
    );

    const sumberIds = sumberData.map((item) => item.id);
    const targetIds = targetData.map((item) => item.id);
    let temp;
    if (sumberKategori === targetKategori) {
      temp = sumberIds.splice(source.index, 1);
      sumberIds.splice(destination.index, 0, ...temp);
      // editUrutanMapel(draggableId, [
      //   { kategori_id: sumberKategori, mapel_ids: sumberIds },
      // ]);
    }
    sumberIds?.map((d, idx) => {
      _putAktivitas(d, {
        ...sumberData?.find((item) => item.id == d),
        urutan: idx + 1,
      });
    });
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
                  <h4 className="fw-extrabold color-dark mb-md-0 text-center text-md-left">
                    Daftar Kategori
                  </h4>
                  <button
                    role="button"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalBuatKategoriTemplateLaporanKeuangan"
                  >
                    <div>
                      <FaPlus className="me-2" />
                      Buat Kategori
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss p-4 pb-5">
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  flexDirection: "column",
                }}
              >
                <DragDropContext
                  // onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                  onDragEnd={(result) => shiftArray(result, arus)}
                >
                  {arus?.map((d, idx) => {
                    return (
                      <div
                        className="mb-5 d-flex flex-column"
                        key={`${idx}-${new Date().getTime()}`}
                      >
                        <div className="d-flex align-content-center mb-4">
                          <h4
                            className={`fs-5 fw-bold m-0 me-4`}
                            style={{
                              color: `${d?.warna}`,
                            }}
                          >
                            {d?.nama}
                          </h4>
                          <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                            <div
                              className="rounded-circle template-rapor-buku-induk d-flex justify-content-center align-items-center dropdown-template-rapor"
                              style={{
                                width: "24px",
                                height: "24px",
                                background: d?.warna || "#c3c3c8",
                              }}
                              role="button"
                              id="dropdownOption"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <FaChevronDown color="white" />
                            </div>
                            <ul
                              className="dropdown-menu dropdown-menu-ss my-1"
                              aria-labelledby="dropdownOption"
                            >
                              <li
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    id: d?.id,
                                    nama: d?.nama,
                                    warna: d?.warna,
                                  })
                                }
                                data-bs-toggle="modal"
                                data-bs-target="#modalBuatKategoriTemplateLaporanKeuangan"
                              >
                                <a className="dropdown-item">
                                  <FaPen className="me-2" />
                                  <span>Edit</span>
                                </a>
                              </li>
                              <li onClick={() => _deleteKategori(d?.id)}>
                                <a className="dropdown-item color-danger">
                                  <FaTrashAlt className="me-2" />
                                  <span>Hapus</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="table-kerja table-kerja-heading mb-2 d-none d-md-flex">
                          <div
                            className="table-kerja-list table-kerja-heading"
                            style={{
                              border: "none",
                              // background: `${d.warna}11`,
                              // color: d.warna,
                              minHeight: "56px",
                            }}
                          >
                            Nama Akun
                          </div>
                          <div
                            className="table-kerja-list table-kerja-heading"
                            style={{
                              border: "none",
                              // background: `${d.warna}11`,
                              // color: d.warna,
                              minHeight: "56px",
                            }}
                          ></div>
                        </div>
                        <div>
                          <Droppable droppableId={`${d?.id}`} key={`${d?.id}`}>
                            {(provided, snapshot) => {
                              return (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  style={{
                                    background: snapshot.isDraggingOver
                                      ? `rgba(107, 177, 254, .3)`
                                      : "white",
                                    //   padding: 4,
                                    width: "100%",
                                  }}
                                >
                                  {d?.tipeAkun?.map(
                                    (akun, index, thisArray) => {
                                      return (
                                        <Draggable
                                          key={`${akun?.id}`}
                                          draggableId={`${`${akun?.id}`}`}
                                          index={index}
                                        >
                                          {(provided, snapshot) => {
                                            return (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  userSelect: "none",
                                                  margin: "0 0 8px 0",
                                                  background: akun?.dihapus
                                                    ? "#e1e1e7"
                                                    : "rgba(244, 244, 247, .45)",
                                                  color: "#80849C",
                                                  ...provided.draggableProps
                                                    .style,
                                                }}
                                              >
                                                <div
                                                  className={`table-kerja d-flex flex-column flex-md-row ${
                                                    akun?.dihapus
                                                      ? "deleted"
                                                      : ""
                                                  }`}
                                                >
                                                  <div
                                                    className="table-kerja-list "
                                                    style={{
                                                      borderColor: d.warna,
                                                      // background: `${d.warna}11`,
                                                      // color: d.warna,
                                                      minHeight: "56px",
                                                    }}
                                                  >
                                                    <span className="d-flex d-md-none w-50">
                                                      Nama Akun
                                                    </span>
                                                    <p className="m-0">
                                                      {akun?.judul}
                                                    </p>
                                                  </div>
                                                  {/* <div className="table-template-list">
                                            </div> */}
                                                  <div
                                                    className="table-kerja-list me-2 d-flex justify-content-end"
                                                    style={{
                                                      borderColor: d.warna,
                                                      // background: `${d.warna}11`,
                                                      // color: d.warna,
                                                      minHeight: "56px",
                                                    }}
                                                  >
                                                    <span className="d-flex d-md-none w-50">
                                                      Aksi
                                                    </span>
                                                    <a
                                                      data-bs-toggle="modal"
                                                      data-bs-target="#modalTambahAktivitas"
                                                      onClick={() => {
                                                        setFormData({
                                                          ...formData,
                                                          ...akun,
                                                        });
                                                      }}
                                                      style={{
                                                        display: akun.dihapus
                                                          ? "none"
                                                          : "block",
                                                        paddingRight: "16px",
                                                      }}
                                                    >
                                                      <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center ">
                                                        <FaPen />
                                                      </div>
                                                    </a>
                                                    {akun?.laba ? null : (
                                                      <a
                                                        onClick={() => {
                                                          _deleteAktivitas(
                                                            akun?.id
                                                          );
                                                        }}
                                                      >
                                                        <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center">
                                                          <FaTrashAlt />
                                                        </div>
                                                      </a>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }}
                                        </Draggable>
                                      );
                                    }
                                  )}
                                  <div className="table-kerja pointer">
                                    <div
                                      className="table-kerja-list tambah-table-kerja"
                                      style={{
                                        borderColor: d.warna,
                                        background: `${d.warna}11`,
                                        color: d.warna,
                                        minHeight: "56px",
                                      }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#modalTambahAktivitas"
                                      onClick={() => {
                                        setFormData({
                                          nama: "",
                                          warna: "",
                                          btnBio: "idle",
                                          judul: "",
                                          mRencanaKategoriArusKasId: d.id,
                                        });
                                      }}
                                    >
                                      <>
                                        <FaPlus className="me-2" /> Tambah
                                      </>
                                    </div>
                                  </div>
                                  {provided.placeholder}
                                </div>
                              );
                            }}
                          </Droppable>
                        </div>
                      </div>
                    );
                  })}
                </DragDropContext>
              </div>
              <div className="mb-4">
                <h5 className="color-dark fw-bold mb-4">
                  Kenaikan (Penurunan) Kas
                </h5>
                {rumusKenaikan ? (
                  <div
                    className="d-flex align-items-center justify-content-between px-4 py-2"
                    style={{
                      background: "#F8F8FB",
                      minHeight: "56px",
                    }}
                  >
                    <h6 className="fw-bold color-dark mb-0">
                      {JSON.parse(rumusKenaikan?.rumus)
                        .map((d) => {
                          if (d.operator) {
                            return d.operator == "plus" ? "+" : "-";
                          } else {
                            return arus.find((e) => e.id == d.id)?.nama;
                          }
                        })
                        .join(" ")}
                      {/* Kas dari Aktivitas Operasional + Kas dari Aktivitas
                      Investasi + Kas dari Aktivitas Pendanaan{" "} */}
                    </h6>
                    <button
                      className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center ms-4"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#modalKenaikanPenurunanKas"
                      onClick={() => {
                        setCurrentRumus(JSON.parse(rumusKenaikan?.rumus));
                        setFormData({ ...formData, id: rumusKenaikan?.id });
                      }}
                    >
                      <FaPen className="color-secondary" />
                    </button>
                  </div>
                ) : (
                  <a
                    className="text-decoration-none btn-tambah-rumus-laba-rugi d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#modalKenaikanPenurunanKas"
                    onClick={() => {
                      setCurrentRumus([]);
                      setFormData({ ...formData, id: "" });
                    }}
                    style={{ minHeight: "56px" }}
                  >
                    <span className="color-secondary fw-semibold">
                      <FaPlus className="me-2" /> Tambah
                    </span>
                  </a>
                )}
              </div>
              <div className="mb-4">
                <h5 className="color-dark fw-bold mb-4">Saldo Kas Awal</h5>
                {rumusAwal ? (
                  <div
                    className="d-flex align-items-center justify-content-between px-4 py-2"
                    style={{
                      background: "#F8F8FB",
                      minHeight: "56px",
                    }}
                  >
                    <h6 className="fw-bold color-dark mb-0">
                      {JSON.parse(rumusAwal?.rumus)
                        .map((d) => {
                          if (d.operator) {
                            return d.operator == "plus" ? "+" : "-";
                          } else {
                            return labaRugi.find((e) => e.id == d.id)?.nama;
                          }
                        })
                        .join(" ")}
                    </h6>
                    <button
                      className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center ms-4"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#modalSaldoKasAwal"
                      onClick={() => {
                        {
                          setCurrentRumus(JSON.parse(rumusAwal?.rumus));
                          setFormData({ ...formData, id: rumusAwal?.id });
                        }
                      }}
                    >
                      <FaPen className="color-secondary" />
                    </button>
                  </div>
                ) : (
                  <a
                    className="text-decoration-none btn-tambah-rumus-laba-rugi d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#modalSaldoKasAwal"
                    onClick={() => {
                      setCurrentRumus([]);
                      setFormData({ ...formData, id: "" });
                    }}
                    style={{ minHeight: "56px" }}
                  >
                    <span className="color-secondary fw-semibold">
                      <FaPlus className="me-2" /> Tambah
                    </span>
                  </a>
                )}
              </div>
              <div className="mb-4">
                <h5 className="color-dark fw-bold mb-4">Saldo Kas Akhir</h5>
                {rumusAkhir ? (
                  <div
                    className="d-flex align-items-center justify-content-between px-4 py-2"
                    style={{
                      background: "#F8F8FB",
                      minHeight: "56px",
                    }}
                  >
                    <h6 className="fw-bold color-dark mb-0">
                      Saldo Kas Awal +{" "}
                      {JSON.parse(rumusAkhir?.rumus)
                        .map((d) => {
                          if (d.operator) {
                            return d.operator == "plus" ? "+" : "-";
                          } else {
                            return arus.find((e) => e.id == d.id)?.nama;
                          }
                        })
                        .join(" ")}
                    </h6>
                    <button
                      className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center ms-4"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#modalSaldoKasAkhir"
                      onClick={() => {
                        {
                          setCurrentRumus(JSON.parse(rumusAkhir?.rumus));
                          setFormData({ ...formData, id: rumusAkhir?.id });
                        }
                      }}
                    >
                      <FaPen className="color-secondary" />
                    </button>
                  </div>
                ) : (
                  <a
                    className="text-decoration-none btn-tambah-rumus-laba-rugi d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#modalSaldoKasAkhir"
                    onClick={() => {
                      setCurrentRumus([]);
                      setFormData({ ...formData, id: "" });
                    }}
                    style={{ minHeight: "56px" }}
                  >
                    <span className="color-secondary fw-semibold">
                      <FaPlus className="me-2" /> Tambah
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <ModalSaldoKasAwal
          currentRumus={currentRumus}
          setCurrentRumus={setCurrentRumus}
          tipeAKun={keuangan}
          formData={formData}
          labaRugi={labaRugi}
          _postRumusKasAwal={() => {
            formData?.id ? _putRumusKasAwal() : _postRumusKasAwal();
          }}
        />
        <ModalSaldoKasAkhir
          currentRumus={currentRumus}
          setCurrentRumus={setCurrentRumus}
          arus={arus}
          formData={formData}
          _postRumusKasAkhir={() => {
            formData?.id ? _putRumusKasAkhir() : _postRumusKasAkhir();
          }}
        />
        <ModalKenaikanPenurunanKas
          currentRumus={currentRumus}
          setCurrentRumus={setCurrentRumus}
          arus={arus}
          formData={formData}
          _postRumusKenaikan={() => {
            formData?.id ? _putRumusKenaikan() : _postRumusKenaikan();
          }}
        />
        <ModalKategoriTemplateLaporanKeuangan
          formData={formData}
          handleChangeForm={handleChangeForm}
          _postKategori={() => {
            formData?.id ? _putKategori(formData?.id) : _postKategori();
          }}
        />
        <ModalTipeAkun
          formData={formData}
          handleChangeForm={handleChangeForm}
        />
        <ModalTambahAktivitasRencana
          formData={formData}
          handleChangeForm={handleChangeForm}
          tipeData={tipeAKun}
          _postAktivitas={() => {
            formData?.id ? _putAktivitas() : _postAktivitas();
          }}
        />
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
