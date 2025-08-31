import { useState } from "react";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import ModalEditBio from "../Profil/ModalEditBio";
import ModalEditInformasiPerusahaan from "./ModalEditInformasiPerusahaan";
import { putInformasiPerusahaan } from "client/PerusahaanClient";
import { momentPackage } from "utilities/HelperUtils";

const SectionInformasiPerusahaan = ({
  isReadOnly = false,
  data,
  dataPerusahaan,
  id,
  _getDetailPerusahaan,
}) => {
  const { user, setUser } = data || useUser();

  const [editData, setEditData] = useState(null);

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const informasiPerusahaan = [
    {
      icon: `/img/icon-bidang-perusahaan.svg`,
      iconAlt: `icon-bidang-perusahaan`,
      title: `Bidang Perusahaan`,
      content: `${
        dataPerusahaan?.bidang != null ? dataPerusahaan?.bidang : "-"
      } `,
    },
    {
      icon: `/img/icon-keselarasan.svg`,
      iconAlt: `icon-keselarasan`,
      title: `Keselarasan`,
      content: `${
        dataPerusahaan?.informasi?.keselarasan == 1 ? "Ya" : "Tidak"
      } `,
    },
    {
      icon: `/img/icon-perusahaan-didirikan.svg`,
      iconAlt: `icon-perusahaan-didirikan`,
      title: `Didirikan`,
      content: `${
        dataPerusahaan?.informasi?.didirikan != null
          ? dataPerusahaan?.informasi?.didirikan
          : "-"
      } `,
    },
    {
      icon: `/img/icon-telepon.svg`,
      iconAlt: `icon-telepon`,
      title: `Nomor Telepon Perusahaan`,
      content: `${
        dataPerusahaan?.informasi?.telepon != null
          ? dataPerusahaan?.informasi?.telepon
          : "-"
      } `,
    },
    {
      icon: `/img/icon-user.svg`,
      iconAlt: `icon-user`,
      title: `Jumlah Pekerja`,
      content: `${
        dataPerusahaan?.informasi?.jumlahPekerja != null
          ? dataPerusahaan?.informasi?.jumlahPekerja
          : "0"
      } Orang `,
    },
    {
      icon: `/img/icon-website.svg`,
      iconAlt: `icon-website`,
      title: `Situs Web`,
      content: `${
        dataPerusahaan?.informasi?.situs != null
          ? dataPerusahaan?.informasi?.situs
          : "-"
      } `,
    },
    {
      icon: `/img/icon-program-istd.svg`,
      iconAlt: `icon-program-istd`,
      title: `Program ISTD`,
      content: `${
        dataPerusahaan?.informasi?.istd == 1 ? "Mengikuti" : "Tidak Mengikuti"
      } `,
    },
    {
      icon: `/img/icon-alamat.svg`,
      iconAlt: `icon-alamat`,
      title: `Alamat Perusahaan`,
      content: `${
        dataPerusahaan?.informasi?.alamat != null
          ? dataPerusahaan?.informasi?.alamat
          : "-"
      } `,
      isAlamat: true,
    },
  ];

  return (
    <>
      <div className="card card-ss">
        <div className="card-body p-4 pb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold color-dark mb-0">
              Informasi Perusahaan
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
                data-bs-target="#modalInformasiPerusahaan"
                onClick={() => setEditData(dataPerusahaan)}
              >
                <FaPen className="color-secondary fs-5" />
              </button>
            )}
          </div>
          <div className="row g-4">
            {informasiPerusahaan?.map((d) => {
              return (
                <div className="col-md-6">
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
        editData={editData}
        id={id}
        _getDetailPerusahaan={_getDetailPerusahaan}
      />
    </>
  );
};

export default SectionInformasiPerusahaan;
