import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft, FaCamera } from "react-icons/fa";
import { useRouter } from "next/router";
import { getPenerimaanPkl } from "client/PenerimaanClient";
import LoadingProgress from "components/Shared/LoadingProgress/LoadingProgress";
import useUser from "hooks/useUser";
import { uploadFile } from "client/uploadFileClient";
import { editPerusahaan } from "client/PerusahaanClient";
import toast from "react-hot-toast";

const HeaderDetailPerusahaan = ({
  children,
  ssURL,
  id,
  judul,
  dataPerusahaan,
  _getDetailPerusahaan,
}) => {
  const user = useUser();
  const [activeMenu, setActiveMenu] = useState(`/`);

  const router = useRouter();
  const [totalPatner, setTotalPatner] = useState([]);
  const [totalSiswa, setTotalSiswa] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploadBanner, setIsUploadBanner] = useState(null);

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      setUploadProgress(uploadProgress);
    }
  };
  const uploadFileToServer = async (e, isUploadBanner = false) => {
    setIsUploadBanner(isUploadBanner);
    await uploadFile(e.target.files[0], checkProgress, (fileUrl) => {
      if (fileUrl) {
        setUploadedFile(fileUrl);
      }
    });
  };

  const postPhotoPerusahaan = async (isUploadBanner) => {
    const payload = {
      [isUploadBanner ? "sampul" : "logo"]: uploadedFile,
    };
    const { data, error } = await editPerusahaan(id, payload);
    if (data) {
      toast.success(data?.message);
      _getDetailPerusahaan();
    } else {
      toast.error(error?.message);
    }
    setUploadedFile(null);
    setIsUploadBanner(null);
  };

  useEffect(() => {
    if (uploadedFile) {
      postPhotoPerusahaan(isUploadBanner);
    }
  }, [uploadedFile, isUploadBanner]);

  useEffect(() => {
    setActiveMenu(router.asPath);
  }, [router.asPath]);

  // const navMenus = [
  //   {
  //     href: `${ssURL}/perusahaan/[id]/profil`,
  //     as: `${ssURL}/perusahaan/1/profil`,
  //     text: "Profil Perusahaan",
  //     active: `${ssURL}/perusahaan/1/profil`,
  //   },
  //   {
  //     href: `${ssURL}/perusahaan/[id]/berkas`,
  //     as: `${ssURL}/perusahaan/1/berkas`,
  //     text: "Berkas",
  //     active: `${ssURL}/perusahaan/1/berkas`,
  //     active2: `${ssURL}/perusahaan/1/berkas?subnav=mou`,
  //     active3: `${ssURL}/perusahaan/1/berkas?subnav=surat`,
  //   },
  //   {
  //     href: `${ssURL}/perusahaan/[id]/penerimaan`,
  //     as: `${ssURL}/perusahaan/1/penerimaan`,
  //     text: "Penerimaan",
  //     active: `${ssURL}/perusahaan/1/penerimaan`,
  //   },
  // ];
  console.log(dataPerusahaan);

  return (
    <>
      {/* <LoadingProgress progress={uploadProgress} /> */}
      <div className="row gy-4">
        <div className="col-12">
          <Link href={`${ssURL}/perusahaan`}>
            <a className="text-decoration-none fw-bolder color-primary">
              <FaChevronLeft />
              <span className="ms-2">Kembali</span>
            </a>
          </Link>
        </div>
        <div className="col-md-12">
          <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 card-proyek">
            <img
              // src={user?.home || "https://picsum.photos/1920/1080"}
              src={
                dataPerusahaan?.informasi?.sampul != null
                  ? dataPerusahaan?.informasi?.sampul
                  : "https://picsum.photos/1920/1080"
              }
              className="card-img-top card-header-ss img-fit-cover bg-detail-partner-kolaborasi mb-lg-0 mb-3"
            />
            <div
              className="card-img-overlay p-lg-4 p-3"
              style={{ height: "150px" }}
            >
              <div className="d-flex justify-content-between flex-sm-row flex-column">
                <div className="d-flex align-items-center flex-grow-1 me-sm-4 order-sm-1 order-2 mt-sm-0">
                  <div className="position-relative">
                    <div
                      className="rounded-ss bg-white"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <img
                        src={
                          dataPerusahaan?.logo != null
                            ? dataPerusahaan?.logo
                            : "/img/empty-state-detail-perusahaan.svg"
                        }
                        alt="img-detail-perusahaan"
                        className="img-fit-contain"
                        style={{ width: "80px", height: "80px" }}
                      />
                    </div>
                    <div
                      className="position-absolute"
                      style={{ bottom: "-10px", right: "-10px" }}
                    >
                      <div
                        className="d-flex justify-content-end position-relative"
                        style={{ zIndex: "1" }}
                      >
                        <label
                          htmlFor="formFile"
                          className="rounded-circle bg-soft-secondary color-secondary d-flex align-items-center justify-content-center pointer fs-6 shadow-dark-ss"
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaCamera />
                        </label>
                      </div>
                      <input
                        id="formFile"
                        accept="image/*"
                        className="form-control d-none"
                        type="file"
                        onChange={(e) => uploadFileToServer(e, false)}
                      ></input>
                    </div>
                  </div>
                  <div className="text-white ms-4">
                    <h3 className="mb-1 fw-extrabold clamp-2">
                      {dataPerusahaan?.nama}
                    </h3>
                  </div>
                </div>
                <div className="order-sm-2 order-1 d-flex justify-content-end">
                  <label
                    htmlFor="formFileBanner"
                    className="rounded-circle bg-soft-secondary color-secondary d-flex align-items-center justify-content-center pointer fs-5 shadow-dark-ss"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FaCamera />
                  </label>
                  <input
                    accept="image/*"
                    className="form-control d-none"
                    type="file"
                    id="formFileBanner"
                    onChange={(e) => uploadFileToServer(e, true)}
                  ></input>
                </div>
              </div>
            </div>
            <div className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch">
              <div className="kelas-nav d-flex flex-column flex-lg-row">
                {/* {navMenus.map((d) => {
                  return (
                    <Link href={d.href} as={d.as}>
                      <a
                        className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                          activeMenu == d.active
                            ? "color-primary"
                            : "color-secondary"
                        }`}
                      >
                        {d.text}
                      </a>
                    </Link>
                  );
                })} */}
                <Link
                  href={`${ssURL}/perusahaan/${dataPerusahaan?.id}/profil`}
                  as={`${ssURL}/perusahaan/${dataPerusahaan?.id}/profil`}
                >
                  <a
                    className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                      activeMenu ==
                      `${ssURL}/perusahaan/${dataPerusahaan?.id}/profil`
                        ? "color-primary"
                        : "color-secondary"
                    }`}
                  >
                    Profil Perusahaan
                  </a>
                </Link>
                <Link
                  href={`${ssURL}/perusahaan/${dataPerusahaan?.id}/berkas`}
                  as={`${ssURL}/perusahaan/${dataPerusahaan?.id}/berkas`}
                >
                  <a
                    className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                      activeMenu ==
                        `${ssURL}/perusahaan/${dataPerusahaan?.id}/berkas` ||
                      activeMenu ==
                        `${ssURL}/perusahaan/${dataPerusahaan?.id}/berkas?subnav=mou` ||
                      activeMenu ==
                        `${ssURL}/perusahaan/${dataPerusahaan?.id}/berkas?subnav=surat`
                        ? "color-primary"
                        : "color-secondary"
                    }`}
                  >
                    Berkas
                  </a>
                </Link>
                <Link
                  href={`${ssURL}/perusahaan/${dataPerusahaan?.id}/penerimaan`}
                  as={`${ssURL}/perusahaan/${dataPerusahaan?.id}/penerimaan`}
                >
                  <a
                    className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                      activeMenu ==
                      `${ssURL}/perusahaan/${dataPerusahaan?.id}/penerimaan`
                        ? "color-primary"
                        : "color-secondary"
                    }`}
                  >
                    Penerimaan
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default HeaderDetailPerusahaan;
