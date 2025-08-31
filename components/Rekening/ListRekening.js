import React from "react";
import bankData from "data/bank.json";
import { formatAngkaUang } from "utilities/HelperUtils";
import { FaPen, FaTrashAlt } from "react-icons/fa";

// testing purpose

const ListRekening = ({
  data,
  onClickEdit,
  edit = true,
  dashboard = false,
  handleDeleteRekening,
  levelAkun,
}) => {
  return (
    <>
      {dashboard ? (
        <div
          className="rounded-ss p-4 py-3 pointer mb-4"
          style={{ backgroundColor: "#FBFCFF", border: "1px solid #D2E5FA" }}
        >
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex justify-content-start align-items-center mb-sm-0 mb-4 flex-sm-row flex-column">
              <img
                src={bankData?.find((d) => d.value == data?.bank)?.img}
                alt=""
                height={75}
                width={75}
                className="img-fit-contain me-sm-4 mx-sm-0 mx-auto mb-sm-0 mb-4"
              />
              <div>
                <h4 className="fw-extrabold color-dark mb-2">
                  {data?.jenis || "Dana Sekolah"}
                </h4>
                <p className="fs-ss-14 fw-semibold mb-0">
                  {`${data?.bank} - ${data?.norek}`}
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-sm-end align-items-center">
              <h4 className="fw-extrabold color-primary me-4 mb-0">
                Rp{formatAngkaUang(data?.saldo)}
              </h4>
            </div>
          </div>
        </div>
      ) : (
        <div className="card card-ss rounded-ss p-4 pointer mb-4">
          <div className="d-flex justify-content-sm-between align-items-sm-center flex-sm-row flex-column">
            {edit && (
              <div className="dropdown dropdown-ss mb-md-0 mb-2 d-sm-none d-flex ms-auto justify-content-end">
                <div
                  role="button"
                  className="me-2"
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
                    data-bs-toggle="modal"
                    data-bs-target="#modalTambahRekening"
                    onClick={() => onClickEdit(data)}
                  >
                    <a className="dropdown-item">
                      <FaPen className="me-2" />
                      <span>Edit</span>
                    </a>
                  </li>
                  <li onClick={() => handleDeleteRekening(data?.id)}>
                    <a className="dropdown-item color-danger">
                      <FaTrashAlt className="me-2" />
                      <span>Hapus</span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
            <div className="d-flex justify-content-start align-items-sm-center mb-sm-0 mb-4 flex-sm-row flex-column">
              <img
                src={bankData?.find((d) => d.value == data?.bank)?.img}
                alt=""
                height={75}
                width={75}
                className="img-fit-contain me-sm-4 mx-sm-0 mx-auto mb-sm-0 mb-4"
              />
              <div className="">
                <h4 className="fw-extrabold color-dark mb-2">
                  {data?.jenis || "Dana Sekolah"}
                </h4>
                <p className="fs-ss-14 fw-semibold mb-0">
                  {`${data?.bank} - ${data?.norek}`}
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-sm-end">
              <h4 className="fw-extrabold color-primary me-4 mb-0">
                Rp
                {formatAngkaUang(
                  levelAkun?.find((d) => d?.id == data?.mKeuAkunId)?.total
                )}
              </h4>
              {edit && (
                <div className="dropdown dropdown-ss mb-md-0 mb-2 d-sm-inline d-none justify-content-end">
                  <div
                    role="button"
                    className="me-2"
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
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahRekening"
                      onClick={() => onClickEdit(data)}
                    >
                      <a className="dropdown-item">
                        <FaPen className="me-2" />
                        <span>Edit</span>
                      </a>
                    </li>
                    <li onClick={() => handleDeleteRekening(data?.id)}>
                      <a className="dropdown-item color-danger">
                        <FaTrashAlt className="me-2" />
                        <span>Hapus</span>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListRekening;
