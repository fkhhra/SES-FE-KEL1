import useBuatTugas from "hooks/useBuatTugas";
import { FaPlus } from "react-icons/fa";
import Tabs from "../../Shared/Tabs/Tabs";
import ModalSoalEsai from "../ModalSoalEsai";
import ModalSoalPilihanGanda from "../ModalSoalPilihanGanda";
import CardSoal from "./CardSoal";

const Soal = () => {
  const { stateBuatTugas } = useBuatTugas();
  const soalPilihanGanda =
    stateBuatTugas?.soal?.length > 0
      ? stateBuatTugas?.soal?.filter(({ bentuk }) => bentuk == "pg")
      : [];
  const soalEsai =
    stateBuatTugas?.soal?.length > 0
      ? stateBuatTugas?.soal?.filter(({ bentuk }) => bentuk == "esai")
      : [];

  return (
    <div className="row">
      <div className="card card-ss rounded-ss p-4 card-content-lampiran-tugas">
        <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
          <h4 className="color-dark fw-bold mb-sm-0 mb-3">Soal</h4>

          <div className="d-flex align-items-sm-center flex-sm-row flex-column">
            <div className="dropdown dropdown-ss d-flex align-items-sm-center flex-sm-row flex-column mb-sm-0 mb-3">
              <button
                className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill shadow-primary-ss fs-18-ss fw-bold"
                role="button"
                id="dropdownBuatSoalTugasKuis"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaPlus className="me-2" />
                Buat Soal
              </button>
              <ul
                className="dropdown-menu dropdown-menu-ss my-1"
                aria-labelledby="dropdownBuatSoalTugasKuis"
              >
                <li>
                  <a
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#ModalSoalPilihanGanda"
                  >
                    Pilihan Ganda
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#ModalSoalEsai"
                  >
                    Esai
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Tabs
          navItems={[
            {
              id: "pilihan-ganda",
              nav: "Pilihan Ganda",
              active: true,
              content: (
                <div className="kuis-component">
                  {soalPilihanGanda?.length > 0
                    ? soalPilihanGanda?.map((soal, index) => (
                        <CardSoal
                          soal={soal}
                          index={index}
                          key={`${index}-${new Date().getTime()}`}
                        />
                      ))
                    : "Belum ada data"}
                </div>
              ),
            },
            {
              id: "esai",
              nav: "Esai",
              active: false,
              content: (
                <div className="kuis-component">
                  {soalEsai?.length > 0
                    ? soalEsai?.map((soal, index) => (
                        <CardSoal
                          soal={soal}
                          index={index}
                          key={`${index}-${new Date().getTime()}`}
                        />
                      ))
                    : "Belum ada data"}
                </div>
              ),
            },
          ]}
        />
      </div>

      <ModalSoalPilihanGanda />
      <ModalSoalEsai />
    </div>
  );
};

export default Soal;
