import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import SelectShared from "../Shared/SelectShared/SelectShared";
import TeknikKeterampilanData from "../../data/teknikketerampilan.json";

import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import Avatar from "components/Shared/Avatar/Avatar";

const ModalPenerimaSuratKeputusan = ({
  users
}) => {
  return (
    <>
      <NewModal
        removeFooter
        modalId="modalPenerimaSuratKeputusan"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Penerima Surat Keputusan</h4>
            <span className="fs-6 fw-normal">
              {`${users?.length} Peserta`}
            </span>
          </>
        }
        content={
          <>
            <ul className="list-group list-group-flush">
              { users?.map(user => (
                <li className="list-group-item py-3" key={"2"}>
                  <div className="d-flex justify-content-between flex-sm-row flex-column">
                    <div className="d-flex align-items-center">
                      <Avatar
                        name={user?.user?.nama}
                        //   src={""}
                        size={45}
                      />
                      <h6 className="ms-3 mb-0 fw-semibold">
                        {user?.user?.nama}
                      </h6>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        }
        // submitButton={
        //   <ReactiveButton
        //     // buttonState={formData.btnBio}
        //     color={"primary"}
        //     idleText={"Simpan"}
        //     loadingText={"Diproses"}
        //     successText={"Berhasil"}
        //     errorText={"Gagal"}
        //     type={"button"}
        //     data-bs-dismiss="modal"
        //     className={"btn btn-primary"}
        //     // onClick={() => _postRekap()}
        //   />
        // }
      />
    </>
  );
};

export default ModalPenerimaSuratKeputusan;
