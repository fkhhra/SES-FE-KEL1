import { Pagination } from "antd";
import { deletePraktikKerja, getPraktikKerja } from "client/PraktikKerjaClient";
import ModalTambahPKL from "components/praktik-kerja/ModalTambahPKL";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { getPreviewURL } from "utilities/FileViewer";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";

const index = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 600);

  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const [editData, setEditData] = useState(null);

  const firstRender = useRef(true);

  const router = useRouter();

  const { page = 1 } = router.query;

  const onClickEdit = (data) => {
    setEditData({
      id: data?.id,
      nama: data?.nama,
      siswa: data?.siswa,
      suratTugas: data?.suratTugas,
      mou: data?.mou,
    });
  };

  const _getPKL = async () => {
    setLoading(true);
    const params = { search, page: page };

    const { data } = await getPraktikKerja(params);
    if (data) {
      setData(data?.data?.data);
      setTotal(data?.data?.total);
    }
    setLoading(false);
  };

  const _deletePKL = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deletePraktikKerja(id);
        if (data) {
          toast.success(data.message);
          _getPKL();
        }
      }
    });
  };

  useEffect(() => {
    _getPKL();
  }, [debounceSearch, page]);

  return (
    <Layout isFluid={false}>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="card card-ss">
          <div className="card-header p-4 card-header-ss">
            <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                Praktik Kerja Lapangan
              </h4>
              <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-3 mb-sm-0 mb-3"
                  style={{ height: "42px" }}
                  id="exampleFormControlInput1"
                  placeholder="Cari"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahIkatanAlumni"
                  onClick={() => setEditData({ nama: "" })}
                >
                  <FaPlus /> Tambah
                </button>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              {loading && <Skeleton count={3} height={50} />}
              {!loading && (
                <table className="table-ss">
                  <thead>
                    <tr>
                      <th>Nomor</th>
                      <th>Nama</th>
                      <th>Siswa</th>
                      <th>Surat Tugas</th>
                      <th>MoU</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 &&
                      data?.map((d, idx) => (
                        <tr key={`${idx}-${new Date().getTime()}`}>
                          <td data-th="Nomor">{idx + 1}</td>
                          <td data-th="Nama">{d?.nama}</td>
                          <td data-th="Siswa">
                            <a
                              href={getPreviewURL(d?.siswa)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none color-secondary"
                            >
                              Lihat File
                            </a>
                          </td>
                          <td data-th="Surat">
                            <a
                              href={getPreviewURL(d?.suratTugas)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none color-secondary"
                            >
                              Lihat File
                            </a>
                          </td>
                          <td data-th="MOU">
                            <a
                              href={getPreviewURL(d?.mou)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none color-secondary"
                            >
                              Lihat File
                            </a>
                          </td>
                          <td data-th="Aksi" className="actions">
                            <button
                              type="button"
                              className="btn btn-primary bg-gradient rounded-circle"
                              data-bs-toggle="modal"
                              data-bs-target="#modalTambahIkatanAlumni"
                              onClick={() => onClickEdit(d)}
                            >
                              <FaPen />
                            </button>
                            <button
                              className="btn btn-danger rounded-circle"
                              onClick={() => _deletePKL(d?.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="my-4 text-center">
              <Pagination
                total={total}
                showSizeChanger={false}
                current={page || 1}
                pageSize={20}
                onChange={(e) =>
                  router.push(`${ssURL}/ikatan-alumni?page=${e}`)
                }
              />
            </div>
          </div>
        </div>
      </motion.div>
      <ModalTambahPKL editData={editData} _getAlumni={_getPKL} />
    </Layout>
  );
};

export default index;
