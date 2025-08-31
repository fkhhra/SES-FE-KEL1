import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ppdbURL } from "../../../client/clientAxios";
import { getGelombangPPDB } from "../../../client/GelombangPPDB";
import {
  deletePendaftarPPDB,
  postPendaftarPPDB,
} from "../../../client/PendaftarPPDBClient";
import Layout from "../../../components/PPDB/Layout";
import StepPPDB from "../../../components/PPDB/StepPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import usePPDB from "../../../hooks/usePPDB";
import useSekolah from "../../../hooks/useSekolah";
import useTa from "../../../hooks/useTa";
import { momentPackage } from "../../../utilities/HelperUtils";
import {
  checkGelombang,
  checkIconGelombang,
  checkLabelGelombang,
  checkStatusGelombang,
  infoGelombang,
} from "../../../utilities/PPDBUtils";

const DashboardPPDBPage = () => {
  const { sekolah } = useSekolah();
  const { ta } = useTa();
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang, gelombangAktif } = gelombangPPDB;
  const router = useRouter();
  const { setTerdaftar } = usePPDB();

  // console.log('ini gelombang aktif dari gelombangPPDB', gelombangPPDB)

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
      setTerdaftar(data);
    }
  };


  const _postPendaftarPPDB = async (d) => {
    if (infoGelombang(d.keterangan)) {
      return toast.error(infoGelombang(d.keterangan));
    }

    const payload = {
      mGelombangPpdbId: d.id,
    };

    const { data, error } = await postPendaftarPPDB(payload);

    if (data) {
      // Simpan ID pendaftar (pendaftarId) ke localStorage
      localStorage.setItem('selectedGelombangId', data.pendaftarId);

      toast.success(data?.message);
      router.push(`${ppdbURL}/bayar-pendaftaran`);
    } else {
      toast.error(error?.message);
    }
  };

  const _delete = (id) => {
    // console.log(id)
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deletePendaftarPPDB(id);
        if (data) {
          toast.success(data?.message);
          const selectedGelombangId = localStorage.getItem("selectedGelombangId");
          if (selectedGelombangId && selectedGelombangId === id.toString()) {
            localStorage.removeItem("selectedGelombangId");
          }
          router.push(`${ppdbURL}/dashboard`);
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  useEffect(() => {
    _getGelombangPPDB();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDB />

          {gelombangAktif ? (
            <>
              <div className="card card-ss mb-4">
                <div className="card-body p-4 pb-5">
                  <h2 className="fw-extrabold color-dark text-capitalize">
                    Jalur yang Anda Pilih
                  </h2>
                  <p className="mb-5 color-dark">
                    Dibawah ini merupakan jalur yang sudah anda pilih.
                  </p>
                  <div
                    onClick={() => router.push(`${ppdbURL}/biodata`)}
                    className="rounded-ss border border-2 border-success-ss d-flex align-items-center p-4 pointer"
                    style={{ background: `rgba(168, 245, 180, 0.15)` }}
                  >
                    <img src="/img/icon-jalur-terdaftar.svg" alt="" />
                    <div className="ms-4">
                      <h4 className="fw-extrabold color-dark mb-2">
                        {gelombangAktif?.gelombang?.nama}
                      </h4>
                      <h6 className="fw-bold color-secondary mb-0">
                        {`${momentPackage(
                          gelombangAktif?.gelombang?.dibuka
                        ).format("DD MMMM YYYY HH:mm")} - ${momentPackage(
                          gelombangAktif?.gelombang?.ditutup
                        ).format("DD MMMM YYYY HH:mm")}`}
                      </h6>
                    </div>
                  </div>
                  {/* <div className="row justify-content-between align-items-center bg-soft-secondary rounded p-4 mt-4">
                  <div className="col-md-6">
                    <h4 className="fw-bold">
                      {gelombangAktif?.gelombang?.nama}
                    </h4>
                    <span className="d-flex align-items-center">
                      <FaCalendarDay />
                      <span className="ms-2">{`${momentPackage(
                        gelombangAktif?.gelombang?.dibuka
                      ).format("DD MMMM")} - ${momentPackage(
                        gelombangAktif?.gelombang?.ditutup
                      ).format("DD MMMM YYYY")}`}</span>
                    </span>
                  </div>
                  <div className="col-md-2">
                    <div
                      onClick={() => router.push(`${ppdbURL}/biodata`)}
                      className="pointer label-ss bg-primary text-white rounded-pill text-center mt-4 mt-lg-0"
                    >
                      Detail
                    </div>
                  </div>
                </div> */}
                </div>
              </div>
              <div className="card card-ss">
                <div className="card-body p-4 text-center">
                  <p className="fw-bold color-dark">
                    Jika anda membatalkan pendaftaran. Data yang telah
                    dimasukkan masih tetap tersimpan.
                  </p>
                  <button
                    className="btn btn-outline-danger btn-outline-danger-ss rounded-pill px-4 fw-bold"
                    onClick={() => _delete(gelombangAktif?.id)}
                  >
                    Batalkan Pendaftaran
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card card-ss">
              <div className="card-header-ss p-4">
                <h2 className="fw-extrabold color-dark text-capitalize">
                  Jalur PPDB
                </h2>
                <p className="mb-0 color-dark">
                  Pilih jalur dibawah ini untuk melakukan pendaftaran PPDB.
                </p>
              </div>
              <div className="card-body p-4">
                {gelombang
                  ?.filter(
                    (d) =>
                      d.jalur?.tipe == null || d?.jalur?.tipe == "Pengembalian"
                  )
                  ?.sort((a, b) => {
                    const x =
                      a?.keterangan == "Akan Dibuka"
                        ? 2
                        : a?.keterangan == "Daftar"
                          ? 1
                          : 3;
                    const y =
                      b?.keterangan == "Akan Dibuka"
                        ? 2
                        : b?.keterangan == "Daftar"
                          ? 1
                          : 3;
                    return x - y;
                  })
                  ?.map((d, idx) => {
                    return (
                      <div className="pb-3">
                        <div
                          className={checkGelombang(d?.keterangan)}
                          onClick={() => _postPendaftarPPDB(d)}
                        >
                          <span
                            className={checkLabelGelombang(d?.keterangan)}
                            style={{
                              width: "134px",
                              height: "34px",
                              letterSpacing: "2px",
                              top: "-20px",
                            }}
                          >
                            {checkStatusGelombang(d.keterangan)}
                          </span>
                          <div className="d-flex align-items-center">
                            <img
                              src={checkIconGelombang(d.keterangan)}
                              alt=""
                            />
                            <div className="ms-4">
                              <h4 className="mb-2 fw-extrabold color-dark">
                                {d.nama}
                              </h4>
                              <h6 className="mb-0 fw-bold">
                                {`${momentPackage(d?.dibuka).format(
                                  "DD MMMM"
                                )} - ${momentPackage(d?.ditutup).format(
                                  "DD MMMM YYYY"
                                )}`}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default DashboardPPDBPage;
