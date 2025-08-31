import Link from "next/link";
import React from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { FaPen } from "react-icons/fa";
import { ssURL } from "../../client/clientAxios";
import {
  checkIconLihatRapor,
  checkLabelStatusLihatRapor,
  checkStatusLihatRapor,
  jumlahNilaiDibawah,
} from "../../utilities/RaporUtils";
import CardDaftarAlumni from "./CardDaftarAlumni";

const ScrollMenuDetailAlumni = ({
  rombel,
  selectedId,
  listAlumni,
  jadwalId,
  listKKM,
  totalMapel,
  setFormData,
  formData,
  jenisRapor,
}) => {
  const MenuItem = ({ id, data, active }) => {
    return (
      <Link href={`${ssURL}/alumni/${data?.id}`}>
        <div
          className={`border border-1 border-light-secondary rounded-ss p-3 position-relative card-rapor-siswa pointer me-3 d-flex ${
            active && " bg-soft-primary"
          }`}
          style={{ width: "400px" }}
          key={id}
        >
          <img
            //   src={data?.user?.avatar || "/img/cover-sma-smk.svg"}
            src={
              data?.user?.avatar != null
                ? dataAlumni?.user?.avatar
                : "/img/cover-sma-smk.svg"
            }
            className="me-3 rounded-ss img-fit-cover"
            width="75px"
            height="100px"
            alt=""
          />
          <div className="flex-grow-1">
            <div className="h-100 d-flex flex-column justify-content-between">
              <div>
                <p className="fs-18-ss fw-extrabold mb-0 color-dark clamp-1">
                  {data?.user?.nama}
                </p>
                <p className="fs-14-ss fw-semi-bold clamp-2 mb-0">
                  {/* Sistem Informatika Jaringan dan Aplikasi */}
                  {data?.jurusan}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className={`fs-12-ss fw-semibold color-primary`}>
                  Angkatan {data?.tahunMasuk}
                </span>

                <img
                  src={`/img/icon-alumni-${
                    data?.status == "bekerja"
                      ? "bekerja"
                      : data?.status == "kuliah"
                      ? "kuliah"
                      : data?.status == "mencari-kerja"
                      ? "mencari-kerja"
                      : data?.status == "berwirausaha"
                      ? "berwirausaha"
                      : ""
                  }.svg`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const Menu = (list, selected) =>
    list
      ?.sort((a, b) => ("" + a?.user?.nama).localeCompare(b?.user?.nama))
      ?.map((el, idx) => {
        return <MenuItem id={el.id} data={el} active={el.id == selected} />;
      });

  const menu = Menu(listAlumni, selectedId);

  const Arrow = ({ text, className }) => {
    return <div className={className}>{text}</div>;
  };

  const ArrowLeft = Arrow({
    text: (
      <div
        className="bg-white rounded-circle shadow-dark-ss d-flex justify-content-center align-items-center p-1"
        style={{ height: "60px", width: "60px" }}
      >
        <img src={"/img/arrow-rekap-left.svg"} className="ms-1" />
      </div>
    ),
    className: "arrow-prev",
  });
  const ArrowRight = Arrow({
    text: (
      <div
        className="bg-white rounded-circle shadow-dark-ss d-flex justify-content-center align-items-center p-1"
        style={{ height: "60px", width: "60px" }}
      >
        <img src={"/img/arrow-rekap-right.svg"} className="me-1" />
      </div>
    ),
    className: "arrow-next",
  });
  return (
    <div className="col-12">
      <div className="card card-ss bg-white p-4 kelas-rekap slider-rapor">
        <ScrollMenu
          hideArrows={true}
          hideSingleArrow={true}
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          clickWhenDrag={false}
          // selected={selected}
          // onSelect={onSelect}
          wheel={false}
          translate={2}
          scrollBy={1}
          alignCenter={false}
        />
      </div>
    </div>
  );
};

export default ScrollMenuDetailAlumni;
