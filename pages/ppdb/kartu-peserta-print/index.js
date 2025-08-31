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
          <div className="p-4 d-flex align-items-center justify-content-center">
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
            <div className="text-center fw-bold text-uppercase mx-100">
              <h6 className="fs-14-ss">
                KARTU PESERTA PENDAFTARAN SISWA BARU{" "}
              </h6>
              <h6 className="fs-14-ss">{sekolah?.nama}</h6>
              {user?.mSekolahId == 70 && (
                <h6>{gelombangAktif?.gelombang?.jalur?.nama}</h6>
              )}
              {sekolah?.id == 70 ? (
                <h6 className="fs-14-ss mb-0">
                  TAHUN {momentPackage().add(6, "months").format("YYYY")} -{" "}
                  {momentPackage().add(18, "months").format("YYYY")}
                </h6>
              ) : (
                <h6 className="fs-14-ss mb-0">
                  TAHUN {momentPackage().add(6, "months").format("YYYY")} -{" "}
                  {momentPackage().add(18, "months").format("YYYY")}
                </h6>
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
            <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
              {sekolah?.id == 9489
                ? "Registrasi Calon Peserta Didik"
                : "Data Peserta"}
            </h6>
          </div>
          <div className="p-3">
            <div className="row justify-content-between">
              {sekolah?.id != 9489 && (
                <div className="col-3 d-flex justify-content-start justify-content-center">
                  <img
                    src={user?.avatar}
                    alt=""
                    className="img-fit-cover d-sm-block d-none"
                    width="220px"
                    height="220px"
                  />
                  <img
                    src={user?.avatar}
                    alt=""
                    className="img-fit-cover w-100 d-block d-sm-none"
                    width="220px"
                    height="220px"
                  />
                </div>
              )}
              {sekolah?.id == 9489 ? (
                <div className="col-lg-6">
                  <table className="w-100">
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
                                  `${gelombangAktif?.gelombang?.diterima}`
                                    .length
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
                                        sekolah?.id == 14
                                          ? 2
                                          : gelombang?.length
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
                                  `${gelombangAktif?.gelombang?.diterima}`
                                    .length
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
                        <div className="mb-4">NO UJIAN</div>
                      </td>
                      <td className="text-uppercase">
                        {" "}
                        <div className="mb-4">
                          : <span className="fw-bold"></span>
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
              ) : (
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
                            {sekolah?.id == 14 ? (
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
                                  `${gelombangAktif?.gelombang?.diterima}`
                                    .length
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
                                      `${gelombang?.length}`
                                    )}
                                  </>
                                )
                                : sekolah?.id == 70 ? (
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
                                      : "03"}{" "}
                                      -{" "}
                                      {padNumber(
                                        gelombangAktif?.gelombang?.pendaftar.findIndex(
                                          (d) => d.id == gelombangAktif?.id
                                        ) + 1,
                                        `${gelombangAktif?.gelombang?.diterima}`
                                          .length
                                      )}
                                  </>
                                )}
                              </>
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
                        <div className="mb-3 fs-12-ss">NISN</div>
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
                            {user?.profil?.nisn || "-"}
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
                        <div className="mb-3 fs-12-ss">
                          {" "}
                          {sekolah?.id == 14 && `TEMPAT, `}TANGGAL LAHIR
                        </div>
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
                            {sekolah?.id == 14 && (
                              <>
                                {user?.tempatLahir
                                  ? `${user?.tempatLahir}, `
                                  : `${
                                      user?.profil?.tempatLahir
                                        ? user?.profil?.tempatLahir
                                        : ""
                                    }, `}
                              </>
                            )}
                            {user?.tanggalLahir
                              ? getFormatDate(user?.tanggalLahir)
                              : "-"}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {sekolah?.id == 14 ? (
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
                            <span className="fw-bold">
                              {user?.profil?.alamat}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr className="">
                        <td
                          className="text-uppercase align-text-top"
                          style={{ width: "30%" }}
                        >
                          {" "}
                          <div className="mb-3 fs-12-ss">TEMPAT</div>
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
                            <span className="fw-bold">{user?.tempatLahir}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr className="">
                      <td
                        className="text-uppercase align-text-top"
                        style={{ width: "30%" }}
                      >
                        {" "}
                        <div className="mb-3 fs-12-ss">ASAL SEKOLAH</div>
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
                    {(sekolah?.id == 9487 || sekolah?.id == 9489) && (
                      <tr className="">
                        <td
                          className="text-uppercase align-text-top"
                          style={{ width: "30%" }}
                        >
                          {" "}
                          <div className="mb-3 fs-12-ss">JALUR</div>{" "}
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
                          <div className="fs-12-ss fw-bold">
                            {gelombangAktif?.gelombang?.nama}
                          </div>
                        </td>
                      </tr>
                    )}
                    {sekolah?.id == 70 && (
                      <>
                        <tr className="">
                          <td
                            className="text-uppercase align-text-top"
                            style={{ width: "30%" }}
                          >
                            {" "}
                            <div className="fs-12-ss">Tanggal Ujian</div>{" "}
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
                            <div className="mb-3 fs-12-ss">
                              <span className="fw-bold">
                                {user?.mSekolahId == 70
                                  ? gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ujian?.waktuDibuka
                                    ? momentPackage(
                                        gelombangAktif?.gelombang
                                          ?.informasi?.[0]?.ujian?.waktuDibuka
                                      ).format("dddd, DD MMMM YYYY HH:mm")
                                    : "-"
                                  : gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.dibuka
                                  ? momentPackage(
                                      gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.dibuka
                                    ).format("dddd, DD MMMM YYYY")
                                  : "-"}
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
                            <div className="fs-12-ss">
                              Keterangan Ujian
                            </div>{" "}
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
                            <div className="mb-3 fs-12-ss">
                              <pre
                                className="fw-bold"
                                dangerouslySetInnerHTML={{
                                  __html: gelombangAktif?.gelombang
                                    ?.informasi?.[0]?.ujian?.keterangan
                                    ? gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.ujian?.keterangan
                                    : "-",
                                }}
                              ></pre>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </table>
                </div>
              )}
            </div>
          </div>
          {sekolah?.id != 70 &&
            sekolah?.id !== 9487 &&
            sekolah?.id !== 9489 && (
              <>
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
                              {gelombangAktif?.gelombang?.nama}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

          {sekolah?.id == 9487 && (
            <>
              <div className="p-2 bg-primary text-white">
                <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
                  Data Ujian
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
                          <div className="fs-12-ss">Kelas IV (Ganjil)</div>{" "}
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
                            {user?.profil?.semester1}
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td
                          className="text-uppercase align-text-top"
                          style={{ width: "25%" }}
                        >
                          {" "}
                          <div className="fs-12-ss">Kelas V (Ganjil)</div>{" "}
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
                            {user?.profil?.semester2}
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td
                          className="text-uppercase align-text-top"
                          style={{ width: "25%" }}
                        >
                          {" "}
                          <div className="fs-12-ss">Kelas VI (Ganjil)</div>{" "}
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
                            {user?.profil?.semester3}
                          </div>
                        </td>
                      </tr>
                      <tr className="">
                        <td
                          className="text-uppercase align-text-top"
                          style={{ width: "25%" }}
                        >
                          {" "}
                          <div className="fs-12-ss">
                            Rata-Rata Kumulatif
                          </div>{" "}
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
                            {(
                              ((user?.profil?.semester1
                                ? parseFloat(user?.profil?.semester1)
                                : 0) +
                                (user?.profil?.semester2
                                  ? parseFloat(user?.profil?.semester2)
                                  : 0) +
                                (user?.profil?.semester3
                                  ? parseFloat(user?.profil?.semester3)
                                  : 0)) /
                              3
                            ).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
          {sekolah?.id == 9489 && (
            <>
              <div className="px-4 py-3 bg-primary text-white">
                <h5 className="fw-bold text-uppercase mb-0">
                  Biodata Calon Peserta Didik
                </h5>
              </div>
              <div className="p-4 pb-5">
                <div className="row">
                  <div className="col-lg-7">
                    <table className="w-100">
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">NAMA LENGKAP</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            :{" "}
                            <span className="fw-bold">{user?.nama || "-"}</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">JENIS KELAMIN</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            :{" "}
                            <span className="fw-bold">
                              {user?.gender || "-"}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
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
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">NIK</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            :{" "}
                            <span className="fw-bold">
                              {user?.profil?.nik || "-"}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">TEMPAT</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            :{" "}
                            <span className="fw-bold">{user?.tempatLahir}</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">TANGGAL LAHIR</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            :{" "}
                            <span className="fw-bold">
                              {user?.tanggalLahir
                                ? getFormatDate(user?.tanggalLahir)
                                : "-"}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">NO. HP</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            : <span className="fw-bold">{user?.whatsapp}</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">JALUR</div>
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
                    </table>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-primary text-white">
                <h5 className="fw-bold text-uppercase mb-0">
                  Materi Tes kemampuan
                </h5>
              </div>
              <div className="p-4 pb-5">
                <div className="row">
                  <div className="col-lg-4">
                    <table className="w-100">
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">BACA TULIS</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            : <span className="fw-bold"></span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">PRAKTIK IBADAH SHALAT</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            : <span className="fw-bold"></span>
                          </div>
                        </td>
                      </tr>
                      <tr className="color-dark">
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">DIAGNOSTIK</div>
                        </td>
                        <td className="text-uppercase">
                          {" "}
                          <div className="mb-4">
                            : <span className="fw-bold"></span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-primary text-white"></div>
              <div className="p-4 pb-5">
                <h6 className="fs-16-ss">
                  saya yang bertanda tangan dibawah ini menyatakan bahwa data
                  yang tertera diatas adalah yang sebenarnya.
                </h6>
              </div>
              <div className="d-flex justify-content-between align-items-start px-4 mb-4">
                <div className="color-dark">
                  <h6 className="fs-16-ss mb-2">Mengetahui,</h6>
                  <h6 className="fs-16-ss" style={{ marginBottom: "85px" }}>
                    Panitia PPDB,
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
                  <h6 className="fs-16-ss mb-2">Padang, 13-05-2024</h6>
                  <h6 className="fs-16-ss" style={{ marginBottom: "85px" }}>
                    Orang tua/Wali Peserta PPDB
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
            </>
          )}

          {sekolah?.id != 70 &&
            sekolah?.id != 9489 &&
            gelombangAktif?.gelombang?.informasi?.[0]?.nama && (
              <>
                <div className="p-2 bg-primary text-white">
                  <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
                    KETERANGAN UJIAN
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
                            <div className="mb-3 fs-12-ss">Nama</div>{" "}
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
                                  gelombangAktif?.gelombang?.informasi?.[0]
                                    ?.nama
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
                            <div className="mb-3 fs-12-ss">Tanggal</div>{" "}
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
                                {user?.mSekolahId == 70
                                  ? ""
                                  : gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.dibuka
                                  ? momentPackage(
                                      gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.dibuka
                                    ).format("dddd, DD MMMM YYYY")
                                  : "-"}
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
                            <div className="mb-3 fs-12-ss">Waktu</div>{" "}
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
                                {user?.mSekolahId == 70
                                  ? // gelombangAktif?.gelombang?.informasi?.[0]
                                    //     ?.ujian?.waktuDibuka
                                    //   ? momentPackage(
                                    //       gelombangAktif?.gelombang?.informasi?.[0]
                                    //         ?.ujian?.waktuDibuka
                                    //     ).format("HH:mm")
                                    //   : "-"
                                    ""
                                  : gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ujian?.durasi
                                  ? gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ujian?.durasi + " Menit"
                                  : user?.mSekolahId == 14 &&
                                    gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.dibuka &&
                                    gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ditutup
                                  ? `${momentPackage(
                                      gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.dibuka
                                    ).format("HH:ss")} -
                                    ${momentPackage(
                                      gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.ditutup
                                    ).format("HH:ss")}`
                                  : gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.dibuka &&
                                    gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ditutup
                                  ? `${momentPackage(
                                      gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.dibuka
                                    ).format("DD MMMM YYYY HH:ss")} -
                                      ${momentPackage(
                                        gelombangAktif?.gelombang
                                          ?.informasi?.[0]?.ditutup
                                      ).format("DD MMMM YYYY HH:ss")}`
                                  : "-"}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {gelombangAktif?.gelombang?.informasi?.[0]?.ujian
                          ?.lokasi ? (
                          <tr className="">
                            <td
                              className="text-uppercase align-text-top"
                              style={{ width: "25%" }}
                            >
                              {" "}
                              <div className="mb-3 fs-12-ss">Lokasi</div>{" "}
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
                                    gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ujian?.lokasi
                                  }
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : gelombangAktif?.gelombang?.informasi?.[0]?.ujian
                            ?.link ? (
                          <tr className="">
                            <td
                              className="text-uppercase align-text-top"
                              style={{ width: "25%" }}
                            >
                              {" "}
                              <div className="mb-3 fs-12-ss">LINK</div>{" "}
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
                                    gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ujian?.link
                                  }
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : null}

                        <tr className="">
                          <td
                            className="text-uppercase align-text-top"
                            style={{ width: "25%" }}
                          >
                            {" "}
                            <div className="fs-12-ss">Keterangan</div>{" "}
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
                            <div className="fs-12-ss mt-0">
                              {user?.mSekolahId == 70 ? (
                                <span
                                  className="fw-bold"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.ujian?.keterangan,
                                  }}
                                />
                              ) : (
                                <span className="fw-bold">
                                  {gelombangAktif?.gelombang?.informasi?.[0]
                                    ?.ujian?.tipe == "langsung"
                                    ? "Tes Langsung"
                                    : gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.ujian?.tipe == "online"
                                    ? "Tes Online"
                                    : gelombangAktif?.gelombang?.informasi?.[0]
                                        ?.ujian?.tipe == "ss"
                                    ? "Tes Online di Smarteschool"
                                    : ""}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

          {sekolah?.id !== 7789 ||
            (sekolah?.id != 70 && (
              <>
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
                                    (d) => d.id == gelombangAktif?.mJurusan1Id
                                  )?.nama
                                }
                              </span>
                            </div>
                          </td>
                        </tr>
                        {sekolah?.id !== 14 && (
                          <>
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
                                        (d) =>
                                          d.id == gelombangAktif?.mJurusan2Id
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
                                        (d) =>
                                          d.id == gelombangAktif?.mJurusan3Id
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
                                        (d) =>
                                          d.id == gelombangAktif?.mJurusan4Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="">
                              <td className="text-uppercase align-text-top">
                                {" "}
                                <div className="fs-12-ss">
                                  Pilihan Jurusan 5
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
                                <div className="fs-12-ss">
                                  <span className="fw-bold">
                                    {
                                      majors.find(
                                        (d) =>
                                          d.id == gelombangAktif?.mJurusan5Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ))}
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
