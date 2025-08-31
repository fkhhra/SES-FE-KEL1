import React from "react";
import { FaPaperclip, FaPen, FaTrashAlt } from "react-icons/fa";
import useUser from "../../hooks/useUser";
import { momentPackage } from "../../utilities/HelperUtils";

const ListSuratKeputusan = ({
  dataSurat,
  setFormData,
  formData,
  deleteSurat,
  isMasuk,
  teruskanSurat,
}) => {
  const { user } = useUser();
  return (
    <>
      {dataSurat?.map((d, idx) => {
        const file = JSON.parse(d.file);
        return (
          <div className="row">
            {/* <Link href={linkRedirect + `${d?.id}`}> */}
            <div className={`card card-ss rounded-ss mb-4`}>
              <div className="card-body card-body-ss p-3">
                <div className="d-flex justify-content-between mb-3">
                  <p className="fs-14-ss fw-semibold m-0">
                    {d?.kode}
                    {momentPackage(d?.surel?.create_at).format("DD MMMM YYYY")}
                  </p>
                  {/* Dropdown Option Start */}

                  {user?.role == "admin" && (
                    <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                      <div
                        role="button"
                        id="dropdownOption"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src={`/img/icon-dropdown-option.svg`}
                          alt="icon-option"
                        />
                      </div>
                      <ul
                        className="dropdown-menu dropdown-menu-ss my-1"
                        aria-labelledby="dropdownOption"
                      >
                        <li
                          onClick={() =>
                            setFormData({
                              ...formData,
                              ...d,
                              file: file,
                              tanggal: momentPackage(d.tanggal),
                            })
                          }
                          data-bs-toggle="modal"
                          data-bs-target="#modalTambahSuratMasuk"
                        >
                          <a className="dropdown-item">
                            <FaPen className="me-2" />
                            <span>Edit</span>
                          </a>
                        </li>
                        <li onClick={() => deleteSurat(d?.id)}>
                          <a className="dropdown-item color-danger">
                            <FaTrashAlt className="me-2" />
                            <span>Hapus</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                  {user?.role == "kepsek" && isMasuk && <></>}
                  {/* Dropdown Option End */}
                </div>
                <div
                  className="card-ss p-4 mb-3"
                  style={{
                    background: "#F4F4F7",
                  }}
                >
                  <div className="my-3">
                    <h6
                      className="color-dark text-truncate"
                      dangerouslySetInnerHTML={{ __html: d?.isi }}
                    ></h6>
                  </div>
                  {JSON.parse(d?.file)?.map((item) => {
                    const fileName = item
                      .split("?")[0]
                      .replace(
                        "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/",
                        ""
                      );
                    const type =
                      fileName.substring(
                        fileName.lastIndexOf(".") + 1,
                        fileName.length
                      ) || fileName;
                    return (
                      <div className="card-lampiran-materi border-0 bg-soft-primary rounded-ss mb-4">
                        <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
                          <a href={item} target="_blank">
                            <div className="d-flex align-items-center flex-wrap">
                              <img src="/img/icon-upload-link.svg" alt="" />
                              <div className="px-4">
                                <p className="fw-bold color-dark mb-0 ">
                                  {fileName}
                                </p>
                                <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                                  {type}
                                </span>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* tampilan kepsek */}
              </div>
            </div>
            {/* </Link> */}
          </div>
        );
      })}
    </>
  );
};

export default ListSuratKeputusan;
