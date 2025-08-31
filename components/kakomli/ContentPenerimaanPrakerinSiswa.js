import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import { formatAngkaTitik, momentPackage } from "utilities/HelperUtils";
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
import { getTambahPrakerin } from "client/KakomliClient";
import Avatar from "components/Shared/Avatar/Avatar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaExclamation, FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { DatePicker, Pagination } from "antd";
const { RangePicker } = DatePicker;
import { go as fuzzysort } from "fuzzysort";
import toast from "react-hot-toast";
const initialFormData = {
  jurusanId: "",
  rombelId: "",
};
const ContentPenerimaanPrakerinSiswa = ({
  data = [],
  formData,
  dipilih,
  setDipilih,
  setFormData,
}) => {
  const [collapseOpen, setcollapseOpen] = useState(false);
  const [jurusan, setJurusan] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [debounceSearch] = useDebounce(searchSiswa, 400);

  const _getTambahPrakerin = async () => {
    // setIsLoading(true);
    const { data, error } = await getTambahPrakerin({
      rombelId: formData?.rombelId,
      jurusanId: formData?.jurusanId,
      search: debounceSearch,
      page: formData?.page,
    });

    if (data) {
      setAnggota(data?.siswa);
      setJurusan(data?.jurusan);
      setRombel(data?.rombel);
    }
    // setIsLoading(false);
  };

  // const _getRombel = async () => {
  //   const { data, error } = await getRombel();

  //   if (data) {
  //     setRombel(data?.rombel);
  //     setJurusan(data?.jurusan);
  //   }
  // };

  // const _getAnggotaRombel = async (search) => {
  //   const { data, error } = await getAnggotaRombel({
  //     MRombelId: formData.rombelId,
  //   });

  //   if (data) {
  //     const filtered = search
  //       ? fuzzysort(search, data?.anggota, { key: "nama" })
  //       : data?.anggota;
  //     setAnggota([...filtered]);
  //   }
  // };

  // const _getSiswa = async () => {
  //   const { data, error } = await getStudent({
  //     rombelId: formData?.rombelId,
  //     jurusanId: formData?.jurusanId,
  //     search: debounceSearch,
  //     page: formData?.page,
  //   });

  //   if (data) {
  //     setAnggota(data?.siswa);
  //   }
  // };

  useEffect(() => {
    if (formData?.rombelId) {
      _getTambahPrakerin(debounceSearch);
    } else {
      _getTambahPrakerin();
    }
  }, [
    formData?.rombelId,
    debounceSearch,
    formData?.page,
    formData?.jurusanId,
    formData?.rombelId,
  ]);

  // useEffect(() => {
  //   if (data?.length) {
  //     setDipilih([...data]);
  //   }
  // }, [data]);

  return (
    <>
      <div className="card card-ss p-4 mb-4">
        <div className="row">
          <div className="col-md-5">
            <div
              className="card card-ss p-4"
              style={{ minHeight: "calc(100vh - 213px)" }}
            >
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
                                ...dipilih.filter((e) => e?.id != d?.id),
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
              {anggota?.data?.length ? (
                anggota?.data
                  ?.filter((d) => {
                    if (data) {
                      return !data?.find((e) => e?.id == d?.id);
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
                                {d.rombel?.nama || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="card-body p-4">
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
                        <a href="#peride-laporan" className="color-primary">
                          nggota
                        </a>{" "}
                        di atas untuk mendapatkan data siswa
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
                <Pagination
                  total={anggota?.total}
                  showSizeChanger={false}
                  current={formData?.page || 1}
                  pageSize={25}
                  onChange={(e, name) =>
                    setFormData({
                      ...formData,
                      page: e,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentPenerimaanPrakerinSiswa;
