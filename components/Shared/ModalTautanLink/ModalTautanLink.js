import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { hideModal } from "../../../utilities/ModalUtils";
import ReactDOM from "react-dom";
import dynamic from "next/dynamic";

const ModalTautanLink = ({
  modalId = "",
  getLink = () => {},
  name = "",
  toastMessage = "Data berhasil ditambahkan",
  defaultValue = "",
}) => {
  const [tautanLink, setTautanLink] = useState(defaultValue);

  const handlePostLink = (e) => {
    getLink(e, tautanLink);
    setTautanLink("");
    hideModal(modalId);
    toast.success(toastMessage);
  };

  useEffect(() => {
    setTautanLink(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className="modal modal-ss fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby={modalId}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title fw-extrabold">Tambah Link</h4>
            <button
              type="button"
              className="btn-close"
              onClick={() => hideModal(modalId)}
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <label className="form-label">Alamat Link</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Contoh:https://smarteschool.id"
                onChange={(e) => setTautanLink(e.target.value)}
                value={tautanLink}
              />
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <div className="row w-100">
              <div className="col-6 ps-0">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => hideModal(modalId)}
                  data-bs-dismiss="modal"
                >
                  Batal
                </button>
              </div>
              <div className="col-6 pe-0">
                <button
                  type="button"
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                  onClick={handlePostLink}
                  name={name}
                  disabled={tautanLink == ""}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalPortalTautanLink = props => {
  let sharedModal = document.querySelectorAll(
    `[id^="shared-modal-tautan-link"]`
  )[0];

  return ReactDOM.createPortal(
    <ModalTautanLink {...props} />,
    sharedModal
  );
};

export default dynamic(() => Promise.resolve(ModalPortalTautanLink), {
  ssr: false
});
