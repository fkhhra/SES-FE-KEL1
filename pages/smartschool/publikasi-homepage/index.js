import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import {
  getInformasiSekolah,
  updateInformasiSekolah,
} from "../../../client/InformasiSekolahClient";
import Layout from "../../../components/Layout/Layout";
import SectionMengapaHarusSekolahDisini from "../../../components/Publikasi/SectionMengapaHarusSekolahDisini";
import SectionProfilSekolah from "../../../components/Publikasi/SectionProfilSekolah";
import SectionSelamatDatang from "../../../components/Publikasi/SectionSelamatDatang";
import SectionSlider from "../../../components/Publikasi/SectionSlider";
import SectionVirtualTour from "../../../components/Publikasi/SectionVirtualTour";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import PublikasiHomePageSkeleton from "../../../components/Shared/Skeleton/PulikasiHomePageSkeleton";

const initialFormData = {
  // section selamat datang
  deskripsiSingkat: "",
  visi: "",
  misi: "",

  // section mengapa
  backgroundSectionMengapa: "",
  jumlahSiswa: "",
  jumlahGuru: "",
  jumlahKelas: "",

  // section profil
  thumbnailProfil: "",
  videoProfil: "",

  // section Jelajah Sekolah
  backgroundSectionVirtualTour: "",
  virtualTour: "",
};

const index = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [loading, setLoading] = useState(true);

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  const handlePutPublikasi = async () => {
    const payload = {
      ...formData,
      deskripsiSingkat: window.$(`#deskripsi`).summernote("code"),
      visi: window.$(`#visi`).summernote("code"),
      misi: window.$(`#misi`).summernote("code"),
    };

    const { data } = await updateInformasiSekolah(payload);
    if (data) {
      toast.success(data.message);
      getPublikasiData();
    }
  };

  const getPublikasiData = async () => {
    setLoading(true);
    const params = {
      section: "beranda",
    };

    const { data } = await getInformasiSekolah(params);
    if (data) {
      setFormData({ ...formData, ...data?.informasiSekolah });

      // summernote
      window
        .$(`#deskripsi`)
        .summernote("code", data?.informasiSekolah?.deskripsiSingkat);
      window.$(`#visi`).summernote("code", data?.informasiSekolah?.visi);
      window.$(`#misi`).summernote("code", data?.informasiSekolah?.misi);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPublikasiData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="section-slider"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Section Slider</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit slider yang ada pada
            homepage website informasi sekolah. Anda bisa menambahkan atau
            mengganti slider website informasi sekolah pada bagian ini.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="btn-tambah-slider"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Menambah Slider ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan slider pada website informasi
            sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-slider"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Slider</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar slider yang sudah ditambahkan di website
            informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-slider"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Slider</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit slider website informasi
            sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-slider"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Slider</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus slider yang sudah
            ditambahkan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="section-selamat-datang"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Section Selamat Datang</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit section selamat
            datang yang ada pada homepage website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi section selamat datang pada
            bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="deskripsi-singkat-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Deskripsi Singkat Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Disini anda dapat menjelaskan sekolah anda secara singkat. ketik
            pada kolom deskripsi singkat sekolah untuk memberikan deskripsi
            sekolah, yang nantinya akan tampil pada halaman homepege website
            informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="visi-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Visi Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Disini anda dapat menambahkan atau mengedit informasi mengenai visi
            sekolah yang ada pada halamanan homepege website informasi sekolah
            anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="misi-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Misi Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Disini anda dapat menambahkan atau mengedit informasi mengenai misi
            sekolah yang ada pada halamanan homepege website informasi sekolah
            anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="section-mengapa-harus-sekolah-disini"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Section Mengapa Harus Sekolah Disini
          </h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit section mengapa
            harus sekolah disini yang ada pada homepage website informasi
            sekolah. Anda bisa menambahkan atau mengganti informasi section
            mengapa harus sekolah disini pada bagian ini.
          </p>
        </div>
      ),
    },
    {
      target:
        '[data-joyride="background-section-mengapa-harus-sekolah-disini"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Background Section</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan background dari section mengapa harus sekolah disini.
            Klik dan pilih gambar untuk mengganti background dari section ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="jumlah-siswa"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Jumlah Siswa</h5>
          <p className="color-secondary fw-semibold">
            Masukkan informasi mengenai berapa jumlah siswa yang ada di sekolah
            anda pada form ini agar dapat menampilkan jumlah siswa pada website
            informasi sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="jumlah-guru"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Jumlah Guru</h5>
          <p className="color-secondary fw-semibold">
            Masukkan informasi mengenai berapa jumlah guru yang ada di sekolah
            anda pada form ini agar dapat menampilkan jumlah guru pada website
            informasi sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="jumlah-kelas"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Jumlah Kelas</h5>
          <p className="color-secondary fw-semibold">
            Masukkan informasi mengenai berapa jumlah kelas yang ada di sekolah
            anda pada form ini agar dapat menampilkan jumlah kelas pada website
            informasi sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="section-profil-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Video Profil Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Disini anda dapat menambahkan atau mengedit informasi mengenai video
            profil yang ada pada halamanan homepege website informasi sekolah
            anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="thumbnail-video"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Thumbnail Video</h5>
          <p className="color-secondary fw-semibold">
            Tekan dan pilih gambar untuk mengganti thumbnail dari video profil
            sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="video-profil"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Video Profil Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Masukkan video profil sekolah melalui tombol "Unggah Fila" atau
            "Tautan Link", yang nantinya akan tampil pada halaman homepege
            website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joride="section-virtual-tour"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Section Jelajah Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit section Jelajah
            Sekolah yang ada pada homepage website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi section Jelajah Sekolah pada
            bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="banner-virtual-tour"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Background Jelajah Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan background dari section Jelajah Sekolah. Klik dan
            pilih gambar untuk mengganti background dari section ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="link-virtual-tour"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Link Jelajah Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Masukkan link Jelajah Sekolah untuk membuat para pengunjung website
            informasi sekolah dapat mengakses Jelajah Sekolah.
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
        <div className="card card-ss">
          <div className="card-body p-0 pt-4">
            {loading && <PublikasiHomePageSkeleton />}
            {!loading && (
              <>
                <SectionSlider /> <hr className="my-5 mx-4" />
                <SectionSelamatDatang formData={formData} />{" "}
                <hr className="my-5 mx-4" />
                <SectionMengapaHarusSekolahDisini
                  formData={formData}
                  handleChangeForm={handleChangeForm}
                  setButtonState={setButtonState}
                />{" "}
                <hr className="my-5 mx-4" />
                <SectionProfilSekolah
                  formData={formData}
                  handleChangeForm={handleChangeForm}
                  setFormData={setFormData}
                  setButtonState={setButtonState}
                />{" "}
                <hr className="my-5 mx-4" />
                <SectionVirtualTour
                  formData={formData}
                  handleChangeForm={handleChangeForm}
                  setButtonState={setButtonState}
                />{" "}
                <hr className="my-5 mx-4" />
              </>
            )}
          </div>
          <div className="card-footer-ss pb-5">
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
      </AnimatePage>
    </Layout>
  );
};

export default index;
