import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { momentPackage, optionBulan } from "utilities/HelperUtils";

import useEditModal from "hooks/useEditModal";
import useUser from "hooks/useUser";
import KegiatanKelasItem from "./KegiatanKelasItem";
import AnimateHeight from "react-animate-height";
import { showModal } from "utilities/ModalUtils";

const CardKegiatan = ({
  tanggalKegiatan,
  kegiatan,
  id,
  getDetailRombelData,
  setModalTugasType,
  isCardOpen,
  newFormatTanggal,
  nav,
}) => {
  const { user } = useUser();

  const { setEditModal } = useEditModal();
  const [height, setHeight] = useState(isCardOpen ? "auto" : 0);

  const isGuru = user?.role === "guru";

  const data = kegiatan[tanggalKegiatan];
  const isSudahBacaSemuaMateri = !data?.materi
    ? true
    : data?.materi?.filter((materi) => materi?.meta?.totalKesimpulan === 0)
        ?.length === 0;

  return (
    <div className="col-lg-10">
      <div className="card card-ss px-4 py-0">
        <div className="py-4 d-flex align-items-center flex-sm-row flex-column">
          <div
            className="rounded-circle shadow-primary-ss me-sm-4 mb-sm-0 mb-3"
            style={{ width: "50px", height: "50px" }}
          >
            <img src="/img/icon-kegiatan.svg" alt="icon-kegiatan" />
          </div>
          <div className="d-flex align-items-center justify-content-between w-100">
            <h5 className="fw-extrabold color-dark mb-0">
              Kegiatan - {tanggalKegiatan}
            </h5>
            <div className="d-sm-block d-none">
              <span
                className={`me-2 rounded-pill fs-12-ss fw-bold label-ss label-light-primary-ss`}
              >
                {(data?.materi?.length || 0) +
                  (data?.tatapMaya?.length || 0) +
                  (data?.tugas?.length || 0) +
                  (data?.tugasKuis?.length || 0)}
              </span>
              <img
                onClick={() => setHeight(height === 0 ? "auto" : 0)}
                src="/img/chevron-bottom.svg"
                className={`pointer ${height != 0 ? "rotate-180" : ""}`}
                style={{ transition: "0.3s" }}
              />
            </div>
          </div>
        </div>

        <AnimateHeight height={height}>
          {/* Tatap Maya */}
          {data?.tatapMaya?.length > 0 &&
            data?.tatapMaya?.map((dt) => (
              <KegiatanKelasItem
                id={id}
                type="tatap-maya"
                isGuru={isGuru}
                key={dt?.id}
                data={dt}
                getDetailRombelData={getDetailRombelData}
              />
            ))}

          {/* Materi */}
          {data?.materi?.length > 0 &&
            data?.materi?.map((dt) => (
              <KegiatanKelasItem
                id={id}
                type="materi"
                isGuru={isGuru}
                key={dt?.id}
                data={dt}
                getDetailRombelData={getDetailRombelData}
              />
            ))}

          {/* Tugas */}
          {data?.tugas?.length > 0 &&
            data?.tugas?.map((dt) => (
              <KegiatanKelasItem
                id={id}
                type="tugas"
                isGuru={isGuru}
                key={dt?.id}
                data={dt}
                getDetailRombelData={getDetailRombelData}
                setModalTugasType={setModalTugasType}
                disabled={isGuru ? false : !isSudahBacaSemuaMateri}
              />
            ))}

          {/* Tugas Kuis */}
          {data?.tugasKuis?.length > 0 &&
            data?.tugasKuis?.map((dt) => (
              <KegiatanKelasItem
                id={id}
                type="tugas-kuis"
                isGuru={isGuru}
                key={dt?.id}
                data={dt}
                getDetailRombelData={getDetailRombelData}
                setModalTugasType={setModalTugasType}
                disabled={isGuru ? false : !isSudahBacaSemuaMateri}
              />
            ))}

          {isCardOpen && nav == "berlangsung" && (
            <div className="dropdown dropdown-ss d-flex flex-column">
              {user?.role == "guru" && (
                <button
                  className="btn-tambah-kegiatan-item rounded-ss p-4 d-flex align-items-center justify-content-center color-primary fs-18-ss fw-semibold text-decoration-none mb-4"
                  style={{ minHeight: "84px" }}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaPlus className="me-2" /> Tambah
                </button>
              )}
              <ul
                className="dropdown-menu dropdown-menu-ss my-1 w-100"
                aria-labelledby="dropdownMenuLink"
              >
                <li
                  onClick={() => {
                    setEditModal("ModalBuatPertemuan", null);
                    showModal("ModalBuatPertemuan");
                  }}
                >
                  <a className="dropdown-item pointer d-flex align-items-center">
                    <img
                      src="/img/icon-kegiatan-tatap-maya.svg"
                      alt="icon-kegiatan"
                      className="me-2"
                    />
                    <span className="color-dark fw-semibold">Tatap Maya</span>
                  </a>
                </li>
                <li onClick={() => showModal("ModalBagikanMateri")}>
                  <a className="dropdown-item pointer d-flex align-items-center">
                    <img
                      src="/img/icon-kegiatan-materi.svg"
                      alt="icon-kegiatan"
                      className="me-2"
                    />
                    <span className="color-dark fw-semibold">Materi</span>
                  </a>
                </li>
                <li
                  onClick={() => {
                    setModalTugasType("tugas");
                    showModal("modalBuatTugas");
                  }}
                >
                  <a className="dropdown-item pointer d-flex align-items-center">
                    <img
                      src="/img/icon-kegiatan-tugas.svg"
                      alt="icon-kegiatan"
                      className="me-2"
                    />
                    <span className="color-dark fw-semibold">Tugas</span>
                  </a>
                </li>
                <li
                  onClick={() => {
                    setModalTugasType("kuis");
                    showModal("modalBuatTugas");
                  }}
                >
                  <a className="dropdown-item pointer d-flex align-items-center">
                    <img
                      src="/img/icon-kegiatan-tugas.svg"
                      alt="icon-kegiatan"
                      className="me-2"
                    />
                    <span className="color-dark fw-semibold">Tugas Kuis</span>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </AnimateHeight>
      </div>
    </div>
  );
};

export default CardKegiatan;
