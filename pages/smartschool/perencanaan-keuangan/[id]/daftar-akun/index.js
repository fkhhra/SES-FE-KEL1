import { downloadURL, ssURL } from "client/clientAxios";
import {
  deleteAkunSekolah,
  downloadAkun,
  getKeuanganRencana,
  otomatisRencanaLabaRugi,
  putKeuanganSekolah,
} from "client/KeuanganSekolahClient";
import { getLaba } from "client/LaporanRencanaClient";
import { downloadNeraca } from "client/MutasiClient";
import { deleteRekeningSekolah } from "client/RekeningSekolahClient";
import HeaderPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderPerencanaanKeuangan";
import Layout from "components/Layout/Layout";
import ModalTambahAkunKeuangan from "components/Rekening/ModalTambahAkunKeuangan";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useUser from "hooks/useUser";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import Nestable from "react-nestable";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { currencyFormatter } from "utilities/HelperUtils";
import { neracaHitungLevelAkun } from "utilities/KeuanganUtils";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ id }) => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState();
  const [rekeningSekolah, setRekeningSekolah] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pathNode, setPathNode] = useState([]);

  const [levelAkun, setLevelAkun] = useState([]);
  const [akun, setAkun] = useState([]);
  const [akunSearch, setAkunSearch] = useState([]);
  const [items, setItems] = useState([]);
  const [laba, setLaba] = useState([]);
  const [rumus, setRumus] = useState([]);
  const [currentRumus, setCurrentRumus] = useState([]);

  const [searchDebounce] = useDebounce(search, 300);
  const _getLaba = async () => {
    const { data } = await getLaba(id);

    if (data) {
      setLaba(data?.kategori);
      setRumus(data?.rumus);

      const temp = [];
      data?.rumus?.map((d) => {
        temp.push(...JSON.parse(d?.rumus || "[]"));
      });
    }
  };
  const _otomatisRencanaLabaRugi = async () => {
    const { data } = await otomatisRencanaLabaRugi(id);
    // if (data) {
    //   setRekeningSekolah(data.rekSekolah);
    // }
  };
  const _getKeuanganSekolah = async () => {
    setLoading(true);
    const { data } = await getKeuanganRencana(id, { search: searchDebounce });
    if (data) {
      setRekeningSekolah(data?.rekening);
      setAkun(data?.akun);
      setAkunSearch(data?.akunSearch);
      setItems(
        JSON.parse(data?.keuangan?.template).length
          ? JSON.parse(data?.keuangan?.template)
          : []
      );

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = neracaHitungLevelAkun(
        data?.akun,
        template,
        "rencanaJurnal"
      );
      setLevelAkun(hasil);
    }
    setLoading(false);
  };

  const _putKeuanganSekolah = async (items) => {
    let check = 0;
    function recursive(data) {
      data.map((d) => {
        const akunKecil = akun?.find((e) => e?.id == d?.id);

        if (akunKecil) {
          if (d?.children?.length) {
            if (akunKecil?.jurnal?.length) {
              check = `akun ${
                akunKecil?.nama
              } dipakai dalam transaksi ${akunKecil?.jurnal
                ?.map((e) => e?.transaksi?.nama)
                ?.join(" ,")} `;
            } else {
              recursive(d?.children);
            }
          }
        }
      });
    }
    recursive(items);
    if (check) {
      toast.error(check);
      return;
    } else {
      setItems(items);
      setLoading(true);
      const { data, error } = await putKeuanganSekolah({ struktur: items });
      if (data) {
        toast.success(data?.message);
      } else {
        toast.error(error?.message);
        _getKeuanganSekolah();
      }
      setLoading(false);
    }
  };

  const handleDeleteRekening = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Kontak CS Smartschool jika sengaja terhapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteRekeningSekolah(id);
        if (data) {
          toast.success(data?.message);
          _getKeuanganSekolah();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const _deleteAkun = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Kontak CS Smartschool jika sengaja terhapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteAkunSekolah(id);
        if (data) {
          toast.success(data?.message);
          _getKeuanganSekolah();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleDownloadNeraca = async () => {
    const { data, error } = await downloadNeraca();
  };

  const onClickEdit = (data) => {
    setEditData({
      ...data,
    });
    if (data?.rumusAkun) {
      const parsed = JSON.parse(data?.rumusAkun?.rumus || "[]");
      setCurrentRumus(parsed);
    }
    console.log(data);
  };
  const handleDownloadAkun = async () => {
    const { data, error } = await downloadAkun({ data: pathNode });

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  useEffect(() => {
    _getKeuanganSekolah();
    _getLaba();
    _otomatisRencanaLabaRugi();
  }, [searchDebounce]);

  let temp = [];
  const recursive = (data, level, path = []) => {
    data
      // ?.filter((d) => {
      //   return akun?.find((item) => d?.id == item?.id);
      // })
      ?.map((d, idx) => {
        const pathBaru = [...path, idx];
        const akunExist = akun?.find((item) => d?.id == item?.id);
        if (akunExist) {
          temp.push({ ...akunExist, level, path: pathBaru });
          if (d?.children?.length > 0) {
            recursive(d?.children, level + 1, pathBaru);
          }
        }
      });
    setPathNode(temp);
  };

  useEffect(() => {
    if (items?.length) {
      recursive(items, 1);
    }
  }, [items]);

  const renderItem = ({ item, collapseIcon, handler, depth, index }) => {
    const akunExist = akun?.find((d) => d?.id == item?.id);
    if (akunExist) {
      const akun = levelAkun.find((d) => d?.id == item?.id);
      return (
        <div className="card card-ss px-4 p-3 pointer">
          <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
            <div className="d-flex align-items-center mb-md-0 mb-3">
              {handler}
              <div className="me-3">{collapseIcon}</div>
              <h5 className="fw-extrabold color-dark mb-0">
                {akunExist.kode} - {akunExist.nama}
              </h5>
            </div>
            <div className="d-flex align-items-center flex-wrap">
              {/* <h6 className="fs-18-ss color-primary fw-extrabold me-4 mt-1 mb-0 ms-md-0 ms-3 flex-wrap">
                {currencyFormatter(akun?.total)}
              </h6> */}
              {!user?.bagian ? (
                <div className="dropdown dropdown-ss ms-auto d-sm-inline d-flex justify-content-end">
                  <div
                    role="button"
                    className="ms-auto"
                    id="dropdownOption"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={`/img/icon-dropdown-option.svg`}
                      alt="icon-option"
                    />
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownOption"
                  >
                    <li
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahAkunKeuangan"
                      onClick={() => onClickEdit(akunExist)}
                    >
                      <a className="dropdown-item">
                        <FaPen className="me-2" />
                        <span>Edit</span>
                      </a>
                    </li>
                    <li onClick={() => _deleteAkun(item?.id)}>
                      <a className="dropdown-item color-danger">
                        <FaTrashAlt className="me-2" />
                        <span>Hapus</span>
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  console.log(items);
  return (
    <Layout>
      <AnimatePage>
        <HeaderPerencanaanKeuangan ssURL={ssURL} id={id} user={user} />
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss mb-4 p-4">
              <div className="d-flex jusitfy-content-start align-items-md-center flex-md-row flex-column">
                <input
                  type="text"
                  className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss mb-md-0 mb-3 me-md-3 md-w-100"
                  style={{ height: "42px" }}
                  id="exampleFormControlInput1"
                  placeholder="Cari Akun"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-ss btn-outline-secondary  btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss mb-md-0 mb-3 me-md-3"
                  type="button"
                  onClick={() => handleDownloadAkun()}
                >
                  <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                  Rekap Akun
                </button>
                {!user?.bagian ? (
                  <button
                    type="button"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTambahAkunKeuangan"
                    onClick={() => setEditData("")}
                  >
                    <FaPlus /> Tambah
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* <HeaderAkunKeuangan
              search={search}
              setSearch={setSearch}
              setEditData={setEditData}
              downloadNeraca={handleDownloadNeraca}
            /> */}
            <div className="daftar-akun-keuangan">
              {searchDebounce ? (
                <>
                  {akunSearch?.length > 0 &&
                    akunSearch?.map((data, idx) => {
                      // console.log(data);
                      return (
                        <div className="card card-ss px-4 p-3 mb-2 pointer">
                          <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                            <div className="d-flex align-items-center mb-md-0 mb-3">
                              {/* {handler}
                              <div className="me-3">{collapseIcon}</div> */}
                              <h5 className="fw-extrabold color-dark mb-0">
                                {data.kode} - {data.nama}
                              </h5>
                            </div>
                            <div className="d-flex align-items-center flex-wrap">
                              <h6 className="fs-18-ss color-primary fw-extrabold me-4 mt-1 mb-0 ms-md-0 ms-3 flex-wrap">
                                {/* {currencyFormatter(data?.total)} */}
                              </h6>
                              {!user?.bagian ? (
                                <div className="dropdown dropdown-ss ms-auto d-sm-inline d-flex justify-content-end">
                                  <div
                                    role="button"
                                    className="ms-auto"
                                    id="dropdownOption"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <img
                                      src={`/img/icon-dropdown-option.svg`}
                                      alt="icon-option"
                                    />
                                  </div>
                                  <ul
                                    className="dropdown-menu dropdown-menu-ss my-1"
                                    aria-labelledby="dropdownOption"
                                  >
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#modalTambahAkunKeuangan"
                                      onClick={() => onClickEdit(data)}
                                    >
                                      <a className="dropdown-item">
                                        <FaPen className="me-2" />
                                        <span>Edit</span>
                                      </a>
                                    </li>
                                    <li onClick={() => _deleteAkun(data?.id)}>
                                      <a className="dropdown-item color-danger">
                                        <FaTrashAlt className="me-2" />
                                        <span>Hapus</span>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </>
              ) : (
                <Nestable
                  items={items}
                  renderItem={renderItem}
                  onChange={(e) => _putKeuanganSekolah(e.items)}
                  maxDepth={6}
                />
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
      <ModalTambahAkunKeuangan
        id={id}
        editData={editData}
        _getKeuanganSekolah={_getKeuanganSekolah}
        rekeningSekolah={rekeningSekolah}
        setItems={setItems}
        akun={akun}
        items={items}
        laba={laba}
        rumus={rumus}
        currentRumus={currentRumus}
        setCurrentRumus={setCurrentRumus}
      />
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
