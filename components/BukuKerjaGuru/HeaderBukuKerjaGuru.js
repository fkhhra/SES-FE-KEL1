import { ssURL } from "client/clientAxios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const HeaderBukuKerjaGuru = ({ currentUser, currentUserRppCount }) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const { user_id } = router.query;

  const { id: currentUserId } = currentUser || {};

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navMenus = [
    {
      href: `${ssURL}/pengawasan/buku-kerja-1?user_id=${
        currentUserId || user_id
      }`,
      as: `${ssURL}/pengawasan/buku-kerja-1?user_id=${
        currentUserId || user_id
      }`,
      text: "Buku Kerja 1",
      active: `${ssURL}/pengawasan/buku-kerja-1`,
    },
    {
      href: `${ssURL}/pengawasan/buku-kerja-2?user_id=${
        currentUserId || user_id
      }`,
      as: `${ssURL}/pengawasan/buku-kerja-2?user_id=${
        currentUserId || user_id
      }`,
      text: "Buku Kerja 2",
      active: `${ssURL}/pengawasan/buku-kerja-2`,
    },
    {
      href: `${ssURL}/pengawasan/buku-kerja-3?user_id=${
        currentUserId || user_id
      }`,
      as: `${ssURL}/pengawasan/buku-kerja-3?user_id=${
        currentUserId || user_id
      }`,
      text: "Buku Kerja 3",
      active: `${ssURL}/pengawasan/buku-kerja-3`,
    },
    {
      href: `${ssURL}/pengawasan/buku-kerja-4?user_id=${
        currentUserId || user_id
      }`,
      as: `${ssURL}/pengawasan/buku-kerja-4?user_id=${
        currentUserId || user_id
      }`,
      text: "Buku Kerja 4",
      active: `${ssURL}/pengawasan/buku-kerja-4`,
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
            <div
              className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
              style={{
                minHeight: "150px",
                background: `url("/img/bg-header-buku-kerja-guru.png")`,
                backgroundPositionX: "right",
                backgroundPositionY: "bottom",
              }}
            >
              <div
                className="rounded-circle shadow-primary-ss"
                style={{ width: "86px", height: "86px" }}
              >
                <img
                  src="/img/icon-buku-kerja-guru.svg"
                  alt=""
                  style={{ width: "86px", height: "86px" }}
                />
              </div>
              <div className="ms-md-4 ms-0 mt-md-0 mt-4">
                <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                  {currentUser?.nama}
                </h2>
                <p className="fs-6 fw-bold mb-0">
                  {currentUserRppCount} / 27 Instrumen
                </p>
              </div>
            </div>
            <div
              className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
              style={{ background: `rgba(244,244,247,0.3)` }}
            >
              <div className="kelas-nav d-flex flex-column flex-lg-row">
                {navMenus.map((d) => {
                  return (
                    <div
                      onClick={() => router.replace(d?.href)}
                      className={`position-relative pointer text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                        activeMenu == d.active
                          ? "color-primary"
                          : "color-secondary"
                      }`}
                      data-joyride={d.dataJoyride || ""}
                    >
                      {d.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderBukuKerjaGuru;
