import { getProfilUser } from "client/AuthClient";
import { getGelombangPPDB } from "client/GelombangPPDB";
import { getMajors } from "client/MajorsClient";
import { meSekolah } from "client/SekolahClient";
import useSekolah from "hooks/useSekolah";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import moment from "moment";
import { useEffect, useState } from "react";
import { getFormatDate, momentPackage, padNumber } from "utilities/HelperUtils";

const index = ({}) => {
  const { ta } = useTa();
  const { sekolah, setSekolah } = useSekolah();
  const { user, setUser } = useUser();
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const [loading, setLoading] = useState(true);

  const {
    gelombang,
    gelombangAktif,
    gelombangPembelian,
    semuaGelombangPengembalian,
  } = gelombangPPDB;
  const namaGelombang = gelombangAktif?.gelombang?.nama?.toLowerCase();

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
              src={
                sekolah?.id == 9487 || sekolah?.id == 9489
                  ? `${sekolah?.logo}`
                  : `${sekolah?.logoSs}` || `/img/ss-logo-icon.png`
              }
              alt=""
              height={
                sekolah?.id == 9487 || sekolah?.id == 9489
                  ? "75px"
                  : sekolah?.id !== 14
                  ? "50px"
                  : "100px"
              }
              width={
                sekolah?.id == 9487 || sekolah?.id == 9489
                  ? "75px"
                  : sekolah?.id !== 14
                  ? "50px"
                  : "100px"
              }
              className="img-fit-contain"
            />
            <div className="text-center fw-bold color-dark text-uppercase">
              <h5>BUKTI MENGIKUTI TES </h5>
              <h5>CALON PESERTA DIDIK BARU </h5>
              <h5>{sekolah?.nama}</h5>
              {sekolah?.id == 70 ||
              sekolah?.id == 9487 ||
              sekolah?.id == 9489 ? (
                <h5 className="mb-0">
                  TAHUN {momentPackage().add(6, "months").format("YYYY")} -{" "}
                  {momentPackage().add(18, "months").format("YYYY")}
                </h5>
              ) : (
                <h5 className="mb-0">
                  TAHUN {momentPackage().add(0, "months").format("YYYY")} -{" "}
                  {momentPackage().add(6, "months").format("YYYY")}
                </h5>
              )}
            </div>
            {sekolah?.id === 121 && (
              <img
                src="/img/smk-bisa-hebat.png"
                alt="Logo SMK Bisa Hebat"
                height="75px"
                className="d-md-block d-none"
              />
            )}
            {sekolah?.id !== 14 && sekolah?.id !== 121 && (
              <img
                src={`${
                  sekolah?.id == 7789
                    ? "/img/ppdbannahl/logo-kementerian-agama.png"
                    : sekolah?.logoSs || `/img/ss-logo-icon.png`
                } `}
                alt=""
                height="75px"
                className="d-md-block d-none"
              />
            )}
          </div>
          <div className="p-2 bg-primary text-white">
            <h6 className="fw-bold text-uppercase fs-14-ss mb-0"></h6>
          </div>
          <div className="p-3">
            <div className="row">
              <div className="col-lg-12">
                <table className="w-100">
                  <tr className="color-dark">
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">NAMA</div>
                    </td>
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">
                        : <span className="fw-bold">{user?.nama}</span>
                      </div>
                    </td>
                  </tr>
                  {/* <tr className="color-dark">
                            <td className="text-uppercase">
                              {" "}
                              <div className="mb-4">NISN</div>
                            </td>
                            <td className="text-uppercase">
                              {" "}
                              <div className="mb-4">
                                :{" "}
                                <span className="fw-bold">
                                  {user?.profil?.nisn || "-"}
                                </span>
                              </div>
                            </td>
                          </tr> */}
                  <tr className="color-dark">
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">NOMOR PENDAFTARAN</div>{" "}
                    </td>
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">
                        :{" "}
                        <span className="fw-bold">
                          {sekolah?.id == 14 ||
                          sekolah?.id == 13 ||
                          sekolah?.id == 121 ? (
                            <>
                              {momentPackage().format("YYYY")} -{" "}
                              {padNumber(
                                semuaGelombangPengembalian?.findIndex(
                                  (d) => d == gelombangAktif?.gelombang?.id
                                ) + 1,
                                `2`
                              )}{" "}
                              {"-"}{" "}
                              {padNumber(
                                gelombangPembelian?.gelombang?.pendaftar.findIndex(
                                  (d) => d.id == gelombangPembelian?.id
                                ) + 1,
                                `${gelombangPembelian?.gelombang?.diterima}`
                                  .length
                              )}
                            </>
                          ) : sekolah?.id == 9487 || sekolah?.id == 9489 ? (
                            <>
                              REG
                              {gelombangAktif?.gelombang?.nama?.indexOf(
                                "SD"
                              ) !== -1
                                ? "SD"
                                : "MI"}
                              {padNumber(
                                gelombangAktif?.gelombang?.pendaftar.findIndex(
                                  (d) => d.id == gelombangAktif?.id
                                ) + 1,
                                `${gelombangAktif?.gelombang?.diterima}`.length
                              )}
                            </>
                          ) : (
                            <>
                              {momentPackage().format("YYYY")} -{" "}
                              {sekolah?.id == 13 ||
                              sekolah?.id == 14 ||
                              sekolah?.id == 121 ? (
                                <>
                                  {padNumber(
                                    gelombang?.findIndex(
                                      (d) =>
                                        d.id == gelombangAktif?.gelombang?.id
                                    ) + 1,
                                    `${
                                      sekolah?.id == 14 ? 2 : gelombang?.length
                                    }`
                                  )}
                                </>
                              ) : (
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
                                gelombangAktif?.gelombang?.pendaftar.findIndex(
                                  (d) => d.id == gelombangAktif?.id
                                ) + 1,
                                `${gelombangAktif?.gelombang?.diterima}`.length
                              )}
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="color-dark">
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">Jalur</div>{" "}
                    </td>
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">
                        :{" "}
                        <span className="fw-bold">
                          {gelombangAktif?.gelombang?.nama}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="color-dark">
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">ASAL SEKOLAH</div>
                    </td>
                    <td className="text-uppercase">
                      {" "}
                      <div className="mb-4">
                        :{" "}
                        <span className="fw-bold">
                          {user?.profil?.asalSekolah || "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-start px-4 mb-4">
                <div className="color-dark">
                  <h6 className="fs-16-ss mb-2">Parah penguji</h6>

                  <h6 className="fs-16-ss" style={{ marginBottom: "85px" }}>
                    Baca Qur'an
                  </h6>
                  <div
                    className="w-100 mb-1"
                    style={{
                      height: "1px",
                      borderTop: "1.35px dashed #000000",
                    }}
                  ></div>
                </div>

                <div className="color-dark">
                  <h6 className="fs-16-ss mb-2">Parah penguji</h6>
                  <h6 className="fs-16-ss" style={{ marginBottom: "85px" }}>
                    Wawancara
                  </h6>
                  <h6 className="fs-16-ss mb-0"></h6>
                  <div
                    className="w-100 mb-1"
                    style={{
                      height: "1px",
                      borderTop: "1.35px dashed #000000",
                    }}
                  ></div>
                </div>

                <div className="color-dark">
                  <h6 className="fs-16-ss mb-2">Paraf Pengawas</h6>
                  <h6 className="fs-16-ss" style={{ marginBottom: "85px" }}>
                    Tes Akademik
                  </h6>
                  <h6 className="fs-16-ss mb-0"></h6>
                  <div
                    className="w-100 mb-1"
                    style={{
                      height: "1px",
                      borderTop: "1.35px dashed #000000",
                    }}
                  ></div>
                </div>
              </div>
              <div className="d-flex justify-content-end align-items-start px-4 mb-4">
                <div className="">
                  <h6 className="fs-16-ss mb-2">
                    Padang, {moment().format("DD")} Mei 2024
                  </h6>
                  <h6 className="fs-16-ss" style={{ marginBottom: "85px" }}>
                    Ketua Panitia PPDB
                  </h6>
                  {ta?.namaKepsek ? (
                    <h6 className="fs-16-ss mb-0">{ta?.namaKepsek}</h6>
                  ) : (
                    <div
                      className="w-100 mb-1"
                      style={{
                        height: "1px",
                        borderTop: "1.35px dashed #000000",
                      }}
                    ></div>
                  )}
                  <h6 className="fs-16-ss text-uppercase mb-0">
                    {sekolah?.id == 33 ? "NUKS." : "NIP."}{" "}
                    {!ta?.nipKepsek ? `-` : `${ta?.nipKepsek}`}
                  </h6>
                </div>
              </div>
              <div className="d-flex justify-content-start align-items-start px-4 mb-4">
                <div className="">
                  <h6 className="fs-16-ss mb-2">Catatan :</h6>
                  <h6 className="fs-16-ss">
                    <span className="fw-bold">Mintalah</span> paraf tim Penguji
                    Tes Baca Al Qur'an dan Wawancara serta Pengawas Tes Akademik
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default index;
