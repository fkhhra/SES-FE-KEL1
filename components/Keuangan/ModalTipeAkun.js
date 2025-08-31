import React from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import { TwitterPicker } from "react-color";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import SelectShared from "components/Shared/SelectShared/SelectShared";

const ModalTipeAkun = ({
  formData,
  handleChangeForm,
  keuangan,
  tambahAkun,
  handleChangeSelect,
  _postKategori,
}) => {
  return (
    <NewModal
      modalId="modalTipeAkun"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {/* {formData?.idKategori ? "Edit" : "Buat"} */}
            Tipe Akun
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk{" "}
            {/* {formData?.idKategori ? "mengedit" : "membuat"} */}
            membuat tipe akun
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              placeholder="Masukkan Nama Tipe Akun"
              value={formData?.nama}
              name="nama"
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4 row">
            <div className="col-md-6">
              <label className="form-label">Lebih Besar Periode 2</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder=""
                value={formData?.periode2}
                name="periode2"
                onChange={handleChangeForm}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Lebih Besar Periode 1</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder=""
                value={formData?.periode1}
                name="periode1"
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label">Pengaturan</label>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="format"
                    id="kosong"
                    value={""}
                    onChange={(e) =>
                      handleChangeForm({
                        target: { name: "format", value: e.target.value },
                      })
                    }
                    checked={!formData?.format}
                  />
                  <label class="form-check-label" for="kosong">
                    default
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="format"
                    id="positif"
                    value={"positif"}
                    onChange={(e) =>
                      handleChangeForm({
                        target: { name: "format", value: e.target.value },
                      })
                    }
                    checked={formData?.format == "positif"}
                  />
                  <label class="form-check-label" for="positif">
                    Selalu Positif
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="format"
                    id="negatif"
                    value={"negatif"}
                    onChange={(e) =>
                      handleChangeForm({
                        target: { name: "format", value: e.target.value },
                      })
                    }
                    checked={formData?.format == "negatif"}
                  />
                  <label class="form-check-label" for="negatif">
                    Dibalik
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label">periode 2 = 0 ?</label>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="pilihanPeriode"
                    id="tampilkan"
                    value={"tampilkan"}
                    onChange={(e) =>
                      handleChangeForm({
                        target: {
                          name: "pilihanPeriode",
                          value: e.target.value,
                        },
                      })
                    }
                    checked={formData?.pilihanPeriode == "tampilkan"}
                  />
                  <label class="form-check-label" for="tampilkan">
                    Tampilkan
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="pilihanPeriode"
                    id="sembunyikan"
                    value={"sembunyikan"}
                    onChange={(e) =>
                      handleChangeForm({
                        target: {
                          name: "pilihanPeriode",
                          value: e.target.value,
                        },
                      })
                    }
                    checked={formData?.pilihanPeriode == "sembunyikan"}
                  />
                  <label class="form-check-label" for="sembunyikan">
                    Sembunyikan
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label">Rumus</label>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="rumus"
                    id="kosong"
                    value={""}
                    onChange={(e) =>
                      handleChangeForm({
                        target: { name: "rumus", value: e.target.value },
                      })
                    }
                    checked={!formData?.rumus}
                  />
                  <label class="form-check-label" for="kosong">
                    periode 2 - periode 1
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="rumus"
                    id="periode2"
                    value={"periode2"}
                    onChange={(e) =>
                      handleChangeForm({
                        target: { name: "rumus", value: e.target.value },
                      })
                    }
                    checked={formData?.rumus == "periode2"}
                  />
                  <label class="form-check-label" for="periode2">
                    Periode 2
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="rumus"
                    id="periode1"
                    value={"periode1"}
                    onChange={(e) =>
                      handleChangeForm({
                        target: { name: "rumus", value: e.target.value },
                      })
                    }
                    checked={formData?.rumus == "periode1"}
                  />
                  <label class="form-check-label" for="periode1">
                    Periode 1
                  </label>
                </div>
              </div>
            </div>
          </div>

          {formData?.akun?.length ? (
            <>
              {formData?.akun?.map((d, idx) => {
                if (idx == formData?.akun?.length - 1 && idx != 0) {
                  return (
                    <div className="mb-4">
                      <label className="form-label">Akun {idx + 1}</label>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <SelectShared
                            name="moda"
                            placeholder="Pilih akun"
                            handleChangeSelect={(e) =>
                              handleChangeSelect(idx, e.value)
                            }
                            value={d?.mKeuAkunId}
                            options={keuangan?.map((d) => {
                              return {
                                value: d?.id,
                                label: d?.nama,
                              };
                            })}
                          />
                        </div>
                        <button
                          className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() =>
                            handleChangeForm({
                              target: {
                                name: "akun",
                                value: formData?.akun?.slice(
                                  0,
                                  formData?.akun?.length - 1
                                ),
                              },
                            })
                          }
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="mb-4">
                    <label className="form-label">Akun {idx + 1}</label>
                    <SelectShared
                      name="moda"
                      placeholder="Pilih akun"
                      handleChangeSelect={(e) =>
                        handleChangeSelect(idx, e.value)
                      }
                      value={d?.mKeuAkunId}
                      options={keuangan?.map((d) => {
                        return {
                          value: d?.id,
                          label: d?.nama,
                        };
                      })}
                    />
                  </div>
                );
              })}
            </>
          ) : null}
          {/* <div className="mb-4">
            <label className="form-label">Akun 2</label>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <SelectShared
                  name="moda"
                  placeholder="Pilih akun"
                  //   handleChangeSelect={handleChangeSelect}
                  //   value={formData.moda}
                  options={keuangan?.map((d) => {
                    return {
                      value: d?.id,
                      label: d?.nama,
                    };
                  })}
                />
              </div>
              <button
                className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div> */}
          <button
            className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mb-4"
            onClick={() => {
              tambahAkun();
            }}
          >
            <FaPlus className="me-2" />
            Tambah Akun
          </button>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={formData?.btnBio}
          color={"primary"}
          idleText={"Simpan"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={_postKategori}
        />
      }
    />
  );
};

export default ModalTipeAkun;
