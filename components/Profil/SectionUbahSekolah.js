import { editSekolah } from "client/SekolahClient";
import SectionKontakSekolah from "components/Profil/SectionKontakSekolah";
import SectionLambangSekolah from "components/PublikasiProfil/SectionLambangSekolah";
import useSekolah from "hooks/useSekolah";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import useUser from "../../hooks/useUser";
import SectionAlamatSekolah from "./SectionAlamatSekolah";

const initialFormData = {
  // section lambang sekolah
  fotoLogo: "",

  // section kontak sekolah
  alamat: "",
  gmaps: "",
  email: "",
  telp: "",
  fax: "",
  linkDapodik: "",
  linkRapor: "",
  linkWeb: "",
  kodePos: "",
  kelurahan: "",
  kecamatan: "",
  kabupaten: "",
  provinsi: "",
};

const SectionUbahSekolah = ({ isReadOnly = false }) => {
  const { user, setUser } = useUser();
  const { sekolah } = useSekolah();

  const [whatsapp, setWhatsapp] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  const handleSubmit = async () => {
    setButtonState("loading");
    const { data, error } = await editSekolah(user?.mSekolahId, {
      ...formData,
    });
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  useEffect(() => {
    if (sekolah?.id) {
      setFormData({ ...sekolah, fotoLogo: sekolah?.logo });
    }
  }, [sekolah]);

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card card-ss">
              <SectionLambangSekolah
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionKontakSekolah
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionAlamatSekolah
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />

              <div className="card-footer-ss pb-5">
                <div className="d-flex justify-content-end align-items-center px-4 pb-3">
                  <div data-joyride="btn-simpan">
                    <ReactiveButton
                      buttonState={buttonState}
                      onClick={handleSubmit}
                      color={"primary"}
                      idleText={"Simpan Perubahan"}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionUbahSekolah;
