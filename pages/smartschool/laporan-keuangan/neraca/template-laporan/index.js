import { getKeuanganSekolah } from "client/KeuanganSekolahClient";
import {
  deleteAkunNeraca,
  deleteKategoriNeraca,
  getNeraca,
  postAkunNeraca,
  postKategoriNeraca,
  putAkunNeraca,
  putKategoriNeraca,
} from "client/NeracaClient";
import HeaderLaporanNeraca from "components/Keuangan/HeaderLaporanNeraca";
import ModalKategoriTemplateLaporanKeuangan from "components/Keuangan/ModalKategoriTemplateLaporanKeuangan";
import ModalTemplateLaporanNeraca from "components/Keuangan/RealisasiKeuangan/ModalTemplateLaporanNeraca";
import LayoutDetail from "components/Layout/LayoutDetail";
import Navbar from "components/Shared/Navbar/Navbar";
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
import { ssURL } from "../../../../../client/clientAxios";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ subnav }) => {
  const [formData, setFormData] = useState({
    tipe: subnav == "aktiva" || !subnav ? "aktiva" : "pasiva",
    nama: "",
    warna: "",
    btnBio: "idle",
  });

  const [Neraca, setNeraca] = useState([]);
  const [keuangan, setKeuangan] = useState([]);
  const [ditambah, setDitambah] = useState({});
  const [edit, setEdit] = useState({});

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
    const { data } = await postKategoriNeraca({
      ...formData,
      tipe: subnav ? subnav : "aktiva",
    });

    if (data) {
      toast.success(data?.message);
      _getNeraca();
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
    const { data } = await putKategoriNeraca(id, {
      ...formData,
      tipe: subnav ? subnav : "aktiva",
    });

    if (data) {
      toast.success(data?.message);
      _getNeraca();
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
        const { data } = await deleteKategoriNeraca(id);

        if (data) {
          toast.success(data?.message);
          _getNeraca();
          setFormData({ ...formData, btnBio: "success" });
          return;
        }
      }
    });
  };

  const _getKeuanganSekolah = async () => {
    const { data } = await getKeuanganSekolah();

    if (data) {
      // setKeuangan(data?.akun);
    }
  };

  const _getNeraca = async () => {
    const { data } = await getNeraca();

    if (data) {
      setNeraca(data?.kategori);

      setKeuangan(data?.akun);
    }
  };
  console.log(edit);

  const _postAkunNeraca = async (m_keu_kategori_neraca_id, urutan) => {
    if (!formData?.mKeuAkunId) {
      toast.error("Harap Memilih Akun");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await postAkunNeraca({
      ...formData,
      m_keu_kategori_neraca_id: ditambah?.id,
      urutan,
    });

    if (data) {
      toast.success(data?.message);
      setDitambah(null);
      _getNeraca();
      setFormData({ ...formData, btnBio: "success" });
      hideModal("modalTemplateLaporanNeraca");
      return;
    } else {
      setDitambah(null);
      hideModal("modalTemplateLaporanNeraca");
      return;
    }
  };

  const _editAkunNeraca = async (idUrutan, mKeuAkunIdUrutan, urutan) => {
    const id = edit?.id || idUrutan;
    // if (!formData?.mKeuAkunId) {
    //   toast.error("Harap Memilih Akun");
    //   return;
    // }
    const mKeuAkunId = mKeuAkunIdUrutan || formData.mKeuAkunId;
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await putAkunNeraca(id, {
      ...formData,
      mKeuAkunId,
      urutan,
    });

    if (data) {
      if (formData?.id) {
        toast.success(data?.message);
      }
      _getNeraca();
      setEdit(null);
      setEdit({ ...edit, [id]: 0 });
      setFormData({ ...formData, btnBio: "success" });
      hideModal("modalTemplateLaporanNeraca");
      return;
    }
  };

  const _deleteAkunNeraca = async (id) => {
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
        const { data } = await deleteAkunNeraca(id);

        if (data) {
          toast.success(data?.message);
          _getNeraca();
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
    const { id: sumberKategori, akunNeraca: sumberData } = kategori.find(
      (item) => item.id == source.droppableId
    );
    const { id: targetKategori, akunNeraca: targetData } = kategori.find(
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
      // console.log({
      //   d,
      //   datas: sumberData?.find((item) => item.id == d)?.akun?.id,
      //   idx,
      // });
      _editAkunNeraca(
        d,
        sumberData?.find((item) => item.id == d)?.akun?.id,
        idx + 1
      );
    });
  };

  useEffect(() => {
    _getNeraca();
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

  const navItems = [
    {
      url: `${ssURL}/laporan-keuangan/neraca/template-laporan?subnav=aktiva`,
      as: `${ssURL}/laporan-keuangan/neraca/template-laporan?subnav=aktiva`,
      text: "Aktiva",
      active: subnav == "aktiva" || !subnav,
      dataJoyride: "saat-ini",
    },
    {
      url: `${ssURL}/laporan-keuangan/neraca/template-laporan?subnav=pasiva`,
      as: `${ssURL}/laporan-keuangan/neraca/template-laporan?subnav=pasiva`,
      text: "Pasiva",
      active: subnav == "pasiva",
      dataJoyride: "saat-ini",
    },
  ];

  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/laporan-keuangan`}
      title={`Realisasi`}
    >
      <AnimatePage>
        <HeaderLaporanNeraca ssURL={ssURL} />
        <Navbar
          nav={navItems}
          action={[
            {
              button: (
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
              ),
            },
          ]}
        />
        <div className="card card-ss p-4">
          <div
            style={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
            }}
          >
            <DragDropContext
              // onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
              onDragEnd={(result) =>
                shiftArray(
                  result,
                  Neraca?.filter((d) => {
                    const nav = subnav || "aktiva";
                    return d?.tipe == nav;
                  })
                )
              }
            >
              {Neraca?.filter((d) => {
                const nav = subnav || "aktiva";
                return d?.tipe == nav;
              })?.map((d, idx) => {
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
                              {d?.akunNeraca?.map((akun, index, thisArray) => {
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
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <div
                                            className={`table-kerja d-flex flex-column flex-md-row ${
                                              akun?.dihapus ? "deleted" : ""
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
                                              {/* <span className="d-flex d-md-none w-50">
                                                Nama Mapel Rapor
                                              </span> */}
                                              {/* {edit[akun?.id] ? (
                                                <div className="w-100 color-dark">
                                                  <Select
                                                    placeholder="Pilih Akun"
                                                    defaultValue={{
                                                      label: akun?.akun?.nama,
                                                      value: akun?.akun?.id,
                                                    }}
                                                    onChange={(opt) => {
                                                      setFormData({
                                                        ...formData,
                                                        mKeuAkunId:
                                                          opt?.value || "",
                                                      });
                                                    }}
                                                    isClearable
                                                    options={keuangan
                                                      ?.filter(
                                                        (e) =>
                                                          !thisArray.find(
                                                            (d) =>
                                                              d?.akun?.id ==
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
                                              ) : ( */}
                                              <p className="m-0">
                                                {akun?.akun?.nama}
                                              </p>
                                              {/* )} */}
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
                                              {/* {edit[akun?.id] ? (
                                                <>
                                                  <a
                                                    className="me-3"
                                                    onClick={() => {
                                                      _editAkunNeraca(
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
                                                      <FaTimes className="text-primary" />
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
                                                  <a
                                                    onClick={() => {
                                                      _deleteAkunNeraca(
                                                        akun?.id
                                                      );
                                                    }}
                                                    style={{
                                                      paddingRight: "16px",
                                                    }}
                                                  >
                                                    <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center">
                                                      <FaTrashAlt />
                                                    </div>
                                                  </a>
                                                </>
                                              )} */}
                                              <>
                                                <a
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#modalTemplateLaporanNeraca"
                                                  onClick={() => {
                                                    setEdit(akun);
                                                    setDitambah(null);
                                                    // setShowInput(mapel.id);
                                                  }}
                                                  // onClick={() => {
                                                  //   setEdit(akun?.id);
                                                  // }}
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
                                                <a
                                                  onClick={() => {
                                                    _deleteAkunNeraca(akun?.id);
                                                  }}
                                                  style={{
                                                    paddingRight: "16px",
                                                  }}
                                                >
                                                  <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center">
                                                    <FaTrashAlt />
                                                  </div>
                                                </a>
                                              </>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
                              <div className="table-kerja pointer">
                                {/* {ditambah[d.id] ? (
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
                                                !d?.akunNeraca?.find(
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
                                          _postAkunNeraca(d?.id, 1);
                                          // setShowInput(mapel.id);
                                        }}
                                        style={{
                                          display: "block",
                                        }}
                                      >
                                        <div
                                          className={`rounded-circle p-2 d-flex justify-content-center align-items-center hover-shadow-none me-3 ${
                                            d.warna ? "" : "shadow-primary-ss"
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
                                            d.warna ? "" : "shadow-danger-ss"
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
                                )} */}
                                <div
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalTemplateLaporanNeraca"
                                  className="table-kerja-list tambah-table-kerja"
                                  style={{
                                    borderColor: d.warna,
                                    background: `${d.warna}11`,
                                    color: d.warna,
                                    minHeight: "56px",
                                  }}
                                  onClick={() => {
                                    setDitambah({ id: d.id });
                                    setEdit(null);
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
        </div>
        <ModalKategoriTemplateLaporanKeuangan
          formData={formData}
          handleChangeForm={handleChangeForm}
          _postKategori={() => {
            formData?.id ? _putKategori(formData?.id) : _postKategori();
          }}
        />
        <ModalTemplateLaporanNeraca
          keuangan={keuangan}
          formData={formData}
          setFormData={setFormData}
          handleChangeForm={handleChangeForm}
          edit={edit}
          setEdit={setEdit}
          _editAkunNeraca={_editAkunNeraca}
          _postAkunNeraca={_postAkunNeraca}
        />
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({ query: { subnav } }) {
  return {
    props: {
      subnav: subnav || null,
    },
  };
}

export default index;
