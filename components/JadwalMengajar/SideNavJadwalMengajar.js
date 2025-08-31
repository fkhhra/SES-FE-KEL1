import React from "react";
import { Link as ScrollLink } from "react-scroll";

function SideNavJadwalMengajar({ jamMengajar }) {
  return (
    <div className="side-nav-jadwal-mengajar position-fixed d-md-block d-none">
      {jamMengajar?.map((jamMengajarData, idx) => (
        <ScrollLink
          key={`${idx}-${new Date().getTime()}`}
          className="side-nav-item px-4 py-3 w-100 d-flex align-items-center"
          to={`section-${idx}`}
          offset={-150}
          duration={300}
          activeClass="bg-soft-primary"
          spy
          smooth
        >
          <span
            className="d-flex align-items-center justify-content-center fs-12-ss fw-semibold rounded-circle bg-light-secondary color-secondary p-1 me-3"
            style={{ width: "24px", height: "24px" }}
          >
            {idx + 1}
          </span>
          <span className="fw-bold color-dark">{jamMengajarData?.jam}</span>
        </ScrollLink>
      ))}
    </div>
  );
}

export default SideNavJadwalMengajar;
