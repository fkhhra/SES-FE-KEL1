import { deleteMutasiV2 } from "client/MutasiClient";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";

const ListPenyusutan = ({
  data,
  setEditData,
  _deletePenyusutan,
  editData,
  handleClickEdit,
  isRencanaKeuangan,
}) => {
  const jurnal = data?.jurnal;
  const onClickEdit = (data) => {
    setEditData({
      ...data,
      tanggal: momentPackage(data?.tanggal),
      nomor: data?.nomor,
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
        <td className="border-start-0 border-end-0 ">
          <p className="mb-0">
            {momentPackage(data?.tanggalPembelian).format("DD/MM/YYYY")}
          </p>
        </td>
        <td className="border-start-0 border-end-0">
          <p className="mb-1 color-dark">{data?.nama}</p>
        </td>
        <td className="border-start-0 border-end-0 text-center">
          <div className="d-flex justify-content-center flex-column ">
            <p className="mb-1 color-dark">
              {/* Rp {data?.nilaiPerolehan} */}
              {currencyFormatter(data?.nilaiPerolehan)}
            </p>
          </div>
        </td>
        <td className="py-1 border-start-0  border-end-0 text-center">
          {data?.masaPakai} {data?.satuan}
        </td>
        <td className="py-1 border-start-0 border-end-0 text-center">
          <span className={`color-dark`}>
            {/* Rp {data?.akumulasiPenyusutan} */}
            {currencyFormatter(data?.akumulasiPenyusutan)}

            {/* {jurnal[0]?.jenis == "debit"
              ? currencyFormatter(jurnal[0]?.saldo)
              : ""} */}
          </span>
        </td>
        <td className="py-1 border-start-0 border-end-0 text-center">
          <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
            <div
              role="button"
              id="dropdownOption"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={`/img/icon-dropdown-option.svg`} alt="icon-option" />
            </div>
            <ul
              className="dropdown-menu dropdown-menu-ss my-1"
              aria-labelledby="dropdownOption"
            >
              <li
                data-bs-toggle="modal"
                data-bs-target="#modalPenyusutanAset"
                onClick={() => handleClickEdit(data)}
              >
                <a className="dropdown-item">
                  <FaPen className="me-2" />
                  <span>Edit</span>
                </a>
              </li>
              <li onClick={() => _deletePenyusutan(data.id)}>
                <a className="dropdown-item color-danger">
                  <FaTrashAlt className="me-2" />
                  <span>Hapus</span>
                </a>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ListPenyusutan;
