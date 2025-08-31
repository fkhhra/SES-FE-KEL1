import { useState } from "react";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { editStudentFoto } from "../../../client/StudentClient";
import { momentPackage } from "../../../utilities/HelperUtils";
import { hideModal } from "../../../utilities/ModalUtils";
import ModalUbahFotoProfil from "../../Rombel/ModalUbahFotoProfil";
import ModalEditDetailProfil from "components/Profil/ModalEditDetailProfil";

const SectionIdentitasPesertaDidikYadikaPrint = ({
  isReadOnly = false,
  siswa,
  sekolah,
  ta,
  setFormData,
  formData,
}) => {
  const [formData1, setFormData1] = useState({
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
    kodepos: siswa?.profil?.kodepos,
    provinceId: siswa?.profil?.provinceId,
    regencyId: siswa?.profil?.regencyId,
    districtId: siswa?.profil?.districtId,
    villageId: siswa?.profil?.villageId,
    alamat: siswa?.profil?.alamat,
    asalSekolah: siswa?.profil?.asalSekolah,
    kelasDiterima: siswa?.profil?.kelasDiterima,
    tanggalMasuk: siswa?.profil?.tanggalMasuk,
  });

  const [buttonState, setButtonState] = useState("idle");

  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);

  const _postProfilUser = async () => {
    setButtonState("loading");
    const { data, error } = await postProfilUser({
      ...formData1,
      tanggalLahir: formData1.tanggalLahir
        ? momentPackage(formData1.tanggalLahir).format("YYYY-MM-DD")
        : momentPackage().format("YYYY-MM-DD"),
      tanggalMasuk: formData1.tanggalMasuk
        ? momentPackage(formData1.tanggalMasuk).format("YYYY-MM-DD")
        : "",
    });

    if (data) {
      setButtonState("success");
      hideModal("modalEditDetailProfil");
      toast.success(data?.message);
      setUser({
        ...user,
        whatsapp: formData1.whatsapp,
        nama: formData1.nama,
        gender: formData1.gender,
        tempatLahir: formData1.tempatLahir,
        tanggalLahir: formData1.tanggalLahir,
        agama: formData1.agama,
        profil: {
          ...user?.profil,
          nrk: formData1.nrk,
          nip: formData1.nip,
          nuptk: formData1.nuptk,
          nisn: formData1.nisn,
          nis: formData1.nis,
          asalSekolah: formData1.asalSekolah,
          kodepos: formData1.kodepos,
          provinceId: formData1.provinceId,
          regencyId: formData1.regencyId,
          districtId: formData1.districtId,
          villageId: formData1.villageId,
          alamat: formData1?.alamat,
        },
      });
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  const handleChangeDate = (e, name) => {
    setFormData1({
      ...formData1,
      [name]: e,
    });
  };

  const handleChangeForm = (e) => {
    setFormData1({
      ...formData1,
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

    setFormData1({
      ...formData1,
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

  return (
    <>
      <div className="" style={{ minHeight: "100vh" }}>
        <div className="row text-center mb-4">
          <div className="col-md-12">
            <h6 className="fs-14-ss fw-bold text-uppercase mb-0">
              Identitas Peserta Didik
            </h6>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="w-100">
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">1.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Nama Peserta Didik</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.nama ? `-` : `${siswa?.nama}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">2.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Nomor Induk</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.nis ? `-` : `${siswa?.profil?.nis}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">3.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">
                    Nomor Induk Siswa Nasional
                  </div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.nisn ? `-` : `${siswa?.profil?.nisn}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">4.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Tempat, Tanggal Lahir</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.tempatLahir || !siswa?.tanggalLahir
                      ? `-`
                      : `${siswa?.tempatLahir}, ${momentPackage(
                          siswa?.tanggalLahir
                        ).format("DD MMMM YYYY")}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">5.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Jenis Kelamin</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.genderText ? `-` : `${siswa?.genderText}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">6.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Agama</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.agama ? `-` : `${siswa?.agama}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">7.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Status dalam Keluarga</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.statusKeluarga
                      ? `-`
                      : `${siswa?.profil?.statusKeluarga}`}
                  </div>
                </td>
              </tr>
              {/* <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">7.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Anak ke</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.anakKe ? `-` : `${siswa?.profil?.anakKe}`}
                  </div>
                </td>
              </tr> */}
              <tr>
                {/* <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">8.</div>
                </td> */}
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">8.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss"> Alamat Peserta Didik</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  {sekolah?.id == "33" ? (
                    <div className="mb-1 fs-12-ss text-capitalize">
                      {!siswa?.profil?.alamat
                        ? `-`
                        : `${siswa?.profil?.alamat.toLowerCase()}`}
                    </div>
                  ) : (
                    <div className="mb-1 fs-12-ss text-uppercase">
                      {!siswa?.profil?.alamat
                        ? `-`
                        : `${siswa?.profil?.alamat}`}
                    </div>
                  )}
                </td>
              </tr>
              {/* <tr> */}
              {/* <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">9.</div>
                </td> */}
              {/* <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">7.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Nomor Telepon</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.whatsapp ? `-` : `${siswa?.whatsapp}`}
                  </div>
                </td>
              </tr> */}

              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">9.</div>
                </td>
                <td colSpan="3">
                  <div className="mb-1 fs-12-ss">Diterima di Sekolah Ini</div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">a. Di kelas</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.kelasDiterima
                      ? `-`
                      : `${siswa?.profil?.kelasDiterima}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">b. Pada tanggal</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.tanggalMasuk
                      ? `-`
                      : `${momentPackage(siswa?.profil?.tanggalMasuk).format(
                          "DD MMMM YYYY"
                        )}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">c. Semester</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase"> 1</div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">10.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Sekolah Asal</div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">a. Nama Sekolah</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.asalSekolah
                      ? `-`
                      : `${siswa?.profil?.asalSekolah}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">b. Alamat</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.alamatAsalSekolah
                      ? `-`
                      : `${siswa?.profil?.alamatAsalSekolah}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">11.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">Ijazah</div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">a. Nomor</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.noIjazah
                      ? `-`
                      : `${siswa?.profil?.noIjazah}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">b. Tahun</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.tahunIjazah
                      ? `-`
                      : `${siswa?.profil?.tahunIjazah}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">12.</div>
                </td>
                <td colSpan="3">
                  <div className="mb-1 fs-12-ss">Orang Tua</div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">a. Nama Ayah</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.namaAyah
                      ? `-`
                      : `${siswa?.profil?.namaAyah}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">b. Nama Ibu</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.namaIbu
                      ? `-`
                      : `${siswa?.profil?.namaIbu}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">c. Alamat</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.alamatAyah
                      ? `-`
                      : `${siswa?.profil?.alamatAyah}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">d. Telepon/HP</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.telpAyah
                      ? `-`
                      : `${siswa?.profil?.telpAyah}`}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">13.</div>
                </td>
                <td colSpan="3">
                  <div className="mb-1 fs-12-ss">Pekerjaan Orang Tua</div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">a. Ayah</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.pekerjaanAyah
                      ? `-`
                      : `${siswa?.profil?.pekerjaanAyah}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss"></div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">b. Ibu</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.pekerjaanIbu
                      ? `-`
                      : `${siswa?.profil?.pekerjaanIbu}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}>
                  <div className="mb-1 fs-12-ss">14.</div>
                </td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss"> Wali</div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}></td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">a. nama Wali</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.namaWali
                      ? `-`
                      : `${siswa?.profil?.namaWali}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}></td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">b. Alamat Wali</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.alamatWali
                      ? `-`
                      : `${siswa?.profil?.alamatWali}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}></td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">c. Telopon/HP</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.telpWali
                      ? `-`
                      : `${siswa?.profil?.telpWali}`}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="align-text-top" style={{ width: "3%" }}></td>
                <td className="align-text-top" style={{ width: "45%" }}>
                  <div className="mb-1 fs-12-ss">d. Pekerjaan Wali</div>
                </td>
                <td className="align-text-top" style={{ width: "9%" }}>
                  <div className="mb-1 fs-12-ss">:</div>
                </td>
                <td className="align-text-top" style={{ width: "43%" }}>
                  <div className="mb-1 fs-12-ss text-uppercase">
                    {!siswa?.profil?.pekerjaanWali
                      ? `-`
                      : `${siswa?.profil?.pekerjaanWali}`}
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="col-md-12 mt-2">
            <div className="row align-items-center justify-content-around">
              <div className="col-3">
                <img
                  src={siswa?.avatar || "/img/cover-sma-smk.svg"}
                  alt="cover-foto-rapor"
                  className="img-fluid img-fit-cover rounded-ss"
                  style={{ width: "115px", height: "150px" }}
                />
              </div>
              <div className="col-5 d-flex align-items-center justify-content-end">
                <div>
                  {sekolah?.id == "33" ? (
                    <h5 className="fs-12-ss mb-2">
                      Kabupaten {sekolah?.provinsi},{" "}
                      {!siswa?.profil?.tanggalMasuk
                        ? `-`
                        : `${momentPackage(siswa?.profil?.tanggalMasuk).format(
                            "DD MMMM YYYY"
                          )}`}
                    </h5>
                  ) : (
                    <h5 className="fs-12-ss mb-2">
                      {sekolah?.provinsi},{" "}
                      {momentPackage(ta?.tanggalRapor).format("DD MMMM YYYY")}
                    </h5>
                  )}
                  <h5 className="fs-12-ss" style={{ marginBottom: "85px" }}>
                    Kepala Sekolah
                  </h5>
                  <h5 className="fs-12-ss fw-bold mb-1">{ta?.namaKepsek}</h5>
                  <h5 className="fs-12-ss text-uppercase">
                    {sekolah?.id == 33 ? "NUKS." : "NIP."} {ta?.nipKepsek}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionIdentitasPesertaDidikYadikaPrint;
