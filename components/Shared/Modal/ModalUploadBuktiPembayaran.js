import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import ReactiveButton from "reactive-button";
import NewModal from "../NewModal/NewModal";
import bankData from "../../../data/bank.json";
import SelectShared from "../SelectShared/SelectShared";
import UploadBanner from "../UploadBanner/UploadBanner";
import { InputNumber } from "antd";
import InputFile from "../InputFile/InputFile";
import Select, { components } from "react-select";
import { momentPackage } from "utilities/HelperUtils";
import { uuid } from "uuidv4";
import useSekolah from "hooks/useSekolah";

const ModalUploadBuktiPembayaran = ({ _editPendaftarPPDB, editData }) => {
  const initialStateForm = {
    bank: "",
    norek: "",
    namaPemilik: "",
    bukti: "",
    btnState: "idle",
    diverifikasi: 0,
    createdAt: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    id: uuid(),
  };
  const [formData, setFormData] = useState(initialStateForm);

  useEffect(() => {
    setFormData(initialStateForm);
  }, [editData]);

  const { sekolah } = useSekolah();
  
  const [cash, setCash] = useState(false);

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <div className="d-flex align-items-center">
          {props.data.img && (
            <img
              src={props.data.img}
              alt={props.data.label}
              style={{ height: 50, width: 50, objectFit: "contain" }}
            />
          )}
          <div className="ms-4">
            <div>{props.data.label}</div>
            <div style={{ fontSize: 12 }}>{props.data.value}</div>
          </div>
        </div>
      </components.Option>
    );
  };

  const handleChangeSelect = (e) => {
    setFormData({
      ...formData,
      bank: e?.value,
    });
  };

  const handleChangeForm = (e, uploadedFile) => {
    if (uploadedFile) {
      setFormData({
        ...formData,
        [e.target.name]: uploadedFile,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <NewModal
      modalId="modalKonfirmasiPembayaran"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">Konfirmasi Pembayaran</h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk konfirmasi pembayaran
          </span>
        </>
      }
      content={
        <>
          <div className="mb-3">
            <div className="row">
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  name="flexRadioDefault"
                  id="radioYa"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="diambil"
                  checked={cash == true}
                  onClick={() => {
                    setCash(true);
                    setFormData({
                      bank: "tunai",
                      norek: "tunai",
                      namaPemilik: "tunai",
                    });
                  }}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="radioYa"
                >
                  <span className="ms-4 ps-2">Cash</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                  type="radio"
                  name="flexRadioDefault"
                  id="radioTidak"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="diambil"
                  checked={cash == false}
                  onClick={() => {
                    setCash(false);
                    setFormData(initialStateForm);
                  }}
                />
                <label
                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="radioTidak"
                >
                  <span className="ms-4 ps-2">Transfer</span>
                </label>
              </div>
            </div>
          </div>
          {!cash && (
            <>
              <div className="mb-4">
                <label className="form-label">Nama Bank</label>
                <Select
                  components={{ Option }}
                  options={bankData}
                  onChange={handleChangeSelect}
                  value={bankData?.filter(
                    (bank) => bank.value === formData.bank
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Nomor Rekening</label>
                <input
                  className="form-control"
                  placeholder="Tuliskan nomor rekening"
                  type="text"
                  name="norek"
                  value={formData.norek}
                  onChange={handleChangeForm}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Nama Pemilik Rekening</label>
                <input
                  className="form-control"
                  placeholder="Tuliskan nama pemilik"
                  type="text"
                  name="namaPemilik"
                  value={formData.namaPemilik}
                  onChange={handleChangeForm}
                />
              </div>
            </>
          )}

          {sekolah?.id !== 70 && (
            <div className="mb-4">
              <label className="form-label">Nominal</label>
              <InputNumber
                className="form-control w-100"
                formatter={(value) =>
                  `Rp${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                placeholder="Rp. 0"
                autoComplete="off"
                name="nominal"
                value={formData.nominal}
                parser={(value) => value.replace(/Rp|\./g, "")}
                onChange={(value) =>
                  handleChangeForm({ target: { name: "nominal", value } })
                }
                step={1000}
              />
              {/* Alternatif input biasa */}
              {/* <input
      className="form-control"
      placeholder="Rp. 0"
      type="number"
      name="nominal"
      value={formData.nominal}
      onChange={handleChangeForm}
    /> */}
            </div>
          )}


          <div className="mb-4">
            <h6 className="form-label color-dark fw-bold">Bukti Pembayaran</h6>
            <div>
              {formData.bukti && (
                <div
                  className="position-relative mx-auto mt-3 mb-4"
                  style={{
                    width: "100%",
                  }}
                >
                  <>
                    <img
                      width="100%"
                      src={`${formData.bukti}`}
                      className="rounded"
                    />

                    <label
                      className="rounded-circle shadow-primary-ss position-absolute pointer"
                      htmlFor="bukti"
                      style={{
                        right: "5%",
                        top: "5%",
                        width: "50px",
                        height: "50px",
                        background: `url(/img/icon-edit-foto.svg)`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    ></label>
                  </>
                </div>
              )}
              {!formData.bukti && (
                <label htmlFor="bukti" className="form-label mb-4 w-100">
                  <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4">
                    <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                      <img src={`/img/icon-upload-dropfile.svg`} />
                      <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                        Klik untuk mengunggah{" "}
                        <span className="color-primary">Bukti Transaksi</span>
                      </span>
                    </div>
                  </div>
                </label>
              )}
              <InputFile
                name="bukti"
                id="bukti"
                onChange={(e, data) => {
                  if (data) {
                    setFormData({
                      ...formData,
                      bukti: data,
                    });
                  }
                }}
                accept="image/png, image/gif, image/jpeg"
              />
            </div>
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={formData.btnState}
          onClick={() => {
            if (!formData.bank) {
              swal({
                title: "Error!",
                text: "Harap isi nama bank sebelum konfirmasi.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              return
            }else if(!formData.norek) {
              swal({
                title: "Error!",
                text: "Harap isi nomor rekening sebelum konfirmasi.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              return
            }else if(!formData.namaPemilik) {
              swal({
                title: "Error!",
                text: "Harap isi nama pemilik rekening sebelum konfirmasi.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              return
            }else if(!formData.bukti) {
              swal({
                title: "Error!",
                text: "Harap unggah bukti transfer sebelum konfirmasi.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              return
            }
            // Jika validasi lolos, panggil fungsi untuk submit data
            _editPendaftarPPDB(formData);
          }}
          color={"primary"}
          idleText={"Konfirmasi Pembayaran"}
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

export default ModalUploadBuktiPembayaran;
