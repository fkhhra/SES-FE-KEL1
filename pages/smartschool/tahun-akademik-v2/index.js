import { useState, useEffect } from "react";
import { getTa, deleteTa } from "client/TaClient";
import { momentPackage } from "utilities/HelperUtils";
import { showModal } from "utilities/ModalUtils";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { ssURL } from "client/clientAxios";

import toast from "react-hot-toast";
import swal from "sweetalert";
import useEditModal from "hooks/useEditModal";

import Link from "next/link";

import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Layout from "components/Layout/Layout";
import ModalBuatTahunAkademik from "components/TahunAkademik/ModalBuatTahunAkademik";
import ModalSiapkanTahunAkademik from "components/TahunAkademik/ModalSiapkanTahunAkademik";
import AlertNotification from "components/Shared/AlertNotification/AlertNotification";

const initialStatus = {
  jamMengajar: "waiting",
  mapel: "waiting",
  rombel: "waiting",
  jadwalMengajar: "waiting",
};

const index = () => {
  const [statusSiapkanTa, setStatusSiapkanTa] = useState(initialStatus);

  const [ta, setTa] = useState([]);

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);

  const taDataSudahSinkron =
    ta?.[0]?.jamSinkron == 1 &&
    ta?.[0]?.mapelSinkron == 1 &&
    ta?.[0]?.rombelSinkron == 1 &&
    ta?.[0]?.jadwalSinkron == 1;

  const { setEditModal } = useEditModal();

  const getTaData = async () => {
    let params = {};
    search && (params.search = search);
    const { data } = await getTa(params);
    setTa(data?.ta);
  };

  const handleTambahTa = () => {
    if (ta?.[0]?.aktif == 0) {
      toast.error(
        "Harus ada tahun akademik aktif untuk menaikan/mengganti tahun akademik baru"
      );
    } else {
      showModal("modalSiapkanTahunAkademik");
      setStatusSiapkanTa(initialStatus);
    }
  };

  const handleDelete = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteTa(id);
        if (data) {
          toast.success(data?.message);
          getTaData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const getStatus = (aktif, index) => {
    if (!taDataSudahSinkron && index == 0) {
      return {
        text: "Perlu Menyiapkan Data",
        className: "bg-soft-danger color-danger",
      };
    }

    if (aktif == 1) {
      return {
        text: "Aktif",
        className: "bg-light-primary color-primary",
      };
    }

    if (aktif == 0) {
      return {
        text: "Non-Aktif",
        className: "bg-light-secondary color-secondary",
      };
    }
  };

  useEffect(() => {
    getTaData();
  }, [debounceSearch]);

  return (
    <Layout>
      {ta?.length > 0 && !taDataSudahSinkron && (
        <AlertNotification
          type="danger"
          onClick={() => showModal("modalSiapkanTahunAkademik")}
        >
          <span>
            Data tahun akademik perlu disiapkan Klik{" "}
            <span className="fw-extrabold text-decoration-underline">
              disini
            </span>{" "}
            untuk menyiapkan data.
          </span>
        </AlertNotification>
      )}
      {(ta?.[0]?.semester == 1 ||
        ta?.[0]?.semester == "Ganjil" ||
        ta?.[0]?.semester == "ganjil") &&
        momentPackage().format("MM") >= "01" &&
        momentPackage().format("MM") <= "06" && (
          <AlertNotification type="danger" onClick={handleTambahTa}>
            <span>
              Data tahun akademik perlu dinaikkan Klik{" "}
              <span className="fw-extrabold text-decoration-underline">
                disini
              </span>{" "}
              untuk manaikan tahun akademik.
            </span>
          </AlertNotification>
        )}

      {(ta?.[0]?.semester == 2 ||
        ta?.[0]?.semester == "Genap" ||
        ta?.[0]?.semester == "genap") &&
        momentPackage().format("MM") >= "07" &&
        momentPackage().format("MM") <= "12" && (
          <AlertNotification type="danger" onClick={handleTambahTa}>
            <span>
              Data tahun akademik perlu diganti Klik{" "}
              <span className="fw-extrabold text-decoration-underline">
                disini
              </span>{" "}
              untuk mengganti tahun akademik.
            </span>
          </AlertNotification>
        )}

      <AnimatePage>
        <div
          className="card card-ss px-3 py-4"
          style={{
            marginTop: ta?.length == 0 || taDataSudahSinkron ? "" : "80px",
          }}
        >
          <div
            className={`row justify-content-between ${
              (ta?.length > 0 && !taDataSudahSinkron) ||
              ((ta?.[0]?.semester == 1 ||
                ta?.[0]?.semester == "Ganjil" ||
                ta?.[0]?.semester == "ganjil") &&
                momentPackage().format("MM") >= "01" &&
                momentPackage().format("MM") <= "06") ||
              ((ta?.[0]?.semester == 2 ||
                ta?.[0]?.semester == "Genap" ||
                ta?.[0]?.semester == "genap") &&
                momentPackage().format("MM") >= "07" &&
                momentPackage().format("MM") <= "12")
                ? "mt-5"
                : ""
            }`}
          >
            <div className="col-md-3 d-flex align-items-center">
              <h4 className="fw-extrabold color-dark mb-0">Tahun Akademik</h4>
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                style={{ height: "38px", width: "100%" }}
                id="exampleFormControlInput1"
                placeholder="Cari tahun akademik"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {ta?.length == 0 && (
          <button
            className="btn color-primary w-100 p-3 px-4 border-0 d-flex align-items-center justify-content-center bg-light-primary rounded-ss mt-4 btn-tambah-table"
            style={{
              height: 82,
            }}
            // onClick={handleTambahTa}
            onClick={() => {
              showModal("modalBuatTahunAkademik");
              setEditModal("modalBuatTahunAkademik", null);
            }}
          >
            <FaPlus className="me-2" /> Tambah
          </button>
        )}

        {ta?.length > 0 ? (
          ta?.map((data, index) => (
            <div
              className="card card-ss py-3 px-4 mt-4"
              key={`${index}-${new Date().getTime()}`}
            >
              <div className="d-flex justify-content-between">
                <div
                  className={`label-ss fs-12-ss rounded-pill ${
                    getStatus(data?.aktif, index).className
                  }`}
                  style={{ width: "min-content", whiteSpace: "nowrap" }}
                >
                  {getStatus(data?.aktif, index).text}
                </div>

                <div
                  className="dropdown dropdown-ss"
                  data-joyride="dropdown-edit-delete-bab"
                >
                  <div
                    role="button"
                    id="dropdownEditDeleteBab"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/img/icon-option-horizontal.svg"
                      alt="icon-option"
                    />
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownEditDeleteBab"
                  >
                    <li
                      className="d-flex align-items-center"
                      onClick={() => {
                        setEditModal("modalBuatTahunAkademik", data);
                        showModal("modalBuatTahunAkademik");
                      }}
                    >
                      <a className="dropdown-item color-secondary">
                        <FaPen /> &nbsp; Edit
                      </a>
                    </li>
                    <li onClick={() => handleDelete(data?.id)}>
                      <a className="dropdown-item color-danger">
                        <FaTrashAlt /> &nbsp; Hapus
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <hr style={{ margin: "18px -23px 24px -23px" }} />

              <Link href={`${ssURL}/tahun-akademik/${data?.id}/mata-pelajaran`}>
                <a>
                  <h4 className="fw-extrabold color-dark mb-0">
                    {`${data?.tahun} - ${
                      data?.semester == "1" ||
                      data?.semester == "Ganjil" ||
                      data?.semester == "ganjil"
                        ? "Ganjil"
                        : "Genap"
                    }`}
                  </h4>
                  <p className="fw-bold color-primary mb-0 fs-14-ss">
                    {`${data?.namaKepsek} - ${data?.nipKepsek}`}
                  </p>

                  <div className="d-flex mb-3 flex-grow-1 flex-wrap justify-content-md-start justify-content-between mt-4">
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss fw-semibold color-secondary mb-1">
                        Tanggal Awal
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {data?.tanggalAwal
                          ? momentPackage(data?.tanggalAwal).format(
                              "ddd, DD MMM YYYY"
                            )
                          : "-"}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss fw-semibold color-secondary mb-1">
                        Tanggal Akhir
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {data?.tanggalAkhir
                          ? momentPackage(data?.tanggalAkhir).format(
                              "ddd, DD MMM YYYY"
                            )
                          : "-"}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss fw-semibold color-secondary mb-1">
                        Pembagian Rapor PTS
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {data?.tanggalRapor
                          ? momentPackage(data?.tanggalRapor).format(
                              "ddd, DD MMM YYYY"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-lg-12 mt-4">
            <div className="card card-ss p-4">
              <div className="row justify-content-center">
                <div className="col-md-5 col-sm-8 col-9 d-flex justify-content-center align-items-center">
                  <img
                    src="/img/empty-state-data.svg"
                    alt="empty-state"
                    className="img-fluid mb-3"
                  />
                </div>
                <div className="col-md-8 text-center">
                  <h5 className="color-dark fw-black">Tidak Ada Data</h5>
                  <p className="fw-bold fs-14-ss">
                    Tekan tombol <span className="color-primary">di bawah</span>{" "}
                    untuk membuat tahun akedemik
                  </p>
                  <button
                    type="button"
                    className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                    onClick={() => {
                      showModal("modalBuatTahunAkademik");
                      setEditModal("modalBuatTahunAkademik", null);
                    }}
                  >
                    Buat Tahun Akademik
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ModalSiapkanTahunAkademik
          getTaData={getTaData}
          ta={ta}
          status={statusSiapkanTa}
          setStatus={setStatusSiapkanTa}
        />

        <ModalBuatTahunAkademik getTaData={getTaData} />
      </AnimatePage>
    </Layout>
  );
};

export default index;
