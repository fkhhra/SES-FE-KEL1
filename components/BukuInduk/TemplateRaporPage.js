import ModalEditNamaMapel from "components/Rapor/ModalEditNamaMapel";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaChevronDown,
  FaPen,
  FaPlus,
  FaTrashAlt,
  FaUndoAlt,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import swal from "sweetalert";
import {
  deleteKategori,
  deleteMapelRapor,
  editKategori,
  editMapel,
  postKategori,
} from "../../client/BukuIndukClient";
import { hideModal, showModal } from "../../utilities/ModalUtils";
import ModalKategori from "../RaporBukuInduk/ModalKategori";

const TemplateRaporPage = ({ id, kategoriMapel, _getRaporBukuInduk }) => {
  const [showInput, setShowInput] = useState(null);

  const initialStateForm = {
    namaMapel: "",
    idMapel: "",
    idKategori: "",
    namaKategori: "",
    warna: "",
    btnBio: "idle",
  };

  const [formData, setFormData] = useState({
    ...initialStateForm,
  });

  const editNamaMapel = async () => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await editMapel(formData.idMapel, {
      nama: formData.namaMapel,
    });
    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      _getRaporBukuInduk();
      hideModal("modalEditNamaMapel");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const editUrutanMapel = async (id, urutan) => {
    const { data, error } = await editMapel(id, {
      urutan: urutan,
    });
    if (data) {
      _getRaporBukuInduk();
      toast.success(data?.message);
    } else {
      toast.error(error?.message);
    }
  };

  const _postKategori = async () => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = formData?.idKategori
      ? await editKategori(formData.idKategori, {
          nama: formData.namaKategori,
          warna: formData.warna,
        })
      : await postKategori(id, {
          nama: formData.namaKategori,
          warna: formData.warna,
        });
    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      _getRaporBukuInduk();
      hideModal("modalBuatKategori");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onClickEdit = (data) => {
    if (data) {
      setFormData({
        namaMapel: data.nama,
        idMapel: data.id,
      });
    }
  };

  const onClickEditKategori = (data) => {
    if (data) {
      setFormData({
        idKategori: data.id,
        namaKategori: data.nama,
        warna: data.warna,
      });
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
        const { data, error } = await deleteKategori(id);
        if (data) {
          _getRaporBukuInduk();
          toast.success(data?.message);
        } else {
          // error?.map((err) => toast.error(err?.message));
          // setButtonState("error");
        }
      }
    });
  };

  const _deleteMapelRapor = async (id, hide) => {
    swal({
      title: `Yakin ingin ${hide ? "dihapus" : "dikembalikan"}?`,
      text: hide
        ? "Perhatikan kembali data yang ingin anda hapus"
        : "Data yang dihapus akan dikembalikan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteMapelRapor(id, { hide });
        if (data) {
          _getRaporBukuInduk();
          toast.success(data?.message);
        } else {
          // error?.map((err) => toast.error(err?.message));
          // setButtonState("error");
        }
      }
    });
  };

  const shiftArray = ({ source, destination, draggableId }, kategori) => {
    if (!destination || source.index == destination.index) {
      return;
    }
    const { id: sumberKategori, mapelRapor: sumberData } = kategori.find(
      (item) => item.id == source.droppableId
    );
    const { id: targetKategori, mapelRapor: targetData } = kategori.find(
      (item) => item.id == destination.droppableId
    );

    const sumberIds = sumberData.map((item) => item.id);
    const targetIds = targetData.map((item) => item.id);
    let temp;
    if (sumberKategori === targetKategori) {
      temp = sumberIds.splice(source.index, 1);
      sumberIds.splice(destination.index, 0, ...temp);
      editUrutanMapel(draggableId, [
        { kategori_id: sumberKategori, mapel_ids: sumberIds },
      ]);
    } else {
      temp = sumberIds.splice(source.index, 1);
      targetIds.splice(destination.index, 0, ...temp);
      editUrutanMapel(draggableId, [
        { kategori_id: sumberKategori, mapel_ids: sumberIds },
        { kategori_id: targetKategori, mapel_ids: targetIds },
      ]);
    }
    const urutan = [
      { kategori_id: sumberKategori, mapel_ids: sumberIds },
      { kategori_id: targetKategori, mapel_ids: targetIds },
    ];
  };
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-ss p-4 mb-4">
          <div className="card-header card-header-ss m-0 p-0">
            <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row">
              <h4 className="fw-extrabold color-dark mb-md-0 text-center text-md-left">
                Daftar Mata Pelajaran
              </h4>
              <button
                type="button"
                className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#modalBuatKategori"
                onClick={() => setFormData(initialStateForm)}
                data-joyride="btn-tambah-mapel"
              >
                <FaPlus /> Buat Kategori
              </button>
            </div>
          </div>
        </div>

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
              onDragEnd={(result) => shiftArray(result, kategoriMapel)}
            >
              {kategoriMapel?.map((d, idx) => {
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
                            onClick={() => onClickEditKategori(d)}
                            data-bs-toggle="modal"
                            data-bs-target="#modalBuatKategori"
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
                    <div className="table-template table-template-heading mb-2 d-none d-md-flex">
                      <div className="table-template-list table-template-heading border-0">
                        Judul
                      </div>
                      <div className="table-template-list table-template-heading">
                        Nama Mapel di Rapor
                      </div>
                      <div className="table-template-list table-template-heading">
                        Guru Pengampuh
                      </div>

                      <div className="table-template-list table-template-heading"></div>
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
                              {d?.mapelRapor?.map((mapel, index) => {
                                return (
                                  <Draggable
                                    key={`${mapel?.id}`}
                                    draggableId={`${`${mapel?.id}`}`}
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
                                            background: mapel?.dihapus
                                              ? "#e1e1e7"
                                              : "rgba(244, 244, 247, .45)",
                                            color: "#80849C",
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <div
                                            className={`table-template d-flex flex-column flex-md-row ${
                                              mapel?.dihapus ? "deleted" : ""
                                            }`}
                                          >
                                            <div
                                              className="table-template-list"
                                              style={{
                                                borderColor: `${d?.warna}`,
                                              }}
                                            >
                                              <span className="d-flex d-md-none w-50">
                                                Judul
                                              </span>
                                              <p className="fw-semibold mb-0 text-decoration-none color-secondary">
                                                {mapel?.mataPelajaran?.nama}
                                              </p>
                                            </div>
                                            <div className="table-template-list ">
                                              <span className="d-flex d-md-none w-50">
                                                Nama Mapel Rapor
                                              </span>
                                              {showInput == mapel.id ? (
                                                <div>
                                                  <TextareaAutosize
                                                    className="form-control p-2 textarea-template-list"
                                                    style={{
                                                      width: "400px",
                                                    }}
                                                    minRows={1}
                                                    name="namaMapel"
                                                    defaultValue={mapel?.nama}
                                                    onChange={handleChangeForm}
                                                  />
                                                </div>
                                              ) : (
                                                <p className="m-0">
                                                  {mapel?.nama}
                                                </p>
                                              )}
                                            </div>
                                            <div
                                              className="table-template-list"
                                              style={{
                                                borderColor: `${d?.warna}`,
                                              }}
                                            >
                                              <span className="d-flex d-md-none w-50">
                                                Guru Pengampuh
                                              </span>
                                              <p className="fw-semibold mb-0 text-decoration-none color-secondary">
                                                {
                                                  mapel?.mataPelajaran?.user
                                                    ?.nama
                                                }
                                              </p>
                                            </div>
                                            <div className="table-template-list">
                                              <span className="d-flex d-md-none w-50">
                                                Aksi
                                              </span>
                                              {showInput == mapel.id ? (
                                                <a
                                                  onClick={() => {
                                                    editNamaMapel();
                                                    setShowInput(null);
                                                  }}
                                                >
                                                  <div className="rounded-circle bg-primary p-2 d-flex justify-content-center align-items-center ">
                                                    <FaCheck color="white" />
                                                  </div>
                                                </a>
                                              ) : (
                                                <a
                                                  onClick={() =>
                                                    onClickEdit(mapel)
                                                  }
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#modalEditNamaMapel"
                                                  // onClick={() => {
                                                  //   onClickEdit(mapel);
                                                  //   showModal(
                                                  //     "modalEditNamaMapel"
                                                  //   );
                                                  //   // setShowInput(mapel.id);
                                                  // }}
                                                  style={{
                                                    display: mapel.dihapus
                                                      ? "none"
                                                      : "block",
                                                  }}
                                                >
                                                  <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center ">
                                                    <FaPen />
                                                  </div>
                                                </a>
                                              )}
                                            </div>
                                            <div className="table-template-list me-2">
                                              <a
                                                onClick={() => {
                                                  _deleteMapelRapor(
                                                    mapel.id,
                                                    !mapel.dihapus
                                                  );
                                                }}
                                              >
                                                <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center">
                                                  {mapel.dihapus ? (
                                                    <FaUndoAlt />
                                                  ) : (
                                                    <FaTrashAlt />
                                                  )}
                                                </div>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
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
      </div>
      <ModalKategori
        handleChangeForm={handleChangeForm}
        formData={formData}
        _postKategori={_postKategori}
      />
      <ModalEditNamaMapel
        handleChangeForm={handleChangeForm}
        formData={formData}
        editNamaMapel={editNamaMapel}
        setFormData={setFormData}
        initialFormData={initialStateForm}
      />
    </div>
  );
};

export default TemplateRaporPage;
