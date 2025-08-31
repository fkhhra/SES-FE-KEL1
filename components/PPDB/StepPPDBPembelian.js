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

const StepPPDBPembelian = ({ pembelian }) => {
  const { user } = useUser();
  const { terdaftar } = usePPDB();
  const { sekolah } = useSekolah();

  const [steps, setSteps] = useState([]);

  const [checkPembayaran, setCheckPembayaran] = useState(false);
  const [checkBio, setCheckBio] = useState(false);
  const [checkNilai, setCheckNilai] = useState(false);
  const [checkPrestasi, setCheckPrestasi] = useState(false);

  // console.log(checkPembayaran);

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
    }
  }, [user]);

  useEffect(() => {
    if (terdaftar) {
      setCheckPembayaran(
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
    if (sekolah?.id == 121) {
      setSteps([
        {
          title: `Pilih Gelombang ${
            sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
          }`,
          url: "pembelian",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangPembelian ? true : false,
        },
        {
          title: "Pembelian Formulir Pendaftaran",
          url: "bayar-formulir",
          icon: <FaMoneyCheckAlt className="h3 mb-3" />,
          active:
            // JSON.parse(terdaftar?.gelombangPembelian?.pembayaran || "[]")?.reduce(
            //   (a, b) => {
            //     if (b?.diverifikasi) {
            //       return a + b?.nominal;
            //     } else {
            //       return a + 0;
            //     }
            //   },
            //   0
            // ) >= terdaftar?.gelombangPembelian?.gelombang?.jalur?.biaya,
            true,
          disabled: !terdaftar?.gelombangPembelian?.gelombang?.jalur
            ? true
            : false,
        },

        // {
        //   title: "Pilih Jurusan",
        //   url: "pilih-jurusan-pembelian",
        //   icon: <FaPencilRuler className="h3 mb-3" />,
        //   active: terdaftar?.gelombangPembelian?.dataJurusan ? true : false,
        //   disabled: checkPembayaran,
        // },
        // {
        //   title: "Cetak Kartu Peserta",
        //   url: "kartu-peserta-pembelian",
        //   icon: <FaAddressCard className="h2 mb-3" />,
        //   disabled: checkPembayaran,
        // },
      ]);
    } else
      setSteps([
        {
          title: `Pilih Gelombang ${
            sekolah?.tingkat == "kampus" ? "Pendaftaran" : "PPDB"
          }`,
          url: "pembelian",
          icon: <FaMapSigns className="h3 mb-3" />,
          active: terdaftar?.gelombangPembelian ? true : false,
        },
        {
          title: "Pembelian Formulir Pendaftaran",
          url: "bayar-formulir",
          icon: <FaMoneyCheckAlt className="h3 mb-3" />,
          active:
            // JSON.parse(terdaftar?.gelombangPembelian?.pembayaran || "[]")?.reduce(
            //   (a, b) => {
            //     if (b?.diverifikasi) {
            //       return a + b?.nominal;
            //     } else {
            //       return a + 0;
            //     }
            //   },
            //   0
            // ) >= terdaftar?.gelombangPembelian?.gelombang?.jalur?.biaya,
            true,
          disabled: !terdaftar?.gelombangPembelian?.gelombang?.jalur
            ? true
            : false,
        },

        {
          title: "Pilih Jurusan",
          url: "pilih-jurusan-pembelian",
          icon: <FaPencilRuler className="h3 mb-3" />,
          active: terdaftar?.gelombangPembelian?.dataJurusan ? true : false,
          disabled: checkPembayaran,
        },
        {
          title: "Cetak Kartu Peserta",
          url: "kartu-peserta-pembelian",
          icon: <FaAddressCard className="h2 mb-3" />,
          disabled: checkPembayaran,
        },
      ]);
  }, [terdaftar, user, checkBio, checkNilai, checkPrestasi, checkPembayaran]);

  const router = useRouter();

  useEffect(() => {
    const path = router.pathname;
    if (
      !terdaftar?.gelombangPembelian?.gelombang?.jalur &&
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
      // if (path.indexOf(d) > -1) {
      //   if (checkPembayaran && path.indexOf("bayar-pendaftaran") == -1) {
      //     router.push({ pathname: "/ppdb/bayar-pendaftaran" });
      //   }
      // }
    });
  }, [router, checkPembayaran, terdaftar]);

  const [menuStep, setMenuStep] = useState();

  useEffect(() => {
    setMenuStep(
      steps.map((d, idx) => (
        <Link
          href={`${ppdbURL}/${d.url}`}
          key={`${idx}-${new Date().getTime()}`}
        >
          <div
            className={`step-ppdb position-relative ${
              location.href.indexOf(d.url) > -1 ? "menu-active" : ""
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

export default StepPPDBPembelian;
