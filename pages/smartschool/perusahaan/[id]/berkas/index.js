import { DatePicker } from "antd";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import HeaderPkl from "components/Pkl/HeaderPkl";
import ModalTambahPerusahaan from "components/Pkl/ModalTambahPerusahaan";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { detailPerusahaan } from "client/PerusahaanClient";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { hideModal, showModal } from "utilities/ModalUtils";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import swal from "sweetalert";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import HeaderPerusahaan from "components/Perusahaan/HeaderPerusahaan";
import HeaderDetailPerusahaan from "components/Perusahaan/HeaderDetailPerusahaan";
import SectionInformasiPerusahaan from "components/Perusahaan/SectionInformasiPerusahaan";
import SectionRuangLingkupMou from "components/Perusahaan/SectionRuangLingkupMou";
import SectionKontakPenanggungJawab from "components/Perusahaan/SectionKontakPenanggungJawab";
import Navbar from "components/Shared/Navbar/Navbar";
import ListMoU from "components/Perusahaan/ListMoU";
import ModalTambahBerkasMoU from "components/Perusahaan/ModalTambahBerkasMoU";
import ModalTambahBerkasSurat from "components/Perusahaan/ModalTambahBerkasSurat";

import {
  getDetailBerkas,
  postBerkasSurat,
  putBerkasSurat,
  deleteBerkasSurat,
  deleteBerkasMou,
} from "client/MouSuratPerusahaanClient";
import { momentPackage } from "utilities/HelperUtils";
import { getPreviewURL } from "utilities/FileViewer";

const { RangePicker } = DatePicker;
const initialFormData = {
  nama: "",
  logo: "",
  namaPt: "",
  bidang: "",
};

const index = ({ id, subnav }) => {
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [formData, setFormData] = useState({ ...initialFormData });
  const [dataDetailPerusahaan, setDataDetailPerusahaan] = useState([]);
  const [mou, setMou] = useState([]);
  const [surat, setSurat] = useState([]);
  const [editData, setEditData] = useState(null);
  const [editDataSurat, setEditDataSurat] = useState(null);

  const _getDetailPerusahaan = async () => {
    const { data, error } = await detailPerusahaan(id);

    if (data) {
      setDataDetailPerusahaan(data?.perusahaan);
    }
  };

  const _getDetailBerkas = async () => {
    const { data, error } = await getDetailBerkas(id, { search });

    if (data) {
      setMou(data?.mou);
      setSurat(data?.surat);
    }
  };

  const _deleteBerkasMou = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteBerkasMou(id);
        if (data) {
          toast.success(data.message);
          _getDetailBerkas();
        }
      }
    });
  };

  const _deleteBerkasSurat = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteBerkasSurat(id);
        if (data) {
          toast.success(data.message);
          _getDetailBerkas();
        }
      }
    });
  };

  useEffect(() => {
    _getDetailPerusahaan();
    _getDetailBerkas();
  }, [debounceSearch]);

  const navItems = [
    {
      url: `${ssURL}/perusahaan/${dataDetailPerusahaan?.id}/berkas?subnav=mou`,
      as: `${ssURL}/perusahaan/${dataDetailPerusahaan?.id}/berkas?subnav=mou`,
      text: "MoU",
      active: subnav == "mou" || !subnav,
    },
    {
      url: `${ssURL}/perusahaan/${dataDetailPerusahaan?.id}/berkas?subnav=surat`,
      as: `${ssURL}/perusahaan/${dataDetailPerusahaan?.id}/berkas?subnav=surat`,
      text: "Surat",
      active: subnav == "surat",
    },
  ];

  const handleTambahTa = () => {
    showModal("modalTambahBerkasMoU");
    setEditData(null);
  };

  const listMoU = [{ isActive: true }, {}, {}];

  return (
    <Layout
      modalWrapper={
        <>
          <ModalTambahBerkasMoU
            id={id}
            editData={editData}
            _getDetailBerkas={_getDetailBerkas}
          />
          <ModalTambahBerkasSurat
            id={id}
            editData={editDataSurat}
            _getDetailBerkas={_getDetailBerkas}
          />
        </>
      }
    >
      <AnimatePage>
        <>
          <div className="row gy-4">
            <div className="col-12">
              <HeaderDetailPerusahaan
                ssURL={ssURL}
                id={id}
                dataPerusahaan={dataDetailPerusahaan}
                _getDetailPerusahaan={_getDetailPerusahaan}
              />
            </div>
            <div className="col-12">
              <Navbar nav={navItems} />
            </div>
          </div>
          <div className="row gy-4">
            {(subnav == "mou" || !subnav) && (
              <>
                {" "}
                <div className="col-12">
                  <button
                    className="btn btn-tambah-kegiatan-item color-primary w-100 p-3 px-4 border-0 d-flex align-items-center justify-content-center rounded-ss"
                    style={{
                      height: 82,
                    }}
                    onClick={handleTambahTa}
                  >
                    <FaPlus className="me-2" /> Tambah
                  </button>
                </div>
                <div className="col-12">
                  <div className="row gy-4">
                    {mou?.length != 0 ? (
                      mou?.map((d, idx) => {
                        return (
                          <div className="col-md-12">
                            <ListMoU
                              setEditData={setEditData}
                              _deleteBerkasMou={_deleteBerkasMou}
                              id={idx + 1}
                              isActive={d?.status == 1}
                              dataMou={d}
                              //   setEditData={setEditData}
                              //   data={d}
                              //   status={status}
                              //   handleDelete={handleDelete}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="card-body p-4">
                        <div className="row justify-content-center">
                          <div className="col-md-6 col-sm-8 col-10 text-center">
                            <img
                              src="/img/empty-state-data.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="col-md-12 text-center">
                            <h4 className="color-dark fw-black mt-4 mb-2">
                              Tidak Ada Data
                            </h4>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {subnav == "surat" && (
              <>
                <div className="col-12">
                  <div className="card-ss bg-white shadow-dark-ss card-body rounded-ss w-100 d-flex flex-md-row flex-column p-0 pb-5 ">
                    <div className="col-md-12 ">
                      <div className="row p-4">
                        <div className="col-lg-4 col-12 d-flex align-items-center">
                          <h1 className="fw-extrabold fs-4 color-dark mb-0">
                            Daftar Surat
                          </h1>
                        </div>
                        <div className="col-lg-8 d-flex flex-md-row flex-column justify-content-lg-end justify-content-between mt-lg-0 mt-3">
                          <div className="flex-grow-1 me-md-4 mb-md-0 mb-3">
                            <input
                              type="text"
                              className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                              style={{ height: "42px", width: "100%" }}
                              id="exampleFormControlInput1"
                              placeholder="Cari Surat"
                              autoComplete="off"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>
                          <div className="">
                            <button
                              type="button"
                              className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold col-12"
                              data-bs-toggle="modal"
                              data-bs-target="#modalTambahBerkasSurat"
                              onClick={() => setEditDataSurat(null)}
                            >
                              <FaPlus /> Tambah
                            </button>
                          </div>
                        </div>
                      </div>
                      {surat.length != 0 ? (
                        <div className="card-body p-0">
                          <div className="" data-joyride="table-rombel">
                            <table className="table-ss">
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th style={{ width: "35%" }}>Nama</th>
                                  <th className="text-md-center">Tanggal</th>
                                  <th className="text-md-center">Detail</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {surat?.map((d, idx) => {
                                  return (
                                    <tr>
                                      <td data-th="No">{idx + 1}</td>
                                      <td data-th="Nama">{d?.nama}</td>
                                      <td
                                        data-th="Tanggal"
                                        className="text-md-center"
                                      >
                                        {momentPackage(d?.createdAt).format(
                                          "DD MMM YYYY"
                                        )}
                                      </td>
                                      <td
                                        data-th="Detail"
                                        className="text-md-center"
                                      >
                                        <a
                                          href={getPreviewURL(d?.lampiran)}
                                          target="_blank"
                                          className="btn btn-primary btn-primary-ss px-4 py-1 fw-semibold fs-14-ss rounded-pill shadow-primary-ss hover-shadow-none"
                                        >
                                          Lihat
                                        </a>
                                      </td>
                                      <td data-th="Aksi">
                                        <div className="d-flex flex-lg-row flex-md-column flex-row">
                                          <button
                                            type="button"
                                            className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                            }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalTambahBerkasSurat"
                                            onClick={() => setEditDataSurat(d)}
                                            data-joyride="edit-mapel"
                                          >
                                            <FaPen className="color-secondary" />
                                          </button>
                                          <button
                                            className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                            }}
                                            onClick={() =>
                                              _deleteBerkasSurat(d?.id)
                                            }
                                            data-joyride="delete-mapel"
                                          >
                                            <FaTrashAlt className="color-secondary" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          {/* // )} */}
                        </div>
                      ) : (
                        <div className="card-body p-4">
                          <div className="row justify-content-center">
                            <div className="col-md-6 col-sm-8 col-10 text-center">
                              <img
                                src="/img/empty-state-data.svg"
                                alt=""
                                className="img-fluid"
                              />
                            </div>
                            <div className="col-md-12 text-center">
                              <h4 className="color-dark fw-black mt-4 mb-2">
                                Tidak Ada Data
                              </h4>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { id, subnav } }) {
  return {
    props: {
      id: id || null,
      subnav: subnav || null,
    },
  };
}

export default index;
