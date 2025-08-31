import { useState } from "react";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import ModalEditBio from "../Profil/ModalEditBio";
import ModalEditInformasiPerusahaan from "./ModalEditInformasiPerusahaan";
import { momentPackage } from "utilities/HelperUtils";

const SectionRuangLingkupMou = ({
  isReadOnly = false,
  data,
  dataPerusahaan,
  _getDetailPerusahaan,
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

  const _postPerusahaan = async () => {
    const { data, error } = await postPerusahaanSekolah({ ...formData });

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahPerusahaan");
      setFormData({ ...initialFormData });
      _getPerusahhaan();
    }
  };

  const _putPerusahaan = async () => {
    const { data, error } = await putPerusahaanSekolah(formData?.id, {
      ...formData,
    });

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahPerusahaan");
      setFormData({ ...initialFormData });
      _getPerusahhaan();
    }
  };

  const ruangLingkupKerjasama = [
    { name: "PKL/Magang Siswa" },
    { name: "Sinkronisasi Kurikulum" },
    { name: "Magang Guru" },
    { name: "Narasumber Guru Tamu" },
    { name: "Kelas Industri" },
    { name: "TEFA" },
  ];

  const fasilitasPerusahaan = [
    { name: "Jaminan Kesehatan" },
    { name: "Keselamatan Kerja" },
    { name: "Alat Bantu / Media" },
    { name: "Uang Saku" },
    { name: "Uang Transportasi" },
    { name: "Makan" },
  ];

  const ruangLingkupMou = [
    {
      icon: `/img/icon-file-mou.svg`,
      iconAlt: `icon-file-mou`,
      title: `MoU Aktif`,
      content: `${dataPerusahaan?.tkPerusahaanSekolah?.mou1?.nama}`,
      col: `col-md-12`,
    },
    {
      icon: `/img/icon-mou-mulai.svg`,
      iconAlt: `icon-mou-mulai`,
      title: `Tanggal Mulai`,
      content: `${momentPackage(
        dataPerusahaan?.tkPerusahaanSekolah?.mou1?.mulaiKontrak
      ).format("dddd, DD MMMM YYYY")}`,
    },
    {
      icon: `/img/icon-mou-akhir.svg`,
      iconAlt: `icon-mou-akhir`,
      title: `Tanggal Akhir`,
      content: `${momentPackage(
        dataPerusahaan?.tkPerusahaanSekolah?.mou1?.akhirKontrak
      ).format("dddd, DD MMMM YYYY")}`,
    },
    {
      icon: `/img/icon-ruang-lingkup-kerjasama.svg`,
      iconAlt: `icon-ruang-lingkup-kerjasama`,
      title: `Ruang Lingkup Kerjasama`,
      content: (
        <>
          <div className="d-flex flex-wrap align-items-center">
            {dataPerusahaan?.tkPerusahaanSekolah?.mou1?.kerjasama
              ?.split(",")
              .map((d) => {
                return (
                  <span className="label-ss rounded-pill bg-soft-secondary color-secondary fw-bold fs-12-ss m-1">
                    {d}
                  </span>
                );
              })}
          </div>
        </>
      ),
      col: "col-md-12",
    },
    {
      icon: `/img/icon-fasilitas-perusahaan.svg`,
      iconAlt: `icon-fasilitas-perusahaan`,
      title: `Fasilitas Perusahaan`,
      content: (
        <>
          <div className="d-flex flex-wrap align-items-center">
            {dataPerusahaan?.tkPerusahaanSekolah?.mou1?.fasilitas
              ?.split(",")
              .map((d) => {
                return (
                  <span className="label-ss rounded-pill bg-soft-secondary color-secondary fw-bold fs-12-ss m-1">
                    {d}
                  </span>
                );
              })}
          </div>
        </>
      ),
      col: "col-md-12",
    },
  ];

  return (
    <>
      <div className="card card-ss">
        <div className="card-body p-4 pb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold color-dark mb-0">Ruang Lingkup MoU</h4>
          </div>
          <div className="row g-4">
            {ruangLingkupMou?.map((d) => {
              return (
                <div className={d.col ? d.col : "col-md-6"}>
                  <div
                    className={`d-flex ${
                      d.isAlamat ? "align-items-start" : "align-items-center"
                    }`}
                  >
                    <img
                      src={d.icon}
                      alt={d.iconAlt}
                      style={{ width: "60px", height: "60px" }}
                    />
                    <div className="ms-4">
                      <h5 className="fs-18-ss color-dark fw-bold mb-1">
                        {d.title}
                      </h5>
                      <h6 className="fw-semibold color-dark mb-0">
                        {d.content}
                      </h6>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ModalEditInformasiPerusahaan
        formData={formData}
        setFormData={setFormData}
        handleSubmit={() => {
          formData?.id ? _putPerusahaan() : _postPerusahaan();
        }}
      />
    </>
  );
};

export default SectionRuangLingkupMou;
