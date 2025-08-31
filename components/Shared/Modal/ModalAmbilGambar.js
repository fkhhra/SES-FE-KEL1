import React, { useEffect, useState } from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../NewModal/NewModal";
import Webcam from "react-webcam";
import { getFileUrlFromUri } from "utilities/HelperUtils";
import swal from "sweetalert";
import { hideModal } from "utilities/ModalUtils";

const videoConstraints = {
  width: "100%",
  height: "100%",
  facingMode: "user",
};

const ModalAmbilGambar = ({
  onClickPrimaryBtn,
  isReady,
  setIsReady,
  inputFileRef,
}) => {
  const [buttonState, setButtonState] = useState("idle");
  const [renderTombol, setRenderTombol] = useState(false);

  const webcamRef = React.useRef(null);

  const capture = async () => {
    setButtonState("loading");
    const imageSrc = webcamRef.current.getScreenshot();
    const fileUrl = await getFileUrlFromUri(imageSrc);
    onClickPrimaryBtn && onClickPrimaryBtn(fileUrl);
    setIsReady && setIsReady(false);
    setButtonState("success");
  };

  const onCloseModal = () => {
    setIsReady && setIsReady(false);
  };

  const onClickUpload = () => {
    hideModal("modalAmbilGambar");
    setIsReady && setIsReady(false);
    inputFileRef.current.click();
  };

  useEffect(() => {
    if (isReady) {
      setTimeout(() => {
        setRenderTombol(true);
      }, 5000);
      // setTimeout(() => {
      //   swal({
      //     title: "Kamera tidak tampil?",
      //     text: "Klik Cancel jika kamera sudah tampil sebelumnya",
      //     icon: "warning",
      //     buttons: true,
      //   }).then(async (ok) => {
      //     if (ok) {
      //       inputFileRef.current.click();
      //       onCloseModal();
      //       hideModal("modalAmbilGambar");
      //     }
      //   });
      // }, 5000);
    }
  }, [isReady]);

  return (
    <NewModal
      modalId="modalAmbilGambar"
      modalSize="lg"
      onCloseModal={onCloseModal}
      title={
        <>
          <h4 className="mb-1 fw-extrabold">Ambil Gambar</h4>
        </>
      }
      content={
        <>
          <div style={{ width: "100%", height: "460px" }}>
            {isReady && (
              <Webcam
                audio={false}
                height={"100%"}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={"100%"}
                videoConstraints={videoConstraints}
              />
            )}
            {renderTombol && (
              <p className="text-center color-secondary">
                Kamera tidak muncul? Klik{" "}
                <span
                  onClick={() => onClickUpload()}
                  className="color-primary pointer"
                >
                  disini
                </span>{" "}
                untuk mengupload file
              </p>
            )}
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={capture}
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

export default ModalAmbilGambar;
