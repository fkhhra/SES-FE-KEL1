import Axios from "axios";
import { useEffect, useState } from "react";
import {
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaPen,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { baseURL } from "../../../../client/clientAxios";
import {
  deleteStudent,
  editStudent,
  postStudent,
} from "../../../../client/StudentClient";
import LayoutDetail from "../../../../components/Layout/LayoutDetail";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import Tabs from "../../../../components/Shared/Tabs/Tabs";
import WhatsappLink from "../../../../components/Shared/WhatsappLink/WhatsappLink";
import { buildSettingForm } from "../../../../data/form";
import useUser from "../../../../hooks/useUser";
import { renderFormInput } from "../../../../utilities/HelperUtils";
import { hideModal } from "../../../../utilities/ModalUtils";
import { useDebounce } from "use-debounce";
import Avatar from "components/Shared/Avatar/Avatar";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import ModalUnggahDataEkstrakurikuler from "components/Ekstrakurikuler/ModalUnggahData";
import ModalTambahAnggotaEkstrakurikuler from "components/Ekstrakurikuler/ModalTambahAnggotaEkstrakurikuler";
import { deleteAnggotaEskul, detailEskul } from "client/EskulClient";
import swal from "sweetalert";

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
  };

  const [importAnggotaRombel, setImportAnggotaRombel] = useState();
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [buttonState, setButtonState] = useState("idle");
  const [search, setSearch] = useState("");
  const [eskul, setEskul] = useState([]);

  const [debounceSearch] = useDebounce(search, 400);

  const settingList = buildSettingForm(formData, setFormData, "Tambah Siswa");

  const [buttonStateImportAnggotaRombel, setButtonStateImportAnggotaRombel] =
    useState("idle");

  const { user } = useUser();

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

  const handleDelete = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteAnggotaEskul(id);
        if (data) {
          toast.success(data?.message);
          _detailEskul();
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
      });
    }
  };

  const _detailEskul = async () => {
    const { data } = await detailEskul(id);
    if (data) {
      setEskul(data?.ekskul);
    }
  };

  useEffect(() => {
    _detailEskul();
  }, []);

  return (
    <LayoutDetail title={`${eskul?.nama}`}>
      <AnimatePage>
        <div className="card card-ss">
          <div className="card-body p-4">
            <div className="row justify-content-between mb-4">
              <div className="col-lg-2 d-flex align-items-center">
                <h4 className="fw-extrabold color-dark mb-lg-0 mb-4">
                  Anggota
                </h4>
              </div>
              <div className="col-lg-9 justify-content-end d-lg-flex d-none">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss py-2 px-4 me-md-3 mb-lg-0 mb-3 flex-grow-1"
                  id="exampleFormControlInput1"
                  placeholder="Cari anggota"
                  autoComplete="off"
                  //   value={search}
                  //   onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary btn-outline-secondary-ss border-light-secondary-ss fw-bold rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3 me-lg-3"
                  data-bs-toggle="modal"
                  data-bs-target="#modalUnggahDataEkstrakurikuler"
                >
                  <FaCloudUploadAlt className="me-2" /> Unggah Data
                </button>
                <button
                  className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3 fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahAnggotaEkstrakurikuler"
                >
                  <FaPlus className="me-2" /> Tambah
                </button>
              </div>
              <div className="col-lg-9 justify-content-end d-lg-none d-flex flex-lg-row flex-column justify-content-end">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss py-2 px-4 me-md-3 mb-lg-0 mb-3 w-100"
                  id="exampleFormControlInput1"
                  placeholder="Cari anggota"
                  autoComplete="off"
                  //   value={search}
                  //   onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary btn-outline-secondary-ss border-light-secondary-ss fw-bold rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3 me-lg-3"
                  data-bs-toggle="modal"
                  data-bs-target="#modalUnggahDataEkstrakurikuler"
                >
                  <FaCloudUploadAlt className="me-2" /> Unggah Data
                </button>
                <button
                  className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-lg-0 mb-3 fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahAnggotaEkstrakurikuler"
                >
                  <FaPlus className="me-2" /> Tambah
                </button>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              {eskul?.anggotaEkskul?.map((d) => {
                if (d?.user?.nama) {
                  return (
                    <li
                      className="list-group-item py-3 px-0"
                      //   key={`${idx}-${new Date().getTime()}`}
                    >
                      <div className="d-flex justify-content-between flex-sm-row flex-column">
                        <div className="d-flex align-items-center">
                          <Avatar
                            name={d?.user?.nama}
                            src={d.user?.avatar}
                            size={45}
                          />
                          <h6 className="ms-3 mb-0 fw-semibold">
                            {d?.user?.nama}
                          </h6>
                        </div>
                        <div className="d-flex justify-content-end mt-sm-0 mt-2 align-items-center">
                          <WhatsappLink
                            phoneNumber={d.user?.whatsapp}
                            text="Halo nak"
                          >
                            <div
                              className="rounded-circle shadow-success-ss hover-shadow-none me-3"
                              style={{ width: "45px", height: "45px" }}
                            >
                              <img
                                src={`/img/whatsapp.svg`}
                                width={45}
                                height={45}
                              />
                            </div>
                          </WhatsappLink>
                          {/* <button
                      className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#modal-siswa"
                      //   onClick={() => onClickEdit(d.user)}
                      data-joyride="edit-slider"
                    >
                      <FaPen className="color-secondary" />
                    </button> */}
                          <button
                            className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 mb-lg-0 mb-md-3 mb-0"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                            onClick={() => handleDelete(d.id)}
                            data-joyride="edit-slider"
                          >
                            <FaTrashAlt className="color-secondary" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </AnimatePage>
      <ModalUnggahDataEkstrakurikuler _detailEskul={_detailEskul} id={id} />
      <ModalTambahAnggotaEkstrakurikuler
        id={id}
        data={eskul?.anggotaEkskul?.map((d) => d?.user)}
        _detailEskul={_detailEskul}
      />
      <NewModal
        modalId="modal-siswa"
        title={
          <>
            <p className="mb-0 fw-bold">{editId ? "Edit" : "Tambah"} Siswa</p>
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
    </LayoutDetail>
  );
};

export default InfoPage;

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}
