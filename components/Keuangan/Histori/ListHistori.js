import Avatar from "components/Shared/Avatar/Avatar";
import React from "react";
import { momentPackage } from "utilities/HelperUtils";

// const template = [
//     {jenis: "ubah", template: (

//     )},
//     {jenis: "tambah perencanaan"},
//     {jenis: "tambah perencanaan"},
//     {jenis: "tambah perencanaan"},
//     {jenis: "tambah perencanaan"},
// ]

const ListHistori = ({ data, link }) => {
  return (
    <tr>
      <td className="py-2 fw-semibold border-start-0">
        <div className="d-flex align-items-center">
          <Avatar name={data?.user?.nama} src={data?.user?.avatar} />
          <div className="ms-3">
            <h6 className="color-dark mb-1 fw-semibold">{data?.user?.nama}</h6>
            <h6 className="fs-14-ss mb-0 fw-semibold">
              {momentPackage(data?.createdAt).format("DD MMM YYYY HH:mm:ss")}
            </h6>
          </div>
        </div>
      </td>
      <td className="py-2 fw-semibold">
        <h6 className="mb-0 color-dark fw-semibold">{data?.jenis}</h6>
      </td>
      <td className="py-2">
        <div className="">
          {/* {data?.bawah ? (
            <>
              <h6 className="mb-1 color-dark fw-semibold">
                Aktiva - Aktiva Lancar : {""}
                <span className="fw-bold">KAS</span>
              </h6>
              <h6 className="fs-14-ss mb-0 fw-semibold">
                Perencanaan - Laporan Neraca
              </h6>
            </>
          ) : null} */}
          {data?.bawah ? (
            <>
              {data?.awal ? (
                <h6 className="mb-0 color-dark fw-semibold">
                  <span dangerouslySetInnerHTML={{ __html: data?.awal }}></span>
                  <span className="fw-bold">{data?.akhir}</span>
                </h6>
              ) : (
                <h6 className="mb-0 color-dark fw-bold">{data?.akhir}</h6>
              )}
              <h6 className="fs-14-ss mb-0 fw-semibold">{data?.bawah}</h6>
            </>
          ) : data?.awal ? (
            <h6 className="mb-0 color-dark fw-semibold">
              <span dangerouslySetInnerHTML={{ __html: data?.awal }}></span>
              <span className="fw-bold">{data?.akhir}</span>
            </h6>
          ) : (
            <h6 className="mb-0 color-dark fw-bold">{data?.akhir}</h6>
          )}
        </div>
      </td>
      <td className="py-2 border-end-0 text-center">
        <button
          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
          onClick={() => window.open(link)}
        >
          Lihat
        </button>
      </td>
    </tr>
  );
};

export default ListHistori;
