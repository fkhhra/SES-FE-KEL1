import React, { useEffect, useState } from "react";
import { InputNumber, Modal, notification } from "antd";
// import { postProyek, putProyek } from "../client/ProyekClient";
import { DatePicker } from "antd";
import moment from "moment";
import Select from "react-select";
import ReactTextareaAutosize from "react-textarea-autosize";
// import { postKeuangan, putKeuangan } from "../client/KeuanganClient";
// const moment = require("moment");
// import { handlingError } from "../utilities/notification";
// require("moment/locale/id");
// moment.locale("id");
import swal from "sweetalert";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { gantiTaUser } from "client/UserClient";
import NewModal from "components/Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";

const ModalUbahDataDashboard = ({
  router,
  setModalUbahDataDashboard,
  modalUbahDataDashboard,
  getData,
  sekolahId,
  setSekolahId,
  editData,
  _getKeuangan,
  proyek,
  initialFormData,
  semuaTA,
  dataTA,
}) => {
  const [dataset, setDataset] = useState([]);
  const [tahunAjaran, setTahunAjaran] = useState();
  const [buttonState, setButtonState] = useState("idle");

  // const _getTahunAjaran = async () => {
  //   const { data } = await getTahunAjaran({
  //     sekolahId: sekolahId,
  //   });
  //   if (data) {
  //     setDataset(data);
  //   }
  // };
  // console.log(dataset);

  const handleClickSwal = () => {
    swal({
      title: "Yakin Mengubah Data",
      text: "Data akan berubah sesuai tahun yang Anda pilih.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await gantiTaUser({ m_ta_id: tahunAjaran });
        if (data) {
          hideModal("modalUbahDataTahun");
          getData();
        }
      }
      // else {
      //   swal("Your imaginary file is safe!");
      // }
    });
  };

  const handlesubmit = async () => {
    console.log(tahunAjaran);
    const { data } = await gantiTaUser({ m_ta_id: tahunAjaran });
    if (data) {
      setModalUbahDataDashboard(false);
      getData();
    }
    // _getDashboard(tahunAjaran);
    // router.push(`?sekolah_id=${sekolahId}&tahun_ajaran_id=${tahunAjaran}`);
  };

  const handlecancel = () => {
    setModalUbahDataDashboard(false);
  };

  useEffect(() => {
    setTahunAjaran(dataTA?.id);
  }, [dataTA]);

  return (
    <NewModal
      modalId="modalUbahDataTahun"
      modalSize="md"
      isScrollable={false}
      title={
        <>
          <h4 className="mb-1 fw-extrabold">Ubah Tahun Akademik</h4>
          {/* <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {editData ? "mengubah" : "menambahkan"}{" "}
            Praktik Kerja Lapangan
          </span> */}
        </>
      }
      content={
        <>
          <SelectShared
            // value={sort?.label}
            isClearable
            className=" me-md-4 me-0 mb-md-0 mb-2 w-100"
            placeholder="Pilih Data Tahun"
            name="sort"
            // style={{ padding: "8px 24px" }}
            options={semuaTA?.map((d) => {
              return {
                label: `${d?.tahun} - ${d?.semester} ${
                  d?.aktif ? `( Aktif )` : ""
                }`,
                value: d?.id,
              };
            })}
            handleChangeSelect={(e, name) => {
              // console.log(e?.value);
              setTahunAjaran(e?.value);
              // setFormData({
              //   ...formData,
              //   sekolah_id: e?.value,
              // });
              // router.push(`? sekolah_id = ${sekolahId} & tahun_ajaran_id= ${tahunAjaran}`)
            }}
            // {changeRombel}
            value={tahunAjaran || ""}
          />
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={handleClickSwal}
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
    // <Modal
    //   className="card card-ss"
    //   style={{ borderRadius: "14px" }}
    //   title={
    //     <>
    //       <h5
    //         className="fw-bold color-primary modal-title text-neutral-100"
    //         style={{ fontFamily: "montserrat, sans-serif" }}
    //         id="exampleModalLabel"
    //       >
    //         Ubah Tahun Akademik
    //       </h5>
    //     </>
    //   }
    //   centered
    //   visible={modalUbahDataDashboard}
    //   onOk={() => {
    //     handleClickSwal();
    //   }}
    //   onCancel={() => setModalUbahDataDashboard(false)}
    //   width={700}
    //   footer={null}
    //   okText="Simpan"
    //   cancelText="Batal"
    // >
    //   <div className="my-2 ">
    //     <label
    //       for="tahun"
    //       className="form-label color-primary fs-12 text-neutral-80 algin-right text-left"
    //     >
    //       Tahun Akademik
    //     </label>
    //     <div className="select-filter">
    //       <SelectShared
    //         // value={sort?.label}
    //         isClearable
    //         className=" me-md-4 me-0 mb-md-0 mb-2 w-100"
    //         placeholder="Pilih Data Tahun"
    //         name="sort"
    //         // style={{ padding: "8px 24px" }}
    //         options={semuaTA?.map((d) => {
    //           return {
    //             label: `${d?.tahun} - ${d?.semester}`,
    //             value: d?.id,
    //           };
    //         })}
    //         handleChangeSelect={(e, name) => {
    //           // console.log(e?.value);
    //           setTahunAjaran(e?.value);
    //           // setFormData({
    //           //   ...formData,
    //           //   sekolah_id: e?.value,
    //           // });
    //           // router.push(`? sekolah_id = ${sekolahId} & tahun_ajaran_id= ${tahunAjaran}`)
    //         }}
    //         // {changeRombel}
    //         value={tahunAjaran || ""}
    //       />
    //       <div className="d-flex align-items-center justify-content-end my-4">
    //         <button
    //           className="btn btn-white btn-outline-secondary me-4"
    //           onClick={handlecancel}
    //         >
    //           Batal
    //         </button>
    //         <button className="btn btn-primary-ss" onClick={handlesubmit}>
    //           Simpan
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </Modal>
  );
};

export default ModalUbahDataDashboard;
