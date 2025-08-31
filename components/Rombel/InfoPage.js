import Axios from "axios";
import { useState } from "react";
import {
  FaCloudUploadAlt,
  FaInfo,
  FaPen,
  FaPlus,
  FaPrint,
  FaTrashAlt,
  FaUndoAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { baseURL, ssURL } from "../../client/clientAxios";
import {
  deleteStudent,
  editStudent,
  postStudent,
} from "../../client/StudentClient";
import LayoutDetail from "../../components/Layout/LayoutDetail";
import AnimatePage from "../../components/Shared/AnimatePage/AnimatePage";
import NewModal from "../../components/Shared/NewModal/NewModal";
import Tabs from "../../components/Shared/Tabs/Tabs";
import WhatsappLink from "../../components/Shared/WhatsappLink/WhatsappLink";
import { buildSettingForm } from "../../data/form";
import useUser from "../../hooks/useUser";
import { renderFormInput } from "../../utilities/HelperUtils";
import { hideModal } from "../../utilities/ModalUtils";
import Avatar from "../Shared/Avatar/Avatar";
import { useDebounce } from "use-debounce";
import router from "next/router";
import swal from "sweetalert";
import { resetPasswordRole } from "client/UserClient";

const InfoPage = ({ id, jadwalMengajar, getDetailRombelData }) => {
  const initialFormData = {
    nama: "",
    id: 0,
    gender: "L",
    whatsapp: "",
    password: "",
    avatar: "",
    btnFace: "idle",
    photos: {},
    noUjian: "",
    role: "",
  };

  const [importAnggotaRombel, setImportAnggotaRombel] = useState();
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [buttonState, setButtonState] = useState("idle");
  const [search, setSearch] = useState("");

  const [debounceSearch] = useDebounce(search, 400);

  const settingList = buildSettingForm(formData, setFormData, "Tambah Siswa");

  const [buttonStateImportAnggotaRombel, setButtonStateImportAnggotaRombel] =
    useState("idle");

  const { user } = useUser();

  const handleUpdatePassword = async () => {
    swal({
      title: "Yakin ingin mengubah Password?",
      text: "!!! Password akan diubah !!!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setButtonState("loading");
        const { isSuccess, data, error } = await resetPasswordRole({
          password: formData?.password,
          m_rombel_id: parseInt(id),
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

  const handleImportAnggotaRombelData = async () => {
    if (!importAnggotaRombel) {
      return toast.error("File wajib diisi");
    }

    setButtonStateImportAnggotaRombel("loading");
    const d = new FormData();
    d.append("file", importAnggotaRombel);
    d.append("m_rombel_id", id);
    await Axios.post(baseURL + "/anggota-rombel/import-password", d)
      .then((res) => {
        setButtonStateImportAnggotaRombel("success");
        toast.success(res.data.message);
        getDetailRombelData();
        if (res?.length) {
          res?.map((d) => toast.error(d?.message));
        }
      })
      .catch((err) => {
        setButtonStateImportAnggotaRombel("error");
        toast.error(err.response.data.message);
      });
  };

  const handlePostStudent = async () => {
    setFormData({ ...formData, btnFace: "loading" });

    const { data, error } = await postStudent({ ...formData, mRombelId: id });
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData(initialFormData);
      hideModal("modal-siswa");
      getDetailRombelData();
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const handleEdit = async () => {
    setFormData({ ...formData, btnFace: "loading" });

    const { data, error } = await editStudent(editId, formData);
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      hideModal("modal-siswa");
      getDetailRombelData();
      setFormData(initialFormData);
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const handleModalSubmit = (e) => {
    if (!editId) {
      handlePostStudent();
    } else {
      handleEdit();
    }
  };

  const handleDelete = async (id, mRombelId) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteStudent(id, { mRombelId });
        if (data) {
          toast.success(data?.message);
          getDetailRombelData();
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
        id: data.id,
        gender: data.gender,
        whatsapp: data.whatsapp,
        avatar: data.avatar,
        photos: data.photos,
        noUjian: data?.noUjian,
        role: data?.role,
      });
    }
  };

  const navItems = [
    {
      id: "siswa",
      nav: "Siswa",
      active: true,
      content: (
        <ul className="list-group list-group-flush">
          {jadwalMengajar?.rombel?.anggotaRombel
            ?.filter(
              (item) =>
                item?.user &&
                (debounceSearch.trim() == "" ||
                  item?.user?.nama?.includes(debounceSearch))
            )
            ?.sort((a, b) =>
              ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
            )
            ?.map((d, idx) => (
              <li
                className="list-group-item py-3"
                key={`${idx}-${new Date().getTime()}`}
              >
                <div className="d-flex justify-content-between flex-sm-row flex-column">
                  <div className="d-flex align-items-center">
                    <Avatar
                      name={d.user?.nama}
                      src={d.user?.avatar}
                      size={45}
                    />
                    <h6 className="ms-3 mb-0 fw-semibold">
                      {d.user?.nama} <br />{" "}
                      {d.user?.noUjian
                        ? `(No Ujian: ${d.user?.noUjian || "-"})`
                        : null}
                    </h6>
                    {d.role == "ketua kelas" && (
                      <div className="ms-3 label-ss rounded-pill fs-12-ss label-light-primary-ss fw-bolder d-sm-block d-none">
                        {d.role}
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-end mt-sm-0 mt-2 align-items-center">
                    {d.role == "ketua kelas" && (
                      <div className="label-ss rounded-pill fs-12-ss label-light-primary-ss fw-bolder d-sm-none d-block me-auto">
                        {d.role}
                      </div>
                    )}
                    <WhatsappLink
                      phoneNumber={d.user?.whatsapp}
                      text="Halo nak"
                    >
                      <div
                        className="rounded-circle shadow-success-ss me-3"
                        style={{ width: "45px", height: "45px" }}
                      >
                        <img src={`/img/whatsapp.svg`} width={45} height={45} />
                      </div>
                    </WhatsappLink>
                    {user?.id === jadwalMengajar?.rombel?.mUserId ? (
                      <button
                        className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        onClick={() =>
                          router.push(`${ssURL}/profil/${d?.user?.id}`)
                        }
                        data-joyride="edit-slider"
                      >
                        <FaPen className="color-secondary" />
                      </button>
                    ) : null}
                    {user?.role === "admin" && (
                      <>
                        <button
                          className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() =>
                            window.open(`${ssURL}/profil/${d?.user?.id}`)
                          }
                          data-joyride="edit-slider"
                        >
                          <FaInfo className="color-secondary" />
                        </button>
                        <button
                          className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#modal-siswa"
                          onClick={() => onClickEdit(d.user)}
                          data-joyride="edit-slider"
                        >
                          <FaPen className="color-secondary" />
                        </button>
                        <button
                          className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => handleDelete(d.user.id, d.mRombelId)}
                          data-joyride="edit-slider"
                        >
                          <FaTrashAlt className="color-secondary" />
                        </button>
                        <button
                          className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => router.push(`/smartschool/rombel/${d?.user?.id}/kartu-peserta-ujian`)}
                          data-joyride="edit-slider"
                        >
                          <FaPrint className="color-secondary" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ),
    },
    {
      id: "walas",
      nav: "Wali Kelas",
      active: false,
      content: (
        <ul className="list-group list-group-flush">
          <li className="list-group-item py-3" key={`walas`}>
            <div className="d-flex justify-content-sm-between flex-sm-row flex-column">
              <div className="d-flex align-items-center mb-sm-0 mb-3">
                <img src={`/img/avatar.svg`} width={45} height={45} />
                <h6 className="ms-3 mb-0 fw-semibold">
                  {jadwalMengajar?.rombel?.user?.nama}
                  {/* <div className="color-primary">
                        {jadwalMengajar?.rombel?.user?.nama}
                      </div> */}
                </h6>
              </div>
              <div className="d-flex justify-content-end">
                <WhatsappLink
                  phoneNumber={jadwalMengajar?.rombel?.user?.whatsapp}
                >
                  <div
                    className="rounded-circle shadow-success-ss"
                    style={{ width: "45px", height: "45px" }}
                  >
                    <img src={`/img/whatsapp.svg`} width={45} height={45} />
                  </div>
                </WhatsappLink>
              </div>
            </div>
          </li>
          {false &&
            guru?.map((d, idx) => (
              <li
                className="list-group-item py-3"
                key={`${idx}-${new Date().getTime()}`}
              >
                <div className="d-flex justify-content-sm-between flex-sm-row flex-column">
                  <div className="d-flex align-items-center mb-sm-0 mb-3">
                    <img src={`/img/avatar.svg`} width={45} height={45} />
                    <h6 className="ms-3 mb-0 fw-semibold">
                      {d.mataPelajaran?.user?.nama}
                      <div className="color-primary">
                        {d.mataPelajaran?.nama}
                      </div>
                    </h6>
                  </div>
                  <div className="d-flex justify-content-end">
                    <WhatsappLink phoneNumber={d.mataPelajaran?.user?.whatsapp}>
                      <div
                        className="rounded-circle shadow-success-ss"
                        style={{ width: "45px", height: "45px" }}
                      >
                        <img src={`/img/whatsapp.svg`} width={45} height={45} />
                      </div>
                    </WhatsappLink>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ),
    },
  ];
  return (
    <LayoutDetail title={jadwalMengajar?.rombel?.nama}>
      <AnimatePage>
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h4 className="fw-extrabold color-dark mb-0">Detail Kelas</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item pt-4 py-2 ps-0">
                <h6 className="color-dark fw-bold mb-2">Nama kelas</h6>
                <p className="color-secondary fs-18-ss fw-semibold mb-0">
                  Kelas {jadwalMengajar?.rombel?.nama}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="card card-ss">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column mb-3">
              <h4 className="fw-extrabold color-dark mb-4">Anggota</h4>
              <div className="d-lg-flex d-none">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss py-2 px-4 me-md-3 mb-lg-0 mb-3"
                  id="exampleFormControlInput1"
                  placeholder="Cari Siswa"
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {user?.role == "admin" && (
                  <>
                    <button
                      className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3 me-lg-3"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <FaCloudUploadAlt className="me-2" /> Unggah Data
                    </button>
                    <button
                      className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-siswa"
                      onClick={() => {
                        setFormData(initialFormData);
                        setEditId(null);
                      }}
                    >
                      <FaPlus className="me-2" /> Tambah siswa
                    </button>
                  </>
                )}
              </div>
              <div className="d-lg-none d-flex flex-lg-row flex-column justify-content-end">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss py-2 px-4 me-md-3 mb-lg-0 mb-3 w-100"
                  id="exampleFormControlInput1"
                  placeholder="Cari Siswa"
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {user?.role == "admin" && (
                  <>
                    <button
                      className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3 me-lg-3"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <FaCloudUploadAlt className="me-2" /> Unggah Data
                    </button>
                    <button
                      className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-siswa"
                    >
                      <FaPlus className="me-2" /> Tambah siswa
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* {user?.role == "admin" && (
              <div className="d-flex mb-3">
                <button
                  className="btn btn-ss btn-outline-secondary  btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss w-100"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-reset-password"
                >
                  <FaUndoAlt className="me-2 fs-18-ss" />
                  Reset Password
                </button>
              </div>
            )} */}
            <Tabs navItems={navItems} />
          </div>
        </div>
      </AnimatePage>
      {user?.role == "admin" && (
        <>
          {/* <NewModal
            modalId="modal-reset-password"
            modalSize="sm"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">Ubah Password Siswa</h4>
                <span className="fs-6 fw-normal">Isi password baru Siswa</span>
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
          /> */}
          <NewModal
            title="Unggah Data Siswa"
            content={
              <>
                <div className="mb-3">
                  <h6 className="color-dark fw-semibold mb-2">
                    Download template file untuk mengimport data{" "}
                    <span className="text-lowercase">Anggota Rombel</span>
                  </h6>
                  <a
                    href="/import/template-import-anggota-kelas-password.xlsx"
                    target="_blank"
                  >
                    <div className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Template File Import Anggota Rombel
                        </span>
                      </p>
                    </div>
                  </a>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Pilih file untuk diimport
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    autoComplete="off"
                    onChange={async ({ target }) => {
                      setImportAnggotaRombel(target.files[0]);
                    }}
                  />
                </div>
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={buttonStateImportAnggotaRombel}
                onClick={handleImportAnggotaRombelData}
                color={"primary"}
                idleText={"Unggah"}
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
            modalId="modal-siswa"
            title={
              <>
                <p className="mb-0 fw-bold">
                  {editId ? "Edit" : "Tambah"} Siswa
                </p>
                <span className="fs-6">
                  Isi informasi dibawah untuk{" "}
                  {editId ? "mengubah data Siswa" : "menambah Siswa"}
                </span>
              </>
            }
            content={
              <>
                {renderFormInput(settingList)}
                {formData?.avatar && (
                  <div className="text-center">
                    <img
                      src={`${formData?.avatar}`}
                      width={200}
                      height={200}
                      className="avatar"
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
        </>
      )}
    </LayoutDetail>
  );
};

export default InfoPage;
