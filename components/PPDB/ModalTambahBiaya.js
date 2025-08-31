import { InputNumber } from "antd";
import {
  postInformasiJalur,
  putInformasiJalur,
} from "client/InformasiJalurPpdb";
import { useEffect, useState } from "react";
// import jenisPrestasi from "../../../data/jenis-prestasi.json";
import toast from "react-hot-toast";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import { hideModal } from "../../utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";

const ModalTambahBiaya = ({
  tingkatPrestasi,
  _detailJalurPpdb,
  editData,
  isEdit,
  m_jalur_ppdb_id,
}) => {
  const initialState = { judul: "", biaya: [{ nama: "", biaya: 0 }] };
  const [formData, setFormData] = useState(initialState);

  const [buttonState, setButtonState] = useState("idle");

  const handleChangeForm = (e, idx) => {
    if (idx != null) {
      let temp = formData.biaya;
      temp[idx] = {
        ...temp[idx],
        [e.target.name]: e.target.value,
      };
      setFormData({ ...formData, biaya: temp });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const _postInformasiPpdb = async () => {
    setButtonState("loading");

    const payload = {
      biaya: formData.biaya,
      nama: formData.judul,
      m_jalur_ppdb_id,
      tipe: "biaya",
    };

    const { data } = isEdit
      ? await putInformasiJalur(editData?.id, payload)
      : await postInformasiJalur(payload);

    if (data) {
      setButtonState("success");
      toast.success(data.message);
      hideModal("modalTambahBiaya");
      _detailJalurPpdb();
    } else {
      setButtonState("error");
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        ...formData,
        judul: editData?.nama,
        biaya: editData?.biaya ? JSON.parse(editData?.biaya) : [],
      });
    } else {
      setFormData(initialState);
    }
  }, [editData]);

  return (
    <NewModal
      modalId="modalTambahBiaya"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {editData ? "Ubah" : "Tambah"} Biaya Tambahan
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {editData ? "mengubah" : "menambahkan"}{" "}
            Biaya Tambahan
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Judul Biaya</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Masukkan Judul Biaya. Cth: Biaya Gedung"
              type="text"
              name="judul"
              value={formData?.judul}
              onChange={(e) => handleChangeForm(e)}
            />
          </div>
          <div className="mb-4">
            {formData?.biaya?.map((d, idx) => {
              return (
                <div className=" d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3 align-items-start">
                  <div className="d-flex justify-content-between w-100 flex-column">
                    <div className="d-flex flex-row justify-content-between my-2 my-md-0 align-items-center">
                      <label className="form-label">
                        Nama {idx == 0 ? `` : `${idx + 1}`}
                      </label>
                    </div>
                    <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2 w-100">
                      <div className="mb-4">
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Masukkan Nama Biaya Tambahan"
                          type="text"
                          name="nama"
                          value={d.nama}
                          onChange={(e) => handleChangeForm(e, idx)}
                        />
                      </div>
                      <div className="">
                        <label className="form-label">
                          Jumlah Biaya {idx == 0 ? `` : `${idx + 1}`}
                        </label>
                        <InputNumber
                          className="form-control w-100"
                          formatter={(value) =>
                            `Rp${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                          }
                          placeholder="Rp. 0"
                          autoComplete="off"
                          name="nominal"
                          value={d.biaya}
                          parser={(value) => value.replace(/Rp|\./g, "")}
                          onChange={(value) =>
                            handleChangeForm(
                              { target: { value, name: "biaya" } },
                              idx
                            )
                          }
                          step={1000}
                        />
                      </div>
                    </div>
                  </div>

                  {idx == 0 ? null : (
                    <button
                      className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          biaya: formData.biaya.filter((e, index) => {
                            return index !== idx;
                          }),
                        })
                      }
                      style={{
                        width: "40px",
                        height: "40px",
                        position: "relative",
                        top: "40px",
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
              );
            })}
            {/* {pilihanJawabanPG.length < 5 && ( */}
            <button
              className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
              onClick={() =>
                setFormData({
                  ...formData,
                  biaya: [...formData.biaya, { nama: "", biaya: 0 }],
                })
              }
            >
              <FaPlus className="me-2" />
              Tambah Biaya
            </button>
            {/* )} */}
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={_postInformasiPpdb}
          color={"primary"}
          idleText={`${editData ? "Ubah" : "Tambah"}`}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};

export default ModalTambahBiaya;
