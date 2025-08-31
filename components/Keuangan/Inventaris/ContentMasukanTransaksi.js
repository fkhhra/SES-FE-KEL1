import { DatePicker, InputNumber } from "antd";
import { editMutasiV2, postMutasiV2 } from "client/MutasiClient";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import {
  currencyFormatter,
  formatAngkaTitik,
  momentPackage,
} from "utilities/HelperUtils";
import SelectShared from "../../../components/Shared/SelectShared/SelectShared";
import { hideModal } from "../../../utilities/ModalUtils";

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

const ContentMasukanTransaksi = ({
  editData,
  akun,
  _getMutasi,
  rencana,
  formData,
  setFormData,
  debit,
  setDebit,
  kredit,
  setKredit,
}) => {
  const [btn, setBtn] = useState("idle");
  // const [formData, setFormData] = useState(initialFormData);

  // const [debit, setDebit] = useState(0);
  // const [kredit, setKredit] = useState(0);
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

  useEffect(() => {
    if (editData) {
      setFormData({
        ...initialFormData,
        ...editData,
        nama: `${editData?.nama} - ${editData?.merk}`,
        namaAsli: editData?.nama,
      });
    } else {
      setFormData(initialFormData);
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
    // <div
    //   className="modal modal-ss fade"
    //   id="newModalTambahTransaksi"
    //   tabIndex="-1"
    //   aria-labelledby="newModalTambahTransaksiLabel"
    //   aria-hidden="true"

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
                {/* <div className="mb-4">
                  <label className="form-label">Nama</label>
                  <input
                    className="form-control"
                    disabled
                    placeholder="Tuliskan nama"
                    type="text"
                    value={formData?.nama}
                    name="nama"
                    onChange={handleChangeForm}
                    maxLength={255}
                  />
                </div> */}
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
                      <label className="form-label">Tanggal Transaksi</label>
                      <DatePicker
                        className="form-control"
                        autoComplete="off"
                        value={formData?.tanggal || ""}
                        // showTime={{ format: "HH:mm" }}
                        placeholder="Pilih tanggal"
                        onChange={handleChangeDatePicker}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label className="form-label">Nomor Transaksi</label>
                      <input
                        className="form-control"
                        placeholder="Tuliskan nomor Transaksi"
                        type="text"
                        value={formData?.nomor}
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
                      ?.find((d) => d?.id == formData?.mRencanaTransaksiId)
                      ?.jurnal?.map((d) => {
                        return (
                          <tr>
                            <td>Perlengkapan Usaha</td>
                            <td>
                              {d?.jenis == "debit"
                                ? `Rp${formatAngkaTitik(d?.saldo)}`
                                : ""}
                              {/* 860.000 */}
                            </td>
                            <td>
                              {d?.jenis == "kredit"
                                ? `Rp${formatAngkaTitik(d?.saldo)}`
                                : ""}
                              {/* kredit */}
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
                <h5 className="fs-18-ss color-dark fw-bold">Jurnal Umum</h5>
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
                            <SelectShared
                              name="m_keu_akun_id"
                              handleChangeSelect={(e, name) =>
                                handleChangeJurnal(e, name, idx)
                              }
                              value={d.m_keu_akun_id}
                              options={akun?.map((d) => {
                                return { value: d?.id, label: d?.nama };
                              })}
                              placeholder="Pilih akun"
                            />
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
                                parser={(value) => value.replace(/Rp|\./g, "")}
                                onChange={(value) =>
                                  handleChangeJurnal({ value }, "debit", idx)
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
                                parser={(value) => value.replace(/Rp|\./g, "")}
                                onChange={(value) =>
                                  handleChangeJurnal({ value }, "kredit", idx)
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
                        ?.find((d) => d?.id == formData?.mRencanaTransaksiId)
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
                    {/* Total Debit:
                    3 */}
                  </span>
                  <span className="label-ss label-light-primary-ss rounded-pill fw-bold">
                    Total Kredit: {currencyFormatter(kredit)}
                    {/* Total
                    Kredit: 4 */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // {/* </div> */}
  );
};

export default ContentMasukanTransaksi;
