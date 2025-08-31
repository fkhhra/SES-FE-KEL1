import { useState } from "react";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import ModalEditBio from "../Profil/ModalEditBio";
import { momentPackage } from "utilities/HelperUtils";

const SectionStatusSaatIni = ({
  isReadOnly = false,
  data,
  status,
  dataDetailAlumni,
}) => {
  const initialStateForm = {
    bio: "",
    btnBio: "idle",
  };

  const { user, setUser } = data || useUser();

  const [formData, setFormData] = useState({
    ...initialStateForm,
    ...user,
    ...user?.profil,
  });

  const _postProfilUser = async () => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await postProfilUser({ bio: formData.bio });

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      hideModal("modalEditBio");
      toast.success(data?.message);
      setUser({ ...user, profil: { ...user.profil, bio: formData.bio } });
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="card card-ss">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold color-dark mb-0">Status Saat Ini</h4>
            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                style={{
                  width: "40px",
                  height: "40px",
                }}
                data-bs-toggle="modal"
                data-bs-target="#modalEditBio"
                // onClick={() => onClickEdit(slider)}
                // data-joyride="edit-slider"
              >
                <FaPen className="color-secondary fs-5" />
              </button>
            )}
          </div>
          <div className="d-flex align-items-center mb-4">
            <img
              src={`/img/icon-alumni-${
                dataDetailAlumni?.status == "bekerja"
                  ? "bekerja"
                  : dataDetailAlumni?.status == "kuliah"
                  ? "kuliah"
                  : dataDetailAlumni?.status == "mencari-kerja"
                  ? "mencari-kerja"
                  : dataDetailAlumni?.status == "berwirausaha"
                  ? "berwirausaha"
                  : ""
              }.svg`}
              alt=""
              height={`16px`}
              className="me-2"
            />
            <p className="mb-0 color-primary fw-bold">
              {dataDetailAlumni?.status == "bekerja"
                ? "Bekerja"
                : dataDetailAlumni?.status == "kuliah"
                ? "Berkuliah"
                : dataDetailAlumni?.status == "mencari-kerja"
                ? "Mencari Kerja"
                : dataDetailAlumni?.status == "berwirausaha"
                ? "Berwirausaha"
                : ""}
            </p>
          </div>
          <div className="row g-4">
            {dataDetailAlumni?.status == "kuliah" ? (
              <>
                {" "}
                <div className="col-md-12">
                  <h6 className="fw-bold color-dark mb-2">
                    Nama Perguruan Tinggi
                  </h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                    {dataDetailAlumni?.sekolahLanjutan}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">
                    Program Pendidikan
                  </h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                    {dataDetailAlumni?.programPendidikan}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Fakultas</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                    {dataDetailAlumni?.fakultas}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Program Studi</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                    {dataDetailAlumni?.prodi}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Mulai Berkuliah</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                    {momentPackage(dataDetailAlumni?.mulaiKuliah).format('dddd, DD MMMM YYYY')}
                  </h5>
                </div>
              </>
            ) : dataDetailAlumni?.status == "bekerja" ? (
              <>
                {" "}
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Nama Perusahaan</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                    {dataDetailAlumni?.kantor}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Bidang Perusahaan</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">{dataDetailAlumni?.sektorIndustri}</h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Posisi</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">{dataDetailAlumni?.posisi}</h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Mulai Bekerja</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                  {momentPackage(dataDetailAlumni?.mulaiBekerja).format('dddd, DD MMMM YYYY')}
                  </h5>
                </div>
                <div className="col-md-12">
                  <h6 className="fw-bold color-dark mb-2">Alamat</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                    {dataDetailAlumni?.alamatPerusahaan}
                    {/* Cilandak, Kota Jakarta Selatan, DKI Jakarta */}
                  </h5>
                </div>
              </>
            ) : dataDetailAlumni?.status == "berwirausaha" ? (
              <>
                {" "}
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Nama Perusahaan</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                   {dataDetailAlumni?.usaha}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Bidang Perusahaan</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">{dataDetailAlumni?.bidangUsaha}</h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Posisi</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">{dataDetailAlumni?.posisiUsaha}</h5>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">
                    Mulai Berwirausaha
                  </h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                  {momentPackage(dataDetailAlumni?.mulaiUsaha).format('dddd, DD MMMM YYYY')}
                  </h5>
                </div>
                <div className="col-md-12">
                  <h6 className="fw-bold color-dark mb-2">Alamat</h6>
                  <h5 className="fw-semibold fs-18-ss mb-0">
                   {dataDetailAlumni?.alamatUsaha}
                    {/* Cilandak, Kota Jakarta Selatan, DKI Jakarta */}
                  </h5>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <ModalEditBio
        handleChangeForm={handleChangeForm}
        formData={formData}
        _postProfilUser={_postProfilUser}
      />
    </>
  );
};

export default SectionStatusSaatIni;
