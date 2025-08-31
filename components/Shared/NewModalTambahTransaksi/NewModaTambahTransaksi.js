import Avatar from "../../../components/Shared/Avatar/Avatar";
import SelectShared from "../../../components/Shared/SelectShared/SelectShared";
import ReactiveButton from "reactive-button";
import React, { useEffect, useState } from "react";
import {
  FaExclamation,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { hideModal } from "../../../utilities/ModalUtils";
import { DatePicker, InputNumber } from "antd";
import {
  currencyFormatter,
  formatAngkaTitik,
  momentPackage,
} from "utilities/HelperUtils";
import toast from "react-hot-toast";
import { editMutasiV2, postMutasiV2 } from "client/MutasiClient";

const initialFormData = {
  nama: "",
  tanggal: momentPackage(),
  mRencanaTransaksiId: "",
  nomor: "",
  jurnal: [
    {
      jenis: "",
      m_keu_akun_id: "",
      kredit: 0,
      debit: 0,
    },
  ],
};

const NewModalTambahTransaksi = ({ editData, akun, _getMutasi, rencana }) => {
  const [btn, setBtn] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [debit, setDebit] = useState(0);
  const [kredit, setKredit] = useState(0);
  const [collapseOpen, setcollapseOpen] = useState(false);

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function handleChangeDatePicker(date, dateString) {
    setFormData({
      ...formData,
      tanggal: dateString ? momentPackage(dateString) : "",
    });
  }

  const handleChangeJurnal = (e, name, idx) => {
    let temp = formData?.jurnal;
    temp[idx] = {
      ...temp[idx],
      [name]: e.value,
    };
    setFormData({ ...formData, jurnal: temp });
  };

  const handleSubmit = async () => {
    if (!formData.nama) {
      toast.error("Harap memasukan nama transaksi");
      return;
    }
    // if (!formData.mRencanaTransaksiId) {
    //   toast.error("Harap Memilih Rencana transaksi");
    //   return;
    // }
    if (!formData.tanggal) {
      toast.error("Harap memasukan tanggal transaksi");
      return;
    }
    if (
      formData?.jurnal.length == 0 ||
      formData?.jurnal?.filter((d) => d.m_keu_akun_id).length == 0
    ) {
      toast.error("Harap memasukan jurnal transaksi");
      return;
    }
    if (!kredit || !debit) {
      toast.error("Kredit dan debit wajib di isi");
      return;
    }
    if (kredit != debit) {
      toast.error("Jumlah kredit dan debit tidak balance");
      return;
    }
    setBtn("loading");
    const payload = {
      ...formData,
      tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD HH:mm:00"),
      jurnal: formData.jurnal.map((d) => {
        const saldo = d.kredit || d.debit;
        const jenis = d.kredit ? "kredit" : "debit";
        return { ...d, saldo, jenis };
      }),
    };

    const { data, error } = formData?.id
      ? await editMutasiV2(payload, formData?.id)
      : await postMutasiV2(payload);

    if (data) {
      setBtn("success");
      toast.success(data.message);
      hideModal("newModalTambahTransaksi");
      _getMutasi();
      setFormData(initialFormData);
    } else {
      toast.error(error.message);
      setBtn("error");
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData });
    } else {
      setFormData({ ...initialFormData });
    }
  }, [editData]);

  useEffect(() => {
    let debit = 0;
    let kredit = 0;
    formData?.jurnal?.forEach((d, idx) => {
      debit += d.debit;
      kredit += d.kredit;
    });
    setKredit(kredit);
    setDebit(debit);
  }, [formData]);

  return (
    <div
      className="modal modal-ss fade"
      id="newModalTambahTransaksi"
      tabIndex="-1"
      aria-labelledby="newModalTambahTransaksiLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      className="modal-title"
                      id="newModalTambahTransaksiLabel"
                    >
                      <h4 className="mb-1 fw-extrabold">Tambah Transaksi</h4>
                      <span className="fs-6 fw-normal">
                        Isi informasi dibawah untuk menambahkan transaksi
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => hideModal("newModalTambahTransaksi")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-body p-md-4 p-2">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="card card-ss"
                    style={{ minHeight: "calc(100vh - 213px)" }}
                  >
                    <div className="p-4">
                      <h4 className="fw-extrabold color-dark mb-4">
                        Informasi Transaksi
                      </h4>
                      <div className="mb-4">
                        <label className="form-label">Nama</label>
                        <input
                          className="form-control"
                          placeholder="Tuliskan nama"
                          type="text"
                          value={formData?.nama}
                          name="nama"
                          onChange={handleChangeForm}
                          maxLength={255}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Pilih Perencanaan</label>
                        <SelectShared
                          name="mRencanaTransaksiId"
                          handleChangeSelect={(e, name) =>
                            handleChangeForm({
                              target: {
                                name: "mRencanaTransaksiId",
                                value: e?.value,
                              },
                            })
                          }
                          value={formData?.mRencanaTransaksiId}
                          options={rencana?.transaksi?.map((d) => {
                            return { value: d?.id, label: d?.nama };
                          })}
                          placeholder="Pilih perencanaan"
                          isClearable
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">
                              Tanggal Transaksi
                            </label>
                            <DatePicker
                              className="form-control"
                              autoComplete="off"
                              value={formData.tanggal || ""}
                              // showTime={{ format: "HH:mm" }}
                              placeholder="Pilih tanggal"
                              onChange={handleChangeDatePicker}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">
                              Nomor Transaksi
                            </label>
                            <input
                              className="form-control"
                              placeholder="Tuliskan nomor Transaksi"
                              type="text"
                              value={formData?.nomor || ""}
                              name="nomor"
                              onChange={handleChangeForm}
                              maxLength={255}
                            />
                          </div>
                        </div>
                      </div>
                      <h5 className="fs-18-ss color-dark fw-bold">
                        Rencana Anggaran
                      </h5>
                      <table className="table-ss mb-4">
                        <thead>
                          <tr>
                            <th style={{ width: "50%" }}>Nama Akun</th>
                            <th>Debit</th>
                            <th>Kredit</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rencana?.transaksi
                            ?.find(
                              (d) => d?.id == formData?.mRencanaTransaksiId
                            )
                            ?.jurnal?.map((d) => {
                              const temp = akun?.find(
                                (e) => e?.id == d?.mKeuAkunId
                              );
                              return (
                                <tr>
                                  <td>
                                    {temp?.kode} - {temp?.nama}
                                  </td>
                                  <td>
                                    {d?.jenis == "debit"
                                      ? `Rp${formatAngkaTitik(d?.saldo)}`
                                      : ""}
                                  </td>
                                  <td>
                                    {d?.jenis == "kredit"
                                      ? `Rp${formatAngkaTitik(d?.saldo)}`
                                      : ""}
                                  </td>
                                  <td></td>
                                </tr>
                              );
                            })}
                          {/* <tr>
                            <td>Kas</td>
                            <td></td>
                            <td>860.000</td>
                            <td></td>
                          </tr> */}
                        </tbody>
                      </table>
                      <h5 className="fs-18-ss color-dark fw-bold">
                        Jurnal Umum
                      </h5>
                      <table className="table-ss">
                        <thead>
                          <tr>
                            <th style={{ width: "50%" }}>Nama Akun</th>
                            <th>Debit</th>
                            <th>Kredit</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData?.jurnal?.map((d, idx) => {
                            return (
                              <tr>
                                <td>
                                  <div className="">
                                    <SelectShared
                                      name="m_keu_akun_id"
                                      handleChangeSelect={(e, name) =>
                                        handleChangeJurnal(e, name, idx)
                                      }
                                      value={d.m_keu_akun_id}
                                      options={akun?.map((d) => {
                                        return {
                                          value: d?.id,
                                          label: `${d?.kode} - ${d?.nama}`,
                                        };
                                      })}
                                      placeholder="Pilih akun"
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="input-saldo-rekening">
                                    <InputNumber
                                      className="form-control w-100"
                                      formatter={(value) =>
                                        `Rp${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          "."
                                        )
                                      }
                                      placeholder="Rp. 0"
                                      autoComplete="off"
                                      name="nominal"
                                      value={d.debit}
                                      parser={(value) =>
                                        value.replace(/Rp|\./g, "")
                                      }
                                      onChange={(value) =>
                                        handleChangeJurnal(
                                          { value },
                                          "debit",
                                          idx
                                        )
                                      }
                                      step={1000}
                                      disabled={d.kredit > 0 ? 1 : 0}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="input-saldo-rekening">
                                    <InputNumber
                                      className="form-control w-100"
                                      formatter={(value) =>
                                        `Rp${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          "."
                                        )
                                      }
                                      placeholder="Rp. 0"
                                      autoComplete="off"
                                      name="nominal"
                                      value={d.kredit}
                                      parser={(value) =>
                                        value.replace(/Rp|\./g, "")
                                      }
                                      onChange={(value) =>
                                        handleChangeJurnal(
                                          { value },
                                          "kredit",
                                          idx
                                        )
                                      }
                                      step={1000}
                                      disabled={d.debit > 0 ? 1 : 0}
                                    />
                                  </div>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        jurnal: formData.jurnal.filter(
                                          (d, index) => index != idx
                                        ),
                                      })
                                    }
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <button
                        className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-3 me-auto"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            jurnal: [
                              ...formData.jurnal,
                              {
                                jenis: "",
                                m_keu_akun_id: "",
                                kredit: 0,
                                debit: 0,
                              },
                            ],
                          })
                        }
                      >
                        <FaPlus className="me-2" />
                        Tambah Akun
                      </button>
                    </div>
                    <hr className="mt-auto hr-ss mb-0" />
                    <div className="p-4">
                      <div className="d-flex justify-content-md-end align-items-md-center flex-md-row flex-column">
                        <span className="label-ss label-light-warning-ss rounded-pill fw-bold me-md-4 mb-md-0 mb-3">
                          Total Rencana Anggaran:{" "}
                          {currencyFormatter(
                            rencana?.transaksi
                              ?.find(
                                (d) => d?.id == formData?.mRencanaTransaksiId
                              )
                              ?.jurnal?.reduce((a, b) => {
                                if (b?.jenis == "debit") {
                                  return a + b?.saldo;
                                } else {
                                  return a;
                                }
                              }, 0)
                          )}
                        </span>
                        <span className="label-ss label-light-primary-ss rounded-pill fw-bold me-md-4 mb-md-0 mb-3">
                          Total Debit: {currencyFormatter(debit)}
                        </span>
                        <span className="label-ss label-light-primary-ss rounded-pill fw-bold">
                          Total Kredit: {currencyFormatter(kredit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-footer d-flex justify-content-center"
            style={{ zIndex: 1 }}
          >
            <div className="container">
              <div className="row ">
                <div className="col-md-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-3"
                    data-bs-dismiss="modal"
                    onClick={() => hideModal("newModalTambahTransaksi")}
                  >
                    Batal
                  </button>
                  <ReactiveButton
                    buttonState={btn}
                    onClick={handleSubmit}
                    color={"primary"}
                    idleText={`Simpan`}
                    loadingText={"Diproses"}
                    successText={"Berhasil"}
                    errorText={"Gagal"}
                    type={"button"}
                    data-bs-dismiss="modal"
                    className={"btn btn-primary"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewModalTambahTransaksi;
