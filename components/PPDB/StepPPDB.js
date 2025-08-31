import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FaAddressCard,
  FaAward,
  FaCheck,
  FaClipboard,
  FaLock,
  FaMapSigns,
  FaMoneyCheckAlt,
  FaPencilRuler,
  FaUser,
} from "react-icons/fa";
import { ppdbURL } from "../../client/clientAxios";
import usePPDB from "../../hooks/usePPDB";
import useUser from "../../hooks/useUser";
import checkData from "data/checkDataPPDB.json";
import useSekolah from "hooks/useSekolah";
import toast from "react-hot-toast";
import { getProfilUser } from "client/AuthClient";
import { momentPackage } from "utilities/HelperUtils";
import { getUser } from "client/UserClient";

const StepPPDB = ({ pembelian, rata1 }) => {
  const [rata2, setRata2] = useState(0);
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

  const [formData, setFormData] = useState(initialStateForm);
  const { user, setUser } = useUser();
  const { sekolah } = useSekolah();

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
      setFormData({
        ...initialStateForm,
        ...data?.profil?.profil,
        ...data.profil,
      });
    }
  };
  const { terdaftar } = usePPDB();

  // console.log('terdaftar dari stepPPDB', terdaftar)
  // console.log('kondisi smp', terdaftar?.gelombangAktif?.gelombang?.nama.toLowerCase().includes("smp"))
  const [steps, setSteps] = useState([]);

  const [checkPembayaran, setCheckPembayaran] = useState(false);
  const [checkPembayaranFormulir, setCheckPembayaranFormulir] = useState(false);
  const [checkBio, setCheckBio] = useState(false);
  const [checkNilai, setCheckNilai] = useState(false);
  const [checkPrestasi, setCheckPrestasi] = useState(false);

  // console.log(checkPembayaran);
  useEffect(() => {
    _getProfil();
  }, []);

  useEffect(() => {
    setRata2(rata1);
  }, [rata1]);

  useEffect(() => {
    const userData = {
      ...user?.profil,
      ...user,
    };
    if (user?.profil) {
      const checkbio = checkData["bio"].map((d) => {
        return userData[d] ? 1 : 0;
      });
      checkbio.includes(0) ? null : setCheckBio(true);
      const checknilai = checkData["nilai"].map((d) => {
        return userData[d] ? 1 : 0;
      });
      checknilai.includes(0) ? null : setCheckNilai(true);
      userData.bahasa?.length ||
        userData.prestasi?.length ||
        userData.pengalaman?.length
        ? setCheckPrestasi(true)
        : null;

      if (sekolah?.id == 9487 || sekolah?.id == 9489) {
        setRata2(
          (
            ((formData.semester1 ? parseFloat(formData.semester1) : 0) +
              (formData.semester2 ? parseFloat(formData.semester2) : 0) +
              (formData.semester3 ? parseFloat(formData.semester3) : 0)) /
            3
          ).toFixed(2)
        );
      }
    }
  }, [user]);

  useEffect(() => {
    if (terdaftar) {
      setCheckPembayaran(
        terdaftar?.gelombangAktif?.gelombang?.jalur
          ? JSON.parse(terdaftar?.gelombangAktif?.pembayaran || "[]")?.reduce(
            (a, b) => {
              if (b?.diverifikasi) {
                return a + b?.nominal;
              } else {
                return a + 0;
              }
            },
            0
          ) < 1
          : true
        // false
      );
      setCheckPembayaranFormulir(
        terdaftar?.gelombangPembelian?.gelombang?.jalur
          ? JSON.parse(
            terdaftar?.gelombangPembelian?.pembayaran || "[]"
          )?.reduce((a, b) => {
            if (b?.diverifikasi) {
              return a + b?.nominal;
            } else {
              return a + 0;
            }
          }, 0) < 1
          : true
        // false
      );
    }
  }, [terdaftar]);

  useEffect(() => {
    if (sekolah?.id == 7789) {
      setSteps([
        {
          title: `Pilih Jalur ${sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
            }`,
          url: "gelombang-ppdb",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif ? true : false,
        },
        {
          title: `${sekolah?.id == 14 || sekolah?.id == 13 || sekolah?.id == 121
            ? "Bayar Dana Masuk"
            : "Bayar Pendaftaran"
            }`,
          url: "bayar-pendaftaran",
          icon: <FaMoneyCheckAlt className="h3 mb-3" />,
          active:
            // JSON.parse(terdaftar?.gelombangAktif?.pembayaran || "[]")?.reduce(
            //   (a, b) => {
            //     if (b?.diverifikasi) {
            //       return a + b?.nominal;
            //     } else {
            //       return a + 0;
            //     }
            //   },
            //   0
            // ) >= terdaftar?.gelombangAktif?.gelombang?.jalur?.biaya,
            true,
          disabled: !terdaftar?.gelombangAktif?.gelombang?.jalur ? true : false,
        },
        {
          title: "Isi Biodata",
          url: "biodata",
          icon: <FaUser className="h3 mb-3" />,
          active: checkBio,
          disabled: checkPembayaran,
        },
        {
          title: "Isi Nilai Rapor",
          url: "nilai-rapor",
          icon: <FaClipboard className="h3 mb-3" />,
          active: checkNilai,
          disabled: checkPembayaran,
        },
        {
          title: "Isi Data Prestasi",
          url: "prestasi",
          icon: <FaAward className="h3 mb-3" />,
          active: checkPrestasi,
          disabled: checkPembayaran,
        },
        {
          title: "Cetak Kartu Peserta",
          url: "kartu-peserta",
          icon: <FaAddressCard className="h2 mb-3" />,
          disabled: checkPembayaran,
        },
      ]);
    } else if (
      sekolah?.id == 70
    ) {
      setSteps([
        {
          title: `Pilih Jalur ${sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
            }`,
          url: "gelombang-ppdb",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif ? true : false,
        },
        ...(terdaftar?.gelombangAktif?.gelombang?.nama.toLowerCase().includes("smp")
          ? []
          : [
            {
              title: `Bayar Pendaftaran`,
              url: "bayar-pendaftaran",
              icon: <FaMoneyCheckAlt className="h3 mb-3" />,
              active: true,
              disabled: !terdaftar?.gelombangAktif?.gelombang?.jalur,
            },
          ]),
        {
          title: "Isi Biodata",
          url: "biodata",
          icon: <FaUser className="h3 mb-3" />,
          active: checkBio,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Isi Nilai Rapor",
          url: "nilai-rapor",
          icon: <FaClipboard className="h3 mb-3" />,
          active: checkNilai,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Isi Data Prestasi",
          url: "prestasi",
          icon: <FaAward className="h3 mb-3" />,
          active: checkPrestasi,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        ...(terdaftar?.gelombangAktif?.gelombang?.nama.toLowerCase().includes("SMK")
          ? [{
            title: "Pilih Jurusan",
            url: "pilih-jurusan",
            icon: <FaPencilRuler className="h3 mb-3" />,
            active: terdaftar?.gelombangAktif?.dataJurusan,
            disabled:
              sekolah?.id == 9426 ||
                (sekolah?.id == 70 &&
                  terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
                ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                  ? true
                  : false
                : checkPembayaran,
          }] : []
        ),
        {
          title: "Cetak Kartu Peserta",
          url: "kartu-peserta",
          icon: <FaAddressCard className="h2 mb-3" />,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
      ]);
    } else if (sekolah?.id == 9487 || sekolah?.id == 9489) {
      setSteps([
        {
          title: `Pilih Jalur ${sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
            }`,
          url: "gelombang-ppdb",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif ? true : false,
        },
        {
          title: "Isi Biodata",
          url: "biodata",
          icon: <FaUser className="h3 mb-3" />,
          active: checkBio,
          disabled:
            sekolah?.id == 9487 || sekolah?.id == 9489
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Isi Nilai Rapor",
          url: "nilai-rapor",
          icon: <FaClipboard className="h3 mb-3" />,
          active: checkNilai,
          disabled:
            sekolah?.id == 9487 ||
              sekolah?.id == 9489 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Cetak Kartu Peserta",
          url: "kartu-peserta",
          icon: <FaAddressCard className="h2 mb-3" />,
          disabled: rata2
            ? rata2 < parseFloat(terdaftar?.gelombangAktif?.gelombang?.norek)
            : true,
        },
      ]);
      console.log(
        rata2 < parseFloat(terdaftar?.gelombangAktif?.gelombang?.norek)
      );
    } else if (sekolah?.id == 9426) {
      setSteps([
        {
          title: `Pilih Jalur ${sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
            }`,
          url: "gelombang-ppdb",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif ? true : false,
        },
        {
          title: "Isi Biodata",
          url: "biodata",
          icon: <FaUser className="h3 mb-3" />,
          active: checkBio,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Isi Nilai Rapor",
          url: "nilai-rapor",
          icon: <FaClipboard className="h3 mb-3" />,
          active: checkNilai,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Isi Data Prestasi",
          url: "prestasi",
          icon: <FaAward className="h3 mb-3" />,
          active: checkPrestasi,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Cetak Kartu Peserta",
          url: "kartu-peserta",
          icon: <FaAddressCard className="h2 mb-3" />,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
      ]);
    } else if (sekolah?.id == 121) {
      setSteps([
        {
          title: `Pilih Jalur ${sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
            }`,
          url: "gelombang-ppdb",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif ? true : false,
        },
        {
          title: "Isi Biodata",
          url: "biodata",
          icon: <FaUser className="h3 mb-3" />,
          active: checkBio,
          disabled: checkPembayaranFormulir,
        },
        {
          title: "Isi Nilai Rapor",
          url: "nilai-rapor",
          icon: <FaClipboard className="h3 mb-3" />,
          active: checkNilai,
          disabled: !formData?.nisn
            ? true
            : !formData?.whatsapp
              ? true
              : !formData?.nama
                ? true
                : !formData?.asalSekolah
                  ? true
                  : !formData?.filePpdb
                    ? true
                    : checkPembayaranFormulir,
        },
        {
          title: "Isi Data Prestasi",
          url: "prestasi",
          icon: <FaAward className="h3 mb-3" />,
          active: checkPrestasi,
          disabled: !formData?.nisn
            ? true
            : !formData?.whatsapp
              ? true
              : !formData?.nama
                ? true
                : !formData?.asalSekolah
                  ? true
                  : !formData?.filePpdb
                    ? true
                    : checkPembayaranFormulir,
        },
        {
          title: "Pilih Jurusan",
          url: "pilih-jurusan",
          icon: <FaPencilRuler className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif?.dataJurusan,
          disabled: !formData?.nisn
            ? true
            : !formData?.whatsapp
              ? true
              : !formData?.nama
                ? true
                : !formData?.asalSekolah
                  ? true
                  : !formData?.filePpdb
                    ? true
                    : checkPembayaranFormulir,
        },
        {
          title: `${sekolah?.id == 14 || sekolah?.id == 13 || sekolah?.id == 121
            ? "Bayar Dana Masuk"
            : "Bayar Pendaftaran"
            }`,
          url: "bayar-pendaftaran",
          icon: <FaMoneyCheckAlt className="h3 mb-3" />,
          active:
            // JSON.parse(terdaftar?.gelombangAktif?.pembayaran || "[]")?.reduce(
            //   (a, b) => {
            //     if (b?.diverifikasi) {
            //       return a + b?.nominal;
            //     } else {
            //       return a + 0;
            //     }
            //   },
            //   0
            // ) >= terdaftar?.gelombangAktif?.gelombang?.jalur?.biaya,
            true,
          disabled: !terdaftar?.gelombangAktif?.gelombang?.jalur ? true : false,
        },
        {
          title: "Cetak Kartu Peserta",
          url: "kartu-peserta",
          icon: <FaAddressCard className="h2 mb-3" />,
          disabled: checkPembayaran,
        },
      ]);
    } else {
      setSteps([
        {
          title: `Pilih Jalur ${sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
            }`,
          url: "gelombang-ppdb",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif ? true : false,
        },
        {
          title: `${sekolah?.id == 14 || sekolah?.id == 13 || sekolah?.id == 121
            ? "Bayar Dana Masuk"
            : "Bayar Pendaftaran"
            }`,
          url: "bayar-pendaftaran",
          icon: <FaMoneyCheckAlt className="h3 mb-3" />,
          active:
            // JSON.parse(terdaftar?.gelombangAktif?.pembayaran || "[]")?.reduce(
            //   (a, b) => {
            //     if (b?.diverifikasi) {
            //       return a + b?.nominal;
            //     } else {
            //       return a + 0;
            //     }
            //   },
            //   0
            // ) >= terdaftar?.gelombangAktif?.gelombang?.jalur?.biaya,
            true,
          disabled: !terdaftar?.gelombangAktif?.gelombang?.jalur ? true : false,
        },
        {
          title: "Isi Biodata",
          url: "biodata",
          icon: <FaUser className="h3 mb-3" />,
          active: checkBio,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Isi Nilai Rapor",
          url: "nilai-rapor",
          icon: <FaClipboard className="h3 mb-3" />,
          active: checkNilai,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Isi Data Prestasi",
          url: "prestasi",
          icon: <FaAward className="h3 mb-3" />,
          active: checkPrestasi,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Pilih Jurusan",
          url: "pilih-jurusan",
          icon: <FaPencilRuler className="h3 mb-3" />,
          active: terdaftar?.gelombangAktif?.dataJurusan,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
        {
          title: "Cetak Kartu Peserta",
          url: "kartu-peserta",
          icon: <FaAddressCard className="h2 mb-3" />,
          disabled:
            sekolah?.id == 9426 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
              ? !terdaftar?.gelombangAktif?.gelombang?.jalur
                ? true
                : false
              : checkPembayaran,
        },
      ]);
    }
  }, [
    terdaftar,
    user,
    checkBio,
    checkNilai,
    checkPrestasi,
    checkPembayaran,
    checkPembayaranFormulir,
    rata1,
  ]);

  const router = useRouter();
  if (!pembelian && sekolah?.id == 121) {
    useEffect(() => {
      const path = router.pathname;
      if (
        !terdaftar?.gelombangAktif?.gelombang?.jalur &&
        path.indexOf("gelombang-ppdb") == -1
      ) {
        router.push({ pathname: "/ppdb/gelombang-ppdb" });
        return;
      }
      ["biodata", "pilih-jurusan", "prestasi", "nilai-rapor"].forEach((d) => {
        if (path.indexOf(d) > -1) {
          if (checkPembayaranFormulir && path.indexOf("bayar-formulir") == -1) {
            router.push({ pathname: "/ppdb/bayar-formulir" });
          } else if (
            checkPembayaran &&
            path.indexOf("bayar-pendaftaran") == -1
          ) {
            if (sekolah?.id == 121) {
              ("");
            } else {
              router.push({ pathname: "/ppdb/bayar-pendaftaran" });
            }
          }
        }
      });
    }, [router, checkPembayaranFormulir, checkPembayaran, terdaftar]);
  } else if (!pembelian) {
    useEffect(() => {
      const path = router.pathname;
      if (
        !terdaftar?.gelombangAktif?.gelombang?.jalur &&
        path.indexOf("gelombang-ppdb") == -1
      ) {
        router.push({ pathname: "/ppdb/gelombang-ppdb" });
        return;
      }
      [
        "biodata",
        "kartu-peserta",
        "pilih-jurusan",
        "prestasi",
        "nilai-rapor",
      ].forEach((d) => {
        if (path.indexOf(d) > -1) {
          if (checkPembayaran && path.indexOf("bayar-pendaftaran") == -1) {
            if (
              sekolah?.id == 9426 ||
              sekolah?.id == 9487 ||
              sekolah?.id == 9489 ||
              (sekolah?.id == 70 &&
                terdaftar?.gelombangAktif?.gelombang?.nama.includes("SMP"))
            ) {
              ("");
            } else {
              router.push({ pathname: "/ppdb/bayar-pendaftaran" });
            }
          }
        }
      });
    }, [router, checkPembayaran, terdaftar]);
  } else {
    useEffect(() => {
      const path = router.pathname;
      if (
        !terdaftar?.gelombangAktif?.gelombang?.jalur &&
        path.indexOf("pembelian") == -1
      ) {
        router.push({ pathname: "/ppdb/pembelian" });
        return;
      }
      [
        "biodata",
        "kartu-peserta",
        "pilih-jurusan",
        "prestasi",
        "nilai-rapor",
      ].forEach((d) => {
        if (path.indexOf(d) > -1) {
          if (checkPembayaran && path.indexOf("bayar-pendaftaran") == -1) {
            router.push({ pathname: "/ppdb/bayar-pendaftaran" });
          }
        }
      });
    }, [router, checkPembayaran, terdaftar]);
  }
  const [menuStep, setMenuStep] = useState();

  useEffect(() => {
    setMenuStep(
      steps.map((d, idx) => (
        <Link
          href={`${ppdbURL}/${d.url}`}
          key={`${idx}-${new Date().getTime()}`}
        >
          <div
            className={`step-ppdb position-relative ${location.href.indexOf(d.url) > -1 ? "menu-active" : ""
              }${d?.disabled ? "disabled" : ""}
      `}
          >
            {d.active ? (
              <div
                className="step-check position-absolute rounded-circle bg-white align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  right: "0",
                  top: "-10%",
                }}
              >
                <div
                  className="rounded-circle bg-success shadow-success-ss d-flex align-items-center justify-content-center text-white"
                  style={{ width: "35px", height: "35px" }}
                >
                  <FaCheck />
                </div>
              </div>
            ) : null}
            {d?.disabled ? (
              <div
                className="step-check position-absolute rounded-circle bg-white align-items-center justify-content-center"
                style={{
                  width: "45px",
                  height: "45px",
                  right: "0",
                  top: "-10%",
                }}
              >
                <div
                  className="rounded-circle bg-gray shadow-dark-ss d-flex align-items-center justify-content-center text-white"
                  style={{ width: "35px", height: "35px" }}
                >
                  <FaLock />
                </div>
              </div>
            ) : null}

            {/* <div
              className="step-content d-flex align-items-center justify-content-start flex-column text-center rounded-ss p-3 pointer me-3"
              style={{
                // width: "125px",
                height: "125px",
              }}
            > */}
            <div
              className="step-content d-flex align-items-center justify-content-center flex-column text-center rounded-ss p-3 pointer me-3"
              style={{
                // width: "125px",
                height: "125px",
              }}
            >
              {d.icon}
              <h6 className="m-0 fw-bold">{d.title}</h6>
            </div>
          </div>
        </Link>
      ))
    );
  }, [steps]);

  return (
    <div>
      <div className="card card-ss mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-stretch flex-wrap">
            {menuStep}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPPDB;
