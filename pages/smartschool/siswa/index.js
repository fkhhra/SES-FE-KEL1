import { Pagination } from "antd";
import HeaderDataSekolah from "components/DataSekolah/HeaderDataSekolah";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import Navbar from "components/Shared/Navbar/Navbar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { motion } from "framer-motion";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaFilter, FaPen, FaTrashAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { ssURL } from "../../../client/clientAxios";
import {
  deleteStudent,
  editStudent,
  getStudent,
  postStudent,
} from "../../../client/StudentClient";
import AnalisisJumlahPesertaDidik from "../../../components/Analisis/AnalisisJumlahPesertaDidik";
import AnalisisJumlahPesertaDidikPerJurusan from "../../../components/Analisis/AnalisisJumlahPesertaDidikPerJurusan";
import Layout from "../../../components/Layout/Layout";
import Avatar from "../../../components/Shared/Avatar/Avatar";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import { buildSettingForm } from "../../../data/form";
import useBagian from "../../../hooks/useBagian";
import useSekolah from "../../../hooks/useSekolah";
import { whatsappLink } from "../../../utilities/app-helper";
import { renderFormInput } from "../../../utilities/HelperUtils";
import { hideModal } from "../../../utilities/ModalUtils";

const index = () => {
  const initialFormData = {
    nama: "",
    id: 0,
    gender: "L",
    whatsapp: "",
    password: "",
    avatar: "",
    btnFace: "idle",
    photos: {},
    tingkatData: "",
    jurusanId: "",
    rombelId: "",
    taId: "",
  };

  const router = useRouter();
  const { user } = useUser();

  const { page = 1 } = router.query;

  const { sekolah } = useSekolah();
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setcollapseOpen] = useState(false);

  const [siswaData, setSiswaData] = useState({
    siswa: [],
  });
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [buttonState, setButtonState] = useState("idle");
  const { siswa, integrasi, jumlahLaki, jumlahPerempuan, jurusanData, total, perPage } =
    siswaData;
  const [tingkat, setTingkat] = useState([]);
  const [jurusan, setJurusan] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [ta, setTa] = useState([]);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 600);

  const settingList = buildSettingForm(formData, setFormData, "Tambah Siswa");

  const firstRender = useRef(true);

  const getStudentData = async () => {
    setLoading(true);

    const params = {
      search: debounceSearch,
      page: page,
      tingkat: formData?.tingkatData,
      jurusan_id: formData?.jurusanId,
      rombel_id: formData?.rombelId,
      ta_id: formData?.taId,
    };

    !debounceSearch && delete params.search;
    !formData?.tingkatData && delete params.tingkat;
    !formData?.jurusanId && delete params.jurusan_id;
    !formData?.rombelId && delete params.rombel_id;
    !formData?.taId && delete params.ta_id;

    const { data } = await getStudent(params);
    if (data) {
      setSiswaData({
        ...data,
        siswa: data?.siswa?.data,
        total: data?.siswa?.total,
        perPage: data?.siswa?.perPage
      });
      setTingkat(data?.tingkatData);
      setJurusan(data?.jurusan);
      setRombel(data?.rombel);
      setTa(data?.ta);
    }
    setLoading(false);
  };

  const onChangeSearch = (value) => {
    setSearch(value);
  };

  const handlePostStudent = async () => {
    setFormData({ ...formData, btnFace: "loading" });

    const { data, error } = await postStudent(formData);
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData({ ...initialFormData, btnFace: "success" });
      setFormData(initialFormData);
      getStudentData();
      hideModal("modal-siswa");
    } else {
      setFormData({ ...initialFormData, btnFace: "error" });

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
      getStudentData();
      hideModal("modal-siswa");
      setFormData({ ...formData, btnFace: "success" });
    } else {
      setFormData({ ...formData, btnFace: "error" });

      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
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
        const { data, error } = await deleteStudent(id);
        if (data) {
          toast.success(data?.message);
          getStudentData();
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

  const handleModalSubmit = (e) => {
    if (!editId) {
      handlePostStudent();
    } else {
      handleEdit();
    }
  };

  const handleChangeFaceRecog = (e, fileUrl) => {
    if (fileUrl == "") {
      delete formData.photos[e.target.name];
      setFormData({
        ...formData,
        photos: { ...formData.photos },
      });
    } else {
      setFormData({
        ...formData,
        photos: { ...formData.photos, [e.target.name]: fileUrl },
      });
    }
  };

  useEffect(() => {
    document
      .getElementById("exampleFormControlInput1")
      .removeAttribute("autocomplete");
  });

  useEffect(() => {
    getStudentData();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      getStudentData();
    }
  }, [
    debounceSearch,
    page,
    formData?.tingkatData,
    formData?.jurusanId,
    formData?.rombelId,
    formData?.taId,
  ]);

  const { bagian } = useBagian();

  const listDropdownValue = [
    {
      label: "Tingkat X",
      value: "X",
    },
    {
      label: "Tingkat XI",
      value: "XI",
    },
    {
      label: "Tingkat XII",
      value: "XII",
    },
    {
      label: "Tingkat XIII",
      value: "XIII",
    },
  ];

  const steps = [
    {
      target: '[data-joyride="jumlah-peserta-didik"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Jumlah Peserta Didik</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan grafik dari jumlah perbandingan peserta didik laki
            laki dan perempuan yang ada di sekolah.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="jumlah-peserta-didik-per-angkatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Jumlah Peserta Didik per Angkatan
          </h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan grafik dari jumlah perbandingan peserta didik per
            angkatan dari sertiap jurusan yang ada di sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="cari-siswa"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Ingin Mencari Data{" "}
            {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"} ?
          </h5>
          <p className="color-secondary fw-semibold">
            Masukan nama {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}{" "}
            ke dalam kolom pencarian untuk mencari data{" "}
            {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-siswa"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Daftar {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
          </h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar informasi{" "}
            {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"} yang ada di
            sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-siswa"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Edit Informasi{" "}
            {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai data{" "}
            {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
            yang ada.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-siswa"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Hapus Informasi{" "}
            {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus data{" "}
            {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"} yang ada.
          </p>
        </div>
      ),
    },
  ];

  const navItems = [
    {
      url: `${ssURL}/siswa`,
      as: `${ssURL}/siswa`,
      text: "Data",
      active: true,
    },
    {
      url: `${ssURL}/kehadiran-siswa-v2`,
      as: `${ssURL}/kehadiran-siswa-v2`,
      text: "Kehadiran",
      active: false,
    },
  ];

  const defaultValue = formData?.taId ? ta?.find((d) => d?.id == parseInt(formData?.taId)) : ta?.find((d) => d?.aktif);

  return (
    <Layout
      modalWrapper={
        <>
          {/* <NewModal
            modalId="modalFaceRecog"
            modalSize="lg"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">Tambah Rekam Wajah</h4>
              </>
            }
            content={
              <>
                <div className="mb-4" data-joyride="foto-tentang-sekolah">
                  <h5 className="color-dark fs-18-ss fw-bold mb-4">
                    Unggah foto dan sesuaikan pose seperti contoh dibawah
                  </h5>
                  <div className="mb-4">
                    <span className="jadwal-ujian-label label-ss border border-2 border-primary-ss color-primary rounded-pill fs-12-ss fw-bold">
                      Sisi Depan
                    </span>
                  </div>
                  <div id="foto-depan" className="mb-4">
                    <div className="row">
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoDepan1"
                          imgSource={
                            formData.photos?.fotoDepan1
                              ? formData.photos?.fotoDepan1
                              : `/img/front-face-1.jpeg`
                          }
                          footer="Depan Natural"
                          hasPhoto={formData.photos?.fotoDepan1 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoDepan2"
                          imgSource={
                            formData.photos?.fotoDepan2
                              ? formData.photos?.fotoDepan2
                              : `/img/front-face-3.jpeg`
                          }
                          footer="Depan Atas"
                          hasPhoto={formData.photos?.fotoDepan2 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoDepan3"
                          imgSource={
                            formData.photos?.fotoDepan3
                              ? formData.photos?.fotoDepan3
                              : `/img/front-face-2.jpeg`
                          }
                          footer="Depan Bawah"
                          hasPhoto={formData.photos?.fotoDepan3 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="jadwal-ujian-label label-ss border border-2 border-primary-ss color-primary rounded-pill fs-12-ss fw-bold">
                      Sisi Kiri
                    </span>
                  </div>
                  <div id="foto-kiri" className="mb-4">
                    <div className="row">
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoKiri1"
                          imgSource={
                            formData.photos?.fotoKiri1
                              ? formData.photos?.fotoKiri1
                              : `/img/left-face-3.jpeg`
                          }
                          footer="Kiri Natural"
                          hasPhoto={formData.photos?.fotoKiri1 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoKiri2"
                          imgSource={
                            formData.photos?.fotoKiri2
                              ? formData.photos?.fotoKiri2
                              : `/img/left-face-2.jpeg`
                          }
                          footer="Kiri Atas"
                          hasPhoto={formData.photos?.fotoKiri2 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoKiri3"
                          imgSource={
                            formData.photos?.fotoKiri3
                              ? formData.photos?.fotoKiri3
                              : `/img/left-face-3.jpeg`
                          }
                          footer="Kiri Bawah"
                          hasPhoto={formData.photos?.fotoKiri3 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="jadwal-ujian-label label-ss border border-2 border-primary-ss color-primary rounded-pill fs-12-ss fw-bold">
                      Sisi Kanan
                    </span>
                  </div>
                  <div id="foto-kanan" className="mb-4">
                    <div className="row">
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoKanan1"
                          imgSource={
                            formData.photos?.fotoKanan1
                              ? formData.photos?.fotoKanan1
                              : `/img/right-face-1.jpeg`
                          }
                          footer="Kanan Natural"
                          hasPhoto={formData.photos?.fotoKanan1 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoKanan2"
                          imgSource={
                            formData.photos?.fotoKanan2
                              ? formData.photos?.fotoKanan2
                              : `/img/right-face-2.jpeg`
                          }
                          footer="Kanan Atas"
                          hasPhoto={formData.photos?.fotoKanan2 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                      <div className="col-lg-3 col-sm-6 text-center mb-lg-0 mb-4">
                        <UploadFaceRecog
                          onChange={handleChangeFaceRecog}
                          labelFor="fotoKanan3"
                          imgSource={
                            formData.photos?.fotoKanan3
                              ? formData.photos?.fotoKanan3
                              : `/img/right-face-3.jpeg`
                          }
                          footer="Kanan Bawah"
                          hasPhoto={formData.photos?.fotoKanan3 ? true : false}
                          userId={formData.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={formData.btnFace}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
                onClick={handleModalSubmit}
              />
            }
          /> */}
          <NewModal
            modalId="modal-siswa"
            title={
              <>
                <p className="mb-0 fw-bold">
                  {editId ? "Edit" : "Tambah"}{" "}
                  {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                </p>
                <span className="fs-6">
                  Isi informasi dibawah untuk{" "}
                  {editId
                    ? `mengubah data ${
                        sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"
                      }`
                    : `menambah ${
                        sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"
                      }`}
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
      }
    >
      <MyJoyride steps={steps} />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          {user?.role == "pengawas" && (
            <>
              <HeaderDataSekolah ssURL={ssURL} />
            </>
          )}
          {/* {user?.role != "pengawas" && (
            <div className="col-lg-12">
              <Navbar nav={navItems} />
            </div>
          )} */}
          <div className="row gy-4">
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-body pb-3">
                  <div className="row">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h4 className="fw-extrabold color-dark mb-4">
                        Jumlah{" "}
                        {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                      </h4>
                      <Dropdown
                        listValue={ta?.map((d) => {
                          return {
                            value: d?.id,
                            label: `${d?.tahun} - ${d?.semester} ${
                              d?.aktif ? `( Aktif )` : ""
                            }`,
                          };
                        })}
                        defaultValue={`${defaultValue?.tahun} - ${defaultValue?.semester} ${defaultValue?.aktif ? `( Aktif )` : ""}`}
                        onChange={(e, name) =>
                          setFormData({
                            ...formData,
                            taId: e?.value,
                          })
                        }
                        isDropdownMutasi
                      />
                    </div>
                    <div
                      className="col-md-6 mb-md-0 mb-4"
                      data-joyride="jumlah-peserta-didik"
                    >
                      <div className="d-md-block d-none">
                        <AnalisisJumlahPesertaDidik
                          jumlahLaki={jumlahLaki}
                          jumlahPerempuan={jumlahPerempuan}
                        />
                      </div>
                      <div className="d-md-none d-block">
                        <AnalisisJumlahPesertaDidik
                          jumlahLaki={jumlahLaki}
                          jumlahPerempuan={jumlahPerempuan}
                          isLegendBottom
                        />
                      </div>
                    </div>
                    <div
                      className="col-md-6"
                      data-joyride="jumlah-peserta-didik-per-angkatan"
                    >
                      <div className="d-md-block d-none">
                        <AnalisisJumlahPesertaDidikPerJurusan
                          jurusanData={jurusanData}
                        />
                      </div>
                      <div className="d-md-none d-block">
                        <AnalisisJumlahPesertaDidikPerJurusan
                          jurusanData={jurusanData}
                          isLegendBottom
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="hr-ss my-3" />
                  <div className="d-flex">
                    <img
                      src="/img/icon-user.svg"
                      alt="icon-user"
                      className="me-2"
                    />
                    <p className="mb-0 color-dark fw-semibold">
                      Jumlah Total:{" "}
                      <span className="fw-extrabold">
                        {total}{" "}
                        {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header p-4 card-header-ss">
                  <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                    <h4 className="fw-extrabold color-dark mb-md-0 mb-3">
                      Daftar{" "}
                      {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                    </h4>
                    <div className="d-flex align-items-md-center flex-md-row flex-column">
                      <input
                        type="text"
                        className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-md-3 mb-md-0 mb-3 md-w-100"
                        id="exampleFormControlInput1"
                        style={{ height: "42px" }}
                        placeholder={`Cari ${
                          sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"
                        }`}
                        autoComplete="off"
                        // value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        data-joyride="cari-siswa"
                      />
                      <button
                        className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white fw-bold mb-md-0 mb-3 color-secondary ${
                          collapseOpen && "active"
                        }`}
                        data-bs-toggle="collapse"
                        href="#collapseExample"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                        onClick={() => setcollapseOpen(!collapseOpen)}
                        data-joyride="filter-perpus-collapse"
                      >
                        <FaFilter className="me-3 fs-14-ss color-secondary" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseExample">
                    <hr className="hr-ss my-4" />
                    <div className="row">
                      <div className="col-md-4">
                        <div className="select-akun-keuangan">
                          <SelectShared
                            handleChangeSelect={(e, name) =>
                              setFormData({
                                ...formData,
                                tingkatData: e?.value,
                              })
                            }
                            value={formData?.tingkatData}
                            options={tingkat?.map((d) => {
                              return { label: d, value: d };
                            })}
                            isClearable
                            isDropdownMutasi
                            placeholder="Pilih tingkat"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="select-akun-keuangan">
                          <SelectShared
                            handleChangeSelect={(e, name) =>
                              setFormData({
                                ...formData,
                                jurusanId: e?.value,
                              })
                            }
                            value={formData?.jurusanId}
                            options={jurusan?.map((d) => {
                              return { label: `${d?.nama}`, value: d?.id };
                            })}
                            isClearable
                            isDropdownMutasi
                            placeholder="Pilih jurusan"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="select-akun-keuangan">
                          <SelectShared
                            handleChangeSelect={(e, name) =>
                              setFormData({
                                ...formData,
                                rombelId: e?.value,
                              })
                            }
                            value={formData?.rombelId}
                            options={rombel?.map((d) => {
                              return { label: `${d?.nama}`, value: d?.id };
                            })}
                            isClearable
                            isDropdownMutasi
                            placeholder="Pilih kelas"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    {loading && <Skeleton count={3} height={50} />}
                    {!loading && (
                      <table className="table-ss" data-joyride="table-siswa">
                        <thead>
                          <tr>
                            <th>Nomor</th>
                            <th>Nama</th>
                            <th>Kelas</th>
                            <th>Foto</th>
                            <th className="text-capitalize">{integrasi}</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {siswa?.map((data, idx) => (
                            <tr key={`${idx}-${new Date().getTime()}`}>
                              <td data-th="Nomor">{idx + 1}</td>
                              <td data-th="Nama">{data?.nama}</td>
                              <td data-th="Kelas">
                                {data?.anggotaRombel?.rombel?.nama || "-"}
                              </td>

                              <td data-th="Foto">
                                <Avatar
                                  src={`${data?.avatar}`}
                                  size={45}
                                  name={data?.nama}
                                />
                              </td>
                              <td
                                data-th={integrasi}
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
                                      style={{
                                        width: "45px",
                                        height: "45px",
                                      }}
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
                              <td data-th="Aksi" className="actions">
                                <div className="d-flex flex-lg-row flex-md-column flex-row">
                                  {/* <button
                                    type="button"
                                    className="btn btn-lnk rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalFaceRecog"
                                    onClick={() => onClickEdit(data)}
                                    data-joyride="muka-siswa"
                                  >
                                    <FaCamera className="color-secondary"></FaCamera>
                                  </button> */}
                                  <button
                                    type="button"
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-siswa"
                                    onClick={() => onClickEdit(data)}
                                    data-joyride="edit-siswa"
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => handleDelete(data?.id)}
                                    data-joyride="delete-siswa"
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
                  </div>
                  <div className="my-4 text-center">
                    <Pagination
                      total={total}
                      showSizeChanger={false}
                      current={parseInt(page) || 1}
                      pageSize={parseInt(perPage)}
                      onChange={(e) => router.push(`${ssURL}/siswa?page=${e}`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </motion.div>
    </Layout>
  );
};

export default index;
