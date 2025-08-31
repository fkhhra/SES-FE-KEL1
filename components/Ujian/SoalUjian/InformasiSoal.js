import useUjian from "hooks/useUjian";
import React from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

export const InformasiSoalUjian = ({
  handleChangeForm,
  formData,
  setFormData,
  sekolah,
}) => {
  const { detailUjianData } = useUjian();

  const {
    levelKognitif,
    bentukSoal,
    ujian,
    kontenMateri,
    konteksMateri,
    prosesKognitif,
  } = detailUjianData;
  return (
    <>
      {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi" ? (
        <>
          <div className="mt-4 mb-3">
            <label className="form-label">
              Nomor Kompetensi Dasar / Capaian Pembelajaran / Elemen
            </label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              placeholder="Contoh: 3.1"
              name="kd"
              value={formData.kd}
              onChange={(e) =>
                e.target.value.length > 4
                  ? toast.error(
                      "Hanya dapat memasukkan nomor kompetensi dasar / Capaian Pembelajaran / elemen"
                    )
                  : handleChangeForm(e)
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Isi Kompetensi Dasar / Isi Capaian Pembelajaran / Elemen
            </label>
            <TextareaAutosize
              className="form-control"
              autoComplete="off"
              style={{
                resize: "none",
                width: "100%",
              }}
              placeholder="Contoh: Siswa dapat memahami tentang aljabar"
              minRows={3}
              name="kdKontenMateri"
              value={formData.kdKontenMateri}
              onChange={handleChangeForm}
            />
          </div>
          {
            <>
              <div className="mb-3">
                <label className="form-label">
                  Indikator Pencapaian Kompetensi (Opsional)
                </label>
                <TextareaAutosize
                  className="form-control"
                  autoComplete="off"
                  style={{
                    resize: "none",
                    width: "100%",
                  }}
                  placeholder="Masukkan indikator pencapaian kompetensi"
                  minRows={3}
                  name="akmKonteksMateri"
                  value={formData.akmKonteksMateri}
                  onChange={handleChangeForm}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Indikator Soal (Opsional)</label>
                <TextareaAutosize
                  className="form-control"
                  autoComplete="off"
                  style={{
                    resize: "none",
                    width: "100%",
                  }}
                  placeholder="Masukkan indikator soal"
                  minRows={3}
                  name="akmKontenMateri"
                  value={formData.akmKontenMateri}
                  onChange={handleChangeForm}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Lingkup Materi (Opsional)</label>
                <TextareaAutosize
                  className="form-control"
                  autoComplete="off"
                  style={{
                    resize: "none",
                    width: "100%",
                  }}
                  placeholder="Masukkan lingkup materi"
                  minRows={3}
                  name="akmProsesKognitif"
                  value={formData.akmProsesKognitif}
                  onChange={handleChangeForm}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Tingkat Kesukaran (Opsional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  placeholder="Masukkan kesukaran"
                  name="tingkatKesukaran"
                  value={formData.tingkatKesukaran}
                  onChange={handleChangeForm}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Sumber Buku (Opsional)</label>
                <TextareaAutosize
                  className="form-control"
                  autoComplete="off"
                  style={{
                    resize: "none",
                    width: "100%",
                  }}
                  placeholder="Masukkan sumber buku"
                  minRows={3}
                  name="sumberBuku"
                  value={formData.sumberBuku}
                  onChange={handleChangeForm}
                />
              </div>
            </>
          }
          <div className="mb-3">
            <label className="form-label">Level Kognitif</label>
            <select
              className="form-select"
              aria-label="Default select example"
              placeholder="Pilih level kognitif"
              name="levelKognitif"
              value={formData.levelKognitif}
              onChange={handleChangeForm}
            >
              <option hidden>Pilih level kognitif</option>
              {levelKognitif?.map((d) => {
                return (
                  <option value={d?.value}>
                    {d?.label} - {d?.value}{" "}
                  </option>
                );
              })}
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label">Konten Materi</label>
            <select
              className="form-select"
              aria-label="Default select example"
              placeholder="Pilih konten materi"
              name="akmKontenMateri"
              value={formData.akmKontenMateri}
              onChange={handleChangeForm}
            >
              <option hidden>Pilih Konten Materi</option>
              {kontenMateri?.map((kontenM) => (
                <option value={kontenM.value}>{kontenM.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Konteks Materi</label>
            <select
              className="form-select"
              aria-label="Default select example"
              placeholder="Pilih konteks materi"
              name="akmKonteksMateri"
              value={formData.akmKonteksMateri}
              onChange={handleChangeForm}
            >
              <option hidden>Pilih Konteks Materi</option>
              {konteksMateri?.map((konteksM) => (
                <option value={konteksM.value}>{konteksM.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Proses Kognitif</label>
            <select
              className="form-select"
              aria-label="Default select example"
              placeholder="Pilih Proses Kognitif"
              name="akmProsesKognitif"
              value={formData.akmProsesKognitif}
              onChange={handleChangeForm}
            >
              <option hidden>Pilih Proses Kognitif</option>
              {prosesKognitif?.map((prosesKog) => (
                <option value={prosesKog.value}>{prosesKog.label}</option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="mb-3">
        <label className="form-label">Bentuk Soal</label>
        <select
          className="form-select"
          aria-label="Default select example"
          placeholder="Pilih bentuk soal"
          name="bentuk"
          value={formData.bentuk}
          onChange={handleChangeForm}
        >
          <option hidden>Pilih bentuk soal</option>
          {bentukSoal?.map((soal) => (
            <option value={soal?.value}>{soal?.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <h6 className="fs-18-ss fw-bold color-dark mb-3">Ada Soal Audio ?</h6>
        <div className="row">
          <div className="form-check-ss col-md-6 position-relative">
            <input
              className="form-check-input form-check-radio position-absolute"
              type="radio"
              name="flexRadioDefault"
              id="radioYa"
              style={{
                top: "36%",
                left: "2em",
              }}
              checked={formData?.radioYa}
              defaultChecked={false}
              onChange={(e) => setFormData({ ...formData, radioYa: true })}
            />
            <label
              className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
              htmlFor="radioYa"
            >
              <span className="ms-4 ps-2">Ya</span>
            </label>
          </div>
          <div className="form-check-ss col-md-6 position-relative">
            <input
              className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
              type="radio"
              name="flexRadioDefault"
              id="radioTidak"
              style={{
                top: "36%",
                left: "2em",
                // height: "20px",
              }}
              checked={!formData?.radioYa}
              defaultChecked={false}
              onChange={(e) => setFormData({ ...formData, radioYa: false })}
            />
            <label
              className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
              htmlFor="radioTidak"
            >
              <span className="ms-4 ps-2">Tidak</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
