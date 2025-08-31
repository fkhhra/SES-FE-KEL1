import React from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import { TwitterPicker } from "react-color";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const ModalSaldoKasAkhir = ({
  _postRumusKasAkhir,
  formData,
  arus,
  setCurrentRumus,
  currentRumus,
}) => {
  const tambahOperator = (operator) => {
    const temp = currentRumus;
    if (temp?.length == 0) {
      toast.error("Rumus harus diawali dengan kategori");
    } else if (temp[temp?.length - 1]?.operator) {
      toast.error("Tidak dapat menggunakan 2 operator sekaligus");
    } else {
      temp.push({ operator });
    }
    setCurrentRumus([...temp]);
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
  return (
    <NewModal
      modalSize="md"
      modalId="modalSaldoKasAkhir"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {/* {formData?.idKategori ? "Edit" : "Buat"} */}
            Rumus Saldo Kas Akhir
          </h4>
        </>
      }
      content={
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
                  <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                    <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                      Saldo Kas Awal
                    </span>
                  </span>
                  <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                    <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                      <FaPlus />
                    </span>
                  </span>
                  {currentRumus?.map((d, idx) => {
                    if (d?.operator) {
                      return (
                        <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                          <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                            {d?.operator == "plus" ? <FaPlus /> : <FaMinus />}
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
                          <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                            {arus?.find((e) => e?.id == d?.id)?.nama}
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
                  })}
                </>
              )}

              {/* IF ADA RUMUS */}

              {/* <span className="d-flex align-items-center rumus-tag color-dark me-3 my-2">
                <span className="fs-12-ss py-1 px-3 rumus-tag-text fw-bold">
                  Kenaikan (Penurunan) Kas
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
                  Saldo Kas Akhir
                </span>
                <a className="fs-12-ss py-1 px-2 rumus-tag-times pointer color-dark">
                  <FaTimes />
                </a>
              </span> */}
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">Kategori Aktivitas</label>
              <div className="kategori-rumus-laba-rugi-wrap w-100 rounded-ss border border-light-secondary-ss py-2">
                {arus?.map((d) => {
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
                {/* <a className="kategori-rumus-laba-rugi-item px-3 py-1 d-flex align-items-center justify-content-between color-secondary fw-semibold">
                  <span className="fs-14-ss me-3">Saldo Kas Akhir</span>
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
          onClick={_postRumusKasAkhir}
        />
      }
    />
  );
};

export default ModalSaldoKasAkhir;
