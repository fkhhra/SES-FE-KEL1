import { useEffect, useState } from "react";

const index = ({ rombel_id, id }) => {
  //   useEffect(() => {
  //     if (!loading) {
  //       setTimeout(function () {
  //         window.print();
  //       }, 1500);
  //     }
  //   }, [loading]);

  return (
    <>
      <div className="print-page color-dark">
        <div className="container mb-4">
          <div className="row ps-5">
            <div className="col-12 text-center position-relative">
              <img
                src="https://3.bp.blogspot.com/-JS31ABO_490/XIuZ0bGJ1bI/AAAAAAAAAE4/0_TPMn-F5zgIOrlLcJ4CiHBl2NnS8f_eACLcBGAs/s1600/smkn26.png"
                alt=""
                className="position-absolute"
                style={{
                  width: "80px",
                  left: "-40px",
                  top: "50px",
                }}
              />
              <h5 className="fw-bold mb-2 text-uppercase">
                YAYASAN PENDIDIKAN KARTINI NUSANTARA
              </h5>
              <h6 className="text-uppercase">SEKOLAH MENENGAH ATAS</h6>
              <h5 className="fw-bold mb-2 text-uppercase">SMA KARTINI 1</h5>
              <h6 className="text-uppercase">TERAKREDITASI A</h6>
              <p className="fs-14-ss mb-1">
                Jl. Kalibaru Timur V No. 1 Kemayoran Jakarta Pusat 10650 - Telp.
                (021) 426 3602
              </p>
              <p className="fs-14-ss">
                Website : http//www.kartininusantara.sch.id - email :
                smakartini.ypkn@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div
          className="border border-dark border-2 p-3 container mb-4"
          style={{ borderColor: "#000000" }}
        >
          <div className="row 4">
            <div className="col-12 text-center">
              <h5 className="fw-bold m-0">BUKTI PEMBAYARAN SISWA</h5>
            </div>
          </div>
        </div>
        <div className="container pt-4 ">
          <div className="row mb-4">
            <div className="p-0 col-6">
              <h6 className=" mb-2">No. Transaksi : SPP382387423</h6>
              <h6 className=" mb-2">Tanggal : 03/09/2021</h6>
              <h6 className=" mb-2">Jam Cetak : 14:19</h6>
            </div>
            <div className="col-6">
              <h6 className=" mb-2">Nama : Armando Salazar</h6>
              <h6 className=" mb-2">NIS : 381273812</h6>
              <h6 className=" mb-2">Kelas : XII TMPO 2</h6>
            </div>
          </div>

          <div className="row mb-4">
            <p className="fs-18-ss fw-bold color-dark mb-3 p-0">Tagihan</p>
            <h6 className="p-0">
              Nama Pembayaran : Pembayaran SPP Kelas X - Januari 2021
            </h6>
            <h6 className="p-0">Total Tagihan : Rp. 600.000</h6>
          </div>
          <div className="row">
            <p className="fs-18-ss fw-bold color-dark mb-4 p-0">
              Riwayat Pembayaran
            </p>
          </div>
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-end-0 col-1"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">No</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-end-0 col-2"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Nama</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-end-0 col-3"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Tanggal Pembayaran</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-end-0 col-3"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Nama Pembayar</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-left-0 col-3"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Jumlah Uang</p>
            </div>
          </div>
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-right-2 border-top-0  border-end-0 col-1"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">1</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-right-0 border-top-0  border-end-0 col-2"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Pembayaran 1</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-right-0 border-top-0  border-end-0 col-3"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">27/08/2021</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-right-0 border-top-0  border-end-0 col-3"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Elizabeth Swann</p>
            </div>
            <div
              className="border border-dark border-2 p-3 border-left-0  border-top-0 col-3"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Rp. 200.000</p>
            </div>
          </div>
          <div className="row">
            <div
              className="border border-dark border-2 p-3 border-right-2 border-top-0 col-9 border-end-0"
              style={{ borderColor: "#000000" }}
            >
              <h6 className=" m-0 fw-bold text-center">Jumlah</h6>
            </div>
            <div
              className="border border-dark border-2 p-3 border-left-0 border-top-0 col-3"
              style={{ borderColor: "#000000" }}
            >
              <p className=" m-0 fs-16-ss">Rp. 200.000</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// export async function getServerSideProps({ params: { rombel_id, id } }) {
//   return {
//     props: {
//       rombel_id,
//       id,
//     },
//   };
// }
export default index;
