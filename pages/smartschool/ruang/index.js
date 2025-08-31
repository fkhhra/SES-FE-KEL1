import { motion } from "framer-motion";
import Link from "next/link";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";
import FormRombel from "../../../components/Rombel/FormRombel";
import FormTahunAkademik from "../../../components/TahunAkademik/FormTahunAkademik";
import FormBangunan from "../../../components/TanahBangunan/FormBangunan";
import FormTanah from "../../../components/TanahBangunan/FormTanah";
import FormRuang from "../../../components/Ruang/FormRuang";
import FormTingkatKerusakanBangunan from "../../../components/TanahBangunan/FormTingkatKerusakanBangunan";
import { whatsappLink } from "../../../utilities/app-helper";
import FormTingkatKerusakanRuang from "../../../components/Ruang/FormTingkatKerusakanRuang";

const index = () => {
  const data = [
    {
      jenis: "Ruang Teori/Kelas",
      bangunan: "Bangunan 1",
      ruang: "Ruang 1",
      kode: "R1",
      lantai: 1,
      panjang: 10,
      lebar: 10,
      luas: 100,
    },
    {
      jenis: "Ruang Teori/Kelas",
      bangunan: "Bangunan 1",
      ruang: "Ruang 2",
      kode: "R2",
      lantai: 1,
      panjang: 10,
      lebar: 10,
      luas: 100,
    },
    {
      jenis: "Ruang Teori/Kelas",
      bangunan: "Bangunan 1",
      ruang: "Ruang 3",
      kode: "R3",
      lantai: 1,
      panjang: 10,
      lebar: 10,
      luas: 100,
    },
    {
      jenis: "Ruang Teori/Kelas",
      bangunan: "Bangunan 1",
      ruang: "Ruang 4",
      kode: "R4",
      lantai: 1,
      panjang: 10,
      lebar: 10,
      luas: 100,
    },
    {
      jenis: "Ruang Teori/Kelas",
      bangunan: "Bangunan 1",
      ruang: "Ruang 5",
      kode: "R5",
      lantai: 2,
      panjang: 10,
      lebar: 10,
      luas: 100,
    },
  ];
  return (
    <Layout>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h1 className="h4 mb-4">Ruang</h1>
            <div className="d-flex">
              <FormRuang form="Tambah" />
              <div className="dropdown">
                <a
                  className="btn btn-secondary dropdown-toggle rounded-pill"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Pilih Ruang
                </a>

                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <a className="dropdown-item">Ruang Kelas</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Ruang Kepsek/Guru</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Ruang Laboratorium</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Ruang Perpustakaan</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Ruang Prakter/Bengkel</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Ruang Penunjang</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="table-responsive mt-4">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>Jenis Prasarana</th>
                    <th>Bangunan</th>
                    <th>Nama</th>
                    <th>Kode</th>
                    <th>Lantai Ke-</th>
                    <th>Panjang (m)</th>
                    <th>Lebar (m)</th>
                    <th>
                      Luas (m<sup>2</sup>)
                    </th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((data, idx) => {
                    return (
                      <tr key={`${idx}-${new Date().getTime()}`}>
                        <td data-th="Jenis Prasarana">{data.jenis}</td>
                        <td data-th="Bangunan">{data.bangunan}</td>
                        <td data-th="Nama">{data.ruang}</td>
                        <td data-th="Kode">{data.kode}</td>
                        <td data-th="Lantai Ke-">{data.lantai}</td>
                        <td data-th="Panjang (m)">{data.panjang}</td>
                        <td data-th="Lebar (m)">{data.lebar}</td>
                        <td data-th="Luas (m)">{data.luas}</td>
                        <td>
                          <FormTingkatKerusakanRuang />
                          <FormRuang form="Ubah" />
                          <button className="btn btn-danger rounded-circle">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default index;
