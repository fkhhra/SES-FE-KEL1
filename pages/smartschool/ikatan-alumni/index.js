import { motion } from "framer-motion";
import { FaPen, FaPlus, FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";
import ModalTambahIkatanAlumni from "../../../components/Shared/ModalTambahIkatanAlumni/ModalTambahIkatanAlumni";
import { deleteAlumni, getAlumni } from "../../../client/AlumniClient";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import Skeleton from "react-loading-skeleton";
import { useDebounce } from "use-debounce";
import { momentPackage } from "../../../utilities/HelperUtils";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import { ssURL } from "../../../client/clientAxios";
import { useRouter } from "next/router";
import { Pagination } from "antd";
import ReactiveButton from "reactive-button";
import UploadBanner from "components/Shared/UploadBanner/UploadBanner";
import NewModal from "components/Shared/NewModal/NewModal";

const index = () => {
  const [listAlumni, setListAlumni] = useState([]);
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

  const onClickEdit = (alumni) => {
    setEditData({
      id: alumni?.id,
      nama: alumni?.nama,
      whatsapp: alumni?.whatsapp,
      gender: alumni?.gender,
      tanggalLahir: momentPackage(alumni?.tanggalLahir),
      email: alumni?.email,
      jurusan: alumni?.infoAlumni?.jurusan,
      tahunMasuk: alumni?.infoAlumni?.tahunMasuk,
      pekerjaan: alumni?.infoAlumni?.pekerjaan,
      kantor: alumni?.infoAlumni?.kantor,
      sektorIndustri: alumni?.infoAlumni?.sektorIndustri,
      sekolahLanjutan: alumni?.infoAlumni?.sekolahLanjutan?.split(",") || [""],
      pengalaman: alumni?.infoAlumni?.pengalaman?.split(",") || [""],
      sertifikasiKeahlian: alumni?.infoAlumni?.sertifikasiKeahlian?.split(
        ","
      ) || [""],
      purnakarya: alumni?.infoAlumni?.purnakarya,
      deskripsi: alumni?.infoAlumni?.deskripsi,
    });
  };

  const _getAlumni = async () => {
    setLoading(true);
    const params = { search, page: page };

    const { data } = await getAlumni(params);
    if (data) {
      setListAlumni(data?.alumni?.data);
      setTotal(data?.alumni?.total);
    }
    setLoading(false);
  };

  const _deleteAlumni = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteAlumni(id);
        if (data) {
          toast.success(data.message);
          _getAlumni();
        }
      }
    });
  };

  useEffect(() => {
    _getAlumni();
  }, [debounceSearch, page]);

  const steps = [
    {
      target: '[data-joyride="btn-tambah-alumni"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Menambah Data Alumni ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan data alumni ke dalam sekolah anda.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="cari-alumni"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Cari Alumni</h5>
          <p className="color-secondary fw-semibold">
            Masukkan nama alumni ke dalam kolom pencarian untuk mencari
            informasi mengenai alumni.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-alumni"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Informasi Alumni</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar informasi yang sudah ditambahkan ke sekolah
            anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-prestasi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Data Alumni</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai data alumni
            yang sudah ditambahkan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-prestasi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Data Alumni</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus data alumni yang sudah
            ditambahkan.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Layout
      isFluid={false}
      modalWrapper={
        <>
          <NewModal
            modalId="modalUnggahAlumni"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">Unggah Data</h4>
                <span className="fs-6 fw-normal">
                  Unduh template di bawah ini untuk mengunggah data alumni
                  sekolah
                </span>
              </>
            }
            content={
              <>
                <div className="mb-5">
                  <h5 className="fw-bold color-dark">
                    Template File Import{" "}
                    {/* {sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"} */}
                    Alumni
                  </h5>
                  <a href="/import/template-mapel.xlsx" target="_blank">
                    <div className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Template File Import{" "}
                          {/* {sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"} */}{" "}
                          Alumni
                        </span>
                      </p>
                    </div>
                  </a>
                </div>
                <div>
                  <UploadBanner
                    label="Import"
                    // titleUnggahan={`File Import ${
                    //   sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"
                    // }`}
                    titleUnggahan="File Import Alumni"
                    id="file"
                    name="file"
                    // preview={formData.file}
                    // onChange={(e, uploadedFile) =>
                    //   handleChangeForm(e, uploadedFile)
                    // }
                    isFile={true}
                    // onClick={() => setFormData({ ...formData, file: "" })}
                    // isImport={true}
                  />
                </div>
              </>
            }
            submitButton={
              <ReactiveButton
                // buttonState={formData.btnImport}
                // onClick={handleSubmitImport}
                color={"primary"}
                idleText={"Simpan"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
              />
            }
          />
        </>
      }
    >
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <MyJoyride steps={steps} />
        <div className="card card-ss">
          <div className="card-header p-4 card-header-ss">
            <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">Alumni</h4>
              <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-3 mb-sm-0 mb-3"
                  style={{ height: "42px" }}
                  id="exampleFormControlInput1"
                  placeholder="Cari Alumni"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-md-3 mb-md-0 mb-3 fw-bold color-secondary fs-14-ss"
                  // onClick={() =>
                  //   handleClickDataDownload(key?.replace("x", "X"))
                  // }
                  data-bs-toggle="modal"
                  data-bs-target="#modalUnggahAlumni"
                >
                  <FaCloudUploadAlt className="me-2 fs-18-ss" />
                  Unggah Alumni
                </button>
                <button
                  type="button"
                  className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahIkatanAlumni"
                  onClick={() => setEditData(null)}
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
                      <th>Whatsapp</th>
                      <th>Jenis Kelamin</th>
                      <th>Tanggal Lahir</th>
                      <th>Email</th>
                      <th>Jurusan</th>
                      <th>Tahun Masuk</th>
                      <th>Pekerjaan</th>
                      <th>Kantor</th>
                      <th>Sektor Industri</th>
                      <th>Sekolah Lanjutan</th>
                      <th>Pengalaman</th>
                      <th>Setifikat Keahlian</th>
                      <th>Purnakarya</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAlumni?.length > 0 &&
                      listAlumni?.map((alumni, idx) => (
                        <tr key={`${idx}-${new Date().getTime()}`}>
                          <td data-th="Nomor">{idx + 1}</td>
                          <td data-th="Nama">{alumni?.nama}</td>
                          <td data-th="Whatsapp">{alumni?.whatsapp}</td>
                          <td data-th="Jenis Kelain">{alumni?.genderText}</td>
                          <td data-th="Tanggal Lahir">
                            {momentPackage(alumni?.tanggalLahir).format(
                              "DD MMMM YYYY"
                            )}
                          </td>
                          <td data-th="Email">{alumni?.email}</td>
                          <td data-th="Jurusan">
                            {alumni?.infoAlumni?.jurusan}
                          </td>
                          <td data-th="Tahun">
                            {alumni?.infoAlumni?.tahunMasuk}
                          </td>
                          <td data-th="Pekerjaan">
                            {alumni?.infoAlumni?.pekerjaan}
                          </td>
                          <td data-th="Kantor">{alumni?.infoAlumni?.kantor}</td>
                          <td data-th="Sektor Industri">
                            {alumni?.infoAlumni?.sektorIndustri}
                          </td>
                          <td data-th="Sekolah Lanjutan">
                            <ul>
                              {alumni?.infoAlumni?.sekolahLanjutan
                                ?.split(",")
                                ?.map((sekolah) => (
                                  <li>{sekolah}</li>
                                ))}
                            </ul>
                          </td>
                          <td data-th="Pengalaman">
                            <ul>
                              {alumni?.infoAlumni?.pengalaman
                                ?.split(",")
                                ?.map((pengalamanData) => (
                                  <li>{pengalamanData}</li>
                                ))}
                            </ul>
                          </td>
                          <td data-th="Setifikat Keahlian">
                            <ul>
                              {alumni?.infoAlumni?.sertifikasiKeahlian
                                ?.split(",")
                                ?.map((sertifikat) => (
                                  <li>{sertifikat}</li>
                                ))}
                            </ul>
                          </td>
                          <td data-th="Purnakarya">
                            {alumni?.infoAlumni?.purnakarya === 1
                              ? "Ya"
                              : "Tidak"}
                          </td>
                          <td data-th="Aksi" className="actions">
                            <button
                              type="button"
                              className="btn btn-primary bg-gradient rounded-circle"
                              data-bs-toggle="modal"
                              data-bs-target="#modalTambahIkatanAlumni"
                              onClick={() => onClickEdit(alumni)}
                            >
                              <FaPen />
                            </button>
                            <button
                              className="btn btn-danger rounded-circle"
                              onClick={() => _deleteAlumni(alumni?.id)}
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
      <ModalTambahIkatanAlumni editData={editData} _getAlumni={_getAlumni} />
    </Layout>
  );
};

export default index;
