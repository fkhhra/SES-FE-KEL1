import { deleteMutasiV2 } from "client/MutasiClient";
import useUser from "hooks/useUser";
import React from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";

const ListTransaksiAkun = ({
  data,
  // user,
  // setEditData,
  // _deleteMutasi,
  // isRencanaKeuangan,
}) => {
  // const data = data?.data;

  return (
    <>
      <tr>
        <td className="border-start-0" rowSpan={data?.length}>
          <p>{momentPackage(data?.transaksi?.tanggal).format("DD/MM/YYYY")}</p>
          <p
            className="color-secondary"
            // style={{ fontSize: "8px" }}
          >
            {/* {momentPackage(data?.createdAt).format("YYYY-MM-DD HH:mm:ss")} */}
            {/* {momentPackage(data?.tanggal).format("HH:mm:ss")} */}
          </p>
        </td>
        {/* <td className="border-start-0" rowSpan={data?.length}>
          <p>
            {momentPackage(data?.transaksi?.updatedAt).format("DD/MM/YYYY")}
          </p>
          <p
            className="color-secondary"
            // style={{ fontSize: "8px" }}
          >
            //{momentPackage(data?.createdAt).format("YYYY-MM-DD HH:mm:ss")} 
            {momentPackage(data?.transaksi?.updatedAt).format("HH:mm:ss")}
          </p>
        </td> */}

        <td rowSpan={data?.length}>
          <div className="d-flex justify-content-center flex-column">
            <p className="mb-1 color-dark">{data?.transaksi?.nama}</p>
            <p className="mb-0 color-secondary fs-ss-14">
              {data?.transaksi?.nomor}
            </p>
          </div>
        </td>
        <td className="py-1 border-start-0 border-end-0">
          <span className={`color-dark fw-bold`}>
            {data?.jenis == "debit" ? currencyFormatter(data?.saldo) : ""}
          </span>
        </td>
        <td className="py-1 border-start-0 ">
          <span className={`color-dark fw-bold`}>
            {data?.jenis == "debit" ? "" : currencyFormatter(data?.saldo)}
          </span>
        </td>
      </tr>
      {/* {data?.transaksi?.slice(1, data?.length).map((d, idx) => {
        return (
          <tr>
            <td className="py-1 border-end-0">
              {d.akun?.kode} - {d.akun?.nama}
            </td>
            <td className="py-1 border-start-0 border-end-0">
              <span className={`color-dark fw-bold`}>
                {d.jenis == "debit" ? currencyFormatter(d.saldo) : ""}
              </span>
            </td>
            <td className="py-1 border-start-0 ">
              <span className={`color-dark fw-bold`}>
                {d.jenis == "debit" ? "" : currencyFormatter(d.saldo)}
              </span>
            </td>
          </tr>
        );
      })} */}
    </>
  );
};

export default ListTransaksiAkun;
