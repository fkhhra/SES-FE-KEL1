import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  baseURL,
  downloadURL,
  ssURL,
} from "../../../../../../client/clientAxios";
import {
  deleteRekapRombel,
  downloadRekapRombel,
  editRekapRombel,
  postRekapRombel,
  rekapMateri,
} from "../../../../../../client/RekapClient";
import Layout from "../../../../../../components/Layout/Layout";
import DaftarNilaiRekap from "../../../../../../components/Rekap/DaftarNilaiRekap";
import JudulRekapRombel from "../../../../../../components/Rekap/JudulRekapRombel";
import KelasRekap from "../../../../../../components/Rekap/KelasRekap";
import ModalTambahUjian from "../../../../../../components/Rekap/ModalTambahUjian";
import AnimatePage from "../../../../../../components/Shared/AnimatePage/AnimatePage";
import DetailRekapMateriSkeleton from "../../../../../../components/Shared/Skeleton/DetailRekapMateriSkeleton";
import { hideModal } from "../../../../../../utilities/ModalUtils";

const index = ({ id, materi_id }) => {
  const router = useRouter();
  const initialStateForm = {
    judul: "",
    tanggal: "",
    btnBio: "idle",
    tkJadwalUjianId: "",
  };

  /*================================================= declare states start ================================================*/
  const [formData, setFormData] = useState({
    ...initialStateForm,
  });
  const [rombel_id, setRombel_id] = useState();
  const [dataRekapMateri, setdataRekapMateri] = useState({});
  const [loading, setLoading] = useState(true);

  /*================================================= declare states end ================================================*/

  const rombelIds = [];
  const { rekap, materirombel, ujian: tugas } = dataRekapMateri;
  const daftarNilaiRekap = rekap?.rekaprombel?.filter((d) => {
    return d?.mRombelId == rombel_id;
  });
  const KKM = rekap?.materi?.mataPelajaran?.kkm;
  const rombelKelas = materirombel
    ?.filter((d) => {
      if (!rombelIds.includes(d.mRombelId)) {
        rombelIds.push(d.mRombelId);
        return true;
      } else {
        return false;
      }
    })
    ?.map((data, idx) => {
      const kelas = data?.rombel?.nama;
      const tingkat = data?.rombel?.tingkat;

      return {
        id: `${data?.rombel?.id}`,
        // url: `${ssURL}/rekap/${id}/ujian/${materi_id}?rombel_id=${data?.rombel?.id}`,
        kelas: `${kelas}`,
        tingkat: `${tingkat}`,
        active: rombel_id == data?.rombel?.id,
      };
    });

  /*================================================= fetch functions start ================================================*/
  const _getrekapRombel = async () => {
    setLoading(true);

    const { data } = await rekapMateri(id, materi_id, {
      rombel_id,
    });

    if (data) {
      if (rombel_id == undefined) {
        setRombel_id(data?.materirombel[0]?.rombel?.id);
      }
      setdataRekapMateri(data);
    }
    setLoading(false);
  };

  const _postRekapUjian = async () => {
    setFormData({ ...formData, btnBio: "loading" });

    if (formData.judul.trim() == "" && !formData.tkJadwalUjianId) {
      toast.error("Tugas Belum Dimasukan");
      setFormData({ ...formData, btnBio: "error" });
      return;
    } else if (formData.tanggal.trim() == "") {
      toast.error("Tanggal Belum Dimasukan");
      setFormData({ ...formData, btnBio: "error" });
      return;
    }

    const { data, error } = formData.id
      ? await editRekapRombel(
          {
            judul: formData.judul,
            tanggal: moment(formData.tanggal).format("YYYY-MM-DD HH:mm:ss"),
            mTugasId: 0,
            tkJadwalUjianId: formData.tkJadwalUjianId,
          },
          materi_id,
          id,
          formData.id
        )
      : await postRekapRombel(
          {
            judul: formData.judul,
            tanggal: moment(formData.tanggal).format("YYYY-MM-DD HH:mm:ss"),
            m_rombel_id: rombel_id,
            tkJadwalUjianId: formData.tkJadwalUjianId,
          },
          id,
          materi_id
        );

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      _getrekapRombel(rombel_id);
      hideModal("modalTambahTugas");
      setFormData(initialStateForm);
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const _deleteRekapTugas = async (id) => {
    const { data, error } = await deleteRekapRombel(id);
    if (data) {
      toast.success(data?.message);
      setFormData(initialStateForm);
      _getrekapRombel(rombel_id);
    } else if (error) {
      toast.success(error?.message);
    }
  };

  const _downloadTemplate = async (id) => {
    const { data, error } = await downloadRekapRombel(id);

    if (data) {
      window.open(`${downloadURL}${data}`);
    } else {
      toast.error(error.message);
    }
  };

  const _importNilaiRekap = async (id, file) => {
    const d = new FormData();
    d.append("file", file);
    await axios
      .post(baseURL + `/import/rekap-rombel/${id}`, d)
      .then((res) => {
        toast.success(res.data.message);
        _getrekapRombel();
        if (res?.length) {
          res?.map((d) => toast.error(d?.message));
        }
      })
      .catch((err) => {
        setButtonStateImportAnggotaRombel("error");
        toast.error(err.response.data.message);
      });
  };
  /*================================================= fetch functions end ================================================*/

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
      tanggal: tugas?.find((d) => d.id == e?.value).jadwalUjian.tanggalInput,
    });
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDate = (dateString, key) => {
    setFormData({ ...formData, [key]: dateString });
  };

  const onClickEdit = (data) => {
    if (data) {
      setFormData({
        id: data.id,
        judul: data.judul,
        tanggal: data.tanggal,
      });
    }
  };

  useEffect(() => {
    _getrekapRombel(rombel_id);
  }, [rombel_id]);
  return (
    <Layout>
      <AnimatePage>
        <div className="row mb-4">
          <div className="col-md-12">
            <Link
              href={`${ssURL}/rekap/${id}?nav=pengetahuan&subnav=rekap-ujian-harian`}
            >
              <a className="text-decoration-none fw-bolder color-primary">
                <FaChevronLeft />
                <span className="ms-2">Daftar Rekap</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="mb-4">
          <KelasRekap
            rombel_id={rombel_id}
            rombelKelas={rombelKelas}
            setRombel_id={setRombel_id}
          />
        </div>
        {loading && (
          <div>
            <DetailRekapMateriSkeleton />
          </div>
        )}
        {!loading && (
          <>
            {!rekap?.rekaprombel[0] ? (
              <div className="row justify-content-center my-4">
                <div className="col-sm-3 col-8">
                  <img
                    src="/img/empty-state-daftar-soal.png"
                    alt="empty-state"
                    className="img-fluid mb-2"
                  />
                </div>
                <div className="col-12 text-center">
                  <h5 className="color-dark fw-black">
                    Ujian Belum Ditambahkan
                  </h5>
                  <p className="fw-bold fs-14-ss">
                    Tekan tombol{" "}
                    <a
                      className="text-decoration-none color-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahTugas"
                      onClick={() => setFormData(initialStateForm)}
                    >
                      {" "}
                      di bawah ini
                    </a>{" "}
                    untuk menambahkan rekap ujian
                  </p>
                  <button
                    type="button"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTambahTugas"
                    data-joyride="btn-tambah-mapel"
                  >
                    Tambah Ujian
                  </button>
                </div>
              </div>
            ) : (
              <div className="row gy-4">
                <>
                  <JudulRekapRombel
                    rekap={rekap}
                    rekapRombel={daftarNilaiRekap?.[0]}
                    onClickEdit={onClickEdit}
                    _deleteRekapTugas={_deleteRekapTugas}
                    _downloadTemplate={_downloadTemplate}
                    _importNilaiRekap={_importNilaiRekap}
                    tipe="Ujian"
                  />
                  <DaftarNilaiRekap
                    daftarNilaiRekap={daftarNilaiRekap?.[0]}
                    nilaiKKM={KKM}
                  />
                </>
              </div>
            )}
          </>
        )}
        <ModalTambahUjian
          handleChangeForm={handleChangeForm}
          handleChangeSelect={handleChangeSelect}
          handleChangeDate={handleChangeDate}
          formData={formData}
          _postRekapUjian={_postRekapUjian}
          setFormData={setFormData}
          tugas={tugas}
          initialStateForm={initialStateForm}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id, materi_id },
  query: { rombel_id },
}) {
  return {
    props: {
      materi_id: materi_id || null,
      id: id || null,
      rombel_id: rombel_id || null,
    },
  };
}

export default index;
