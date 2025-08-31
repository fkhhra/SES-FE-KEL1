import { ssURL } from "client/clientAxios";
import {
  deleteRencanaKeuangan,
  getRencanaKeuangan,
} from "client/RencanaKeuanganClient";
import ModalBuatRencana from "components/Keuangan/PerencanaanKeuangan/ModalBuatRencana";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useUser from "hooks/useUser";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { formatAngkaTitik, momentPackage } from "utilities/HelperUtils";
import { hitungTotalPerencanaan } from "utilities/KeuanganUtils";

const index = ({ nama }) => {
  const { user } = useUser();
  const [search, setSearch] = useState(nama);
  const [debounceSearch] = useDebounce(search, 400);
  const [rencana, setRencana] = useState([]);
  const [editData, setEditData] = useState(null);

  const _getRencana = async () => {
    const { data } = await getRencanaKeuangan({ search: nama });

    if (data) {
      setRencana(data.perencanaan);
    }
  };

  const handleDelete = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteRencanaKeuangan(id);
        if (data) {
          toast.success(data?.message);
          _getRencana();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  useEffect(() => {
    _getRencana();
  }, [nama]);

  useEffect(() => {
    router.push({
      pathname: "/smartschool/perencanaan-keuangan",
      query: {
        ...router.query,
        nama: debounceSearch,
      },
    });
  }, [debounceSearch]);

  return (
    <Layout
      modalWrapper={
        <>
          <ModalBuatRencana _getRencana={_getRencana} editData={editData} />
        </>
      }
    >
      <AnimatePage>
        <div
          className="card card-ss px-3 py-4"
          //   style={{
          //     marginTop: ta?.length == 0 || taDataSudahSinkron ? "" : "80px",
          //   }}
        >
          <div className="row justify-content-between">
            <div className="col-md-3 d-flex align-items-center">
              <h4 className="fw-extrabold color-dark mb-0">
                Daftar Perencanaan
              </h4>
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                style={{ height: "38px", width: "100%" }}
                id="exampleFormControlInput1"
                placeholder="Cari perencanaan"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {user?.bagian == "aproval" || !user?.bagian ? (
          <button
            className="btn color-primary w-100 p-3 px-4 border-0 d-flex align-items-center justify-content-center bg-light-primary rounded-ss mt-4 btn-tambah-table"
            style={{
              height: 82,
            }}
            data-bs-toggle="modal"
            data-bs-target="#modalBuatRencana"
            //   onClick={handleTambahTa}
            onClick={() => {
              setEditData(null);
            }}
          >
            <FaPlus className="me-2" /> Tambah
          </button>
        ) : (
          ""
        )}
        {rencana
          ?.sort((a, b) => {
            return b?.aktif - a?.aktif;
          })
          ?.map((d) => {
            const total = hitungTotalPerencanaan(d);
            return (
              <div className="card card-ss py-3 px-4 mt-4">
                <div className="d-flex justify-content-between">
                  <div
                    className={`label-ss fs-12-ss fw-semibold rounded-pill 
              ${
                d?.aktif
                  ? "bg-light-primary color-primary "
                  : "bg-soft-secondary color-secondary"
              }
              `}
                    style={{ width: "min-content", whiteSpace: "nowrap" }}
                  >
                    {d?.aktif ? "Aktif" : "Non-Aktif"}
                  </div>
                  {!user?.bagian ? (
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
                            setEditData({ ...d });
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#modalBuatRencana"
                        >
                          <a className="dropdown-item color-secondary">
                            <FaPen /> &nbsp; Edit
                          </a>
                        </li>
                        <li onClick={() => handleDelete(d?.id)}>
                          <a className="dropdown-item color-danger">
                            <FaTrashAlt /> &nbsp; Hapus
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <hr style={{ margin: "16px -24px 24px -24px" }} />

                <Link
                  href={`${ssURL}/perencanaan-keuangan/[id]/daftar-akun`}
                  as={`${ssURL}/perencanaan-keuangan/${d?.id}/daftar-akun`}
                >
                  <a>
                    <h4 className="fw-extrabold color-dark mb-0">{d?.nama}</h4>

                    <div className="d-flex mb-3 flex-grow-1 flex-wrap justify-content-md-start justify-content-between mt-4">
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss fw-semibold color-secondary mb-1">
                          Tanggal Awal
                        </p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {momentPackage(d?.tanggalAwal).format(
                            "dddd, DD MMM YYYY"
                          )}
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss fw-semibold color-secondary mb-1">
                          Tanggal Akhir
                        </p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {momentPackage(d?.tanggalAkhir).format(
                            "dddd, DD MMM YYYY"
                          )}
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss fw-semibold color-secondary mb-1">
                          Total Perencanaan
                        </p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          Rp{formatAngkaTitik(total)}
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })}
        {/* <div className="card card-ss py-3 px-4 mt-4">
          <div className="d-flex justify-content-between">
            <div
              className={`label-ss fs-12-ss fw-semibold rounded-pill bg-soft-secondary color-secondary`}
              style={{ width: "min-content", whiteSpace: "nowrap" }}
            >
              Non-Aktif
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
                <img src="/img/icon-option-horizontal.svg" alt="icon-option" />
              </div>
              <ul
                className="dropdown-menu dropdown-menu-ss my-1"
                aria-labelledby="dropdownEditDeleteBab"
              >
                <li
                  className="d-flex align-items-center"
                  //   onClick={() => {
                  //     setEditModal("modalBuatTahunAkademik", data);
                  //     showModal("modalBuatTahunAkademik");
                  //   }}
                >
                  <a className="dropdown-item color-secondary">
                    <FaPen /> &nbsp; Edit
                  </a>
                </li>
                <li
                // onClick={() => handleDelete(data?.id)}
                >
                  <a className="dropdown-item color-danger">
                    <FaTrashAlt /> &nbsp; Hapus
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr style={{ margin: "16px -24px 24px -24px" }} />

          <Link
            href={`${ssURL}/perencanaan-keuangan/[id]/daftar-akun`}
            as={`${ssURL}/perencanaan-keuangan/1/daftar-akun`}
          >
            <a>
              <h4 className="fw-extrabold color-dark mb-0">
                Rencana Keuangan Tahun 2022
              </h4>

              <div className="d-flex mb-3 flex-grow-1 flex-wrap justify-content-md-start justify-content-between mt-4">
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <p className="fs-14-ss fw-semibold color-secondary mb-1">
                    Tanggal Awal
                  </p>
                  <p className="fs-18-ss fw-bold color-dark m-0">
                    Sen, 1 Jan 2022
                  </p>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <p className="fs-14-ss fw-semibold color-secondary mb-1">
                    Tanggal Akhir
                  </p>
                  <p className="fs-18-ss fw-bold color-dark m-0">
                    Sen, 1 Jan 2023
                  </p>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <p className="fs-14-ss fw-semibold color-secondary mb-1">
                    Total Perencanaan
                  </p>
                  <p className="fs-18-ss fw-bold color-dark m-0">
                    Rp 443.870.000
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </div> */}
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { nama } }) {
  return {
    props: {
      nama: nama || null,
    },
  };
}

export default index;
