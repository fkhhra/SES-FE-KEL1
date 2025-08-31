import { DatePicker } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { getKepada, postBroadcast, putBroadcast } from "client/BroadcastClient";
import { uploadFile } from "client/uploadFileClient";
import LoadingProgress from "components/Shared/LoadingProgress/LoadingProgress";
import React, { useEffect, useState } from "react";
import { FaPaperclip } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import ReactiveButton from "reactive-button";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
import { FileViewerComponent } from "../Shared/FileViewer/FileViewer";
import NewModal from "../Shared/NewModal/NewModal";

const initialFormData = {
  judul: "",
  pesan: "",
  draf: 0,
  tanggalDibagikan: "",
  kepada: [],
  userId: [],
  rombelId: [],
  jurusanId: [],
  lampiran: [],
};

const ModalBuatBroadcast = ({ _getData, editData }) => {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [btnState, setBtnState] = useState("idle");
  const [progress, setProgress] = useState(0);

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

  const _postBroadcast = async (draf = false) => {
    if (!formData?.judul.trim()) {
      toast.error("Masukan judul broadcast");
      return;
    }
    if (!formData?.pesan.trim()) {
      toast.error("Masukan pesan broadcast");
      return;
    }
    if (!formData?.kepada?.length) {
      toast.error("Pilih penerima broadcast");
      return;
    }
    if (!formData?.tanggalDibagikan) {
      toast.error("Masukan tanggal pembagian broadcast");
      return;
    }

    setBtnState("loading");
    const { data, error } = await postBroadcast({
      ...formData,
      kepada: JSON.stringify(formData?.kepada),
      draf,
    });

    if (data) {
      hideModal("modalBuatBroadcast");
      setFormData({ ...initialFormData });
      _getData();
    }
    setBtnState("idle");
  };

  const _putBroadcast = async (id, draf = false) => {
    if (!formData?.judul.trim()) {
      toast.error("Masukan judul broadcast");
      return;
    }
    if (!formData?.pesan.trim()) {
      toast.error("Masukan pesan broadcast");
      return;
    }
    if (!formData?.kepada?.length) {
      toast.error("Pilih penerima broadcast");
      return;
    }
    if (!formData?.tanggalDibagikan) {
      toast.error("Masukan tanggal pembagian broadcast");
      return;
    }

    setBtnState("loading");
    const { data, error } = await putBroadcast(id, {
      ...formData,
      kepada: JSON.stringify(formData?.kepada),
      draf,
    });

    if (data) {
      hideModal("modalBuatBroadcast");
      setFormData({ ...initialFormData });
      _getData();
    }
    setBtnState("idle");
  };

  const handleChangeForm = (e, data) => {
    if (data) {
      setFormData({ ...formData, [e.target.name]: data });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const uploadFileToServer = async (e) => {
    setBtnState("loading");
    if (!e.target.files[0]) setBtnState("idle");
    await uploadFile(e.target.files[0], checkProgress, (fileUrl) => {
      setFormData({
        ...formData,
        lampiran: [...formData.lampiran, fileUrl],
      });
      setBtnState("idle");
    });
  };

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      return setProgress(uploadProgress);
    }

    setTimeout(() => {
      setProgress(0);
    }, 500);
  };

  const loadKepada = async (input) => {
    const list = await _getKepada(input);

    return list;
  };

  useEffect(() => {
    if (editData) {
      const userId = [],
        rombelId = [],
        jurusanId = [];
      editData?.kepada?.map((d) => {
        if (d?.tipe == "rombel") {
          rombelId.push(d?.value);
        } else if (d?.tipe == "siswa") {
          userId.push(d?.value);
        } else if (d?.tipe == "jurusan") {
          jurusanId.push(d?.value);
        }
      });
      setFormData({
        ...editData,
        userId,
        rombelId,
        jurusanId,
        draf: editData?.draft,
      });
    } else {
      setFormData({ ...initialFormData });
    }
    return () => {};
  }, [editData]);

  return (
    <>
      <LoadingProgress progress={progress} />

      <NewModal
        modalId="modalBuatBroadcast"
        modalSize="fullscreen"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {editData?.id == 0 ? "Duplikat" : "Buat"} Broadcast
            </h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk membuat pesan broadcast
            </span>
          </>
        }
        content={
          <>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="card card-ss rounded-ss p-4 mb-md-0 mb-4">
                    <div className="row">
                      <h4 className="mb-4 fw-extrabold color-dark">
                        Pesan Broadcast
                      </h4>
                      <div className="mb-4">
                        <label className="form-label">Judul</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          type="text"
                          name="judul"
                          placeholder="Tuliskan judul"
                          value={formData?.judul}
                          onChange={handleChangeForm}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Pesan</label>
                        <TextArea
                          rows={4}
                          placeholder={"Pesan yang akan disampaikan"}
                          name="pesan"
                          value={formData?.pesan}
                          onChange={(e) => {
                            handleChangeForm(e);
                          }}
                          className="rounded-ss"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Kepada</label>
                        <AsyncSelect
                          type="text"
                          placeholder="Pilih penerima.."
                          isMulti
                          cacheOptions
                          value={formData?.kepada}
                          onChange={(value) => {
                            const userIds = [],
                              rombelIds = [],
                              jurusanIds = [];
                            value?.map((d) => {
                              if (d?.tipe == "rombel") {
                                rombelIds.push(d?.value);
                              } else if (d?.tipe == "siswa") {
                                userIds.push(d?.value);
                              } else if (d?.tipe == "jurusan") {
                                jurusanIds.push(d?.value);
                              }
                            });
                            setFormData({
                              ...formData,
                              userId: userIds,
                              rombelId: rombelIds,
                              jurusanId: jurusanIds,
                              kepada: value,
                            });
                          }}
                          defaultOptions
                          menuPlacement={"auto"}
                          loadOptions={loadKepada}
                          noOptionsMessage={() =>
                            "Data Tidak ditemukan, masukan kata kunci baru"
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Jadwal Dikirimkan</label>

                        <DatePicker
                          onChange={(date, dateString) =>
                            setFormData({
                              ...formData,
                              tanggalDibagikan: date.format(
                                "YYYY-MM-DD HH:mm:ss"
                              ),
                            })
                          }
                          showTime={{ format: "HH:mm" }}
                          minuteStep={10}
                          placeholder="Pilih Tanggal"
                          className="form-control"
                          autoComplete="off"
                          value={
                            formData?.tanggalDibagikan
                              ? momentPackage(formData?.tanggalDibagikan)
                              : ""
                          }
                          format="DD-MM-YYYY"
                        />
                      </div>
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-4">
                          <label className="form-label me-3">Lampiran</label>
                          <div className="d-flex align-items-md-center flex-md-row flex-column justify-content-between mt-xl-0 mt-md-2 mt-3">
                            <label
                              htmlFor="formFileMultiple"
                              className="d-flex align-items-center justify-content-center form-label m-0 fs-6 btn btn-ss fs-14-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 fw-bold mb-md-0 mb-3"
                            >
                              <FaPaperclip className="me-2" />
                              <p className="mb-0">Unggah File</p>
                            </label>
                            <input
                              className="form-control d-none"
                              type="file"
                              name="formFileMultiple"
                              id="formFileMultiple"
                              onChange={uploadFileToServer}
                            />
                          </div>
                        </div>
                        {formData?.lampiran?.map((d, idx) => {
                          return (
                            <FileViewerComponent
                              d={d}
                              key={`file-${idx}`}
                              handleDelete={() => {
                                let temp = formData.lampiran;
                                temp.splice(idx, 1);
                                setFormData({
                                  ...formData,
                                  lampiran: temp,
                                });
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        leftButton={
          <button
            className="btn py-2 px-4 btn-warning btn-warning-ss rounded-pill fw-semibold"
            onClick={() =>
              editData?.id
                ? _putBroadcast(editData?.id, true)
                : _postBroadcast(true)
            }
          >
            Draf
          </button>
        }
        submitButton={
          <ReactiveButton
            buttonState={btnState}
            color={"primary"}
            idleText={"Kirim"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() =>
              editData?.id ? _putBroadcast(editData?.id) : _postBroadcast()
            }
          />
        }
      />
    </>
  );
};

export default ModalBuatBroadcast;
