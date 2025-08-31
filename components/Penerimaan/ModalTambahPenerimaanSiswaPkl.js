import { getMajors } from "client/MajorsClient";
import { getStudent } from "client/StudentClient";
import { getAnggotaRombel, getRombel } from "client/RombelClient";
import {
  getPenerimaanPklSiswa,
  postPenerimaanPklSiswa,
  putPenerimaanPklSiswa,
  deletePenerimaanPklSiswa,
  getTambahPenerimaanPkl31,
  postPenerimaanPkl31,
} from "client/PenerimaanClient";
import Avatar from "components/Shared/Avatar/Avatar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaExclamation, FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { hideModal } from "../../utilities/ModalUtils";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import { go as fuzzysort } from "fuzzysort";
import { momentPackage } from "utilities/HelperUtils";
import toast from "react-hot-toast";

const initialFormData = {
  jurusanId: "",
  rombelId: "",
  tanggalMulai: "",
  tanggalSelesai: "",
  perusahaanId: "",
  penerimaanId: "",
};
const ModalTambahPenerimaanSiswaPkl = ({
  _getPenerimaanPkl31,
  editData,
  id,
  data,
  dataPerusahaan,
}) => {
  const [collapseOpen, setcollapseOpen] = useState(false);

  const [siswa, setSiswa] = useState([]);
  const [dipilih, setDipilih] = useState([siswa]);
  const [jurusan, setJurusan] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [rombel, setRombel] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [debounceSearch] = useDebounce(searchSiswa, 400);
  const [buttonState, setButtonState] = useState("idle"); 
  const [listPerusahaan, setListPerusahaan] = useState([]);
  const [listPenerimaan, setListPenerimaan] = useState([]);

  const _getRombel = async () => {
    const { data, error } = await getRombel();

    if (data) {
      setRombel(data?.rombel);
      setJurusan(data?.jurusan);
    }
  };

  const _getTambahPenerimaanPkl31 = async () => {
    const { data, error } = await getTambahPenerimaanPkl31({
      // page,
      // search,
      perusahaan_id: formData?.perusahaanId,
    });

    if (data) {
      setListPerusahaan(data?.semuaPerusahaan);
      setListPenerimaan(data?.semuaPenerimaan);
      setSiswa(data?.userData);
    }
  };

  const _getAnggotaRombel = async (search) => {
    const { data, error } = await getAnggotaRombel({
      MRombelId: formData.rombelId,
    });

    if (data) {
      const filtered = search
        ? fuzzysort(search, data?.anggota, { key: "nama" })
        : data?.anggota;
      setAnggota([...filtered]);
    }
  };

  const _getSiswa = async () => {
    const { data, error } = await getStudent({ search: debounceSearch });

    if (data) {
      setAnggota(data?.siswa?.data);
    }
  };

  const _handleSubmit = async () => {
    setButtonState("loading");
    const { data, error } = await postPenerimaanPkl31({
      m_user_id: dipilih?.map((d) => d?.id),
      m_penerimaan_perusahaan_id: formData?.penerimaanId,
      // perusahaan_id: formData?.perusahaanId,
      tanggal_mulai: momentPackage(formData?.tanggalMulai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggal_selesai: momentPackage(formData?.tanggalSelesai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });

    if (data) {
      setButtonState("success");

      toast.success(data?.message);
      hideModal("modalTambahPenerimaanSiswaPklPenerimaan");
      _getPenerimaanPkl31();
    }
  };

  useEffect(() => {
    _getRombel();
    _getTambahPenerimaanPkl31();
  }, [formData?.perusahaanId]);
  useEffect(() => {
    if (formData?.rombelId) {
      _getAnggotaRombel(debounceSearch);
    } else {
      _getSiswa();
    }
  }, [formData.rombelId, debounceSearch, formData?.perusahaanId]);

  // useEffect(() => {
  //   if (data?.length) {
  //     setDipilih([...data]);
  //   }
  // }, [data]);

  return (
    <div
      className="modal modal-ss fade"
      id="modalTambahPenerimaanSiswaPklPenerimaan"
      tabIndex="-1"
      aria-labelledby="modalTambahPenerimaanSiswaPklLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                      className="modal-title"
                      id="modalTambahPenerimaanSiswaPklLabel"
                    >
                      <h4 className="mb-1 fw-extrabold">Tambah Siswa</h4>
                      <span className="fs-6 fw-normal">
                        Isi informasi dibawah untuk menambahkan siswa
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        hideModal("modalTambahPenerimaanSiswaPklPenerimaan")
                      }
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-body p-md-4 p-2">
            <div className="container">
              <div className="row">
                <div className="col-md-5">
                  <div
                    className="card card-ss p-4"
                    style={{ minHeight: "calc(100vh - 213px)" }}
                  >
                    <h4 className="fw-extrabold color-dark mb-4">
                      Informasi Penerimaan
                    </h4>
                    <div className="mb-4">
                      <label
                        htmlFor="example-date-input"
                        className="form-label"
                      >
                        Perusahaan
                      </label>
                      <SelectShared
                        name="perusahaan"
                        placeholder="Pilih Perusahaan"
                        options={listPerusahaan?.map((d) => {
                          return {
                            label: `${d?.nama}`,
                            value: d?.id,
                          };
                        })}
                        handleChangeSelect={(e, name) => {
                          setFormData({
                            ...formData,
                            perusahaanId: e?.value,
                          });
                        }}
                        value={formData?.perusahaanId || ""}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="example-date-input"
                        className="form-label"
                      >
                        Penerimaan
                      </label>
                      <SelectShared
                        name="penerimaan"
                        placeholder="Pilih Penerimaan"
                        options={listPenerimaan?.map((d) => {
                          return {
                            label: `${d?.nama}`,
                            value: d?.id,
                          };
                        })}
                        handleChangeSelect={(e, name) => {
                          setFormData({
                            ...formData,
                            penerimaanId: e?.value,
                          });
                        }}
                        value={formData?.penerimaanId || ""}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="example-date-input"
                        className="form-label"
                      >
                        Tanggal Mulai
                      </label>
                      <DatePicker
                        onChange={(date, dateString) =>
                          setFormData({
                            ...formData,
                            tanggalMulai: dateString,
                          })
                        }
                        placeholder="Pilih Tanggal"
                        className="form-control"
                        autoComplete="off"
                        value={
                          formData?.tanggalMulai
                            ? momentPackage(formData?.tanggalMulai)
                            : ""
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="example-date-input"
                        className="form-label"
                      >
                        Tanggal Akhir
                      </label>
                      <DatePicker
                        onChange={(date, dateString) =>
                          setFormData({
                            ...formData,
                            tanggalSelesai: dateString,
                          })
                        }
                        placeholder="Pilih Tanggal"
                        className="form-control"
                        autoComplete="off"
                        value={
                          formData?.tanggalSelesai
                            ? momentPackage(formData?.tanggalSelesai)
                            : ""
                        }
                      />
                    </div>
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      {dipilih?.length} Siswa Terpilih
                    </h5>
                    <ul className="list-group list-group-flush">
                      {dipilih?.map((d) => {
                        return (
                          <li className="list-group-item py-3 px-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex">
                                <Avatar name={d?.nama} size={45} />
                                <div className="ms-4">
                                  <h6 className="mb-0 fw-bold color-dark">
                                    {d?.nama}
                                  </h6>
                                  {/* <span className="fs-12-ss fw-semibold mb-0">
                                X SIJA 2
                              </span> */}
                                </div>
                              </div>
                              <button className="btn ps-4 pe-0">
                                <FaTimes
                                  onClick={() =>
                                    setDipilih([
                                      ...dipilih.filter((e) => e.id != d.id),
                                    ])
                                  }
                                  style={{ color: "#e1e1e7" }}
                                  className="fs-4"
                                />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="col-md-7">
                  <div
                    className="card card-ss p-4"
                    style={{ minHeight: "calc(100vh - 213px)" }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h4 className="fw-extrabold color-dark">Cari anggota</h4>
                      <button
                        className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white color-dark fw-bold ${
                          collapseOpen && "active"
                        }`}
                        data-bs-toggle="collapse"
                        href="#collapseExample"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                        onClick={() => setcollapseOpen(!collapseOpen)}
                        data-joyride="filter-perpus-collapse"
                      >
                        <FaFilter className="me-3 fs-14-ss" />
                        Filter
                      </button>
                    </div>
                    <div className="position-relative w-100 mb-4">
                      <input
                        type="text"
                        className="form-control fw-semibold border-secondary-ss w-100 ps-4"
                        style={{
                          width: "100%",
                          paddingRight: "60px",
                        }}
                        id="exampleFormControlInput1"
                        placeholder="Cari anggota"
                        autoComplete="off"
                        value={searchSiswa}
                        onChange={(e) => setSearchSiswa(e.target.value)}
                      />
                      <FaSearch
                        className="position-absolute"
                        style={{
                          right: "24px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    </div>
                    <div className="collapse" id="collapseExample">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Jurusan</label>
                            <div className="select-kelas-jadwal-mengajar">
                              <SelectShared
                                name="jurusan"
                                handleChangeSelect={(e, name) =>
                                  setFormData({
                                    ...formData,
                                    jurusanId: e?.value,
                                  })
                                }
                                value={formData.jurusanId}
                                options={jurusan?.map((d) => {
                                  return { label: d?.kode, value: d?.id };
                                })}
                                placeholder="Pilih jurusan"
                                isClearable
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">Kelas</label>
                            <div className="select-kelas-jadwal-mengajar">
                              <SelectShared
                                name="kelas"
                                handleChangeSelect={(e, name) =>
                                  setFormData({
                                    ...formData,
                                    rombelId: e?.value,
                                  })
                                }
                                value={formData.rombelId}
                                options={rombel
                                  ?.filter(
                                    (d) =>
                                      !formData.jurusanId ||
                                      d?.mJurusanId == formData.jurusanId
                                  )
                                  ?.map((d) => {
                                    return { label: d?.nama, value: d?.id };
                                  })}
                                placeholder="Pilih kelas"
                                isClearable
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {rombelId && jurusanId && anggotaId ? ( */}

                    {anggota
                      ?.filter((d) => {
                        if (siswa) {
                          return !siswa?.data?.find(
                            (e) => e?.user?.id == d?.id
                          );
                        } else {
                          return 1;
                        }
                      })
                      ?.map((item) => {
                        const d = item?.obj || item;

                        return (
                          <div className="kuis-component form-check-ss position-relative mb-3">
                            <input
                              className="form-check-input form-check-ambil-soal position-absolute pointer"
                              type="checkbox"
                              style={{
                                transform: "translateY(-50%)",
                                top: "50%",
                                right: "1em",
                                width: "24px",
                                height: "24px",
                              }}
                              checked={dipilih?.find((e) => e?.id == d?.id)}
                              onChange={(e) => {
                                const temp = dipilih;
                                const check = dipilih?.findIndex(
                                  (e) => e?.id == d?.id
                                );
                                if (check >= 0) {
                                  temp.splice(check, 1);
                                } else {
                                  temp.push(d);
                                }

                                setDipilih([...temp]);
                              }}
                            />

                            <div className="kuis-card form-check-label rounded-ss border border-secondary border-light-secondary-ss p-3 ">
                              <div className="d-flex flex-grow-1 pe-5">
                                <Avatar name={d?.nama} size={45} />
                                <div className="ms-4">
                                  <h6 className="mb-0 fw-bold color-dark">
                                    {d?.nama}
                                  </h6>
                                  <span className="fs-12-ss fw-semibold mb-0">
                                    {d?.anggotaRombel?.rombel?.nama || "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {/* // ) : ( */}
                    {/* <div className="card-body p-4">
                        <div className="row justify-content-center">
                          <div className="col-md-6 col-sm-8 col-10 text-center">
                            <img
                              src="/img/empty-state-data.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="col-md-12 text-center">
                            <h4 className="color-dark fw-black mt-4 mb-2">
                              Tidak Ada Data
                            </h4>
                            <p className="fw-bold">
                              Pilih{" "}
                              <a
                                href="#peride-laporan"
                                className="color-primary"
                              >
                                nggota
                              </a>{" "}
                              di atas untuk mendapatkan data siswa
                            </p>
                          </div>
                        </div>
                      </div> */}
                    {/* // )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <div className="container">
              <div className="row ">
                <div className="col-md-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      hideModal("modalTambahPenerimaanSiswaPklPenerimaan");
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary ms-3"
                    onClick={() => {
                      _handleSubmit();
                    }}
                    buttonState={buttonState}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahPenerimaanSiswaPkl;
