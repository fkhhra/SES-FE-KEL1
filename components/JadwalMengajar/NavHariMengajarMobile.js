import React from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";

const NavHariMengajarMobile = ({ listHari, selectedId, rombel }) => {
  const MenuItem = ({ hari, active, kode }) => {
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

    return (
      <a
        className={`d-flex justify-content-center fw-semibold py-2 rounded-pill btn me-3 fs-14-ss ${
          routerHari == kode
            ? "btn-secondary btn-secondary-ss"
            : "btn-outline-secondary btn-outline-secondary-ss"
        }`}
        style={{ width: "100px" }}
        onClick={() => handleChangeHari(kode)}
      >
        {hari}
      </a>
    );
  };

  const Menu = (list, selected) =>
    list?.map((d) => {
      return <MenuItem hari={d.hari} kode={d.kode} />;
    });

  const menu = Menu(listHari, selectedId);

  const Arrow = ({ text, className }) => {
    return <div className={className}>{text}</div>;
  };

  const ArrowLeft = Arrow({
    text: (
      <div
        className="bg-white rounded-circle shadow-dark-ss d-flex justify-content-center align-items-center p-1"
        style={{ height: "40px", width: "40px" }}
      >
        <img
          src={"/img/arrow-rekap-left.svg"}
          style={{ width: "16px", height: "16px" }}
          className="ms-1"
        />
      </div>
    ),
    className: "arrow-prev",
  });
  const ArrowRight = Arrow({
    text: (
      <div
        className="bg-white rounded-circle shadow-dark-ss d-flex justify-content-center align-items-center p-1"
        style={{ height: "40px", width: "40px" }}
      >
        <img
          src={"/img/arrow-rekap-right.svg"}
          style={{ width: "16px", height: "16px" }}
          className="me-1"
        />
      </div>
    ),
    className: "arrow-next",
  });
  return (
    <div
      className="d-md-none d-block sticky-top"
      style={{ top: "95.14px", zIndex: "2" }}
    >
      <div className="card card-ss bg-white py-2 px-4 kelas-rekap slider-rapor slider-peserta-ujian slider-hari-mengajar">
        <ScrollMenu
          hideArrows
          hideSingleArrow
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          clickWhenDrag={false}
          wheel={false}
          translate={2}
          scrollBy={1}
          alignCenter={false}
        />
      </div>
    </div>
  );
};

export default NavHariMengajarMobile;
