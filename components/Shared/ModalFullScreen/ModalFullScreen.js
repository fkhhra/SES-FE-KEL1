import { hideModal } from "utilities/ModalUtils";

const ModalFullScreen = ({
  title,
  content,
  children,
  modalId="",
  onSubmit=()=>{},
  btnPrimaryText="Submit",
  withFooter=true
}) => {
  return (
    <div
      className="modal modal-ss fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby={modalId}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header p-3">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="modal-title d-flex flex-column col-md-6 order-2 order-md-1">
                      {title}
                    </div>
                    <div className="order-1 order-md-2 d-flex d-md-inline justify-content-end m-md-0 m-2">
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => hideModal(modalId)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <div className="container">
              {content || children}
            </div>
          </div>
          { withFooter && (
            <div className="modal-footer d-flex justify-content-center">
              <div className="container">
                <div className="row ">
                  <div className="col-md-12 d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => hideModal(modalId)}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary ms-3"
                      onClick={onSubmit}
                    >
                      {btnPrimaryText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalFullScreen;