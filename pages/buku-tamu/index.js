import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPaperclip, FaSignature, FaTrashAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import SignaturePad from "signature_pad";
import { postBukuTamu } from "../../client/BukuTamuClient";
import { getProvince, getRegency } from "../../client/LokasiClient";
import { meSekolah } from "../../client/SekolahClient";
import BukuTamuLayout from "../../components/Layout/BukuTamuLayout";
import SelectShared from "../../components/Shared/SelectShared/SelectShared";
import UploadBukuTamu from "../../components/Shared/UploadBanner/UploadBukuTamu";
import { getFileUrlFromUri, momentPackage } from "../../utilities/HelperUtils";

const index = () => {
  const initialFormData = {
    nama: "",
    no_hp: "",
    instansi: "",
    bidang: "",
    alamat: "",
    province_id: "",
    regency_id: "",
    kodepos: "",
    keterangan: "",
    ttd: "",
    tanggal_dibuat: momentPackage().format("YYYY-MM-DD"),
  };

  const [meSekolahData, setMeSekolahData] = useState({});
  const [usingFile, setUsingFile] = useState(null);
  const [usingSignature, setUsingSignature] = useState(null);
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [signaturePad, setSignaturePad] = useState();
  const { sekolah } = meSekolahData;

  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setMeSekolahData(data);
    }
  };

  const getPayload = async () => {
    let ttd;
    if (usingSignature) {
      ttd = await ttdimage();
    }

    const payload = {
      ...formData,
      ttd: usingSignature ? ttd : formData.ttd,
      tanggal_dibuat: momentPackage().format("YYYY-MM-DD"),
    };

    return payload;
  };

  const _postBukuTamu = async () => {
    setButtonState("loading");
    const payload = await getPayload();

    const { data, error } = await postBukuTamu(payload);

    if (data) {
      // _getDetailRekap();
      // hideModal("modalTambahMateriRekap");
      toast.success(data?.message);
      setButtonState("success");
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  const startDraw = () => {
    const canvas = document.getElementById("canvasnya");
    const signature = new SignaturePad(canvas);
    setSignaturePad(signature);
  };

  const clear = () => {
    signaturePad.clear();
  };

  const ttdimage = async () => {
    const uri = signaturePad.toDataURL("image/png");

    const fileUrl = await getFileUrlFromUri(uri);
    return fileUrl;
  };

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  const handleChangeSelect = (e, name) => {
    if (name == "province_id") {
      _getRegency({
        provinceId: e?.value,
      });
    }

    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const _getRegency = async (params) => {
    const { data } = await getRegency(params);

    if (data) {
      setRegency(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getProvince = async () => {
    const { data } = await getProvince();

    if (data) {
      setProvince(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  useEffect(() => {
    getMeSekolahData();
    _getProvince();
  }, []);

  useEffect(() => {
    if (usingSignature) startDraw();
  }, [usingSignature]);

  //   const selectTugas = tugas?.map((data, idx) => {
  //     return {
  //       value: `${data?.id}`,
  //       label: `${data?.judul}`,
  //     };
  //   });

  //   const [stateForm, setStateForm] = useState(initialState);

  //   const handleChange = (e) => {
  //     setStateForm({ ...stateForm, [e.target.name]: e.target.value });
  //   };

  return (
    <BukuTamuLayout>
      <div
        className="col-md-4 p-4 header-buku-tamu"
        style={{
          background: "#EEF5FF",
          borderRadius: "10px 0 0 10px",
        }}
      >
        <img
          src={sekolah?.logoSs}
          alt=""
          className="img-fluid mb-5"
          style={{
            height: "50px",
          }}
        />
        <h2 className="color-dark fw-black">Buku Tamu</h2>

        <h2 className="color-dark fw-black mb-2">{sekolah?.nama}</h2>

        <img
          src={`/img/icon-buku-tamu.svg`}
          alt="Fitur-1"
          className="img-fluid mt-4"
        />
      </div>
      <div className="col-md-8 p-4">
        <h2 className="color-dark fw-black">Informasi Buku Tamu</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Nama Lengkap</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan nama lengkap beserta gelar"
                type="text"
                name="nama"
                value={formData?.nama}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Nomor Telepon</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan nomor telepon"
                type="text"
                name="no_hp"
                value={formData?.no_hp}
                onChange={handleChangeForm}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Asal Instansi</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Contoh : SMK Smarteschool"
                type="text"
                name="instansi"
                value={formData?.instansi}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Bidang</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Contoh : SMK Smarteschool"
                type="text"
                name="bidang"
                value={formData?.bidang}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label ">Alamat</label>
              <TextareaAutosize
                className="form-control fs-14-ss"
                autoComplete="off"
                style={{
                  resize: "none",
                  width: "100%",
                }}
                placeholder="Alamat lengkap"
                minRows={4}
                name="alamat"
                value={formData.alamat}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="row mt-0 mt-md-4"
              style={{
                marginBottom: "2px",
              }}
            >
              <div className="col-md-6 mt-0 mt-md-2">
                <div className="mb-4 mb-md-3">
                  <SelectShared
                    name="province_id"
                    placeholder="Provinsi"
                    className="fs-14-ss"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.province_id}
                    options={province}
                  />
                </div>
                <div className="mb-4 mb-md-3">
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="13620"
                    type="text"
                    name="kodepos"
                    value={formData?.kodepos}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6 mt-0 mt-md-2">
                <div className="mb-4">
                  <SelectShared
                    name="regency_id"
                    placeholder="Kota / Kabupaten"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.regency_id}
                    options={regency}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Keterangan</label>
              <TextareaAutosize
                className="form-control fs-14-ss"
                autoComplete="off"
                style={{
                  resize: "none",
                  width: "100%",
                }}
                placeholder="Tuliskan maksud tujuan"
                minRows={4}
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChangeForm}
              />
            </div>
          </div>

          <div className="col-md-6 mb-4 mb-lg-0">
            {!usingFile && !usingSignature ? (
              <div>
                <label className="form-label">Tanda Tangan</label>
                <div
                  className="bg-white rounded-ss d-flex justify-content-center align-items-center flex-column pointer w-100 px-3 border border-light-secondary-ss p-2 signature-hover"
                  onClick={() => {
                    setUsingFile(true);
                  }}
                >
                  <div className="label-input d-flex align-items-center m-0 m-md-0 signature-text">
                    <FaPaperclip />

                    <span className="fs-12-ss fw-bold text-center ms-3">
                      Unggah File Tanda Tangan
                    </span>
                  </div>
                </div>

                <div className="text-center w-100 position-relative my-2">
                  <hr
                    className="m-0 w-100 position-absolute"
                    style={{
                      top: "50%",
                      left: "0",
                      transform: "tranlateY(-50%)",
                    }}
                  />
                  <span
                    className="position-relative fs-14-ss fw-bold bg-white px-4 py-1"
                    style={{ zIndex: "2" }}
                  >
                    Atau
                  </span>
                </div>
                <div
                  className="bg-white rounded-ss d-flex justify-content-center align-items-center flex-column pointer w-100 px-3 border border-light-secondary-ss p-2 signature-hover"
                  onClick={() => {
                    setUsingSignature(true);
                  }}
                >
                  <div className="label-input d-flex align-items-center m-0 m-md-0 signature-text">
                    <FaSignature />

                    <span className="fs-12-ss fw-bold text-center ms-3">
                      Tanda Tangan Manual
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="d-flex justify-content-between">
                    <label className="form-label">Tanda Tangan</label>
                    {usingFile && (
                      <>
                        <div className="d-flex">
                          <div
                            className="rounded-circle template-rapor-buku-induk d-flex justify-content-center align-items-center me-3 bg-primary pointer"
                            style={{
                              width: "24px",
                              height: "24px",
                              border: "1px solid #2680EB",
                            }}
                          >
                            <FaPaperclip color="white" className="fs-14-ss" />
                          </div>
                          <div
                            onClick={() => {
                              setUsingSignature(true);
                              setUsingFile(null);
                            }}
                            className="rounded-circle template-rapor-buku-induk d-flex justify-content-center align-items-center pointer"
                            style={{
                              width: "24px",
                              height: "24px",
                              border: "1px solid #2680EB",
                            }}
                          >
                            <FaSignature color="#2680EB" className="fs-14-ss" />
                          </div>
                        </div>
                      </>
                    )}
                    {usingSignature && (
                      <>
                        <div className="d-flex">
                          <div
                            onClick={() => {
                              setUsingSignature(null);
                              setUsingFile(true);
                            }}
                            className="rounded-circle template-rapor-buku-induk d-flex justify-content-center align-items-center me-3 border-primary bg-white pointer"
                            style={{
                              width: "24px",
                              height: "24px",
                              border: "1px solid #2680EB",
                            }}
                          >
                            <FaPaperclip color="#2680EB" className="fs-14-ss" />
                          </div>
                          <div
                            className="rounded-circle template-rapor-buku-induk d-flex justify-content-center align-items-center bg-primary pointer"
                            style={{
                              width: "24px",
                              height: "24px",
                            }}
                          >
                            <FaSignature color="white" className="fs-14-ss" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {usingFile && (
                    <UploadBukuTamu
                      accept="image/*"
                      id="ttd"
                      name="ttd"
                      titleUnggahan="file"
                      preview={formData.ttd}
                      onChange={(e, uploadedFile) =>
                        handleChangeForm(e, uploadedFile)
                      }
                    />
                  )}
                  {usingSignature && (
                    <div className="position-relative" id="ttdCanvasLoc">
                      <div
                        onClick={() => {
                          clear();
                        }}
                        className="rounded-circle template-rapor-buku-induk d-flex justify-content-center align-items-center bg-secondary pointer position-absolute hapus-signature"
                        style={{
                          width: "30px",
                          height: "30px",
                          right: " 10px",
                          top: "10px",
                        }}
                      >
                        <FaTrashAlt color="white" />
                      </div>
                      {/* <a
                        className="dropdown-item color-danger"
                        onClick={() => {
                          ttdimage();
                        }}
                      >
                        <FaTrashAlt className="me-2" />
                        <span>image</span>
                      </a>
                     
                       */}
                      <canvas
                        id="canvasnya"
                        height={113}
                        width={
                          document.getElementById("ttdCanvasLoc")?.offsetWidth
                        }
                        style={{
                          border: "1px solid #E1E1E7",
                        }}
                        className="rounded-ss border-light-secondary-ss"
                      ></canvas>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
            onClick={_postBukuTamu}
          >
            Kirim
          </button>
        </div>
      </div>
    </BukuTamuLayout>
  );
};

export default index;
