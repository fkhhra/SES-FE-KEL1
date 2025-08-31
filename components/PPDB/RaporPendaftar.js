import { meSekolah } from "client/SekolahClient";
import useSekolah from "hooks/useSekolah";
import React, { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";

const RaporPendaftar = ({ initialState }) => {
  const { sekolah, setSekolah } = useSekolah();
  const [rata2, setRata2] = useState(0);

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };
  const [formData, setFormData] = useState(initialState);
  const [dataAbsensi, setDataAbsensi] = useState({
    alpa1: 0,
    alpa2: 0,
    alpa3: 0,
    alpa4: 0,
    alpa5: 0,
    alpa6: 0,
    izin1: 0,
    izin2: 0,
    izin3: 0,
    izin4: 0,
    izin5: 0,
    izin6: 0,
    sakit1: 0,
    sakit2: 0,
    sakit3: 0,
    sakit4: 0,
    sakit5: 0,
    sakit6: 0,
  });

  useEffect(() => {
    getMeSekolahData();
  }, []);

  useEffect(() => {
    setFormData({ ...initialState?.profil });
    if (sekolah?.id == 9487 || sekolah?.id == 9489) {
      setRata2(
        (
          ((initialState?.profil?.semester1
            ? parseFloat(initialState?.profil?.semester1)
            : 0) +
            (initialState?.profil?.semester2
              ? parseFloat(initialState?.profil?.semester2)
              : 0) +
            (initialState?.profil?.semester3
              ? parseFloat(initialState?.profil?.semester3)
              : 0)) /
          3
        ).toFixed(2)
      );
    }
  }, [initialState]);

  useEffect(() => {
    if (initialState?.profil) {
      setDataAbsensi(JSON.parse(initialState?.profil?.dataAbsensi || "{}"));
    }
  }, [initialState]);

  return (
    <>
      {sekolah?.id == 9487 || sekolah?.id == 9489 ? (
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h4 className="fw-extrabold color-dark title-border mb-5">
              Data Nilai Rapor
            </h4>

            <div className="table-responsive">
              <table className="table-ss" data-joyride="table-slider">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kelas</th>
                    <th>Semester</th>
                    <th>Rata-Rata</th>
                    {/* {[1, 2, 3, 4, 5, 6].map((d) => {
                          return <th>Semester {d}</th>;
                        })} */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-td="Judul">1</td>
                    <td data-td="Judul">Kelas IV</td>
                    <td data-td="Judul">Ganjil</td>

                    <td data-td={`Semester 4`}>
                      <input
                        type="number"
                        className="form-control text-center"
                        min="0"
                        name={`semester1`}
                        value={formData[`semester1`]}
                        disabled
                        style={{ width: 83 }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td data-td="Judul">2</td>
                    <td data-td="Judul">Kelas V</td>
                    <td data-td="Judul">Ganjil</td>

                    <td data-td={`Semester 5`}>
                      <input
                        type="number"
                        className="form-control text-center"
                        min="0"
                        name={`semester2`}
                        value={formData[`semester2`]}
                        disabled
                        style={{ width: 83 }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td data-td="Judul">3</td>
                    <td data-td="Judul">Kelas VI</td>
                    <td data-td="Judul">Ganjil</td>

                    <td data-td={`Semester 6`}>
                      <input
                        type="number"
                        className="form-control text-center"
                        min="0"
                        name={`semester3`}
                        value={formData[`semester3`]}
                        disabled
                        style={{ width: 83 }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td data-td="Judul" colSpan={"3"}>
                      Rata-Rata Kumulatif
                    </td>

                    <td data-td={`Semester 7`}>
                      <input
                        disabled
                        type="number"
                        className="form-control text-center"
                        min="0"
                        name={`rata2`}
                        value={rata2}
                        style={{ width: 83 }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {sekolah?.id !== 9487 && sekolah?.id !== 9489 && (
            <div className="card-body p-4">
              <h4 className="fw-extrabold color-dark title-border mb-5">
                Data Absensi
              </h4>

              <div className="table-responsive">
                <table className="table-ss" data-joyride="table-slider">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return <th>Semester {d}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-td="Judul">Alpa</td>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return (
                          <td data-td={`Semester ${d}`}>
                            <input
                              type="number"
                              className="form-control text-center"
                              min="0"
                              name={`alpa${d}`}
                              value={dataAbsensi?.[`alpa${d}`]}
                              //   onChange={(e) => handleChangeInput(e, true)}
                              disabled
                              style={{ width: 83 }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td data-td="Judul">Izin</td>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return (
                          <td data-td={`Semester ${d}`}>
                            <input
                              type="number"
                              className="form-control text-center"
                              min="0"
                              name={`izin${d}`}
                              value={dataAbsensi?.[`izin${d}`]}
                              //   onChange={(e) => handleChangeInput(e, true)}
                              disabled
                              style={{ width: 83 }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td data-td="Judul">Sakit</td>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return (
                          <td data-td={`Semester ${d}`}>
                            <input
                              type="number"
                              className="form-control text-center"
                              min="0"
                              name={`sakit${d}`}
                              value={dataAbsensi?.[`sakit${d}`]}
                              //   onChange={(e) => handleChangeInput(e, true)}
                              disabled
                              style={{ width: 83 }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* <div className="card-footer-ss pb-4">
          <div className="mb-4">
            <hr className="m-0" />
          </div>
          <div className="d-flex justify-content-end align-items-center px-4 pb-3">
            <div data-joyride="btn-simpan">
              <ReactiveButton
                buttonState={formData.btnState}
                onClick={handleClickSubmit}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                className={
                  "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                }
              />
            </div>
          </div>
        </div> */}
        </div>
      ) : sekolah?.id !== 7789 ? (
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h4 className="fw-extrabold color-dark title-border mb-5">
              Data Nilai Rapor
            </h4>

            <div className="table-responsive">
              <table className="table-ss" data-joyride="table-slider">
                <thead>
                  <tr>
                    <th>Judul</th>
                    {[1, 2, 3, 4, 5, 6].map((d) => {
                      return <th>Semester {d}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-td="Judul">IPA</td>
                    {[1, 2, 3, 4, 5, 6].map((d) => {
                      return (
                        <td data-td={`Semester ${d}`}>
                          <input
                            type="number"
                            className="form-control text-center"
                            min="0"
                            name={`fisika${d}`}
                            value={formData?.[`fisika${d}`]}
                            //   onChange={(e) => handleChangeInput(e, true)}
                            disabled
                            style={{ width: 83 }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td data-td="Judul">Matematika</td>
                    {[1, 2, 3, 4, 5, 6].map((d) => {
                      return (
                        <td data-td={`Semester ${d}`}>
                          <input
                            type="number"
                            className="form-control text-center"
                            min="0"
                            name={`matematika${d}`}
                            value={formData?.[`matematika${d}`]}
                            //   onChange={(e) => handleChangeInput(e, true)}
                            disabled
                            style={{ width: 83 }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td data-td="Judul">Bahasa Indonesia</td>
                    {[1, 2, 3, 4, 5, 6].map((d) => {
                      return (
                        <td data-td={`Semester ${d}`}>
                          <input
                            type="number"
                            className="form-control text-center"
                            min="0"
                            name={`bindo${d}`}
                            value={formData?.[`bindo${d}`]}
                            //   onChange={(e) => handleChangeInput(e, true)}
                            disabled
                            style={{ width: 83 }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td data-td="Judul">Bahasa Inggris</td>
                    {[1, 2, 3, 4, 5, 6].map((d) => {
                      return (
                        <td data-td={`Semester ${d}`}>
                          <input
                            type="number"
                            className="form-control text-center"
                            min="0"
                            name={`bing${d}`}
                            value={formData?.[`bing${d}`]}
                            //   onChange={(e) => handleChangeInput(e, true)}
                            disabled
                            style={{ width: 83 }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td data-td="Judul">Rata - Rata Nilai Semester</td>
                    {[1, 2, 3, 4, 5, 6].map((d) => {
                      return (
                        <td data-td={`Semester ${d}`} className=" text-center">
                          {((formData?.[`matematika${d}`] || 0) +
                            (formData?.[`bindo${d}`] || 0) +
                            (formData?.[`bing${d}`] || 0) +
                            (formData?.[`fisika${d}`] || 0)) /
                            4}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {sekolah?.id !== 9487 && sekolah?.id !== 9489 && (
            <div className="card-body p-4">
              <h4 className="fw-extrabold color-dark title-border mb-5">
                Data Absensi
              </h4>

              <div className="table-responsive">
                <table className="table-ss" data-joyride="table-slider">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return <th>Semester {d}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-td="Judul">Alpa</td>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return (
                          <td data-td={`Semester ${d}`}>
                            <input
                              type="number"
                              className="form-control text-center"
                              min="0"
                              name={`alpa${d}`}
                              value={dataAbsensi?.[`alpa${d}`]}
                              //   onChange={(e) => handleChangeInput(e, true)}
                              disabled
                              style={{ width: 83 }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td data-td="Judul">Izin</td>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return (
                          <td data-td={`Semester ${d}`}>
                            <input
                              type="number"
                              className="form-control text-center"
                              min="0"
                              name={`izin${d}`}
                              value={dataAbsensi?.[`izin${d}`]}
                              //   onChange={(e) => handleChangeInput(e, true)}
                              disabled
                              style={{ width: 83 }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td data-td="Judul">Sakit</td>
                      {[1, 2, 3, 4, 5, 6].map((d) => {
                        return (
                          <td data-td={`Semester ${d}`}>
                            <input
                              type="number"
                              className="form-control text-center"
                              min="0"
                              name={`sakit${d}`}
                              value={dataAbsensi?.[`sakit${d}`]}
                              //   onChange={(e) => handleChangeInput(e, true)}
                              disabled
                              style={{ width: 83 }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* <div className="card-footer-ss pb-4">
          <div className="mb-4">
            <hr className="m-0" />
          </div>
          <div className="d-flex justify-content-end align-items-center px-4 pb-3">
            <div data-joyride="btn-simpan">
              <ReactiveButton
                buttonState={formData.btnState}
                onClick={handleClickSubmit}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                className={
                  "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                }
              />
            </div>
          </div>
        </div> */}
        </div>
      ) : (
        ""
      )}
      {sekolah?.id == 9487 || sekolah?.id == 9489 ? (
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h4 className="fw-extrabold color-dark title-border mb-5">
              Lampiran Rapor
            </h4>
            {[4, 5, 6].map((d) => {
              if (formData?.[`semester${d}`]) {
                return (
                  <>
                    <p className="form-label">
                      {d == 4
                        ? "Kelas IV (Ganjil)"
                        : d == 5
                        ? "Kelas V (Ganjil)"
                        : "Kelas VI (Ganjil)"}
                    </p>
                    <a
                      href={formData?.[`semester${d}`]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-soft-primary p-3 rounded-ss mb-3 pointer d-block"
                    >
                      <div className="file-content d-flex align-items-center flex-wrap">
                        <div
                          className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          <FaFile />
                        </div>
                        <div className="p-3 d-flex flex-column">
                          <p className="fw-bold color-dark mb-0">
                            File Rapor{" "}
                            {d == 4
                              ? "Kelas IV (Ganjil)"
                              : d == 5
                              ? "Kelas V (Ganjil)"
                              : "Kelas VI (Ganjil)"}
                          </p>
                        </div>
                      </div>
                    </a>
                  </>
                );
              } else {
                return null;
              }
            })}
            {/* <UploadBanner
            label="Semester 1"
            titleUnggahan="Foto / File Semester 1"
            id="semester1"
            name="semester1"
            preview={formData.semester1}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 2"
            titleUnggahan="Foto / File Semester 2"
            id="semester2"
            name="semester2"
            preview={formData.semester2}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 3"
            titleUnggahan="Foto / File Semester 3"
            id="semester3"
            name="semester3"
            preview={formData.semester3}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 4"
            titleUnggahan="Foto / File Semester 4"
            id="semester4"
            name="semester4"
            preview={formData.semester4}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 5"
            titleUnggahan="Foto / File Semester 5"
            id="semester5"
            name="semester5"
            preview={formData.semester5}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 6"
            titleUnggahan="Foto / File Semester 6"
            id="semester6"
            name="semester6"
            preview={formData.semester6}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          /> */}
          </div>
          {/* <div className="card-footer-ss pb-4">
          <div className="mb-4">
            <hr className="m-0" />
          </div>
          <div className="d-flex justify-content-end align-items-center px-4 pb-3">
            <div data-joyride="btn-simpan">
              <ReactiveButton
                buttonState={formData.btnState}
                onClick={handleClickSubmit}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                className={
                  "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                }
              />
            </div>
          </div>
        </div> */}
        </div>
      ) : sekolah?.id == 7789 ? (
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h4 className="fw-extrabold color-dark title-border mb-5">
              Lampiran Rapor
            </h4>
            {[1].map((d) => {
              if (formData?.[`semester${d}`]) {
                return (
                  <>
                    <p className="form-label">Rapor</p>
                    <a
                      href={formData?.[`semester${d}`]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-soft-primary p-3 rounded-ss mb-3 pointer d-block"
                    >
                      <div className="file-content d-flex align-items-center flex-wrap">
                        <div
                          className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          <FaFile />
                        </div>
                        <div className="p-3 d-flex flex-column">
                          <p className="fw-bold color-dark mb-0">File Rapor</p>
                        </div>
                      </div>
                    </a>
                  </>
                );
              } else {
                return null;
              }
            })}
            {/* <UploadBanner
            label="Semester 1"
            titleUnggahan="Foto / File Semester 1"
            id="semester1"
            name="semester1"
            preview={formData.semester1}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 2"
            titleUnggahan="Foto / File Semester 2"
            id="semester2"
            name="semester2"
            preview={formData.semester2}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 3"
            titleUnggahan="Foto / File Semester 3"
            id="semester3"
            name="semester3"
            preview={formData.semester3}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 4"
            titleUnggahan="Foto / File Semester 4"
            id="semester4"
            name="semester4"
            preview={formData.semester4}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 5"
            titleUnggahan="Foto / File Semester 5"
            id="semester5"
            name="semester5"
            preview={formData.semester5}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 6"
            titleUnggahan="Foto / File Semester 6"
            id="semester6"
            name="semester6"
            preview={formData.semester6}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          /> */}
          </div>
          {/* <div className="card-footer-ss pb-4">
          <div className="mb-4">
            <hr className="m-0" />
          </div>
          <div className="d-flex justify-content-end align-items-center px-4 pb-3">
            <div data-joyride="btn-simpan">
              <ReactiveButton
                buttonState={formData.btnState}
                onClick={handleClickSubmit}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                className={
                  "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                }
              />
            </div>
          </div>
        </div> */}
        </div>
      ) : (
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h4 className="fw-extrabold color-dark title-border mb-5">
              Lampiran Rapor
            </h4>
            {[1, 2, 3, 4, 5, 6].map((d) => {
              if (formData?.[`semester${d}`]) {
                return (
                  <>
                    <p className="form-label">Semester {d}</p>
                    <a
                      href={formData?.[`semester${d}`]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-soft-primary p-3 rounded-ss mb-3 pointer d-block"
                    >
                      <div className="file-content d-flex align-items-center flex-wrap">
                        <div
                          className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          <FaFile />
                        </div>
                        <div className="p-3 d-flex flex-column">
                          <p className="fw-bold color-dark mb-0">
                            File Rapor Semester {d}
                          </p>
                        </div>
                      </div>
                    </a>
                  </>
                );
              } else {
                return null;
              }
            })}
            {/* <UploadBanner
            label="Semester 1"
            titleUnggahan="Foto / File Semester 1"
            id="semester1"
            name="semester1"
            preview={formData.semester1}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 2"
            titleUnggahan="Foto / File Semester 2"
            id="semester2"
            name="semester2"
            preview={formData.semester2}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 3"
            titleUnggahan="Foto / File Semester 3"
            id="semester3"
            name="semester3"
            preview={formData.semester3}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 4"
            titleUnggahan="Foto / File Semester 4"
            id="semester4"
            name="semester4"
            preview={formData.semester4}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 5"
            titleUnggahan="Foto / File Semester 5"
            id="semester5"
            name="semester5"
            preview={formData.semester5}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          />
          <UploadBanner
            label="Semester 6"
            titleUnggahan="Foto / File Semester 6"
            id="semester6"
            name="semester6"
            preview={formData.semester6}
            onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
          /> */}
          </div>
          {/* <div className="card-footer-ss pb-4">
          <div className="mb-4">
            <hr className="m-0" />
          </div>
          <div className="d-flex justify-content-end align-items-center px-4 pb-3">
            <div data-joyride="btn-simpan">
              <ReactiveButton
                buttonState={formData.btnState}
                onClick={handleClickSubmit}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                className={
                  "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                }
              />
            </div>
          </div>
        </div> */}
        </div>
      )}
    </>
  );
};

export default RaporPendaftar;
