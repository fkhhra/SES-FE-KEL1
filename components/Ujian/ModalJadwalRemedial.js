import { Avatar, DatePicker, InputNumber, TimePicker } from "antd";
import {
  editTemplateKesukaran,
  postTemplateKesukaran,
} from "client/AnalisisSoalClient";
import InputJumlahSoal from "components/JadwalUjian/InputJumlahSoal";
import ModalStep from "components/Shared/ModalStep/ModalStep";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";
import moment from "moment";
require("moment/locale/id");
moment.locale("id");
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFilter, FaLink, FaSearch, FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";

const ModalJadwalRemedial = ({
  sekolah,
  user,
  rombel,
  ujianTerpilih,
  formData,
  setFormData,
  editId,
  handlePostUjianData,
}) => {
  const [collapseOpen, setcollapseOpen] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const [current, setCurrent] = useState(0);

  const next = () => {
    // if (!formData.mUjianId) {
    //   toast.error("Anda belum memilih daftar ujian");
    //   return;
    // } else if (!formData.kkm) {
    //   toast.error("Anda belum memasukkan kkm ujian");
    //   return;
    // }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [];

  return (
    <>
      <ModalStep
        modalClass="modal-dialog modal-fullscreen"
        buttonSubmit={
          <ReactiveButton
            // buttonState={buttonState}
            color={"primary"}
            idleText={"Buat Jadwal Remedial"}
            // idleText={editId ? "Edit Jadwal Ujian" : "Buat Jadwal Ujian"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={handlePostUjianData}
          />
        }
        isNext={true}
        modalId="modalJadwalRemedial"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {editId ? "Edit" : "Buat"} Jadwal Remedial
            </h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk membuat jadwal remedial
            </span>
          </>
        }
        current={current}
        next={next}
        prev={prev}
        removeFooter={
          sekolah?.trial &&
          moment(sekolah?.createdAt).format("YYYY-MM-DD") <
            moment("2021-09-01 00:00:00").format("YYYY-MM-DD") &&
          total >= 3
        }
        steps={
          sekolah?.trial &&
          moment(sekolah?.createdAt).format("YYYY-MM-DD") <
            moment("2021-09-01 00:00:00").format("YYYY-MM-DD") &&
          total >= 3
            ? [
                {
                  title: "Anda hanya memiliki limit 3 jadwal ujian",
                  content: (
                    <div className="row justify-content-center my-4">
                      <div className="col-sm-6 col-8">
                        <img
                          src="/img/smarteschool-illustration.png"
                          alt="empty-state"
                          className="img-fluid mb-2"
                        />
                      </div>
                      <div className="col-12 text-center">
                        <h5 className="color-dark fw-black">
                          {user?.role == "siswa"
                            ? "Anda hanya memiliki limit 3 jadwal ujian"
                            : "Anda hanya memiliki limit 3 jadwal ujian"}
                        </h5>
                        {user?.role != "siswa" && (
                          <>
                            <p className="fw-bold fs-14-ss">
                              Silahkan{" "}
                              <a
                                className="text-decoration-none color-primary"
                                onClick={() =>
                                  window.open(
                                    `https://wa.me/6287889192581?text=Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool`
                                  )
                                }
                              >
                                {" "}
                                Hubungi CS
                              </a>{" "}
                              Smarteschool
                            </p>
                            <WhatsappLink
                              phoneNumber="087889192581"
                              text="Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool"
                            >
                              <button className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold">
                                Hubungi CS
                              </button>
                            </WhatsappLink>
                          </>
                        )}
                      </div>
                    </div>
                  ),
                },
              ]
            : [
                {
                  title: "Pilih Bank Soal",
                  content: (
                    <div className="container">
                        <div className="card card-ss p-4">
                        {/* <> */}
                      <div className="mt-4 mb-3">
                        <label className="form-label">Bank Soal</label>
                        <SelectShared
                          name="mUjianId"
                          placeholder="Pilih bank soal yang akan diujikan"
                          //   handleChangeSelect={(e, name) => {
                          //     setFormData({
                          //       ...formData,
                          //       [name]: e.value,
                          //       namaUjian: e?.label,
                          //     });
                          //   }}
                          //   value={formData.mUjianId}
                          //   options={ujian?.map((data) => {
                          //     return { label: data?.nama, value: data?.id };
                          //   })}
                        />
                        {/* <select
                        className="form-select"
                        aria-label="Default select example"
                        placeholder="Pilih bank soal yang akan diujikan"
                        name="mUjianId"
                        onChange={(e) => {
                          setTipeUjian(
                            ujian?.filter(
                              (data) => data.id === parseInt(e.target.value)
                            )?.[0]?.tipe
                          );
                          handleChangeForm(e, null, null, true);
                        }}
                        value={formData?.mUjianId}
                      >
                        <option hidden>
                          Pilih bank soal yang akan diujikan{" "}
                        </option>
                        {ujian?.map((data) => (
                          <option value={data?.id}>{data?.nama}</option>
                        ))}
                      </select> */}
                      </div>
                      <div className="row mb-3">
                        {
                          // tipeUjian !== "literasi" &&
                          // tipeUjian !== "numerasi"
                          1 ? (
                            <>
                              <div className="col-md-6 mb-md-0 mb-3">
                                <label className="form-label">
                                  Jumlah Soal PG{" "}
                                </label>
                                <InputJumlahSoal
                                  //   handleChangeForm={handleChangeForm}
                                  //   value={formData?.jumlahPg}
                                  //   maks={maksPg}
                                  name={"jumlahPg"}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">
                                  Jumlah Soal Esai
                                </label>
                                <InputJumlahSoal
                                  //   handleChangeForm={handleChangeForm}
                                  //   value={formData?.jumlahEsai}
                                  //   maks={maksEsai}
                                  name={"jumlahEsai"}
                                />
                              </div>
                              {ujianTerpilih?.tipe == "literasi" ||
                              ujianTerpilih?.tipe == "numerasi" ? (
                                <>
                                  <div className="col-md-6">
                                    <label className="form-label">
                                      Jumlah Soal PG Kompleks
                                    </label>
                                    <InputJumlahSoal
                                      //   handleChangeForm={handleChangeForm}
                                      //   value={formData?.jumlahPgKompleks}
                                      //   maks={maksPgKompleks}
                                      name={"jumlahPgKompleks"}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label className="form-label">
                                      Jumlah Soal Uraian
                                    </label>
                                    <InputJumlahSoal
                                      //   handleChangeForm={handleChangeForm}
                                      //   value={formData?.jumlahUraian}
                                      //   maks={maksUraian}
                                      name={"jumlahUraian"}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label className="form-label">
                                      Jumlah Soal Menjodohkan
                                    </label>
                                    <InputJumlahSoal
                                      //   handleChangeForm={handleChangeForm}
                                      //   value={formData?.jumlahMenjodohkan}
                                      //   maks={maksMenjodohkan}
                                      name={"jumlahMenjodohkan"}
                                    />
                                  </div>
                                </>
                              ) : null}
                            </>
                          ) : (
                            <div className="col-md-6 mb-md-0 mb-3">
                              <label className="form-label">
                                Jumlah Soal AKM
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                autoComplete="off"
                                placeholder="0 Soal"
                                name="jumlahSoalAkm"
                                // value={formData?.jumlahSoalAkm}
                                // onChange={(e) =>
                                //   handleChangeForm(e, null, null, true)
                                // }
                              />
                            </div>
                          )
                        }
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Jumlah Semua </label>
                        <input
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          placeholder="0 Soal"
                          readOnly
                          //   value={
                          //     formData?.jumlahPg +
                          //     formData?.jumlahEsai +
                          //     formData?.jumlahUraian +
                          //     formData?.jumlahPgKompleks +
                          //     formData?.jumlahMenjodohkan
                          //   }
                        />
                      </div>
                      <div className="mb-3">
                        <h6 className="fs-18-ss fw-bold color-dark mb-3">
                          Acak Soal
                        </h6>
                        <div className="row">
                          <div className="form-check-ss col-md-6 position-relative">
                            <input
                              className="form-check-input form-check-radio position-absolute"
                              type="radio"
                              id="radioYa"
                              style={{
                                top: "36%",
                                left: "2em",
                                // height: "20px",
                              }}
                              name="diacak"
                              value={1}
                              //   checked={formData?.diacak === 1}
                              //   onChange={(e) =>
                              //     handleChangeForm(e, null, null, true)
                              //   }
                            />
                            <label
                              className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                              htmlFor="radioYa"
                            >
                              <span className="ms-4 ps-2">Ya</span>
                            </label>
                          </div>
                          <div className="form-check-ss col-md-6 position-relative">
                            <input
                              className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                              type="radio"
                              id="radioTidak"
                              style={{
                                top: "36%",
                                left: "2em",
                                // height: "20px",
                              }}
                              name="diacak"
                              value={0}
                              //   checked={formData?.diacak === 0}
                              //   onChange={(e) =>
                              //     handleChangeForm(e, null, null, true)
                              //   }
                            />
                            <label
                              className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                              htmlFor="radioTidak"
                            >
                              <span className="ms-4 ps-2">Tidak</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">KKM </label>
                        <input
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          placeholder="0"
                          name="kkm"
                          //   value={formData?.kkm}
                          //   onChange={(e) =>
                          //     handleChangeForm(e, null, null, true)
                          //   }
                        />
                      </div>
                    {/* </> */}
                        </div>
                    </div>
                 
                  ),
                },
                {
                  title: "Atur Waktu Ujian",
                  content: (
                    <div className="container">
                        <div className="card card-ss p-4">
                        {/* <> */}
                      <div className="mt-4 mb-3">
                        <label
                          htmlFor="example-date-input"
                          className="form-label"
                        >
                          Tanggal
                        </label>
                        <DatePicker
                          className="form-control"
                          autoComplete="off"
                          //   onChange={(date, dateString) =>
                          //     handleChangeForm(dateString, "date", "tanggal")
                          //   }
                          placeholder="dd / mm / yyyy"
                          //   value={formData?.tanggal}
                        />
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-md-0 mb-3">
                          <label className="form-label">Waktu Dibuka </label>
                          <TimePicker
                            className="form-control"
                            autoComplete="off"
                            format="HH:mm"
                            // onChange={(date, dateString) =>
                            //   handleChangeForm(dateString, "time", "waktu")
                            // }
                            // value={formData?.waktu}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Durasi</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Masukkan waktu dalam menit"
                            name="durasi"
                            // value={formData?.durasi}
                            // onChange={(e) =>
                            //   handleChangeForm(e, null, null, true)
                            // }
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
                          <label className="form-label mb-0">
                            Link Google Meet
                          </label>
                          <a
                            href="https://meet.google.com/"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="py-1 px-3 bg-soft-primary rounded-pill fs-12-ss color-primary text-decoration-none fw-semibold"
                          >
                            <FaLink className="me-2" />
                            Ambil Link Google Meet
                          </a>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          id="exampleFormControlInput1"
                          placeholder="Tempel link Google Meet disini"
                          name="gmeet"
                          //   value={formData?.gmeet}
                          //   onChange={handleChangeForm}
                        />
                      </div>
                    {/* </> */}
                        </div>
                    </div>
                 
                  ),
                },
                {
                  title: "Atur Pembagian",
                  content: (
                    <div className="container">
                      <div className="row">
                        <div className="col-md-5">
                          <div
                            className="card card-ss p-4"
                            style={{ minHeight: "calc(100vh - 213px)" }}
                          >
                            <h4 className="fw-extrabold color-dark mb-4">
                             Siswa Terpilih
                            </h4>
                            <h5 className="fs-18-ss fw-bold color-dark mb-4">
                              {/* {dipilih?.length}  */}0 Siswa Terpilih
                            </h5>
                            <ul className="list-group list-group-flush">
                              {/* {dipilih?.map((d) => {
                                return ( */}
                              <li className="list-group-item py-3 px-0">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex">
                                    <Avatar name=
                                    // {d?.nama}
                                    "Ihsan Nur"
                                     size={45} />
                                    <div className="ms-4">
                                      <h6 className="mb-0 fw-bold color-dark">
                                        {/* {d?.nama} */}
                                        Ihsan
                                      </h6>
                                      <span className="fs-12-ss fw-semibold mb-0">
                                        {/* {d?.anggotaRombel?.rombel?.nama} */}
                                        XII SIJA 1
                                      </span>
                                    </div>
                                  </div>
                                  <button className="btn ps-4 pe-0">
                                    <FaTimes
                                    //   onClick={() =>
                                    //     setDipilih([
                                    //       ...dipilih.filter(
                                    //         (e) => e?.id != d.id
                                    //       ),
                                    //     ])
                                    //   }
                                      style={{ color: "#e1e1e7" }}
                                      className="fs-4"
                                    />
                                  </button>
                                </div>
                              </li>
                              {/* ); })} */}
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <div
                            className="card card-ss p-4"
                            style={{ minHeight: "calc(100vh - 213px)" }}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-4">
                              <h4 className="fw-extrabold color-dark">
                                Cari Siswa
                              </h4>
                            </div>
                              <div className="row">
                              <div className="col-md-6">
                                  <div className="mb-4">
                                    <div className="select-kelas-jadwal-mengajar">
                                      <SelectShared
                                        name="kelas"
                                        // handleChangeSelect={(e, name) =>
                                        //   setFormData({
                                        //     ...formData,
                                        //     rombelId: e?.value,
                                        //   })
                                        // }
                                        // value={formData.rombelId}
                                        // options={rombel
                                        //   ?.filter(
                                        //     (d) =>
                                        //       !formData.jurusanId ||
                                        //       d?.mJurusanId ==
                                        //         formData.jurusanId
                                        //   )
                                        //   ?.map((d) => {
                                        //     return {
                                        //       label: d?.nama,
                                        //       value: d?.id,
                                        //     };
                                        //   })}
                                        placeholder="Pilih kelas"
                                        isClearable
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                <div className="mb-4">
                                <div className="position-relative w-100 mb-4">
                              <input
                                type="text"
                                className="form-control fw-semibold border-secondary-ss w-100 ps-4"
                                style={{
                                  width: "100%",
                                  paddingRight: "60px",
                                }}
                                id="exampleFormControlInput1"
                                placeholder="Cari siswa"
                                autoComplete="off"
                                // value={searchSiswa}
                                // onChange={(e) => setSearchSiswa(e.target.value)}
                              />
                              <FaSearch
                                className="position-absolute"
                                style={{
                                  right: "24px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                }}
                              />
                            </div>
                            </div>
                                </div>
                                
                              </div>
                            {/* {anggota?.map((item) => {
                              const d = item?.obj || item;
                              return ( */}
                                <div className="kuis-component form-check-ss position-relative mb-2">
                                  <input
                                    className="form-check-input form-check-ambil-soal position-absolute pointer"
                                    type="checkbox"
                                    style={{
                                      transform: "translateY(-50%)",
                                      top: "50%",
                                      right: "1em",
                                      width: "24px",
                                      height: "24px",
                                    }}
                                    // checked={dipilih?.find(
                                    //   (e) => e?.id == d?.id
                                    // )}
                                    // onChange={(e) => {
                                    //   const temp = dipilih;
                                    //   const check = dipilih?.findIndex(
                                    //     (e) => e?.id == d?.id
                                    //   );
                                    //   if (check >= 0) {
                                    //     temp.splice(check, 1);
                                    //   } else {
                                    //     temp.push(d);
                                    //   }

                                    //   setDipilih([...temp]);
                                    // }}
                                  />
                                  <div className="kuis-card form-check-label rounded-ss border border-secondary border-light-secondary-ss p-3 ">
                                    <div className="d-flex flex-grow-1 pe-5">
                                      <Avatar name=
                                    //   {d?.nama}
                                      "Ihsan Nur"
                                       size={45} />
                                      <div className="ms-4">
                                        <h6 className="mb-0 fw-bold color-dark">
                                          {/* {d?.nama} */}
                                          Ihsan Nur
                                        </h6>
                                        <span className="fs-12-ss fw-semibold mb-0">
                                          {/* {d?.anggotaRombel?.rombel?.nama} */}
                                          XII SIJA 1
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              {/* );
                            // })} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]
        }
      />
    </>
  );
};

export default ModalJadwalRemedial;
