import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import {
  deleteKegiatan,
  getKegiatan,
  updateKegiatan,
} from "../../../client/KegiatanClient";
import Layout from "../../../components/Layout/Layout";
import ModalTambahDaftarKegiatan from "../../../components/PublikasiKegiatan.js/ModalTambahDaftarKegiatan";
import ModalTambahMenuKegiatan from "../../../components/PublikasiKegiatan.js/ModalTambahMenuKegiatan";
import SectionBannerKegiatan from "../../../components/PublikasiKegiatan.js/SectionBannerKegiatan";
import SectionDaftarKegiatan from "../../../components/PublikasiKegiatan.js/SectionDaftarKegiatan";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import SidebarTabMenu from "../../../components/Shared/SidebarTabMenu/SidebarTabMenu";
import SarprasSkeleton from "../../../components/Shared/Skeleton/SarprasSkeleton";

const initialFormData = {
  banner: "",
};

const index = ({ id }) => {
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [listKegiatan, setListKegiatan] = useState([]);
  const [informasiKegiatan, setInformasiKegiatan] = useState([]);
  const [editState, setEditState] = useState({ id: "", nama: "" });
  const [loading, setLoading] = useState(true);
  const kegiatanId = id || listKegiatan?.[0]?.id;
  const kegiatanNama =
    listKegiatan?.filter((kegiatan) => kegiatan?.id === parseInt(id))?.[0]
      ?.nama || listKegiatan?.[0]?.nama;

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  const onClickEdit = (data) => {
    setEditState({
      id: data.id,
      nama: data.nama,
    });
  };

  const putKegiatanData = async () => {
    setButtonState("loading");
    const { data } = await updateKegiatan(kegiatanId, formData);
    if (data) {
      setButtonState("success");
      toast.success(data.message);
      getKegiatanData();
    }
  };

  const getKegiatanData = async () => {
    setLoading(true);
    const params = {
      kegiatanId: kegiatanId,
    };

    const { data } = await getKegiatan(params);
    if (data) {
      setListKegiatan(data.kegiatan);

      if (data.informasiKegiatan) {
        setFormData({ ...formData, banner: data.informasiKegiatan.banner });
        setInformasiKegiatan(data.informasiKegiatan);
      }
    }
    setLoading(false);
  };

  const handleDeleteKegiatan = async (id) => {
    const { data } = await deleteKegiatan(id);
    if (data) {
      toast.success(data.message);
      getKegiatanData();
    }
  };

  useEffect(() => {
    if (kegiatanId) {
      getKegiatanData();
    }
  }, [kegiatanId]);

  useEffect(() => {
    getKegiatanData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="sidebar-menu-jurusan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Menu Kegiatan</h5>
          <p className="color-secondary fw-semibold">
            Anda dapat melihat semua informasi mengenai kegiatan. Tekan pada
            nama kegiatan untuk memilih informasi kegiatan yang anda ingin
            lihat.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="btn-tambah-sidebarmenu"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Ingin Menambah Menu Kegiatan Baru ?
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambah menu kegiatan baru.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="section-banner-halaman-kegiatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Banner Halaman Kegiatan</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit banner halaman
            kegiatan pada website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="banner-halaman-kegiatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Mengedit Banner ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol dan pilih foto untuk mengedit banner halaman kegiatan
            pada website informasi sekolah.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="daftar-kegiatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Kegiatan</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini merupakan tempat anda untuk mengedit daftar kegiatan yang
            ada pada halaman kegiatan website informasi sekolah. Anda bisa
            menambahkan atau mengganti informasi daftar kegiatan yang ada pada
            bagian ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-tambah-kegiatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Ingin Menambah Kegiatan Baru ?
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk menambahkan kegiatan baru.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-kegiatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Kegiatan</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar kegiatan yang sudah ditambahkan ke dalam
            halaman kegiatan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-kegiatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Kegiatan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit kegaitan yang sudah
            ditambahkan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-kegiatan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Kegiatan</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus kegiatan yang sudah ditambah.
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
          <SidebarTabMenu
            loading={loading}
            idParams={kegiatanId}
            listMenu={listKegiatan}
            withBtnTambah={{
              title: "Tambah Kegiatan",
              onClick: () => setEditState({ id: "", nama: "" }),
              dataBsTarget: "modalTambahKegiatan",
            }}
            withDropdown={{
              onClickDelete: (id) => handleDeleteKegiatan(id),
              onClickEdit: (data) => onClickEdit(data),
              dataBsTarget: "modalTambahKegiatan",
            }}
          />
          <div className="col-lg-9">
            <div className="card card-ss">
              {loading && <SarprasSkeleton />}
              {!loading && (
                <>
                  <SectionBannerKegiatan
                    formData={formData}
                    handleChangeForm={handleChangeForm}
                    kegiatanNama={kegiatanNama}
                  />
                  <SectionDaftarKegiatan
                    kegiatanNama={kegiatanNama}
                    kegiatanId={kegiatanId}
                    kegiatanGaleri={informasiKegiatan?.galeri}
                    getKegiatanData={getKegiatanData}
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
                      onClick={putKegiatanData}
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
      <ModalTambahMenuKegiatan
        getKegiatanData={getKegiatanData}
        editState={editState}
      />
    </Layout>
  );
};

export async function getServerSideProps({ query: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
