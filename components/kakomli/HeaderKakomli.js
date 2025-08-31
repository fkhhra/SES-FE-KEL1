import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import { getPenerimaanPkl } from "client/PenerimaanClient";
import SelectShared from "components/Shared/SelectShared/SelectShared";

const HeaderKakomli = ({
  children,
  ssURL,
  id,
  type,
  semuaTA,
  ta,
  tipeTa,
  changeTA,
}) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navMenus = [
    {
      href: `${ssURL}/kakomli/prakerin`,
      as: `${ssURL}/kakomli/prakerin`,
      text: "Prakerin",
      active: `${ssURL}/kakomli/prakerin`,
    },
    {
      href: `${ssURL}/kakomli/ukk`,
      as: `${ssURL}/kakomli/ukk`,
      text: "UKK",
      active: `${ssURL}/kakomli/ukk`,
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
          <div
            className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
            style={{ background: `rgba(244,244,247,0.3)` }}
          >
            <div className="kelas-nav d-flex flex-column flex-lg-row">
              {navMenus.map((d) => {
                return (
                  <Link href={d.href} as={d.as}>
                    <a
                      className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                        activeMenu == d.active
                          ? "color-primary"
                          : "color-secondary"
                      }`}
                      data-joyride={d.dataJoyride || ""}
                    >
                      {d.text}
                    </a>
                  </Link>
                );
              })}
            </div>
            <div className="col-md-3">
              <div className="select-perencanaan-analisis-keuangan flex-grow-1">
                <SelectShared
                  name="selectTa"
                  placeholder="Pilih tahun akademik"
                  handleChangeSelect={changeTA}
                  value={tipeTa?.value || ta.id}
                  options={semuaTA?.map((d) => {
                    return {
                      label: `${d?.tahun} - ${d?.semester}`,
                      value: d?.id,
                    };
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderKakomli;
