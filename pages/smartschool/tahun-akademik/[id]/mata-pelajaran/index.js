import { Tooltip } from "antd";
import axios from "axios";
import LayoutDetailTahunAkademik from "components/Layout/LayoutDetailTahunAkademik";
import SideNavTahunAkademik from "components/TahunAkademik/SideNavTahunAkademik";
import { motion } from "framer-motion";
import useSekolah from "hooks/useSekolah";
import { camelizeKeys } from "humps";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChevronLeft,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaPen,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { baseURL, downloadURL, ssURL } from "../../../../../client/clientAxios";
import {
  deleteMataPelajaran,
  downloadMataPelajaran,
  getMataPelajaran,
  postMataPelajaran,
  putMataPelajaran,
} from "../../../../../client/MataPelajaranClient";
import Layout from "../../../../../components/Layout/Layout";
import MyJoyride from "../../../../../components/Shared/MyJoyride/MyJoyride";
import Navbar from "../../../../../components/Shared/Navbar/Navbar";
import NewModal from "../../../../../components/Shared/NewModal/NewModal";
import UploadBanner from "../../../../../components/Shared/UploadBanner/UploadBanner";
import { buildSettingForm } from "../../../../../data/form";
import { renderFormInput } from "../../../../../utilities/HelperUtils";
import { hideModal } from "../../../../../utilities/ModalUtils";

const initialFormData = {
  nama: "",
  kode: "",
  kelompok: "A",
  mUserId: "",
  kkm: "",
  btnImport: "idle",
  file: "",
  taId: "",
};

const index = ({ id }) => {
  const { sekolah } = useSekolah();

  const [mataPelajaranData, setMataPelajaranData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [editId, setEditId] = useState({});
  const {
    mataPelajaranKelompokA,
    mataPelajaranKelompokB,
    mataPelajaranKelompokC,
    semuaTA,
    dataTA,
  } = mataPelajaranData;

  const { nav } = useRouter().query;

  const settingList = buildSettingForm(
    formData,
    setFormData,
    "Tambah Mata Pelajaran"
  );

  const [loading, setLoading] = useState(true);
  const getMataPelajaranData = async () => {
    setLoading(true);
    const { data } = await getMataPelajaran({ taId: id });
    if (data) {
      setLoading(false);
      setMataPelajaranData(data);
      setFormData({ ...initialFormData, listGuru: data.guru });
    }
  };

  const handlePostMataPelajaranData = async () => {
    const dataForm = { ...formData, taId: id };
    const { data, isSuccess, error } = await postMataPelajaran({
      ...formData,
      taId: id,
    });
    if (isSuccess) {
      toast.success(data?.message);
      setButtonState("success");
      getMataPelajaranData();
      hideModal("modal-mata-pelajaran");
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const handlePutMataPelajaranData = async () => {
    const { data, error } = await putMataPelajaran(editId, formData);
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData(initialFormData);
      getMataPelajaranData();
      hideModal("modal-mata-pelajaran");
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  const handleDeleteMataPelajaranData = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteMataPelajaran(id);
        if (data) {
          toast.success(data?.message);
          getMataPelajaranData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleClickDownloadMapel = async () => {
    const { data } = await downloadMataPelajaran({ taId: id });

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  const onClickEdit = async (data) => {
    if (data) {
      setEditId(data?.id);
      setFormData({
        ...formData,
        nama: data?.nama,
        kode: data?.kode,
        kelompok: data?.kelompok,
        mUserId: data?.mUserId,
        kkm: data?.kkm,
        guru: data?.user?.nama,
      });
    }
  };

  const _importMapel = async () => {
    setFormData({ ...formData, btnImport: "loading" });

    var fd = new FormData();
    for (var key in formData) {
      fd.append(key, formData[key]);
    }

    const { data, error } = await axios
      .post(`${baseURL}/mata-pelajaran/import/${id}`, fd)
      .then((res) => {
        let data = res?.data || null;
        data = camelizeKeys(data);

        return {
          isSuccess: true,
          error: false,
          data,
          status: res?.status,
        };
      })
      .catch((err) => {
        let error = err?.response?.data;
        error = camelizeKeys(error);

        return {
          isSuccess: false,
          data: err?.data,
          error,
          status: err?.response?.status,
        };
      });

    if (data) {
      hideModal("modalUnggahMapel");
      setFormData({ ...formData, btnImport: "success", file: "" });
      getMataPelajaranData();
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnImport: "error" });
      toast.error(error?.message);
    }
  };

  const handleSubmitImport = (e) => {
    _importMapel();
  };

  useEffect(() => {
    getMataPelajaranData();
  }, []);

  const handleChangeForm = (e, uploadedFile) => {
    if (uploadedFile) {
      setFormData({
        ...formData,
        [e.target.name]: uploadedFile,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const navItems = [
    {
      url: `${ssURL}/tahun-akademik/[id]/mata-pelajaran?nav=kelompok-a`,
      as: `${ssURL}/tahun-akademik/${id}/mata-pelajaran?nav=kelompok-a`,
      text: `${sekolah?.id == 8921 ? "Normatif" : "Kelompok A"}`,
      active: nav == "kelompok-a" || nav == undefined,
      dataJoyride: "kelompok-a",
    },
    {
      url: `${ssURL}/tahun-akademik/[id]/mata-pelajaran?nav=kelompok-b`,
      as: `${ssURL}/tahun-akademik/${id}/mata-pelajaran?nav=kelompok-b`,
      text: `${sekolah?.id == 8921 ? "Adaptif" : "Kelompok B"}`,
      active: nav == "kelompok-b",
      dataJoyride: "kelompok-b",
    },
    {
      url: `${ssURL}/tahun-akademik/[id]/mata-pelajaran?nav=kelompok-c`,
      as: `${ssURL}/tahun-akademik/${id}/mata-pelajaran?nav=kelompok-c`,
      text: `${sekolah?.id == 8921 ? "Produktif" : "Kelompok C"}`,
      active: nav == "kelompok-c",
      dataJoyride: "kelompok-c",
    },
  ];

  const steps = [
    {
      target: '[data-joyride="kelompok-a"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            {sekolah?.id == 8921 ? "Normatif" : "Kelompok A"}
          </h5>
          <p className="color-secondary fw-semibold">
            Pada menu ini berisikan semua mata pelajaran{" "}
            {sekolah?.id == 8921 ? "Normatif" : "Kelompok A"}. Tekan pada bagian
            ini untuk masuk ke menu mata pelajaran{" "}
            {sekolah?.id == 8921 ? "Normatif" : "Kelompok A"}.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="kelompok-b"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            {sekolah?.id == 8921 ? "Adaptif" : "Kelompok B"}
          </h5>
          <p className="color-secondary fw-semibold">
            Pada menu ini berisikan semua mata pelajaran{" "}
            {sekolah?.id == 8921 ? "Adaptif" : "Kelompok B"}. Tekan pada bagian
            ini untuk masuk ke menu mata pelajaran{" "}
            {sekolah?.id == 8921 ? "Adaptif" : "Kelompok B"}.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="kelompok-c"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            {sekolah?.id == 8921 ? "Produktif" : "Kelompok C"}
          </h5>
          <p className="color-secondary fw-semibold">
            Pada menu ini berisikan semua mata pelajaran{" "}
            {sekolah?.id == 8921 ? "Produktif" : "Kelompok C"}. Tekan pada
            bagian ini untuk masuk ke menu mata pelajaran{" "}
            {sekolah?.id == 8921 ? "Produktif" : "Kelompok C"}.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-tambah-mapel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Ingin Menambah Mata Pelajaran ?
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan mata pelajaran baru ke sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-mapel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Mata Pelajaran</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar mata pelajaran yang sudah ditambahkan ke
            sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-mapel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Mata Pelajaran</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai mata
            pelajaran yang sudah dibuat.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-mapel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Mata Pelajaran</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus mata pelajaran yang sudah
            dibuat.
          </p>
        </div>
      ),
    },
  ];

  return (
    <LayoutDetailTahunAkademik
      modalWrapper={
        <>
          <NewModal
            modalId="modal-mata-pelajaran"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">
                  {editId ? "Edit" : "Tambah"} Mata Pelajaran
                </h4>
                <span className="fs-6 fw-normal">
                  Isi informasi dibawah untuk{" "}
                  {editId
                    ? "mengubah data mata pelajaran"
                    : "menambah mata pelajaran"}
                </span>
              </>
            }
            content={
              <>
                <div className="mb-3">{renderFormInput(settingList)}</div>
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={buttonState}
                onClick={
                  editId
                    ? handlePutMataPelajaranData
                    : handlePostMataPelajaranData
                }
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
            modalId="modalUnggahMapel"
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
                <div className="mb-5">
                  <h5 className="fw-bold color-dark">
                    Template File Import{" "}
                    {sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"}
                  </h5>
                  <a href="/import/template-mapel.xlsx" target="_blank">
                    <div className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Template File Import{" "}
                          {sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"}
                        </span>
                      </p>
                    </div>
                  </a>
                </div>
                <div>
                  <UploadBanner
                    label="Import"
                    titleUnggahan={`File Import ${
                      sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"
                    }`}
                    id="file"
                    name="file"
                    preview={formData.file}
                    onChange={(e, uploadedFile) =>
                      handleChangeForm(e, uploadedFile)
                    }
                    isFile={true}
                    onClick={() => setFormData({ ...formData, file: "" })}
                    isImport={true}
                  />
                </div>
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={formData.btnImport}
                onClick={handleSubmitImport}
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
      dataTA={dataTA}
      semuaTA={semuaTA}
      route={"mata-pelajaran"}
    >
      <MyJoyride steps={steps} />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div
          className="row mb-4 mt-md-0 mt-4 sticky-top md-position-static"
          style={{ top: "101px" }}
        >
          <div className="col-md-12">
            <Link href={`${ssURL}/tahun-akademik-v2/`}>
              <a
                className="text-decoration-none fw-bolder position-relative color-primary pointer"
                data-joyride="button-kembali"
              >
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <SideNavTahunAkademik ssURL={ssURL} sekolah={sekolah} />
          </div>
          <div className="col-lg-9">
            <Navbar
              nav={navItems}
              action={[
                {
                  button: (
                    <button
                      type="button"
                      className="btn btn-ss btn-outline-secondary-ss border border-light-secondary-ss rounded-pill fw-bold me-lg-3 mb-lg-0 mb-3"
                      onClick={handleClickDownloadMapel}
                    >
                      <FaCloudDownloadAlt /> Unduh Data
                    </button>
                  ),
                },
                {
                  button: (
                    <button
                      type="button"
                      className="btn btn-ss btn-outline-secondary-ss border border-light-secondary-ss rounded-pill fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#modalUnggahMapel"
                      data-joyride="btn-tambah-mapel"
                    >
                      <FaCloudUploadAlt /> Unggah Data
                    </button>
                  ),
                },
              ]}
            />
            {loading ? (
              <Skeleton count={4} height={50} />
            ) : (
              <div className="card card-ss mb-4">
                <div className="card-header p-4 card-header-ss">
                  <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                    <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                      {nav == "kelompok-a" || nav == undefined
                        ? `${sekolah?.id == 8921 ? "Normatif" : "Kelompok A"}`
                        : nav == "kelompok-b"
                        ? `${sekolah?.id == 8921 ? "Adaptif" : "Kelompok B"}`
                        : `${sekolah?.id == 8921 ? "Produktif" : "Kelompok C"}`}
                    </h4>
                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-mata-pelajaran"
                      onClick={() => {
                        setEditId(null);
                      }}
                      data-joyride="btn-tambah-mapel"
                    >
                      <FaPlus /> Tambah
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive" data-joyride="table-mapel">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>
                            Mata{" "}
                            {sekolah?.tingkat == "kampus"
                              ? "Kuliah"
                              : "Pelajaran"}
                          </th>
                          <th>Kode</th>
                          <th>KKM</th>
                          <th>Pengampu</th>
                          {/* <th>Whatsapp</th> */}
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(nav == "kelompok-a" || nav == undefined
                          ? mataPelajaranKelompokA
                          : nav == "kelompok-b"
                          ? mataPelajaranKelompokB
                          : mataPelajaranKelompokC
                        )?.map((data, idx) => {
                          return (
                            <tr key={`${idx}-${new Date().getTime()}`}>
                              <td data-th="Mata Pelajaran">{data.nama}</td>
                              <td data-th="Kode">{data.kode}</td>
                              <td data-th="KKM">{data.kkm}</td>
                              <td data-th="Pengampu">
                                <Tooltip title={data?.user?.whatsapp}>
                                  {data.user?.nama}
                                </Tooltip>
                              </td>
                              {/* <td data-th="Whatsapp">{data.user?.whatsapp}</td> */}
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
                                    data-bs-target="#modal-mata-pelajaran"
                                    onClick={() => onClickEdit(data)}
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
                                      handleDeleteMataPelajaranData(data?.id)
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
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </LayoutDetailTahunAkademik>
  );
};
export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
