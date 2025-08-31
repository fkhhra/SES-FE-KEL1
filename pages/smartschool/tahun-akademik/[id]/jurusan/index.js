import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPen, FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import Layout from "../../../../../components/Layout/Layout";
import {
  getMajors,
  postMajors,
  deleteMajor,
  editMajor,
} from "../../../../../client/MajorsClient";
import { currencyFormatter } from "../../../../../utilities/HelperUtils";
import Modal from "../../../../../components/Shared/Modal/Modal";
import { buildSettingForm } from "../../../../../data/form";
import toast from "react-hot-toast";
import swal from "sweetalert";
import MyJoyride from "../../../../../components/Shared/MyJoyride/MyJoyride";
import { hideModal } from "../../../../../utilities/ModalUtils";
import SideNavTahunAkademik from "components/TahunAkademik/SideNavTahunAkademik";
import { ssURL } from "client/clientAxios";

const initialFormData = {
  kode: "",
  nama: "",
  spp: 0,
  sumbanganSaranaPendidikan: 0,
  kegiatanOsis: 0,
  mplsJasAlmamater: 0,
  seragamSekolah: 0,
  toolkitPraktek: 0,
};

const index = () => {
  const [majors, setMajors] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [editId, setEditId] = useState(null);
  const { jurusan, sekolah } = majors;

  const getMajorsData = async () => {
    const { data } = await getMajors();

    if (data) {
      setMajors(data);
    }
  };

  const settingList = buildSettingForm(formData, setFormData, "Tambah Jurusan");

  const handlePostMajor = async () => {
    const { isSuccess, data, error } = await postMajors(formData);
    if (isSuccess) {
      toast.success(data?.message);
      setFormData(initialFormData);
      getMajorsData();
      setButtonState("success");
      hideModal("jurusan");
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  const handleEditMajor = async () => {
    const { isSuccess, data, error } = await editMajor(formData, editId);
    if (isSuccess) {
      toast.success(data?.message);
      getMajorsData();
      setButtonState("success");
      setFormData(initialFormData);
      hideModal("jurusan");
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    if (!editId) {
      handlePostMajor();
    } else {
      handleEditMajor();
    }
  };

  const handleDeleteMajor = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { isSuccess, data, error } = await deleteMajor(id);
        if (isSuccess) {
          toast.success(data?.message);
          getMajorsData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const onClickEdit = (major) => {
    setEditId(major.id);
    setFormData({
      kode: major.kode,
      nama: major.nama,
      spp: major.spp,
      sumbanganSaranaPendidikan: major.sumbanganSaranaPendidikan,
      kegiatanOsis: major.kegiatanOsis,
      mplsJasAlmamater: major.mplsJasAlmamater,
      seragamSekolah: major.seragamSekolah,
      toolkitPraktek: major.toolkitPraktek,
    });
  };

  useEffect(() => {
    getMajorsData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="btn-tambah-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Menambah Jurusan ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan jurusan ke dalam sekolah anda.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="edit-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai jurusan
            yang sudah dibuat.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus jurusan yang sudah dibuat.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <MyJoyride steps={steps} />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="row">
          <div className="col-lg-3">
            <SideNavTahunAkademik ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                    Jurusan
                  </h4>
                  <form
                    onSubmit={handleModalSubmit}
                    className="d-flex flex-column"
                  >
                    <Modal
                      button={
                        <button
                          type="button"
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                          data-bs-toggle="modal"
                          data-bs-target="#jurusan"
                          onClick={() => {
                            setEditId(null);
                            setFormData(initialFormData);
                          }}
                          data-joyride="btn-tambah-jurusan"
                        >
                          <FaPlus /> Tambah
                        </button>
                      }
                      id="jurusan"
                      buttonState={buttonState}
                      modalTitle={
                        <>
                          <h4 className="fw-extrabold m-0">Jurusan</h4>
                        </>
                      }
                    >
                      {settingList.map((setting, idx) => {
                        return (
                          <div
                            className="mb-3"
                            key={`${idx}-${new Date().getTime()}`}
                          >
                            <label
                              htmlFor={setting.name}
                              className="form-label"
                            >
                              {setting.label}
                            </label>
                            <input
                              className="form-control"
                              autoComplete="off"
                              value={setting.value}
                              id={setting.name}
                              onChange={setting.onChange}
                            />
                          </div>
                        );
                      })}
                    </Modal>
                  </form>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" data-joyride="table-jurusan">
                  <div className="table-responsive">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>Nomor</th>
                          <th>Kode</th>
                          <th>Nama</th>
                          {sekolah?.status === "S" && (
                            <>
                              <th>SPP</th>
                              <th>Sumbangan Sarana Pendidikan</th>
                              <th>Kegiatan Osis</th>
                              <th>MPLS & Jas Almamater</th>
                              <th>Seragam Sekolah</th>
                              <th>Toolkit Praktek</th>
                            </>
                          )}
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jurusan?.map((major, index) => {
                          const {
                            id,
                            kode,
                            nama,
                            spp,
                            sumbanganSaranaPendidikan,
                            kegiatanOsis,
                            mplsJasAlmamater,
                            seragamSekolah,
                            toolkitPraktek,
                          } = major;
                          return (
                            <tr key={`${index}-${new Date().getTime()}`}>
                              <td data-th="Nomor">{index + 1}</td>
                              <td data-th="Kode">{kode}</td>
                              <td data-th="Nama">{nama}</td>
                              {sekolah?.status === "S" && (
                                <>
                                  <td data-th="SPP">
                                    {currencyFormatter(spp)}
                                  </td>
                                  <td data-th="Sumbagan Sarana Pendidikan">
                                    {currencyFormatter(
                                      sumbanganSaranaPendidikan
                                    )}
                                  </td>
                                  <td data-th="Kegiatan Osis">
                                    {currencyFormatter(kegiatanOsis)}
                                  </td>
                                  <td data-th="MPLS & Jas Almamater">
                                    {currencyFormatter(mplsJasAlmamater)}
                                  </td>
                                  <td data-th="Seragam Sekolah">
                                    {currencyFormatter(seragamSekolah)}
                                  </td>
                                  <td data-th="Toolkit Praktek">
                                    {currencyFormatter(toolkitPraktek)}
                                  </td>
                                </>
                              )}
                              <td data-th="Aksi" className="actions">
                                <div className="d-flex flex-lg-row flex-md-column flex-row">
                                  <Modal
                                    button={
                                      <button
                                        type="button"
                                        className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                        data-bs-toggle="modal"
                                        data-bs-target="#jurusan"
                                        id="jurusan"
                                        buttonState={buttonState}
                                        onClick={() => onClickEdit(major)}
                                        data-joyride="edit-jurusan"
                                      >
                                        <FaPen className="color-secondary" />
                                      </button>
                                    }
                                  />
                                  <button
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => handleDeleteMajor(id)}
                                    data-joyride="delete-jurusan"
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default index;
