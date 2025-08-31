import { useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa"
import Lightbox from "react-image-lightbox";

const ListPrasarana = ({ data, handleClickEdit, handleClickDelete }) => {

  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [mainSrc, setMainSrc] = useState([]);

  const getImageSource = () => {
    setMainSrc(data?.foto?.[0]);
    setIsLightBoxOpen(true);
  };

  return <>
    <div className="col-md-6">
      <div
        className={`card rounded-ss`}
        style={{
          background: "rgba(244,244,247,.25)",
          border: "none",
        }}
      >
        <div className="card-body card-body-ss p-4">
          <div className="row">
            <div className="col-md-4 order-md-1 order-2 pointer" onClick={() => getImageSource()}>
              <img
                src={data?.foto?.[0]}
                className="img-fluid w-100 img-fit-cover rounded-ss mb-4 mb-md-0"
                style={{
                  height: "131px",
                }}
              />
            </div>
            <div className="col-md-7  order-md-2 order-3">
              <p className="fs-18-ss color-dark fw-extrabold mb-0">
                {data?.nama || "-"}
              </p>
              <p className="fs-14-ss color-primary fw-semibold mb-3">
                {data?.jenis || "-"} -{" "}
                {data?.noRegis || "-"}
              </p>
              <p className="fs-14-ss color-dark fw-bold mb-0">
                Dimensi
              </p>
              <p className="fs-14-ss color-dark fw-bold mb-0">
                Panjang (Meter) : {data?.panjang || "-"}
              </p>
              <p className="fs-14-ss color-dark fw-bold mb-0">
                Lebar (Meter) : {data?.lebar || "-"}
              </p>
            </div>
            <div className="col-md-1 order-md-3 order-1 mb-md-0 mb-4">
              {/* Dropdown Option Start */}

              <div className="dropdown dropdown-ss mb-0 d-md-inline d-flex justify-content-end">
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
                    data-bs-toggle="modal"
                    data-bs-target="#modalTambahPrasarana"
                    onClick={() => handleClickEdit(data)}
                  >
                    <a className="dropdown-item">
                      <FaPen className="me-2" />
                      <span>Edit</span>
                    </a>
                  </li>
                  <li
                    onClick={() =>
                      handleClickDelete(data?.id)
                    }
                  >
                    <a className="dropdown-item color-danger">
                      <FaTrashAlt className="me-2" />
                      <span>Hapus</span>
                    </a>
                  </li>
                </ul>
              </div>
              {/* Dropdown Option End */}
            </div>
          </div>
        </div>
      </div>
    </div>

    {isLightBoxOpen && (
      <Lightbox
        mainSrc={mainSrc}
        onCloseRequest={() => setIsLightBoxOpen(false)}
      />
    )}
  </>
}

export default ListPrasarana;