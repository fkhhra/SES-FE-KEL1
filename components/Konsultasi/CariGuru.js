import { useEffect, useState } from "react";
import { getKonsultasi } from "../../client/KonsultasiClient";
import { getMataPelajaran } from "../../client/MataPelajaranClient";
import AnimatePage from "../Shared/AnimatePage/AnimatePage";
import Avatar from "../Shared/Avatar/Avatar";
import ModalAjukanPertemuan from "./ModalAjukanPertemuan";

const CariGuru = () => {
  const [listGuru, setListGuru] = useState([]);
  const [selectedGuru, setSelectedGuru] = useState(null);

  const _getListGuru = async () => {
    const { data } = await getKonsultasi({ tipe: "cari" });
    if (data) {
      setListGuru(data?.mataPelajaran);
    }
  };

  useEffect(() => {
    _getListGuru();
  }, []);

  return (
    <div className="col-md-12 col-lg-9">
      <AnimatePage>
        <div
          style={{
            background: "url(/img/banner-konsultasi.svg)",
            height: 176,
            backgroundSize: "cover",
            padding: 24,
            borderRadius: 10,
            overflow: "hidden",
          }}
          className="mb-5"
        >
          <h3 className="color-dark fw-extrabold">Cari Guru BK</h3>
          <p className="color-secondary">
            Temukan guru BK untuk berkonsultasi dengan Anda
          </p>
        </div>

        {listGuru?.length > 0
          ? listGuru.map((guru, index) => (
              <div
                className="bg-white rounded-ss shadow-dark-ss mb-3"
                style={{ padding: 24 }}
                key={`${index}-${new Date().getTime()}`}
              >
                <div className="d-flex align-items-center">
                  <Avatar size={70} name={guru?.user?.nama} />
                  <div style={{ marginLeft: 32 }} className="w-100">
                    <div className="d-flex align-items-center mb-2">
                      <h5 className="color-dark fw-extrabold mb-0 me-5">
                        {guru?.user?.nama}
                      </h5>
                      <div className="d-flex align-items-center">
                        <div
                          style={{ width: 10, height: 10 }}
                          className={`${
                            true ? "bg-success" : "bg-danger"
                          } rounded me-2`}
                        />
                        {true ? (
                          <p className="color-success mb-0">Online</p>
                        ) : (
                          <p className="color-danger mb-0">Offline</p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <img
                          src="/img/user-solid-grey.svg"
                          className="me-2"
                          style={{ width: 14, height: 14 }}
                        />
                        <p className="color-secondary mb-0">
                          {`${guru?.user?.meta?.total} Siswa sedang Konsultasi`}
                        </p>
                      </div>
                      {true ? (
                        <button
                          className="btn btn-primary-ss rounded-pill px-3 py-1 text-decoration-none fs-12-ss"
                          data-bs-toggle="modal"
                          data-bs-target="#modalAjukanPertemuan"
                          onClick={() => setSelectedGuru(guru)}
                        >
                          Ajukan Pertemuan
                        </button>
                      ) : (
                        <button className="btn btn-outline-primary btn-outline-primary-ss rounded-pill fs-12-ss fw-bolder py-1 px-3">
                          Detail Pertemuan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          : "Belum ada data"}
      </AnimatePage>

      <ModalAjukanPertemuan selectedGuru={selectedGuru} />
    </div>
  );
};

export default CariGuru;
