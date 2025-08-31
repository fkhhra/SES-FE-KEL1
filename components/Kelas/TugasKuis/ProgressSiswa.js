import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { hitungNilaiUjian, momentPackage } from "utilities/HelperUtils";
import Avatar from "components/Shared/Avatar/Avatar";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";
import useTugasSiswa from "hooks/useTugasSiswa";
import { showModal } from "utilities/ModalUtils";
import ModalNilaiTugasKuis from "../ModalNilaiTugasKuis";
import { useEffect } from "react";

const ProgressSiswa = ({
  detailData,
  isTugasKuis = false,
  _getDetailTimeline,
}) => {
  const { setTugasSiswa } = useTugasSiswa();

  const [dikumpul, setDikumpul] = useState([]);
  const [dinilai, setDinilai] = useState([]);

  const onClickNilaiTugas = (data) => {
    setTugasSiswa(data);
    isTugasKuis
      ? showModal("modalNilaiTugasKuis")
      : showModal("modalNilaiTugas");
  };

  useEffect(() => {
    if (isTugasKuis) {
      const temp = [
        ...detailData?.listSiswaDinilai,
        ...detailData?.listSiswaTerkumpul,
      ];

      const checkEsai = detailData?.tugas?.soal?.some(
        (d) => d.soal.bentuk == "esai"
      );
      if (checkEsai) {
        const terkumpul = [];
        const ternilai = [];
        temp.map((d) => {
          const check = d?.peserta[d?.peserta?.length - 1]?.jawabanSiswa?.some(
            (d) => {
              if (d.soal.bentuk == "esai" && !d.dinilai) {
                return 1;
              } else {
                return 0;
              }
            }
          );
          if (check) {
            terkumpul.push(d);
          } else {
            ternilai.push(d);
          }
        });
        setDinilai([...ternilai]);
        setDikumpul([...terkumpul]);
      } else {
        setDinilai([...temp]);
        setDikumpul([]);
      }
    } else {
      setDinilai([...detailData?.listSiswaDinilai]);
      setDikumpul([...detailData?.listSiswaTerkumpul]);
    }
  }, [isTugasKuis, detailData]);

  return (
    <div className="row mt-4">
      <div className="d-flex flex-column flex-md-row nav-side-tab-ss">
        <div className="col-md-3">
          <div
            className="nav flex-column nav-pills me-md-3 mb-3 mb-md-0 border border-light-secodary-ss rounded-ss p-2"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <a
              className="nav-link active rounded-ss p-2"
              id="siswa-belum-tab"
              data-bs-toggle="pill"
              href="#siswa-belum"
              role="tab"
              aria-controls="siswa-belum"
              aria-selected="true"
              data-joyride="tugas-belum"
            >
              <p className="fs-14-ss mb-2 nav-side-tab-color-secondary">
                Belum
              </p>
              <p className="fs-18-ss fw-bold mb-0 nav-side-tab-color-dark">
                {detailData?.listSiswaBelum?.length} Siswa
              </p>
            </a>
            <a
              className="nav-link rounded-ss p-2 pe-5"
              id="siswa-terkumpul-tab"
              data-bs-toggle="pill"
              href="#siswa-terkumpul"
              role="tab"
              aria-controls="siswa-terkumpul"
              aria-selected="true"
              data-joyride="tugas-terkumpul"
            >
              <p className="fs-14-ss mb-2 nav-side-tab-color-secondary">
                Terkumpul
              </p>
              <p className="fs-18-ss fw-bold mb-0 nav-side-tab-color-dark">
                {dikumpul?.length} Siswa
              </p>
            </a>
            <a
              className="nav-link rounded-ss p-2 pe-5"
              id="siswa-dinilai-tab"
              data-bs-toggle="pill"
              href="#siswa-dinilai"
              role="tab"
              aria-controls="siswa-dinilai"
              aria-selected="true"
              data-joyride="tugas-dinilai"
            >
              <p className="fs-14-ss mb-2 nav-side-tab-color-secondary">
                Dinilai
              </p>
              <p className="fs-18-ss fw-bold mb-0 nav-side-tab-color-dark">
                {dinilai?.length} Siswa
              </p>
            </a>
          </div>
        </div>
        <div className="col-md-9">
          <div className="tab-content" id="v-pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="siswa-belum"
              role="tabpanel"
              aria-labelledby="siswa-belum-tab"
            >
              <div className="d-flex justify-content-between flex-column flex-md-row align-items-center mb-4">
                <h4 className="color-dark fw-bold m-0 mb-md-0 mb-3">
                  Daftar Tugas Belum Selesai
                </h4>
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss"
                  id="exampleFormControlInput1"
                  placeholder="Cari Nama Siswa"
                />
              </div>
              <ul className="list-absen-kelas list-group list-group-flush">
                {detailData?.listSiswaBelum?.map((d, idx) => {
                  return (
                    <li
                      className="list-group-item"
                      key={`${idx}-${new Date().getTime()}`}
                    >
                      <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column flex-wrap">
                        <div className="list-group-member d-flex align-items-center mb-3 mb-md-0">
                          <Avatar
                            name={d?.user?.nama}
                            src={d?.user?.avatar}
                            size={45}
                          />
                          <p className="m-0 ms-4 fw-semibold color-secondary">
                            {d.user?.nama}
                          </p>
                        </div>
                        {d.dikembalikan == 1 && (
                          <div className="list-group-info d-flex justify-content-end justify-content-md-start align-items-center">
                            <div className="btn-ss bg-light-primary color-primary rounded-pill d-flex justify-content-center align-items-center">
                              Dikembalikan
                            </div>
                          </div>
                        )}
                        <div className="list-group-info d-flex justify-content-end justify-content-md-start align-items-center">
                          <WhatsappLink
                            phoneNumber={d.user?.whatsapp}
                            text="Halo nak"
                          >
                            <div
                              className="rounded-circle shadow-success-ss"
                              style={{ width: "45px", height: "45px" }}
                            >
                              <img
                                src={`/img/whatsapp.svg`}
                                width={45}
                                height={45}
                              />
                            </div>
                          </WhatsappLink>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className="tab-pane fade"
              id="siswa-terkumpul"
              role="tabpanel"
              aria-labelledby="siswa-terkumpul-tab"
            >
              <div className="d-flex justify-content-between flex-column flex-md-row align-items-center mb-4">
                <h4 className="color-dark fw-bold m-0 mb-md-0 mb-3">
                  Daftar Tugas Terkumpul
                </h4>
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss"
                  id="exampleFormControlInput1"
                  placeholder="Cari Nama Siswa"
                />
              </div>
              <ul className="list-absen-kelas list-group list-group-flush">
                {dikumpul?.map((d, idx) => {
                  const nilai = isTugasKuis
                    ? hitungNilaiUjian(
                        d?.peserta[d?.peserta?.length - 1]?.jawabanSiswa || "[]"
                      )
                    : d.nilai;
                  return (
                    <li
                      className="list-group-item"
                      key={`${idx}-${new Date().getTime()}`}
                    >
                      <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column flex-wrap">
                        <div className="list-group-member d-flex align-items-center mb-3 mb-md-0">
                          <Avatar
                            name={d?.user?.nama}
                            src={d?.user?.avatar}
                            size={45}
                          />
                          <p className="m-0 ms-4 fw-semibold color-secondary">
                            {d.user?.nama}
                          </p>
                        </div>
                        <div className="list-group-info d-flex justify-content-end justify-content-md-start align-items-center">
                          {momentPackage(d.waktuPengumpulan).format(
                            "YYYY-MM-DD HH:mm:ss"
                          ) >=
                            momentPackage(d.tugas?.tanggalPengumpulan).format(
                              "YYYY-MM-DD HH:mm:ss"
                            ) && (
                            <div className="btn-ss bg-soft-danger color-danger rounded-pill d-flex justify-content-center align-items-center">
                              Terlambat
                            </div>
                          )}

                          {d.dikembalikan == 1 && (
                            <div className="btn-ss bg-light-primary color-primary rounded-pill d-flex justify-content-center align-items-center">
                              Dikembalikan
                            </div>
                          )}

                          {nilai > 0 && (
                            <div className="label-ss bg-soft-success color-success rounded-pill d-flex justify-content-center align-items-center me-3 fw-bold">
                              {nilai}
                            </div>
                          )}

                          <button
                            className="btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill d-flex justify-content-center align-items-center ms-3 px-4 py-1"
                            onClick={() => onClickNilaiTugas(d)}
                          >
                            Nilai Tugas
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className="tab-pane fade"
              id="siswa-dinilai"
              role="tabpanel"
              aria-labelledby="siswa-dinilai-tab"
            >
              <div className="d-flex justify-content-between flex-column flex-md-row align-items-center mb-4">
                <h4 className="color-dark fw-bold m-0 mb-md-0 mb-3">
                  Daftar Tugas Dinilai
                </h4>
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss"
                  id="exampleFormControlInput1"
                  placeholder="Cari Nama Siswa"
                />
              </div>
              <ul className="list-absen-kelas list-group list-group-flush">
                {dinilai?.map((d, idx) => {
                  const nilai = isTugasKuis
                    ? hitungNilaiUjian(
                        d?.peserta[d?.peserta?.length - 1]?.jawabanSiswa || "[]"
                      )
                    : d.nilai;
                  return (
                    <li
                      className="list-group-item"
                      key={`${idx}-${new Date().getTime()}`}
                    >
                      <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column flex-wrap">
                        <div className="list-group-member d-flex align-items-center mb-3 mb-md-0">
                          <Avatar
                            name={d?.user?.nama}
                            src={d?.user?.avatar}
                            size={45}
                          />
                          <p className="m-0 ms-4 fw-semibold color-secondary">
                            {d.user?.nama}
                          </p>
                        </div>
                        <div className="list-group-info d-flex justify-content-end justify-content-md-start align-items-center">
                          <div className="label-ss bg-soft-success color-success rounded-pill d-flex justify-content-center align-items-center me-3 fw-bold">
                            {nilai}
                          </div>

                          {!isTugasKuis ? (
                            <button
                              className="btn btn-link btn-secondary-ss border-0 bg-soft-primary color-secondary rounded-circle d-flex justify-content-center align-items-center p-2"
                              onClick={() => onClickNilaiTugas(d)}
                            >
                              <FaPen />
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill d-flex justify-content-center align-items-center ms-3 px-4 py-1"
                              onClick={() => onClickNilaiTugas(d)}
                            >
                              Detail
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12"></div>
      <ModalNilaiTugasKuis
        _getDetailTimeline={_getDetailTimeline}
        detailData={detailData}
        listSiswaTerkumpul={[...dinilai, ...dikumpul]}
      />
    </div>
  );
};

export default ProgressSiswa;
