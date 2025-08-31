import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getPreviewURL } from "utilities/FileViewer";
import { baseURL } from "../../../client/clientAxios";
import { uploadFile } from "../../../client/uploadFileClient";
import LoadingProgress from "../../../components/Shared/LoadingProgress/LoadingProgress";

const UploadBanner = ({
  preview = "",
  onChange = () => {},
  onUpload = () => {},
  onClick = () => {},
  name = "",
  id = "",
  label = "",
  titleUnggahan = "Foto Banner",
  titleUkuran = "",
  titleRasio = "",
  disabled = false,
  accept,
  dataJoyride,
  isFile = false,
  isImport = false,
  isUploadedFile = false,
  isFileEdit = false,
}) => {
  const [progress, setProgress] = useState(0);

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      return setProgress(uploadProgress);
    }

    setTimeout(() => {
      setProgress(0);
    }, 500);
  };

  const getFileUrl = (fileUrl, e) => {
    if (fileUrl) {
      onChange(e, fileUrl);
    }
  };

  const uploadFileToServer = async (e) => {
    if (isImport) {
      getFileUrl(e.target.files[0], e);
    } else {
      onUpload(true);
      await uploadFile(e.target.files[0], checkProgress, (fileUrl) =>
        getFileUrl(fileUrl, e)
      );
      onUpload(false);
    }
  };

  return (
    <div>
      <LoadingProgress progress={progress} />
      {label && <p className="form-label">{label}</p>}
      {!preview && (
        <label
          htmlFor={id}
          className={`form-label mb-4 w-100 ${disabled ? "no-drop" : ""} `}
          data-joyride={dataJoyride}
        >
          <div
            className={`drop-file bg-soft-primary rounded-ss d-flex justify-content-center align-items-center flex-column pointer w-100 px-3 border border-primary-ss ${
              isFile ? "py-lg-4 py-md-3 py-4" : "py-lg-5 py-md-3 py-5"
            }`}
          >
            <div className="label-input d-flex align-items-center m-3 m-md-0">
              <img
                src={
                  isFile
                    ? "/img/icon-file-upload.svg"
                    : "/img/icon-upload-dropfile.svg"
                }
              />
              <span className="fs-18-ss fw-semibold color-secondary text-center ms-3">
                Klik untuk mengunggah{" "}
                <span className="color-primary">{titleUnggahan}</span>
              </span>
            </div>
            {titleUkuran && (
              <span className="fs-14-ss fw-semibold color-secondary mt-3">
                Sebaiknya memiliki ukuran {titleUkuran} pixel
              </span>
            )}
            {titleRasio && (
              <span className="fs-14-ss fw-semibold color-secondary mt-3">
                Sebaiknya memiliki rasio {titleRasio}
              </span>
            )}
          </div>
        </label>
      )}
      {preview && !isFile && !isFileEdit && (
        <div className="position-relative mx-auto" data-joyride={dataJoyride}>
          {/* <div
            className="px-4 py-3 border-0 bg-soft-primary rounded-ss mb-4"
            style={{ minHeight: "79px" }}
          >
            <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
              <div
                className="d-flex align-items-center flex-wrap pointer"
                onClick={() => window.open(getPreviewURL(file))}
              >
                <img
                  src="/img/icon-file.svg"
                  alt="icon-file"
                  className="me-3"
                />
                <p className="fw-bold color-dark mb-0 py-2">{name}</p>
              </div>
            </div>
          </div> */}
          <img width="100%" src={preview} className="rounded" />
          <label
            className="rounded-circle shadow-primary-ss position-absolute pointer"
            htmlFor={id}
            style={{
              right: "5%",
              top: "5%",
              width: "50px",
              height: "50px",
              background: `
                url(/img/icon-edit-foto.svg)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></label>
        </div>
      )}
      {preview && isFileEdit && (
        <div className="position-relative mx-auto" data-joyride={dataJoyride}>
          <div
            className="px-4 py-3 border-0 bg-soft-primary rounded-ss mb-4"
            style={{ minHeight: "79px" }}
          >
            <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
              <div
                className="d-flex align-items-center flex-wrap pointer"
                onClick={() => window.open(getPreviewURL(preview))}
              >
                <img
                  src="/img/icon-file.svg"
                  alt="icon-file"
                  className="me-3"
                />
                <p className="fw-bold color-dark mb-0 py-2">{name}</p>
              </div>
            </div>
          </div>
          {/* <img width="100%" src={preview} className="rounded" /> */}
          <label
            className="rounded-circle shadow-primary-ss position-absolute pointer"
            htmlFor={id}
            style={{
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50px",
              height: "50px",
              background: `
                url(/img/icon-edit-foto.svg)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></label>
        </div>
      )}
      {preview && isFile && (
        <div className="card-lampiran-materi border-0 bg-soft-primary rounded-ss mt-4">
          <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
            <a
              href={
                isUploadedFile
                  ? getPreviewURL(preview)
                  : URL.createObjectURL(preview)
              }
              target="_blank"
            >
              <div className="d-flex align-items-center flex-wrap">
                <img src="/img/icon-file-download.svg" alt="" />
                <div className="p-2">
                  <p className="fw-bold color-dark mb-0">
                    {preview?.name || `Template Import ${name}`}
                  </p>
                  <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                    {/* PDF */}
                  </span>
                </div>
              </div>
            </a>
            <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
              <FaTimes
                className="pointer fs-4"
                style={{ color: "#96DAFF" }}
                onClick={onClick}
              />
            </div>
          </div>
        </div>
      )}
      <input
        className="form-control d-none"
        type="file"
        accept={accept}
        id={id}
        name={name}
        onChange={uploadFileToServer}
      />
    </div>
  );
};

export default UploadBanner;
