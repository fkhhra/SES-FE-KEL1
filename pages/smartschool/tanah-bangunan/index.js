import { motion } from "framer-motion";
import Link from "next/link";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";
import FormRombel from "../../../components/Rombel/FormRombel";
import FormTahunAkademik from "../../../components/TahunAkademik/FormTahunAkademik";
import FormBangunan from "../../../components/TanahBangunan/FormBangunan";
import FormTanah from "../../../components/TanahBangunan/FormTanah";
import FormTingkatKerusakanBangunan from "../../../components/TanahBangunan/FormTingkatKerusakanBangunan";
import { whatsappLink } from "../../../utilities/app-helper";

const index = () => {
  return (
    <Layout>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="card card-ss mb-4">
          <div className="card-body p-4">
            <h1 className="h4 mb-4">Tanah</h1>
            <FormTanah form="Tambah" />
            <div className="table-responsive mt-4">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Jenis Prasarana</th>
                    <th>Nama</th>
                    <th>No. Sertifikat Tanah</th>
                    <th>Panjang (m)</th>
                    <th>Lebar (m)</th>
                    <th>
                      Luas (m<sup>2</sup>)
                    </th>
                    <th>
                      Luas Lahan Tersedia (m<sup>2</sup>)
                    </th>
                    <th>Kepemilikan</th>
                    <th>Ket. Tanah</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-th="#">1</td>
                    <td data-th="Jenis Prasarana">Jenis Prasarana</td>
                    <td data-th="Nama">123456789</td>
                    <td data-th="No. Sertifikat Tanah">123456789</td>
                    <td data-th="Panjang (m)">123456789</td>
                    <td data-th="Lebar (m)">123456789</td>
                    <td data-th="Luas (m)">123456789</td>
                    <td data-th="Luas Lahan Tersedia">123456789</td>
                    <td data-th="Kepemilikan">123456789</td>
                    <td data-th="Ket. Tanah">Widianingsih, S.Pd</td>
                    <td className="actions">
                      <FormTanah form="Ubah" />
                      <button className="btn btn-danger rounded-circle">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card card-ss">
          <div className="card-body p-4">
            <h1 className="h4 mb-4">Bangunan</h1>
            <FormBangunan form="Tambah" />
            <div className="table-responsive mt-4">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Jenis Prasarana</th>
                    <th>Nama Tanah</th>
                    <th>Nama</th>
                    <th>Panjang (m)</th>
                    <th>Lebar (m)</th>
                    <th>
                      Luas (m<sup>2</sup>)
                    </th>
                    <th>
                      Luas Lahan Tersedia (m<sup>2</sup>)
                    </th>
                    <th>Kepemilikan</th>
                    <th>Ket. Tanah</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-th="#">1</td>
                    <td data-th="Jenis Prasarana">123456789</td>
                    <td data-th="Nama Tanah">123456789</td>
                    <td data-th="Nama">123456789</td>
                    <td data-th="Panjang (m)">123456789</td>
                    <td data-th="Lebar (m)">123456789</td>
                    <td data-th="Luas (m)">123456789</td>
                    <td data-th="Luas Lahan Tersedia (m)">123456789</td>
                    <td data-th="Kepemilikan">123456789</td>
                    <td data-th="Ket. Tanah">Widianingsih, S.Pd</td>
                    <td className="actions">
                      <FormTingkatKerusakanBangunan />
                      <FormBangunan form="Ubah" />
                      <button className="btn btn-danger rounded-circle">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
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
