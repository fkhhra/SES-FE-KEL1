import {
  deleteAnalisis,
  getAnalisis,
  postAnalisis,
  putAnalisis,
} from "client/AnalisisKeuanganClient";
import HeaderAnalisisKeuangan from "components/Keuangan/AnalisisKeuangan/HeaderAnalisisKeuangan";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaCheck, FaPen, FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { arusKasHitungLevelAkun } from "utilities/KeuanganUtils";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";

const index = () => {
  const [formData, setFormData] = useState({
    nama: "",
    warna: "",
    btnBio: "idle",
  });
  const [template, setTemplate] = useState([]);
  const [ditambah, setDitambah] = useState(false);
  const [edit, setEdit] = useState({});
  const [akunKecil, setAkunKecil] = useState([]);

  const _getAnalisis = async () => {
    const { data } = await getAnalisis();

    if (data) {
      setTemplate(data?.analisis);
      const template = JSON.parse(data?.keuangan?.template || "[]");

      const akun = data?.akun;
      let temp = [];
      function recursive(data) {
        data.map((d) => {
          const akunKecil = akun?.find((e) => e?.id == d?.id);

          if (akunKecil) {
            if (d?.children?.length) {
              recursive(d?.children);
            } else {
              temp.push(akunKecil);
            }
          }
        });
      }
      recursive(template);

      const hasil = arusKasHitungLevelAkun(akun, template);
      // setLevelAkun(hasil);
      const hasilRencana = arusKasHitungLevelAkun(
        data?.akun,
        template,
        "rencanaJurnal"
      );
      setAkunKecil(temp);
    }
  };

  const _postAkun = async () => {
    if (!formData?.mKeuAkunId) {
      toast.error("harap memilih akun");
      return;
    }
    const { data } = await postAnalisis({ mKeuAkunId: formData?.mKeuAkunId });

    if (data) {
      toast.success(data?.message);
      setFormData({ mKeuAkunId: "" });
      setDitambah(false);
      _getAnalisis();
    }
  };

  const _putAkun = async (id) => {
    if (!formData?.mKeuAkunId) {
      toast.error("harap memilih akun");
      return;
    }
    const { data } = await putAnalisis(id, {
      mKeuAkunId: formData?.mKeuAkunId,
    });

    if (data) {
      toast.success(data?.message);
      setFormData({ mKeuAkunId: "" });
      setEdit({ ...edit, [id]: false });
      _getAnalisis();
    }
  };

  const _deleteAkun = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteAnalisis(id);
        if (data) {
          toast.success(data?.message);
          _getAnalisis();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  useEffect(() => {
    _getAnalisis();
  }, []);

  return (
    <Layout isFluid={true}>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <HeaderAnalisisKeuangan ssURL={ssURL} />
          </div>
        </div>
        <div className="row gy-4">
          <div className="col-md-12">
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
                  onDragEnd={(result) => shiftArray(result, template)}
                >
                  <div className="mb-5 d-flex flex-column" key={0}>
                    <div className="d-flex align-content-center mb-4">
                      <h4 className={`fs-5 fw-bold m-0 me-4 color-primary`}>
                        Template Laporan
                      </h4>
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
                      <Droppable droppableId={`${1}`} key={`${1}`}>
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
                              {template?.map((akun, idx) => {
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
                                                // borderColor: d.warna,
                                                // background: `${d.warna}11`,
                                                // color: d.warna,
                                                minHeight: "56px",
                                              }}
                                            >
                                              {/* <span className="d-flex d-md-none w-50">
                                                Nama Mapel Rapor
                                              </span> */}
                                              {edit[akun?.id] ? (
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
                                                    options={akunKecil
                                                      ?.filter(
                                                        (e) =>
                                                          !template?.find(
                                                            (d) =>
                                                              d?.mKeuAkunId ==
                                                              e?.id
                                                          ) ||
                                                          e?.id ==
                                                            akun?.akun?.id
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
                                                // borderColor: d.warna,
                                                // background: `${d.warna}11`,
                                                // color: d.warna,
                                                minHeight: "56px",
                                              }}
                                            >
                                              <span className="d-flex d-md-none w-50">
                                                Aksi
                                              </span>
                                              {edit[akun?.id] ? (
                                                <a
                                                  onClick={() => {
                                                    _putAkun(akun?.id);
                                                    // setShowInput(null);
                                                  }}
                                                >
                                                  <div className="rounded-circle bg-primary p-2 d-flex justify-content-center align-items-center ">
                                                    <FaCheck color="white" />
                                                  </div>
                                                </a>
                                              ) : (
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
                                              )}
                                              <a
                                                onClick={() => {
                                                  _deleteAkun(akun?.id);
                                                }}
                                                style={{
                                                  paddingRight: "16px",
                                                }}
                                              >
                                                <div className="rounded-circle bg-soft-primary p-2 d-flex justify-content-center align-items-center">
                                                  <FaTrashAlt />
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
                              <div className="table-kerja pointer">
                                {ditambah ? (
                                  <>
                                    <div
                                      className="table-kerja-list bg-soft-primary color-primary"
                                      style={{
                                        // borderColor: d.warna,
                                        // background: `${d.warna}11`,
                                        // color: d.warna,
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
                                          options={akunKecil
                                            ?.filter(
                                              (e) =>
                                                !template?.find(
                                                  (d) => d?.mKeuAkunId == e?.id
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
                                      className="table-kerja-list me-2 d-flex justify-content-end bg-soft-primary color-primary"
                                      style={{
                                        // borderColor: d.warna,
                                        // background: `${d.warna}11`,
                                        // color: d.warna,
                                        minHeight: "56px",
                                      }}
                                    >
                                      <a
                                        onClick={() => {
                                          _postAkun();
                                          // setShowInput(mapel.id);
                                        }}
                                        style={{
                                          display: "block",
                                        }}
                                      >
                                        <div
                                          className="rounded-circle p-2 d-flex justify-content-center align-items-center me-2 bg-primary"
                                          style={
                                            {
                                              // background: `${d.warna}`,
                                            }
                                          }
                                        >
                                          <FaCheck className="text-white" />
                                        </div>
                                      </a>
                                      <a
                                        onClick={() => {
                                          setDitambah(!ditambah);
                                        }}
                                      >
                                        <div
                                          className="rounded-circle p-2 d-flex justify-content-center align-items-center bg-primary"
                                          style={
                                            {
                                              // background: `${d.warna}`,
                                            }
                                          }
                                        >
                                          <FaTimes className="text-white" />
                                        </div>
                                      </a>
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className="table-kerja-list tambah-table-kerja color-primary bg-soft-primary"
                                    style={{
                                      // borderColor: "#eef5ff",
                                      // background: "#c3c3c8",
                                      // color: "#2680EB",
                                      minHeight: "56px",
                                    }}
                                    onClick={() => setDitambah(!ditambah)}
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
                </DragDropContext>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
