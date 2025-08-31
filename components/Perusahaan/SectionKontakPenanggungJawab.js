import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import ModalEditBio from "../Profil/ModalEditBio";
import ModalEditInformasiPerusahaan from "./ModalEditInformasiPerusahaan";
import ModalEditKontakPenanggungJawab from "./ModalEditKontakPenanggungJawab";
import { momentPackage } from "utilities/HelperUtils";

const SectionKontakPenanggungJawab = ({
  isReadOnly = false,
  data,
  dataPerusahaan,
  id,
  _getDetailPerusahaan,
}) => {
  const initialStateForm = {
    bio: "",
    btnBio: "idle",
  };

  const { user, setUser } = data || useUser();
  const [editData, setEditData] = useState(null);

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

  const kontakPenanggungJawab = [
    {
      icon: `/img/icon-nama-kontak.svg`,
      iconAlt: `icon-nama-kontak`,
      title: `Nama`,
      content: `${
        dataPerusahaan?.informasi?.namaPj != null
          ? dataPerusahaan?.informasi?.namaPj
          : "-"
      } `,
    },
    {
      icon: `/img/icon-telepon.svg`,
      iconAlt: `icon-telepon`,
      title: `Nomor Telepon`,
      content: `${
        dataPerusahaan?.informasi?.teleponPj != null
          ? dataPerusahaan?.informasi?.teleponPj
          : "-"
      } `,
    },
    {
      icon: `/img/icon-email.svg`,
      iconAlt: `icon-email`,
      title: `Email`,
      content: `${
        dataPerusahaan?.informasi?.emailPj != null
          ? dataPerusahaan?.informasi?.emailPj
          : "-"
      } `,
    },
    {
      icon: `/img/icon-tanggal-registrasi.svg`,
      iconAlt: `icon-tanggal-registrasi`,
      title: `Tanggal Registrasi`,
      content: `${
        dataPerusahaan?.informasi?.registrasiPj != null
          ? momentPackage(dataPerusahaan?.informasi?.registrasiPj).format(
              "dddd, DD MMMM YYYY"
            )
          : "-"
      } `,
    },
  ];

  return (
    <>
      <div className="card card-ss">
        <div className="card-body p-4 pb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold color-dark mb-0">
              Kontak Penanggung Jawab
            </h4>
            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                style={{
                  width: "40px",
                  height: "40px",
                }}
                data-bs-toggle="modal"
                data-bs-target="#modalEditKontakPenanggungJawab"
                onClick={() => setEditData(dataPerusahaan)}
              >
                <FaPen className="color-secondary fs-5" />
              </button>
            )}
          </div>
          <div className="row g-4">
            {kontakPenanggungJawab?.map((d) => {
              return (
                <div className={"col-md-12"}>
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

      <ModalEditKontakPenanggungJawab
        id={id}
        editData={editData}
        _getDetailPerusahaan={_getDetailPerusahaan}
      />
    </>
  );
};

export default SectionKontakPenanggungJawab;
