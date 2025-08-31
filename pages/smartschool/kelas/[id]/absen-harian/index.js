import { FaCloudDownloadAlt } from "react-icons/fa";
import KelasHeader from "components/Kelas/KelasHeader";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { DatePicker } from "antd";
import { getAbsenRombelWalas } from "client/KegiatanClient";
import { useEffect, useState } from "react";
import { momentPackage } from "utilities/HelperUtils";
import ModalRekapAbsenHarian from "components/Kelas/ModalRekapAbsenHarian";
import { showModal } from "utilities/ModalUtils";
import TableAbsenKehadiran from "components/Kelas/TableAbsenKehadiran";
import ModalKeteranganAbsenHarian from "components/Kelas/ModalKeteranganAbsenHarian";
import { useDebounce } from "use-debounce";

const index = ({ id }) => {
  const [tanggal, setTanggal] = useState(momentPackage());
  const [userData, setUserData] = useState([]);
  const [absen, setAbsen] = useState(null);
  const [kelas, setKelas] = useState("");
  const [rombelId, setRombelId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 500);

  const { hadir = 0, izin = 0, sakit = 0, alpa = 0 } = absen || {};

  const _getDataWargaSekolah = async () => {
    setIsLoading(true);
    let params = {
      role: "siswa",
      jenis: "kehadiran",
      tanggal: tanggal.format("YYYY-MM-DD"),
      rombelId: rombelId,
      search: search
    };
    const { data } = await getAbsenRombelWalas(params);
    if (data) {
      setUserData(data?.absenUser);
      setAbsen(data?.absen);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (rombelId) {
      _getDataWargaSekolah();
    }
  }, [tanggal, rombelId, debounceSearch]);

  const tableData =
    userData?.map((data, index) => {
      const absenData = data?.absen?.[0] || {};
      return {
        no: index + 1,
        id: data?.id,
        nama: data?.nama,
        fotoMasuk: absenData?.fotoMasuk,
        waktuMasuk: absenData?.createdAt,
        lokasiMasuk: JSON.parse(absenData?.lokasiMasuk || "null"),
        fotoPulang: absenData?.fotoPulang,
        waktuPulang: absenData?.waktuPulang,
        lokasiPulang: JSON.parse(absenData?.lokasiPulang || "null"),
        status: absenData?.absen ? absenData?.absen : "alpa",
        sudahAbsenPulang: absenData?.waktuPulang && absenData?.fotoPulang,
        createdAt: absenData?.createdAt,
        keterangan: absenData?.keterangan,
        lampiran: absenData?.lampiran || [],
        whatsapp: data?.whatsapp,
        // allDataAbsen: absenData
      };
    }) || [];

  return (
    <Layout>
      <AnimatePage>
        <KelasHeader id={id} setKelas={setKelas} setRombelId={setRombelId} />
        <div className="card card-ss">
          <div className="d-flex align-lg-items-center justify-content-between pt-4 px-4 mb-4 flex-lg-row flex-column">
            <h4 className="mb-lg-0 fw-extrabold color-dark">Kehadiran Siswa</h4>
            <div className="d-flex align-items-md-center flex-md-row flex-column">
              <button
                className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-md-3 me-0 mb-md-0 mb-3 fw-bold color-secondary border-light-secondary-ss"
                onClick={() => showModal("modalRekapAbsenHarian")}
              >
                <FaCloudDownloadAlt className="me-2 fs-6" />
                Rekap Absen
              </button>
              <input
                type="text"
                className="form-control form-search rounded-pill fw-semibold border-secondary-ss mb-md-0 mb-3 me-md-3 md-w-100"
                style={{ height: "42px" }}
                id="exampleFormControlInput1"
                placeholder="Cari siswa"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <DatePicker
                onChange={(date) => setTanggal(date)}
                placeholder="Pilih tanggal"
                className="rounded-pill d-flex align-items-center date-picker-mutasi py-2 px-4"
                autoComplete="off"
                value={tanggal}
              />
            </div>
          </div>

          <div
            className="mx-4 mb-4 status-info px-4 p-3 pb-md-3 pb-0 bg-very-soft-secondary-2 rounded-ss d-flex mb-3 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
            data-joyride="informasi-absen"
          >
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Hadir</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${hadir}/${userData?.length || 0} Siswa`}
              </p>
            </div>
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Izin</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${izin} Siswa`}
              </p>
            </div>
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Sakit</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${sakit} Siswa`}
              </p>
            </div>
            <div className="status-info-items mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Alpa</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${alpa} Siswa`}
              </p>
            </div>
          </div>

          <TableAbsenKehadiran tableData={tableData} isLoading={isLoading} />
        </div>
        <ModalKeteranganAbsenHarian />
        <ModalRekapAbsenHarian rombelId={rombelId} />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
