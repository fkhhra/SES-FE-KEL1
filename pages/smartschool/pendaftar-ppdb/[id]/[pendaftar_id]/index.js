import { detailGelombangPPDB } from "client/GelombangPPDB";
import {
  detailPendaftarPPDB,
  editPendaftarPPDB,
  putDiskon,
} from "client/PendaftarPPDBClient";
import HeaderPendaftar from "components/PPDB/HeaderPendaftar";
import IdentitasPendaftar from "components/PPDB/IdentitasPendaftar";
import IdentitasOrtuPendaftar from "components/PPDB/IdentitasOrtuPendaftar";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { momentPackage } from "utilities/HelperUtils";
import { ssURL } from "../../../../../client/clientAxios";
import Layout from "../../../../../components/Layout/Layout";
import CardPembayaranPPDB from "../../../../../components/PPDB/CardPembayaranPPDB";
import CardPenerimaanUjianUser from "../../../../../components/PPDB/CardPenerimaanUjianUser";
import SectionKemampuanBahasa from "../../../../../components/PPDB/SectionKemampuanBahasa";
import SectionPengalaman from "../../../../../components/PPDB/SectionPengalaman";
import SectionPrestasiDanSertifikasi from "../../../../../components/PPDB/SectionPrestasiDanSertifikasi";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import NavSkeleton from "../../../../../components/Shared/Skeleton/NavSkeleton";
import useUser from "../../../../../hooks/useUser";
import RaporPendaftar from "components/PPDB/RaporPendaftar";
import LayoutDetail from "components/Layout/LayoutDetail";
import ScrollMenuDetailPeserta from "components/PPDB/ScrollMenuDetailPeserta";
import swal from "sweetalert";
import PengaturanAkunPPDB from "components/PPDB/PengaturanAkunPPDB";
import IdentitasPembelian from "components/PPDB/IdentitasPembelian";
import useSekolah from "hooks/useSekolah";
import ReactiveButton from "reactive-button";

const index = ({ id, pendaftar_id, nav }) => {
  const { user } = useUser();
  const { sekolah } = useSekolah();

  const [pendaftar, setPendaftar] = useState({});
  const [listPendaftar, setListPendaftar] = useState([]);
  const [gelombang, setGelombang] = useState({});
  const [diskon, setDiskon] = useState(0);

  console.log(diskon);
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState(null);

  const _detailGelombangPPDB = async () => {
    const { data } = await detailGelombangPPDB(id);
    if (data) {
      setGelombang(data?.gelombang);
      setListPendaftar(data?.gelombang?.pendaftar);
    }
  };

  const _detailPendaftarPPDB = async () => {
    const { data, error } = await detailPendaftarPPDB(pendaftar_id);

    if (data) {
      setPendaftar(data?.pendaftar);
      if (data?.pendaftar?.diskon?.diskon) {
        setDiskon(data?.pendaftar?.diskon?.diskon);
      }
    } else {
      toast.error(error);
    }
  };

  const _handleUpdatePendaftar = async (payload) => {
    swal({
      title: "Yakin ingin dilanjutkan?",
      text: "Perhatikan kembali data anda",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await editPendaftarPPDB(pendaftar?.id, payload);
        if (data) {
          toast.success(data?.message);
          _detailPendaftarPPDB();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };
  const _handleUpdateDiskon = async () => {
    const { data, error } = await putDiskon(pendaftar?.id, { diskon });
    if (data) {
      toast.success(data?.message);
      _detailPendaftarPPDB();
    } else {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    _detailPendaftarPPDB();
  }, [pendaftar_id]);

  useEffect(() => {
    _detailGelombangPPDB();
  }, []);
  let navMenus = [];
  if (pendaftar?.gelombang?.jalur?.tipe == "Pembelian") {
    navMenus = [
      {
        href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=pembayaran`,
        as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=pembayaran`,
        text: "Pembayaran",
        active: nav == "pembayaran" || !nav,
        isVisible: true,
        dataJoyride: "pembayaran",
      },
      {
        href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=biodata`,
        as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=biodata`,
        text: "Biodata",
        active: nav == "biodata",
        isVisible: user?.role !== "siswa",
        dataJoyride: "biodata",
      },

      {
        href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=pengaturan`,
        as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=pengaturan`,
        text: "Pengaturan",
        active: nav == "pengaturan",
        isVisible: user?.role !== "siswa",
        dataJoyride: "pengaturan",
      },
    ];
  } else {
    if (sekolah?.id == 9487 || sekolah?.id == 9489) {
      navMenus = [
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=biodata`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=biodata`,
          text: "Biodata",
          active: nav == "biodata",
          isVisible: user?.role !== "siswa",
          dataJoyride: "biodata",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=nilai-rapor`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=nilai-rapor`,
          text: "Nilai Rapor",
          active: nav == "nilai-rapor",
          isVisible: user?.role !== "siswa",
          dataJoyride: "nilai-rapor",
        },

        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=pengaturan`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=pengaturan`,
          text: "Pengaturan",
          active: nav == "pengaturan",
          isVisible: user?.role !== "siswa",
          dataJoyride: "pengaturan",
        },
      ];
    } else if (sekolah?.id == 14 || sekolah?.id == 13 || sekolah?.id == 121) {
      navMenus = [
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=pembayaran`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=pembayaran`,
          text: "Pembayaran",
          active: nav == "pembayaran" || !nav,
          isVisible: true,
          dataJoyride: "pembayaran",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=biodata`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=biodata`,
          text: "Biodata",
          active: nav == "biodata",
          isVisible: user?.role !== "siswa",
          dataJoyride: "biodata",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=nilai-rapor`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=nilai-rapor`,
          text: "Nilai Rapor",
          active: nav == "nilai-rapor",
          isVisible: user?.role !== "siswa",
          dataJoyride: "nilai-rapor",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=prestasi`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=prestasi`,
          text: "Prestasi",
          active: nav == "prestasi",
          isVisible: user?.role !== "siswa",
          dataJoyride: "prestasi",
        },
        // {
        //   href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=ujian-penerimaan`,
        //   as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=ujian-penerimaan`,
        //   text: "Ujian Penerimaan",
        //   active: nav == "ujian-penerimaan",
        //   isVisible: user?.role !== "siswa",
        //   dataJoyride: "ujian-penerimaan",
        // },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=pengaturan`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=pengaturan`,
          text: "Pengaturan",
          active: nav == "pengaturan",
          isVisible: user?.role !== "siswa",
          dataJoyride: "pengaturan",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=diskon`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=diskon`,
          text: "Diskon",
          active: nav == "diskon",
          isVisible: user?.role !== "siswa",
          dataJoyride: "diskon",
        },
      ];
    } else {
      navMenus = [
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=pembayaran`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=pembayaran`,
          text: "Pembayaran",
          active: nav == "pembayaran" || !nav,
          isVisible: true,
          dataJoyride: "pembayaran",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=biodata`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=biodata`,
          text: "Biodata",
          active: nav == "biodata",
          isVisible: user?.role !== "siswa",
          dataJoyride: "biodata",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=nilai-rapor`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=nilai-rapor`,
          text: "Nilai Rapor",
          active: nav == "nilai-rapor",
          isVisible: user?.role !== "siswa",
          dataJoyride: "nilai-rapor",
        },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=prestasi`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=prestasi`,
          text: "Prestasi",
          active: nav == "prestasi",
          isVisible: user?.role !== "siswa",
          dataJoyride: "prestasi",
        },
        // {
        //   href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=ujian-penerimaan`,
        //   as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=ujian-penerimaan`,
        //   text: "Ujian Penerimaan",
        //   active: nav == "ujian-penerimaan",
        //   isVisible: user?.role !== "siswa",
        //   dataJoyride: "ujian-penerimaan",
        // },
        {
          href: `${ssURL}/pendaftar-ppdb/[id]/[pendaftar_id]?nav=pengaturan`,
          as: `${ssURL}/pendaftar-ppdb/${id}/${pendaftar_id}?nav=pengaturan`,
          text: "Pengaturan",
          active: nav == "pengaturan",
          isVisible: user?.role !== "siswa",
          dataJoyride: "pengaturan",
        },
      ];
    }
  }
  return (
    <LayoutDetail
      title={"Detail Informasi Pendaftar"}
      backProps={`${ssURL}/pendaftar-ppdb/${id}`}
    >
      <AnimatePage>
        <div className="mb-4">
          <ScrollMenuDetailPeserta listPendaftar={listPendaftar} />
        </div>
        {/* <MyJoyride steps={steps} /> */}
        <HeaderPendaftar
          pendaftar={pendaftar}
          navMenus={navMenus}
          loading={loading}
          _handleUpdatePendaftar={_handleUpdatePendaftar}
        />

        {(!nav || nav == "pembayaran") && (
          <>
            <CardPembayaranPPDB
              pendaftar={pendaftar}
              _detailPendaftarPPDB={_detailPendaftarPPDB}
            />
          </>
        )}
        {(((sekolah?.id == 9487 || sekolah?.id == 9489) && !nav) ||
          nav == "biodata") && (
          <>
            {pendaftar?.gelombang?.jalur?.tipe == "Pembelian" ? (
              <IdentitasPembelian initialState={pendaftar?.user} />
            ) : (
              <>
                <IdentitasPendaftar initialState={pendaftar?.user} />
                <IdentitasOrtuPendaftar initialState={pendaftar?.user} />
              </>
            )}
          </>
        )}
        {nav == "nilai-rapor" && (
          <>
            <RaporPendaftar initialState={pendaftar?.user} />
            {(sekolah?.id == 9487 || sekolah?.id == 9489) && (
              <div className="card-ss card mb-4 text-center">
                <div className="card-body">
                  <h6 className="fw-bold color-dark mb-3">
                    Pastikan data yang dicantumkan di atas adalah benar dan
                    dapat dipertanggungjawabkan.
                  </h6>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-ss btn-outline-danger rounded-pill fs-14-ss fw-bold me-4"
                      onClick={() =>
                        _handleUpdatePendaftar({
                          status: "menungguSeleksiBerkas",
                        })
                      }
                    >
                      Tolak Verifikasi Berkas
                    </button>
                    <button
                      className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-14-ss fw-bold"
                      onClick={() =>
                        _handleUpdatePendaftar({
                          status: "berkasTerkonfirmasi",
                        })
                      }
                    >
                      Konfirmasi Berkas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {nav == "prestasi" && (
          <>
            <div className="mb-4">
              <SectionPengalaman isReadOnly data={pendaftar} />
            </div>
            <div className="mb-4">
              <SectionPrestasiDanSertifikasi isReadOnly data={pendaftar} />
            </div>
            <div className="mb-4">
              <SectionKemampuanBahasa isReadOnly data={pendaftar} />
            </div>
            <div className="card-ss card mb-4 text-center">
              <div className="card-body">
                <h6 className="fw-bold color-dark mb-3">
                  Pastikan data yang dicantumkan di atas adalah benar dan dapat
                  dipertanggungjawabkan.
                </h6>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-ss btn-outline-danger rounded-pill fs-14-ss fw-bold me-4"
                    onClick={() =>
                      _handleUpdatePendaftar({
                        status: "menungguSeleksiBerkas",
                      })
                    }
                  >
                    Tolak Verifikasi Berkas
                  </button>
                  <button
                    className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-14-ss fw-bold"
                    onClick={() =>
                      _handleUpdatePendaftar({
                        status: "berkasTerkonfirmasi",
                      })
                    }
                  >
                    Konfirmasi Berkas
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {nav == "pengaturan" && (
          <>
            <PengaturanAkunPPDB pendaftar={pendaftar} />
          </>
        )}
        {/* {nav == "ujian-penerimaan" && (
          <>
            <CardPenerimaanUjianUser />
          </>
        )} */}
        {nav == "diskon" && (
          <>
            <div className="card card-ss mb-4">
              <div className="card-body p-4">
                <h4 className="fw-extrabold color-dark title-border mb-5">
                  Diskon
                </h4>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Nominal Diskon</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      type="number"
                      placeholder="Masukkan nominal diskon"
                      name="diskon"
                      value={diskon}
                      onChange={(e) => {
                        if (e?.target?.value > 100) {
                          setDiskon(100);
                        } else if (e?.target?.value < 0) {
                          setDiskon(0);
                        } else {
                          setDiskon(e?.target?.value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="card-footer-ss pb-5">
                <div className="d-flex justify-content-end align-items-center px-4 pb-3">
                  <div data-joyride="btn-simpan">
                    <ReactiveButton
                      // buttonState={buttonState}
                      onClick={_handleUpdateDiskon}
                      color={"primary"}
                      idleText={"Simpan"}
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
          </>
        )}
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({
  params: { id, pendaftar_id },
  query: { nav },
}) {
  return {
    props: {
      id,
      nav: nav || null,
      pendaftar_id: pendaftar_id || null,
    },
  };
}

export default index;
