import { detailDisposisi } from "client/SuratClient";
import { useEffect, useState } from "react";
import { momentPackage } from "utilities/HelperUtils";

const index = ({ id }) => {
  //   useEffect(() => {
  //     if (!loading) {
  //       setTimeout(function () {
  //         window.print();
  //       }, 1500);
  //     }
  //   }, [loading]);
  const [disposisiDatas, setDisposisi] = useState({});
  const [loading, setLoading] = useState(false);
  const _getDetailDisposisi = async () => {
    setLoading(true);
    const { data, error } = await detailDisposisi(id);

    if (data) {
      setDisposisi(data);
    }
    setLoading(false);
  };

  const { disposisi, ta } = disposisiDatas;

  useEffect(() => {
    _getDetailDisposisi();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(function () {
        window.print();
      }, 3000);
    }
  }, [loading]);

  return (
    <>
      <div className="print-page color-dark">
        <div
          className="border border-dark border-2 p-3 container"
          style={{ borderColor: "#000000" }}
        >
          <div className="row">
            <div className="col-12 text-center">
              <h4 className="fw-bold m-0">LEMBAR DISPOSISI</h4>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-left-2 border-top-0 col-6"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-18-ss">
                Surat dari : {disposisi?.surat?.asal}
              </p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-right-2 border-top-0 col-6"
              style={{ borderColor: "#000000", borderLeft: "none !important" }}
            >
              <p className=" m-0 fs-18-ss">
                Diterima Tanggal :{" "}
                {momentPackage(disposisi?.createdAt).format("DD MMMM YYYY")}
              </p>
            </div>
          </div>
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-left-2 border-top-0 col-6"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-18-ss">
                Tanggal Surat :{" "}
                {momentPackage(disposisi?.surat?.tanggal).format(
                  "DD MMMM YYYY"
                )}
              </p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-right-2 border-top-0 col-6"
              style={{ borderColor: "#000000", borderLeft: "none !important" }}
            >
              <p className=" m-0 fs-18-ss">
                Nomor Agenda : {disposisi?.surat?.kode}
              </p>
            </div>
          </div>
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-left-2 border-top-0 col-12"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-18-ss">
                Nomor Surat : {disposisi?.surat?.nomor}
              </p>
            </div>
          </div>

          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-left-2 border-top-0 col-6"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-18-ss">
                Tingkat Keamanan : {disposisi?.surat?.keamanan}
              </p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-right-2 border-top-0 col-6"
              style={{ borderColor: "#000000", borderLeft: "none !important" }}
            >
              <p className=" m-0 fs-18-ss">
                Penanganan : {disposisi?.penanganan}
              </p>
            </div>
          </div>
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-left-2 border-top-0 col-6"
              style={{ borderColor: "#000000", minHeight: "200px" }}
            >
              <p className=" m-0 fs-18-ss mb-4">Diteruskan ke :</p>
              <p className=" m-0 fs-18-ss">{disposisi?.user?.nama}</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-right-2 border-top-0 col-6"
              style={{ borderColor: "#000000", borderLeft: "none !important" }}
            >
              <p className=" m-0 fs-18-ss mb-4">Isi Disposisi :</p>
              <p className=" m-0 fs-18-ss">{disposisi?.isi}</p>
            </div>
          </div>
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-left-2 border-top-0 col-12"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-18-ss mb-4">
                Sesudah Digunakan Harap Segera Kembali :
              </p>
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "15%" }}>
                    <div className="fs-18-ss mb-4">Kepada</div>
                  </td>
                  <td className="align-text-top" style={{ width: "2%" }}>
                    <div className="fs-18-ss mb-4">:</div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss mb-4">Tata Usaha</div>
                  </td>
                </tr>
                <tr>
                  <td className="align-text-top" style={{ width: "15%" }}>
                    <div className="fs-18-ss mb-4">Tanggal</div>
                  </td>
                  <td className="align-text-top" style={{ width: "2%" }}>
                    <div className="fs-18-ss mb-4">:</div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss mb-4">
                      {momentPackage(disposisi?.tanggalPengembalian).format(
                        "DD MMMM YYYY"
                      )}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-left-2 border-top-0 col-12 d-flex justify-content-end"
              style={{ borderColor: "#000000" }}
            >
              <div className="px-5">
                <p
                  className=" m-0 fs-18-ss mb-3 text-break"
                  style={{ width: "250px" }}
                >
                  Kepala Sekolah {ta?.sekolah?.nama}
                </p>
                <p className=" m-0 fs-18-ss mb-1">
                  {momentPackage().format("DD MMMM YYYY")}
                </p>
                <img
                  src={disposisi?.ttd}
                  alt=""
                  height="87"
                  width="250"
                  className="mb-1 img-fit-contain"
                />
                <p className=" m-0 fs-18-ss mb-1 fw-bold">
                  <u>{ta?.namaKepsek}</u>
                </p>
                <p className=" m-0 fs-18-ss">NIP {ta?.nipKepsek}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
