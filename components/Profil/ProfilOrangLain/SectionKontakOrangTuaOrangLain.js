import { FaPen } from "react-icons/fa";

import useUser from "hooks/useUser";
import ModalEditKontakOrangTua from "./ModalEditKontakOrangTua";

const SectionKontakOrangTuaOrangLain = ({ id, data }) => {
  const { user } = data || useUser();

  return (
    <>
      <div className="card card-ss">
        <div className="card-body py-4 px-0">
          <div className="d-flex justify-content-between align-items-center mb-4 mx-4">
            <h4 className="fw-extrabold color-dark mb-0 ">
              Informasi Keluarga
            </h4>
            <button
              type="button"
              className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
              style={{
                width: "40px",
                height: "40px",
              }}
              data-bs-toggle="modal"
              data-bs-target="#modalEditKontakOrangTua"
              // onClick={() => onClickEdit(slider)}
              // data-joyride="edit-slider"
            >
              <FaPen className="color-secondary fs-5" />
            </button>
          </div>
          <ul className="list-group list-group-flush mx-4">
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Status dalam Keluarga</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.statusKeluarga}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Anak ke</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.anakKe}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nomor Telepon Rumah</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.telpRumah}
              </p>
            </li>
          </ul>
          <div
            className="w-100 py-3 px-4 mb-4"
            style={{ background: "#F0F0F1" }}
          >
            <h5 className="fs-18-ss fw-bold color-dark mb-0">Informasi Ibu</h5>
          </div>
          <ul className="list-group list-group-flush mx-4">
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nama Ibu</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.namaIbu || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nomer Whatsapp Ibu</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.telpIbu || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Pekerjaan Ibu</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.pekerjaanIbu || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Alamat Ibu</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.alamatIbu || "-"}
              </p>
            </li>
          </ul>
          <div
            className="w-100 py-3 px-4 mb-4"
            style={{ background: "#F0F0F1" }}
          >
            <h5 className="fs-18-ss fw-bold color-dark mb-0">Informasi Ayah</h5>
          </div>
          <ul className="list-group list-group-flush mx-4">
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nama Ayah</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.namaAyah || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nomer Whatsapp Ayah</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.telpAyah || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Pekerjaan Ayah</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.pekerjaanAyah || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Alamat Ayah</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.alamatAyah || "-"}
              </p>
            </li>
          </ul>
          <div
            className="w-100 py-3 px-4 mb-4"
            style={{ background: "#F0F0F1" }}
          >
            <h5 className="fs-18-ss fw-bold color-dark mb-0">Informasi Wali</h5>
          </div>
          <ul className="list-group list-group-flush mx-4">
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nama Wali</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.namaWali || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nomer Whatsapp Wali</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.telpWali || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Pekerjaan Wali</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.pekerjaanWali || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Alamat Wali</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.profil?.alamatWali || "-"}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <ModalEditKontakOrangTua id={id} data={data} />
    </>
  );
};

export default SectionKontakOrangTuaOrangLain;
