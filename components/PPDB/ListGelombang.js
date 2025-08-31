import React from "react";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";

const ListGelombang = ({
  d,
  handleDeleteGelombang,
  collapseOpen,
  setcollapseOpen,
  handleClickEdit,
  setGelombangId,
  handleDeleteInformasi,
}) => {
  const PendaftaranGelombang = ({ status }) => (
    <div
      className="rounded-ss px-md-4 px-3 py-3 d-flex align-items-md-center flex-md-row flex-column"
      style={{
        border: "1px solid #d2e5fa",
        backgroundColor: "#fbfcff",
      }}
    >
      <div className="d-flex align-items-sm-center align-items-start flex-grow-1 order-md-1 order-2 flex-sm-row flex-column">
        <img
          src="/img/icon-pendaftaran-gelombang-ppdb.svg"
          alt="icon-pendaftaran-gelombang-ppdb"
        />
        <div className="ms-sm-4 mt-sm-0  mt-3">
          <h5 className="fs-18-ss color-dark fw-bold mb-1">
            Pendaftaran Gelombang
          </h5>
          <p className="fw-semibold mb-0">
            {momentPackage(d?.dibuka).startOf("day").format("DD MMMM YYYY HH:mm")} -{" "}
            {momentPackage(d?.ditutup).endOf("day").format("DD MMMM YYYY HH:mm")}{" "}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center order-md-2 order-1 mb-md-0 mb-4 justify-content-md-start justify-content-between">
        <span
          className={`label-ss fs-12-ss fw-semibold rounded-pill ${
            status == "sudah-ditutup"
              ? "label-light-danger-ss"
              : status == "dibuka"
              ? "label-light-success-ss"
              : status == "akan-dibuka"
              ? "label-light-primary-ss"
              : ""
          }`}
        >
          {status == "sudah-ditutup"
            ? "Sudah Ditutup"
            : status == "dibuka"
            ? "Dibuka"
            : status == "akan-dibuka"
            ? "Akan Dibuka"
            : ""}
        </span>
        {/* <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
          <div
            role="button"
            id="dropdownOption"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="/img/option-button-vertical-secondary.svg"
              alt="option-button"
              className="ps-4"
            />
          </div>
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownOption"
          >
            <li
            // onClick={() => handleClickEdit()}
            // data-bs-toggle="modal"
            // data-bs-target={`#${getModalId()}`}
            >
              <a className="dropdown-item">
                <FaPen className="me-2" />
                <span>Edit</span>
              </a>
            </li>
            <li
            // onClick={() => deleteKegiatan()}
            >
              <a className="dropdown-item color-danger">
                <FaTrashAlt className="me-2" />
                <span>Hapus</span>
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
  const UjianPenerimaan = ({
    mediaTes,
    status,
    lokasiTes,
    linkTesOnline,
    namaBankSoal,
    data,
  }) => (
    <div
      className="rounded-ss px-md-4 px-3 py-3 d-flex align-items-md-start flex-md-row flex-column"
      style={{
        border: "1px solid #d2e5fa",
        backgroundColor: "#fbfcff",
      }}
    >
      <div className="d-flex align-items-start flex-grow-1 order-md-1 order-2 flex-sm-row flex-column">
        <img
          src="/img/icon-ujian-gelombang-ppdb.svg"
          alt="icon-ujian-gelombang-ppdb"
        />
        <div className="ms-sm-4 mt-sm-0 mt-3">
          <h5 className="fs-18-ss color-dark fw-bold mb-1">{data?.nama}</h5>
          <p className="fw-semibold mb-1">
            {momentPackage(data?.dibuka).startOf("day").format("DD MMMM YYYY HH:mm")} -{" "}
            {momentPackage(data?.ditutup).endOf("day").format("DD MMMM YYYY HH:mm")}
          </p>
          <p className="fw-semibold mb-1">
            Media Tes :{" "}
            {mediaTes == "langsung"
              ? "Tes Langsung"
              : mediaTes == "online"
              ? "Tes Online"
              : mediaTes == "ss"
              ? "Tes Online di Smarteschool"
              : ""}
          </p>
          <p className="fw-semibold mb-1">
            {mediaTes == "langsung"
              ? "Lokasi Tes"
              : mediaTes == "online"
              ? "Link Tes Online"
              : mediaTes == "ss"
              ? "Nama Bank Soal"
              : ""}{" "}
            :{" "}
            {mediaTes == "langsung"
              ? data?.ujian?.lokasi
              : mediaTes == "online"
              ? data?.ujian?.link
              : mediaTes == "ss"
              ? data?.ujian?.soal?.nama
              : ""}
          </p>
          <p className="fw-semibold mb-0">
            Keterangan : {data?.ujian?.keterangan}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-start order-md-2 order-1 mb-md-0 mb-4 justify-content-md-start justify-content-between">
        <span
          className={`label-ss fs-12-ss fw-semibold rounded-pill ${
            status == "sudah-ditutup"
              ? "label-light-danger-ss"
              : status == "dibuka"
              ? "label-light-success-ss"
              : status == "akan-dibuka"
              ? "label-light-primary-ss"
              : ""
          }`}
        >
          {status == "sudah-ditutup"
            ? "Sudah Ditutup"
            : status == "dibuka"
            ? "Dibuka"
            : status == "akan-dibuka"
            ? "Akan Dibuka"
            : ""}
        </span>
        <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
          <div
            role="button"
            id="dropdownOption"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="/img/option-button-vertical-secondary.svg"
              alt="option-button"
              className="ps-4"
            />
          </div>
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownOption"
          >
            <li
              onClick={() => {
                setGelombangId(d?.id);
                handleClickEdit({
                  ...data,
                  ...data?.ujian,
                  m_informasi_gelombang_id: data?.id,
                  id: data?.ujian?.id,
                  tipe: data?.ujian?.tipe,
                });
              }}
              data-bs-toggle="modal"
              data-bs-target={`#ModalUjianPenerimaan`}
            >
              <a className="dropdown-item">
                <FaPen className="me-2" />
                <span>Edit</span>
              </a>
            </li>
            <li onClick={() => handleDeleteInformasi(data?.id)}>
              <a className="dropdown-item color-danger">
                <FaTrashAlt className="me-2" />
                <span>Hapus</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const PengumumanPenerimaan = ({ status, data }) => (
    <div
      className="rounded-ss px-md-4 px-3 py-3 d-flex align-items-md-center flex-md-row flex-column"
      style={{
        border: "1px solid #d2e5fa",
        backgroundColor: "#fbfcff",
      }}
    >
      <div className="d-flex align-items-sm-center align-items-start flex-grow-1 order-md-1 order-2 flex-sm-row flex-column">
        <img
          src="/img/icon-pengumuman-gelombang-ppdb.svg"
          alt="icon-pengumuman-gelombang-ppdb"
        />
        <div className="ms-sm-4 mt-sm-0  mt-3">
          <h5 className="fs-18-ss color-dark fw-bold mb-1">{data?.nama}</h5>
          <p className="fw-semibold mb-0">
            {momentPackage(data?.pengumuman).format("DD MMMM YYYY")}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center order-md-2 order-1 mb-md-0 mb-4 justify-content-md-start justify-content-between">
        <span
          className={`label-ss fs-12-ss fw-semibold rounded-pill ${
            status == "sudah-ditutup"
              ? "label-light-danger-ss"
              : status == "dibuka"
              ? "label-light-success-ss"
              : status == "akan-dibuka"
              ? "label-light-primary-ss"
              : ""
          }`}
        >
          {status == "sudah-ditutup"
            ? "Sudah Ditutup"
            : status == "dibuka"
            ? "Dibuka"
            : status == "akan-dibuka"
            ? "Akan Dibuka"
            : ""}
        </span>
        <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
          <div
            role="button"
            id="dropdownOption"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="/img/option-button-vertical-secondary.svg"
              alt="option-button"
              className="ps-4"
            />
          </div>
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownOption"
          >
            <li
              onClick={() => {
                setGelombangId(d?.id);
                handleClickEdit(data);
              }}
              data-bs-toggle="modal"
              data-bs-target={`#modalPengumumanPPDB`}
            >
              <a className="dropdown-item">
                <FaPen className="me-2" />
                <span>Edit</span>
              </a>
            </li>
            <li onClick={() => handleDeleteInformasi(data?.id)}>
              <a className="dropdown-item color-danger">
                <FaTrashAlt className="me-2" />
                <span>Hapus</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const Kegiatan = ({ status, data }) => (
    <div
      className="rounded-ss px-md-4 px-3 py-3 d-flex align-items-md-center flex-md-row flex-column"
      style={{
        border: "1px solid #d2e5fa",
        backgroundColor: "#fbfcff",
      }}
    >
      <div className="d-flex align-items-sm-center align-items-start flex-grow-1 order-md-1 order-2 flex-sm-row flex-column">
        <img
          src="/img/icon-kegiatan-gelombang-ppdb.svg"
          alt="icon-kegiatan-gelombang-ppdb"
        />
        <div className="ms-sm-4 mt-sm-0  mt-3">
          <h5 className="fs-18-ss color-dark fw-bold mb-1">{data?.nama}</h5>
          <p className="fw-semibold mb-0">
            {momentPackage(data?.dibuka).startOf("day").format("DD MMMM YYYY HH:mm")} -{" "}
            {momentPackage(data?.ditutup).endOf("day").format("DD MMMM YYYY HH:mm")}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center order-md-2 order-1 mb-md-0 mb-4 justify-content-md-start justify-content-between">
        <span
          className={`label-ss fs-12-ss fw-semibold rounded-pill ${
            status == "sudah-ditutup"
              ? "label-light-danger-ss"
              : status == "dibuka"
              ? "label-light-success-ss"
              : status == "akan-dibuka"
              ? "label-light-primary-ss"
              : ""
          }`}
        >
          {status == "sudah-ditutup"
            ? "Sudah Ditutup"
            : status == "dibuka"
            ? "Dibuka"
            : status == "akan-dibuka"
            ? "Akan Dibuka"
            : ""}
        </span>
        <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
          <div
            role="button"
            id="dropdownOption"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="/img/option-button-vertical-secondary.svg"
              alt="option-button"
              className="ps-4"
            />
          </div>
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownOption"
          >
            <li
              onClick={() => {
                setGelombangId(d?.id);
                handleClickEdit(data);
              }}
              data-bs-toggle="modal"
              data-bs-target={`#modalKegiatanPPDB`}
            >
              <a className="dropdown-item">
                <FaPen className="me-2" />
                <span>Edit</span>
              </a>
            </li>
            <li onClick={() => handleDeleteInformasi(data?.id)}>
              <a className="dropdown-item color-danger">
                <FaTrashAlt className="me-2" />
                <span>Hapus</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  return (
    <div className="col-md-12">
      <div className="card card-ss card-biaya-pendaftaran p-0">
        <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-3 flex-sm-row flex-column">
          <div className="flex-grow-1 mb-sm-0 mb-3">
            <h4 className="fw-extrabold color-dark mb-2">
              {/* {idx + 1}. {data?.judul} */}
              {d?.nama}
            </h4>
            <div className="d-flex align-items-center">
              <img
                src="/img/icon-pendaftar-jalur-pendaftaran.svg"
                alt="icon-pendaftar"
                className="me-2"
              />
              <p className="fs-14-ss fw-semibold mb-0 color-primary">
                {d?.meta?.jumlahPendaftar} Pendaftar
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center ms-sm-0 ms-auto">
            <button
              type="button"
              className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
              style={{
                width: "40px",
                height: "40px",
              }}
              data-bs-toggle="modal"
              data-bs-target="#modalGelombangPPDB"
              onClick={() => handleClickEdit(d)}
            >
              <FaPen className="color-secondary" />
            </button>
            <button
              className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
              style={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => handleDeleteGelombang(d?.id)}
            >
              <FaTrashAlt className="color-secondary" />
            </button>
            <a
              data-bs-toggle="collapse"
              href={`#collapseExample${d?.id}`}
              role="button"
              aria-expanded="false"
              aria-controls={`collapseExample${d?.id}`}
              className={`btn-collapse ${collapseOpen[d?.id] ? "active" : ""}`}
              onClick={() =>
                setcollapseOpen({
                  ...collapseOpen,
                  [d?.id]: !collapseOpen[d?.id],
                })
              }
            >
              <span
                class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                style={{ width: "40px", height: "40px" }}
              >
                <img className="dropdown" src="/img/arrow-bottom.svg" alt="" />
              </span>
            </a>
          </div>
        </div>

        <div
          class="collapse"
          id={`collapseExample${d?.id}`}
          //   id={`collapseExample`}
        >
          <hr className="mb-4 mt-0" />
          <div class="card-body card-footer-ss pb-4 px-4 pt-0">
            <div className="row gy-4">
              <div className="col-md-12">
                <PendaftaranGelombang
                  status={
                    momentPackage(d?.dibuka).startOf("day") < momentPackage()
                      ? momentPackage(d?.ditutup).endOf("day") < momentPackage()
                        ? "sudah-ditutup"
                        : "dibuka"
                      : "akan-dibuka"
                  }
                />
              </div>
              {d?.informasi?.map((e) => {
                if (e?.tipe == "kegiatan") {
                  return (
                    <div className="col-md-12">
                      <Kegiatan
                        status={
                          momentPackage(e?.dibuka).startOf("day") <
                          momentPackage()
                            ? momentPackage(e?.ditutup).endOf("day") <
                              momentPackage()
                              ? "sudah-ditutup"
                              : "dibuka"
                            : "akan-dibuka"
                        }
                        data={e}
                      />
                    </div>
                  );
                } else if (e?.tipe == "pengumuman") {
                  return (
                    <div className="col-md-12">
                      <PengumumanPenerimaan
                        status={
                          momentPackage(d?.pengumuman).startOf("day") <
                          momentPackage()
                            ? "dibuka"
                            : "akan-dibuka"
                        }
                        data={e}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="col-md-12">
                      <UjianPenerimaan
                        mediaTes={e?.ujian?.tipe}
                        status={
                          momentPackage(e?.dibuka).startOf("day") <
                          momentPackage()
                            ? momentPackage(e?.ditutup).endOf("day") <
                              momentPackage()
                              ? "sudah-ditutup"
                              : "dibuka"
                            : "akan-dibuka"
                        }
                        data={e}
                      />
                    </div>
                  );
                }
              })}
              {/* <div className="col-md-12">
                <UjianPenerimaan
                  mediaTes={"langsung"}
                  lokasiTes={"SMK Negeri 26 Jakarta"}
                  status={"akan-dibuka"}
                />
              </div> */}

              <div className="col-md-12">
                <div className="dropdown dropdown-ss d-flex flex-column">
                  <button
                    className="btn-tambah-kegiatan-item rounded-ss p-4 d-flex align-items-center justify-content-center color-primary fs-18-ss fw-semibold text-decoration-none mb-4"
                    style={{ minHeight: "84px" }}
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaPlus className="me-2" /> Tambah
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1 w-100"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item pointer d-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#ModalUjianPenerimaan"
                        onClick={() => {
                          setGelombangId(d?.id), handleClickEdit(null);
                        }}
                      >
                        <img
                          src="/img/icon-ujian-gelombang-ppdb.svg"
                          alt="icon-ujian-gelombang"
                          className="me-2"
                          width={30}
                          height={30}
                        />
                        <span className="color-dark fw-bold">
                          Ujian Penerimaan
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item pointer d-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#modalPengumumanPPDB"
                        onClick={() => {
                          setGelombangId(d?.id), handleClickEdit(null);
                        }}
                      >
                        <img
                          src="/img/icon-pengumuman-gelombang-ppdb.svg"
                          alt="icon-pengumuman-gelombang-ppdb"
                          className="me-2"
                          width={30}
                          height={30}
                        />
                        <span className="color-dark fw-bold">Pengumuman</span>
                      </a>
                    </li>
                    <li
                    //  onClick={() => setInitialFormData()}
                    >
                      <a
                        className="dropdown-item pointer d-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#modalKegiatanPPDB"
                        onClick={() => {
                          setGelombangId(d?.id), handleClickEdit(null);
                        }}
                      >
                        <img
                          src="/img/icon-kegiatan-gelombang-ppdb.svg"
                          alt="icon-kegiatan-gelombang"
                          className="me-2"
                          width={30}
                          height={30}
                        />
                        <span className="color-dark fw-bold">Kegiatan</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGelombang;
