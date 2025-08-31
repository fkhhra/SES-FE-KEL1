import { getGelombangPPDB } from "client/GelombangPPDB";
import usePPDB from "hooks/usePPDB";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ppdbURL } from "../../../client/clientAxios";
import Layout from "../../../components/PPDB/Layout";
import SectionIdentitasDiri from "../../../components/PPDB/SectionIdentitasDiri";
import SectionInformasiOrtu from "../../../components/PPDB/SectionInformasiOrtu";
import StepPPDB from "../../../components/PPDB/StepPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { checkNomor, momentPackage } from "utilities/HelperUtils";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useSekolah from "hooks/useSekolah";
import ReactiveButton from "reactive-button"; 
import { postProfilUser } from "client/AuthClient";

const BiodataPPDBPage = () => {
  const { sekolah } = useSekolah();
  const initialStateForm = {
    nisn: "",
    avatar: "",
    whatsapp: "",
    nama: "",
    namaPanggilan: "",
    gender: "L",
    tempatLahir: "",
    tanggalLahir: momentPackage(),
    asalSekolah: "",
    kodepos: "",
    btnState: "idle",
    namaAyah: "",
    telpAyah: "",
    alamatAyah: "",
    pekerjaanAyah: "",
    namaIbu: "",
    telpIbu: "",
    alamatIbu: "",
    pekerjaanIbu: "",
    btnState: "idle",
    filePpdb: "",
  };

  const router = useRouter();

  const formValidation = (formData) => {
    if (!formData?.nisn) {
      return "Harap Memasukan NISN";
    }
    if (!formData?.whatsapp) {
      return "Harap Memasukkan whatsapp";
    }
    if (!formData?.nama) {
      return "Harap Memasukkan nama";
    }
    if (!formData?.asalSekolah) {
      return "Harap Memasukkan asal sekolah";
    }
    if (!formData?.filePpdb) {
      return "Harap mengunggah semua berkas";
    }
    return "";
  };

  const nextPage = () => {
    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    } else {
      router.push(`${ppdbURL}/nilai-rapor`);
    }
  };

  const { setTerdaftar } = usePPDB();
  const [formData, setFormData] = useState(initialStateForm);

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setTerdaftar(data);
    }
  };

  const handleSave = async () => {
    if (!checkNomor(formData.whatsapp)) {
      toast.error("Periksa kembali nomor WhatsApp yang Anda masukkan");
      return;
    }

    if (!checkNomor(formData.telpAyah) && formData.telpAyah) {
      toast.error("Periksa kembali nomor telepon Ayah yang Anda masukkan");
      return;
    }
    if (!checkNomor(formData.telpIbu) && formData.telpIbu) {
      toast.error("Periksa kembali nomor telepon Ibu yang Anda masukkan");
      return;
    }

    const payload = {
      ...formData,
      tanggalLahir: formData.tanggalLahir
        ? momentPackage(formData.tanggalLahir).format("YYYY-MM-DD")
        : momentPackage().format("YYYY-MM-DD"),
    };

    setFormData({ ...formData, btnState: "loading" });
  
    try {
      const { data } = await postProfilUser(payload);

      setFormData({ ...formData, btnState: "success" });
      toast.success(data?.message || "Data berhasil disimpan!");
    } catch (error) {
      setFormData({ ...formData, btnState: "error" });
      toast.error(error?.message || "Terjadi kesalahan saat menyimpan data");
    }
  };
  
  useEffect(() => {
    console.log(formData, "formdata");
    _getGelombangPPDB();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDB />

          <SectionIdentitasDiri
            formData={formData}
            setFormData={setFormData}
            initialStateForm={initialStateForm}
          />
          <SectionInformasiOrtu
            formData={formData}
            setFormData={setFormData}
            initialStateForm={initialStateForm}
          />
          {/* <SectionInformasiKesehatan /> */}



          <div className="card card-ss">
            <div className="card-body p-4 text-center">
              <p className="fw-bold color-dark">
                Pastikan data yang anda cantumkan di atas adalah benar dan dapat
                dipertanggungjawabkan.
              </p>

                <ReactiveButton
                  buttonState={formData.btnState}
                  onClick={handleSave}
                  color={"primary"}
                  idleText={"Simpan"}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  className="btn btn-primary rounded-pill fs-5 fw-bold py-2 px-5 bg-gradient-primary"
                />
            </div>
          </div>

          <div className="card card-ss mt-4">
            <div className="card-body d-flex justify-content-end align-items-center">
              {sekolah?.id == 121 ? (
                <button
                  className="btn btn-primary btn-primary-ss shadow-primary-ss bg-gradient-primary rounded-pill px-5 py-2 fw-bold"
                  onClick={nextPage}
                >
                  Selanjutnya
                </button>
              ) : (
                <Link href={`${ppdbURL}/nilai-rapor`}>
                  <button className="btn btn-primary btn-primary-ss shadow-primary-ss bg-gradient-primary rounded-pill px-5 py-2 fw-bold">
                    Selanjutnya
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default BiodataPPDBPage;
