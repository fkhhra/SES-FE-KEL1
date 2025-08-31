// import { editTugas, postTugas } from "client/TugasClient";
// import useBuatTugas from "hooks/useBuatTugas";
// import useEditModal from "hooks/useEditModal";
import { deleteBarang, updateBarang } from "client/BarangClient";
import { editMutasiV2, postMutasiV2 } from "client/MutasiClient";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
// import { momentPackage } from "utilities/HelperUtils";
// import { hideModal } from "utilities/ModalUtils";
import ModalStep from "../Shared/ModalStep/ModalStep";
import ContentInformasiPrakerin from "./ContentInformasiPrakerin";
import ContentPenerimaanPrakerinSiswa from "./ContentPenerimaanPrakerinSiswa";
import { postPrakerin, getTambahPrakerin } from "client/KakomliClient";
import {
  getDistrict,
  getProvince,
  getRegency,
  getVillage,
} from "../../client/LokasiClient";
// import IsiInformasiSoal from "./IsiInformasiSoal";
// import Lampiran from "./Lampiran";
// import Pembagian from "./Pembagian";
// import Soal from "./Soal";
// import isEmpty from "lodash/isEmpty";

const initialFormData = {
  tanggalBerangkat: "",
  tanggalJemput: "",
  pembimbing: "",
  teleponPerusahaan: "",
  kontakNarahubung: "",
  alamatPerusahaan: "",
  namaPerusahaan: "",
  provinceId: "",
  regencyId: "",
  districtId: "",
  villageId: "",
  kodepos: "",
  jurusanId: "",
  rombelId: "",
  page: "",
};

const ModalTambahPrakerinsiswa = ({ _getPrakerin, data = [], id }) => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [btn, setBtn] = useState("idle");
  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dipilih, setDipilih] = useState([...data]);

  const _postPrakerin = async () => {
    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    }

    setBtn("loading");
    const { data, error } = await postPrakerin({
      ...formData,
      m_user_id: dipilih?.map((d) => d?.id),
      m_ta_id: id,
      tanggal_berangkat: momentPackage(formData?.tanggalBerangkat).format(
        "YYYY-MM-DD"
      ),
      tanggal_jemput: momentPackage(formData?.tanggalJemput).format(
        "YYYY-MM-DD"
      ),
    });

    if (data) {
      setBtn("success");
      toast.success(data?.message);
      hideModal("ModalTambahPrakerinSiswa");
      _getPrakerin();
    }
  };

  const _getProvince = async () => {
    const { data } = await getProvince();

    if (data) {
      setProvince(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getRegency = async (params) => {
    const { data } = await getRegency(params);

    if (data) {
      setRegency(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getDistrict = async (params) => {
    const { data } = await getDistrict(params);

    if (data) {
      setDistrict(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getVillage = async (params) => {
    const { data } = await getVillage(params);

    if (data) {
      setVillage(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const handleChangeSelect = (e, name) => {
    if (name == "provinceId") {
      _getRegency({
        provinceId: e?.value,
      });
    }

    if (name == "regencyId") {
      _getDistrict({
        regencyId: e?.value,
      });
    }

    if (name == "districtId") {
      _getVillage({
        districtId: e?.value,
      });
    }

    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const router = useRouter();

  const next = () => {
    if (current == 0) {
      if (!formData?.namaPerusahaan) {
        toast.error("Harap mengisi nama perusahaan");
        return;
      }
      if (!formData?.alamatPerusahaan) {
        toast.error("Harap mengisi alamat perusahaan");
        return;
      }
      if (!formData?.provinceId) {
        toast.error("Harap memilih provinsi perusahaan");
        return;
      }
      if (!formData?.regencyId) {
        toast.error("Harap memilih kabupaten/kota perusahaan");
        return;
      }
      if (!formData?.districtId) {
        toast.error("Harap memilih kecamatan perusahaan");
        return;
      }
      if (!formData?.kodepos) {
        toast.error("Harap mengisi kode pos perusahaan");
        return;
      }
      if (!formData?.teleponPerusahaan) {
        toast.error("Harap mengisi nomor telepon perusahaan");
        return;
      }
      if (!formData?.kontakNarahubung) {
        toast.error("Harap mengisi kontak narahubung");
        return;
      }
      if (!formData?.pembimbing) {
        toast.error("Harap mengisi pembimbing");
        return;
      }
      if (!formData?.tanggalBerangkat) {
        toast.error("Harap mengisi tanggal berangkat");
        return;
      }
      if (!formData?.tanggalJemput) {
        toast.error("Harap mengisi tanggal jemput");
        return;
      }
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const formValidation = () => {
    return "";
  };

  useEffect(() => {
    _getProvince(),
      formData.provinceId && _getRegency({ provinceId: formData.provinceId }),
      formData.regencyId && _getDistrict({ regencyId: formData.regencyId }),
      formData.districtId && _getVillage({ districtId: formData.districtId });
  }, []);

  const steps = [
    {
      title: "Informasi Prakerin",
      content: (
        <ContentInformasiPrakerin
          formData={formData}
          handleChangeInput={handleChangeInput}
          handleChangeSelect={handleChangeSelect}
          province={province}
          regency={regency}
          district={district}
          village={village}
        />
      ),
    },
    {
      title: "Daftar Siswa",
      content: (
        <ContentPenerimaanPrakerinSiswa
          formData={formData}
          dipilih={dipilih}
          setDipilih={setDipilih}
          data={data}
          setFormData={setFormData}
        />
      ),
    },
  ];

  const onCloseModal = () => {
    setCurrent(0);
  };

  //   useEffect(() => {
  //     if (editData) {
  //       setFormData({
  //         ...formData,
  //         ...editData,
  //         nama: `${editData?.nama} - ${editData?.merk}`,
  //         namaAsli: editData?.nama,
  //       });
  //     } else {
  //       setFormData({ ...initialFormData });
  //     }
  //   }, [editData]);

  return (
    <>
      <ModalStep
        onClose={onCloseModal}
        isFullScreen
        modalClass="modal-dialog modal-fullscreen"
        isNext={true}
        modalId="ModalTambahPrakerinSiswa"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Tambah Penerimaan Siswa</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk menambahkan prakerin siswa
            </span>
          </>
        }
        current={current}
        next={next}
        prev={prev}
        steps={steps}
        buttonSubmit={
          <ReactiveButton
            onClick={_postPrakerin}
            buttonState={btn}
            color={"primary"}
            idleText="Simpan"
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
  );
};

export default ModalTambahPrakerinsiswa;
