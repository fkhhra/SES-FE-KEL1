import { deleteMutasiV2 } from "client/MutasiClient";
import React from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";

const ListTransaksiRencana2 = ({
  data,
  setEditData,
  _deleteMutasi,
  isRencanaKeuangan,
  user,
}) => {
  const jurnal = data?.jurnal;
  const onClickEdit = (data) => {
    setEditData({
      ...data,
      tanggal: momentPackage(data?.tanggal),
      jurnal: jurnal?.map((d) => {
        return {
          id: d.id,
          jenis: d.jenis,
          m_keu_akun_id: d.mKeuAkunId,
          kredit: d.jenis == "debit" ? 0 : d.saldo,
          debit: d.jenis == "debit" ? d.saldo : 0,
        };
      }),
    });
  };
  return (
    <>
      <tr>
        {!isRencanaKeuangan ? (
          <td className="border-start-0" rowSpan={jurnal?.length}>
            <p>{momentPackage(data?.tanggal).format("DD/MM/YYYY")}</p>
            <p
              className="color-secondary"
              // style={{ fontSize: "8px" }}
            >
              {/* {momentPackage(data?.createdAt).format("YYYY-MM-DD HH:mm:ss")} */}
              {momentPackage(data?.tanggal).format("HH:mm:ss")}
            </p>
          </td>
        ) : (
          ""
        )}
        <td className="border-start-0" rowSpan={jurnal?.length}>
          {/* <p>{momentPackage(data?.tanggal).format("YYYY/MM")}</p> */}
          <p
            className="color-secondary"
            // style={{ fontSize: "8px" }}
          >
            {/* {momentPackage(data?.createdAt).format("YYYY-MM-DD HH:mm:ss")} */}
            {momentPackage(data?.tanggal).format("MMMM YYYY")}
          </p>
        </td>
        {!user?.bagian ||
        user?.bagian == "keuangan" ||
        user?.bagian == "yayasan" ? (
          <td rowSpan={jurnal?.length}>
            <div className="d-flex justify-content-center flex-column">
              <p className="mb-1 color-dark">
                {data?.status == 0
                  ? "Ditolak"
                  : !data?.status
                  ? "Diproses"
                  : "Diterima"}
              </p>
            </div>
          </td>
        ) : (
          ""
        )}
        <td rowSpan={jurnal?.length}>
          <div className="d-flex justify-content-center flex-column">
            <p className="mb-1 color-dark">{data?.nama}</p>
            <p className="mb-0 color-secondary fs-ss-14"> {data?.nomor}</p>
          </div>
        </td>
        <td className="py-1 border-end-0">
          {jurnal[0]?.akun?.kode} - {jurnal[0]?.akun?.nama}
        </td>
        <td className="py-1 border-start-0 border-end-0">
          <span className={`color-dark fw-bold`}>
            {jurnal[0]?.jenis == "debit"
              ? currencyFormatter(jurnal[0]?.saldo)
              : ""}
          </span>
        </td>
        <td className="py-1 border-start-0 ">
          <span className={`color-dark fw-bold`}>
            {jurnal[0]?.jenis == "debit"
              ? ""
              : currencyFormatter(jurnal[0]?.saldo)}
          </span>
        </td>
      </tr>
      {jurnal?.slice(1, jurnal?.length).map((d, idx) => {
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
      })}
    </>
  );
};

export default ListTransaksiRencana2;
