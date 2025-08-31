import React from "react";
import { Steps, Button, message } from "antd";
import { hideModal } from "../../../utilities/ModalUtils";

const { Step } = Steps;

const ModalStep = ({
  modalClass,
  button,
  title,
  current = 0,
  next,
  prev,
  modalId,
  steps,
  isNext,
  buttonSubmit,
  disabledSecondaryButton,
  isFullScreen,
  removeFooter = false,
  onClose,
  isModalSuratKeputusan,
  terpilih,
  customButton,
}) => {
  const _onClose = () => {
    onClose && onClose();
    hideModal(`${modalId}` || `exampleModal`);
  };

  return (
    <>
      {/* Button */}
      {button && button}
      {/* ModalStep */}
      <div
        className="modal modal-ss fade"
        id={`${modalId || `exampleModal`}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className={modalClass}>
          <div className="modal-content">
            <div className="modal-header">
              {isFullScreen ? (
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <div
                          className="modal-title fw-extrabold"
                          id="exampleModalLabel"
                        >
                          {title}
                        </div>
                        <button
                          type="button"
                          onClick={_onClose}
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {" "}
                  <div
                    className="modal-title fw-extrabold"
                    id="exampleModalLabel"
                  >
                    {title}
                  </div>
                  <button
                    type="button"
                    onClick={_onClose}
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </>
              )}
            </div>
            <div className="modal-body">
              {isFullScreen ? (
                <div className="container">
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <Steps current={current}>
                        {steps?.map((item, idx) => (
                          <Step
                            key={`${idx}-${new Date().getTime()}`}
                            title={item.title}
                          />
                        ))}
                      </Steps>
                    </div>
                  </div>
                  <div className="steps-content">
                    {steps?.[current]?.content}
                  </div>
                </div>
              ) : (
                <>
                  {" "}
                  <Steps current={current}>
                    {steps?.map((item, idx) => (
                      <Step
                        key={`${idx}-${new Date().getTime()}`}
                        title={item.title}
                      />
                    ))}
                  </Steps>
                  <div className="steps-content">
                    {steps?.[current]?.content}
                  </div>
                </>
              )}
            </div>
            {!removeFooter && (
              <div
                className={`modal-footer ${
                  isFullScreen ? "d-flex justify-content-center" : ""
                } ${isModalSuratKeputusan ? "justify-content-between" : ""}`}
              >
                {isFullScreen ? (
                  <div className="container">
                    <div className="row ">
                      <div className="col-md-12 d-flex justify-content-end">
                        <div className="steps-action">
                          {current > 0 && (
                            <button
                              className="btn btn-secondary me-3"
                              onClick={() => prev()}
                              disabled={disabledSecondaryButton}
                            >
                              Sebelumnya
                            </button>
                          )}
                          {isNext == true && current < steps.length - 1 && (
                            <>
                              {customButton ? (
                                customButton
                              ) : (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => next()}
                                >
                                  Selanjutnya
                                </button>
                              )}
                            </>
                          )}
                          {current === steps.length - 1 && buttonSubmit}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-end w-100">
                    {isModalSuratKeputusan && current > 0 ? (
                      <div className="rounded-pill bg-light-primary color-primary fw-bold px-4 py-2 mb-lg-0 me-sm-auto mb-sm-0 mb-3">
                        {`${terpilih} Terpilih`}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="steps-action">
                      {current > 0 && (
                        <button
                          className="btn btn-secondary me-3"
                          onClick={() => prev()}
                          disabled={disabledSecondaryButton}
                        >
                          Sebelumnya
                        </button>
                      )}
                      {isNext == true && current < steps.length - 1 && (
                        <button
                          className="btn btn-primary"
                          onClick={() => next()}
                        >
                          Selanjutnya
                        </button>
                      )}
                      {current === steps.length - 1 && buttonSubmit}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalStep;
