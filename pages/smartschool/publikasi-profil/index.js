import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import {
  getInformasiSekolah,
  updateInformasiSekolah,
} from "../../../client/InformasiSekolahClient";
import Layout from "../../../components/Layout/Layout";
import SectionBanner from "../../../components/PublikasiProfil/SectionBanner";
import SectionKontakSekolah from "../../../components/PublikasiProfil/SectionKontakSekolah";
import SectionLaguMars from "../../../components/PublikasiProfil/SectionLaguMars";
import SectionLambangSekolah from "../../../components/PublikasiProfil/SectionLambangSekolah";
import SectionPesanKepsek from "../../../components/PublikasiProfil/SectionPesanKepsek";
import SectionSejarahSekolah from "../../../components/PublikasiProfil/SectionSejarahSekolah";
import SectionTentangSekolah from "../../../components/PublikasiProfil/SectionTentangSekolah";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import SarprasSkeleton from "../../../components/Shared/Skeleton/SarprasSkeleton";

const initialFormData = {
  // section halaman profil
  bannerProfil: "",

  // section tentang sekolah
  deskripsiSekolah: "",
  fotoTentangSekolah: [],

  // section pesan kepsek
  pesanKepsek: "",
  fotoKepsek: "",

  // section sejarah
  sejarah: "",
  fotoSejarah: "",

  // section lambang sekolah
  fotoLogo: "",

  // section mars sekolah
  lirikMars: "",
  laguMars: "",

  // section kontak sekolah
  alamat: "",
  gmaps: "",
  email: "",
  telp: "",
  fax: "",
};

const index = () => {
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  // const [loading, setLoading] = useState(false);

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  const handlePutPublikasiProfil = async () => {
    const payload = {
      ...formData,
      deskripsiSekolah: window.$(`#deskripsiSekolah`).summernote("code"),
      pesanKepsek: window.$(`#pesanKepsek`).summernote("code"),
      sejarah: window.$(`#sejarah`).summernote("code"),
      lirikMars: window.$(`#lirikMars`).summernote("code"),
    };

    const { data } = await updateInformasiSekolah(payload);
    if (data) {
      toast.success(data.message);
      getPublikasiData();
    }
  };

  const getPublikasiData = async () => {
    // setLoading(true);
    const params = {
      section: "profil",
    };

    const { data } = await getInformasiSekolah(params);
    if (data) {
      setFormData({
        ...formData,
        ...data.informasiSekolah,
        fotoTentangSekolah: data.informasiSekolah?.fotoTentangSekolah || [],
      });
      // setLoading(false);

      // summernote
      window
        .$(`#deskripsiSekolah`)
        .summernote("code", data.informasiSekolah.deskripsiSekolah);
      window
        .$(`#pesanKepsek`)
        .summernote("code", data.informasiSekolah.pesanKepsek);
      window.$(`#sejarah`).summernote("code", data.informasiSekolah.sejarah);
      window
        .$(`#lirikMars`)
        .summernote("code", data.informasiSekolah.lirikMars);
    }
  };

  useEffect(() => {
    getPublikasiData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="section-banner-halaman-profil"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Banner Halaman Profil</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit banner halaman
            profil sekolah pada website informasi sekolah.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="banner-halaman-profil"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Mengedit Banner ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol dan pilih foto untuk mengedit banner pada halaman
            profil website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="tentang-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Tentang Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit bagian tentang
            sekolah yang ada pada profil website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi tentang sekolah pada bagian
            ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="deskripsi-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Deskripsi Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan deskripsi sekolah anda pada form deskripsi sekolah, yang
            akan ditampilkan pada halaman profil website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="foto-tentang-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Foto Tentang Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol "Tambah Foto" untuk menambahkan beberapa foto tentang
            sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="pesan-kepsek"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Pesan Kepala Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit bagian pesan kepala
            sekolah yang ada pada profil website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi pesan kepala sekolah pada
            bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="pesan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Pesan</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan pesan kepala sekolah anda pada form pesan, yang akan
            ditampilkan pada halaman profil website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="foto-pesan-kepsek"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Foto Kepala Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tambahkan foto kepala sekolahmu untuk bagian pesan kepala sekolah
            pada halaman profil website informasi sekolah. Tekan tombol untuk
            menambahkan atau mengganti foto kepala sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="sejarah-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Sejarah Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit bagian sejarah
            sekolah yang ada pada profil website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi sejarah sekolah pada bagian
            ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="form-sejarah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Form Sejarah</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan informasi mengenai sejarah sekolah anda pada form ini, yang
            akan ditampilkan pada halaman profil website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="foto-sejarah-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Foto Sejarah Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tambahkan foto mengenai sejarah sekolahmu untuk bagian sejarah
            sekolah pada halaman profil website informasi sekolah. Tekan tombol
            untuk menambahkan atau mengganti foto sejarah sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="lambang-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Lambang Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit bagian lambang
            sekolah yang ada pada profil website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi lambang sekolah pada bagian
            ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="foto-lambang-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Foto Lambang Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tambahkan foto lambang sekolahmu untuk bagian lambang sekolah pada
            halaman profil website informasi sekolah. Tekan tombol untuk
            menambahkan atau mengganti foto lambang sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="lagu-mars-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Lagu Mars Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Disini anda dapat menambahkan atau mengedit informasi mengenai lagu
            mars sekolah yang ada pada halamanan profil website informasi
            sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="file-lagu-mars"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">File Lagu Mars</h5>
          <p className="color-secondary fw-semibold">
            Tekan dan pilih file lagu mars untuk menambahkan file lagu mars
            sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="lirik-lagu-mars"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Lirik Lagu Mars</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan lirik lagu mars sekolahmu pada form lirik lagu mars.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="kontak-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Kontak Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit informasi mengenai
            kontak sekolah yang ada pada halaman kotak website informasi
            sekolah. Anda bisa menambahkan atau mengganti informasi mengenai
            kontak sekolah pada bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="alamat-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Alamat Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan alamat sekolah anda pada form alamat.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="link-google-maps"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Link Google Maps</h5>
          <p className="color-secondary fw-semibold">
            Masukkan link google maps untuk menampilkan alamat sekolah berupa
            google maps di website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="email-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Email Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan email sekolahmu pada form email berikut.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="nomor-telpon"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Nomor Telpon Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan nomor telpon sekolahmu pada form nomor telpon berikut.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="nomor-fax"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Nomor Fax Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan nomor fax sekolahmu pada form nomor fax berikut.
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
              {/* {loading && <SarprasSkeleton />} */}
              <SectionBanner
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionTentangSekolah
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionPesanKepsek
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionSejarahSekolah
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionLambangSekolah
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionLaguMars
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />
              <SectionKontakSekolah
                formData={formData}
                handleChangeForm={handleChangeForm}
                setButtonState={setButtonState}
              />

              <div className="card-footer-ss pb-5">
                <div className="d-flex justify-content-end align-items-center px-4 pb-3">
                  <div data-joyride="btn-simpan">
                    <ReactiveButton
                      buttonState={buttonState}
                      onClick={handlePutPublikasiProfil}
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
