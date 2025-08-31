import { useState } from "react";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import ModalEditBio from "../Profil/ModalEditBio";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import { getFileName, getPreviewURL } from "utilities/FileViewer";

const SectionBerkas = ({ isReadOnly = false, data, dataBerkasAlumni }) => {
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
            <h4 className="fw-extrabold color-dark mb-0">Berkas</h4>
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
          <div className="row g-4">
            {dataBerkasAlumni?.status == "kuliah" ? (
              <>
                {" "}
                <div className="col-md-12">
                  <h6 className="fw-bold color-dark mb-2">
                    Kartu Tanda Mahasiswa
                  </h6>
                  <FileAttachment
                    nama={getFileName(dataBerkasAlumni?.kartuMahasiswa)}
                    href={getPreviewURL(dataBerkasAlumni?.kartuMahasiswa)}
                  />
                </div>
              </>
            ) : dataBerkasAlumni?.status == "bekerja" ? (
              <>
                {" "}
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">Kontrak</h6>
                  <FileAttachment
                    nama={getFileName(dataBerkasAlumni?.kontrak)}
                    href={getPreviewURL(dataBerkasAlumni?.kontrak)}
                  />
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold color-dark mb-2">ID Card</h6>
                  <FileAttachment
                    nama={getFileName(dataBerkasAlumni?.idCard)}
                    href={getPreviewURL(dataBerkasAlumni?.idCard)}
                  />
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

export default SectionBerkas;
