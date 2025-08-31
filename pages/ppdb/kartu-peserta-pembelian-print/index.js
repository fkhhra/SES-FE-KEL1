import { getProfilUser } from "client/AuthClient";
import { getGelombangPPDB } from "client/GelombangPPDB";
import { getMajors } from "client/MajorsClient";
import { meSekolah } from "client/SekolahClient";
import useSekolah from "hooks/useSekolah";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import { useEffect, useState } from "react";
import { getFormatDate, momentPackage, padNumber } from "utilities/HelperUtils";

const index = ({}) => {
  const { ta } = useTa();
  const { sekolah, setSekolah } = useSekolah();
  const { user, setUser } = useUser();
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const [loading, setLoading] = useState(true);

  const { gelombang, gelombangPembelian } = gelombangPPDB;
  const namaGelombang = gelombangPembelian?.gelombang?.nama?.toLowerCase();

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
      setLoading(false);
    }
  };

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
    }
  };

  const [majors, setMajors] = useState([]);

  const getMajorsData = async () => {
    const { data } = await getMajors();

    if (data) {
      setMajors(data.jurusan);
    }
  };

  useEffect(() => {
    if (!loading) {
      setTimeout(function () {
        window.print();
      }, 1500);
    }
  }, [loading]);
  useEffect(() => {
    _getGelombangPPDB();
    _getProfil();
    getMeSekolahData();
    getMajorsData();
  }, []);

  return (
    <>
      <div className="print-page">
        <div className="border border-dark">
          <div className="p-4 d-flex align-items-center justify-content-between">
            <img
              src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
              alt=""
              height="100px"
              width="100px"
              className="img-fit-contain"
            />
            <div className="text-center fw-bold text-uppercase">
              <h6 className="fs-14-ss">
                KARTU PESERTA PENDAFTARAN SISWA BARU{" "}
              </h6>
              <h6 className="fs-14-ss">{sekolah?.nama}</h6>
              {user?.mSekolahId == 70 && (
                <h6>{gelombangPembelian?.gelombang?.jalur?.nama}</h6>
              )}
              <h6 className="fs-14-ss mb-0">
                TAHUN {momentPackage().add(6, "months").format("YYYY")} -{" "}
                {momentPackage().add(18, "months").format("YYYY")}
              </h6>
            </div>

            <div
              // src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
              // alt=""
              height="50px"
              width="50px"
              // className="img-fit-contain"
            />
          </div>
          <div className="p-2 bg-primary text-white">
            <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
              Data Peserta
            </h6>
          </div>
          <div className="p-3">
            <div className="row justify-content-between">
              <div className="col-3 d-flex justify-content-start justify-content-center">
                <img
                  src={user?.avatar}
                  alt=""
                  className="img-fit-cover d-sm-block d-none"
                  width="220px"
                  height="220px"
                />
                {sekolah?.id !== 14 && (
                  <img
                    src={user?.avatar}
                    alt=""
                    className="img-fit-cover w-100 d-block d-sm-none"
                    width="220px"
                    height="220px"
                  />
                )}
              </div>
              <div className="col-7">
                <table className="w-100">
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">NOMOR PESERTA</div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">
                          {momentPackage().format("YYYY")} -{" "}
                          {sekolah?.id == 13 ||
                          sekolah?.id == 14 ||
                          sekolah?.id == 121 ? (
                            <>
                              {padNumber(
                                gelombang?.findIndex(
                                  (d) =>
                                    d.id == gelombangPembelian?.gelombang?.id
                                ) + 1,
                                `${sekolah?.id == 14 ? 2 : gelombang?.length}`
                              )}
                            </>
                          ) : sekolah?.id == 70 ? (
                            <>
                              {namaGelombang?.includes("suluh") || namaGelombang?.includes("khusus")
                                ? "00"
                                : namaGelombang?.includes("prestasi")
                                ? "01"
                                : namaGelombang?.includes("reguler 1")
                                ? "02"
                                : namaGelombang?.includes("reguler 2")
                                ? "03"
                                : "04"}{" "}
                                -{" "}
                                {padNumber(
                                  gelombangAktif?.gelombang?.pendaftar.findIndex(
                                    (d) => d.id == gelombangAktif?.id
                                  ) + 1,
                                  4
                                )}
                            </>
                          ) :
                          (
                            <>
                              {namaGelombang?.includes("khusus")
                                ? "00"
                                : namaGelombang?.includes("reguler 1")
                                ? "01"
                                : namaGelombang?.includes("reguler 3")
                                ? "02"
                                : "03"}
                            </>
                          )}{" "}
                          -{" "}
                          {padNumber(
                            gelombangPembelian?.gelombang?.pendaftar.findIndex(
                              (d) => d.id == gelombangPembelian?.id
                            ) + 1,
                            `${gelombangPembelian?.gelombang?.diterima}`.length
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">NAMA</div>
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">{user?.nama}</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">WHATSAPP</div>
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">{user?.whatsapp}</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">ALAMAT</div>
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">{user?.profil?.alamat}</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="fs-12-ss">ASAL SEKOLAH</div>
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="fs-12-ss">
                        <span className="fw-bold">
                          {user?.profil?.asalSekolah || "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div className="p-2 bg-primary text-white">
            <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
              Data Seleksi
            </h6>
          </div>
          <div className={`p-3 ${user?.mSekolahId == 70 ? "py-2" : ""}`}>
            <div className="row">
              <div className="col-12">
                <table className="w-100">
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "25%" }}
                    >
                      {" "}
                      <div className="fs-12-ss">JALUR</div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="fs-12-ss fw-bold">
                        {gelombangPembelian?.gelombang?.nama}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div className="p-2 bg-primary text-white">
            <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
              Pilihan Jurusan
            </h6>
          </div>
          <div className={`p-3 ${user?.mSekolahId == 70 ? "py-0" : ""}`}>
            <div className="row">
              <div className="col-md-12">
                <table className="w-100">
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "25%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        Pilihan Jurusan 1
                      </div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">
                          {
                            majors.find(
                              (d) => d.id == gelombangPembelian?.mJurusan1Id
                            )?.nama
                          }
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "25%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        Pilihan Jurusan 2
                      </div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">
                          {
                            majors.find(
                              (d) => d.id == gelombangPembelian?.mJurusan2Id
                            )?.nama
                          }
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* 
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "25%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        Pilihan Jurusan 3
                      </div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">
                          {
                            majors.find(
                              (d) => d.id == gelombangPembelian?.mJurusan3Id
                            )?.nama
                          }
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "25%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        Pilihan Jurusan 4
                      </div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">
                          {
                            majors.find(
                              (d) => d.id == gelombangPembelian?.mJurusan4Id
                            )?.nama
                          }
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="fs-12-ss">Pilihan Jurusan 5</div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="fs-12-ss">
                        <span className="fw-bold">
                          {
                            majors.find(
                              (d) => d.id == gelombangPembelian?.mJurusan5Id
                            )?.nama
                          }
                        </span>
                      </div>
                    </td>
                  </tr> */}
                </table>
              </div>
            </div>
          </div>
          {/* <div className="px-4 py-3 bg-primary text-white">
                      <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
                        Informasi Lainnya
                      </h6>
                    </div>
                    <div className="p-3">
                      <div className="row">
                        <div className="col-md-12">
                          <p className="fs-18-ss">
                            Pengumuman Kelulusan dapat diakses melalui
                            https://smarteschool.id/kelulusan-ppdb
                          </p>
                        </div>
                      </div>
                    </div> */}
        </div>
      </div>
    </>
  );
};
export default index;
