import SelectShared from "components/Shared/SelectShared/SelectShared";
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
import { hideModal } from "utilities/ModalUtils";
import { DatePicker, InputNumber } from "antd";
import {
  currencyFormatter,
  formatAngkaTitik,
  momentPackage,
} from "utilities/HelperUtils";
import toast from "react-hot-toast";
import {
  aprovalTransaksi,
  editMutasiV2,
  postMutasiV2,
} from "client/MutasiClient";
import ListTransaksiAkun from "components/Mutasi/ListTransaksiAkun";

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

const ModalDataTransaksiAkun = ({
  dataTransaksi,
  editData,
  akun,
  _getMutasi,
  rencana,
}) => {
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

  const handleClickDelete = (deleteId) => {
    swal({
      title: "Yakin ingin ditolak?",
      text: "Perhatikan kembali data yang ingin anda tolak",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await aprovalTransaksi(
          {
            status: null,
          },
          deleteId
        );
        if (data) {
          toast.success(data?.message);
          hideModal("modalDataTransaksiAkun");
          _getMutasi();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleSubmit = async () => {
    setBtn("loading");

    const { data, error } = await aprovalTransaksi(
      {
        status: 1,
      },
      formData?.id
    );

    if (data) {
      setBtn("success");
      toast.success(data.message);
      _getMutasi();
      hideModal("modalDataTransaksiAkun");
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

  let totalDebit = 0;
  const totalDebit1 = dataTransaksi?.akunTransaksi
    ?.filter((d) => d?.jenis == "debit")
    .map((d) => {
      totalDebit = totalDebit + d?.saldo;
    });

  let totalKredit = 0;
  const totalKredit1 = dataTransaksi?.akunTransaksi
    ?.filter((d) => d?.jenis == "kredit")
    .map((d) => {
      totalKredit = totalKredit + d?.saldo;
    });

  return (
    <div
      className="modal modal-ss fade"
      id="modalDataTransaksiAkun"
      tabIndex="-1"
      aria-labelledby="modalDataTransaksiAkunLabel"
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
                      <h4 className="mb-1 fw-extrabold">
                        Data Buku Besar {dataTransaksi?.akun?.nama}
                      </h4>
                      {/* <span className="fs-6 fw-normal">
                        Data Buku Kerja 
                      </span> */}
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
                  <div className="table-responsive">
                    <table className="table-ss table-mutasi">
                      <thead>
                        <tr>
                          <th>Tanggal Transaksi</th>
                          {/* <th>Tanggal Perubahan</th> */}
                          <th style={{ width: "30%" }}>Keterangan Transaksi</th>
                          <th>Debit</th>
                          <th>Kredit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataTransaksi?.akunTransaksi?.map((d) => {
                          return <ListTransaksiAkun data={d} />;
                        })}
                        <tr>
                          <td></td>
                          <td className="color-dark">Total</td>
                          <td className={`color-dark fw-bold`}>
                            {currencyFormatter(totalDebit)}
                          </td>
                          <td className={`color-dark fw-bold`}>
                            {currencyFormatter(totalKredit)}
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td className="color-dark">Total Transaksi</td>
                          {totalDebit - totalKredit < 0 ? (
                            <>
                              <th></th>
                              <th className="border-start-0 color-dark fw-bold">
                                {currencyFormatter(totalDebit - totalKredit)}
                              </th>
                            </>
                          ) : (
                            <>
                              <th className={`color-dark fw-bold`}>
                                {currencyFormatter(totalDebit - totalKredit)}
                              </th>
                              <th></th>
                            </>
                          )}
                        </tr>
                        {/* {listMutasi?.data?.map((mutasi, idx) => (
                            <tr>
                              <td className="border-start-0">
                                {momentPackage(mutasi?.waktuDibuat).format(
                                  "DD/MM/YY"
                                )}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center flex-column">
                                  <p className="mb-1 color-dark">
                                    {mutasi?.nama}
                                  </p>
                                  <p className="mb-0 color-secondary fs-ss-14">
                                    {mutasi?.kategori}
                                  </p>
                                </div>
                              </td>
                              <td>
                                {rekeningSekolah?.find(
                                  (d) => d?.id == mutasi?.mRekSekolahId
                                )?.jenis || "Dana Sekolah"}
                              </td>
                              <td>
                                <span
                                  className={`color-${
                                    mutasi?.tipe == "kredit"
                                      ? "success"
                                      : "danger"
                                  } fw-bold`}
                                >
                                  {mutasi?.tipe == "kredit" ? "+" : "-"}
                                  {currencyFormatter(mutasi?.nominal)}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row">
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalTambahTransaksi"
                                    onClick={() => onClickEdit(mutasi)}
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => _deleteMutasi(mutasi?.id)}
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ModalDataTransaksiAkun;
