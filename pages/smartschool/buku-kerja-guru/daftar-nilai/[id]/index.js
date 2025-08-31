import { getBukuKerjaNilai } from "client/BukuKerjaGuruClient";
import { ssURL } from "client/clientAxios";
import HeaderDaftarNilai from "components/BukuKerjaGuru/HeaderDaftarNilai";
import LayoutDetail from "components/Layout/LayoutDetail";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { FaCloudDownloadAlt } from "react-icons/fa";

const index = ({ rombel_id, mata_pelajaran_id, id, nav }) => {
  const [bukuKehadiranData, setBukuKerjaDetailData] = useState({});
  const [tipe, setTipe] = useState(nav);
  const [pertemuan, setPertemuan] = useState({});

  const { rombelData, timelineAll, jadwalMengajar } = bukuKehadiranData || {};

  const anggotaRombel = jadwalMengajar?.rombel?.anggotaRombel || [];

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
          href={`${ssURL}/buku-kerja-guru/daftar-nilai/${d?.id}?nav=${nav}`}
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

  const _getBukuKerjaNilai = async () => {
    let params = {
      tipe: nav == "tugas" ? "tugas" : "ujian",
      mRombelId: rombel_id,
      mMataPelajaranId: mata_pelajaran_id,
    };
    const { data } = await getBukuKerjaNilai(id, params);
    if (data) {
      setBukuKerjaDetailData(data);
    }
  };

  useEffect(() => {
    _getBukuKerjaNilai();
  }, [tipe, pertemuan?.id, mata_pelajaran_id, rombel_id, tipe, id]);

  useEffect(() => {
    if (timelineAll?.length > 0) {
      setPertemuan({ label: "Pertemuan 1", id: timelineAll?.[0]?.id });
    }
  }, [timelineAll?.length]);

  const navItems = [
    {
      url: `${ssURL}/buku-kerja-guru/daftar-nilai/${id}?nav=tugas`,
      text: "Tugas",
      active: nav == "tugas" || nav == undefined,
      onClick: () => setTipe("tugas"),
    },
    {
      url: `${ssURL}/buku-kerja-guru/daftar-nilai/${id}?nav=ujian`,
      text: "Ujian Harian",
      active: nav == "ujian",
      onClick: () => setTipe("ujian"),
    },
  ];

  return (
    <LayoutDetail
      backProps={`${ssURL}/buku-kerja-guru/daftar-nilai?buku_kerja=3`}
      title="Daftar Nilai"
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

      <HeaderDaftarNilai
        ssURL={ssURL}
        id={id}
        nav={nav}
        setTipeTugas={() => setTipe("tugas")}
        setTipeUjian={() => setTipe("ujian")}
      />

      {/* <Navbar nav={navItems} /> */}

      <div className="card card-ss py-4">
        <div className="d-flex align-items-center justify-content-between px-4">
          <h4 className="fw-black color-dark fs-32-ss mb-0">Daftar Siswa</h4>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-md-3 mb-md-0 mb-3 md-w-100"
              id="exampleFormControlInput1"
              style={{ height: "42px" }}
              placeholder="Cari Siswa"
              autoComplete="off"
              // value={search}
              // onChange={(e) => onChangeSearch(e.target.value)}
              data-joyride="cari-siswa"
            />
            <div className="d-flex flex-column flex-lg-row align-items-lg-center fs-6">
              <button
                className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 me-0 mb-sm-0 mb-3 fw-bold color-secondary fs-14-ss border-light-secondary-ss"
                onClick={() => downloadAnalisisNilai()}
              >
                <FaCloudDownloadAlt className="me-2 fs-6" />
                Rekap
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-ss" data-joyride="table-kegiatan">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th className="text-center">Jumlah Nilai</th>
                <th className="text-center">Dibawah KKM</th>
                <th className="text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              {anggotaRombel?.map((anggota, index) => {
                const { meta } = anggota?.user || {};

                const { jumlahTotal, jumlahKkm, nilaiKosong } = meta || {};

                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{anggota?.user?.nama}</td>
                    <td className="text-md-center text-start">
                      <div
                        className={`label-ss mx-md-auto fs-12-ss fw-bold rounded-pill bg-soft-danger color-danger`}
                        style={{ width: "min-content", whiteSpace: "nowrap" }}
                      >
                        {`${nilaiKosong}/${jumlahTotal} Nilai`}
                      </div>
                    </td>
                    <td className="text-md-center text-start">
                      <div
                        className={`label-ss mx-md-auto fs-12-ss fw-bold rounded-pill ${
                          jumlahKkm > 0
                            ? "bg-soft-danger color-danger"
                            : "bg-soft-success color-success"
                        }`}
                        style={{ width: "min-content", whiteSpace: "nowrap" }}
                      >
                        {jumlahKkm} Nilai
                      </div>
                    </td>
                    <td className="text-md-center text-start">
                      <button
                        className="btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill d-flex justify-content-center align-items-center ms-3 px-4 py-1 hover-shadow-none mx-md-auto"
                        onClick={() =>
                          router.push(
                            `${ssURL}/buku-kerja-guru/daftar-nilai/${id}/user/${anggota?.user?.id}`
                          )
                        }
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
