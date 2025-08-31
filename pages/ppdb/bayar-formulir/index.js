import StepPPDBPembelian from "components/PPDB/StepPPDBPembelian";
import bankData from "data/bank.json";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { getGelombangPPDB } from "../../../client/GelombangPPDB";
import { editPendaftarPPDB } from "../../../client/PendaftarPPDBClient";
import { getRekeningSekolah } from "../../../client/RekeningSekolahClient";
import CardRiwayatTransaksi from "../../../components/Card/CardRiwayatTransaksi";
import Layout from "../../../components/PPDB/Layout";
import StepPPDB from "../../../components/PPDB/StepPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import ModalUploadBuktiPembayaran from "../../../components/Shared/Modal/ModalUploadBuktiPembayaran";
import usePPDB from "../../../hooks/usePPDB";
import { currencyFormatter } from "../../../utilities/HelperUtils";
import { hideModal } from "../../../utilities/ModalUtils";

const PilihJurusanPPDB = () => {
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang, gelombangPembelian } = gelombangPPDB;
  const [rekSekolah, setRekSekolah] = useState({});
  const { setTerdaftar } = usePPDB();

  const initialStateForm = {
    bank: "",
    norek: "",
    namaPemilik: "",
    nominal: "",
    bukti: "",
    btnState: "idle",
  };
  const [formData, setFormData] = useState(initialStateForm);
  const [pembayaran, setPembayaran] = useState([]);
  const [editData, setEditData] = useState(1);

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
      setFormData({ ...formData, ...data?.gelombangPembelian });
      setTerdaftar(data);
      setPembayaran(JSON.parse(data?.gelombangPembelian?.pembayaran || "[]"));
    }
  };

  const _getRekeningSekolah = async () => {
    const { data } = await getRekeningSekolah();
    if (data) {
      setRekSekolah(data?.rekSekolah);
    }
  };

  const _editPendaftarPPDB = async (newData) => {
    let payload;
    if (newData?.id) {
      payload = {
        pembayaran: JSON.stringify([
          ...pembayaran?.filter((d) => d?.id != newData?.id),
          newData,
        ]),
      };
    } else {
      payload = { pembayaran: JSON.stringify([...pembayaran, newData]) };
    }
    const { data, error } = await editPendaftarPPDB(
      gelombangPembelian?.id,
      payload
    );

    if (data) {
      setFormData({ ...formData, btnState: "success" });
      toast.success(data?.message);
      _getGelombangPPDB();
      hideModal("modalKonfirmasiPembayaran");
    } else {
      setFormData({ ...formData, btnState: "error" });
      toast.error(error?.message);
    }
  };

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
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

  const handleDeletePembayaran = (id) => {
    const payload = {
      pembayaran: JSON.stringify([...pembayaran?.filter((d) => d?.id != id)]),
    };
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await editPendaftarPPDB(
          gelombangPembelian?.id,
          payload
        );
        if (data) {
          toast.success(data?.message);
          _getGelombangPPDB();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  useEffect(() => {
    _getGelombangPPDB();
    _getRekeningSekolah();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDBPembelian />

          <div className="row gy-4">
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-body p-4">
                  <h4 className="fw-extrabold color-dark title-border mb-4">
                    Bayar Pendaftaran
                  </h4>
                  <p className="color-dark fw-bold">
                    Silahkan melakukan transfer ke rekening dibawah ini :
                  </p>
                  <div className="row">
                    <div className="col-md-8">
                      <table className="w-100">
                        <tr>
                          <td className="color-secondary fw-semibold">Bank</td>
                          <th>
                            :{" "}
                            <span className="color-dark fw-bold">
                              {
                                bankData?.find(
                                  (d) =>
                                    d.value ==
                                    gelombangPembelian?.gelombang?.bank
                                )?.label
                              }
                            </span>
                          </th>
                        </tr>
                        <tr>
                          <td className="color-secondary fw-semibold">
                            Nomor Rekening
                          </td>
                          <th>
                            :{" "}
                            <span className="color-dark fw-bold">
                              {gelombangPembelian?.gelombang?.norek}
                            </span>
                          </th>
                        </tr>
                        <tr>
                          <td className="color-secondary fw-semibold">
                            Atas Nama
                          </td>
                          <th>
                            :{" "}
                            <span className="color-dark fw-bold">
                              {" "}
                              {gelombangPembelian?.gelombang?.namaAkun}{" "}
                            </span>{" "}
                          </th>
                        </tr>
                        <tr>
                          <td className="color-secondary fw-semibold">
                            Status Pembayaran
                          </td>
                          <th>
                            :{" "}
                            <span className="color-dark fw-bold">
                              {" "}
                              Menunggu Biaya Pendaftaran
                            </span>{" "}
                          </th>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="bg-soft-primary text-center color-dark py-2 my-4 rounded-ss border border-primary-ss">
                    <p className="m-0 color-secondary">
                      Biaya Pendaftaran sebesar:
                    </p>
                    <h2 className="m-0 fw-black color-primary">
                      {currencyFormatter(
                        gelombangPembelian?.gelombang?.jalur?.biaya
                      )}
                    </h2>
                  </div>
                  <p>
                    Pastikan nominal transfer{" "}
                    <span className="fw-extrabold">
                      {" "}
                      TEPAT BERJUMLAH ANGKA DI ATAS (hingga 3 angka terakhir).
                    </span>{" "}
                    Agar memudahkan proses verifikasi. Panitia akan memverikasi
                    pembayaran anda kurang dari 1 x 24 jam.
                  </p>
                  {/* <div className="d-flex justify-content-between align-items-center">
                <label className="form-label">Unggah Bukti Transfer</label>
                <button
                  className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#modalKonfirmasiPembayaran"
                >
                  <FaPlus className="me-2" />
                  Unggah
                </button>
              </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-body p-4">
                  <h4 className="fw-extrabold color-dark title-border mb-4">
                    Bukti Transfer
                  </h4>
                  <div className="row gy-4">
                    <div className="col-md-12">
                      <div
                        data-bs-toggle="modal"
                        data-bs-target="#modalKonfirmasiPembayaran"
                        onClick={() => setEditData(!editData)}
                        className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4 pointer"
                      >
                        <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                          <img src={`/img/icon-upload-dropfile.svg`} />
                          <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                            Klik untuk mengunggah{" "}
                            <span className="color-primary">
                              Bukti Transfer
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-12">
                      <BuktiTransfer />
                    </div>
                    <div className="col-md-12">
                      <hr className="my-4" />
                    </div>
                    <div className="col-md-12">
                      <BuktiTransfer isTerkonfirmasi />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-body p-4 text-center">
                  <p className="fw-bold color-dark">
                    Pastikan data yang anda cantumkan di atas adalah benar dan
                    dapat dipertanggungjawabkan.
                  </p>
                  <Link href={`${ppdbURL}/kartu-peserta`}>
                    <button className="btn btn-primary btn-primary-ss shadow-primary-ss bg-gradient-primary rounded-pill px-5 py-2 fw-bold">
                      Konfirmasiii Pembayaran
                    </button>
                  </Link>
                </div>
              </div>
            </div> */}
          </div>

          {pembayaran?.length ? (
            <>
              {pembayaran?.map((d) => (
                <CardRiwayatTransaksi
                  riwayat={d}
                  isTerkonfirmasi={d?.diverifikasi}
                  handleDeletePembayaran={handleDeletePembayaran}
                />
              ))}
            </>
          ) : null}
          {/* {gelombangPembelian?.nominal ? (
            <CardRiwayatTransaksi
              riwayat={gelombangPembelian}
              isTerkonfirmasi={gelombangPembelian?.diverifikasi}
            />
          ) : null} */}
        </div>
        <ModalUploadBuktiPembayaran
          handleChangeSelect={handleChangeSelect}
          formData={formData}
          handleChangeForm={handleChangeForm}
          _editPendaftarPPDB={_editPendaftarPPDB}
          editData={editData}
        />
      </AnimatePage>
    </Layout>
  );
};

export default PilihJurusanPPDB;
