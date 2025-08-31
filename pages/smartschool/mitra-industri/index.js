import { motion } from "framer-motion";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";

const initialFormData = {
  nama: "",
  gender: "L",
  whatsapp: "",
  password: "",
  avatar: "",
};

const index = () => {

  return (
    <Layout>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="card card-ss">
          <div className="card-body p-0 pt-5">
            <div className="card-header p-4 card-header-ss d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="h4">Mitra Industri</h1>
              </div>
              <input
                type="text"
                className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss"
                id="exampleFormControlInput1"
                placeholder="Cari Mitra Industri"
                // value={search}
                // onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary bg-gradient rounded-pill mx-4 mb-4 mb-lg-0"
                data-bs-toggle="modal"
                data-bs-target="#modal-siswa"
                // onClick={() => {
                //   setEditId(null);
                //   setFormData(initialFormData);
                // }}
              >
                <FaPlus /> Tambah
              </button>
            </div>
              <div className="table-responsive">
                <table className="table-ss">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nama</th>
                      <th>Jenis Kelamin</th>
                      <th>Foto</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <td>#</td>
                    <td>Nama</td>
                    <td>Jenis Kelamin</td>
                    <td>Foto</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-primary bg-gradient rounded-circle"
                        data-bs-toggle="modal"
                        data-bs-target="#modal-siswa"
                        // onClick={() => onClickEdit(data)}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="btn btn-danger rounded-circle"
                        // onClick={() => handleDelete(data?.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
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
