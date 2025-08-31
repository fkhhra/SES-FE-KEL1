import { Pagination } from "antd";
import { getRombel } from "client/RombelClient";
import { resetPasswordRole } from "client/UserClient";
import useUser from "hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { ssURL } from "../../../client/clientAxios";
import { deleteGTK, editGTK, getGTK, postGTK } from "../../../client/GTKClient";
import Layout from "../../../components/Layout/Layout";
import ModalTambahMarketplace from "../../../components/Rombel/ModalTambahMarketplace";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import Avatar from "../../../components/Shared/Avatar/Avatar";
import { buildSettingForm } from "../../../data/form";
import useSekolah from "../../../hooks/useSekolah";
import { whatsappLink } from "../../../utilities/app-helper";
import { momentPackage } from "../../../utilities/HelperUtils";
import { hideModal } from "../../../utilities/ModalUtils";

const initialFormData = {
  nama: "",
  gender: "L",
  whatsapp: "",
  password: "",
  avatar: "",
};

const index = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [editId, setEditId] = useState({});

  const [listMarketplace, setListMarketplace] = useState([]);
  const [total, setTotal] = useState(0);

  const [searchSiswa, setSearchSiswa] = useState("");
  const [debounceSearchSiswa] = useDebounce(searchSiswa, 600);

  const settingList = buildSettingForm(formData, setFormData, "Tambah Guru");

  const router = useRouter();

  const { page = 1 } = router.query;

  const [loading, setLoading] = useState(true);
  const getTeachersData = async () => {
    setLoading(true);
    const { data } = await getGTK({ page, search: searchSiswa });
    if (data) {
      setLoading(false);
      setListMarketplace(data?.Marketplace?.data);
      setTotal(data?.Marketplace?.total);
    }
  };

  const { user } = useUser();

  const { sekolah } = useSekolah();

  const handlePostGtk = async () => {
    const { data, isSuccess, error } = await postGTK(formData);
    if (isSuccess) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData(initialFormData);
      getTeachersData();
      hideModal("modal-marketplace");
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const handleUpdatePassword = async () => {
    swal({
      title: "Yakin ingin mengubah Password?",
      text: "!!! Password Marketplace akan diubah !!!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setButtonState("loading");
        const { isSuccess, data, error } = await resetPasswordRole({
          password: formData?.password,
          role: "Marketplace",
        });
        if (isSuccess) {
          toast.success(data?.message);
          setButtonState("success");
        } else {
          toast.error(error?.message);
          setButtonState("error");
        }
      }
    });
  };

  const handleEditGtk = async () => {
    const { data, isSuccess, error } = await editGTK(editId, formData);
    if (isSuccess) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData(initialFormData);
      getTeachersData();
      hideModal("modal-marketplace");
    } else {
      toast.error(error?.message || error?.[0]?.message);
      setButtonState("error");
    }
  };

  const handleDeleteGtx = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { isSuccess, data, error } = await deleteGTK(id);
        if (isSuccess) {
          toast.success(data?.message);
          getTeachersData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const onClickEdit = (data) => {
    if (data) {
      setEditId(data.id);
      setFormData({
        nama: data.nama,
        gender: data.gender,
        whatsapp: data.whatsapp,
        password: data.password,
        avatar: data.avatar,
        role: data.role,
        bagian: data.bagian?.split(";"),
      });
    }
  };

  const handleModalSubmit = () => {
    if (!editId) {
      handlePostGtk();
    } else {
      handleEditGtk();
    }
  };

  useEffect(() => {
    getTeachersData();
  }, [page, debounceSearchSiswa]);

  useEffect(() => {
    document
      .getElementById("exampleFormControlInput1")
      .removeAttribute("autocomplete");
  });

  const [listJurusan, setListJurusan] = useState([]);

  const getRombelData = async () => {
    setLoading(true);
    const { data } = await getRombel({
      jam_saat_ini: momentPackage().format("HH:mm"),
    });
    if (data) {
      // setListJurusan(data.jurusan);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRombelData();
  }, []);

  return (
    <Layout
      modalWrapper={
        <>
          <ModalTambahMarketplace
            editId={editId}
            // listJurusan={listJurusan?.map((d) => ({
            //   label: d.kode,
            //   value: d.id,
            // }))}
            getRombelData={getRombelData}
            // editData={editData}
          />
        </>
      }
    >
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                    Data Marketplace
                  </h4>
                </div>
                <hr className="my-4" />
                <div className="row">
                  <div className="col-lg-9 col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                      style={{ height: "42px", width: "100%" }}
                      id="exampleFormControlInput1"
                      placeholder="Cari Guru"
                      autoComplete="off"
                      value={searchSiswa}
                      onChange={(e) => setSearchSiswa(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold w-100"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-marketplace"
                      onClick={() => {
                        setEditId(null);
                        setFormData(initialFormData);
                      }}
                    >
                      <FaPlus /> Tambah
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" data-joyride="table-gtk">
                  {loading ? (
                    <Skeleton count={4} height={50} />
                  ) : (
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Foto</th>
                          <th className="text-capitalize">
                            {sekolah?.integrasi}
                          </th>
                          <th>Informasi</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listMarketplace?.length > 0 &&
                          listMarketplace?.map((data, idx) => (
                            <tr key={`${idx}-${new Date().getTime()}`}>
                              <td data-th="Nomor">{idx + 1}</td>
                              <td data-th="Nama">{data?.nama}</td>
                              <td data-th="Foto">
                                <Avatar
                                  size={45}
                                  name={data?.nama}
                                  src={data?.avatar}
                                />
                              </td>

                              <td
                                data-th={sekolah?.integrasi}
                                className="text-capitalize"
                              >
                                {sekolah?.id == 2 ? (
                                  data?.whatsapp
                                ) : (
                                  <a
                                    href={whatsappLink(data?.whatsapp)}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    <div
                                      className="rounded-circle shadow-success-ss"
                                      style={{ width: "45px", height: "45px" }}
                                    >
                                      <img
                                        src={`/img/whatsapp.svg`}
                                        width={45}
                                        height={45}
                                      />
                                    </div>
                                  </a>
                                )}
                              </td>
                              <td data-th="Informasi">
                                <Link href={`${ssURL}/gtk/${data?.id}`}>
                                  <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1">
                                    Detail
                                  </a>
                                </Link>
                              </td>
                              <td data-th="Aksi" className="actions">
                                <div className="d-flex flex-lg-row flex-md-column flex-row">
                                  <button
                                    type="button"
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-marketplace"
                                    onClick={() => onClickEdit(data)}
                                    data-joyride="edit-gtk"
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => handleDeleteGtx(data?.id)}
                                    data-joyride="delete-gtk"
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                  <div className="my-4 text-center">
                    <Pagination
                      total={total}
                      showSizeChanger={false}
                      current={parseInt(page) || 1}
                      pageSize={25}
                      onChange={(e) => router.push(`${ssURL}/gtk?page=${e}`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
