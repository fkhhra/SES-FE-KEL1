import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { DatePicker } from "antd";
import { restructureAbsenKegiatanData } from "components/Kelas/KelasHelper";
import { getDetailRombel } from "client/RombelClient";
import { uuid } from "uuidv4";

import isEmpty from "lodash/isEmpty";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import KelasHeader from "components/Kelas/KelasHeader";
import EmptyStateKelasKegiatan from "components/Kelas/EmptyStateKelasKegiatan";
import SkeletonKegiatan from "components/Kelas/Skeleton/SkeletonKegiatan";
import AnimateHeight from "react-animate-height";
import { getAbsenKegiatan } from "client/KegiatanClient";
import CardAbsenKegiatan from "components/Kelas/CardAbsenKegiatan";
import { momentPackage, optionBulan } from "utilities/HelperUtils";

const index = ({ id }) => {

  const [kegiatan, setKegiatan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdownMataPelajaran, setShowDropdownMataPelajaran] = useState(0);
  const [detailRombel, setDetailRombel] = useState({});
  const [mataPelajaranId, setMataPelajaranId] = useState("pilih_semua");
  const [tanggalMulai, setTanggalMulai] = useState(momentPackage().format("YYYY-MM-DD"));
  const [tanggalSelesai, setTanggalSelesai] = useState(momentPackage().format("YYYY-MM-DD"));

  let mapelOptions = [
    { value: "pilih_semua", label: "Semua Mata Pelajaran" }
  ]

  detailRombel?.mapelKelas?.map(mapel => {
    mapelOptions.push({
      value: mapel?.mataPelajaran?.id,
      label: mapel?.mataPelajaran?.nama
    });
  });

  const handleChangeDate = (date) => {
    setTanggalMulai(date?.[0] ? date?.[0].format("YYYY-MM-DD") : "");
    setTanggalSelesai(date?.[1] ? date?.[1].format("YYYY-MM-DD") : "");
  }

  const getDetailRombelData = async () => {
    let params = { kode_hari: new Date().getDay() }
    const { data } = await getDetailRombel(id, params);

    if (data) {
      setDetailRombel(data);
    }
  };

  const formatDate = (dateString) => {
    const arrayTanggalKegiatan = dateString.split(" ");
    const newFormatTanggal = `${arrayTanggalKegiatan?.[2]}-${optionBulan.find(({ string }) => string === arrayTanggalKegiatan?.[1])?.number}-${arrayTanggalKegiatan?.[0]}`;
    return newFormatTanggal;
  }

  const _getAbsenKegiatan = async () => {
    setLoading(true);
    let params = {
      mJadwalMengajarId: id,
      waktuMulai: tanggalMulai,
      waktuSelesai: tanggalSelesai,
    }

    if (mataPelajaranId != "pilih_semua") {
      params.mMataPelajaranId = mataPelajaranId
    }

    const { data } = await getAbsenKegiatan(params);
    if (data) {
      const newData = restructureAbsenKegiatanData(data?.timeline, detailRombel);

      let sortedKegiatan = {};
      const sortedTanggalKegiatan = Object.keys(newData).sort((a, b) => {
        return new Date(formatDate(b)) - new Date(formatDate(a));
      });

      sortedTanggalKegiatan.map(tanggalKegiatan => {
        sortedKegiatan[tanggalKegiatan] = newData[tanggalKegiatan]
      });

      setKegiatan(sortedKegiatan);
    }
    setLoading(false);
  }

  useEffect(() => {
    getDetailRombelData();
  }, []);

  useEffect(() => {
    if (detailRombel) {
      _getAbsenKegiatan();
    }
  }, [mataPelajaranId, tanggalMulai, tanggalSelesai]);

  return (
    <Layout>
      <AnimatePage>
        <KelasHeader id={id} />
        
        <div className="card card-ss px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0 fw-extrabold color-dark">Daftar Kegiatan</h4>
            <div className="d-flex align-items-center">
              {/* <button className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 me-0 mb-sm-0 mb-3 fw-bold color-secondary">
                <FaCloudDownloadAlt className="me-2 fs-6" />
                Rekap Kegiatan
              </button> */}
              <DatePicker.RangePicker
                className="rounded-pill d-flex align-items-center date-picker-mutasi"
                style={{
                  height: "42px",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                }}
                placeholder={["Tanggal Mulai", "Tanggal Selesai"]}
                format="DD-MM-YYYY"
                onChange={(date) => handleChangeDate(date)}
                value={[
                  tanggalMulai ? momentPackage(tanggalMulai) : "",
                  tanggalSelesai ? momentPackage(tanggalSelesai) : "",
                ]}
              />
              <button className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border color-secondary fw-bold ms-3 ${showDropdownMataPelajaran ? "active" : ""}`} onClick={() => setShowDropdownMataPelajaran(showDropdownMataPelajaran === 0 ? "auto" : 0)}>
                <FaFilter className="me-3" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <AnimateHeight height={showDropdownMataPelajaran}>
          <div className="row gy-4 justify-content-center">
            <div className="col-lg-10">
              <div className="mt-4">
                <label className="form-label">Mata Pelajaran</label>
                <SelectShared
                  placeholder="Mata Pelajaran"
                  customControlClass="bg-transparent"
                  handleChangeSelect={(e) => setMataPelajaranId(e.value)}
                  value={mataPelajaranId}
                  options={mapelOptions.filter(mapel => mapel.label)}
                />
              </div>
            </div>
          </div>
        </AnimateHeight>

        <div className="row gy-4 justify-content-center mt-2">
          { loading
            ? <SkeletonKegiatan />
            : !isEmpty(kegiatan)
            ? Object.keys(kegiatan).map((tanggalKegiatan, index) => {
              return (
                <CardAbsenKegiatan
                  key={uuid()}
                  id={id}
                  kegiatan={kegiatan}
                  tanggalKegiatan={tanggalKegiatan}
                  mataPelajaran={kegiatan[tanggalKegiatan]}
                />
              )
            })
            : <EmptyStateKelasKegiatan showButtonTambahKegiatan={false} />
          }
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id
    },
  };
}

export default index;
