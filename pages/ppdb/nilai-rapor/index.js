import { getGelombangPPDB } from "client/GelombangPPDB";
import { meSekolah } from "client/SekolahClient";
import usePPDB from "hooks/usePPDB";
import useSekolah from "hooks/useSekolah";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { getFileName } from "utilities/FileViewer";
import { getProfilUser, postProfilUser } from "../../../client/AuthClient";
import { ppdbURL } from "../../../client/clientAxios";
import Layout from "../../../components/PPDB/Layout";
import StepPPDB from "../../../components/PPDB/StepPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import UploadBanner from "../../../components/Shared/UploadBanner/UploadBanner";
import useUser from "../../../hooks/useUser";
import { momentPackage } from "../../../utilities/HelperUtils";

const NilaiRaporPPDB = () => {
  const initialStateForm = {
    // rapor
    fisika1: 0,
    fisika2: 0,
    fisika3: 0,
    fisika4: 0,
    fisika5: 0,
    fisika6: 0,
    matematika1: 0,
    matematika2: 0,
    matematika3: 0,
    matematika4: 0,
    matematika5: 0,
    matematika6: 0,
    bindo1: 0,
    bindo2: 0,
    bindo3: 0,
    bindo4: 0,
    bindo5: 0,
    bindo6: 0,
    bing1: 0,
    bing2: 0,
    bing3: 0,
    bing4: 0,
    bing5: 0,
    bing6: 0,
    btnState: "idle",
  };

  const { user, setUser } = useUser();
  const [formData, setFormData] = useState(initialStateForm);
  const [rata2, setRata2] = useState(0);
  const [rata3, setRata3] = useState(0);
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

  const { sekolah, setSekolah } = useSekolah();

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const { setTerdaftar } = usePPDB();
  const { terdaftar } = usePPDB();

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setTerdaftar(data);
    }
  };
  useEffect(() => {
    getMeSekolahData();
    _getGelombangPPDB();
  }, []);

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
      setFormData({
        ...initialStateForm,
        ...data.profil,
        ...data?.profil?.profil,
      });
    }
  };

  const handleClickSubmit = async () => {
    setFormData({ ...formData, btnState: "loading" });

    if (sekolah?.id === 70) {
      const requiredLampiran = ["semester1", "semester2", "semester3", "semester4", "semester5"];
      const missingLampiran = requiredLampiran.filter((key) => !formData[key]);
  
      if (missingLampiran.length > 0) {
        setFormData({ ...formData, btnState: "idle" }); 
        toast.error(`Lampiran ${missingLampiran.join(", ")} wajib diunggah!`);
        return; 
      }
    } 

    const payload = {
      ...formData,
      tanggalLahir: momentPackage(formData.tanggalLahir).format("YYYY-MM-DD"),
    };
    const { data, error } = await postProfilUser(payload);

    if (data) {
      setFormData({ ...formData, btnState: "success" });
      toast.success(data?.message);
      setRata3(rata2);
      _getProfil();
    } else {
      setFormData({ ...formData, btnState: "error" });
      toast.error(error?.message);
    }
  };
  useEffect(() => {
    if (
      rata3 !== 0 &&
      rata3 < parseFloat(terdaftar?.gelombangAktif?.gelombang?.norek)
    ) {
      toast.error("NILAI ANANDA TIDAK MENCUKUPI");
    }
  }, [rata3]);

  const handleChangeForm = (e, uploadedFile) => {
    console.log(e);
    if (uploadedFile) {
      setFormData({
        ...formData,
        [e.target.id]: uploadedFile,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    _getProfil();
  }, []);

  useEffect(() => {
    setDataAbsensi(JSON.parse(formData?.dataAbsensi || "{}"));
  }, [formData?.dataAbsensi]);

  const handleChangeInput = (e, numberlimit) => {
    const { value, name } = e.target;

    if (numberlimit) {
      let parsedValue = parseFloat(value);

      if (isNaN(parsedValue)) {
        // Handle jika input bukan angka
        parsedValue = 0;
      } else if (parsedValue > 100) {
        // Handle jika nilai lebih dari 100
        parsedValue = 100;
      } else if (parsedValue < 0) {
        // Handle jika nilai kurang dari 0
        parsedValue = 0;
      } else if (Number.isInteger(parsedValue)) {
        // Handle jika input adalah bilangan bulat
        parsedValue = parseInt(parsedValue);
      } else {
        // Handle untuk angka float dengan maksimal 2 angka di belakang koma
        parsedValue = parseFloat(parsedValue.toFixed(2));
      }

      setFormData({ ...formData, [name]: parsedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    if (sekolah?.id == 9487 || sekolah?.id == 9489) {
      setRata2(
        (
          ((formData?.semester1 ? parseFloat(formData?.semester1) : 0) +
            (formData?.semester2 ? parseFloat(formData?.semester2) : 0) +
            (formData?.semester3 ? parseFloat(formData?.semester3) : 0)) /
          3
        ).toFixed(2)
      );
    }
  }, [formData]);

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDB rata1={rata3} />
          {sekolah?.id == 7789 ? (
            ""
          ) : sekolah?.id == 9487 || sekolah?.id == 9489 ? (
            <div className="card card-ss mb-4">
              <div className="card-body p-4">
                <h4 className="fw-extrabold color-dark title-border mb-5">
                  Data Nilai Rapor
                </h4>
                <p className="fw-bold color-dark">
                  Masukkan nilai sampai 2 angka dibelakang koma.
                </p>
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
                            onChange={(e) => handleChangeInput(e, true)}
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
                            onChange={(e) => handleChangeInput(e, true)}
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
                            onChange={(e) => handleChangeInput(e, true)}
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
                            onChange={(e) => handleChangeInput(e, true)}
                            style={{ width: 83 }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer-ss pb-4">
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
              </div>
            </div>
          ) : (
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
                                value={formData[`fisika${d}`]}
                                onChange={(e) => handleChangeInput(e, true)}
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
                                value={formData[`matematika${d}`]}
                                onChange={(e) => handleChangeInput(e, true)}
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
                                value={formData[`bindo${d}`]}
                                onChange={(e) => handleChangeInput(e, true)}
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
                                value={formData[`bing${d}`]}
                                onChange={(e) => handleChangeInput(e, true)}
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
              <div className="card-footer-ss pb-4">
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
              </div>
            </div>
          )}

          {sekolah?.id !== 7789 &&
            sekolah?.id !== 9487 &&
            sekolah?.id !== 9489 && (
              <div className="card card-ss mb-4">
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
                                  name={`bing${d}`}
                                  value={dataAbsensi[`alpa${d}`]}
                                  onChange={(e) => {
                                    let parsed = JSON.parse(
                                      formData?.dataAbsensi || "{}"
                                    );
                                    parsed[`alpa${d}`] = e.target.value;
                                    setFormData({
                                      ...formData,
                                      dataAbsensi: JSON.stringify(parsed),
                                    });
                                  }}
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
                                  name={`bing${d}`}
                                  value={dataAbsensi[`izin${d}`]}
                                  onChange={(e) => {
                                    let parsed = JSON.parse(
                                      formData?.dataAbsensi || "{}"
                                    );
                                    parsed[`izin${d}`] = e.target.value;
                                    setFormData({
                                      ...formData,
                                      dataAbsensi: JSON.stringify(parsed),
                                    });
                                  }}
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
                                  name={`bing${d}`}
                                  value={dataAbsensi[`sakit${d}`]}
                                  onChange={(e) => {
                                    let parsed = JSON.parse(
                                      formData?.dataAbsensi || "{}"
                                    );
                                    parsed[`sakit${d}`] = e.target.value;
                                    setFormData({
                                      ...formData,
                                      dataAbsensi: JSON.stringify(parsed),
                                    });
                                  }}
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
                <div className="card-footer-ss pb-4">
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
                </div>
              </div>
            )}

          {sekolah?.id == 7789 ? (
            <div className="card card-ss mb-4">
              <div className="card-body p-4">
                <h4 className="fw-extrabold color-dark title-border mb-5">
                  Lampiran Rapor
                </h4>

                <UploadBanner
                  label="Rapor"
                  titleUnggahan="Foto / File Rapor"
                  id="semester1"
                  name={
                    formData?.semester1
                      ? getFileName(formData?.semester1)
                      : "semester1"
                  }
                  preview={formData.semester1}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
              </div>
              <div className="card-footer-ss pb-4">
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
              </div>
            </div>
          ) : sekolah?.id == 9487 || sekolah?.id == 9489 ? (
            <div className="card card-ss mb-4">
              <div className="card-body p-4">
                <h4 className="fw-extrabold color-dark title-border mb-5">
                  Lampiran Rapor (Opsional)
                </h4>

                <UploadBanner
                  label="Kelas IV (Ganjil)"
                  titleUnggahan="Foto / File Kelas IV (Ganjil)"
                  id="semester4"
                  name={
                    formData?.semester4
                      ? getFileName(formData?.semester4)
                      : "semester4"
                  }
                  preview={formData.semester4}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
                <UploadBanner
                  label="Kelas V (Ganjil)"
                  titleUnggahan="Foto / File Kelas V (Ganjil)"
                  id="semester5"
                  name={
                    formData?.semester5
                      ? getFileName(formData?.semester5)
                      : "semester5"
                  }
                  preview={formData.semester5}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
                <UploadBanner
                  label="Kelas VI (Ganjil)"
                  titleUnggahan="Foto / File Kelas VI (Ganjil)"
                  id="semester6"
                  name={
                    formData?.semester6
                      ? getFileName(formData?.semester6)
                      : "semester6"
                  }
                  preview={formData.semester6}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
              </div>
              <div className="card-footer-ss pb-4">
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
              </div>
            </div>
          ) : (
            <div className="card card-ss mb-4">
              <div className="card-body p-4"> 
                <h4 className="fw-extrabold color-dark title-border mb-5">
                  {sekolah?.id == 70 ? 
                  "Lampiran Rapor" : 
                  "Lampiran Rapor (Opsional)"}
                </h4>

                <UploadBanner
                  label="Semester 1"
                  titleUnggahan="Foto / File Semester 1"
                  id="semester1"
                  name={
                    formData?.semester1
                      ? getFileName(formData?.semester1)
                      : "semester1"
                  }
                  preview={formData.semester1}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
                <UploadBanner
                  label="Semester 2"
                  titleUnggahan="Foto / File Semester 2"
                  id="semester2"
                  name={
                    formData?.semester2
                      ? getFileName(formData?.semester2)
                      : "semester2"
                  }
                  preview={formData.semester2}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
                <UploadBanner
                  label="Semester 3"
                  titleUnggahan="Foto / File Semester 3"
                  id="semester3"
                  name={
                    formData?.semester3
                      ? getFileName(formData?.semester3)
                      : "semester3"
                  }
                  preview={formData.semester3}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
                <UploadBanner
                  label="Semester 4"
                  titleUnggahan="Foto / File Semester 4"
                  id="semester4"
                  name={
                    formData?.semester4
                      ? getFileName(formData?.semester4)
                      : "semester4"
                  }
                  preview={formData.semester4}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
                <UploadBanner
                  label="Semester 5"
                  titleUnggahan="Foto / File Semester 5"
                  id="semester5"
                  name={
                    formData?.semester5
                      ? getFileName(formData?.semester5)
                      : "semester5"
                  }
                  preview={formData.semester5}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
                <UploadBanner
                  label={sekolah?.id == 70 ? "Semester 6 (Opsional)" : "Semester 6"}
                  titleUnggahan="Foto / File Semester 6"
                  id="semester6"
                  name={
                    formData?.semester6
                      ? getFileName(formData?.semester6)
                      : "semester6"
                  }
                  preview={formData.semester6}
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                  isFileEdit={true}
                />
              </div>
              <div className="card-footer-ss pb-4">
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
              </div>
            </div>
          )}

          <div className="card card-ss">
            <div className="card-body p-4 text-center">
              <p className="fw-bold color-dark">
                Pastikan data yang anda cantumkan di atas adalah benar dan dapat
                dipertanggungjawabkan.
              </p>
              {sekolah?.id !== 9487 && sekolah?.id !== 9489 && (
                <Link href={`${ppdbURL}/prestasi`}>
                  <button className="btn btn-primary btn-primary-ss shadow-primary-ss bg-gradient-primary rounded-pill px-5 py-2 fw-bold">
                    Selanjutnya
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default NilaiRaporPPDB;
