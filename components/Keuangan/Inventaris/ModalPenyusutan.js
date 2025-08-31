import { getMajors } from "client/MajorsClient";
import { getStudent } from "client/StudentClient";
import { getAnggotaRombel, getRombel } from "client/RombelClient";
import {
  postInventarisPenyusutan,
  putInventarisPenyusutan,
} from "client/InventarisClient";
import Avatar from "components/Shared/Avatar/Avatar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  FaExclamation,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { hideModal } from "utilities/ModalUtils";
import { DatePicker, Dropdown, InputNumber } from "antd";
const { RangePicker } = DatePicker;
import { go as fuzzysort } from "fuzzysort";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";
import toast from "react-hot-toast";
import { detailMutasiV2 } from "client/MutasiClient";

const initialFormData = {
  mKeuTransaksiId: "",
  nilaiResidu: "",
  persentase: "",
  masaPakai: "",
  satuan: "",
  namaTransaksi: "",
  mKeuAkunDebetId: "",
  mKeuAkunKreditId: "",
  btnBio: "idle",
};
const ModalPenyusutan = ({
  _detailPenerimaanPkl,
  editData,
  id,
  data,
  _getInventarisPenyusutan,
  akun,
  transaksi,
}) => {
  const [collapseOpen, setcollapseOpen] = useState(false);

  const [dipilih, setDipilih] = useState([data]);
  const [jurusan, setJurusan] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [rombel, setRombel] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [debounceSearch] = useDebounce(searchSiswa, 400);
  const [buttonState, setButtonState] = useState("idle");
  const [transaksiData, setTransaksiData] = useState({});

  const _handleSubmit = async (akun) => {
    setButtonState("loading");
    const { data, error } = editData?.id
      ? await putInventarisPenyusutan(editData?.id, { ...formData })
      : await postInventarisPenyusutan({
          ...formData,
        });
    if (error) {
      toast.error(data?.message);
      setFormData({ ...formData, btnBio: "error" });
    }
    if (data) {
      setButtonState("success");

      toast.success(data?.message);
      hideModal("modalPenyusutanAset");
      _getInventarisPenyusutan();
    }
  };
  const _getTransaksi = async (id) => {
    const { data, error } = await detailMutasiV2(id);

    if (data) {
      setTransaksiData(data);
    }
  };

  console.log(transaksiData);

  const listDropdownValue = [
    {
      label: "Bulanan",
      value: "Bulan",
    },
    {
      label: "Tahunan",
      value: "Tahun",
    },
  ];
  const handleChangeSelect = (e, name) => {
    console.log(e);
    setFormData({
      ...formData,
      [e?.name]: e?.value,
    });
    if (e?.name == "mKeuTransaksiId") {
      _getTransaksi(e?.value);
    }
  };
  console.log(formData);
  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e?.name]: uploadedFile || e?.value,
    });
  };
  // useEffect(() => {
  //   if (data?.length) {
  //     setDipilih([...data]);
  //   }
  // }, [data]);
  useEffect(() => {
    if (editData !== null) {
      setFormData({
        id: editData?.id,
        mKeuTransaksiId: editData?.mKeuTransaksiId,
        nilaiResidu: editData?.nilaiResidu,
        persentase: editData?.persentase,
        masaPakai: editData?.masaPakai,
        satuan: editData?.satuan,
        namaTransaksi: editData?.nama,
        mKeuAkunDebetId: editData?.mKeuAkunDebetId,
        mKeuAkunKreditId: editData?.mKeuAkunKreditId,
      });
    } else {
      setFormData(initialFormData);
    }
    if (formData?.mKeuTransaksiId) {
      _getTransaksi();
    }
  }, [editData]);
  return (
    <div
      className="modal modal-ss fade"
      id="modalPenyusutanAset"
      tabIndex="-1"
      aria-labelledby="modalPenyusutanAsetLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="modal-title" id="modalPenyusutanAsetLabel">
                      <h4 className="mb-1 fw-extrabold">Penyusutan Aset</h4>
                      <span className="fs-6 fw-normal">
                        Isi informasi dibawah untuk menambahkan Penyusutan Aset
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => hideModal("modalPenyusutanAset")}
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
                        Informasi Penyusutan
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
                        <label className="form-label">Pilih Transaksi</label>
                        <SelectShared
                          name="mKeuTransaksiId"
                          handleChangeSelect={(e, name) =>
                            handleChangeSelect({
                              value: e?.value,
                              name: "mKeuTransaksiId",
                            })
                          }
                          value={formData?.mKeuTransaksiId}
                          options={transaksi?.map((d) => {
                            return { value: d?.id, label: d?.nama };
                          })}
                          placeholder="Pilih Aset"
                          isClearable
                        />
                      </div>
                      {/* <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Nilai Residu</label>
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
                              name="nilaiResidu"
                              value={formData?.nilaiResidu}
                              parser={(value) => value.replace(/Rp|\./g, "")}
                              onChange={(value) =>
                                handleChangeInput({
                                  value,
                                  name: "nilaiResidu",
                                })
                              }
                              step={1000}
                              // disabled={d.kredit > 0 ? 1 : 0}
                              max={transaksiData?.transaksi?.jurnalDebet?.saldo}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Persentase</label>
                            <InputNumber
                              className="form-control w-100"
                              placeholder="%"
                              formatter={(value) =>
                                `${value}%`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  "."
                                )
                              }
                              type="text"
                              value={formData?.persentase}
                              name="nomor"
                              onChange={(value) =>
                                handleChangeInput({
                                  value,
                                  name: "persentase",
                                })
                              }
                              maxLength={255}
                              max="100"
                            />
                          </div>
                        </div>
                      </div> */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Masa Pakai</label>
                            <InputNumber
                              className="form-control w-100"
                              placeholder="Masukkan Masa Pakai"
                              type="text"
                              value={formData?.masaPakai}
                              name="masaPakai"
                              onChange={(value) =>
                                handleChangeInput({
                                  value,
                                  name: "masaPakai",
                                })
                              }
                              maxLength={255}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Satuan</label>
                            <SelectShared
                              name="satuan"
                              handleChangeSelect={(e, name) =>
                                handleChangeSelect({
                                  value: e?.value,
                                  name: "satuan",
                                })
                              }
                              value={formData?.satuan}
                              options={listDropdownValue}
                              placeholder="Pilih Satuan"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-4">
                          <label className="form-label">
                            Nama Transaksi Penyusutan
                          </label>
                          <input
                            className="form-control"
                            placeholder="Tuliskan Nama Transaksi (Contoh : Akumulasi Penyusutan Bangunan)"
                            type="text"
                            value={formData?.namaTransaksi}
                            name="namaTransaksi"
                            onChange={(d) =>
                              handleChangeInput({
                                value: d?.target?.value,
                                name: "namaTransaksi",
                              })
                            }
                            maxLength={255}
                          />
                        </div>
                      </div>
                      <h5 className="fs-18-ss color-dark fw-bold">
                        Jurnal Umum
                      </h5>
                      <table className="table-ss">
                        <thead>
                          <tr>
                            <th style={{ width: "50%" }}>Nama Akun</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {formData?.jurnal?.map((d, idx) => {
                      return ( */}
                          <tr className="w-100">
                            <td width="70%">
                              <SelectShared
                                name="mKeuAkunDebetId"
                                handleChangeSelect={(e, name) =>
                                  handleChangeSelect({
                                    value: e?.value,
                                    name: "mKeuAkunDebetId",
                                  })
                                }
                                value={formData.mKeuAkunDebetId}
                                options={akun?.map((d) => {
                                  return {
                                    value: d?.id,
                                    label: `${d?.kode} - ${d?.nama}`,
                                  };
                                })}
                                placeholder="Pilih akun"
                              />
                            </td>
                            <td>
                              <div className="input-saldo-rekening">
                                <input
                                  type="text"
                                  className="form-control text-center"
                                  // value={formData?.roleBefore}
                                  value="DEBIT"
                                  disabled
                                />
                              </div>
                            </td>
                          </tr>
                          <tr className="w-100">
                            <td width="70%">
                              <SelectShared
                                name="mKeuAkunKreditId"
                                handleChangeSelect={(e, name) =>
                                  handleChangeSelect({
                                    value: e?.value,
                                    name: "mKeuAkunKreditId",
                                  })
                                }
                                value={formData.mKeuAkunKreditId}
                                options={akun?.map((d) => {
                                  return {
                                    value: d?.id,
                                    label: `${d?.kode} - ${d?.nama}`,
                                  };
                                })}
                                placeholder="Pilih akun"
                              />
                            </td>
                            <td>
                              <div className="input-saldo-rekening">
                                <input
                                  type="text"
                                  className="form-control text-center"
                                  // value={formData?.roleBefore}
                                  value="KREDIT"
                                  disabled
                                />
                              </div>
                            </td>
                          </tr>
                          {/* );
                    })} */}
                        </tbody>
                      </table>
                    </div>
                    <hr className="mt-auto hr-ss mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <div className="container">
              <div className="row ">
                <div className="col-md-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      hideModal("modalPenyusutanAset");
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary ms-3"
                    onClick={() => {
                      _handleSubmit();
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPenyusutan;
