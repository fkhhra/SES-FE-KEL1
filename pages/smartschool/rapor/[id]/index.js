import Link from "next/link";
import React, { useEffect, useState } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { FaChevronLeft, FaUndo } from "react-icons/fa";
import toast from "react-hot-toast";
import { getRaporSiswa } from "../../../../client/BukuIndukClient";
import {
  getRaporNilai,
  getRaporKeterampilan,
} from "../../../../client/RaporClient";
import { ssURL } from "../../../../client/clientAxios";
import { editStudentFoto } from "../../../../client/StudentClient";
import Layout from "../../../../components/Layout/Layout";
import SectionCover from "../../../../components/Rapor/SectionCover";
import SectionEkstrakurikuler from "../../../../components/Rapor/SectionEkstrakurikuler";
import SectionIndetitasPesertaDidik from "../../../../components/Rapor/SectionIdentitasPersertaDidik";
import SectionInformasiSiswa from "../../../../components/Rapor/SectionInformasiSiswa";
import SectionKetidakhadiran from "../../../../components/Rapor/SectionKetidakhadiran";
import SectionPengetahuanDanKeterampilan from "../../../../components/Rapor/SectionPengetahuanDanKeterampilan";
import SectionPrestasi from "../../../../components/Rapor/SectionPrestasi";
import SectionScrollMenu from "../../../../components/Rapor/SectionScrollMenu";
import SectionSikap from "../../../../components/Rapor/SectionSikap";
import SectionTandaTangan from "../../../../components/Rapor/SectionTandaTangan";
import ModalUbahFotoProfil from "../../../../components/Rombel/ModalUbahFotoProfil";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { hideModal } from "../../../../utilities/ModalUtils";
import SectionCatatanWaliKelas from "../../../../components/Rapor/SectionCatatanWalikelas";
import LayoutRapor from "components/Layout/LayoutRapor";
import RaporYadika from "components/Rapor/Yadika/RaporYadika";
import { filterAgama } from "utilities/RaporUtils";
import SectionIndetitasPesertaDidikSmkKampungJawa from "components/Rapor/SmkKampungJawa/SectionIdentitasPersertaDidikSmkKampungJawa";
import { momentPackage } from "utilities/HelperUtils";
import {
  getDistrict,
  getProvince,
  getRegency,
  getVillage,
} from "client/LokasiClient";
import { postProfilUserAdmin } from "client/AuthClient";
import SectionPraktikKerjaLapanganRaporYadika from "components/Rapor/Yadika/SectionPraktikKerjaLapanganRaporYadika";
import { useRouter } from "next/router";
import useUser from "hooks/useUser";
import SectionPraktikKerjaLapangan from "components/RaporPrint/SectionPraktikKerjaLapangan";

const index = ({ rombel_id, id, jadwal_mengajar }) => {
  const { user } = useUser();

  const [raporSiswa, setRaporSiswa] = useState({});
  const {
    siswa,
    ekskul,
    totalHadir,
    sekolah,
    ta,
    rombel,
    sikapsosial,
    sikapspiritual,
    muatan,
    predikat,
    kkm,
    totalMapel,
  } = raporSiswa;
  const listKKM = [];
  kkm?.map((item) => {
    item?.mapelRapor?.map((mapel) => {
      listKKM.push({
        mMataPelajaranId: mapel?.mMataPelajaranId,
        kkm2: mapel?.kkm2,
        kkm: mapel.mataPelajaran.kkm,
      });
    });
  });

  const [loading, setLoading] = useState(true);

  const [jenisRapor, setJenisRapor] = useState("akhirSemester");
  const [totalSakit, setTotalSakit] = useState(0);
  const [totalIzin, setTotalIzin] = useState(0);
  const router = useRouter();
  const [totalAlpa, setTotalAlpa] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);

  const _getRaporSiswa = async () => {
    setLoading(true);
    const { data } = await getRaporSiswa(rombel_id, id);
    if (data) {
      setRaporSiswa(data);
      // await Promise.all(
      //   data?.muatan?.map((d) => {
      //     return Promise.all(
      //       filterAgama(d?.mapelRapor, data?.siswa)?.map((e) => {
      //         return Promise.all([
      //           getRaporNilai(e?.mataPelajaran?.id, id),
      //           getRaporKeterampilan(e?.mataPelajaran?.id, id),
      //         ]);
      //       })
      //     );
      //   })
      // );
      // updateRapor();
    }
    setLoading(false);
  };

  const updateRapor = async () => {
    setLoading(true);
    const { data } = await getRaporSiswa(rombel_id, id);
    if (data) {
      setRaporSiswa(data);
    }
    setLoading(false);
  };

  const initialFormData = {
    avatar: "",
    userId: 0,
    button: "idle",
  };
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const changeFoto = (event, url) => {
    setFormData({ ...formData, avatar: url });
  };

  const putFoto = async () => {
    const { data, error } = await editStudentFoto(formData.userId, {
      avatar: formData.avatar,
    });

    if (data) {
      toast.success(data?.message);
      if (formData.userId == id) {
        siswa.avatar = formData.avatar;
      }
      rombel.anggotaRombel.find(
        (item) => item?.user?.id == formData?.userId
      ).user.avatar = formData.avatar;
      setFormData(initialFormData);
      hideModal("modalUbahFotoProfil");
    } else {
      toast.error(error?.message);
    }
  };

  const handleTengahSemester = () => {
    setJenisRapor("tengahSemester");
    localStorage.setItem("jenisRapor", "tengahSemester");
  };

  const handleAkhirSemester = () => {
    setJenisRapor("akhirSemester");
    localStorage.setItem("jenisRapor", "akhirSemester");
  };

  const [formData1ss, setFormData1ss] = useState({});

  useEffect(() => {
    setFormData1ss({
      nrk: siswa?.profil?.nrk,
      nip: siswa?.profil?.nip,
      nuptk: siswa?.profil?.nuptk,
      nisn: siswa?.profil?.nisn,
      nis: siswa?.profil?.nis,
      whatsapp: siswa?.whatsapp,
      nama: siswa?.nama,
      gender: siswa?.gender,
      agama: siswa?.agama,
      email: siswa?.email,
      tempatLahir: siswa?.tempatLahir,
      tanggalLahir: momentPackage(siswa?.tanggalLahir),
      asalSekolah: siswa?.profil?.asalSekolah,
      alamatAsalSekolah: siswa?.profil?.alamatAsalSekolah,
      noIjazah: siswa?.profil?.noIjazah,
      fileIjazah: siswa?.profil?.fileIjazah,
      kodepos: siswa?.profil?.kodepos,
      provinceId: siswa?.profil?.provinceId,
      regencyId: siswa?.profil?.regencyId,
      districtId: siswa?.profil?.districtId,
      villageId: siswa?.profil?.villageId,
      alamat: siswa?.profil?.alamat,
      tahunIjazah: siswa?.profil?.tahunIjazah,
      kelasDiterima: siswa?.profil?.kelasDiterima,
      tanggalMasuk: siswa?.profil?.tanggalMasuk,
      // ORTU
      namaAyah: siswa?.profil?.namaAyah,
      telpAyah: siswa?.profil?.telpAyah,
      alamatAyah: siswa?.profil?.alamatAyah,
      pekerjaanAyah: siswa?.profil?.pekerjaanAyah,
      namaIbu: siswa?.profil?.namaIbu,
      telpIbu: siswa?.profil?.telpIbu,
      alamatIbu: siswa?.profil?.alamatIbu,
      pekerjaanIbu: siswa?.profil?.pekerjaanIbu,
      namaWali: siswa?.profil?.namaWali,
      telpWali: siswa?.profil?.telpWali,
      alamatWali: siswa?.profil?.alamatWali,
      pekerjaanWali: siswa?.profil?.pekerjaanWali,
    });
  }, [siswa]);

  const [buttonState, setButtonState] = useState("idle");

  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);

  const _postProfilUser = async () => {
    setButtonState("loading");
    const { data, error } = await postProfilUserAdmin({
      ...formData1ss,
      tanggalLahir: formData1ss.tanggalLahir
        ? momentPackage(formData1ss.tanggalLahir).format("YYYY-MM-DD")
        : momentPackage().format("YYYY-MM-DD"),
      tanggalMasuk: formData1ss.tanggalMasuk
        ? momentPackage(formData1ss.tanggalMasuk).format("YYYY-MM-DD")
        : "",

      admin: 1,
      m_user_id: siswa?.id,
    });

    if (data) {
      setButtonState("success");
      hideModal("modalEditDetailProfil");
      toast.success(data?.message);
      _getRaporSiswa();
      // setUser({
      //   ...user,
      //   whatsapp: formData1ss.whatsapp,
      //   nama: formData1ss.nama,
      //   gender: formData1ss.gender,
      //   tempatLahir: formData1ss.tempatLahir,
      //   tanggalLahir: formData1ss.tanggalLahir,
      //   agama: formData1ss.agama,
      //   profil: {
      //     ...user?.profil,
      //     nrk: formData1ss.nrk,
      //     nip: formData1ss.nip,
      //     nuptk: formData1ss.nuptk,
      //     nisn: formData1ss.nisn,
      //     nis: formData1ss.nis,
      //     asalSekolah: formData1ss.asalSekolah,
      //     kodepos: formData1ss.kodepos,
      //     provinceId: formData1ss.provinceId,
      //     regencyId: formData1ss.regencyId,
      //     districtId: formData1ss.districtId,
      //     villageId: formData1ss.villageId,
      //     alamat: formData1ss?.alamat,
      //   },
      // });
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  const refreshNilai = async () => {
    await Promise.all(
      muatan?.map((d) => {
        return Promise.all(
          d?.mapelRapor?.map((e) => {
            return Promise.all([
              getRaporNilai(e?.mataPelajaran?.id, id),
              getRaporKeterampilan(e?.mataPelajaran?.id, id),
            ]);
          })
        );
      })
    );
    detailNilaiSiswa();
  };

  const handleChangeDate = (e, name) => {
    setFormData1ss({
      ...formData1ss,
      [name]: e,
    });
  };

  const handleChangeForm = (e) => {
    setFormData1ss({
      ...formData1ss,
      [e.target.name]: e.target.value,
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
    setFormData1ss({
      ...formData1ss,
      [name]: e?.value,
    });
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
  useEffect(() => {
    _getProvince();
    formData1ss.provinceId &&
      _getRegency({ provinceId: formData1ss.provinceId });
    formData1ss.regencyId && _getDistrict({ regencyId: formData1ss.regencyId });
    formData1ss.districtId &&
      _getVillage({ districtId: formData1ss.districtId });
  }, []);
  useEffect(() => {
    _getRaporSiswa();
  }, [id]);

  useEffect(() => {
    setTotalAlpa(
      !jenisRapor || jenisRapor == "akhirSemester"
        ? siswa?.keteranganRaporUas?.alpa
        : siswa?.keteranganRapor?.alpa
    );
    setTotalSakit(
      !jenisRapor || jenisRapor == "akhirSemester"
        ? siswa?.keteranganRaporUas?.sakit
        : siswa?.keteranganRapor?.sakit
    );
    setTotalIzin(
      !jenisRapor || jenisRapor == "akhirSemester"
        ? siswa?.keteranganRaporUas?.izin
        : siswa?.keteranganRapor?.izin
    );
    if (user?.role == "admin") {
      router.push(
        `${ssURL}/rapor/${id}?rombel=${rombel_id}&jenisRapor=${jenisRapor}`
      );
    } else {
      router.push(
        `${ssURL}/rapor/${id}?rombel=${rombel_id}&jadwal_mengajar=${jadwal_mengajar}&jenisRapor=${jenisRapor}`
      );
    }
  }, [siswa, jenisRapor]);
  let link;
  if (user?.role == "admin") {
    link = `${ssURL}/rapor-buku-induk/${rombel_id}?nav=lihat-rapor`;
  } else {
    link = `${ssURL}/rombel/${jadwal_mengajar}?nav=rapor&subnav=lihat-rapor`;
  }
  // console.log(rombel);
  return (
    <LayoutRapor
      url={link}
      title={`Title`}
      jenisRapor={jenisRapor}
      setTengahSemester={handleTengahSemester}
      setAkhirSemester={handleAkhirSemester}
    >
      <AnimatePage>
        <div className="row gy-4 mb-4">
          <SectionScrollMenu
            rombel={rombel}
            id={id}
            rombelId={rombel_id}
            jadwalId={jadwal_mengajar}
            totalMapel={totalMapel}
            listKKM={listKKM}
            setFormData={setFormData}
            formData={formData}
            jenisRapor={jenisRapor}
          />
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="fw-extrabold color-dark title-border mb-5">
                      Cetak Rapor Siswa
                    </h4>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-outline-primary-ss p-1 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "42px", height: "42px" }}
                      onClick={() => refreshNilai()}
                    >
                      <FaUndo />
                    </button>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <Link
                      href={`${ssURL}/lihat-rapor-print/${rombel_id}/${id}?jenis_rapor=${
                        jenisRapor || "akhirSemester"
                      }`}
                    >
                      <a
                        className="w-100 rounded-ss btn-cetak p-3 d-flex align-items-center justify-content-center pointer"
                        target="_blank"
                      >
                        <img src="/img/icon-print.svg" alt="" />
                        <h5 className="fw-semibold color-secondary ms-4 mb-0">
                          Klik untuk mencetak{" "}
                          <span className="color-primary fw-bold">
                            Rapor Siswa
                          </span>
                        </h5>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row gy-4">
          {sekolah?.id == "33" ? (
            <RaporYadika
              sekolah={sekolah}
              siswa={siswa}
              ta={ta}
              setFormData={setFormData}
              rombel={rombel}
              sikapsosial={sikapsosial}
              sikapspiritual={sikapspiritual}
              muatan={muatan}
              predikat={predikat}
              totalAlpa={totalAlpa}
              totalIzin={totalIzin}
              totalSakit={totalSakit}
              putFoto={putFoto}
              changeFoto={changeFoto}
              formData={formData}
              jenisRapor={jenisRapor}
              handleChangeForm={handleChangeForm}
              formData1={formData1ss}
              _postProfilUser={_postProfilUser}
              handleChangeSelect={handleChangeSelect}
              province={province}
              regency={regency}
              district={district}
              village={village}
              handleChangeDate={handleChangeDate}
              buttonState={buttonState}
            />
          ) : (
            <>
              <div className="col-md-12">
                <SectionCover
                  sekolah={sekolah}
                  siswa={siswa}
                  ta={ta}
                  jenisRapor={jenisRapor}
                />
              </div>
              <div className="col-md-12">
                {sekolah?.id == "15" || sekolah?.id == "13" ? (
                  <SectionIndetitasPesertaDidikSmkKampungJawa
                    siswa={siswa}
                    sekolah={sekolah}
                    ta={ta}
                    setFormData={setFormData}
                    formData={formData}
                    _getRaporSiswa={_getRaporSiswa}
                    handleChangeForm={handleChangeForm}
                    formData1={formData1ss}
                    _postProfilUser={_postProfilUser}
                    handleChangeSelect={handleChangeSelect}
                    province={province}
                    regency={regency}
                    district={district}
                    village={village}
                    handleChangeDate={handleChangeDate}
                    buttonState={buttonState}
                  />
                ) : (
                  <SectionIndetitasPesertaDidik
                    siswa={siswa}
                    sekolah={sekolah}
                    ta={ta}
                    setFormData={setFormData}
                    formData={formData}
                    _getRaporSiswa={_getRaporSiswa}
                    handleChangeForm={handleChangeForm}
                    formData1={formData1ss}
                    _postProfilUser={_postProfilUser}
                    handleChangeSelect={handleChangeSelect}
                    province={province}
                    regency={regency}
                    district={district}
                    village={village}
                    handleChangeDate={handleChangeDate}
                    buttonState={buttonState}
                  />
                )}
              </div>
              <div className="col-md-12">
                <SectionInformasiSiswa
                  sekolah={sekolah}
                  siswa={siswa}
                  ta={ta}
                  kelas={rombel?.nama}
                  rombel={rombel}
                />
              </div>
              <div className="col-md-12">
                <SectionSikap
                  sikap={
                    !jenisRapor || jenisRapor == "tengahSemester"
                      ? siswa?.sikap
                      : siswa?.sikapUas
                  }
                  siswa={siswa?.nama}
                  sikapsosial={sikapsosial}
                  sikapspiritual={sikapspiritual}
                  sekolah={sekolah}
                />
              </div>
              <div className="col-md-12">
                <SectionPengetahuanDanKeterampilan
                  muatan={muatan}
                  predikat={predikat}
                  siswa={siswa}
                  jenisRapor={jenisRapor}
                />
              </div>
              <div className="col-md-12">
                <SectionEkstrakurikuler ekskul={siswa?.raporEkskul} />
              </div>
              {sekolah?.id == 13 || sekolah?.id == 578 ? (
                <>
                  {rombel?.tingkat == "XII" || rombel?.tingkat == "XI" ? (
                    <div className="col-md-12">
                      <SectionPraktikKerjaLapanganRaporYadika
                        keteranganPkl={siswa?.keteranganPkl}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
              <div className="col-md-12">
                <SectionKetidakhadiran
                  totalAlpa={totalAlpa}
                  totalIzin={totalIzin}
                  totalSakit={totalSakit}
                  siswa={
                    !jenisRapor || jenisRapor == "tengahSemester"
                      ? siswa?.keteranganRapor
                      : siswa?.keteranganRaporUas
                  }
                  tingkat={rombel?.tingkat}
                  sekolah={sekolah}
                />
              </div>
              <div className="col-md-12">
                <SectionCatatanWaliKelas
                  catatan={
                    !jenisRapor || jenisRapor == "tengahSemester"
                      ? siswa?.keteranganRapor
                      : siswa?.keteranganRaporUas
                  }
                  sekolah={sekolah}
                  tingkat={rombel?.tingkat}
                />
              </div>
              <div className="col-md-12">
                <SectionTandaTangan
                  walikelas={rombel}
                  ta={ta}
                  sekolah={sekolah}
                  kelas={rombel}
                />
              </div>
              <ModalUbahFotoProfil
                formData={formData}
                onSubmit={putFoto}
                changeFoto={changeFoto}
              />
            </>
          )}
        </div>
      </AnimatePage>
    </LayoutRapor>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { rombel, jadwal_mengajar },
}) {
  return {
    props: {
      id,
      rombel_id: rombel || null,
      jadwal_mengajar: jadwal_mengajar || null,
    },
  };
}

export default index;
