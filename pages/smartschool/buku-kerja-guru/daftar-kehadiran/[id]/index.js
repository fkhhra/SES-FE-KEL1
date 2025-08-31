import { getBukuKerjaKehadiran } from "client/BukuKerjaGuruClient";
import { ssURL } from "client/clientAxios";
import LayoutDetail from "components/Layout/LayoutDetail";
import { useState } from "react";
import { useEffect } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Link from "next/link";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";
import HeaderDaftarKehadiran from "components/BukuKerjaGuru/HeaderDaftarKehadiran";

const index = ({ rombel_id, mata_pelajaran_id, id, nav }) => {
  const [bukuKehadiranData, setBukuKerjaDetailData] = useState({});
  const [tipe, setTipe] = useState(nav);
  const [pertemuan, setPertemuan] = useState({});

  const {
    rombelData,
    siswa: siswas,
    jumlahPertemuan,
    timelineAll,
    timeline,
  } = bukuKehadiranData || {};

  const opsiPertemuan =
    timelineAll?.map((data, index) => {
      return {
        label: `Pertemuan ${index + 1}`,
        value: data?.id,
      };
    }) || [];

  const Kegiatan = (data) => {
    return data?.map((d, idx) => {
      const active = id == d?.id;

      return (
        <Link
          href={`${ssURL}/buku-kerja-guru/daftar-kehadiran/${d?.id}?rombel_id=${d?.rombel?.id}&mata_pelajaran_id=${d?.mataPelajaran?.id}`}
        >
          <a
            style={{
              padding: "16px 24px",
              minWidth: "242px",
              border: `1px solid ${active ? "#2680EB" : "#E1E1E7"}`,
              display: "block",
            }}
            className={`rounded-ss me-3 ${active ? "bg-soft-primary" : ""}`}
          >
            <h4 className="color-dark fw-extrabold fs-18-ss">
              {d?.rombel?.nama}
            </h4>
            <p className="color-secondary fw-semibold fs-14-ss mb-0">
              {d?.mataPelajaran?.nama}
            </p>
          </a>
        </Link>
      );
    });
  };

  const menu = Kegiatan(rombelData);

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

  const _getBukuKerjaKehadiran = async () => {
    let params = {
      tipe: tipe,
      mRombelId: rombel_id,
      mMataPelajaranId: mata_pelajaran_id,
      pertemuanId: pertemuan?.id,
    };
    const { data } = await getBukuKerjaKehadiran(params);
    if (data) {
      setBukuKerjaDetailData(data);
    }
  };

  useEffect(() => {
    _getBukuKerjaKehadiran();
  }, [tipe, pertemuan?.id, mata_pelajaran_id, rombel_id]);

  useEffect(() => {
    if (timelineAll?.length > 0) {
      setPertemuan({ label: "Pertemuan 1", id: timelineAll?.[0]?.id });
    }
  }, [timelineAll?.length]);

  return (
    <LayoutDetail
      backProps={`${ssURL}/buku-kerja-guru/daftar-kehadiran?buku_kerja=3`}
      title="Daftar Kehadiran"
    >
      <div className="card card-ss mb-4 p-3">
        <ScrollMenu
          hideArrows={true}
          hideSingleArrow={true}
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          clickWhenDrag={false}
          // selected={page}
          //   onSelect={onSelect}
          wheel={false}
          translate={2}
          scrollBy={1}
          alignCenter={false}
        />
      </div>

      <HeaderDaftarKehadiran
        ssURL={ssURL}
        id={id}
        rombel_id={rombel_id}
        mata_pelajaran_id={mata_pelajaran_id}
        setTipeRekap={() => setTipe("rekap")}
        setTipePertemuan={() => setTipe("pertemuan")}
        nav={nav}
      />

      <div className="card card-ss py-4">
        <div className="d-flex align-items-center justify-content-between px-4">
          <h4 className="fw-black color-dark fs-32-ss mb-0">
            {nav == "rekap" || !nav
              ? "Rekap Kehadiran Keseluruhan"
              : "Daftar Kehadiran Pertemuan "}
          </h4>
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column flex-lg-row align-items-lg-center fs-6">
              <button
                className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss border-light-secondary-ss rounded-pill me-sm-3 me-0 mb-sm-0 mb-3 fw-bold color-secondary fs-14-ss"
                onClick={() => downloadAnalisisNilai()}
              >
                <FaCloudDownloadAlt className="me-2 fs-6" />
                Unduh
              </button>
            </div>
            {nav == "pertemuan" && (
              <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column me-4">
                <button
                  className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-sm-4`}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-joyride="btn-filter-kelas"
                >
                  {pertemuan?.label}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1"
                  aria-labelledby="dropdownMenuLink"
                >
                  {opsiPertemuan?.map((data) => (
                    <li
                      key={data?.value}
                      onClick={() =>
                        setPertemuan({ label: data?.label, id: data?.value })
                      }
                    >
                      <a
                        className="dropdown-item"
                        // onClick={(e) => setJenisRapor("tengahSemester")}
                      >
                        {data?.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {nav == "pertemuan" && (
          <div className="row px-4 mb-4">
            <div className="col-md-8 mt-4">
              <div
                className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100"
                style={{ backgroundColor: "#f8f8fb" }}
              >
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">Hadir</h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    0 Siswa
                  </h4>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">Sakit</h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    0 Siswa
                  </h4>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">Izin</h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    0 Siswa
                  </h4>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">Alpa</h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    0 Siswa
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-4 ">
              <div
                className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100"
                style={{ backgroundColor: "#f8f8fb" }}
              >
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">Tanggal</h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    {timeline?.tanggalPertemuan || "-"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {nav == "rekap" || !nav ? (
          <div className="d-flex align-items-center mt-4 px-4">
            <img
              src="/img/icon-role-guru.svg"
              alt="icon-role-guru"
              style={{ width: "24px", height: "24px" }}
              className="me-2"
            />
            <div className="d-flex align-items-center">
              <p className="mb-0 fw-semibold fs-16-ss color-dark">
                Jumlah Total :
              </p>
              &nbsp;
              <p className="mb-0 fw-extrabold fs-16-ss color-dark">
                {`${jumlahPertemuan} Pertemuan`}
              </p>
            </div>
          </div>
        ) : (
          ""
        )}

        {nav == "rekap" || !nav ? (
          <div className="table-responsive mt-4">
            <table className="table-ss" data-joyride="table-kegiatan">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Hadir</th>
                  <th>Sakit</th>
                  <th>Izin</th>
                  <th>Alpha</th>
                  <th>Persentase</th>
                </tr>
              </thead>
              <tbody>
                {siswas?.map((siswa, index) => {
                  const { meta } = siswa;
                  const { hadir, sakit, izin, alpa } = meta || {};

                  const peresentaseKehadiran = (hadir / jumlahPertemuan) * 100;

                  return (
                    <tr key={siswa?.id}>
                      <td>{index + 1}</td>
                      <td>{siswa?.nama}</td>
                      <td>{hadir}</td>
                      <td>{izin}</td>
                      <td>{sakit}</td>
                      <td>{alpa}</td>
                      <td>{`${peresentaseKehadiran}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-responsive mt-4">
            <table className="table-ss" data-joyride="table-kegiatan">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Waktu Absen</th>
                </tr>
              </thead>
              <tbody>
                {timeline?.tkTimeline?.map((data, index) => {
                  let status;

                  if (data.absen == "izin") {
                    status = (
                      <>
                        <div
                          className={`label-ss fs-12-ss fw-bold rounded-pill bg-soft-warning color-warning`}
                          style={{ width: "min-content" }}
                        >
                          Izin
                        </div>
                      </>
                    );
                  } else if (!data.absen) {
                    status = (
                      <>
                        <div
                          className={`label-ss fs-12-ss fw-bold rounded-pill bg-soft-danger color-danger`}
                          style={{ width: "min-content" }}
                        >
                          Alpa
                        </div>
                      </>
                    );
                  } else if (data.absen == "hadir") {
                    status = (
                      <>
                        <div
                          className={`label-ss fs-12-ss fw-bold rounded-pill bg-soft-${
                            timeline.tanggalAkhir
                              ? momentPackage(data.updatedAt).utcOffset(7) <
                                momentPackage(timeline.tanggalAkhir).utcOffset(
                                  7
                                )
                                ? "primary"
                                : "warning"
                              : "primary"
                          } `}
                          style={{ width: "min-content" }}
                        >
                          {timeline.tanggalAkhir
                            ? momentPackage(data.updatedAt).utcOffset(7) <
                              momentPackage(timeline.tanggalAkhir).utcOffset(7)
                              ? "Hadir"
                              : "Telat"
                            : "Hadir"}
                        </div>
                      </>
                    );
                  } else if (data.absen == "sakit") {
                    status = (
                      <>
                        <div className="label-ss bg-soft-warning color-warning rounded-pill d-flex justify-content-center align-items-center me-3">
                          Sakit
                        </div>
                        <button
                          className="btn btn-ss btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center"
                          // data-bs-toggle="modal"
                          // data-bs-target="#keteranganAbsen"
                          // onClick={() => setAbsenSiswa(d)}
                        >
                          Keterangan
                        </button>
                      </>
                    );
                  }

                  return (
                    <tr key={data?.id}>
                      <td>{index + 1}</td>
                      <td>{data?.user?.nama}</td>
                      <td>{status}</td>
                      <td>{data.waktuAbsen}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LayoutDetail>
  );
};

export async function getServerSideProps({
  query: { id, rombel_id, mata_pelajaran_id, nav },
}) {
  return {
    props: {
      rombel_id: rombel_id || null,
      mata_pelajaran_id: mata_pelajaran_id || null,
      id: id || null,
      nav: nav || null,
    },
  };
}

export default index;
