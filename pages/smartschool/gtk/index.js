import { Pagination, Tooltip } from "antd";
import { ssURL } from "client/clientAxios";
import { deleteGTK, editGTK, getGTK, postGTK } from "client/GTKClient";
import { resetPasswordRole } from "client/UserClient";
import SectionImport from "components/Dapodik/SectionImport";
import HeaderDataSekolah from "components/DataSekolah/HeaderDataSekolah";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Avatar from "components/Shared/Avatar/Avatar";
import MyJoyride from "components/Shared/MyJoyride/MyJoyride";
import Navbar from "components/Shared/Navbar/Navbar";
import NewModal from "components/Shared/NewModal/NewModal";
import { buildSettingForm } from "data/form";
import useSekolah from "hooks/useSekolah";
import useUser from "hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { whatsappLink } from "utilities/app-helper";
import { renderFormInput } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

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

  const [listGuru, setListGuru] = useState([]);
  const [total, setTotal] = useState(0);

  const [searchSiswa, setSearchSiswa] = useState("");
  const [debounceSearchSiswa] = useDebounce(searchSiswa, 600);

  const settingList = buildSettingForm(formData, setFormData, "Tambah Guru");

  const router = useRouter();

  const { page = 1 } = router.query;

  const [loading, setLoading] = useState(true);

  const getTeachersData = async () => {
    setLoading(true);
    const { data } = await getGTK({
      page: searchSiswa != "" ? 1 : page,
      search: searchSiswa,
    });
    if (data) {
      setLoading(false);
      setListGuru(data?.guru?.data);
      setTotal(data?.guru?.total);
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
      hideModal("modal-guru");
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const handleUpdatePassword = async () => {
    swal({
      title: "Yakin ingin mengubah Password?",
      text: "!!! Password guru akan diubah !!!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setButtonState("loading");
        const { isSuccess, data, error } = await resetPasswordRole({
          password: formData?.password,
          role: "guru",
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
      hideModal("modal-guru");
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

  // useEffect(() => {
  //   document
  //     .getElementById("exampleFormControlInput1")
  //     .removeAttribute("autocomplete");
  // });
  const steps = [
    {
      target: '[data-joyride="sidebar-data"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Data GTK</h5>
          <p className="color-secondary fw-semibold">
            Pada menu ini berisikan semua data data dari GTK. Tekan pada menu
            untuk masuk ke menu data dari GTK.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="sidebar-kehadiran"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Kehadiran GTK</h5>
          <p className="color-secondary fw-semibold">
            Pada menu ini berisikan semua informasi kehadiran dari GTK. Tekan
            pada menu untuk masuk ke menu kehadiran dari GTK.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-tambah-guru"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Menambah Data Baru ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan data GTK baru ke sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-gtk"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Daftar {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}
          </h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar{" "}
            {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"} yang sudah
            ditambahkan ke sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-gtk"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Edit {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai data{" "}
            {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}
            yang sudah dibuat.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-gtk"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Hapus {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus data{" "}
            {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"} yang sudah dibuat.
          </p>
        </div>
      ),
    },
  ];

  const navItems = [
    {
      url: `${ssURL}/gtk`,
      as: `${ssURL}/gtk`,
      text: "Data",
      active: true,
    },
    {
      url: `${ssURL}/kehadiran-gtk`,
      as: `${ssURL}/kehadiran-gtk`,
      text: "Kehadiran",
      active: false,
    },
  ];

  return (
    <Layout
      modalWrapper={
        <>
          <NewModal
            modalId="modal-guru"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">
                  {editId ? "Edit" : "Tambah"} Guru
                </h4>
                <span className="fs-6 fw-normal">
                  Isi informasi dibawah untuk{" "}
                  {editId ? "mengubah data guru" : "menambah guru"}
                </span>
              </>
            }
            content={
              <>
                <div className="mb-3">{renderFormInput(settingList)}</div>
                {formData?.avatar && (
                  <div className="text-center">
                    <img
                      src={`${formData?.avatar}`}
                      width={200}
                      height={200}
                      className="img-fit-cover rounded-circle pointer"
                    />
                  </div>
                )}
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={buttonState}
                onClick={handleModalSubmit}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
              />
            }
          />
          <NewModal
            modalId="modal-reset-password"
            modalSize="sm"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">Ubah Password Guru</h4>
                <span className="fs-6 fw-normal">Isi password baru guru</span>
              </>
            }
            content={
              <>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    autoComplete="new-password"
                    value={formData?.password}
                    name="password"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={buttonState}
                onClick={handleUpdatePassword}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
              />
            }
          />
          <NewModal
            modalId="modalUnggahGtk"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">Unggah Data</h4>
                <span className="fs-6 fw-normal">
                  Unduh template di bawah ini untuk mengunggah data mata
                  pelajaran di sekolah
                </span>
              </>
            }
            content={
              <>
                <SectionImport
                  name="Guru"
                  bgImg="/img/bg-card-dapodik-import-guru.png"
                  fileTemplate="/import/template-gtk-import.xlsx"
                  endpointUrl="gtk/import-singkat"
                />
              </>
            }
            removeFooter={true}
            submitButton={
              <ReactiveButton
                buttonState={"idle"}
                // onClick={handleSubmitImport}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
              />
            }
          />
        </>
      }
    >
      <MyJoyride steps={steps} />
      <AnimatePage>
        {user?.role == "pengawas" && (
          <>
            <HeaderDataSekolah ssURL={ssURL} />
          </>
        )}
        <div className="row">
          {user?.role != "pengawas" && (
            <div className="col-lg-12">
              <Navbar nav={navItems} />
            </div>
          )}
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <div className="">
                    <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                      Daftar {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}
                    </h4>
                    {user?.role == "pengawas" && (
                      <div className="d-flex align-items-center mt-sm-4 mt-sm-0">
                        <img
                          src="/img/icon-user.svg"
                          alt="icon-user"
                          className="me-2"
                        />
                        <h6 className="fw-semibold color-dark mb-0">
                          Jumlah Total:{" "}
                          <span className="fw-extrabold">
                            {total}{" "}
                            {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}
                          </span>
                        </h6>
                      </div>
                    )}
                  </div>
                  {user?.role == "pengawas" && (
                    <>
                      {" "}
                      <input
                        type="text"
                        className="form-control form-search rounded-pill fw-semibold border-secondary-ss mb-auto mt-sm-0 mt-3"
                        style={{ height: "42px" }}
                        id="exampleFormControlInput1"
                        placeholder="Cari guru"
                        autoComplete="off"
                        value={searchSiswa}
                        onChange={(e) => setSearchSiswa(e.target.value)}
                      />
                    </>
                  )}
                  {user?.role != "pengawas" && (
                    <div className="d-flex align-items-center">
                      <img
                        src="/img/icon-user.svg"
                        alt="icon-user"
                        className="me-2"
                      />
                      <h6 className="fw-semibold color-dark mb-0">
                        Jumlah Total:{" "}
                        <span className="fw-extrabold">
                          {total}{" "}
                          {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}
                        </span>
                      </h6>
                    </div>
                  )}
                </div>
                {user?.role != "pengawas" && (
                  <>
                    {" "}
                    <hr className="my-4" />
                    <div className="row">
                      <div className="col-lg-6 col-md-6 mb-3">
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
                          className="btn btn-ss btn-outline-secondary  btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss w-100"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#modalUnggahGtk"
                        >
                          <FaCloudUploadAlt className="me-2 fs-18-ss" />
                          Unggah Data
                        </button>
                      </div>
                      <div className="col-lg-3 col-md-6 mb-3">
                        <button
                          type="button"
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold w-100"
                          data-bs-toggle="modal"
                          data-bs-target="#modal-guru"
                          onClick={() => {
                            setEditId(null);
                            setFormData(initialFormData);
                          }}
                        >
                          <FaPlus /> Tambah
                        </button>
                      </div>
                    </div>
                  </>
                )}
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
                        {listGuru?.length > 0 &&
                          listGuru?.map((data, idx) => (
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
                                      className="rounded-circle shadow-success-ss hover-shadow-none"
                                      style={{ width: "45px", height: "45px" }}
                                    >
                                      <Tooltip title={data?.whatsapp}>
                                        <img
                                          src={`/img/whatsapp.svg`}
                                          width={45}
                                          height={45}
                                        />
                                      </Tooltip>
                                    </div>
                                  </a>
                                )}
                              </td>
                              <td data-th="Informasi">
                                <Link href={`${ssURL}/gtk/${data?.id}`}>
                                  <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
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
                                    data-bs-target="#modal-guru"
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
