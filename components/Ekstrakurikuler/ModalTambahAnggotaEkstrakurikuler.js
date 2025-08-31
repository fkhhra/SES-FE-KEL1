import { getMajors } from "client/MajorsClient";
import { getAnggotaRombel, getRombel } from "client/RombelClient";
import { getStudent } from "client/StudentClient";
import Avatar from "components/Shared/Avatar/Avatar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaExclamation, FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { hideModal } from "../../utilities/ModalUtils";
import { go as fuzzysort } from "fuzzysort";
import { postAnggotaEskul } from "client/EskulClient";
import toast from "react-hot-toast";

const ModalTambahAnggotaEkstrakurikuler = ({ data = [], id, _detailEskul }) => {
  const [collapseOpen, setcollapseOpen] = useState(false);
  const [formData, setFormData] = useState({
    jurusanId: "",
    rombelId: "",
  });
  const [dipilih, setDipilih] = useState([...data]);
  const [jurusan, setJurusan] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [debounceSearch] = useDebounce(searchSiswa, 400);

  const _getRombel = async () => {
    const { data, error } = await getRombel();

    if (data) {
      setRombel(data?.rombel);
      setJurusan(data?.jurusan);
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
    const { data, error } = await postAnggotaEskul(id, {
      m_user_id: dipilih?.map((d) => d?.id),
      m_ekstrakurikuler_id: id,
    });

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahAnggotaEkstrakurikuler");
      _detailEskul();
    }
  };

  useEffect(() => {
    _getRombel();
  }, []);
  useEffect(() => {
    if (formData?.rombelId) {
      _getAnggotaRombel(debounceSearch);
    } else {
      _getSiswa();
    }
  }, [formData.rombelId, debounceSearch]);

  useEffect(() => {
    if (data?.length) {
      setDipilih([...data]);
    }
  }, [data]);

  return (
    <div
      className="modal modal-ss fade"
      id="modalTambahAnggotaEkstrakurikuler"
      tabIndex="-1"
      aria-labelledby="modalTambahAnggotaEkstrakurikulerLabel"
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
                      id="modalTambahAnggotaEkstrakurikulerLabel"
                    >
                      <h4 className="mb-1 fw-extrabold">Tambah Anggota</h4>
                      <span className="fs-6 fw-normal">
                        Isi informasi dibawah untuk menambahkan anggota
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() =>
                        hideModal("modalTambahAnggotaEkstrakurikuler")
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
                                  <span className="fs-12-ss fw-semibold mb-0">
                                    {d?.anggotaRombel?.rombel?.nama}
                                  </span>
                                </div>
                              </div>
                              <button className="btn ps-4 pe-0">
                                <FaTimes
                                  onClick={() =>
                                    setDipilih([
                                      ...dipilih.filter((e) => e?.id != d.id),
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
                    {anggota?.map((item) => {
                      const d = item?.obj || item;
                      return (
                        <div className="kuis-component form-check-ss position-relative mb-2">
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
                                  {d?.anggotaRombel?.rombel?.nama}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                      hideModal("modalTambahAnggotaEkstrakurikuler");
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

export default ModalTambahAnggotaEkstrakurikuler;
