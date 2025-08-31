import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPen, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { postTa, getTa, deleteTa, editTa } from "../../../client/TaClient";
import Layout from "../../../components/Layout/Layout";
import Badge from "../../../components/Shared/Badge/Badge";
import { buildSettingForm } from "../../../data/form";
import { momentPackage, renderFormInput } from "../../../utilities/HelperUtils";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import swal from "sweetalert";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import { hideModal } from "../../../utilities/ModalUtils";

const initialFormData = {
  tahun: "",
  aktif: 0,
  namaKepsek: "",
  nipKepsek: "",
  semester: "",
  tanggalAwal: "",
  tanggalAkhir: "",
  tanggalRapor: "",
};

const index = () => {
  const [ta, setTa] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const settingList = buildSettingForm(
    formData,
    setFormData,
    "Tambah Tahun Akademik"
  );

  const getTaData = async () => {
    setLoading(true);
    const { data } = await getTa();
    if (data) {
      setTa(data?.ta);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteTa(id);
        if (data) {
          toast.success(data?.message);
          getTaData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const onClickEdit = (data) => {
    if (data) {
      setEditId(data.id);
      setFormData({
        tahun: data?.tahun,
        aktif: data?.aktif,
        namaKepsek: data?.namaKepsek,
        nipKepsek: data?.nipKepsek,
        semester: data?.semester,
        tanggalAwal: data?.tanggalAwal
          ? momentPackage(data?.tanggalAwal).format("YYYY-MM-DD")
          : "",
        tanggalAkhir: data?.tanggalAkhir
          ? momentPackage(data?.tanggalAkhir).format("YYYY-MM-DD")
          : "",
        tanggalRapor: data?.tanggalRapor
          ? momentPackage(data?.tanggalRapor).format("YYYY-MM-DD")
          : "",
      });
    }
  };

  const handlePost = async () => {
    const { data, error } = await postTa(formData);
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData(initialFormData);
      getTaData();
      hideModal("modal-tahun-akademik");
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const handleEdit = async () => {
    const { data, error } = await editTa(editId, formData);
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      getTaData();
      hideModal("modal-tahun-akademik");
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const handleModalSubmit = async () => {
    setButtonState("loading");
    if (!editId) {
      handlePost();
    } else {
      handleEdit();
    }
  };

  useEffect(() => {
    getTaData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="btn-tambah-ta"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Ingin Menambah Tahun Akademik ?
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan tahun akademik baru ke sekolah.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="table-ta"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Tahun Akademik</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar tahun akademik yang sudah di tambahkan ke
            sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-ta"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Tahun Akademik</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai tahun
            akademik yang sudah dibuat.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-ta"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Tahun Akademik</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus tahun akademik yang sudah
            dibuat.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Layout
      modalWrapper={
        <NewModal
          modalId="modal-tahun-akademik"
          title={
            <>
              <p className="mb-0 fw-bold">Tahun Akademik</p>
            </>
          }
          content={
            <>
              <div className="mb-3">{renderFormInput(settingList)}</div>
              {formData?.avatar && (
                <div className="text-center">
                  <img
                    src={`${formData?.avatar}`}
                    width={200}
                    height={200}
                    className="avatar"
                  />
                </div>
              )}
            </>
          }
          submitButton={
            <ReactiveButton
              buttonState={buttonState}
              onClick={handleModalSubmit}
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
      }
    >
      <MyJoyride steps={steps} />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="card card-ss">
          <div className="card-header p-4 card-header-ss">
            <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                Tahun Akademik
              </h4>
              <button
                type="button"
                className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#modal-tahun-akademik"
                onClick={() => {
                  setEditId(null);
                  setFormData(initialFormData);
                }}
                data-joyride="btn-tambah-ta"
              >
                <FaPlus /> Tambah
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="">
                <Skeleton count={4} height={50} />
              </div>
            ) : (
              <div className="table-responsive " data-joyride="table-ta">
                <table className="table-ss">
                  <thead>
                    <tr>
                      <th>Nomor</th>
                      <th>Tahun</th>
                      <th>Semester</th>
                      <th>Nama Kepsek</th>
                      <th>NIP Kepsek</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ta?.map((data, index) => (
                      <tr key={`${index}-${new Date().getTime()}`}>
                        <td data-th="Nomor">{index + 1}</td>
                        <td data-th="Tahun">{data?.tahun}</td>
                        <td data-th="Semester">{data?.semester}</td>
                        <td data-th="Nama Kepsek">{data?.namaKepsek}</td>
                        <td data-th="NIP Kepsek">{data?.nipKepsek}</td>
                        <td data-th="Status">
                          <Badge
                            badgeColorclassName={
                              data?.aktif === 1 ? "bg-success" : "bg-secondary"
                            }
                          >
                            {data?.aktifText}
                          </Badge>
                        </td>
                        <td data-th="Aksi" className="actions">
                          <div className="d-flex flex-lg-row flex-md-column flex-row">
                            <button
                              type="button"
                              className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#modal-tahun-akademik"
                              buttonState={buttonState}
                              onClick={() => onClickEdit(data)}
                              data-joyride="edit-ta"
                            >
                              <FaPen className="color-secondary" />
                            </button>
                            <button
                              className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              onClick={() => handleDelete(data?.id)}
                              data-joyride="delete-ta"
                            >
                              <FaTrashAlt className="color-secondary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default index;
