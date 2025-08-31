import { Tooltip } from "antd";
import { ssURL } from "client/clientAxios";
import React from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";
import Link from "next/link";

const ListPembayaran = ({
  pembayaranData,
  onClickEdit,
  _deletePembayaran,
  rombelData,
  pelunasanData,
  rekeningSekolah,
}) => {
  return (
    <div className="col-md-6" data-joyride="card-pembayaran">
      <div className="card-jadwal-ujian card card-ss bg-white rounded-ss pt-4 mb-4">
        {/* Card Label & Option Start */}
        <div className="card-header-ss d-flex justify-content-between align-items-center mb-3 px-4">
          {/* Jadwal Ujian Label Start */}

          <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
            {pembayaranData?.jenis?.toUpperCase()}
          </div>

          {/* Jadwal Ujian Label End */}

          {/* Dropdown Option Start */}
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
                data-bs-target="#modalBuatPembayaran"
                onClick={() => onClickEdit(pembayaranData)}
              >
                <a className="dropdown-item">
                  <FaPen className="me-2" />
                  <span>Edit</span>
                </a>
              </li>
              <li onClick={() => _deletePembayaran(pembayaranData.id)}>
                <a className="dropdown-item color-danger">
                  <FaTrashAlt className="me-2" />
                  <span>Hapus</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Dropdown Option End */}
        </div>
        <Link
          href={`${ssURL}/pembayaran/[id]`}
          as={`${ssURL}/pembayaran/${pembayaranData.id}`}
        >
          <a className="text-decoration-none">
            <div className="card-body px-4 pb-0">
              <h4 className="color-dark fw-black mb-2">
                {`${pembayaranData?.nama} ${
                  pembayaranData?.bulan == null
                    ? ""
                    : `- ${
                        pembayaranData?.bulan.charAt(0).toUpperCase() +
                        pembayaranData?.bulan.slice(1)
                      }`
                }`}
              </h4>
              {pembayaranData?.mRekSekolahId && (
                <p className="mb-0 color-secondary fs-ss-14">
                  {rekeningSekolah?.find(
                    (d) => d?.id == pembayaranData?.mRekSekolahId
                  )?.jenis || "Dana Sekolah"}
                </p>
              )}
              <p className="color-secondary fw-bold mb-2">Kelas</p>
              <div className="d-flex flex-wrap align-items-center mb-4">
                {rombelData?.map((rombel) => (
                  <div className="me-2 mb-2">
                    <div
                      className="btn btn-outline-secondary-ss rounded-pill fs-12-ss d-flex justify-content-center align-items-center p-0 px-2"
                      style={{
                        minWidth: "75px",
                        height: "20px",
                      }}
                    >
                      {rombel?.rombel?.nama}
                    </div>
                  </div>
                ))}
                <Tooltip
                  title={pembayaranData?.rombel
                    ?.slice(5)
                    ?.map((item) => item?.rombel?.nama)
                    ?.join(", ")}
                >
                  {pembayaranData?.rombel?.length > 5 && (
                    <span className="fw-bold fs-14-ss color-secondary mb-2">
                      {`+${pembayaranData?.rombel?.length - 5} Lainnya`}
                    </span>
                  )}
                </Tooltip>
              </div>
              <div className="progress-container mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1 color-secondary">
                  <span className="fw-bold">Total Pelunasan</span>
                  <span className="fw-bold">{`${(
                    (pelunasanData?.totalLunas / pelunasanData?.total) *
                    100
                  ).toFixed(2)}%`}</span>
                </div>
                <div
                  className="progress rounded-pill bg-light-secondary pointer w-100"
                  style={{
                    height: "7px",
                  }}
                  dataBsToogle={"tooltip"}
                  dataBsPlacement={"bottom"}
                  title={`100%`}
                >
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{
                      width: `${(
                        (pelunasanData?.totalLunas / pelunasanData?.total) *
                        100
                      ).toFixed(2)}%`,
                    }}
                    // ariaValueNow={"75"}
                    ariaValueMin={"0"}
                    ariaValueMax={"100"}
                  ></div>
                </div>
              </div>
            </div>
            <div className="card-footer-ss px-0 pb-3">
              <hr className="m-0 mb-3 bg-secondary" />
              <span className="fs-14-ss fw-semibold color-secondary px-4">
                Diunggah pada{" "}
                {momentPackage(pembayaranData?.tanggalDibuat).format(
                  "dddd, DD MMMM YYYY"
                ) || ""}
              </span>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ListPembayaran;
