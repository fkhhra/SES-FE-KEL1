import React from "react";
import Navbar from "components/Shared/Navbar/Navbar";
import { FaPlus } from "react-icons/fa";

const NavPembayaran = ({ navItems, setEditData, settipePembayaran }) => {
  return (
    <Navbar
      nav={navItems}
      action={[
        {
          button: (
            <>
              <div className="dropdown dropdown-ss d-flex flex-column">
                <div
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                  data-joyride="button-buat-pembayaran"
                >
                  <div>
                    <FaPlus className="me-2" />
                    Buat Pembayaran
                  </div>
                </div>
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <a
                      className="dropdown-item pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#modalBuatPembayaran"
                      onClick={() => {
                        settipePembayaran("spp");
                        setEditData(0);
                      }}
                    >
                      <span>SPP</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#modalBuatPembayaran"
                      onClick={() => {
                        settipePembayaran("ujian");
                        setEditData(0);
                      }}
                    >
                      <span>Ujian</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#modalBuatPembayaran"
                      onClick={() => {
                        settipePembayaran("lainnya");
                        setEditData(0);
                      }}
                    >
                      <span>Lainnya</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#modalBuatPembayaran"
                      onClick={() => {
                        settipePembayaran("khusus");
                        setEditData(0);
                      }}
                    >
                      <span>Khusus</span>
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ),
        },
      ]}
    />
  );
};

export default NavPembayaran;
