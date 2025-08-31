import semesterData from "data/semester.json";

const SectionInformasiSiswa = ({
  isReadOnly = false,
  sekolah,
  siswa,
  ta,
  kelas,
  rombel,
}) => {
  const semester = isNaN(parseInt(ta?.semester))
    ? ta?.semester
    : semesterData[sekolah?.tingkat?.toLowerCase() || "smk"][
        rombel?.tingkat || "X"
      ] + parseInt(ta?.semester);
  return (
    <>
      <div className="card card-ss">
        <div className="p-4">
          <div className="row d-md-flex d-none">
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Nama Sekolah
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!sekolah?.nama ? `-` : `${sekolah?.nama}`}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Kelas
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!kelas ? `-` : `${kelas}`}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="row d-md-flex d-none">
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Alamat
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    {sekolah?.id == "33" ? (
                      <div className="fs-18-ss fw-semibold color-dark mb-3 text-capitalize">
                        {!sekolah?.informasi?.alamat
                          ? `-`
                          : `${sekolah?.informasi?.alamat.toLowerCase()}`}
                      </div>
                    ) : (
                      <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                        {!sekolah?.informasi?.alamat
                          ? `-`
                          : `${sekolah?.informasi?.alamat}`}
                      </div>
                    )}
                  </td>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Semester
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {/* {!ta?.semester ? `-` : `${semester}`} */}
                      {kelas?.split(" ")[0] == "X" && ta?.semester == 1
                        ? 1
                        : kelas?.split(" ")[0] == "X" &&
                          (ta?.semester == 2 || ta?.semester == "Genap")
                        ? 2
                        : kelas?.split(" ")[0] == "XI" && ta?.semester == 1
                        ? 3
                        : kelas?.split(" ")[0] == "XI" &&
                          (ta?.semester == 2 || ta?.semester == "Genap")
                        ? 4
                        : kelas?.split(" ")[0] == "XII" && ta?.semester == 1
                        ? 5
                        : kelas?.split(" ")[0] == "XII" &&
                          (ta?.semester == 2 || ta?.semester == "Genap")
                        ? 6
                        : ta?.semester}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="row d-md-flex d-none">
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Nama
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!siswa?.nama ? `-` : `${siswa?.nama}`}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Tahun Ajaran
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!ta?.tahun ? `-` : `${ta?.tahun}`}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="row d-md-flex d-none">
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark">
                      NIS / NISN
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark">:</div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark text-uppercase">
                      {!siswa?.profil?.nis ? `-` : `${siswa?.profil?.nis}`}/
                      {!siswa?.profil?.nisn ? `-` : `${siswa?.profil?.nisn}`}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="row d-md-none d-flex">
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Nama Sekolah
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!sekolah?.nama ? `-` : `${sekolah?.nama}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Alamat
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!sekolah?.alamat ? `-` : `${sekolah?.alamat}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Nama
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!siswa?.nama ? `-` : `${siswa?.nama}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-md-0 md-3">
                      Nomor Induk / NISN
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-md-0 md-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-md-0 md-3 text-uppercase">
                      {!siswa?.profil?.nis ? `-` : `${siswa?.profil?.nis}`}/
                      {!siswa?.profil?.nisn ? `-` : `${siswa?.profil?.nisn}`}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div className="col-md-6">
              <table className="w-100">
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Kelas
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!kelas ? `-` : `${kelas}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Semester
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!ta?.semester ? `-` : `${ta?.semester}`}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-text-top" style={{ width: "47%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      Tahun Ajaran
                    </div>
                  </td>
                  <td className="align-text-top" style={{ width: "3%" }}>
                    <div className="fs-18-ss fw-semibold color-dark mb-3">
                      :
                    </div>
                  </td>
                  <td className="align-text-top">
                    <div className="fs-18-ss fw-semibold color-dark mb-3 text-uppercase">
                      {!ta?.tahun ? `-` : `${ta?.tahun}`}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionInformasiSiswa;
