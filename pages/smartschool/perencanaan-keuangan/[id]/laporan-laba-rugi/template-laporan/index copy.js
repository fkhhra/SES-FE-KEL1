import { ssURL } from "client/clientAxios";
import { getKeuanganSekolah } from "client/KeuanganSekolahClient";
import {
  deleteAkunLaba,
  deleteKategoriLaba,
  deleteRumus,
  getLaba,
  postAkunLaba,
  postKategoriLaba,
  postRumus,
  putAkunLaba,
  putKategoriLaba,
  putRumus,
} from "client/LaporanRencanaClient";
import ModalKategoriTemplateLaporanKeuangan from "components/Keuangan/ModalKategoriTemplateLaporanKeuangan";
import ModalRumusLabaRugi from "components/Keuangan/ModalRumusLabaRugi";
import HeaderLaporanLabaRugiPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderLaporanLabaRugiPerencanaanKeuangan";
import LayoutDetail from "components/Layout/LayoutDetail";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useRencana from "hooks/useRencanaKeuangan";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaChevronDown,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import Select from "react-select";
import swal from "sweetalert";
import { hideModal } from "utilities/ModalUtils";

// import FormBerkas from "../../../components/PPDB/FormBerkas";
const initialFormData = {
  nama: "",
  warna: "",
  btnBio: "idle",
};

const index = ({ subnav, id }) => {
  const [formData, setFormData] = useState({
    nama: "",
    warna: "",
    btnBio: "idle",
  });

  const [laba, setLaba] = useState([]);
  const [rumus, setRumus] = useState([]);
  const [allRumus, setAllRumus] = useState([]);
  const [currentRumus, setCurrentRumus] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [ditambah, setDitambah] = useState({});
  const [edit, setEdit] = useState({});

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const _postRumus = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postRumus(id, {
      rumus: JSON.stringify(currentRumus),
      nama: formData.nama,
    });

    if (data) {
      toast.success(data?.message);
      _getLaba();
      hideModal("modalRumusLabaRugi");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _putRumus = async (id) => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putRumus(id, {
      rumus: JSON.stringify(currentRumus),
      nama: formData.nama,
    });

    if (data) {
      toast.success(data?.message);
      _getLaba();
      hideModal("modalRumusLabaRugi");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _deleteRumus = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteRumus(id);

        if (data) {
          toast.success(data?.message);
          _getLaba();
          return;
        }
      }
    });
  };

  const _postKategori = async () => {
    if (!formData?.nama?.trim()) {
      toast.error("Harap Memasukan nama kategori");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postKategoriLaba(id, {
      ...formData,
    });

    if (data) {
      toast.success(data?.message);
      _getLaba();
      hideModal("modalBuatKategoriTemplateLaporanKeuangan");
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
    const { data } = await putKategoriLaba(id, {
      ...formData,
    });

    if (data) {
      toast.success(data?.message);
      _getLaba();
      hideModal("modalBuatKategoriTemplateLaporanKeuangan");
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _deleteKategori = async (id) => {
    if (allRumus?.find((d) => d?.id == id)) {
      toast.error(
        "Kategori sedang dipakai dalam sebuah rumus, harap ubah rumus lalu hapus kategori"
      );
      return;
    }
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setFormData({ ...formData, btnBio: "loading" });
        const { data } = await deleteKategoriLaba(id);

        if (data) {
          toast.success(data?.message);
          _getLaba();
          setFormData({ ...formData, btnBio: "success" });
          return;
        }
      }
    });
  };

  const _getKeuanganSekolah = async () => {
    const { data } = await getKeuanganSekolah();

    if (data) {
      setKeuangan(data?.akun);
    }
  };

  const _getLaba = async () => {
    const { data } = await getLaba(id);

    if (data) {
      setLaba(data?.kategori);
      setRumus(data?.rumus);

      const temp = [];
      data?.rumus?.map((d) => {
        temp.push(...JSON.parse(d?.rumus || "[]"));
      });
      setAllRumus([...temp]);
    }
  };

  const _postAkunLaba = async (m_keu_kategori_laba_rugi_id, urutan) => {
    if (!formData?.mKeuAkunId) {
      toast.error("Harap Memilih Akun");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postAkunLaba({
      ...formData,
      m_keu_kategori_laba_rugi_id,
      urutan,
    });

    if (data) {
      toast.success(data?.message);
      setDitambah({ ...ditambah, [m_keu_kategori_laba_rugi_id]: 0 });
      _getLaba();
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _editAKunLaba = async (id, mKeuAkunId, urutan) => {
    // if (!formData?.mKeuAkunId) {
    //   toast.error("Harap Memilih Akun");
    //   return;
    // }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putAkunLaba(id, {
      mKeuAkunId,
      urutan,
    });

    if (data) {
      toast.success(data?.message);
      _getLaba();
      setEdit({ ...edit, [id]: 0 });
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };

  const _deleteAkunLaba = async (id) => {
    // if (!formData?.mKeuAkunId) {
    //   toast.error("Harap Memilih Akun");
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
        const { data } = await deleteAkunLaba(id);

        if (data) {
          toast.success(data?.message);
          _getLaba();
          setFormData({ ...formData, btnBio: "success" });
          return;
        }
      }
    });
  };

  const shiftArray = ({ source, destination, draggableId }, kategori) => {
    if (!destination || source.index == destination.index) {
      return;
    }
    const { id: sumberKategori, akunLabaRugi: sumberData } = kategori.find(
      (item) => item.id == source.droppableId
    );
    const { id: targetKategori, akunLabaRugi: targetData } = kategori.find(
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
      _editAKunLaba(
        d,
        sumberData?.find((item) => item.id == d)?.akun?.id,
        idx + 1
      );
    });
  };
  const { rencana, setRencana } = useRencana();

  useEffect(() => {
    _getKeuanganSekolah();
    _getLaba();
  }, []);
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const [tipe, setTipe] = useState("");

  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [collapseOpen, setcollapseOpen] = useState([]);

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;

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
        <HeaderLaporanLabaRugiPerencanaanKeuangan
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
                    Daftar Akun
                  </h4>
                  <div className="dropdown dropdown-ss d-flex flex-column">
                    <div
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                      data-joyride="button-buat-pembayaran"
                    >
                      <div>
                        <FaPlus className="me-2" />
                        Buat Kategori
                      </div>
                    </div>
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        <a
                          className="dropdown-item pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#modalBuatKategoriTemplateLaporanKeuangan"
                          // onClick={() => {
                          //   settipePembayaran("spp");
                          //   setEditData(0);
                          // }}
                        >
                          <span>Buat Kategori</span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#modalRumusLabaRugi"
                          onClick={() => (
                            setCurrentRumus([]),
                            setFormData({ ...initialFormData })
                          )}
                        >
                          <span>Buat Rumus</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
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
                  onDragEnd={(result) => shiftArray(result, laba)}
                >
                  {laba?.map((d, idx) => {
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
                                  {d?.akunLabaRugi?.map(
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
                                                      Nama Mapel Rapor
                                                    </span>
                                                    {edit[akun?.id] ? (
                                                      <div className="w-100 color-dark">
                                                        <Select
                                                          placeholder="Pilih Akun"
                                                          defaultValue={{
                                                            label:
                                                              akun?.akun?.nama,
                                                            value:
                                                              akun?.akun?.id,
                                                          }}
                                                          onChange={(opt) => {
                                                            setFormData({
                                                              ...formData,
                                                              mKeuAkunId:
                                                                opt?.value ||
                                                                "",
                                                            });
                                                          }}
                                                          isClearable
                                                          options={keuangan
                                                            ?.filter(
                                                              (e) =>
                                                                !thisArray.find(
                                                                  (d) =>
                                                                    d?.akun
                                                                      ?.id ==
                                                                    e?.id
                                                                )
                                                            )
                                                            ?.map((d) => {
                                                              return {
                                                                label: d?.nama,
                                                                value: d?.id,
                                                              };
                                                            })}
                                                        />
                                                      </div>
                                                    ) : (
                                                      <p className="m-0">
                                                        {akun?.akun?.nama}
                                                      </p>
                                                    )}
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
                                                    {edit[akun?.id] ? (
                                                      <>
                                                        <a
                                                          className="me-3"
                                                          onClick={() => {
                                                            _editAKunLaba(
                                                              akun?.id,
                                                              formData?.mKeuAkunId
                                                            );
                                                            // setShowInput(null);
                                                          }}
                                                        >
                                                          <div className="rounded-circle bg-primary p-2 d-flex justify-content-center align-items-center shadow-primary-ss hover-shadow-none">
                                                            <FaCheck color="white" />
                                                          </div>
                                                        </a>
                                                        <a
                                                          className="me-3"
                                                          onClick={() => {
                                                            setEdit({
                                                              ...edit,
                                                              [akun?.id]: 0,
                                                            });
                                                            // setShowInput(mapel.id);
                                                          }}
                                                        >
                                                          <div className="rounded-circle p-2 d-flex justify-content-center align-items-center bg-danger shadow-danger-ss hover-shadow-none">
                                                            <FaTimes className="text-white" />
                                                          </div>
                                                        </a>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <a
                                                          onClick={() => {
                                                            setEdit({
                                                              ...edit,
                                                              [akun?.id]:
                                                                !edit[akun?.id],
                                                            });
                                                            // setShowInput(mapel.id);
                                                          }}
                                                          style={{
                                                            display:
                                                              akun.dihapus
                                                                ? "none"
                                                                : "block",
                                                            paddingRight:
                                                              "16px",
                                                          }}
                                                        >
                                                          <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center ">
                                                            <FaPen />
                                                          </div>
                                                        </a>
                                                        <a
                                                          onClick={() => {
                                                            _deleteAkunLaba(
                                                              akun?.id
                                                            );
                                                          }}
                                                          style={{
                                                            paddingRight:
                                                              "16px",
                                                          }}
                                                        >
                                                          <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center">
                                                            <FaTrashAlt />
                                                          </div>
                                                        </a>
                                                      </>
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
                                    {ditambah[d.id] ? (
                                      <>
                                        <div
                                          className="table-kerja-list"
                                          style={{
                                            borderColor: d.warna,
                                            background: `${d.warna}11`,
                                            color: d.warna,
                                            minHeight: "56px",
                                          }}
                                        >
                                          <div className="w-100 color-dark">
                                            <Select
                                              placeholder="Pilih Akun"
                                              onChange={(opt) => {
                                                setFormData({
                                                  ...formData,
                                                  mKeuAkunId: opt?.value || "",
                                                });
                                              }}
                                              isClearable
                                              options={keuangan
                                                ?.filter(
                                                  (e) =>
                                                    !d?.akunLabaRugi?.find(
                                                      (akun) =>
                                                        akun?.akun?.id == e?.id
                                                    )
                                                )
                                                ?.map((d) => {
                                                  return {
                                                    label: d?.nama,
                                                    value: d?.id,
                                                  };
                                                })}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          className="table-kerja-list me-2 d-flex justify-content-end"
                                          style={{
                                            borderColor: d.warna,
                                            background: `${d.warna}11`,
                                            color: d.warna,
                                            minHeight: "56px",
                                          }}
                                        >
                                          <a
                                            onClick={() => {
                                              _postAkunLaba(d?.id, 1);
                                              // setShowInput(mapel.id);
                                            }}
                                            style={{
                                              display: "block",
                                            }}
                                          >
                                            <div
                                              className={`rounded-circle p-2 d-flex justify-content-center align-items-center hover-shadow-none me-3 ${
                                                d.warna
                                                  ? ""
                                                  : "shadow-primary-ss"
                                              }`}
                                              style={{
                                                background: `${
                                                  d.warna ? d.warna : "#2680eb"
                                                }`,
                                              }}
                                            >
                                              <FaCheck className="text-white" />
                                            </div>
                                          </a>
                                          <a
                                            onClick={() => {
                                              setDitambah({
                                                ...ditambah,
                                                [d.id]: !ditambah[d.id],
                                              });
                                            }}
                                          >
                                            <div
                                              className={`rounded-circle p-2 d-flex justify-content-center align-items-center hover-shadow-none me-3 ${
                                                d.warna
                                                  ? ""
                                                  : "shadow-danger-ss"
                                              }`}
                                              style={{
                                                background: `${
                                                  d.warna ? d.warna : "#fc544b"
                                                }`,
                                              }}
                                            >
                                              <FaTimes className="text-white" />
                                            </div>
                                          </a>
                                        </div>
                                      </>
                                    ) : (
                                      <div
                                        className="table-kerja-list tambah-table-kerja"
                                        style={{
                                          borderColor: d.warna,
                                          background: `${d.warna}11`,
                                          color: d.warna,
                                          minHeight: "56px",
                                        }}
                                        onClick={() =>
                                          setDitambah({
                                            ...ditambah,
                                            [d.id]: !ditambah[d.id],
                                          })
                                        }
                                      >
                                        <>
                                          <FaPlus className="me-2" /> Tambah
                                        </>
                                      </div>
                                    )}
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
              <h5 className="color-dark fw-bold mb-4">Rumus Laba/Rugi</h5>

              {rumus?.map((d) => {
                const parsed = JSON.parse(d?.rumus || "[]");
                return (
                  <div
                    className="d-flex align-items-center justify-content-between px-4 py-2 mb-2"
                    style={{
                      background: "#F8F8FB",
                      minHeight: "56px",
                    }}
                  >
                    <h6 className="fw-bold color-dark mb-0">
                      {d.nama ||
                        parsed
                          .map((d) => {
                            if (d.operator) {
                              return d.operator == "plus" ? "+" : "-";
                            } else {
                              return laba.find((e) => e.id == d.id)?.nama;
                            }
                          })
                          .join(" ")}
                    </h6>
                    <div className="d-flex">
                      <button
                        className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center ms-4"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalRumusLabaRugi"
                        onClick={() => {
                          setCurrentRumus(parsed);
                          setFormData({ ...formData, ...d });
                        }}
                      >
                        <FaPen className="color-secondary" />
                      </button>
                      {/* <button
                        className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center ms-4"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        onClick={() => {
                          _deleteRumus(d?.id);
                        }}
                      >
                        <FaTrashAlt className="color-secondary" />
                      </button> */}
                    </div>
                  </div>
                );
              })}
              {!rumus?.length ? (
                <a
                  data-bs-toggle="modal"
                  data-bs-target="#modalRumusLabaRugi"
                  onClick={() => setCurrentRumus([])}
                  className="btn-tambah-rumus-laba-rugi d-flex align-items-center text-decoration-none"
                  style={{ minHeight: "56px" }}
                >
                  <span className="color-secondary fw-semibold">
                    <FaPlus className="me-2" /> Tambah
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <ModalRumusLabaRugi
          laba={laba}
          rumus={rumus}
          currentRumus={currentRumus}
          setCurrentRumus={setCurrentRumus}
          _postRumus={() => {
            formData?.id ? _putRumus(formData?.id) : _postRumus();
          }}
          formData={formData}
          setFormData={setFormData}
        />
        <ModalKategoriTemplateLaporanKeuangan
          _postKategori={() => {
            formData?.id ? _putKategori(formData?.id) : _postKategori();
          }}
          formData={formData}
          handleChangeForm={handleChangeForm}
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
      subnav: subnav || null,
      id: id || null,
    },
  };
}

export default index;
