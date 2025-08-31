import Layout from "../../../components/Layout/Layout";
import { motion } from "framer-motion";
import {
  FaAngleRight,
  FaFilePdf,
  FaPaperclip,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { baseURL, ssURL } from "../../../client/clientAxios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import ModalStep from "../../../components/Shared/ModalStep/ModalStep";
import { uploadFile } from "../../../client/uploadFileClient";
import { postAbsen, detailAbsen, editAbsen } from "../../../client/AbsenClient";
import { momentPackage } from "../../../utilities/HelperUtils";
import useBagian from "../../../hooks/useBagian";
import useUser from "../../../hooks/useUser";
import Link from "next/link";
import useSekolah from "../../../hooks/useSekolah";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import Dropdown from "../../../components/Shared/Dropdown/Dropdown";
import { Select, Divider, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const index = ({ nav }) => {
  const initialStateForm = {
    absen: 0,
    id: 0,
    keterangan: "",
    lampiran: [],
    foto_masuk: "",
    waktu_masuk: "",
    foto_pulang: "",
    waktu_pulang: "",
  };

  const { user } = useUser();
  const { sekolah } = useSekolah();

  const { setBagian, bagian } = useBagian();
  const [tipePembayaran, settipePembayaran] = useState(false);

  useEffect(() => {
    localStorage.setItem("bagian", bagian);
  }, [bagian]);

  const [formData, setFormData] = useState(initialStateForm);

  const [current, setCurrent] = useState(formData.absen && 1);

  const [jadwalMengajarSaatIni, setJadwalMengajarSaatIni] = useState(null);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getDetailAbsenData = async () => {
    const { data } = await detailAbsen({
      hari_ini: momentPackage().format("YYYY-MM-DD"),
      kode_hari: new Date().getDay(),
      jam_saat_ini: momentPackage().format("HH:mm"),
    });
    if (!data?.absen) {
      return;
    }
    if (data) {
      setFormData({
        ...formData,
        absen: data?.absen?.absen,
        foto_masuk: data?.absen?.fotoMasuk,
        waktu_masuk: data?.absen?.waktuMasuk,
        foto_pulang: data?.absen?.fotoPulang,
        waktu_pulang: data?.absen?.waktuPulang,
        id: data?.absen?.id,
        lampiran: [...formData.lampiran, data?.absen?.lampiran],
        keterangan: data?.absen?.keterangan,
      });
      setJadwalMengajarSaatIni(data.jadwalMengajar);
      setCurrent(1);
    }
  };

  const [buttonState, setButtonState] = useState("idle");

  useEffect(() => {
    getDetailAbsenData();
  }, []);

  const navItems = [
    {
      url: `${ssURL}/pembayaran?nav=spp`,
      as: `${ssURL}/pembayaran?nav=spp`,
      text: "SPP",
      active: nav == "spp" || nav == undefined,
    },
    {
      url: `${ssURL}/pembayaran?nav=ujian`,
      as: `${ssURL}/pembayaran?nav=ujian`,
      text: "Ujian",
      active: nav == "ujian",
    },
    {
      url: `${ssURL}/pembayaran?nav=lainnya`,
      as: `${ssURL}/pembayaran?nav=lainnya`,
      text: "Lainnya",
      active: nav == "lainnya",
    },
  ];

  const listValueDropdown = [
    {
      label: "2021",
      value: "2021",
    },
  ];

  const { Option } = Select;

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }

  function handleChange(value) {}

  return (
    <Layout isIndex={true} modalWrapper={<></>}>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="fw-extrabold color-dark mb-0">Notifikasi</h2>
                    <span className="fw-bold color-primary pointer">
                      Tandai sudah dibaca
                    </span>
                  </div>
                </div>
                <div className="card-body px-0 pt-0 pb-5">
                  <hr className="m-0" />
                  <div className="list-group-notifikasi">
                    <div className="list-group-notifikasi-item pointer">
                      <div className="content p-4 d-flex">
                        <div
                          className="rounded-circle shadow-primary-ss me-4"
                          style={{
                            width: "54px",
                            height: "54px",
                          }}
                        >
                          <img src="/img/icon-notif-bell.svg" alt="icon" />
                        </div>
                        <div>
                          <h5 className="fs-18-ss fw-extrabold color-dark mb-2">
                            Guru Mengomentari Tugas Trigonometri
                          </h5>
                          <p className="fw-extrabold color-dark mb-2">
                            Dra. Hj. Dede Yudhiyati memberikan komentar
                            "tugasnya sudah benar nak, terimaksih sudah
                            mengerjakan." pada tugas anda.
                          </p>
                          <span className="fw-semibold">1 Februari 2020</span>
                        </div>
                      </div>
                      <hr className="mx-4 my-0" />
                    </div>
                    <div className="list-group-notifikasi-item pointer">
                      <div className="content p-4 d-flex">
                        <div
                          className="rounded-circle shadow-primary-ss me-4"
                          style={{
                            width: "54px",
                            height: "54px",
                          }}
                        >
                          <img src="/img/icon-notif-tugas.svg" alt="icon" />
                        </div>
                        <div>
                          <h5 className="fs-18-ss fw-extrabold color-dark mb-2">
                            Tugas Baru
                          </h5>
                          <p className="fw-extrabold color-dark mb-2">
                            Dra. Hj. Dede Yudhiyati menambahkan tugas
                            "Trigonometri" pada kelas Matematika.
                          </p>
                          <span className="fw-semibold">1 Februari 2020</span>
                        </div>
                      </div>
                      <hr className="mx-4 my-0" />
                    </div>
                    <div className="list-group-notifikasi-item pointer">
                      <div className="content p-4 d-flex">
                        <div
                          className="rounded-circle shadow-primary-ss me-4"
                          style={{
                            width: "54px",
                            height: "54px",
                          }}
                        >
                          <img
                            src="/img/icon-notif-pembayaran-check.svg"
                            alt="icon"
                          />
                        </div>
                        <div>
                          <h5 className="fs-18-ss fw-extrabold color-dark mb-2">
                            Pembayaran Terkonfirmasi
                          </h5>
                          <p className="fw-semibold mb-2">
                            Pembayaran SPP Bulan Januari 2021 kamu sudah
                            dikonfirmasi.
                          </p>
                          <span className="fw-semibold">1 Februari 2020</span>
                        </div>
                      </div>
                      <hr className="mx-4 my-0" />
                    </div>
                    <div className="list-group-notifikasi-item pointer">
                      <div className="content p-4 d-flex">
                        <div
                          className="rounded-circle shadow-primary-ss me-4"
                          style={{
                            width: "54px",
                            height: "54px",
                          }}
                        >
                          <img
                            src="/img/icon-notif-pembayaran-alert.svg"
                            alt="icon"
                          />
                        </div>
                        <div>
                          <h5 className="fs-18-ss fw-extrabold color-dark mb-2">
                            Pembayaran Baru
                          </h5>
                          <p className="fw-semibold mb-2">
                            Pembayaran SPP Bulan Januari 2021 kamu sudah
                            dikonfirmasi.
                          </p>
                          <span className="fw-semibold">1 Februari 2020</span>
                        </div>
                      </div>
                      <hr className="mx-4 my-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({ query: { nav } }) {
  return {
    props: {
      nav: nav || null,
    },
  };
}

export default index;
