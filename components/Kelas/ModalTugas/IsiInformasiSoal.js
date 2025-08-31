import { FaTasks } from "react-icons/fa";
import useBuatTugas from "../../../hooks/useBuatTugas";
import Editor from "../../Shared/Editor/Editor";
import SelectShared from "../../Shared/SelectShared/SelectShared";
import useSekolah from "hooks/useSekolah";

const IsiInformasiSoal = ({ detailRombel }) => {
  const { stateBuatTugas, changeStateBuatTugas } = useBuatTugas();

  const listBab = detailRombel?.analisisMateri?.materi?.bab;
  const babOption = listBab?.map((bab, index) => ({
    value: bab,
    label: `Bab ${index + 1} - ${bab?.judul}`,
  }));

  const changePilihanMateri = (e, materi) => {
    if (e.target.checked) {
      changeStateBuatTugas("materi", [...stateBuatTugas?.materi, materi?.id]);
    } else {
      changeStateBuatTugas(
        "materi",
        stateBuatTugas?.materi?.filter((id) => id !== materi?.id)
      );
    }
  };

  const changeBab = (e) => {
    if (e.value === stateBuatTugas.bab) return;

    changeStateBuatTugas("bab", e.value);
    changeStateBuatTugas("materi", []);
  };

  const onClickPilihSemuaMateri = () => {
    if (stateBuatTugas?.bab?.topik?.length > 0) {
      changeStateBuatTugas(
        "materi",
        stateBuatTugas?.bab?.topik?.map((materi) => materi?.id)
      );
    }
  };

  const { sekolah } = useSekolah();

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card card-ss rounded-ss p-4 mb-md-0 mb-4">
          <h4 className="mb-4 fw-extrabold color-dark">Informasi Tugas</h4>
          <div className="mb-4">
            <label className="form-label">Judul</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              name="judul"
              value={stateBuatTugas?.judul}
              onChange={(e) => changeStateBuatTugas("judul", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Instruksi Tugas</label>
            <Editor id={`instruksi-tugas-editor`} defaultValue="" />
          </div>
          <div className="mb-4">
            <h6 className="fs-18-ss fw-bold color-dark mb-3">
              {[9349, 9350].includes(sekolah?.id) ? "Dinilai dengan KKTP" : "Dinilai dengan KKM"}
            </h6>
            <div className="row">
              <div className="form-check-ss col-md-6 position-relative pointer">
                <input
                  className="form-check-input form-check-radio position-absolute pointer"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioDinilaiDenganKKMYes"
                  style={{
                    top: "36%",
                    left: "2em", 
                  }}
                  name="dikkm"
                  checked={stateBuatTugas?.dikkm === true}
                  onChange={() => changeStateBuatTugas("dikkm", true)}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                  htmlFor="radioDinilaiDenganKKMYes"
                >
                  <span className="ms-4 ps-2">Ya</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative pointer">
                <input
                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-circle pointer"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioDinilaiDenganKKMNo"
                  style={{
                    top: "36%",
                    left: "2em",
                    // height: "20px",
                  }}
                  name="diacak"
                  checked={stateBuatTugas?.dikkm === false}
                  onChange={() => {
                    changeStateBuatTugas("dikkm", false),
                      changeStateBuatTugas("kkm", null);
                  }}
                />
                <label
                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                  htmlFor="radioDinilaiDenganKKMNo"
                >
                  <span className="ms-4 ps-2">Tidak</span>
                </label>
              </div>
            </div>
          </div>
          {stateBuatTugas?.dikkm && (
            <div className="mb-4">
              <label htmlFor="example-number-input" className="form-label">
              {[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}
              </label>
              <input
                className="form-control"
                autoComplete="off"
                type="number"
                name="kkm"
                value={stateBuatTugas?.kkm}
                onChange={(e) => changeStateBuatTugas("kkm", e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <h6 className="fs-18-ss fw-bold color-dark mb-3">
              Tampilkan Nilai
            </h6>
            <div className="row">
              <div className="form-check-ss col-md-6 position-relative pointer">
                <input
                  className="form-check-input form-check-radio position-absolute pointer"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioaHideYes"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="showNilai"
                  checked={stateBuatTugas?.showNilai == 1}
                  onChange={() => changeStateBuatTugas("showNilai", 1)}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                  htmlFor="radioaHideYes"
                >
                  <span className="ms-4 ps-2">Ya</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative pointer">
                <input
                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-circle pointer"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioaHideNo"
                  style={{
                    top: "36%",
                    left: "2em",
                    // height: "20px",
                  }}
                  name="diacak"
                  checked={stateBuatTugas?.showNilai == 0}
                  onChange={() => {
                    changeStateBuatTugas("showNilai", 0),
                      changeStateBuatTugas("kkm", null);
                  }}
                />
                <label
                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                  htmlFor="radioaHideNo"
                >
                  <span className="ms-4 ps-2">Tidak</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card card-ss rounded-ss p-4 mb-md-0 mb-4 h-100">
          <h4 className="mb-4 fw-extrabold color-dark">Materi Terkait</h4>
          <div className="mb-4">
            <label className="form-label">Daftar BAB</label>
            <SelectShared
              placeholder="Pilih BAB"
              handleChangeSelect={(e) => changeBab(e)}
              value={stateBuatTugas?.bab}
              options={babOption}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="fs-18-ss fw-bold color-dark mb-0">Daftar Materi</h6>
            <button
              className="btn btn-ss btn-outline-warning btn-outline-warning-ss fw-bold fs-14-ss rounded-pill"
              onClick={onClickPilihSemuaMateri}
            >
              {" "}
              <FaTasks className="mb-1 me-2" /> Pilih Semua
            </button>
          </div>
          {stateBuatTugas?.bab?.topik?.length > 0 &&
            stateBuatTugas?.bab?.topik?.map((materi, index) => (
              <div
                className="kuis-component form-check-ss position-relative mb-3"
                key={`${index}-${new Date().getTime()}`}
              >
                <input
                  className="form-check-input form-check-ambil-soal position-absolute pointer"
                  type="checkbox"
                  id={`checkbox-materi-${materi?.id}`}
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "1em",
                    width: "30px",
                    height: "30px",
                  }}
                  checked={stateBuatTugas?.materi?.includes(materi?.id)}
                  onChange={(e) => changePilihanMateri(e, materi)}
                />
                <label
                  className="kuis-card form-check-label rounded-ss border border-secondary border-light-secondary-ss p-3 w-100 pointer"
                  htmlFor={`checkbox-materi-${materi?.id}`}
                >
                  <div className="d-flex align-items-md-center flex-lg-nowrap flex-md-row flex-column flex-wrap">
                    <div
                      className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fw-extrabold color-dark me-3 p-3"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row flex-grow-1 pe-lg-5">
                      <div className="soal-content p-md-1 p-0 m-md-0 mt-3 mb-4 text-break">
                        <p className="mb-0 color-secondary pe-3 dangerous-html">
                          {materi?.judul}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          <div className="d-flex align-items-end h-100">
            <span className="color-primary px-4 py-1 fs-16-ss fw-bold bg-soft-primary rounded-pill">
              {stateBuatTugas?.materi?.length} Materi Terpilih
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsiInformasiSoal;
