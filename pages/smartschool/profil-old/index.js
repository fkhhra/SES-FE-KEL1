import { useEffect, useState } from "react";
import {
  getProfil,
  editProfil,
  changePassword,
} from "../../../client/sharedClient";
import LayoutDetail from "../../../components/Layout/LayoutDetail";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { baseURL } from "../../../client/clientAxios";
import toast from "react-hot-toast";
import UploadProfilePicture from "../../../components/Shared/UploadProfilePicture/UploadProfilePicture";
import { DatePicker } from "antd";
import moment from "moment";
import useSekolah from "../../../hooks/useSekolah";
import { hideModal } from "../../../utilities/ModalUtils";
import ReactiveButton from "reactive-button";

const index = () => {
  const [userData, setUserData] = useState({});
  const { user, mataPelajaran, rombel } = userData;
  const { sekolah } = useSekolah();
  const initialStateFormPassword = {
    konfirmasiPassword: "",
    passwordBaru: "",
    passwordLama: "",
    lihatPasswordLama: false,
    lihatPasswordBaru: false,
    lihatKonfirmasiPassword: false,
  };
  const [stateFormUbahPassword, setStateFormUbahPassword] = useState(
    initialStateFormPassword
  );
  const [stateFormProfil, setStateFormProfil] = useState({
    nama: user?.nama,
    whatsapp: user?.whatsapp,
    email: user?.email,
    nip: user?.nip,
    nrk: user?.nrk,
    nuptk: user?.nuptk,
    pangkat: user?.pangkat,
    golongan: user?.golongan,
    gender: user?.gender,
    namaSekolah: user?.sekolah?.nama,
    tanggalLahir: user?.tanggalLahir ? moment(user?.tanggalLahir) : "",
    namaAyah: user?.namaAyah,
    waAyah: user?.waAyah,
    namaIbu: user?.namaIbu,
    waIbu: user?.waIbu,
  });

  const getProfilData = async () => {
    const { data } = await getProfil();
    if (data) {
      setUserData(data);
      setStateFormProfil({
        nama: data.user?.nama,
        whatsapp: data.user?.whatsapp,
        email: data.user?.email,
        nip: data.user?.nip,
        nrk: data.user?.nrk,
        nuptk: data.user?.nuptk,
        pangkat: data.user?.pangkat,
        golongan: data.user?.golongan,
        gender: data.user?.gender,
        namaSekolah: data.user?.sekolah?.nama,
        tanggalLahir: data.user?.tanggalLahir
          ? moment(data.user?.tanggalLahir)
          : "",
        namaAyah: data.user?.namaAyah,
        waAyah: data.user?.waAyah,
        namaIbu: data.user?.namaIbu,
        waIbu: data.user?.waIbu,
      });
    }
  };

  const handleChangePassword = (e) => {
    const checkbox = [
      "lihatPasswordLama",
      "lihatPasswordBaru",
      "lihatKonfirmasiPassword",
    ];

    setStateFormUbahPassword({
      ...stateFormUbahPassword,
      [e.target.id]: e.target.value,
    });

    if (checkbox.includes(e.target.id)) {
      setStateFormUbahPassword({
        ...stateFormUbahPassword,
        [e.target.id]: !stateFormUbahPassword[e.target.id],
      });
    }
  };

  const handleChangeProfil = (e) => {
    setStateFormProfil({ ...stateFormProfil, [e.target.id]: e.target.value });
  };

  const handleUbahPassword = async () => {
    if (stateFormUbahPassword.konfirmasiPassword == "") {
      toast.error("Masukan passsword baru");

      return;
    }

    if (
      stateFormUbahPassword.konfirmasiPassword !==
      stateFormUbahPassword.passwordBaru
    ) {
      toast.error("Konfirmasi password tidak sesuai");

      return;
    }

    setButtonState("loading");
    const { data, error } = await changePassword(stateFormUbahPassword);
    if (data) {
      hideModal("modalUbahPassword");
      setButtonState("success");
      toast.success(data?.message);
      setStateFormUbahPassword(initialStateFormPassword);
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  const [buttonState, setButtonState] = useState("idle");

  const handlePutEditProfil = async (e, avatar) => {
    setButtonState("loading");
    let payload = { ...stateFormProfil };

    if (avatar) {
      payload = {
        ...payload,
        avatar: avatar,
      };
    }

    if (stateFormProfil.tanggalLahir) {
      payload = {
        ...payload,
        tanggalLahir: moment(stateFormProfil.tanggalLahir).format("YYYY-MM-DD"),
      };
    }

    const { data, error } = await editProfil(payload);
    if (data) {
      setButtonState("success");
      hideModal("modalEditProfil");
      toast.success(data?.message);
      getProfilData();
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  function handleChangeDatePicker(date, dateString) {
    setStateFormProfil({
      ...stateFormProfil,
      tanggalLahir: moment(dateString),
    });
  }

  useEffect(() => {
    getProfilData();
  }, []);

  return (
    <LayoutDetail
      title={"Profil"}
      modalWrapper={
        <>
          {/* Modal Fullscreen Edit Profil Start */}
          <div
            className="modal modal-ss fade"
            id="modalEditProfil"
            tabIndex="-1"
            aria-labelledby="modalEditProfilLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            className="modal-title"
                            id="modalBuatTugasKuisLabel"
                          >
                            <h4 className="mb-1 fw-extrabold">Edit Profil</h4>
                          </div>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => hideModal("modalEditProfil")}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="row justify-content-center gy-4">
                      <div className="col-md-10">
                        <div className="card card-ss">
                          <div className="card-body p-4 pb-5">
                            <h4 className="fw-extrabold color-dark mb-4">
                              Detail Profil
                            </h4>
                            <div className="mb-3">
                              <label className="form-label">Nama Lengkap</label>
                              <input
                                type="text"
                                className="form-control"
                                autoComplete="off"
                                value={stateFormProfil?.nama}
                                id="nama"
                                onChange={(e) => handleChangeProfil(e)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Gender</label>
                              <select
                                className="form-select"
                                aria-label="Default select example"
                                id="gender"
                                value={stateFormProfil?.gender}
                                onChange={(e) => handleChangeProfil(e)}
                              >
                                <option value="">Pilih Gender</option>

                                <option value="L">Laki laki</option>
                                <option value="P">Perempuan</option>
                              </select>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">
                                Nomor {sekolah?.integrasi}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                autoComplete="off"
                                value={stateFormProfil?.whatsapp}
                                id="whatsapp"
                                onChange={(e) => handleChangeProfil(e)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">email</label>
                              <input
                                type="text"
                                className="form-control"
                                autoComplete="off"
                                value={stateFormProfil?.email}
                                id="email"
                                onChange={(e) => handleChangeProfil(e)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">
                                Tanggal Lahir
                              </label>
                              <DatePicker
                                className="form-control"
                                autoComplete="off"
                                value={stateFormProfil?.tanggalLahir}
                                placeholder="Pilih tanggal"
                                onChange={handleChangeDatePicker}
                              />
                            </div>
                            {user?.role == "guru" && (
                              <>
                                <div className="mb-3">
                                  <label className="form-label">NIP</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    autoComplete="off"
                                    value={stateFormProfil?.nip}
                                    id="nip"
                                    onChange={(e) => handleChangeProfil(e)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">NRK</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    autoComplete="off"
                                    value={stateFormProfil?.nrk}
                                    id="nrk"
                                    onChange={(e) => handleChangeProfil(e)}
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">NUPTK</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    autoComplete="off"
                                    value={stateFormProfil?.nuptk}
                                    id="nuptk"
                                    onChange={(e) => handleChangeProfil(e)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-10">
                        <div className="card card-ss">
                          <div className="card-body p-4 pb-5">
                            <h4 className="fw-extrabold color-dark mb-4">
                              Detail Sekolah
                            </h4>
                            <div className="mb-3">
                              <label className="form-label">Nama Sekolah</label>
                              <input
                                type="text"
                                className="form-control"
                                autoComplete="off"
                                value={stateFormProfil?.namaSekolah}
                                id="namaSekolah"
                                onChange={(e) => handleChangeProfil(e)}
                              />
                            </div>
                            {user?.role == "guru" && (
                              <>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Pengampu Pelajaran
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control no-drop"
                                    value={mataPelajaran?.map(
                                      (pelajaran, index) => {
                                        const lastIndex =
                                          mataPelajaran.length - 1 === index;
                                        return `${pelajaran.nama}${
                                          lastIndex ? "" : ","
                                        } `;
                                      }
                                    )}
                                    disabled
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Pangkat</label>
                                  <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    value={stateFormProfil?.pangkat}
                                    id="pangkat"
                                    onChange={(e) => handleChangeProfil(e)}
                                  >
                                    <option option="Penata Muda">
                                      Penata Muda
                                    </option>
                                    <option option="Penata Muda Tingkat I">
                                      Penata Muda Tingkat I
                                    </option>
                                    <option option="Penata">Penata</option>
                                    <option option="Penata Tingkat I">
                                      Penata Tingkat I
                                    </option>
                                    <option option="Pembina">Pembina</option>
                                    <option option="Pembina Tingkat I">
                                      Pembina Tingkat I
                                    </option>
                                    <option option="Pembina Utama Muda">
                                      Pembina Utama Muda
                                    </option>
                                    <option option="Pembina Utama ">
                                      Pembina Utama{" "}
                                    </option>
                                    <option option="Pembina Utama">
                                      Pembina Utama
                                    </option>
                                  </select>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Golongan</label>
                                  <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    value={stateFormProfil?.golongan}
                                    id="golongan"
                                    onChange={(e) => handleChangeProfil(e)}
                                  >
                                    <option value="III / a">III / a</option>
                                    <option value="III / b">III / b</option>
                                    <option value="III / c">III / c</option>
                                    <option value="III / d">III / d</option>
                                    <option value="IV / a">IV / a</option>
                                    <option value="IV / b">IV / b</option>
                                    <option value="IV / c">IV / c</option>
                                    <option value="IV / d">IV / d</option>
                                    <option value="IV / e">IV / e</option>
                                  </select>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {user?.role === "siswa" && (
                        <div className="col-md-10">
                          <div className="card card-ss">
                            <div className="card-body p-4 pb-5">
                              <h4 className="fw-extrabold color-dark mb-4">
                                Kontak Orang Tua / Wali
                              </h4>
                              <div className="mb-3">
                                <label className="form-label">Nama Ayah</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  autoComplete="off"
                                  value={stateFormProfil?.namaAyah}
                                  id="namaAyah"
                                  onChange={(e) => handleChangeProfil(e)}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Nomor Whatsapp
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  autoComplete="off"
                                  value={stateFormProfil?.waAyah}
                                  id="waAyah"
                                  onChange={(e) => handleChangeProfil(e)}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Nama Ibu</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  autoComplete="off"
                                  value={stateFormProfil?.namaIbu}
                                  id="namaIbu"
                                  onChange={(e) => handleChangeProfil(e)}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Nomor Whatsapp
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  autoComplete="off"
                                  value={stateFormProfil?.waIbu}
                                  id="waIbu"
                                  onChange={(e) => handleChangeProfil(e)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <div className="container">
                    <div className="row ">
                      <div className="col-md-12 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Batal
                        </button>
                        <ReactiveButton
                          buttonState={buttonState}
                          color={"primary"}
                          idleText={"Simpan"}
                          loadingText={"Diproses"}
                          successText={"Berhasil"}
                          errorText={"Gagal"}
                          type={"button"}
                          data-bs-dismiss="modal"
                          className={"btn btn-primary"}
                          onClick={handlePutEditProfil}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Fullscreen Edit Profil End */}

          {/* Modal Fullscreen Ubah Password Start */}
          <div
            className="modal modal-ss fade"
            id="modalUbahPassword"
            tabIndex="-1"
            aria-labelledby="modalUbahPasswordLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            className="modal-title"
                            id="modalBuatTugasKuisLabel"
                          >
                            <h4 className="mb-1 fw-extrabold">Ubah Password</h4>
                          </div>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => hideModal("modalUbahPassword")}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="row justify-content-center gy-4">
                      <div className="col-md-10">
                        <div className="card card-ss">
                          <div className="card-body p-4 pb-5">
                            <div className="mb-4">
                              <label className="form-label">
                                Password Lama
                              </label>
                              <input
                                className="form-control mb-2"
                                id="passwordLama"
                                placeholder="Masukkan Password Lama"
                                value={stateFormUbahPassword.passwordLama}
                                onChange={(e) => handleChangePassword(e)}
                                type={
                                  stateFormUbahPassword.lihatPasswordLama
                                    ? "text"
                                    : "password"
                                }
                              />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="lihatPasswordLama"
                                  onChange={(e) => handleChangePassword(e)}
                                />
                                <label
                                  className="form-check-label fs-14-ss color-secondary"
                                  htmlFor="lihatPasswordLama"
                                >
                                  Tampilkan password
                                </label>
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="form-label">
                                Password Baru
                              </label>
                              <input
                                className="form-control mb-2"
                                id="passwordBaru"
                                placeholder="Masukkan Password Baru"
                                value={stateFormUbahPassword.passwordBaru}
                                onChange={(e) => handleChangePassword(e)}
                                type={
                                  stateFormUbahPassword.lihatPasswordBaru
                                    ? "text"
                                    : "password"
                                }
                              />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="lihatPasswordBaru"
                                  onChange={(e) => handleChangePassword(e)}
                                />
                                <label
                                  className="form-check-label fs-14-ss color-secondary"
                                  htmlFor="lihatPasswordBaru"
                                >
                                  Tampilkan password
                                </label>
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="form-label">
                                Konfirmasi Password Baru
                              </label>
                              <input
                                className={`form-control mb-2 ${
                                  stateFormUbahPassword.passwordBaru !==
                                  stateFormUbahPassword.konfirmasiPassword
                                    ? "form-konfirmasi-salah"
                                    : ""
                                }`}
                                id="konfirmasiPassword"
                                placeholder="Konfirmasi Password Baru"
                                value={stateFormUbahPassword.konfirmasiPassword}
                                onChange={(e) => handleChangePassword(e)}
                                type={
                                  stateFormUbahPassword.lihatKonfirmasiPassword
                                    ? "text"
                                    : "password"
                                }
                              />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="lihatKonfirmasiPassword"
                                  onChange={(e) => handleChangePassword(e)}
                                />
                                <label
                                  className="form-check-label fs-14-ss color-secondary"
                                  htmlFor="lihatKonfirmasiPassword"
                                >
                                  Tampilkan password
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <div className="container">
                    <div className="row ">
                      <div className="col-md-12 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ms-3"
                          onClick={handleUbahPassword}
                        >
                          Ubah Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Fullscreen Ubah Password End */}
        </>
      }
    >
      <AnimatePage>
        <div className="row justify-content-center gy-4">
          <div className="col-md-10">
            <div className="card card-ss">
              <div className="card-body text-center p-4">
                <UploadProfilePicture
                  size={100}
                  name="avatar"
                  id="uploadProfileAvatar"
                  preview={user?.avatar}
                  onChange={(e, uploadedFile) =>
                    handlePutEditProfil(e, uploadedFile)
                  }
                  user={user}
                />
                {/* Nama dan Pelajaran Diampu Start*/}
                <h4 className="fw-extrabold color-dark mb-2 mt-3">
                  {user?.nama}
                </h4>
                <p className="color-secondary fs-18-ss fw-semibold mb-4">
                  {mataPelajaran?.map((pelajaran, index) => {
                    const lastIndex = mataPelajaran.length - 1 === index;
                    return `${pelajaran.nama}${lastIndex ? "" : ","} `;
                  })}
                </p>

                {/* Nama dan Pelajaran Diampu End*/}
                {/* Button Modal Edit Profil & Password Start */}
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-outline-primary btn-outline-primary-ss rounded-pill d-flex justify-content-center align-items-center fs-14-ss fw-bold p-0 me-4"
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditProfil"
                    style={{
                      width: "150px",
                      height: "35px",
                    }}
                  >
                    Edit Profil
                  </button>
                  <button
                    className="btn btn-outline-primary btn-outline-primary-ss rounded-pill d-flex justify-content-center align-items-center fs-14-ss fw-bold p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#modalUbahPassword"
                    style={{
                      width: "150px",
                      height: "35px",
                    }}
                  >
                    Ubah Password
                  </button>
                </div>
                {/* Button Modal Edit Profil & Password End */}
              </div>
            </div>
          </div>
          {/* Detail Profil Start*/}
          <div className="col-md-10">
            <div className="card card-ss">
              <div className="card-body p-4 pb-5">
                <h4 className="fw-extrabold color-dark mb-0">Detail Profil</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">Gender</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.genderText || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      Nomor {sekolah?.integrasi}
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.whatsapp || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">email</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.email || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">Tanggal Lahir</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.tanggalLahir || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">NIP</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.nip || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2"> NRK</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.nrk || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">NUPTK</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.nuptk || "-"}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Detail Profil End*/}
          {/* Detail Sekolah Start*/}
          <div className="col-md-10">
            <div className="card card-ss">
              <div className="card-body p-4 pb-5">
                <h4 className="fw-extrabold color-dark mb-0">Detail Sekolah</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">Nama Sekolah</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.sekolah?.nama || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      Pengampu Pelajaran
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {mataPelajaran?.map((pelajaran, index) => {
                        const lastIndex = mataPelajaran.length - 1 === index;
                        return `${pelajaran.nama}${lastIndex ? "" : ","} `;
                      })}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">Pangkat</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.pangkat || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2"> Golongan</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {user?.golongan || "-"}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">Kelas Perwalian</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {rombel?.nama || "-"}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Detail Sekolah End*/}
          {/* Kontak Orantua / Wali Start*/}
          {user?.role === "siswa" && (
            <div className="col-md-10">
              <div className="card card-ss">
                <div className="card-body p-4 pb-5">
                  <h4 className="fw-extrabold color-dark mb-0">
                    Kontak Orang Tua / Wali
                  </h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item pt-4 py-2 ps-0">
                      <h6 className="color-dark fw-bold mb-2">Nama Ayah</h6>
                      <p className="color-secondary fs-18-ss fw-semibold mb-0">
                        {user?.namaAyah || "-"}
                      </p>
                    </li>
                    <li className="list-group-item pt-4 py-2 ps-0">
                      <h6 className="color-dark fw-bold mb-2">
                        Nomer Whatsapp
                      </h6>
                      <p className="color-secondary fs-18-ss fw-semibold mb-0">
                        {user?.waAyah || "-"}
                      </p>
                    </li>
                    <li className="list-group-item pt-4 py-2 ps-0">
                      <h6 className="color-dark fw-bold mb-2">Nama Ibu</h6>
                      <p className="color-secondary fs-18-ss fw-semibold mb-0">
                        {user?.namaIbu || "-"}
                      </p>
                    </li>
                    <li className="list-group-item pt-4 py-2 ps-0">
                      <h6 className="color-dark fw-bold mb-2">
                        Nomer Whatsapp
                      </h6>
                      <p className="color-secondary fs-18-ss fw-semibold mb-0">
                        {user?.waIbu || "-"}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {/* Kontak Orantua / Wali End*/}
        </div>
      </AnimatePage>
    </LayoutDetail>
  );
};

export default index;
