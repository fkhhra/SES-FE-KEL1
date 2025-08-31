import { useEffect, useState } from "react";
import LayoutDetail from "../../../../components/Layout/LayoutDetail";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { getKontak, updateKontak } from "../../../../client/KontakClient";
import toast from "react-hot-toast";
import { hideModal } from "../../../../utilities/ModalUtils";
import ReactiveButton from "reactive-button";
import useSekolah from "../../../../hooks/useSekolah";
import ModalPengaturanKontak from "../../../../components/Pengaturan/ModalPengaturanKontak";
import ModalPengaturanInformasi from "../../../../components/Pengaturan/ModalPengaturanInformasi";
import {
  editSekolah,
  meSekolah,
  editFitur,
} from "../../../../client/SekolahClient";
import SideNavPengaturan from "components/Pengaturan/SideNavPengaturan";
import { ssURL } from "client/clientAxios";
import { FaPen } from "react-icons/fa";
import ModalUbahPasswordGuru from "components/Pengaturan/ModalUbahPasswordGuru";
import ModalUbahPasswordSiswa from "components/Pengaturan/ModalUbahPasswordSiswa";
import { hapusAkunRole, resetPasswordRole } from "client/UserClient";
import { getGTK } from "client/GTKClient";
import swal from "sweetalert";
import { getAnggotaRombel, getRombel } from "client/RombelClient";
import ModalHapusAkunSiswa from "components/Pengaturan/ModalHapusAkunSiswa";

const initialFormData = {
  password: "",
  konfirmasiPassword: "",
  lihatPassword: false,
  lihatKonfirmasiPassword: false,
  listGuru: [],
  listRombel: [],
  listAnggota: [],
  search: "",
  page: 1,
};

const index = () => {
  const { sekolah, setSekolah } = useSekolah();
  const [formData, setFormData] = useState(initialFormData);
  const [listGuru, setListGuru] = useState([]);
  const [total, setTotal] = useState(0);
  const [kontakData, setKontakData] = useState({});
  const [buttonState, setButtonState] = useState("idle");
  const [rombel, setRombel] = useState([]);
  const [anggotaRombel, setAnggotaRombel] = useState([]);
  const [fitur, setFitur] = useState({});

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = (e) => {
    const checkbox = ["lihatPassword", "lihatKonfirmasiPassword"];

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (checkbox.includes(e.target.id)) {
      setFormData({
        ...formData,
        [e.target.id]: !formData[e.target.id],
      });
    }
  };

  const handleSubmit = async (role) => {
    if (formData?.password != formData?.konfirmasiPassword) {
      toast.error("password tidak cocok");
      return;
    }
    swal({
      title: "Yakin ingin mengubah Password?",
      text: `!!! Password ${role} akan diubah !!!`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      const userId =
        role == "guru"
          ? formData?.listGuru == "semua" || formData.listGuru.length == 0
            ? 0
            : formData.listGuru
          : formData?.listAnggota;
      if (willDelete) {
        setFormData({ ...formData, btnBio: "loading" });
        const { isSuccess, data, error } = await resetPasswordRole({
          password: formData?.password,
          role: role,
          userId,
        });
        if (isSuccess) {
          toast.success(data?.message);
          setFormData({ ...formData, btnBio: "success" });
        } else {
          toast.error(error?.message);
          setFormData({ ...formData, btnBio: "error" });
        }
      }
    });
  };

  const handleHapus = async (role) => {
    swal({
      title: "Yakin ingin mengubah Akun?",
      text: `!!! Akun ${role} akan dihapus !!!`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      const userId =
        role == "guru"
          ? formData?.listGuru == "semua" || formData.listGuru.length == 0
            ? 0
            : formData.listGuru
          : formData?.listAnggota;
      if (willDelete) {
        setFormData({ ...formData, btnBio: "loading" });
        const { isSuccess, data, error } = await hapusAkunRole({
          role: role,
          userId,
        });
        if (isSuccess) {
          toast.success(data?.message);
          setFormData({ ...formData, btnBio: "success" });
        } else {
          toast.error(error?.message);
          setFormData({ ...formData, btnBio: "error" });
        }
      }
    });
  };

  const _getSekolah = async () => {
    const { data } = await meSekolah();
    if (data) {
      setSekolah(data?.sekolah);
    }
  };

  const _getDataGuru = async (search = "") => {
    const { data } = await getGTK({
      page: "all",
      search: search,
    });
    if (data) {
      setListGuru(data?.guru);
      setTotal(data?.guru);
      return data?.guru?.data;
    }
  };

  const loadOptions = async (search) => {
    const data = await _getDataGuru(search);
    return [{ label: "Semua Guru", value: "semua" }].concat(
      data?.map((d) => {
        return {
          value: d?.id,
          label: d?.nama,
        };
      })
    );
  };

  const _getDataRombel = async () => {
    const { data } = await getRombel();

    if (data) {
      setRombel(data?.rombel);
    }
  };

  const _getDataAnggota = async () => {
    const { data } = await getAnggotaRombel({
      m_rombel_id: formData?.listRombel,
    });

    if (data) {
      setAnggotaRombel(data?.anggota);
    }
  };

  const _updateKontak = async () => {
    setButtonState("loading");
    const { data } = await updateKontak(formData);
    if (data) {
      toast.success(data.message);
      _getKontak();
      hideModal("modalPengaturanKontak");
      setButtonState("success");
    } else {
      setButtonState("error");
    }
  };

  const _updateInformasi = async () => {
    setButtonState("loading");
    const { data, error } = await editSekolah(sekolah.id, {
      ...formData,
    });

    if (data) {
      const { data: sekolah } = await meSekolah();
      if (sekolah) {
        setSekolah(sekolah.sekolah);
        toast.success(data.message);
        hideModal("modalPengaturanInformasi");
        setButtonState("success");
      }
    } else {
      setButtonState("error");
    }
  };

  const _getKontak = async () => {
    const { data } = await getKontak();
    if (data) {
      setKontakData(data.kontak);
      setFormData({
        ...formData,
        ...data.kontak,
      });
    }
  };

  const _changeExamBrowserSetting = async (load) => {
    const payload = { fitur: JSON.stringify(load) };
    const { data } = await editFitur(payload);

    if (data) {
      toast.success(data?.message);
      _getSekolah();
    }
  };

  useEffect(() => {
    _getDataGuru();
    _getDataRombel();
  }, []);

  useEffect(() => {
    _getDataAnggota();
  }, [formData?.listRombel]);

  useEffect(() => {
    setFormData({ ...formData, ...sekolah });
    setFitur(JSON.parse(sekolah?.fitur?.fitur || "{}"));
  }, [sekolah]);

  return (
    <LayoutDetail
      bgMain
      backProps={ssURL}
      title={"Pengaturan"}
      modalWrapper={
        <>
          <ModalUbahPasswordGuru
            formData={formData}
            handleChangeForm={handleChangeForm}
            handleSubmit={() => handleSubmit("guru")}
            handleChangePassword={handleChangePassword}
            listGuru={listGuru}
            loadOptions={loadOptions}
          />
          <ModalUbahPasswordSiswa
            rombel={rombel}
            formData={formData}
            handleChangeForm={handleChangeForm}
            handleSubmit={() => handleSubmit("siswa")}
            handleChangePassword={handleChangePassword}
            anggotaRombel={anggotaRombel}
          />
          <ModalHapusAkunSiswa
            rombel={rombel}
            formData={formData}
            handleChangeForm={handleChangeForm}
            handleHapus={() => handleHapus("siswa")}
            anggotaRombel={anggotaRombel}
          />
        </>
      }
    >
      <AnimatePage>
        <div className="row">
          {/* Detail Profil Start*/}
          <div className="col-lg-3">
            <SideNavPengaturan ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <div className="card card-ss">
              <div className="card-body p-4 pb-5">
                <div className="d-flex justify-content-between align-items-center pb-3">
                  <h4 className="fw-extrabold color-dark mb-0">
                    Ubah Password
                  </h4>
                  {/* <button
                    className="btn btn-ss btn-outline-primary btn-outline-primary-ss rounded-pill fs-14-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPengaturanKontak"
                  >
                    Edit Kontak
                  </button> */}
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item pt-2 pb-4 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          src="/img/icon-ubah-password-guru.svg"
                          alt="icon-ubah-password-guru"
                          className="me-4"
                        />
                        <div className="">
                          <h6 className="fw-extrabold color-dark mb-2">Guru</h6>
                          <p className="fs-14-ss fw-semibold mb-0">
                            Anda dapat mengubah password semua akun guru
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                        style={{
                          width: "35px",
                          height: "35px",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalUbahPasswordGuru"
                        onClick={() => {
                          setFormData(initialFormData);
                        }}
                      >
                        <FaPen className="color-secondary fs-6" />
                      </button>
                    </div>
                  </li>
                  <li className="list-group-item py-4 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          src="/img/icon-ubah-password-siswa.svg"
                          alt="icon-ubah-password-siswa"
                          className="me-4"
                        />
                        <div className="">
                          <h6 className="fw-extrabold color-dark mb-2">
                            Siswa
                          </h6>
                          <p className="fs-14-ss fw-semibold mb-0">
                            Anda dapat mengubah password semua akun siswa di
                            setiap kelas
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                        style={{
                          width: "35px",
                          height: "35px",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalUbahPasswordSiswa"
                        onClick={() => {
                          setFormData(initialFormData);
                        }}
                      >
                        <FaPen className="color-secondary fs-6" />
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="card-body p-4 pb-5">
                <div className="d-flex justify-content-between align-items-center pb-3">
                  <h4 className="fw-extrabold color-dark mb-0">Hapus Akun</h4>
                  {/* <button
                    className="btn btn-ss btn-outline-primary btn-outline-primary-ss rounded-pill fs-14-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPengaturanKontak"
                  >
                    Edit Kontak
                  </button> */}
                </div>
                <ul className="list-group list-group-flush">
                  {/* <li className="list-group-item pt-2 pb-4 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          src="/img/icon-ubah-password-guru.svg"
                          alt="icon-ubah-password-guru"
                          className="me-4"
                        />
                        <div className="">
                          <h6 className="fw-extrabold color-dark mb-2">Guru</h6>
                          <p className="fs-14-ss fw-semibold mb-0">
                            Anda dapat mengubah password semua akun guru
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                        style={{
                          width: "35px",
                          height: "35px",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalUbahPasswordGuru"
                        onClick={() => {
                          setFormData(initialFormData);
                        }}
                      >
                        <FaPen className="color-secondary fs-6" />
                      </button>
                    </div>
                  </li> */}
                  <li className="list-group-item py-4 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          src="/img/icon-ubah-password-siswa.svg"
                          alt="icon-ubah-password-siswa"
                          className="me-4"
                        />
                        <div className="">
                          <h6 className="fw-extrabold color-dark mb-2">
                            Siswa
                          </h6>
                          <p className="fs-14-ss fw-semibold mb-0">
                            Anda dapat menghapus semua akun siswa di setiap
                            kelas
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                        style={{
                          width: "35px",
                          height: "35px",
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalHapusAkunSiswa"
                        onClick={() => {
                          setFormData(initialFormData);
                        }}
                      >
                        <FaPen className="color-secondary fs-6" />
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
              {(sekolah?.id == 8123 || sekolah?.id == 8027) && (
                <div className="card-body p-4 pb-5">
                  <div className="d-flex justify-content-between align-items-center pb-3">
                    <h4 className="fw-extrabold color-dark mb-0">
                      Pengaturan ExamBrowser
                    </h4>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item pt-2 pb-4 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src="/img/icon-ubah-password-siswa.svg"
                            alt="icon-ubah-password-siswa"
                            className="me-4"
                          />
                          <div className="">
                            <h6 className="fw-extrabold color-dark mb-2">
                              ExamBrowser
                            </h6>
                            <p className="fs-14-ss fw-semibold mb-0">
                              Anda tidak mengizinkan smarteschool di buka di
                              luar ExamBrowser
                            </p>
                          </div>
                        </div>
                        <div class="form-check form-switch form-switch-ss">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            checked={fitur?.user_agent}
                            onChange={(e) => {
                              _changeExamBrowserSetting({
                                ...fitur,
                                user_agent: e.target.checked,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* <div className="card card-ss">
              <div className="card-body p-4 pb-5">
                <div className="d-flex justify-content-between align-items-center pb-3">
                  <h4 className="fw-extrabold color-dark mb-0">
                    Informasi Sekolah
                  </h4>
                  <button
                    className="btn btn-ss btn-outline-primary btn-outline-primary-ss rounded-pill fs-14-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPengaturanInformasi"
                  >
                    Edit Informasi
                  </button>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item pt-2 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">Alamat Sekolah</h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {sekolah?.alamat}
                    </p>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
          {/* Detail Profil End*/}
        </div>
      </AnimatePage>
    </LayoutDetail>
  );
};

export default index;
