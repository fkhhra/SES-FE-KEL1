import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ssURL } from "../../../client/clientAxios";
import { getKonsultasi } from "../../../client/KonsultasiClient";
import { momentPackage } from "../../../utilities/HelperUtils";

const TableKunjunganGuru = () => {
  const [bukuKunjungan, setBukuKunjungan] = useState({});
  const { data } = bukuKunjungan;

  const router = useRouter();

  const { query } = router;
  const { nav } = query || "";

  const showDetail = (id) => {
    const path = `${ssURL}/konsultasi?menu=konsultasi-saya&nav=${
      !nav ? "hari-ini" : nav
    }&detail=pengajuan&id=${id}`;
    router.push(path);
  };

  const _getKonsultasiSaya = async () => {
    const { data } = await getKonsultasi({
      tipe: "konsultasi",
      nav: !nav ? "hari-ini" : nav,
    });
    if (data) {
      setBukuKunjungan(data?.bukuKunjungan);
    }
  };

  useEffect(() => {
    _getKonsultasiSaya();
  }, [nav]);

  return (
    <table className="table-ss">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Siswa</th>
          <th>Tanggal Pengajuan</th>
          <th>Keperluan</th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 ? (
          data?.map((dt, index) => (
            <tr key={`${index}-${new Date().getTime()}`}>
              <td data-th="No">{index + 1}</td>
              <td data-th="Nama Siswa">{dt?.user?.nama}</td>
              <td data-th="Tanggal Pengajuan">
                {momentPackage(dt?.createdAt).format("DD MMMM YYYY")}
              </td>
              <td data-th="Keperluan">{dt?.keperluan}</td>
              <td data-th="Detaill">
                <button
                  className="btn btn-primary-ss rounded-pill px-3 py-1 text-decoration-none fs-12-ss shadow-primary-ss"
                  onClick={() => showDetail(dt?.id)}
                >
                  Lihat
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>Belum ada data</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableKunjunganGuru;
