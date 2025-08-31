import { DatePicker, TimePicker, Select } from "antd"
import useBuatTugas from "hooks/useBuatTugas";
import { momentPackage } from "utilities/HelperUtils";

const Pembagian = ({ detailRombel }) => {

  const listKelas = [{ value: detailRombel?.jadwalMengajar?.rombel?.id, label: detailRombel?.jadwalMengajar?.rombel?.nama }]
  let listAnggotaKelas = detailRombel?.jadwalMengajar?.rombel?.anggotaRombel?.map(dt => ({ label: dt?.user?.nama, value: dt?.user?.id }));

  listAnggotaKelas.unshift({
    label: "Pilih Semua",
    value: "pilihSemua"
  });

  const allSiswaId = listAnggotaKelas?.filter(({ value }) => value != "pilihSemua")?.map(({ value }) => value);

  const { stateBuatTugas, changeStateBuatTugas } = useBuatTugas();

  const onChangePilihSiswa = (newValue) => {
    if (newValue && newValue.includes("pilihSemua")) {
      if (newValue.length === allSiswaId.length + 1) {
        changeStateBuatTugas("listAnggota", []);
        return;
      }
      changeStateBuatTugas("listAnggota", allSiswaId);
      return
    }

    changeStateBuatTugas("listAnggota", newValue);
  }

  return (
    <div className="card card-ss rounded-ss p-4 mb-md-0 mb-4">
      <div className="row">
        <h4 className="mb-4 fw-extrabold color-dark">Pembagian</h4>
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label">Batas Pengumpulan</label>

            <div className="row mb-4 gy-3">
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="checkbox"
                  name="batasPengumpulan"
                  id="batasPengumpulanYa"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  checked={stateBuatTugas?.dikumpulkan == true}
                  onChange={() => changeStateBuatTugas("dikumpulkan", true)}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="batasPengumpulanYa"
                >
                  <span className="ms-4 ps-2">Ya</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                  type="radio"
                  name="batasPengumpulan"
                  id="batasPengumpulanTidak"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  checked={stateBuatTugas?.dikumpulkan == false}
                  onChange={() => changeStateBuatTugas("dikumpulkan", false)}
                />
                <label
                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="batasPengumpulanTidak"
                >
                  <span className="ms-4 ps-2">Tidak</span>
                </label>
              </div>
            </div>
          { stateBuatTugas?.dikumpulkan && (
            <div className="row mb-4 gy-3">
              <label className="form-label">
                Waktu Pengumpulan
              </label>

              <div className="col-md-6 mb-3 mt-md-0 mb-md-0">
                <DatePicker
                  onChange={(date, dateString) => changeStateBuatTugas("tanggalPengumpulan", date)}
                  placeholder="Pilih Tanggal"
                  className="form-control"
                  autoComplete="off"
                  value={stateBuatTugas?.tanggalPengumpulan ? momentPackage(stateBuatTugas?.tanggalPengumpulan) : ""}
                  format="DD-MM-YYYY"
                />
              </div>
              <div className="col-md-6 mt-0">
                <TimePicker
                  format="HH:mm"
                  onChange={(date, dateString) => changeStateBuatTugas("waktuPengumpulan", momentPackage(date, "HH:mm"))}
                  className="form-control"
                  autoComplete="off"
                  placeholder="--:--"
                  value={stateBuatTugas?.waktuPengumpulan ? momentPackage(stateBuatTugas?.waktuPengumpulan, "HH:mm") : ""}
                />
              </div>
            </div>
          )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label">Jadwal Pembagian</label>

            <div className="row mb-4 gy-3">
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  name="jadwalPembagian"
                  id="jadwalPembagianYa"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  checked={stateBuatTugas?.dijadwalkan == true}
                  onChange={() => changeStateBuatTugas("dijadwalkan", true)}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="jadwalPembagianYa"
                >
                  <span className="ms-4 ps-2">Ya</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                  type="radio"
                  name="jadwalPembagian"
                  id="jadwalPembagianTidak"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  checked={stateBuatTugas?.dijadwalkan == false}
                  onChange={() => changeStateBuatTugas("dijadwalkan", false)}
                />
                <label
                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="jadwalPembagianTidak"
                >
                  <span className="ms-4 ps-2">Tidak</span>
                </label>
              </div>
            </div>
            { stateBuatTugas?.dijadwalkan && (
              <div className="row mb-4 gy-3">
                <label className="form-label">Waktu Pembagian</label>
                <div className="col-md-6 mt-0 mb-3 mt-md-0 mb-md-0">
                  <DatePicker
                    onChange={(date, dateString) => changeStateBuatTugas("tanggalPembagian", date)}
                    placeholder="Pilih Tanggal"
                    className="form-control"
                    autoComplete="off"
                    value={stateBuatTugas?.tanggalPembagian ? momentPackage(stateBuatTugas?.tanggalPembagian) : ""}
                    format="DD-MM-YYYY"
                  />
                </div>
                <div className="col-md-6 mt-0 ">
                  <label
                    htmlFor="example-date-input"
                    className="form-label"
                  ></label>
                  <TimePicker
                    format="HH:mm"
                    onChange={(date, dateString) => changeStateBuatTugas("waktuPembagian", momentPackage(date, "HH:mm"))}
                    className="form-control"
                    autoComplete="off"
                    placeholder="--:--"
                    value={stateBuatTugas?.waktuPembagian ? momentPackage(stateBuatTugas?.waktuPembagian, "HH:mm") : ""}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <label className="form-label">Bagikan Untuk</label>
        <div className="col-md-6 mb-md-0 mb-2">
          <Select
            // disabled={editId}
            mode="multiple"
            value={stateBuatTugas?.listRombel}
            options={listKelas}
            onChange={(newValue) => changeStateBuatTugas("listRombel", newValue)}
            placeholder="Pilih Kelas.."
            style={{ width: "100%" }}
            maxTagCount="responsive"
          />
        </div>
        <div className="col-md-6">
          <Select
            mode="multiple"
            value={stateBuatTugas?.listAnggota}
            options={listAnggotaKelas}
            placeholder="Pilih Siswa.."
            style={{ width: "100%" }}
            onChange={onChangePilihSiswa}
            disabled={stateBuatTugas?.listRombel?.length === 0}
            maxTagCount="responsive"
          />
        </div>
      </div>
    </div>
  )
}

export default Pembagian;