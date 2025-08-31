import ReactiveButton from "reactive-button";
import NewModal from "../NewModal/NewModal";
import { DatePicker, InputNumber, Select } from "antd";
import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import {
  postPembayaran,
  updatePembayaran,
} from "../../../client/PembayaranClient";
import { hideModal } from "../../../utilities/ModalUtils";
import toast from "react-hot-toast";
import { momentPackage } from "../../../utilities/HelperUtils";
import moment from "moment";
import { useRouter } from "next/router";
import { ssURL } from "../../../client/clientAxios";
import SelectShared from "../SelectShared/SelectShared";

const { Option } = Select;

const initialFormData = {
  jenis: "",
  nominal: "",
  bulan: "",
  tipeUjian: "",
  mRekSekolahId: "",
  rombelId: [],
  tag: [],
  nama: "",
  taId: "",
  tanggalDibuat: "",
  namaTransaksi: "",
  mKeuAkunDebetId: "",
  mKeuAkunKreditId: "",
  namaTransaksiSiswa: "",
};

const ModalBuatPembayaran = ({
  _getPembayaran,
  tipePembayaran,
  tipeUjian,
  rombel,
  setEditData,
  editData,
  rekeningSekolah,
  ta,
  akun,
  taId,
  user,
  userData,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [buttonLoading, setButtonLoading] = useState("idle");
  const [terhubungAkunRekening, setTerhubungAkunRekening] = useState("");

  const children = [];
  if (tipePembayaran == "khusus") {
    userData?.length > 0 &&
      userData?.map((d, idx) => {
        children.push(
          <Option key={d?.id} value={d?.id}>
            {d?.nama} - {d?.anggotaRombel?.rombel?.nama}
          </Option>
        );
      });
  } else {
    rombel?.length > 0 &&
      rombel?.map((rombelData, idx) => {
        children.push(
          <Option key={rombelData?.id} value={rombelData?.id}>
            {rombelData?.nama}
          </Option>
        );
      });
  }

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function handleChangeSelect(value) {
    if (value?.target?.value) {
      setFormData({
        ...formData,
        rombelId: parseInt(value?.target?.value),
      });
    } else {
      setFormData({
        ...formData,
        rombelId: value,
      });
    }
  }
  const handleChangeSelectAkun = (e, name) => {
    // console.log(e);
    setFormData({
      ...formData,
      [e?.name]: e?.value,
    });
    if (e?.name == "mKeuTransaksiId") {
      _getTransaksi(e?.value);
    }
  };

  function handleChangeDatePicker(date, dateString) {
    setFormData({
      ...formData,
      tanggalDibuat: dateString ? moment(dateString) : "",
    });
  }

  const _postPembayaran = async () => {
    if (!formData.nama) {
      toast.error("Nama Pembayaran harus diisi");
      return;
    }
    if (!formData.taId) {
      toast.error("Tahun Ajaran Pembayaran harus diisi");
      return;
    }
    if (!formData.bulan && tipePembayaran == "spp") {
      toast.error("Bulan Pembayaran harus diisi");
      return;
    }
    if (!formData.tipeUjian && tipePembayaran == "ujian") {
      toast.error("Jenis Ulangan harus diisi");
      return;
    }
    if (!formData.nominal) {
      toast.error("Nominal Pembayaran harus diisi");
      return;
    }
    // if (!formData.mRekSekolahId) {
    //   toast.error("Tipe Akun harus harus diisi");
    //   return;
    // }
    if (formData?.rombelId?.length == 0) {
      toast.error("Target rombel harus diisi");
      return;
    }
    if (!formData.tanggalDibuat) {
      toast.error("Tanggal harus diisi");
      return;
    }
    if (terhubungAkunRekening) {
      if (!formData?.namaTransaksi) {
        toast.error("Nama Transaksi harus diisi");
        return;
      }
      if (!formData?.mKeuAkunDebetId) {
        toast.error("Akun Debit harus dipilih");
        return;
      }
      if (!formData?.mKeuAkunKreditId) {
        toast.error("Akun Kredit harus dipilih");
        return;
      }
    }

    const body = {
      ...formData,
      jenis: tipePembayaran,
      tanggalDibuat: momentPackage(formData.tanggalDibuat).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      transaksi: terhubungAkunRekening,
      taId: taId,
    };

    setButtonLoading("loading");

    const { data } = editData?.id
      ? await updatePembayaran(body, editData.id)
      : await postPembayaran(body);
    if (data) {
      if (router.query.nav != tipePembayaran) {
        router.push(`${ssURL}/pembayaran?nav=${tipePembayaran}`);
      }
      toast.success(data.message);
      _getPembayaran();
      hideModal("modalBuatPembayaran");
      // setFormData(initialFormData);
      setButtonLoading("success");
      setEditData(null);
    } else {
      setButtonLoading("error");
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        jenis: editData.jenis,
        nominal: editData.nominal,
        taId: editData.mTaId,
        bulan: editData.bulan,
        tipeUjian: editData.tipeUjian,
        mRekSekolahId: editData.mRekSekolahId,
        rombelId: editData.rombel?.map((item) => item.rombel.id),
        nama: editData.nama,
        tanggalDibuat: moment(editData.tanggalDibuat),
        tag: editData.tipeUjian,
        namaTransaksi: editData?.namaTransaksi,
        mKeuAkunDebetId: editData?.mKeuAkunDebetId,
        mKeuAkunKreditId: editData?.mKeuAkunKreditId,
        namaTransaksiSiswa: editData?.namaTransaksiSiswa,
      });
      if (editData?.namaTransaksi) {
        setTerhubungAkunRekening(true);
      }
    } else {
      setFormData({
        ...initialFormData,
        taId: ta?.find((d) => d.aktif == 1)?.id,
        tanggalDibuat: moment(),
      });
    }
  }, [editData]);

  return (
    <NewModal
      modalId="modalBuatPembayaran"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {editData ? "Ubah" : "Buat"} Pembayaran{" "}
            {tipePembayaran == "spp" && "SPP"}{" "}
            {tipePembayaran == "ujian" && "Ujian"}{" "}
            {tipePembayaran == "lainnya" && "Lainnya"}
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {editData ? "mengubah" : "menambahkan"}{" "}
            pembayaran {tipePembayaran == "spp" && "SPP"}{" "}
            {tipePembayaran == "ujian" && "Ujian"}{" "}
            {tipePembayaran == "lainnya" && "Lainnya"}
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama Pembayaran</label>
            <input
              className="form-control"
              placeholder="Tuliskan nama pembayaran"
              autoComplete="off"
              type="text"
              name="nama"
              value={formData.nama || ""}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Tahun Ajaran</label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="taId"
              value={taId || formData?.taId || ""}
              onChange={
                (handleChangeForm,
                (e) => {
                  console.log(e);
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      taId: e?.target?.value,
                    },
                  });
                })
              }
            >
              <option hidden>Pilih bulan pembayaran SPP</option>
              {ta?.map((d) => (
                <option
                  value={d?.id}
                >{`${d?.tahun} semester ${d?.semester} (${d?.namaKepsek})`}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            {tipePembayaran == "spp" && (
              <>
                <label className="form-label">Bulan Rekening SPP</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  name="bulan"
                  value={formData?.bulan || ""}
                  onChange={handleChangeForm}
                >
                  <option hidden>Pilih bulan pembayaran SPP</option>
                  <option value="januari">Januari</option>
                  <option value="februari">Februari</option>
                  <option value="maret">Maret</option>
                  <option value="april">April</option>
                  <option value="mei">Mei</option>
                  <option value="juni">Juni</option>
                  <option value="juli">Juli</option>
                  <option value="agustus">Agustus</option>
                  <option value="september">September</option>
                  <option value="oktober">Oktober</option>
                  <option value="november">November</option>
                  <option value="desember">Desember</option>
                </select>
              </>
            )}
          </div>
          <div className="mb-4">
            {tipePembayaran == "ujian" && (
              <>
                <label className="form-label">Tipe Ujian</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  id="tipeUjian"
                  name="tipeUjian"
                  value={formData.tipeUjian || ""}
                  onChange={handleChangeForm}
                >
                  <option hidden>Pilih tipe ujian yang ingin dibayar</option>
                  {tipeUjian?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                  {/* <option value="penilaian-tengah-semester-1">
                    Penilaian Tengah Semester / Sumatif Tengah Semester 1
                  </option>
                  <option value="penilaian-tengah-semester-2">
                    Penilaian Tengah Semester / Sumatif Tengah Semester 2
                  </option>
                  <option value="penilaian-akhir-semester-1">
                    Penilaian Akhir Semester 1
                  </option>
                  <option value="penilaian-akhir-semester-2">
                    Penilaian Akhir Semester 2
                  </option>
                  <option value="akm-literasi">AKM - Literasi</option>
                  <option value="akm-numerasi">AKM - Numerasi</option> */}
                </select>
              </>
            )}
            {tipePembayaran == "lainnya" && (
              <>
                <label className="form-label">Kategori Pembayaran</label>
                <CreatableSelect
                  isClearable
                  isMulti
                  placeholder="Ketik Untuk membuat Kategori baru"
                  value={formData.tag}
                  onChange={(val) => {
                    setFormData({
                      ...formData,
                      tag: val,
                    });
                  }}
                />
              </>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label">Nominal</label>
            <div className="input-saldo-rekening">
              <InputNumber
                className="form-control w-100"
                formatter={(value) =>
                  `Rp${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                placeholder="Rp. 0"
                autoComplete="off"
                name="nominal"
                value={formData.nominal}
                parser={(value) => value.replace(/Rp|\./g, "")}
                onChange={(value) =>
                  handleChangeForm({ target: { name: "nominal", value } })
                }
                step={1000}
              />
            </div>
            {/* <input
              className="form-control"
              autoComplete="off"
              placeholder="Rp. 0"
              type="number"
              name="nominal"
              value={formData.nominal}
              onChange={handleChangeForm}
            /> */}
          </div>

          {/* <div className="mb-4">
            <>
              <label className="form-label">Tipe Akun Rekening</label>
              <SelectShared
                name="mRekSekolahId"
                placeholder="Pilih tipe akun rekening"
                handleChangeSelect={(e, name) =>
                  handleChangeForm({ target: { name, value: e.value } })
                }
                value={formData?.mRekSekolahId}
                options={rekeningSekolah?.map((d) => {
                  return {
                    label: `${d?.jenis || "Dana Sekolah"} - ${d?.bank}`,
                    value: d?.id,
                  };
                })}
                isDisabled={editData?.id ? true : false}
              /> */}
          {/* <option hidden>Pilih tipe akun rekening</option>
                {rekeningSekolah?.map((d) => (
                  <option value={d?.id}>{`${d?.jenis || "Dana Sekolah"} - ${
                    d?.bank
                  }`}</option>
                ))} */}
          {/* </>
          </div> */}
          {tipePembayaran == "khusus" ? (
            <div className="mb-4">
              <label className="form-label">Bagikan Kepada</label>
              {/* <Select
                // mode="multiple"
                allowClear
                style={{ width: "100%" }}
                value={editData?.user?.nama}
                defaultValue={editData?.user?.nama}
                placeholder="Bagikan Kepada"
                onChange={handleChangeSelect}
                disabled={editData?.id}
              >
                {children}
              </Select> */}
              <select
                className="form-select"
                aria-label="Default select example"
                name="taId"
                value={editData?.user?.id}
                defaultValue={editData?.user?.id}
                onChange={handleChangeSelect}
                disabled={editData?.id}
              >
                <option hidden>Bagikan Kepada Siswa</option>
                {userData?.map((d) => (
                  <option value={d?.id}>
                    {d?.nama} - {d?.anggotaRombel?.rombel?.nama}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4">
              <label className="form-label">Bagikan Kepada</label>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                value={formData.rombelId}
                placeholder="Bagikan Kepada"
                onChange={handleChangeSelect}
              >
                {children}
              </Select>
            </div>
          )}
          <div className="mb-4">
            <label className="form-label">Tanggal Dibuat</label>
            <DatePicker
              className="form-control"
              autoComplete="off"
              value={formData.tanggalDibuat || moment()}
              placeholder="Pilih tanggal"
              onChange={handleChangeDatePicker}
            />
          </div>
          {user?.mSekolahId == 13 ||
          user?.mSekolahId == 8468 ||
          user?.mSekolahId == 8731 ||
          user?.mSekolahId == 8780 ||
          user?.mSekolahId == 8858 ||
          user?.mSekolahId == 8880 ||
          user?.mSekolahId == 8885 ||
          user?.mSekolahId == 8940 ||
          user?.mSekolahId == 9078 ? (
            <div className="mb-4">
              <h6 className="fs-18-ss fw-bold color-dark mb-2">
                Terhubung dengan Transaksi?
              </h6>
              <div className="row">
                <div className="form-check-ss col-md-6 position-relative">
                  <input
                    className="form-check-input form-check-radio position-absolute"
                    type="radio"
                    name="flexRadioDefault"
                    id="radioYa"
                    style={{
                      top: "36%",
                      left: "2em",
                      // height: "20px",
                    }}
                    // name="terhungAkunRekening"
                    checked={terhubungAkunRekening}
                  />
                  <label
                    className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                    htmlFor="radioYa"
                    onClick={() => setTerhubungAkunRekening(true)}
                  >
                    <span className="ms-4 ps-2">Ya</span>
                  </label>
                </div>
                <div className="form-check-ss col-md-6 position-relative">
                  <input
                    className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                    type="radio"
                    name="flexRadioDefault"
                    id="radioTidak"
                    style={{
                      top: "36%",
                      left: "2em",
                      // height: "20px",
                    }}
                    checked={!terhubungAkunRekening}
                  />
                  <label
                    className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                    htmlFor="radioTidak"
                    onClick={() => setTerhubungAkunRekening(false)}
                  >
                    <span className="ms-4 ps-2">Tidak</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {terhubungAkunRekening ? (
            <>
              <div className="mb-4">
                <label className="form-label">Nama Transaksi</label>
                <input
                  className="form-control"
                  placeholder="Tuliskan Nama Transaksi (Contoh : Pembayaran SPP bulan Januari)"
                  type="text"
                  value={formData?.namaTransaksi}
                  name="namaTransaksi"
                  onChange={handleChangeForm}
                  maxLength={255}
                />
              </div>
              <h5 className="fs-18-ss color-dark fw-bold">Jurnal Umum</h5>
              <table className="table-ss">
                <thead>
                  <tr>
                    <th style={{ width: "50%" }}>Nama Akun</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* {formData?.jurnal?.map((d, idx) => {
                      return ( */}
                  <tr className="w-100">
                    <td width="70%">
                      <SelectShared
                        name="mKeuAkunDebetId"
                        handleChangeSelect={(e, name) =>
                          handleChangeSelectAkun({
                            value: e?.value,
                            name: "mKeuAkunDebetId",
                          })
                        }
                        value={formData.mKeuAkunDebetId}
                        options={akun?.map((d) => {
                          return {
                            value: d?.id,
                            label: `${d?.kode ? `${d?.kode} -` : ""} ${
                              d?.nama
                            }`,
                          };
                        })}
                        placeholder="Pilih akun"
                      />
                    </td>
                    <td>
                      <div className="input-saldo-rekening">
                        <input
                          type="text"
                          className="form-control text-center"
                          // value={formData?.roleBefore}
                          value="DEBIT"
                          disabled
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="w-100">
                    <td width="70%">
                      <SelectShared
                        name="mKeuAkunKreditId"
                        handleChangeSelect={(e, name) =>
                          handleChangeSelectAkun({
                            value: e?.value,
                            name: "mKeuAkunKreditId",
                          })
                        }
                        value={formData.mKeuAkunKreditId}
                        options={akun?.map((d) => {
                          return {
                            value: d?.id,
                            label: `${d?.kode ? `${d?.kode} -` : ""} ${
                              d?.nama
                            }`,
                          };
                        })}
                        placeholder="Pilih akun"
                      />
                    </td>
                    <td>
                      <div className="input-saldo-rekening">
                        <input
                          type="text"
                          className="form-control text-center"
                          // value={formData?.roleBefore}
                          value="KREDIT"
                          disabled
                        />
                      </div>
                    </td>
                  </tr>
                  {/* );
                    })} */}
                </tbody>
              </table>
              <div className="mb-4">
                <label className="form-label">
                  Nama Transaksi (default - nama siswa)
                </label>
                <input
                  className="form-control"
                  placeholder="Tuliskan Nama Transaksi Pembayaran (Contoh : Pembayaran SPP bulan Januari)"
                  type="text"
                  value={formData?.namaTransaksiSiswa}
                  name="namaTransaksiSiswa"
                  onChange={handleChangeForm}
                  maxLength={255}
                />
              </div>
            </>
          ) : (
            ""
          )}
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonLoading}
          onClick={_postPembayaran}
          color={"primary"}
          idleText={`${editData ? "Ubah" : "Tambah"} Pembayar`}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};

export default ModalBuatPembayaran;
