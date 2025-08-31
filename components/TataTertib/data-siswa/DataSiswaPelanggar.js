import { FaChevronLeft, FaUser } from "react-icons/fa";
import AnimatePage from "../../Shared/AnimatePage/AnimatePage";
import Link from "next/link";
import { ssURL } from "../../../client/clientAxios";
import LabelStatus from "../../Shared/LabelStatus/LabelStatus";
import { useRouter } from "next/router";
import {
  getDataPelanggar,
  getDetailRombel,
} from "../../../client/TataTertibClient";
import { useEffect, useState } from "react";

const DataSiswaPelanggar = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const [detailRombel, setDetailRombel] = useState({});

  const { siswa, rombel } = detailRombel;

  const _getDetailRombel = async () => {
    const { data } = await getDataPelanggar();
    if (data) {
      setDetailRombel(data);
    }
  };

  useEffect(() => {
    _getDetailRombel();
  }, []);
  console.log(siswa);

  const dataPelanggar = siswa?.data?.map((d) => {
    const jumlahPelanggaran = d?.pelanggaranSiswa?.reduce(
      (curr, array) => curr + array?.poin,
      0
    );
    return { ...d, jumlahPelanggaran };
  });
  console.log(dataPelanggar);

  return (
    // <AnimatePage>
    <div className="col-md-12 col-lg-9 card card-ss ">
      <h4 className="color-dark fw-extrabold mb-0 py-3 px-4">Daftar Siswa</h4>
      <table className="table-ss">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Jumlah Pelanggaran</th>
            <th>Poin</th>
            <th>Sanksi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataPelanggar?.length > 0 ? (
            dataPelanggar
              ?.sort((a, b) => b.jumlahPelanggaran - a.jumlahPelanggaran)
              ?.map((anggota, index) => {
                const jumlahPelanggaran = anggota?.pelanggaranSiswa?.reduce(
                  (curr, array) => curr + array?.poin,
                  0
                );

                return (
                  <tr>
                    <td data-th="No">{index + 1}</td>
                    <td data-th="Nama">{anggota?.nama}</td>
                    <td data-th="Kelas">
                      {anggota?.anggotaRombel?.rombel?.nama}
                    </td>
                    <td data-th="Jumlah Pelanggaran">
                      {anggota?.pelanggaranSiswa?.length > 0
                        ? anggota?.pelanggaranSiswa?.length
                        : "-"}
                    </td>
                    <td data-th="Poin">
                      <h6 className="color-primary mb-0">
                        {jumlahPelanggaran > 0 ? (
                          jumlahPelanggaran
                        ) : (
                          <span className="color-dark">-</span>
                        )}
                      </h6>
                    </td>
                    <td data-th="Sanksi">
                      {anggota?.sanksiSiswa?.length === 0 &&
                        anggota?.pelanggaranSiswa?.length > 0 && (
                          <LabelStatus status="soft-danger">
                            Perlu Tindakan
                          </LabelStatus>
                        )}
                    </td>
                    <td data-th="Aksi">
                      <Link
                        href={`${ssURL}/tata-tertib?menu=data-siswa&nav=data&detail=siswa&id=${anggota?.id}&kelasId=${anggota?.anggotaRombel?.mRombelId}`}
                      >
                        <a className="btn btn-primary-ss rounded-pill px-3 py-1 text-decoration-none fs-12-ss shadow-primary-ss">
                          Lihat
                        </a>
                      </Link>
                    </td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan={6}>Belum ada data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    // </AnimatePage>
  );
};

export default DataSiswaPelanggar;
