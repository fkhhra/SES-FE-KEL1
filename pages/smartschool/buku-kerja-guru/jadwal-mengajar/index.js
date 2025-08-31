import LayoutBukuKerjaDetail from "components/BukuKerjaGuru/LayoutBukuKerjaDetail";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import { useState } from "react";
import { listHari } from "utilities/HelperUtils";

const index = () => {
  const { bukuKerjaDetailData, refetchBukuKerjaDetail, refetchData } =
    useBukuKerjaDetail();
  const { data: datas } = bukuKerjaDetailData || {};

  const [currentHari, setCurrentHari] = useState(new Date().getDay());

  const onClickHari = (kodeHari) => {
    setCurrentHari(kodeHari);
    refetchBukuKerjaDetail(!refetchData, { kodeHari });
  };

  return (
    <LayoutBukuKerjaDetail>
      <h1 className="color-dark fw-black">Jadwal Mengajar</h1>

      <div style={{ width: "12%", height: "3px", background: "#2680EB" }} />

      <div className="card card-ss mt-4">
        <div className="d-flex justify-content-between pt-4 px-4">
          <h4 className="fw-black color-dark fs-32-ss mb-0">Jadwal Mengajar</h4>
          <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column me-4">
            <button
              className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-sm-4`}
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-joyride="btn-filter-kelas"
            >
              {listHari.find((hari) => hari.kode == currentHari)?.hari}
            </button>
            <ul
              className="dropdown-menu dropdown-menu-ss my-1"
              aria-labelledby="dropdownMenuLink"
            >
              {listHari.map((hari, index) => (
                <li
                  key={`${index}-${new Date().getTime()}`}
                  onClick={() => onClickHari(hari?.kode)}
                >
                  <a className="dropdown-item">{hari?.hari}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="table-responsive mt-4">
          <table className="table-ss" data-joyride="table-kegiatan">
            <thead>
              <tr>
                <th>No</th>
                <th>Jam Pelajaran</th>
                <th>Mata Pelajaran</th>
                <th>Kelas</th>
              </tr>
            </thead>
            <tbody>
              {datas?.map((data, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{data?.jamMengajar?.jamFormat || "-"}</td>
                  <td>{data?.mataPelajaran?.nama || "-"}</td>
                  <td>{data?.rombel?.nama || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutBukuKerjaDetail>
  );
};

export default index;
