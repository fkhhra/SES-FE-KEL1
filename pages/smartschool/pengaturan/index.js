import { useEffect, useState } from "react";
import LayoutDetail from "../../../components/Layout/LayoutDetail";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { getKontak, updateKontak } from "../../../client/KontakClient";
import toast from "react-hot-toast";
import { hideModal } from "../../../utilities/ModalUtils";
import ReactiveButton from "reactive-button";
import useSekolah from "../../../hooks/useSekolah";
import ModalPengaturanKontak from "../../../components/Pengaturan/ModalPengaturanKontak";
import ModalPengaturanInformasi from "../../../components/Pengaturan/ModalPengaturanInformasi";
import { editSekolah, meSekolah } from "../../../client/SekolahClient";
import SideNavPengaturan from "components/Pengaturan/SideNavPengaturan";
import { ssURL } from "client/clientAxios";
import router from "next/router";

const initialFormData = {
  tu: "",
  keuangan: "",
  kurikulum: "",
  kesiswaan: "",
  sarpras: "",
  humas: "",
};

const index = () => {
  const { sekolah, setSekolah } = useSekolah();
  const [formData, setFormData] = useState(initialFormData);
  const [kontakData, setKontakData] = useState({});
  const [buttonState, setButtonState] = useState("idle");

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  useEffect(() => {
    router.push({ pathname: "/smartschool/pengaturan/keamanan" });
  }, []);

  useEffect(() => {
    setFormData({ ...formData, ...sekolah });
  }, [sekolah]);

  return (
    <LayoutDetail
      bgMain
      backProps={ssURL}
      title={"Pengaturan"}
      modalWrapper={
        <>
          {/* Modal Fullscreen Edit Profil Start */}
          <ModalPengaturanKontak
            formData={formData}
            buttonState={buttonState}
            _updateKontak={_updateKontak}
            handleChangeForm={handleChangeForm}
          />

          {/* Modal Fullscreen Edit Profil End */}

          {/* Modal Fullscreen Edit Informasi Sekolah Start */}
          <ModalPengaturanInformasi
            formData={formData}
            buttonState={buttonState}
            _updateInformasi={_updateInformasi}
            handleChangeForm={handleChangeForm}
          />

          {/* Modal Fullscreen Edit Informasi Sekolah End */}
        </>
      }
    >
      <AnimatePage>
        <div className="row g-4">
          {/* Detail Profil Start*/}
          <div className="col-lg-3">
            <SideNavPengaturan ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <div className="card card-ss">
              <div className="card-body p-4 pb-5">
                <div className="d-flex justify-content-between align-items-center pb-3">
                  <h4 className="fw-extrabold color-dark mb-0">Kontak</h4>
                  <button
                    className="btn btn-ss btn-outline-primary btn-outline-primary-ss rounded-pill fs-14-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPengaturanKontak"
                  >
                    Edit Kontak
                  </button>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item pt-2 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      Nomor Telpon Tata Usaha
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {kontakData?.tu}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      Nomor Telpon Keuangan
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {kontakData?.keuangan}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      Nomor Telpon Kurikulum
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {kontakData?.kurikulum}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      {" "}
                      Nomor Telpon Kesiswaan
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {kontakData?.kesiswaan}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      Nomor Telpon Sarpras
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {kontakData?.sarpras}
                    </p>
                  </li>
                  <li className="list-group-item pt-4 py-2 ps-0">
                    <h6 className="color-dark fw-bold mb-2">
                      Nomor Telpon Humas
                    </h6>
                    <p className="color-secondary fs-18-ss fw-semibold mb-0">
                      {kontakData?.humas}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card card-ss">
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
            </div>
          </div>
          {/* Detail Profil End*/}
        </div>
      </AnimatePage>
    </LayoutDetail>
  );
};

export default index;
