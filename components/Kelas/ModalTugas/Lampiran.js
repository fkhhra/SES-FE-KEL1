import Tabs from "../../Shared/Tabs/Tabs";
import { FaLink, FaPaperclip, FaTimes } from "react-icons/fa";
import InputFile from "../../Shared/InputFile/InputFile";
import ModalTautanLink from "../../Shared/ModalTautanLink/ModalTautanLink";
import useBuatTugas from "../../../hooks/useBuatTugas";

const Lampiran = () => {
  const { stateBuatTugas, changeStateBuatTugas } = useBuatTugas();

  const navItemsModalTugas = [
    {
      id: "file-unggahan",
      nav: "Unggah File",
      active: true,
      content:
        stateBuatTugas?.lampiran?.length > 0 &&
        stateBuatTugas?.lampiran?.map((dt, index) => (
          <div className="mt-3" key={`${index}-${new Date().getTime()}`}>
            <div className="card-lampiran-materi bg-soft-primary rounded-ss mb-3 border-0">
              <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                <div className="d-flex align-items-center flex-wrap">
                  <img src="/img/icon-file.svg" alt="icon file" />
                  <a href={`${dt}`} target="_blank">
                    <div className="p-2">
                      <p className="fw-bold color-dark mb-0">{dt}</p>
                    </div>
                  </a>
                </div>
                <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                  <FaTimes
                    className="fs-4"
                    color="#96DAFF"
                    onClick={() =>
                      changeStateBuatTugas(
                        "lampiran",
                        stateBuatTugas?.lampiran?.filter((item) => item !== dt)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )),
    },
    {
      id: "tautan-link",
      nav: "Tautan Link",
      active: false,
      content:
        stateBuatTugas?.link?.length > 0 &&
        stateBuatTugas?.link?.map((dt, index) => (
          <div className="mt-3" key={`${index}-${new Date().getTime()}`}>
            <div className="card-lampiran-materi bg-soft-primary rounded-ss mb-3 border-0">
              <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                <div className="d-flex align-items-center flex-wrap">
                  <img src="/img/icon-upload-link.svg" alt="icon link" />

                  <a rel="noreferrer noopener" href={dt} target="_blank">
                    <div className="p-2">
                      <p className="fw-bold color-dark mb-0">{dt}</p>
                    </div>
                  </a>
                </div>
                <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                  <FaTimes
                    className="fs-4"
                    color="#96DAFF"
                    onClick={() =>
                      changeStateBuatTugas(
                        "link",
                        stateBuatTugas?.link?.filter((item) => item !== dt)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )),
    },
  ];

  return (
    <div className="row">
      <div className="card card-ss rounded-ss p-4 card-content-lampiran-tugas">
        <div className="d-flex justify-content-between align-items-lg-start mb-4 flex-lg-row flex-column flex-wrap">
          <h4 className="m-0 fw-extrabold color-dark">Lampiran Tugas</h4>
          <div className="d-flex align-items-md-center flex-md-row flex-column justify-content-between mt-3">
            <label
              htmlFor="inputFileModalBuatTugas"
              className="d-flex align-items-center justify-content-center form-label m-0 fs-6 btn btn-ss fs-14-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 fw-bold mb-md-0 mb-3"
            >
              <FaPaperclip className="me-2" />
              <p className="mb-0">Unggah File</p>
            </label>

            {/* </label> */}
            <InputFile
              name="inputFileModalBuatTugas"
              id="inputFileModalBuatTugas"
              onChange={(e, data) =>
                changeStateBuatTugas("lampiran", [
                  ...stateBuatTugas?.lampiran,
                  data,
                ])
              }
            />
            {/* <!-- Button Trigger Modal Tautan Link Start --> */}

            <button
              type="button"
              className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-14-ss fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#ModalTautanLinkLampiranTugas"
            >
              <FaLink className="me-2" />
              Tautan Link
            </button>

            {/* <!-- Button Trigger Modal Tautan Link End --> */}
          </div>
        </div>
        <Tabs navItems={navItemsModalTugas} />
        <ModalTautanLink
          toastMessage="Link berhasil ditambahkan"
          name="lampiran"
          modalId="ModalTautanLinkLampiranTugas"
          getLink={(e, link) =>
            changeStateBuatTugas("link", [...stateBuatTugas?.link, link])
          }
        />
      </div>
    </div>
  );
};

export default Lampiran;
