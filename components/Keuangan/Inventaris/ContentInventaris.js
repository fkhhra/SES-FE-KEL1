import React from "react";
import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import { formatAngkaTitik, momentPackage } from "utilities/HelperUtils";

const ContentInventaris = ({ formData }) => {
  return (
    <>
      <div className="card card-ss p-4 pb-5 mt-3 mb-4">
        {/* Dropdown Option End */}
        {/* <div className="d-flex align-items-start justify-content-md-between flex-md-row flex-column"> */}
        <div
          className="table-kerja table-kerja-heading mb-2 d-none d-md-flex"
          style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}
        >
          <div
            className="table-kerja-list table-kerja-heading"
            style={{
              border: "none",
              // background: `${d.warna}11`,
              // color: d.warna,
              minHeight: "56px",
              // width: "100%"
            }}
          >
            Informasi Aset
          </div>
        </div>
        {/* </div> */}

        <div
          className="rounded-ss p-4 mb-4"
          style={
            {
              // background: "rgba(244,244,247,.65)",
            }
          }
        >
          {formData?.foto?.length ? (
            <>
              {formData?.foto?.map((d) => {
                return (
                  <img
                    // src={buku?.ttd}
                    // src={barang?.foto?.[0]}
                    src={d}
                    alt="Barang"
                    className="w-100 img-fit-contain rounded-ss mb-4 rounded"
                    style={{
                      height: "146px",
                    }}
                  />
                );
              })}
            </>
          ) : null}
          <table>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Nama Barang</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.nama ? `-` : `${barang?.nama}`} */}{" "}
                  {formData?.namaAsli}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Merk</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.merk ? `-` : `${barang?.merk}`} */}{" "}
                  {formData?.merk}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">No. Kode Barang</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.kodeBarang ? `-` : `${barang?.kodeBarang}`} */}{" "}
                  {formData?.kodeBarang}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Asal usul</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.asal ? `-` : `${barang?.asal}`} */}{" "}
                  {formData?.asal}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Spesifikasi</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.deskripsi ? `-` : `${barang?.deskripsi}`} */}{" "}
                  {formData?.deskripsi}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Harga</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* Rp{formatAngkaUang(barang?.harga)} */} Rp
                  {formatAngkaTitik(formData?.harga)}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Tanggal Beli</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {!formData?.tahunBeli
                    ? `-`
                    : `${momentPackage(formData?.tahunBeli).format(
                        "dddd, DD MMMM YYYY"
                      )}`}{" "}
                  {/* Jumat, 3 September 2021 */}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Kepemilikan</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.kepemilikan ? `-` : `${barang?.kepemilikan}`} */}{" "}
                  {formData?.kepemilikan}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">
                  Nama Pemilik/Peminjam
                </p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.namaPemilik ? `-` : `${barang?.namaPemilik}`} */}{" "}
                  {formData?.namaPemilik || "-"}
                </p>
              </td>
            </tr>
            <tr>
              <td className="align-text-top" style={{ width: "30%" }}>
                <p className="mb-2 fs-18-ss fw-semibold">Lokasi</p>
              </td>
              <td className="align-text-top" style={{ width: "5%" }}>
                <p className="mb-2 fs-18-ss fw-extrabold">:</p>
              </td>
              <td className="align-text-top">
                <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                  {/* {!barang?.lokasi?.nama ? `-` : `${barang?.lokasi?.nama}`} */}{" "}
                  {formData?.lokasi?.nama}
                </p>
              </td>
            </tr>
          </table>
        </div>
        {formData?.nota ? (
          <>
            <div
              className="table-kerja table-kerja-heading mb-2 d-none d-md-flex"
              style={{
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            >
              <div
                className="table-kerja-list table-kerja-heading"
                style={{
                  border: "none",
                  // background: `${d.warna}11`,
                  // color: d.warna,
                  minHeight: "56px",
                  // width: "100%"
                }}
              >
                Bukti Nota
              </div>
            </div>
            <div className="mb-4 p-4" style={{ backgroundColor: "#FCFCFD" }}>
              <FileAttachment
                href={formData?.nota}
                nama="Lampiran Nota Barang"
              />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default ContentInventaris;
