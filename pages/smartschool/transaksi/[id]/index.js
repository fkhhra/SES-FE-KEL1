import { InputNumber } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaFile, FaTrashAlt } from "react-icons/fa";
import Select, { components } from "react-select";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { ssURL } from "../../../../client/clientAxios";
import {
  deleteRiwayatPembayaran,
  detailPembayaranSiswa,
  konfirmasiPembayaranSiswa,
  postRiwayatPembayaranSiswa,
} from "../../../../client/PembayaranClient";
import Layout from "../../../../components/Layout/Layout";
import InputFile from "../../../../components/Shared/InputFile/InputFile";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import bankData from "../../../../data/bank.json";
import {
  currencyFormatter,
  momentPackage,
} from "../../../../utilities/HelperUtils";
import { hideModal } from "../../../../utilities/ModalUtils";
import swal from "sweetalert";
import { getStatusPembayaran } from "utilities/PembayaranUtils";
import Swal from "sweetalert2";
import useUser from "hooks/useUser";
import { getProfil } from "client/sharedClient";

const index = ({ id }) => {
  const initialStateForm = {
    bank: "",
    norek: "",
    namaPemilik: "",
    nominal: "",
    bukti: "",
  };
  const { user, setUser } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState(initialStateForm);
  const [buttonState, setButtonState] = useState("idle");
  const [btnKonfirmasi, setBtnKonfirmasi] = useState(false);
  const [pembayaran, setPembayaran] = useState(null);
  const [cash, setCash] = useState(false);

  const totalPembayaran =
    pembayaran?.riwayat?.length > 0
      ? pembayaran?.riwayat?.reduce((a, b) => a + parseInt(b?.nominal), 0)
      : 0;
  const sisaPembayaran =
    parseInt(pembayaran?.rombelPembayaran?.pembayaran?.nominal) -
    totalPembayaran;

  const _detailPembayaranSiswa = async () => {
    const { data } = await detailPembayaranSiswa(id);
    if (data) {
      setPembayaran(data?.pembayaran);
    }
  };

  const getProfilData = async () => {
    const { data, status } = await getProfil();
    if (data && status === 200) {
      setUser(data?.user);
    }
  };
  const handleDitangguhkan = async (e) => {
    Swal.fire({
      title: "Lama penangguhan",
      icon: "question",
      input: "range",
      inputLabel: "Jumlah hari",
      inputAttributes: {
        min: 1,
        max: 14,
        step: 1,
      },
      showCloseButton: true,
      showCancelButton: true,
      inputValue: 7,
    }).then(({ value }) => {
      if (value) {
        return swal({
          title: `pembayaran akan ditangguhkan selama ${value} hari`,
          text: "Perhatikan kembali data yang akan ditangguhkan",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then(async (willDelete) => {
          if (willDelete) {
            const { data, error } = await postRiwayatPembayaranSiswa({
              mPembayaranSiswaId: id,
              ditangguhkan: 1,
              hari: value,
            });
            if (data) {
              toast.success("Pembayaran ditangguhkan selama 1 minggu kedepan");
              _detailPembayaranSiswa();
            } else {
              toast.error("Hubungi admin smarteschool");
            }
          }
        });
      }
    });
  };

  const handleDeleteDitangguhkan = async (e) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang akan dihapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await postRiwayatPembayaranSiswa({
          mPembayaranSiswaId: id,
          ditangguhkan: 2,
        });
        if (data) {
          toast.success("Penangguhan dibatalkan");
          _detailPembayaranSiswa();
        } else {
          toast.error("Hubungi admin smarteschool");
        }
      }
    });
  };

  const _postRiwayatPembayaranSiswa = async (e) => {
    if (!formData.bank && !cash) {
      toast.error("Nama Bank harus di isi");
      return;
    }
    if (!formData.norek && !cash) {
      toast.error("Nomor Rekening Bank harus di isi");
      return;
    }
    if (!formData.namaPemilik && !cash) {
      toast.error("Nama Pemilik Rekening harus di isi");
      return;
    }
    if (!formData.nominal) {
      toast.error("Nominal harus di isi");
      return;
    }
    if (!formData.bukti) {
      toast.error("Bukti Harus disertakan");
      return;
    }
    setButtonState("loading");

    const { data } = await postRiwayatPembayaranSiswa({
      ...formData,
      mPembayaranSiswaId: id,
    });

    if (data) {
      setButtonState("success");
      setFormData(initialStateForm);
      setCash(false);
      _detailPembayaranSiswa();
      hideModal("modalKonfirmasiPembayaran");
    } else {
      setButtonState("success");
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (e) => {
    setFormData({
      ...formData,
      bank: e?.value,
    });
  };

  const uploadBukti = async (e, data) => {
    if (data) {
      setFormData({
        ...formData,
        bukti: data,
      });
    }
  };

  useEffect(() => {
    getProfilData();
  }, []);

  useEffect(() => {
    _detailPembayaranSiswa();
  }, []);

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

  const RiwayatTransaksi = ({ isTerkonfirmasi = false, riwayat }) => {
    const handleClick = async (isKonfirmasi, id) => {
      setBtnKonfirmasi(true);
      const payload = { dikonfirmasi: isKonfirmasi ? 1 : 0 };
      const { data, error } = await konfirmasiPembayaranSiswa(payload, id);
      if (data) {
        toast.success("Berhasil mengkonfirmasi pembayaran");
        _detailPembayaranSiswa();
        setBtnKonfirmasi(false);
      } else {
        toast?.success(error?.message);
        setBtnKonfirmasi(false);
      }
    };

    const handleDelete = async (id) => {
      const { data, error } = await deleteRiwayatPembayaran(id);

      if (data) {
        toast.success(data.message);
        _detailPembayaranSiswa();
      } else {
        toast.success(error.message);
      }
    };

    return (
      <>
        <div className="col-md-12">
          <div className="rounded-ss border border-light-secondary-ss px-4 py-3">
            <div className="d-flex align-items-md-center justify-content-between mb-3 flex-md-row flex-column">
              <span className="fw-bold color-dark mb-md-0 mb-3">
                {riwayat?.bank} - {riwayat?.norek} a/n {riwayat?.namaPemilik}
              </span>
              <span className="fw-bold color-primary">
                + {currencyFormatter(riwayat?.nominal)}
              </span>
            </div>
            <a href={riwayat?.bukti} target="__blank">
              <div className="bg-soft-primary p-3 rounded-ss mb-3 pointer">
                <div className="file-content d-flex align-items-center flex-wrap">
                  <div
                    className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                    style={{
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <FaFile />
                  </div>
                  <div className="p-3 d-flex flex-column">
                    <p className="fw-bold color-dark mb-0">
                      File Bukti Pembayaran
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <hr className="my-3" />
            <div className="d-flex align-items-sm-center justify-content-between flex-sm-row flex-column">
              <span className="mb-sm-0 mb-3">
                {momentPackage(riwayat?.createdAt).format("dddd, DD MMMM YYYY")}{" "}
              </span>
              <div className="d-flex">
                {isTerkonfirmasi ? (
                  <div className="label-ss px-4 bg-soft-success color-success d-flex justify-content-center align-items-center fw-bold rounded-pill fs-14-ss text-center me-md-2">
                    Terkonfirmasi
                  </div>
                ) : (
                  <button
                    className="btn btn-primary btn-primary-ss d-flex justify-content-center align-items-center rounded-pill fs-14-ss py-1 px-4 shadow-primary-ss me-md-2"
                    onClick={() => handleClick(true, riwayat?.id)}
                    disabled={btnKonfirmasi}
                  >
                    Konfirmasi
                  </button>
                )}
                <div
                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={() => handleDelete(riwayat?.id)}
                >
                  <FaTrashAlt className="color-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout
      isIndex={true}
      modalWrapper={
        <>
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
                      <label className="form-label">
                        Nama Pemilik Rekening
                      </label>
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
                
                  {/* <input
                    className="form-control"
                    placeholder="Rp. 0"
                    type="number"
                    name="nominal"
                    value={formData.nominal}
                    onChange={handleChangeForm}
                  /> */}
            
                <div className="mb-4">
                  <h6 className="form-label color-dark fw-bold">
                    Bukti Pembayaran
                  </h6>
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
                              <span className="color-primary">
                                Bukti Transaksi
                              </span>
                            </span>
                          </div>
                        </div>
                      </label>
                    )}
                    <InputFile
                      name="bukti"
                      id="bukti"
                      onChange={uploadBukti}
                      accept="image/png, image/gif, image/jpeg"
                    />
                  </div>
                </div>
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={buttonState}
                onClick={_postRiwayatPembayaranSiswa}
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
        </>
      }
    >
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <section className="banner position-absolute"></section>

          <div className="row mb-3">
            <div className="col-md-12">
              <div
                className="text-decoration-none fw-bolder position-relative text-white pointer"
                onClick={() =>
                  router.push(
                    `${ssURL}/pembayaran/${pembayaran?.rombelPembayaran?.pembayaran?.id}?rombel_id=${pembayaran?.rombelPembayaran?.id}`
                  )
                }
              >
                <FaChevronLeft />
                <span className="ms-2">Detail Pembayaran</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 mb-4">
                {/* Card Label & Option Start */}
                <div className="card-header-ss d-flex justify-content-between align-items-center mb-3 px-0">
                  {/* Jadwal Ujian Label Start */}

                  {getStatusPembayaran(pembayaran)}

                  {/* Jadwal Ujian Label End */}

                  {/* Dropdown Option Start */}
                  {/* <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                    <div
                      role="button"
                      id="dropdownOption"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={`/img/icon-dropdown-option.svg`}
                        alt="icon-option"
                      />
                    </div>
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownOption"
                    >
                      <li
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjian"
                      >
                        <a className="dropdown-item">
                          <FaPen className="me-2" />
                          <span>Edit</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item color-danger">
                          <FaTrashAlt className="me-2" />
                          <span>Hapus</span>
                        </a>
                      </li>
                    </ul>
                  </div> */}

                  {/* Dropdown Option End */}
                </div>
                <div className="card-body p-0">
                  <h2 className="color-dark fw-black mb-2">
                    {pembayaran?.user?.nama}
                  </h2>
                  <div className="row mt-4">
                    <div className="col-md-12">
                      <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">
                            Pembayaran
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {currencyFormatter(totalPembayaran)}
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">Sisa</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {currencyFormatter(sisaPembayaran)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4">
                  <div className="d-flex justify-content-between">
                    <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                      Riwayat Transaksi
                    </h4>
                    <div className="d-flex align-items-center">
                      {pembayaran?.riwayat?.reduce(
                        (a, b) => a + parseInt(b.nominal),
                        0
                      ) < pembayaran?.rombelPembayaran?.pembayaran?.nominal && (
                        <button
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                          data-bs-toggle="modal"
                          data-bs-target="#modalKonfirmasiPembayaran"
                        >
                          Tambah Riwayat
                        </button>
                      )}
                      {!(
                        pembayaran?.ditangguhkan &&
                        momentPackage(pembayaran?.ditangguhkan).toDate() >
                          momentPackage().toDate()
                      ) ? (
                        <button
                          className="btn btn-ss btn-success-ss bg-success rounded-pill shadow-success-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                          onClick={handleDitangguhkan}
                        >
                          Tangguhkan Akun
                        </button>
                      ) : (
                        <button
                          className="btn btn-ss btn-danger-ss bg-danger rounded-pill shadow-danger-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                          onClick={handleDeleteDitangguhkan}
                        >
                          Batalkan Penangguhan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0 px-4 pb-4">
                  <div className="row gy-4">
                    {pembayaran?.riwayat?.map((riwayat) => (
                      <RiwayatTransaksi
                        isTerkonfirmasi={riwayat?.dikonfirmasi === 1}
                        riwayat={riwayat}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({ query: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
