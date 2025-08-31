import Layout from "components/Layout/Layout";
import { motion } from "framer-motion";
import { FaChevronLeft, FaFile } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import { ssURL } from "client/clientAxios";
import { useEffect, useState } from "react";
import useBagian from "hooks/useBagian";
import useUser from "hooks/useUser";
import Link from "next/link";
import useSekolah from "hooks/useSekolah";
import NewModal from "components/Shared/NewModal/NewModal";
import {
  detailPembayaranSiswa,
  postRiwayatPembayaranSiswa,
} from "client/PembayaranClient";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";
import { whatsappLink } from "utilities/app-helper";
import Select, { components } from "react-select";
import bankData from "data/bank.json";
import { uploadFile } from "client/uploadFileClient";
import { hideModal } from "utilities/ModalUtils";
import toast from "react-hot-toast";
import InputFile from "components/Shared/InputFile/InputFile";
import { InputNumber } from "antd";
import { checkStatusLunas, styleStatusLunas } from "utilities/TagihanUtils";

const index = ({ id }) => {
  const initialStateForm = {
    bank: "",
    norek: "",
    namaPemilik: "",
    nominal: "",
    bukti: "",
  };

  const [formData, setFormData] = useState(initialStateForm);
  const [buttonState, setButtonState] = useState("idle");
  const [cash, setCash] = useState(false);

  const { user } = useUser();

  const [pembayaranSiswa, setPembayaranSiswa] = useState({});
  const { pembayaran, rekSekolah, kontak } = pembayaranSiswa;

  const _detailPembayaranSiswa = async () => {
    const { data } = await detailPembayaranSiswa(id);
    if (data) {
      setPembayaranSiswa(data);
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
      if (pembayaran?.mSekolahId != 7676) {
        window.open(
          whatsappLink(
            kontak?.keuangan,
            `Halo admin keuangan, saya ${
              user?.nama
            }.%0ASaya sudah melakukan pembayaran tagihan ${
              pembayaran?.rombelPembayaran?.pembayaran?.nama
            } sebesar:%0ARp. ${currencyFormatter(
              data?.nominal
            )}%0ABukti Pengiriman:%0ABank ${data?.bank} - ${data?.norek} a/n ${
              data?.namaPemilik
            }%0APada Tanggal:${
              data?.createdAt
            }%0ABerikut link bukti pembayarannya:%0A${
              window.location.origin
            }/${ssURL}/transaksi/${id}`
          )
        );
      }
    } else {
      setButtonState("success");
    }
  };

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

  useEffect(() => {
    _detailPembayaranSiswa();
  }, []);

  const RiwayatTransaksi = ({ isTerkonfirmasi = false, riwayat }) => {
    return (
      <>
        <div className="col-md-12">
          <div className="rounded-ss border border-light-secondary-ss px-4 py-3">
            <div className="d-flex align-items-md-center justify-content-between mb-3 flex-md-row flex-column">
              <span className="fw-bold color-dark mb-md-0 mb-3">
                {riwayat?.bank} - {riwayat?.norek} a/n {riwayat?.namaPemilik}
              </span>
              <span className="fw-bold color-primary">
                +{currencyFormatter(riwayat?.nominal)}
              </span>
            </div>
            <a
              href={riwayat?.bukti}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-soft-primary p-3 rounded-ss mb-3 pointer d-block"
            >
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
            </a>
            <hr className="my-3" />
            <div className="d-flex align-items-sm-center justify-content-between flex-sm-row flex-column">
              <span className="mb-sm-0 mb-3">
                {momentPackage(riwayat?.createdAt).format("dddd, DD MMMM YYYY")}
              </span>
              <div
                className={`label-ss px-4 fw-bold rounded-pill fs-14-ss text-center ${
                  isTerkonfirmasi
                    ? "bg-soft-success color-success"
                    : "bg-light-primary color-primary"
                }`}
              >
                {isTerkonfirmasi ? "Terkonfirmasi" : "Menunggu Konfirmasi"}
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
                  {/* <input
                    className="form-control"
                    placeholder="Rp. 0"
                    type="number"
                    name="nominal"
                    value={formData.nominal}
                    onChange={handleChangeForm}
                  /> */}
                </div>
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
          <div className="row justify-content-center gy-4">
            <div className="col-lg-8 col-md-10">
              <Link href={`${ssURL}/tagihan`}>
                <a className="text-decoration-none fw-bolder position-relative text-white pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>

            <div className="col-lg-8 col-md-10">
              <div className="card card-ss">
                <div className="card-header-ss px-4 py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className={styleStatusLunas(pembayaran)}>
                      {checkStatusLunas(pembayaran)}
                    </span>
                  </div>
                </div>
                <div className="card-body p-0">
                  <hr className="mt-0 mb-4" />
                  <div className="px-4 pb-4">
                    <div className="d-flex flex-sm-row flex-column mb-4">
                      <div
                        className="rounded-circle shadow-primary-ss me-sm-4 mb-sm-0 mb-4 mx-sm-0 mx-auto"
                        style={{
                          width: "62px",
                          height: "62px",
                        }}
                      >
                        <img
                          src={`/img/icon-notif-pembayaran-alert.svg`}
                          alt="icon"
                          width="62px"
                          height="62px"
                        />
                      </div>
                      <div>
                        <h4 className="fw-extrabold color-dark">
                          {pembayaran?.rombelPembayaran?.pembayaran?.tipe ==
                          "spp"
                            ? `${pembayaran?.rombelPembayaran?.pembayaran?.nama} - ${pembayaran?.rombelPembayaran?.pembayaran?.bulan}`
                            : pembayaran?.rombelPembayaran?.pembayaran?.nama}
                        </h4>
                        <h6 className="fw-semibold mb-0">
                          Total Pembayaran : {""}
                          <span className="fw-extrabold color-primary">
                            {currencyFormatter(
                              pembayaran?.rombelPembayaran?.pembayaran?.nominal
                            )}
                          </span>
                        </h6>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h5 className="fw-bold color-dark fs-18-ss mb-4">
                        Informasi Pembayaran
                      </h5>
                      <div className="row">
                        <div className="col-lg-7 col-md-11">
                          <table className="table">
                            <tbody>
                              <tr className="fw-semibold">
                                <td className="border-0 color-secondary">
                                  Bank
                                </td>
                                <td className="border-0 fw-bold color-dark">
                                  {rekSekolah?.bank}
                                </td>
                              </tr>
                              <tr className="fw-semibold">
                                <td className="border-0 color-secondary">
                                  Nomor Rekening
                                </td>
                                <td className="border-0 fw-bold color-dark">
                                  {rekSekolah?.norek}
                                </td>
                              </tr>
                              <tr className="fw-semibold">
                                <td className="border-0 color-secondary">
                                  Penerima
                                </td>
                                <td className="border-0 fw-bold color-dark">
                                  {rekSekolah?.nama}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="mb-0 mt-2">
                      <h5 className="fw-bold color-dark fs-18-ss mb-4">
                        Konfirmasi Pembayaran
                      </h5>
                      <div className="row">
                        <div className="col-lg-6 col-md-9 col-10">
                          <table className="table">
                            <tbody>
                              <tr className="fw-semibold">
                                <td className="border-0 color-secondary">
                                  Nomor Whatsapp
                                </td>
                                <td className="border-0 fw-bold color-dark">
                                  <a
                                    href={whatsappLink(
                                      kontak?.keuangan,
                                      `Halo admin keuangan, saya ${user?.nama}`
                                    )}
                                    target="_blank"
                                  >
                                    : {kontak?.keuangan || "-"}
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {pembayaran?.riwayat?.reduce(
                  (a, b) => a + parseInt(b.nominal),
                  0
                ) < pembayaran?.rombelPembayaran?.pembayaran?.nominal && (
                  <div
                    className="card-footer-ss btn btn-ss btn-primary btn-primary-ss fw-bold fs-5"
                    data-bs-toggle="modal"
                    data-bs-target="#modalKonfirmasiPembayaran"
                  >
                    <div className="py-3">Konfirmasi Pembayaran</div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-8 col-md-10">
              <div className="card card-ss">
                <div className="card-header-ss p-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Riwayat Transaksi
                  </h4>
                </div>
                <div className="card-body pt-0 px-4 pb-4">
                  <div className="row gy-4">
                    {pembayaran?.riwayat?.length ? (
                      pembayaran?.riwayat?.map((d) => {
                        return (
                          <RiwayatTransaksi
                            riwayat={d}
                            isTerkonfirmasi={d?.dikonfirmasi ? true : false}
                          />
                        );
                      })
                    ) : (
                      <p>Belum ada riwayat transaksi</p>
                    )}
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

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id,
    },
  };
}

export default index;
