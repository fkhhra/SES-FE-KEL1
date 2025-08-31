import { DatePicker, InputNumber } from "antd";
import { editMutasiV2, postMutasiV2 } from "client/MutasiClient";
import {
  aprovalRencanaTransaksi,
  postRencanaTransaksi,
  putRencanaTransaksi,
} from "client/RencanaTransaksiClient";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import useRencana from "hooks/useRencanaKeuangan";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  nama: "",
  tanggal: "",
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

const ModalAprovalPerencanaan = ({ editData, akun, _getMutasi, id }) => {
  const { rencana } = useRencana();
  const [btn, setBtn] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  // console.log(formData);
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

  const handleClickDelete = (deleteId) => {
    swal({
      title: "Yakin ingin ditolak?",
      text: "Perhatikan kembali data yang ingin anda tolak",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await aprovalRencanaTransaksi(deleteId, {
          status: null,
        });
        if (data) {
          toast.success(data?.message);
          hideModal("modalAprovalPerencanaan");
          _getMutasi();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleSubmit = async () => {
    setBtn("loading");

    const { data, error } = await aprovalRencanaTransaksi(formData?.id, {
      status: 1,
    });

    if (data) {
      setBtn("success");
      toast.success(data.message);
      _getMutasi();
      hideModal("modalAprovalPerencanaan");
      setFormData(initialFormData);
    } else {
      toast.error(error.message);
      setBtn("error");
    }
  };

  const handleSubmit11 = async () => {
    if (!formData.nama) {
      toast.error("Harap memasukan nama transaksi");
      return;
    }
    if (!formData.tanggal && !rencana?.tanggalAwal) {
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
      tanggal: momentPackage(formData.tanggal || rencana?.tanggalAwal)
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:00"),
      jurnal: formData.jurnal
        .filter((d) => d.m_keu_akun_id)
        .map((d) => {
          const saldo = d.kredit || d.debit;
          const jenis = d.kredit ? "kredit" : "debit";
          return { ...d, saldo, jenis };
        }),
    };

    const { data, error } = formData?.id
      ? await putRencanaTransaksi(formData?.id, payload)
      : await postRencanaTransaksi(id, payload);

    if (data) {
      setBtn("success");
      toast.success(data.message);
      hideModal("modalAprovalPerencanaan");
      _getMutasi();
      setFormData(initialFormData);
    } else {
      toast.error(error.message);
      setBtn("error");
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({ ...initialFormData, ...editData });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  useEffect(() => {
    let debit = 0;
    let kredit = 0;
    formData?.jurnal
      ?.filter((d) => d.m_keu_akun_id)
      ?.forEach((d, idx) => {
        debit += d.debit;
        kredit += d.kredit;
      });
    setKredit(kredit);
    setDebit(debit);
  }, [formData]);

  return (
    <div
      className="modal modal-ss fade"
      id="modalAprovalPerencanaan"
      tabIndex="-1"
      aria-labelledby="modalAprovalPerencanaan"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="modal-title" id="modalAprovalPerencanaan">
                      <h4 className="mb-1 fw-extrabold">Proses Perencanaan</h4>
                      <span className="fs-6 fw-normal">
                        Memverifikasi proses perencanaan
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => hideModal("modalAprovalPerencanaan")}
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
                        Informasi Perencanaan
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
                          readOnly
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-4">
                            <label className="form-label">
                              Tanggal Perencanaan
                            </label>
                            <DatePicker
                              className="form-control"
                              autoComplete="off"
                              value={
                                formData.tanggal ||
                                momentPackage(rencana?.tanggalAwal)
                              }
                              // showTime={{ format: "HH:mm" }}
                              picker="month"
                              placeholder="Pilih tanggal"
                              disabledDate={(current) => {
                                return (
                                  current <
                                    momentPackage(rencana?.tanggalAwal).startOf(
                                      "day"
                                    ) ||
                                  current >
                                    momentPackage(rencana?.tanggalAkhir).endOf(
                                      "day"
                                    )
                                );
                              }}
                              onChange={handleChangeDatePicker}
                              disabled
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">
                              Nomor Transaksi
                            </label>
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
                        </div> */}
                      </div>
                      <h5 className="fs-18-ss color-dark fw-bold">
                        Jurnal Umum
                      </h5>
                      <table className="table-ss">
                        <thead>
                          <tr>
                            <th style={{ width: "50%" }}>Akun</th>
                            <th>Debit</th>
                            <th>Kredit</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData?.jurnal?.map((d, idx) => {
                            return (
                              <tr>
                                <td className="ps-3">
                                  <div className="select-akun-keuangan">
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
                                      isDisabled
                                    />
                                  </div>
                                </td>
                                <td className="ps-3">
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
                                      disabled
                                    />
                                  </div>
                                </td>
                                <td className="ps-3">
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
                                      disabled
                                    />
                                  </div>
                                </td>
                                <td></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <hr className="mt-auto hr-ss mb-0" />
                    <div className="p-4">
                      <div className="d-flex justify-content-md-end align-items-md-center flex-md-row flex-column">
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
                    className="btn btn-ss btn-outline-danger btn-outline-danger-ss rounded-pill me-sm-2 mb-sm-0 mb-3 fw-bold"
                    onClick={() => handleClickDelete(formData.id)}
                  >
                    Tolak Verifikasi
                  </button>
                  <ReactiveButton
                    buttonState={btn}
                    onClick={handleSubmit}
                    color={"primary"}
                    idleText={`Konfirmasi Verifikasi`}
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

export default ModalAprovalPerencanaan;
