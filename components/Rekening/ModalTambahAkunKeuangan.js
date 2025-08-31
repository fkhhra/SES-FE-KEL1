import ReactiveButton from "reactive-button";
import bankData from "../../data/bank.json";
import Select, { components } from "react-select";
import { FaDivide, FaMinus, FaPlus, FaSlash, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  postRekeningSekolah,
  updateRekeningSekolah,
} from "../../client/RekeningSekolahClient";
import toast from "react-hot-toast";
import { hideModal } from "../../utilities/ModalUtils";
import { InputNumber } from "antd";
import NewModal from "components/Shared/NewModal/NewModal";
import { postAkunSekolah, putAkunSekolah } from "client/KeuanganSekolahClient";
import { postRumus } from "client/LabaRugiClient";
import SelectShared from "components/Shared/SelectShared/SelectShared";

const initialFormData = {
  bank: "",
  jenis: "",
  norek: "",
  nama: "",
  saldo: "",
  kode: "",
  rumus: "",
  nama_penyusutan: "",
  m_keu_akun_akumulasi_id: "",
  penyusutan: "",
};

const ModalTambahAkunKeuangan = ({
  editData,
  _getKeuanganSekolah,
  rekeningSekolah,
  akun,
  id,
  laba,
  rumus,
  currentRumus,
  setCurrentRumus,
}) => {
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [terhubungAkunRekening, setTerhubungAkunRekening] = useState("");
  const [terhubungPenyusutan, setTerhubungPenyusutan] = useState("");
  const [dataAngka, setDataAngka] = useState([]);

  const tambahOperator = (operator) => {
    const temp = currentRumus;
    if (temp?.length == 0) {
      toast.error("Rumus harus diawali dengan daftar akun");
    } else {
      temp.push({ operator });
    }
    setCurrentRumus([...temp]);
  };

  const tambahAngka = (angka) => {
    const temp = currentRumus;
    if (temp?.length == 0) {
      toast.error("Rumus harus diawali dengan daftar akun");
    } else {
      if (temp[temp.length - 1]?.operator || temp[temp.length - 1]?.id) {
        temp.push({ angka });

        console.log("nambah angka awal", temp);
        setCurrentRumus([...temp]);
      } else {
        temp[temp.length - 1] = {
          angka: parseInt(temp[temp.length - 1]?.angka + "" + angka),
        };
        console.log("nambah angka jika ada operator", temp);
        setCurrentRumus([...temp]);
      }
    }
  };

  const tambahKategori = (id) => {
    const temp = currentRumus;
    if (temp?.length == 0) {
      temp.push({ id });
    } else if (temp[temp?.length - 1]?.operator) {
      temp.push({ id });
    } else {
      toast.error("Kategori harus dipisah oleh operator");
    }
    setCurrentRumus([...temp]);
  };
  const remove = (idx) => {
    const temp = currentRumus;
    if (idx != temp?.length - 1) {
      toast.error("tidak dapat menghapus ditengah rumus");
    } else {
      temp.pop();
    }
    setCurrentRumus([...temp]);
  };
  const handleChangeForm = (e) => {
    console.log(e);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePenyusutan = (e) => {
    // console.log(e);
    setTerhubungPenyusutan(e);
    setFormData({
      ...formData,
      penyusutan: e,
    });
  };

  const handleChangeSelect = (e) => {
    setFormData({
      ...formData,
      bank: e?.value,
    });
  };

  const handleChangeSelectAkumulasi = (e) => {
    // console.log(e);
    setFormData({
      ...formData,
      m_keu_akun_akumulasi_id: e,
    });
  };

  const _postAkunSekolah = async () => {
    if (!formData.nama) {
      toast.error("Nama akun harus di isi");
      return;
    }
    // if (!formData.kode) {
    //   toast.error("Kode Akun harus di isi");
    //   return;
    // }
    if (akun?.find((d) => d?.kode == formData.kode && d?.id != formData?.id)) {
      toast.error("Kode Akun sudah digunakan");
      return;
    }
    if (terhubungAkunRekening) {
      if (!formData.bank) {
        toast.error("Bank Rekening harus di isi");
        return;
      }
      if (!formData.norek) {
        toast.error("Nomor rekening harus di isi");
        return;
      }
      if (!formData.saldo && formData.saldo !== 0) {
        toast.error("Saldo rekening harus di isi");
        return;
      }
    }

    setButtonState("loading");
    const { data } = await postAkunSekolah({
      ...formData,
      rek: terhubungAkunRekening,
      rumus232: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data.message);
      _getKeuanganSekolah();
      hideModal("modalTambahAkunKeuangan");
      setFormData(initialFormData);
      setButtonState("success");
    } else {
      setButtonState("error");
    }
  };

  const _updateAkunSekolah = async () => {
    if (!formData.nama) {
      toast.error("Nama akun harus di isi");
      return;
    }
    if (formData.kode) {
      if (
        akun?.find((d) => d?.kode == formData.kode && d?.id != formData?.id)
      ) {
        toast.error("Kode Akun sudah digunakan");
        return;
      }
    }
    if (terhubungAkunRekening) {
      if (!formData.bank) {
        toast.error("Bank Rekening harus di isi");
        return;
      }
      if (!formData.norek) {
        toast.error("Nomor rekening harus di isi");
        return;
      }
      if (!formData.saldo && formData.saldo !== 0) {
        toast.error("Saldo rekening harus di isi");
        return;
      }
    }

    if (formData?.nama == "BEBAN INVENTARIS") {
      if (!currentRumus?.length) {
        toast.error("Periksa kembali rumus anda");
        return;
      }
    }

    setButtonState("loading");
    let rumusData;
    if (
      formData?.nama == "KUMULATIF LABA (RUGI)" ||
      formData?.kode == "00000" ||
      formData?.nama == "AKUMULATIF LABA (RUGI)" ||
      formData?.nama == "AKUMULASI LABA (RUGI)"
    ) {
      rumusData = formData?.rumus;
    } else {
      rumusData = JSON.stringify(currentRumus);
    }
    const { data } = await putAkunSekolah(formData?.id, {
      ...formData,
      rek: terhubungAkunRekening,
      m_rencana_keuangan_id: id,
      rumus: rumusData,
      rumus_penyusutan: JSON.stringify(currentRumus),
    });

    if (data) {
      toast.success(data.message);
      _getKeuanganSekolah();
      hideModal("modalTambahAkunKeuangan");
      setButtonState("success");
    } else {
      setButtonState("error");
    }
  };
  console.log(formData);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...formData,
        ...editData?.rek,
        ...editData?.rumusAkun,
        ...editData?.penyusutan,
        ...editData,
      });
      setTerhubungAkunRekening(
        editData?.rek && editData?.rek?.dihapus == 0 ? true : false
      );
      setTerhubungPenyusutan(
        editData?.penyusutan && editData?.penyusutan?.dihapus == 0
          ? true
          : false
      );
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <div className="d-flex align-items-center">
          {props.data.img && (
            <img
              src={props.data.img}
              alt={props.data.label}
              style={{ height: 50, width: 50, objectFit: "contain" }}
            />
          )}
          <div className="ms-4">
            <div>{props.data.label}</div>
            <div style={{ fontSize: 12 }}>{props.data.value}</div>
          </div>
        </div>
      </components.Option>
    );
  };

  return (
    <NewModal
      modalId="modalTambahAkunKeuangan"
      onCloseModal={() => {
        setFormData({ ...initialFormData });
      }}
      title={
        <>
          <h4 className="mb-1 fw-extrabold text-capitalize">
            {editData ? "Ubah" : "Tambah"} Akun{" "}
            {formData?.nama == "BEBAN INVENTARIS"
              ? formData?.nama.toLowerCase()
              : ""}
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {editData ? "mengubah" : "menambahkan"}{" "}
            akun
          </span>
        </>
      }
      content={
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label">Nama Akun</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  placeholder="Tuliskan nama akun"
                  type="text"
                  name="nama"
                  value={formData.nama}
                  maxLength={255}
                  onChange={handleChangeForm}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label">Kode Akun</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  placeholder="Tuliskan nomor rekening"
                  type="text"
                  name="kode"
                  value={formData.kode}
                  maxLength={20}
                  onChange={handleChangeForm}
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h6 className="fs-18-ss fw-bold color-dark mb-3">Saldo Normal</h6>
            <div className="row">
              <div className="form-check-ss col-md-6 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="debet"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="saldoNormal"
                  value="Debet"
                  checked={formData.saldoNormal == "Debet"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="debet"
                >
                  <span className="ms-4 ps-2">Debet</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="kredit"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="Kredit"
                  name="saldoNormal"
                  checked={formData.saldoNormal == "Kredit"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="kredit"
                >
                  <span className="ms-4 ps-2">Kredit</span>
                </label>
              </div>
            </div>
          </div>
          {formData?.nama == "KUMULATIF LABA (RUGI)" ||
          formData?.kode == "00000" ||
          formData?.nama == "AKUMULATIF LABA (RUGI)" ||
          formData?.nama == "AKUMULASI LABA (RUGI)" ? (
            <>
              <div className="row g-4">
                <div className="col-md-12">
                  <label className="form-label">Rumus Laba Rugi</label>

                  <SelectShared
                    name="moda"
                    placeholder="Pilih Rumus"
                    value={parseInt(formData?.rumus)}
                    handleChangeSelect={(e) => {
                      setFormData({
                        ...formData,
                        rumus: e?.value || "",
                      });
                    }}
                    isClearable
                    options={rumus?.map((d) => {
                      return {
                        label: `${d?.nama}`,
                        value: d?.id,
                      };
                    })}
                  />
                </div>
              </div>
            </>
          ) : formData?.nama == "AKUMULASI PENYUSUTAN" ||
            formData?.nama == "Akumulasi Penyusutan" ||
            formData?.nama == "AKUMULASI DIVIDEN" ||
            formData?.nama == "AKUMULATIF DIVIDEN" ||
            formData?.nama == "DIVIDEN" ? (
            <>
              <div className="mb-4">
                <label className="form-label">Rumus</label>
                <div className="w-100 rounded-ss border border-light-secondary-ss px-2 d-flex align-items-center flex-wrap">
                  {/* IF TIDAK ADA RUMUS */}
                  {!currentRumus?.length ? (
                    <h6 className="color-secondary my-2 fs-14-ss px-1 fw-semibold">
                      Buat Rumus Dengan{" "}
                      <span className="color-dark fw-extrabold">
                        Memilih Kategori
                      </span>{" "}
                      dan Menggunakan{" "}
                      <span className="color-dark fw-extrabold">
                        Operator Matematika
                      </span>
                    </h6>
                  ) : (
                    <>
                      {formData?.nama == "MODAL" ? (
                        <>
                          <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                            <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                              TOTAL AKTIVA
                            </span>
                          </span>
                          <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                            <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                              <FaMinus />
                            </span>
                          </span>
                        </>
                      ) : (
                        <div className=""></div>
                      )}
                      {currentRumus?.map((d, idx) => {
                        if (d?.operator) {
                          return (
                            <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                              <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                {d?.operator == "plus" ? (
                                  <FaPlus />
                                ) : (
                                  <FaMinus />
                                )}
                              </span>
                              <a
                                className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark"
                                onClick={() => remove(idx)}
                              >
                                <FaTimes />
                              </a>
                            </span>
                          );
                        } else {
                          return (
                            <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                              {formData?.nama == "MODAL" ||
                              formData?.nama == "LABA DITAHAN" ? (
                                <>
                                  <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                    {laba?.find((e) => e?.id == d?.id)?.nama}
                                  </span>
                                  <a
                                    className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark"
                                    onClick={() => remove(idx)}
                                  >
                                    <FaTimes />
                                  </a>
                                </>
                              ) : (
                                <>
                                  <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                    {akun?.find((e) => e?.id == d?.id)?.nama}
                                  </span>
                                  <a
                                    className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark"
                                    onClick={() => remove(idx)}
                                  >
                                    <FaTimes />
                                  </a>
                                </>
                              )}
                            </span>
                          );
                        }
                      })}
                    </>
                  )}

                  {/* IF ADA RUMUS */}
                  {/* <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                    <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                      Pendapatan
                    </span>
                    <a className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark">
                      <FaTimes />
                    </a>
                  </span>
                  <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                    <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                      <FaPlus />
                    </span>
                    <a className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark">
                      <FaTimes />
                    </a>
                  </span>
                  <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                    <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                      Beban
                    </span>
                    <a className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark">
                      <FaTimes />
                    </a>
                  </span>
                  <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                    <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                      <FaMinus />
                    </span>
                    <a className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark">
                      <FaTimes />
                    </a>
                  </span>
                  <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                    <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                      Pendapatan
                    </span>
                    <a className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark">
                      <FaTimes />
                    </a>
                  </span> */}
                </div>
              </div>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Kategori Laba Rugi</label>
                  <div
                    className="kategori-rumus-laba-rugi-wrap w-100 rounded-ss border border-light-secondary-ss py-2 overflow-auto"
                    style={{ maxHeight: "166px" }}
                  >
                    {formData?.nama == "KUMULATIF LABA (RUGI)" ||
                    formData?.kode == "00000" ? (
                      <>
                        {laba?.map((d) => {
                          return (
                            <a
                              className="kategori-rumus-laba-rugi-item px-3 py-1 d-flex align-items-center justify-content-between color-secondary fw-semibold"
                              onClick={() => {
                                tambahKategori(d?.id);
                              }}
                            >
                              <span className="fs-14-ss me-3">{d?.nama}</span>
                              <span className="fs-14-ss kategori-rumus-laba-rugi-plus color-primary">
                                <FaPlus />
                              </span>
                            </a>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {akun?.map((d) => {
                          return (
                            <a
                              className="kategori-rumus-laba-rugi-item px-3 py-1 d-flex align-items-center justify-content-between color-secondary fw-semibold"
                              onClick={() => {
                                tambahKategori(d?.id);
                              }}
                            >
                              <span className="fs-14-ss me-3">{d?.nama}</span>
                              <span className="fs-14-ss kategori-rumus-laba-rugi-plus color-primary">
                                <FaPlus />
                              </span>
                            </a>
                          );
                        })}
                      </>
                    )}
                    {/* <a className="kategori-rumus-laba-rugi-item px-3 py-1 d-flex align-items-center justify-content-between color-secondary fw-semibold">
                  <span className="fs-14-ss me-3">Beban</span>
                  <span className="fs-14-ss kategori-rumus-laba-rugi-plus color-primary">
                  <FaPlus />
                  </span>
                </a> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="">
                    <label className="form-label">Operator Matematika</label>
                  </div>
                  <div className="row g-4">
                    <div className="col-sm-6">
                      <button
                        className="w-100 btn btn-ss btn-outline-primary btn-outline-primary-ss fs-3 rounded-ss fw-extrabold"
                        onClick={() => tambahOperator("plus")}
                      >
                        <FaPlus className="mb-1" />
                      </button>
                    </div>
                    <div className="col-sm-6">
                      <button
                        className="w-100 btn btn-ss btn-outline-primary btn-outline-primary-ss fs-3 rounded-ss fw-extrabold"
                        onClick={() => tambahOperator("minus")}
                      >
                        <FaMinus className="mb-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h6 className="fs-18-ss fw-bold color-dark mb-2">
                  Terhubung dengan Akun Rekening?
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
              {terhubungAkunRekening ? (
                <>
                  <div className="mb-4">
                    <label className="form-label">Nama Bank</label>
                    <Select
                      components={{ Option }}
                      options={bankData}
                      onChange={handleChangeSelect}
                      value={bankData?.filter(
                        (bank) => bank.value === formData.bank
                      )}
                      placeholder="Pilih bank"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Nomor Rekening</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan nomor rekening"
                      type="number"
                      name="norek"
                      value={formData.norek}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Saldo Saat Ini</label>
                    <div className="input-saldo-rekening">
                      <InputNumber
                        className="form-control w-100"
                        formatter={(value) =>
                          `Rp${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                        placeholder="Rp. 0"
                        autoComplete="off"
                        name="saldo"
                        value={formData.saldo}
                        parser={(value) => value.replace(/Rp|\./g, "")}
                        onChange={(value) =>
                          handleChangeForm({ target: { name: "saldo", value } })
                        }
                        step={1000}
                      />
                    </div>
                    {/* <input
              className="form-control"
              autoComplete="off"
              placeholder="Rp. 0"
              type="number"
              value={formData.saldo}
              name="saldo"
              onChange={handleChangeForm}
            /> */}
                  </div>
                </>
              ) : (
                ""
              )}
              {/* <div className="mb-4">
                <h6 className="fs-18-ss fw-bold color-dark mb-2">
                  Terhubung dengan Penyusutan?
                </h6>
                <div className="row">
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio position-absolute"
                      type="radio"
                      name="flexRadioDefaultPenyusutan"
                      id="radioPenyusutanYa"
                      style={{
                        top: "36%",
                        left: "2em",
                        // height: "20px",
                      }}
                      // name="terhungAkunRekening"
                      checked={terhubungPenyusutan}
                    />
                    <label
                      className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                      htmlFor="radioPenyusutanYa"
                      onClick={() => handleChangePenyusutan(true)}
                    >
                      <span className="ms-4 ps-2">Ya</span>
                    </label>
                  </div>
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                      type="radio"
                      name="flexRadioDefaultPenyusutan"
                      id="radiopenyusutanTidak"
                      style={{
                        top: "36%",
                        left: "2em",
                        // height: "20px",
                      }}
                      checked={!terhubungPenyusutan}
                    />
                    <label
                      className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3 pointer"
                      htmlFor="radiopenyusutanTidak"
                      onClick={() => handleChangePenyusutan(false)}
                    >
                      <span className="ms-4 ps-2">Tidak</span>
                    </label>
                  </div>
                </div>
              </div> */}
              {terhubungPenyusutan ? (
                <>
                  <div className="mb-4">
                    <label className="form-label">Nama Transaksi</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Tuliskan nama transkasi"
                      type="text"
                      name="nama_penyusutan"
                      value={
                        formData.nama_penyusutan || editData?.penyusutan?.nama
                      }
                      maxLength={255}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Rumus per Tahun</label>
                    <div className="w-100 rounded-ss border border-light-secondary-ss px-2 d-flex align-items-center flex-wrap">
                      {/* IF TIDAK ADA RUMUS */}
                      {!currentRumus?.length ? (
                        <h6 className="color-secondary my-2 fs-14-ss px-1 fw-semibold">
                          Buat Rumus Dengan{" "}
                          <span className="color-dark fw-extrabold">
                            Memilih Daftar Akun
                          </span>{" "}
                          dan Menggunakan{" "}
                          <span className="color-dark fw-extrabold">
                            Operator Matematika
                          </span>
                        </h6>
                      ) : (
                        <>
                          {formData?.nama == "MODAL" ? (
                            <>
                              <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                                <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                  TOTAL AKTIVA
                                </span>
                              </span>
                              <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                                <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                  <FaMinus />
                                </span>
                              </span>
                            </>
                          ) : (
                            <div className=""></div>
                          )}
                          {currentRumus?.map((d, idx) => {
                            if (d?.operator) {
                              return (
                                <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                                  <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                    {d?.operator == "plus" ? (
                                      <FaPlus />
                                    ) : d?.operator == "minus" ? (
                                      <FaMinus />
                                    ) : d?.operator == "time" ? (
                                      <FaTimes />
                                    ) : d?.operator == "divide" ? (
                                      <FaDivide />
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                  <a
                                    className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark"
                                    onClick={() => remove(idx)}
                                  >
                                    <FaTimes />
                                  </a>
                                </span>
                              );
                            }
                            if (d?.angka) {
                              return (
                                <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                                  <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                    {/* {d?.operator == "divide" ? (
                                      <FaDivide />
                                    ) : d?.angka == "1" ? (
                                      "1"
                                    ) : d?.angka == "2" ? (
                                      "2"
                                    ) : d?.angka == "3" ? (
                                      "3"
                                    ) : d?.angka == "4" ? (
                                      "4"
                                    ) : d?.angka == "5" ? (
                                      "5"
                                    ) : d?.angka == "6" ? (
                                      "6"
                                    ) : d?.angka == "7" ? (
                                      "7"
                                    ) : d?.angka == "8" ? (
                                      "8"
                                    ) : d?.angka == "9" ? (
                                      "9"
                                    ) : d?.angka == "0" ? (
                                      "0"
                                    ) : (d?.angka == "1" + d?.angka) == "0" ? (
                                      "10"
                                    ) : (
                                      ""
                                    )} */}
                                    {d?.angka}
                                  </span>
                                  <a
                                    className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark"
                                    onClick={() => remove(idx)}
                                  >
                                    <FaTimes />
                                  </a>
                                </span>
                              );
                            } else {
                              return (
                                <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                                  {formData?.nama == "MODAL" ||
                                  formData?.nama == "LABA DITAHAN" ? (
                                    <>
                                      <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                        {
                                          laba?.find((e) => e?.id == d?.id)
                                            ?.nama
                                        }
                                      </span>
                                      <a
                                        className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark"
                                        onClick={() => remove(idx)}
                                      >
                                        <FaTimes />
                                      </a>
                                    </>
                                  ) : (
                                    <>
                                      <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                                        {
                                          akun?.find((e) => e?.id == d?.id)
                                            ?.nama
                                        }
                                      </span>
                                      <a
                                        className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark"
                                        onClick={() => remove(idx)}
                                      >
                                        <FaTimes />
                                      </a>
                                    </>
                                  )}
                                </span>
                              );
                            }
                          })}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Daftar Akun</label>
                    <div
                      className="kategori-rumus-laba-rugi-wrap w-100 rounded-ss border border-light-secondary-ss py-2 overflow-auto"
                      style={{ maxHeight: "166px" }}
                    >
                      {formData?.nama == "MODAL" ||
                      formData?.nama == "LABA DITAHAN" ? (
                        <>
                          {laba?.map((d) => {
                            return (
                              <a
                                className="kategori-rumus-laba-rugi-item px-3 py-1 d-flex align-items-center justify-content-between color-secondary fw-semibold"
                                onClick={() => {
                                  tambahKategori(d?.id);
                                }}
                              >
                                <span className="fs-14-ss me-3">
                                  {d?.kode} - {d?.nama}
                                </span>
                                <span className="fs-14-ss kategori-rumus-laba-rugi-plus color-primary">
                                  <FaPlus />
                                </span>
                              </a>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          {akun?.map((d) => {
                            return (
                              <a
                                className="kategori-rumus-laba-rugi-item px-3 py-1 d-flex align-items-center justify-content-between color-secondary fw-semibold"
                                onClick={() => {
                                  tambahKategori(d?.id);
                                }}
                              >
                                <span className="fs-14-ss me-3">
                                  {d?.kode} - {d?.nama}
                                </span>
                                <span className="fs-14-ss kategori-rumus-laba-rugi-plus color-primary">
                                  <FaPlus />
                                </span>
                              </a>
                            );
                          })}
                        </>
                      )}
                      {/* <a className="kategori-rumus-laba-rugi-item px-3 py-1 d-flex align-items-center justify-content-between color-secondary fw-semibold">
                  <span className="fs-14-ss me-3">Beban</span>
                  <span className="fs-14-ss kategori-rumus-laba-rugi-plus color-primary">
                  <FaPlus />
                  </span>
                </a> */}
                    </div>
                  </div>
                  <div className="col-md-12 mb-4">
                    <div className="">
                      <label className="form-label">Operator Matematika</label>
                    </div>
                    <div className="row g-4">
                      <div className="row my-4">
                        <div className="col-md-12">
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("1")}
                          >
                            1
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("2")}
                          >
                            2
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("3")}
                          >
                            3
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("4")}
                          >
                            4
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("5")}
                          >
                            5
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-primary btn-primary-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahOperator("plus")}
                          >
                            <FaPlus className="mb-1" />
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-primary btn-primary-ss fs-3 rounded-ss fw-extrabold"
                            onClick={() => tambahOperator("minus")}
                          >
                            <FaMinus className="mb-1" />
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        {" "}
                        <div className="col-md-12">
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("6")}
                          >
                            6
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("7")}
                          >
                            7
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("8")}
                          >
                            8
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("9")}
                          >
                            9
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-secondary btn-secondary-operator-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahAngka("0")}
                          >
                            0
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-primary btn-primary-ss fs-3 rounded-ss fw-extrabold me-3"
                            onClick={() => tambahOperator("time")}
                          >
                            <FaTimes className="mb-1" />
                          </button>
                          <button
                            className="w-80 btn btn-ss btn-primary btn-primary-ss fs-3 rounded-ss fw-extrabold"
                            onClick={() => tambahOperator("divide")}
                          >
                            <FaDivide className="mb-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">
                      Akun Akumulasi Penyusutan
                    </label>
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <SelectShared
                          name="moda"
                          placeholder="Pilih akun"
                          handleChangeSelect={(e) =>
                            handleChangeSelectAkumulasi(e.value)
                          }
                          value={
                            formData?.m_keu_akun_akumulasi_id ||
                            editData?.penyusutan?.mKeuAkunAkumulasiId
                          }
                          options={akun?.map((d) => {
                            return {
                              value: d?.id,
                              label: `${d?.kode} - ${d?.nama}`,
                            };
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {/*  */}
            </>
          )}
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={editData ? _updateAkunSekolah : _postAkunSekolah}
          color={"primary"}
          idleText={`Simpan`}
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

export default ModalTambahAkunKeuangan;
