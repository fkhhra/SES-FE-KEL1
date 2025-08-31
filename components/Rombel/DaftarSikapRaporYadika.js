import router from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  getDeskripsiSikapYadika1,
  getDeskripsiSikapYadika2,
  getDeskripsiSikapYadika3,
  getDeskripsiSikapYadika4,
  getDeskripsiSikapYadika5,
} from "utilities/RaporUtils";
import { postSikapYadika } from "../../client/RaporClient";
import SelectShared from "../../components/Shared/SelectShared/SelectShared";
import useUser from "../../hooks/useUser";

const DaftarSikapRaporYadika = ({
  sikapsosial,
  sikapspiritual,
  keterangan,
  getDetailRombelData,
}) => {
  const { user } = useUser();
  const initialStateForm = {};

  const [formData, setFormData] = useState(initialStateForm);

  const _postSikapYadika = async (id, body) => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await postSikapYadika(
      {
        ...body,
        tipe: !jenisRapor || jenisRapor == "akhirSemester" ? "uas" : "uts",
      },
      id
    );

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      getDetailRombelData();
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const [jenisRapor, setJenisRapor] = useState("");

  useEffect(() => {
    if (router.query.jenisRapor) {
      setJenisRapor(router.query.jenisRapor);
    }
  }, [router.query]);

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);
  return (
    <>
      <div className="card card-ss">
        <div className="card-header p-4 card-header-ss">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-lg-6 col-md-6 mb-3">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                Daftar Sikap Siswa
              </h4>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                <input
                  type="text"
                  className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                  style={{ height: "42px", width: "100%" }}
                  id="exampleFormControlInput1"
                  placeholder="Cari nama siswa.."
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                />
                <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column">
                  <button
                    className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-sm-4 mt-sm-0 mt-3`}
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-joyride="btn-filter-kelas"
                  >
                    {!jenisRapor || jenisRapor == "akhirSemester"
                      ? "Akhir Semester"
                      : "Tengah Semester"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              jenisRapor: "tengahSemester",
                            },
                          });
                          localStorage.setItem("jenisRapor", "tengahSemester");
                        }}
                      >
                        Tengah Semester
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              jenisRapor: "akhirSemester",
                            },
                          });
                          localStorage.setItem("jenisRapor", "akhirSemester");
                        }}
                      >
                        Akhir Semester
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body px-4 pt-0">
          <ul className="list-group list-group-flush">
            {keterangan
              ?.sort((a, b) =>
                ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
              )
              ?.map((d, idx) => {
                const tipe =
                  !jenisRapor || jenisRapor == "akhirSemester" ? "uas" : "uts";
                return (
                  <li className="list-group-item pt-0 pb-5 px-0 mb-5">
                    <h5 className="fs-18-ss color-dark fw-bold mb-4">
                      {idx + 1}. {d?.user?.nama}
                    </h5>
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th style={{ width: "15%" }}>Nama Sikap</th>
                          <th style={{ width: "20%" }}>Predikat</th>
                          <th>Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-th="Nama Sikap">
                            <span className="fw-semibold">Sikap Spiritual</span>
                          </td>
                          <td data-th="Predikat">
                            <SelectShared
                              name="moda"
                              placeholder="Pilih Predikat"
                              handleChangeSelect={(e, name) =>
                                _postSikapYadika(d?.user?.id, {
                                  sikap_integritas: e.value,
                                })
                              }
                              value={
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.sikapIntegritas
                              }
                              options={[
                                { value: "A", label: "A" },
                                { value: "B", label: "B" },
                                { value: "C", label: "C" },
                              ]}
                            />
                          </td>
                          <td data-th="Keterangan">
                            <p className="fw-semibold mb-0">
                              {getDeskripsiSikapYadika1(
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.sikapIntegritas
                              )}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td data-th="Nama Sikap">
                            <span className="fw-semibold">Sikap Religius</span>
                          </td>
                          <td data-th="Predikat">
                            <SelectShared
                              name="moda"
                              placeholder="Pilih Predikat"
                              handleChangeSelect={(e, name) =>
                                _postSikapYadika(d?.user?.id, {
                                  sikap_religius: e.value,
                                })
                              }
                              value={
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.sikapReligius
                              }
                              options={[
                                { value: "A", label: "A" },
                                { value: "B", label: "B" },
                                { value: "C", label: "C" },
                              ]}
                            />
                          </td>
                          <td data-th="Keterangan">
                            <p className="fw-semibold mb-0">
                              {getDeskripsiSikapYadika2(
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.sikapReligius
                              )}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td data-th="Nama Sikap">
                            <span className="fw-semibold">Nasionalis</span>
                          </td>
                          <td data-th="Predikat">
                            <SelectShared
                              name="moda"
                              placeholder="Pilih Predikat"
                              handleChangeSelect={(e, name) =>
                                _postSikapYadika(d?.user?.id, {
                                  nasionalis: e.value,
                                })
                              }
                              value={
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.nasionalis
                              }
                              options={[
                                { value: "A", label: "A" },
                                { value: "B", label: "B" },
                                { value: "C", label: "C" },
                              ]}
                            />
                          </td>
                          <td data-th="Keterangan">
                            <p className="fw-semibold mb-0">
                              {getDeskripsiSikapYadika3(
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.nasionalis
                              )}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td data-th="Nama Sikap">
                            <span className="fw-semibold">Mandiri</span>
                          </td>
                          <td data-th="Predikat">
                            <SelectShared
                              name="moda"
                              placeholder="Pilih Predikat"
                              handleChangeSelect={(e, name) =>
                                _postSikapYadika(d?.user?.id, {
                                  mandiri: e.value,
                                })
                              }
                              value={
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.mandiri
                              }
                              options={[
                                { value: "A", label: "A" },
                                { value: "B", label: "B" },
                                { value: "C", label: "C" },
                              ]}
                            />
                          </td>
                          <td data-th="Keterangan">
                            <p className="fw-semibold mb-0">
                              {getDeskripsiSikapYadika4(
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.mandiri
                              )}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td data-th="Nama Sikap">
                            <span className="fw-semibold">Gotong Royong</span>
                          </td>
                          <td data-th="Predikat">
                            <SelectShared
                              name="moda"
                              placeholder="Pilih Predikat"
                              handleChangeSelect={(e, name) =>
                                _postSikapYadika(d?.user?.id, {
                                  gotong_royong: e.value,
                                })
                              }
                              value={
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.gotongRoyong
                              }
                              options={[
                                { value: "A", label: "A" },
                                { value: "B", label: "B" },
                                { value: "C", label: "C" },
                              ]}
                            />
                          </td>
                          <td data-th="Keterangan">
                            <p className="fw-semibold mb-0">
                              {getDeskripsiSikapYadika5(
                                d?.user?.sikapYadika?.find(
                                  (d) => d.tipe == tipe
                                )?.gotongRoyong
                              )}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DaftarSikapRaporYadika;
