import { ssURL } from "client/clientAxios";
import SideNavPengaturan from "components/Pengaturan/SideNavPengaturan";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getKontak, updateKontak } from "../../../../client/KontakClient";
import {
  editFitur,
  editSekolah,
  meSekolah,
} from "../../../../client/SekolahClient";
import LayoutDetail from "../../../../components/Layout/LayoutDetail";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import useSekolah from "../../../../hooks/useSekolah";
import { hideModal } from "../../../../utilities/ModalUtils";

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
  const [fitur, setFitur] = useState({});

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

  const _getSekolah = async () => {
    const { data } = await meSekolah();
    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const _changeFitur = async (load) => {
    const payload = { fitur: JSON.stringify(load) };
    const { data } = await editFitur(payload);

    if (data) {
      toast.success(data?.message);
      _getSekolah();
    }
  };

  useEffect(() => {
    _getKontak();
  }, []);

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
          {/* <ModalUbahPasswordGuru /> */}
          {/* <ModalUbahPasswordSiswa /> */}
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
                  <h4 className="fw-extrabold color-dark mb-0">Sarpras</h4>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item pt-2 pb-4 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          src="/img/icon-pengaturan-sarpras-nota-barang.svg"
                          alt="icon-pengaturan-sarpras-nota-barang"
                          className="me-4"
                        />
                        <div className="">
                          <h6 className="fw-extrabold color-dark mb-2">
                            Nota Barang
                          </h6>
                          <p className="fs-14-ss fw-semibold mb-0">
                            Anda dapat mewajibkan penggunaan nota disetiap
                            penambahan barang
                          </p>
                        </div>
                      </div>
                      <div class="form-check form-switch form-switch-ss">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckDefault"
                          checked={fitur?.nota_barang}
                          onChange={(e) => {
                            _changeFitur({
                              ...fitur,
                              nota_barang: e.target.checked,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
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
