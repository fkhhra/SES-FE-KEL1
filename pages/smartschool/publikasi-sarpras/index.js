import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import {
  getInformasiSekolah,
  updateInformasiSekolah,
} from "../../../client/InformasiSekolahClient";
import Layout from "../../../components/Layout/Layout";
import SectionBannerSarpras from "../../../components/PublikasiSarpras/SectionBannerSarpras";
import SectionDaftarSarpras from "../../../components/PublikasiSarpras/SectionDaftarSarpras";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import SarprasSkeleton from "../../../components/Shared/Skeleton/SarprasSkeleton";

const initialFormData = {
  bannerSarpras: "",
};

const index = () => {
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  const handlePutPublikasi = async () => {
    const { data } = await updateInformasiSekolah(formData);
    if (data) {
      toast.success(data.message);
      getPublikasiData();
    }
  };

  const getPublikasiData = async () => {
    setLoading(true);
    const params = {
      section: "sarpras",
    };

    const { data } = await getInformasiSekolah(params);
    if (data) {
      setFormData({ ...formData, ...data.informasiSekolah });
    }
    setLoading(false);
  };

  useEffect(() => {
    getPublikasiData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="section-banner-halaman-sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Banner Halaman Sarpras</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit banner halaman
            sarpras pada website informasi sekolah.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="banner-halaman-sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Mengedit Banner ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol dan pilih foto untuk mengedit banner halaman sarpras
            pada website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="daftar-sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Sarpras</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit daftar sarpras yang
            ada pada halaman sarpras website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi daftar sarpras yang ada pada
            bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-tambah-sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Menambah Sarpras Baru ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan sarpras baru.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Sarpras</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar sarpras yang sudah ditambahkan ke dalam halaman
            sarpras.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Sarpras</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit sarpras yang sudah
            ditambahkan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Sarpras</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus sarpras yang sudah ditambah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-simpan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Simpan Perubahan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol simpan untuk menyimpan informasi yang sudah anda
            tambahkan atau ubah.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <MyJoyride steps={steps} />
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss">
              {loading && <SarprasSkeleton />}
              {!loading && (
                <>
                  <SectionBannerSarpras
                    formData={formData}
                    handleChangeForm={handleChangeForm}
                    setButtonState={setButtonState}
                  />
                  <SectionDaftarSarpras />
                </>
              )}
              <div className="card-footer-ss pb-5">
                <div className="mb-5">
                  <hr className="m-0" />
                </div>
                <div className="d-flex justify-content-end align-items-center px-4 pb-3">
                  <div data-joyride="btn-simpan">
                    <ReactiveButton
                      buttonState={buttonState}
                      onClick={handlePutPublikasi}
                      color={"primary"}
                      idleText={"Simpan Perubahan"}
                      loadingText={"Diproses"}
                      successText={"Berhasil"}
                      errorText={"Gagal"}
                      type={"button"}
                      className={
                        "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
