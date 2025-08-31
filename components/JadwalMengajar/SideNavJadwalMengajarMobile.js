import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { scroller } from "react-scroll";

function SideNavJadwalMengajarMobile({ jamMengajar }) {
  const listJamMengajar =
    jamMengajar?.map(({ jam }, index) => ({
      jam: jam,
      index: index,
      section: `section-${index}`,
    })) || [];

  const [currentJamMengajar, setCurrentJamMengajar] = useState(
    listJamMengajar[0]?.jam
  );

  const currentIndex = listJamMengajar?.findIndex(
    (data) => data?.jam == currentJamMengajar
  );
  const nextTo = `section-${currentIndex + 1}`;
  const prevTo = `section-${currentIndex - 1}`;

  const handleNextPrev = (isNext) => {
    scroller.scrollTo(isNext ? nextTo : prevTo, {
      smooth: true,
      offset: -200,
      spy: true,
      duration: 300,
    });
  };

  useEffect(() => {
    const getActiveLink = () => {
      const activeSection = scroller.getActiveLink();
      const activeJamMengajar = listJamMengajar?.find(
        ({ section }) => section == activeSection
      )?.jam;
      activeJamMengajar && setCurrentJamMengajar(activeJamMengajar);
    };

    window.addEventListener("scroll", getActiveLink, false);

    return () => {
      window.removeEventListener("scroll", getActiveLink, false);
    };
  }, []);

  return (
    <div
      className="w-100 bg-white shadow-dark-ss p-2 d-flex align-items-center justify-content-center sticky-top d-md-none d-block"
      style={{ top: "150.14px", zIndex: "1" }}
    >
      <button
        className="btn btn-outline-secondary btn-outline-secondary-ss border-light-secondary-ss rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: "40px", height: "40px" }}
        onClick={() => handleNextPrev(false)}
      >
        <FaChevronLeft className="fw-bold" style={{ marginRight: "2px" }} />
      </button>
      <h6 className="fw-bold color-dark mb-0 mx-auto">{currentJamMengajar}</h6>
      <button
        className="btn btn-outline-secondary btn-outline-secondary-ss border-light-secondary-ss rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: "40px", height: "40px" }}
        onClick={() => handleNextPrev(true)}
      >
        <FaChevronRight className="fw-bold" style={{ marginLeft: "2px" }} />
      </button>
    </div>
  );
}

export default SideNavJadwalMengajarMobile;
