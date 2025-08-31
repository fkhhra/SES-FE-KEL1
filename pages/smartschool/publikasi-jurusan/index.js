import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import {
  getInformasiJurusan,
  updateInformasiJurusan,
} from "../../../client/InformasiJurusanClient";
import Layout from "../../../components/Layout/Layout";
import SectionBannerHalamanJurusan from "../../../components/PublikasiJurusan/SectionBannerHalamanJurusan";
import SectionDeskripsiJurusan from "../../../components/PublikasiJurusan/SectionDeskripsiJurusan";
import SectionGaleriJurusan from "../../../components/PublikasiJurusan/SectionGaleriJurusan";
import SectionGuruJurusan from "../../../components/PublikasiJurusan/SectionGuruJurusan";
import SectionSambutanKetuaJurusan from "../../../components/PublikasiJurusan/SectionSambutanKetuaJurusan";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import SidebarMenu from "../../../components/Shared/SidebarTabMenu/SidebarTabMenu";
import SarprasSkeleton from "../../../components/Shared/Skeleton/SarprasSkeleton";

const initialFormData = {
  banner: "",
  sambutan: "",
  deskripsi: "",
  cover: "",
  galeri: [],
  mJurusanId: null,
};

const index = ({ id }) => {
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [jurusan, setJurusan] = useState([]);
  const [listGuru, setListGuru] = useState([]);
  const [listGuruJurusan, setListGuruJurusan] = useState([]);
  const [loading, setLoading] = useState(true);
  const mJurusanId = id || jurusan?.[0]?.id;

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  const getJurusanData = async () => {
    setLoading(true);
    const { data } = await getInformasiJurusan();
    if (data) {
      setJurusan(data.jurusan);
    }
    setLoading(false);
  };

  const getDetailJurusan = async () => {
    const params = {
      jurusanId: mJurusanId,
    };
    const { data } = await getInformasiJurusan(params);
    if (data) {
      const { createdAt, updatedAt, id, ...restData } =
        data.informasiJurusan || {};
      setFormData(restData);
      setListGuru(data.guru);
      setListGuruJurusan(data.guruJurusan);
      window.$(`#sambutan`).summernote("code", restData.sambutan || "");
      window.$(`#deskripsi`).summernote("code", restData.deskripsi || "");
    }
  };

  const handlePutPublikasiJurusan = async () => {
    const payload = {
      ...formData,
      mJurusanId: mJurusanId,
      sambutan: window.$(`#sambutan`).summernote("code"),
      deskripsi: window.$(`#deskripsi`).summernote("code"),
    };

    const { data } = await updateInformasiJurusan(payload);
    if (data) {
      toast.success(data.message);
      getDetailJurusan();
    }
  };

  useEffect(() => {
    if (mJurusanId) {
      getDetailJurusan();
    }
  }, [mJurusanId]);

  useEffect(() => {
    getJurusanData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="sidebar-menu-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Menu Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Anda dapat melihat semua informasi mengenai jurusan. Tekan pada nama
            jurusan untuk memilih informasi jurusan yang anda ingin lihat.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="section-banner-halaman-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Banner Halaman Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit banner halaman
            kompetensi keahlian pada website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="banner-halaman-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Mengedit Banner ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol dan pilih foto untuk mengedit banner halaman kompetensi
            keahlian pada website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="sambutan-ketua-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Sambutan Ketua Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit bagian sambutan
            ketua jurusan yang ada pada halaman kompetensi keahlian website
            informasi sekolah. Anda bisa menambahkan atau mengganti informasi
            sambutan ketua jurusan pada bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="form-sambutan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Sambutan</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan sambutan ketua jurusan anda pada form sambutan, yang akan
            ditampilkan pada halaman kompetensi keahlian website informasi
            sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="deskripsi-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Deskripsi Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit bagian deskripsi
            jurusan yang ada pada halaman kompetensi keahlian website informasi
            sekolah. Anda bisa menambahkan atau mengganti informasi deskripsi
            jurusan pada bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="form-deskripsi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Deskripsi</h5>
          <p className="color-secondary fw-semibold">
            Tuliskan deskripsi jurusan anda pada form deskripsi jurusan, yang
            akan ditampilkan pada halaman kompetensi keahlian website informasi
            sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="foto-cover-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Foto Cover Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan atau mengganti foto cover jurusan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="guru-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Guru Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit informasi guru guru
            jurusan. Anda bisa menambahkan atau mengganti informasi guru guru
            jurusan pada bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-tambah-guru-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Menambah Guru Jurusan ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan guru jurusan baru.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-guru-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Guru Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar guru jurusan yang sudah ditambahkan ke dalam
            halaman kompetensi keahlian.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-guru-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Informasi Guru Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi guru jurusan yang
            sudah ditambahkan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-guru-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Informasi Guru Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus infomarsi guru jurusan yang
            sudah ditambah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="galeri-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Galeri Jurusan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol "Tambah Foto" untuk menambahkan beberapa foto tentang
            jurusan anda.
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
          <SidebarMenu listMenu={jurusan} idParams={id} loading={loading} />
          <div className="col-lg-9">
            <div className="card card-ss">
              {loading && <SarprasSkeleton />}
              {!loading && (
                <>
                  <SectionBannerHalamanJurusan
                    formData={formData}
                    handleChangeForm={handleChangeForm}
                    setButtonState={setButtonState}
                  />
                  <SectionSambutanKetuaJurusan />
                  <SectionDeskripsiJurusan
                    formData={formData}
                    handleChangeForm={handleChangeForm}
                    setButtonState={setButtonState}
                  />
                  <SectionGuruJurusan
                    mJurusanId={mJurusanId}
                    listGuru={listGuru}
                    listGuruJurusan={listGuruJurusan}
                    getDetailJurusan={getDetailJurusan}
                  />
                  <SectionGaleriJurusan
                    formData={formData}
                    handleChangeForm={handleChangeForm}
                    setButtonState={setButtonState}
                  />
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
                      onClick={handlePutPublikasiJurusan}
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

export async function getServerSideProps({ query: { id } }) {
  return {
    props: {
      id: id || "",
    },
  };
}

export default index;
