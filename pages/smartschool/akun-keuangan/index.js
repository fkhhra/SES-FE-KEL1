import { downloadURL, ssURL } from "client/clientAxios";
import {
  deleteAkunSekolah,
  downloadAkun,
  getKeuanganSekolah,
  otomatisLabaRugi,
  putKeuanganSekolah,
} from "client/KeuanganSekolahClient";
import { getLaba, postRumus } from "client/LabaRugiClient";
import { downloadNeraca } from "client/MutasiClient";
import { deleteRekeningSekolah } from "client/RekeningSekolahClient";
import HeaderRealisasiKeuangan from "components/Keuangan/RealisasiKeuangan/HeaderRealisasiKeuangan";
import Layout from "components/Layout/Layout";
import HeaderAkunKeuangan from "components/Rekening/HeaderAkunKeuangan";
import ModalTambahAkunKeuangan from "components/Rekening/ModalTambahAkunKeuangan";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useUser from "hooks/useUser";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Nestable from "react-nestable";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";

const index = () => {
  const { user, setUser } = useUser();
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState();
  const [rekeningSekolah, setRekeningSekolah] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [loading, setLoading] = useState(false);
  const [pathNode, setPathNode] = useState([]);

  const [akun, setAkun] = useState([]);
  const [akunSearch, setAkunSearch] = useState([]);
  const [items, setItems] = useState([]);
  const [laba, setLaba] = useState([]);
  const [rumus, setRumus] = useState([]);
  const [currentRumus, setCurrentRumus] = useState([]);

  const _postRumus = async () => {
    if (!currentRumus?.length) {
      toast.error("Periksa kembali rumus anda");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data } = await postRumus({
      rumus: JSON.stringify(currentRumus),
      nama: formData?.nama,
    });

    if (data) {
      toast.success(data?.message);
      _getLaba();
      hideModal("modalRumusLabaRugi");
      setCurrentRumus([]);
      setFormData({ ...formData, btnBio: "success" });
      return;
    }
  };
  const _otomatisLabaRugi = async () => {
    const { data } = await otomatisLabaRugi();
    // if (data) {
    //   setRekeningSekolah(data.rekSekolah);
    // }
  };
  const _getLaba = async () => {
    const { data } = await getLaba();

    if (data) {
      setLaba(data?.kategori);
      setRumus(data?.rumus);

      const temp = [];
      data?.rumus?.map((d) => {
        temp.push(...JSON.parse(d?.rumus || "[]"));
      });
    }
  };

  const [searchDebounce] = useDebounce(search, 300);

  const _getKeuanganSekolah = async () => {
    setLoading(true);
    const { data } = await getKeuanganSekolah({ search: searchDebounce });
    if (data) {
      if (!data?.keuangan?.template) {
        _getKeuanganSekolah();
      }
      setRekeningSekolah(data?.rekening);
      setAkun(data?.akun);
      setAkunSearch(data?.akunSearch);
      setKeuangan(data?.keuangan);
      setItems(
        JSON.parse(data?.keuangan?.template).length
          ? JSON.parse(data?.keuangan?.template)
          : []
      );
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
              console.log(akunKecil);
              check = `akun ${
                akunKecil?.nama
              } dipakai dalam transaksi ${akunKecil?.jurnal
                ?.map((e) => e?.transaksi?.nama)
                ?.join(" , ")} `;
            } else {
              recursive(d?.children);
            }
          }
        }
      });
    }
    recursive(items);
    if (check) {
      swal({
        title: "Yakin ingin mengubah template?",
        text: `Mengubah Template bisa saja terjadi error karena akun ini telah terhubung dengan transaksi lain`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
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
        } else {
          setItems(JSON.parse(keuangan?.template || "[]"));
          // toast.error(check);
          return;
        }
      });
      // setItems(JSON.parse(keuangan?.template || "[]"));
      // toast.error(check);
      // return;
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

  const handleDownloadAkun = async () => {
    const { data, error } = await downloadAkun({ data: pathNode });

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  const onClickEdit = (data) => {
    setEditData({
      ...data,
    });
    if (data?.rumusAkun) {
      const parsed = JSON.parse(data?.rumusAkun?.rumus || "[]");
      setCurrentRumus(parsed);
    }
  };

  useEffect(() => {
    _otomatisLabaRugi();
    _getKeuanganSekolah();
    _getLaba();
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

  // console.log(items);
  const renderItem = ({ item, collapseIcon, handler, depth, index }) => {
    // console.log(item);
    const akunExist = akun?.find((d) => d?.id == item?.id);
    if (akunExist) {
      return (
        <div className="card card-ss px-4 p-3 pointer">
          <div className="d-flex">
            {handler}
            <div className="me-3">{collapseIcon}</div>
            <h5 className="fw-extrabold color-dark mb-0">
              {akunExist.kode} - {akunExist.nama}
            </h5>
            {!user.bagian ? (
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
      );
    } else {
      return null;
    }
  };
  // console.log(search);

  return (
    <Layout isFluid={true}>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <HeaderRealisasiKeuangan
              ssURL={ssURL}
              judul={`Daftar Akun`}
              user={user}
            />
          </div>
          <div className="col-md-12">
            <HeaderAkunKeuangan
              search={search}
              setSearch={setSearch}
              setEditData={setEditData}
              downloadAkun={handleDownloadAkun}
              user={user}
            />
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
                            {!user.bagian ? (
                              <div className="d-flex align-items-center flex-wrap">
                                <h6 className="fs-18-ss color-primary fw-extrabold me-4 mt-1 mb-0 ms-md-0 ms-3 flex-wrap">
                                  {/* {currencyFormatter(data?.total)} */}
                                </h6>
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
                              </div>
                            ) : (
                              ""
                            )}
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
        editData={editData}
        _getKeuanganSekolah={_getKeuanganSekolah}
        rekeningSekolah={rekeningSekolah}
        setItems={setItems}
        akun={akun}
        items={items}
        laba={laba}
        rumus={rumus}
        _postRumus={() => {
          formData?.id ? _putRumus(formData?.id) : _postRumus();
        }}
        currentRumus={currentRumus}
        setCurrentRumus={setCurrentRumus}
      />
    </Layout>
  );
};

export default index;
