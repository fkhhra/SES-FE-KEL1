import { getProfilUser } from "client/AuthClient";
import { getGelombangPPDB } from "client/GelombangPPDB";
import { getMajors } from "client/MajorsClient";
import { meSekolah } from "client/SekolahClient";
import useSekolah from "hooks/useSekolah";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import moment from "moment";
import { useEffect, useState } from "react";
import { momentPackage, padNumber } from "utilities/HelperUtils";

const index = ({}) => {
  const { ta } = useTa();
  const { sekolah, setSekolah } = useSekolah();
  const { user, setUser } = useUser();
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const [loading, setLoading] = useState(true);

  const {
    gelombang,
    gelombangAktif,
    semuaGelombangPengembalian,
    gelombangPembelian,
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
        <div className="col-md-12" style={{ minHeight: "100vh" }}>
          <div className="kartu-peserta-ppdb text-center d-flex flex-column align-items-center">
            <img
              src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
              alt=""
              style={{ width: "125px", marginBottom: "100px" }}
            />
            <h6 className="fw-bold color-dark text-uppercase mb-4">
              Formulir Pendaftaran Siswa Baru
            </h6>
            <h6 className="fw-bold color-dark text-uppercase mb-4">
              {sekolah?.nama}
            </h6>
            <h6
              className="fw-bold color-dark text-uppercase"
              style={{ marginBottom: "150px" }}
            >
              Tahun {momentPackage().add(6, "months").format("YYYY")} -{" "}
              {momentPackage().add(18, "months").format("YYYY")}
            </h6>
            <hp
              className="fw-bold fs-14-ss color-dark text-uppercase"
              style={{ marginBottom: "150px" }}
            >
              JALUR SELEKSI : {gelombangAktif?.gelombang?.nama}
            </hp>
            <h6 className="fw-bold color-dark text-uppercase mb-4">
              NAMA : {user?.nama}
            </h6>
            <h6 className="fw-bold color-dark text-uppercase mb-4">
              NISN : {user?.profil?.nisn || "-"}
            </h6>
            <h6
              className="fw-bold color-dark text-uppercase"
              style={{ marginBottom: "150px" }}
            >
              NOMOR PESERTA :{" "}
              {sekolah?.id == 14 || sekolah?.id == 13 || sekolah?.id == 121 ? (
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
                    `${gelombangPembelian?.gelombang?.diterima}`.length
                  )}
                </>
              ) : sekolah?.id == 9487 || sekolah?.id == 9489 ? (
                <>
                  REG
                  {gelombangAktif?.gelombang?.nama?.indexOf("SD") !== -1
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
                          (d) => d.id == gelombangAktif?.gelombang?.id
                        ) + 1,
                        `${sekolah?.id == 14 ? 2 : gelombang?.length}`
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
                        : "04"} {" "}
                        -{" "}
                        {padNumber(
                          gelombangAktif?.gelombang?.pendaftar.findIndex(
                            (d) => d.id == gelombangAktif?.id
                          ) + 1,
                          4
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
                        : "03"}{" "}
                        -{" "}
                        {padNumber(
                          gelombangAktif?.gelombang?.pendaftar.findIndex(
                            (d) => d.id == gelombangAktif?.id
                          ) + 1,
                          `${gelombangAktif?.gelombang?.diterima}`.length
                        )}
                    </>
                  )}
                </>
              )}
            </h6>
          </div>
        </div>
        <div className="col-md-12" style={{ minHeight: "100vh" }}>
          <div className="kartu-peserta-ppdb">
            <div className="row">
              <div className="col-md-12 text-center d-flex flex-column align-items-center justify-content-center mb-5">
                <h6 className="color-dark fw-bold text-uppercase mb-5">
                  Formulir Pendaftaran
                </h6>
                <img
                  src={user?.avatar}
                  alt=""
                  className="img-fit-cover"
                  width="188px"
                  height="250px"
                />
              </div>
              <div className="col-md-12">
                <h6 className="color-dark fw-bold text-uppercase mb-5">
                  Data Diri
                </h6>
                <table className="w-100">
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        1. NISN
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.nisn || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        2. NOMOR HANDPHONE
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.whatsapp}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        3. NAMA LENGKAP
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.nama}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        4. NAMA PANGGILAN
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.namaPanggilan
                          ? user?.profil?.namaPanggilan
                          : user?.nama}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        5. JENIS KELAMIN
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.genderText}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        6. AGAMA
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.agama}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        7. TEMPAT LAHIR
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.tempatLahir}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        8. TANGGAL LAHIR
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {moment(user?.tanggalLahir).format(
                          "dddd, DD MMMM YYYY"
                        )}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        9. ALAMAT
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.alamat || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        10. ASAL SEKOLAH
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.asalSekolah || "-"}
                      </h6>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12" style={{ minHeight: "100vh" }}>
          <div className="kartu-peserta-ppdb">
            <div className="row">
              <div className="col-md-12 mb-5">
                <h6 className="color-dark fw-bold text-uppercase mb-5">
                  Informasi Orang Tua
                </h6>
                <table className="w-100">
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        1. NAMA AYAH
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.namaAyah || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        2. PEKERJAAN AYAH
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.pekerjaanAyah || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        3. NOMOR HANDPHONE
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.telpAyah || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        4. ALAMAT AYAH
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.alamatAyah || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        5. NAMA IBU
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.namaIbu || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        6. PEKERJAAN IBU
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.pekerjaanIbu || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        7. NOMOR HANDPHONE
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.telpIbu || "-"}
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "35%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        8. ALAMAT IBU
                      </h6>
                    </td>
                    <td style={{ width: "5%" }}>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        :
                      </h6>
                    </td>
                    <td>
                      <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                        {user?.profil?.alamatIbu || "-"}
                      </h6>
                    </td>
                  </tr>
                </table>
              </div>
              {/* <div className="col-md-12 mb-5">
                      <h3 className="color-dark fw-bold text-uppercase mb-5">
                        Informasi Kesehatan
                      </h3>
                      <table className="w-100">
                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              1. TINGGI BADAN
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark">
                              {user?.profil?.tb || '-'}cm
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              2. BERAT BADAN
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              {user?.profil?.bb || '-'}kg
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              3. GOLONGAN DARAH
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              {user?.profil?.golDarah || '-'}
                            </h6>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              4. KACAMATA
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              {user?.profil?.kacamata || '-'}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              5. BUTA WARNA
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              {user?.profil?.butaWarna || '-'}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              6. DISABILITAS
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              {user?.profil?.disabilitas || '-'}
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              7. SURAT KETERANGAN KESEHATAN
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            {user?.profil?.suratKeteranganSehat ? (
                              <a href={user?.profil?.suratKeteranganSehat}>
                                <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                                  {user?.profil?.suratKeteranganSehat}
                                </h6>
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              8. SURAT KETERANGAN TIDAK BUTA WARNA
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              :
                            </h6>
                          </td>
                          <td>
                            <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                              {user?.profil?.suratKeteranganButaWarna ? (
                                <a
                                  href={user?.profil?.suratKeteranganButaWarna}
                                >
                                  <h6 className="mb-4 color-dark text-uppercase fs-14-ss">
                                    {user?.profil?.suratKeteranganButaWarna}
                                  </h6>
                                </a>
                              ) : (
                                "-"
                              )}
                            </h6>
                          </td>
                        </tr>
                      </table>
                    </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default index;
