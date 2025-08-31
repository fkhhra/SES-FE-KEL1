import { DatePicker } from "antd";
import { postAlumni } from "client/AlumniClient";
import Layout from "components/AlumniPage/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Editor from "components/Shared/Editor/Editor";
import MultipleInputField from "components/Shared/MultipleInputField/MultipleInputField";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import useSekolah from "hooks/useSekolah";
import moment from "moment";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import ReactiveButton from "reactive-button";
import { momentPackage } from "utilities/HelperUtils";
import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import statusData from "../data/statusalumni.json";
import { now } from "moment";
import { useRouter } from "next/router";
import { getRombel } from "client/RombelClient";
import { getProvince, getRegency } from "../client/LokasiClient";
import axios from "axios";
import jurusan31Data from "../data/jurusan31.json";
const initialFormData = {
  nama: "",
  nik: "",
  jurusan: "",
  tahunMasuk: "",
  status: "",
  gender: "L",
  tanggalLahir: "",
  whatsapp: "",
  email: "",
  alamat: "",
  provinceId: "",
  regencyId: "",
  kodepos: "",
  //PEKERJAAN
  kantor: "",
  mulaiBekerja: "",
  sektorIndustri: "",
  posisi: "",
  alamatPerusahaan: "",
  idCard: "",
  kontrak: "",
  kodeposPerusahaan: "",
  //WIRAUSAHA
  usaha: [],
  pengalaman: [],
  mulaiUsaha: "",
  bidangUsaha: "",
  posisiUsaha: "",
  alamatUsaha: "",
  kodeposUsaha: "",
  //KULIAH
  sekolahLanjutan: [],
  sertifikasiKeahlian: [],
  mulaiKuliah: "",
  fakultas: "",
  prodi: "",
  programPendidikan: "",
  kartuMahasiswa: "",
  verifikasi: 0,

  deskripsi: "smarteschool",
};

const alumni = () => {
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [listJurusan, setListJurusan] = useState([]);
  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);

  const router = useRouter();

  const status = [
    { label: "Bekerja", value: "bekerja" },
    { label: "Berwirausaha", value: "berwirausaha" },
    { label: "Mencari Kerja", value: "mencari-kerja" },
    { label: "Kuliah", value: "kuliah" },
  ];

  const _getProvince = async () => {
    const { data } = await getProvince();

    if (data) {
      setProvince(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getRegency = async (params) => {
    const { data } = await getRegency(params);

    if (data) {
      setRegency(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const getRombelData = async () => {
    const { data } = await getRombel();
    if (data) {
      setListJurusan(data?.jurusan);
    }
  };

  const handleChangeForm = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const handleChangeSelect = (e, name) => {
    if (name == "provinceId") {
      _getRegency({
        provinceId: e?.value,
      });
    }

    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const _postAlumni = async () => {
    setButtonState("loading");
    const payload = {
      ...formData,
      tanggalLahir: momentPackage(formData?.tanggalLahir).format("YYYY-MM-DD"),
      tahunMasuk: momentPackage(formData?.tahunMasuk).format("YYYY"),
      mulaiBekerja:
        formData?.mulaiBekerja != ""
          ? momentPackage(formData?.mulaiBekerja).format("YYYY-MM-DD")
          : momentPackage().format("YYYY-MM-DD"),
      mulaiUsaha:
        formData?.mulaiUsaha != ""
          ? momentPackage(formData?.mulaiUsaha).format("YYYY-MM-DD")
          : momentPackage().format("YYYY-MM-DD"),
      mulaiKuliah:
        formData?.mulaiKuliah != ""
          ? momentPackage(formData?.mulaiKuliah).format("YYYY-MM-DD")
          : momentPackage().format("YYYY-MM-DD"),
    };

    const { data, error } = await postAlumni(payload);
    if (data) {
      toast.success(data.message);
      setButtonState("success");
      router.reload();
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  const { sekolah } = useSekolah();

  useEffect(() => {
    getRombelData();
  }, []);

  useEffect(() => {
    _getProvince();
    formData.provinceId && _getRegency({ provinceId: formData.provinceId });
  }, []);

  return (
    <Layout isFrontPage={true}>
      <AnimatePage>
        <section
          id="beranda"
          className="position-relative"
          style={{ paddingTop: "82px" }}
        >
          <div className="container py-5">
            <div className="row justify-content-center text-center text-white">
              <div className="col-md-12 mb-4">
                <h1 className="fw-black mb-2">Penelusuran Tamatan Online</h1>
                <h1 className="fw-black mb-0">{sekolah?.nama}</h1>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <p className="fs-5 mb-5">
                    Halo sobat alumni! Mari bersama bersinergi membangun sekolah
                    yang kita cintai ini melalui pengisian form pendaftaran di
                    bawah ini!
                  </p>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-4 d-flex flex-column">
                  <a
                    href="#daftarSekarang"
                    className="btn btn-ss btn-light rounded-pill fw-extrabold color-primary fs-4"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <img
                    src="/img/ppdb-landing-page-illustration.png"
                    alt=""
                    className="img-fluid mt-5"
                    width="572px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <br id="daftarSekarang" />
        <section style={{ marginTop: "-75px" }}>
          <div className="container">
            <div className="card card-ss p-4 mb-4">
              <h3 className="fw-black color-dark mb-5 mx-auto">
                Pendaftaran Tamatan Alumni
              </h3>
              <div className="row">
                <h4 className="fw-extrabold color-dark title-border mb-3">
                  Identitas Diri
                </h4>
                <div className="mb-4 col-md-6">
                  <label className="form-label">Nama</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Tuliskan nama Anda"
                    type="text"
                    name="nama"
                    value={formData?.nama}
                    onChange={handleChangeForm}
                  />
                </div>
                <div className="mb-4 col-md-6">
                  <label className="form-label">NIK</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Tuliskan NIK Anda"
                    type="number"
                    name="nik"
                    value={formData?.nik}
                    onChange={handleChangeForm}
                  />
                </div>
                {sekolah?.id == 49 ? (
                  <div className="mb-4 col-md-6">
                    <label className="form-label">kompetensi Keahlian</label>
                    <SelectShared
                      name="kepemilikan"
                      placeholder="Pilih Kompotensi Keahlian"
                      options={jurusan31Data?.map((d) => {
                        return {
                          label: `${d?.label}`,
                          value: d?.value,
                        };
                      })}
                      handleChangeSelect={(e, name) => {
                        setFormData({
                          ...formData,
                          jurusan: e?.value,
                        });
                      }}
                      value={formData?.jurusan || ""}
                    />
                  </div>
                ) : (
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Kompetensi Keahlian</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan kompetensi keahlian"
                      type="text"
                      name="jurusan"
                      value={formData?.jurusan}
                      onChange={handleChangeForm}
                    />
                  </div>
                )}
                <div className="mb-4 col-md-6">
                  <label className="form-label">Tahun Lulus</label>
                  <DatePicker
                    picker="year"
                    className="form-control"
                    autoComplete="off"
                    value={
                      formData?.tahunMasuk
                        ? momentPackage(formData?.tahunMasuk)
                        : ""
                    }
                    onChange={(date, dateString) =>
                      handleChangeForm({
                        target: {
                          name: "tahunMasuk",
                          value: dateString,
                        },
                      })
                    }
                    placeholder="Pilih Tahun"
                  />
                </div>
                <div className="mb-4 col-md-6">
                  <label className="form-label">Status</label>
                  <SelectShared
                    name="kepemilikan"
                    placeholder="Pilih Status"
                    options={statusData?.map((d) => {
                      return {
                        label: `${d?.label}`,
                        value: d?.value,
                      };
                    })}
                    handleChangeSelect={(e, name) => {
                      setFormData({
                        ...formData,
                        status: e?.value,
                      });
                    }}
                    // {changeRombel}
                    value={formData?.status || ""}
                  />
                </div>
                <div className="mb-4 col-md-6"></div>
                <div className="mb-4 col-md-6">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    className="form-select"
                    id="inputGroupSelect01"
                    name="gender"
                    onChange={handleChangeForm}
                    value={formData?.gender}
                  >
                    <option hidden>Pilih Jenis Kelamin</option>
                    <option value="L">Laki - Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="mb-4 col-md-6">
                  <label className="form-label">Tanggal Lahir</label>
                  <DatePicker
                    className="form-control"
                    autoComplete="off"
                    value={
                      formData?.tanggalLahir
                        ? momentPackage(formData?.tanggalLahir)
                        : ""
                    }
                    onChange={(date, dateString) =>
                      handleChangeForm({
                        target: {
                          name: "tanggalLahir",
                          value: dateString,
                        },
                      })
                    }
                    placeholder="Pilih tanggal"
                  />
                </div>
                <div className="mb-4 col-md-6">
                  <label className="form-label">Nomor WhatsApp</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Tuliskan Nomor WhatsApp"
                    type="number"
                    name="whatsapp"
                    value={formData?.whatsapp}
                    onChange={handleChangeForm}
                  />
                </div>
                <div className="mb-4 col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Tuliskan alamat email"
                    type="text"
                    value={formData?.email}
                    name="email"
                    onChange={handleChangeForm}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Alamat</label>
                </div>
                <div className="col-md-6 mb-4">
                  <TextareaAutosize
                    className="form-control"
                    placeholder="Alamat Lengkap"
                    autoComplete="off"
                    name="alamat"
                    style={{
                      resize: "none",
                      width: "100%",
                      height: "100%",
                    }}
                    minRows={4}
                    value={formData?.alamat}
                    onChange={handleChangeForm}
                  />
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <SelectShared
                          name="provinceId"
                          handleChangeSelect={handleChangeSelect}
                          value={formData?.provinceId}
                          options={province}
                          placeholder="Pilih Provinsi"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <SelectShared
                          name="regencyId"
                          handleChangeSelect={handleChangeSelect}
                          value={formData?.regencyId}
                          options={regency}
                          isDisabled={!regency.length}
                          placeholder="Pilih Kota / Kabupaten"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-4">
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Kode pos"
                          type="text"
                          name="kodepos"
                          onChange={handleChangeForm}
                          value={formData?.kodepos}
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {formData?.status == "mencari-kerja" && (
                  <div className="card-footer-ss pb-4">
                    <div className="d-flex justify-content-end align-items-sm-center flex-sm-row flex-column pb-3">
                      <ReactiveButton
                        buttonState={buttonState}
                        onClick={_postAlumni}
                        color={"primary"}
                        idleText={`Daftar`}
                        loadingText={"Diproses"}
                        successText={"Berhasil"}
                        errorText={"Gagal"}
                        type={"button"}
                        className={
                          "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {formData?.status == "bekerja" && (
              <div className="card card-ss p-4 mb-4">
                <div className="row">
                  <h4 className="fw-extrabold color-dark title-border mb-3">
                    Pekerjaan
                  </h4>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Nama Perusahaan</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan nama perusahaan"
                      type="text"
                      name="kantor"
                      value={formData?.kantor}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Mulai Bekerja</label>
                    <DatePicker
                      className="form-control"
                      autoComplete="off"
                      value={
                        formData?.mulaiBekerja
                          ? momentPackage(formData?.mulaiBekerja)
                          : ""
                      }
                      onChange={(date, dateString) =>
                        handleChangeForm({
                          target: {
                            name: "mulaiBekerja",
                            value: dateString,
                          },
                        })
                      }
                      placeholder="Pilih tanggal"
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Bidang Perusahaan</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan bidang perusahaan"
                      type="text"
                      name="sektorIndustri"
                      value={formData?.sektorIndustri}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Posisi</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan posisi pekerjaan"
                      type="text"
                      name="posisi"
                      value={formData?.posisi}
                      onChange={handleChangeForm}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Alamat</label>
                  </div>
                  <div className="col-md-12 mb-4">
                    <TextareaAutosize
                      className="form-control"
                      placeholder="Alamat Lengkap"
                      autoComplete="off"
                      name="alamatPerusahaan"
                      style={{
                        resize: "none",
                        width: "100%",
                        height: "100%",
                      }}
                      minRows={4}
                      value={formData?.alamatPerusahaan}
                      onChange={handleChangeForm}
                    />
                  </div>
                  {/* <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <SelectShared
                            name="propinsi"
                            placeholder="Pilih Provinsi"
                            // handleChangeSelect={handleChangeSelect}
                            // value={formData?.propinsi || ""}
                            // options={propinsi}
                            isDisabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-4">
                          <SelectShared
                            name="kabupaten"
                            placeholder="Pilih Kota / Kabupaten"
                            // handleChangeSelect={handleChangeSelect}
                            // value={formData?.kabupaten || ""}
                            // options={kabupaten}
                            // isDisabled={!formData?.propinsi}
                            isDisabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-4">
                          <input
                            className="form-control"
                            autoComplete="off"
                            placeholder="Kode pos"
                            type="number"
                            name="kodeposPerusahaan"
                            onChange={handleChangeForm}
                            value={formData?.kodeposPerusahaan}
                            maxLength={5}
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Surat Kontrak</label>
                    <UploadFileComplete
                      id="fileKontrak"
                      onChange={(e, fileUrl) => {
                        handleChangeForm({
                          target: {
                            name: "kontrak",
                            value: fileUrl,
                          },
                        });
                      }}
                      file={formData?.kontrak}
                      deleteFile={() => {
                        handleChangeForm({
                          target: {
                            name: "kontrak",
                            value: "",
                          },
                        });
                      }}
                      name="Surat Kontrak"
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Id Card</label>
                    <UploadFileComplete
                      id="fileIdCard"
                      onChange={(e, fileUrl) => {
                        handleChangeForm({
                          target: {
                            name: "idCard",
                            value: fileUrl,
                          },
                        });
                      }}
                      file={formData?.idCard}
                      deleteFile={() => {
                        handleChangeForm({
                          target: {
                            name: "idCard",
                            value: "",
                          },
                        });
                      }}
                      name="Id Card"
                    />
                  </div>
                  <div className="card-footer-ss pb-4">
                    <div className="d-flex justify-content-end align-items-sm-center flex-sm-row flex-column pb-3">
                      <ReactiveButton
                        buttonState={buttonState}
                        onClick={_postAlumni}
                        color={"primary"}
                        idleText={`Daftar`}
                        loadingText={"Diproses"}
                        successText={"Berhasil"}
                        errorText={"Gagal"}
                        type={"button"}
                        className={
                          "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData?.status == "berwirausaha" && (
              <div className="card card-ss p-4 mb-4">
                <div className="row">
                  <h4 className="fw-extrabold color-dark title-border mb-3">
                    Wirausaha
                  </h4>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Nama Perusahaan</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan nama perusahaan"
                      type="text"
                      name="usaha"
                      value={formData?.usaha}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Mulai Berwirausaha</label>
                    <DatePicker
                      className="form-control"
                      autoComplete="off"
                      value={
                        formData?.mulaiUsaha
                          ? momentPackage(formData?.mulaiUsaha)
                          : ""
                      }
                      onChange={(date, dateString) =>
                        handleChangeForm({
                          target: {
                            name: "mulaiUsaha",
                            value: dateString,
                          },
                        })
                      }
                      placeholder="Pilih tanggal"
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Bidang Perusahaan</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan bidang perusahaan"
                      type="text"
                      name="bidangUsaha"
                      value={formData?.bidangUsaha}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Posisi</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan posisi pekerjaan"
                      type="text"
                      name="posisiUsaha"
                      value={formData?.posisiUsaha}
                      onChange={handleChangeForm}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Alamat</label>
                  </div>
                  <div className="col-md-12 mb-4">
                    <TextareaAutosize
                      className="form-control"
                      placeholder="Alamat Lengkap"
                      autoComplete="off"
                      name="alamatUsaha"
                      style={{
                        resize: "none",
                        width: "100%",
                        height: "100%",
                      }}
                      minRows={4}
                      value={formData?.alamatUsaha}
                      onChange={handleChangeForm}
                    />
                  </div>
                  {/* <div className="col-md-6"> */}
                  {/* <div className="row"> */}
                  {/* <div className="col-md-6">
                        <div className="mb-4">
                          <SelectShared
                            name="propinsi"
                            placeholder="Pilih Provinsi"
                            // handleChangeSelect={handleChangeSelect}
                            // value={formData?.propinsi || ""}
                            // options={propinsi}
                            isDisabled={true}
                          />
                        </div>
                      </div> */}
                  {/* <div className="col-md-6">
                        <div className="mb-4">
                          <SelectShared
                            name="kabupaten"
                            placeholder="Pilih Kota / Kabupaten"
                            // handleChangeSelect={handleChangeSelect}
                            // value={formData?.kabupaten || ""}
                            // options={kabupaten}
                            // isDisabled={!formData?.propinsi}
                            isDisabled={true}
                          />
                        </div>
                      </div> */}
                  {/* <div className="col-md-3">
                        <div className="mb-4">
                          <input
                            className="form-control"
                            autoComplete="off"
                            placeholder="Kode pos"
                            type="number"
                            name="kodeposUsaha"
                            onChange={handleChangeForm}
                            value={formData?.kodeposUsaha}
                            maxLength={5}
                          />
                        </div>
                      </div> */}
                  {/* </div> */}
                  {/* </div> */}
                  <div className="card-footer-ss pb-4">
                    <div className="d-flex justify-content-end align-items-sm-center flex-sm-row flex-column pb-3">
                      <ReactiveButton
                        buttonState={buttonState}
                        onClick={_postAlumni}
                        color={"primary"}
                        idleText={`Daftar`}
                        loadingText={"Diproses"}
                        successText={"Berhasil"}
                        errorText={"Gagal"}
                        type={"button"}
                        className={
                          "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData?.status == "kuliah" && (
              <div className="card card-ss p-4 mb-4">
                <div className="row">
                  <h4 className="fw-extrabold color-dark title-border mb-3">
                    Kuliah
                  </h4>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Nama Perguruan Tinggi</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan nama perguruan tinggi"
                      type="text"
                      name="sekolahLanjutan"
                      value={formData?.sekolahLanjutan}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Mulai Berkuliah</label>
                    <DatePicker
                      className="form-control"
                      autoComplete="off"
                      value={
                        formData?.mulaiKuliah
                          ? momentPackage(formData?.mulaiKuliah)
                          : ""
                      }
                      onChange={(date, dateString) =>
                        handleChangeForm({
                          target: {
                            name: "mulaiKuliah",
                            value: dateString,
                          },
                        })
                      }
                      placeholder="Pilih tanggal"
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Fakultas</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan nama fakultas"
                      type="text"
                      name="fakultas"
                      value={formData?.fakultas}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Program Studi</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan nama program studi"
                      type="text"
                      name="prodi"
                      value={formData?.prodi}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label className="form-label">Program Pendidikan</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Pilih program pendidikan"
                      type="text"
                      name="programPendidikan"
                      value={formData?.programPendidikan}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4 col-md-12">
                    <label className="form-label">Kartu Tanda Mahasiswa</label>
                    <UploadFileComplete
                      id="file"
                      onChange={(e, fileUrl) => {
                        handleChangeForm({
                          target: {
                            name: "kartuMahasiswa",
                            value: fileUrl,
                          },
                        });
                      }}
                      file={formData?.kartuMahasiswa}
                      deleteFile={() => {
                        handleChangeForm({
                          target: {
                            name: "kkartuMahasiswatm",
                            value: "",
                          },
                        });
                      }}
                      name="Kartu Tanda Mahasiswa"
                    />
                  </div>
                  <div className="card-footer-ss pb-4">
                    <div className="d-flex justify-content-end align-items-sm-center flex-sm-row flex-column pb-3">
                      <ReactiveButton
                        buttonState={buttonState}
                        onClick={_postAlumni}
                        color={"primary"}
                        idleText={`Daftar`}
                        loadingText={"Diproses"}
                        successText={"Berhasil"}
                        errorText={"Gagal"}
                        type={"button"}
                        className={
                          "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </AnimatePage>
    </Layout>
  );
};

export default alumni;
