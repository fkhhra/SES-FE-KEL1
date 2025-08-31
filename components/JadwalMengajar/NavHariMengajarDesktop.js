import ctl from "@netlify/classnames-template-literals";
import { ssURL } from "client/clientAxios";
import { useRouter } from "next/router";
import React from "react";

const NavHariMengajarDesktop = ({ listHari }) => {
  const router = useRouter();

  const { tingkat, id, jadwal_mengajar_id, hari: routerHari } = router.query;

  const handleChangeHari = (kodeHari) => {
    const queryParams = {
      tingkat: tingkat,
      hari: kodeHari,
    };

    router.replace({
      pathname: `${ssURL}/tahun-akademik/${id}/jadwal-mengajar/${jadwal_mengajar_id}`,
      query: { ...router.query, hari: kodeHari },
    });
  };

  const hariCN = (kode) => {
    return ctl(`
      d-flex
      justify-content-center
      fw-semibold 
      py-2
      me-lg-4
      me-md-3
      me-4
      rounded-pill
      btn
      ${
        (
          routerHari == undefined
            ? new Date().getDay() == kode
            : routerHari == kode
        )
          ? "btn-secondary btn-secondary-ss"
          : "btn-outline-secondary btn-outline-secondary-ss"
      }
    `);
  };

  return (
    <div
      className="w-100 bg-white shadow-dark-ss sticky-top d-md-block d-none"
      style={{ top: "81.19px" }}
      id="nav-hari-desktop"
    >
      <div className="mx-auto py-2">
        <div className="d-flex justify-content-center align-items-center">
          {listHari.map(({ hari, kode }, index) => (
            <a
              key={`${index}-${new Date().getTime()}`}
              className={hariCN(kode)}
              style={{ width: "100px" }}
              onClick={() => handleChangeHari(kode)}
            >
              {hari}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavHariMengajarDesktop;
