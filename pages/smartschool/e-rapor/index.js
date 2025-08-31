import { motion } from "framer-motion";
import Link from "next/link";
import { FaFile, FaPrint, FaTrash, FaWhatsapp } from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";
import FormMataPelajaran from "../../../components/MataPelajaran/FormMataPelajaran";
import FormTahunAkademik from "../../../components/TahunAkademik/FormTahunAkademik";
import { whatsappLink } from "../../../utilities/app-helper";

const index = () => {
  const data = [];
  return (
    <Layout>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="card card-ss">
          <div className="card-header p-4 card-header-ss">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4">E-Rapor</h1>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive mt-4">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>Kelas</th>
                    <th>Nama</th>
                    <th>Unduh/Cetak</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((data, idx) => {
                    return (
                      <tr key={`${idx}-${new Date().getTime()}`}>
                        <td data-th="Kelas">{data.kelas}</td>
                        <td data-th="Nama">{data.nama}</td>
                        <td className="actions">
                          <button className="btn btn-primary rounded-circle me-3">
                            <FaFile />
                          </button>
                          <button className="btn btn-secondary rounded-circle">
                            <FaPrint />
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
