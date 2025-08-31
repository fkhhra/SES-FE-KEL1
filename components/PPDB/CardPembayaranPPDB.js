import { editPendaftarPPDB } from "client/PendaftarPPDBClient";
import React from "react";
import toast from "react-hot-toast";
import { FaFile } from "react-icons/fa";
import swal from "sweetalert";
import { currencyFormatter, momentPackage } from "../../utilities/HelperUtils";
import useUser from "hooks/useUser";
import useSekolah from "hooks/useSekolah";

const CardPembayaranPPDB = ({ pendaftar, _detailPendaftarPPDB }) => {
  const { sekolah } = useSekolah();

  const { user } = useUser();
  const pembayaran = JSON.parse(pendaftar?.pembayaran || "[]");
  const handleKonfirmasi = (id, verif) => {
    const newBayar = [
      ...pembayaran?.map((d) => {
        if (d?.id != id) {
          return d;
        } else {
          return { ...d, diverifikasi: verif, userConfirmation: user?.nama };
        }
      }),
    ];
    const status =
      newBayar?.reduce((a, b) => {
        if (b?.diverifikasi) {
          return a + b?.nominal;
        } else {
          return a + 0;
        }
      }, 0) <
        (pendaftar?.diskon?.harga
          ? pendaftar?.diskon?.harga
          : pendaftar?.gelombang?.jalur?.biaya || 0)
        ? "menungguKonfirmasiPembayaran"
        : "pembayaranTerkonfirmasi";

    const payload = {
      pembayaran: JSON.stringify(newBayar),
      status,
    };
    swal({
      title: "Yakin ingin dikonfimasi?",
      text: "Perhatikan kembali data yang ingin anda konfirmasi",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await editPendaftarPPDB(pendaftar?.id, payload);
        if (data) {
          toast.success(data?.message);
          _detailPendaftarPPDB();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  // const { user } = useUser();
  return (
    <>
      {/* {dataBukuInduk?.map((d, idx) => {
        return ( */}
      {/* <Link href={linkRedirect + `${d?.id}`}> */}
      {pembayaran?.map((d) => {
        return (
          <div className={`card card-ss rounded-ss mb-4`}>
            <div className="card-body card-body-ss p-4">
              <div className="d-flex justify-content-between flex-md-row flex-column">
                <div className="d-flex align-items-md-center align-items-start mb-3 mb-md- flex-md-row flex-column">
                  {d?.diverifikasi ? (
                    <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-success color-success mb-3 mb-md-0">
                      {d?.diverifikasi
                        ? "Terkonfirmasi"
                        : "Belum Terkonfirmasi"}
                    </span>
                  ) : (
                    <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-danger color-danger mb-3 mb-md-0">
                      {d?.diverifikasi
                        ? "Terkonfirmasi"
                        : "Belum Terkonfirmasi"}
                    </span>
                  )}
                  {/* terkonfirmasi gagal */}
                  {/* <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-danger color-danger mb-3 mb-md-0">
                Konfirmasi Gagal
              </span> */}
                  <h6 className="color-dark fw-bold mb-0">
                    {d?.bank == "tunai"
                      ? "tunai"
                      : `${d?.bank} - ${d?.norek} a/n ${d?.namaPemilik}`}
                  </h6>
                </div>
                {sekolah?.id !== 70 && (
                  <h6 className="color-primary fw-bold">
                    + {currencyFormatter(d?.nominal)}
                  </h6>
                )}
              </div>
              <a
                href={d?.bukti}
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
              <hr className="w-100 color-secondary my-3" />
              <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row ">
                <h6 className="fw-regular mb-3 mb-md-0">
                  {d?.userConfirmation},{" "}
                  {momentPackage(d?.createdAt).format("dddd, DD MMMM YYYY")}
                </h6>
                {/* Konfimasi */}
                {d?.diverifikasi ? (
                  <span
                    className="rounded-pill px-3 fw-semibold fs-14-ss py-1 bg-danger text-white shadow-danger-ss text-center pointer"
                    onClick={() => handleKonfirmasi(d?.id, !d?.diverifikasi)}
                  >
                    Batalkan Konfirmasi
                  </span>
                ) : (
                  <span
                    className="rounded-pill px-3 fw-semibold fs-14-ss py-1 bg-primary text-white shadow-primary-ss text-center pointer"
                    onClick={() => handleKonfirmasi(d?.id, !d?.diverifikasi)}
                  >
                    Konfirmasi
                  </span>
                )}
                {/* Batalkan Konfirmasi */}
              </div>
            </div>
            {/* </Link> */}
          </div>
        );
      })}
      {pendaftar?.nominal ? (
        <div className={`card card-ss rounded-ss mb-4`}>
          <div className="card-body card-body-ss p-4">
            <div className="d-flex justify-content-between flex-md-row flex-column">
              <div className="d-flex align-items-md-center align-items-start mb-3 mb-md- flex-md-row flex-column">
                <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-success color-success mb-3 mb-md-0">
                  Terkonfirmasi
                </span>
                {/* terkonfirmasi gagal */}
                {/* <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-danger color-danger mb-3 mb-md-0">
                Konfirmasi Gagal
              </span> */}
                <h6 className="color-dark fw-bold mb-0">
                  {pendaftar?.bank} - {pendaftar?.norek} a/n{" "}
                  {pendaftar?.namaPemilik}
                </h6>
              </div>
              <h6 className="color-primary fw-bold">
                + {currencyFormatter(pendaftar?.nominal)}
              </h6>
            </div>
            <a
              href={pendaftar?.bukti}
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
            <hr className="w-100 color-secondary my-3" />
            <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row ">
              <h6 className="fw-regular mb-3 mb-md-0">
                {momentPackage(pendaftar?.createdAt).format(
                  "dddd, DD MMMM YYYY"
                )}
              </h6>
              {/* Konfimasi */}
              {/* <span className="rounded-pill px-3 fw-semibold fs-14-ss py-1 bg-primary text-white shadow-primary-ss text-center pointer">
              <FaWhatsapp className="me-2 text-white" /> Konfirmasi
            </span> */}
              {/* Batalkan Konfirmasi */}
              {/* <span className="rounded-pill px-3 fw-semibold fs-14-ss py-1 bg-danger text-white shadow-danger-ss text-center pointer">
                <FaWhatsapp className="me-2 text-white" />
                Batalkan Konfirmasi
              </span> */}
            </div>
          </div>
          {/* </Link> */}
        </div>
      ) : null}
      {/* );
      })} */}
    </>
  );
};

export default CardPembayaranPPDB;
