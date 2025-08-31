import { Tooltip } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { FaCheck } from "react-icons/fa";
import { ssURL } from "../../client/clientAxios";

const NavTypeKegiatan = ({ page, setPage=()=>{}, data, kelasId, isSudahBacaSemuaMateri, isGuru }) => {

  const KegiatanItem = ({ type, judulMateri, judulTugas, active, id, tuntas }) => {

    const getLinkDetail = () => {
      let url = `${ssURL}/kelas/${kelasId}/kegiatan/${id}`;
      switch (type) {
        case "pertemuan":
          url += "?hal=pertemuan";
          break;

        case "tugas":
          url += "?hal=tugas";
          break;

        case "tugas-kuis":
          url += "?hal=tugas-kuis"
          break;

        case "materi":
          url += "?hal=materi";
          break;

        default:
          break;
      }
      return url;
    }

    const getIconNavKegiatan = () => {
      let src = "/img/icon-nav-kegiatan-";
      switch (type) {
        case "pertemuan":
          src += "tatap-maya";
          break;

        case "materi":
          src += "materi";
          break;

        case "tugas":
        case "tugas-kuis":
          isGuru ? (src += "tugas") : isSudahBacaSemuaMateri ? (src += "tugas") : (src += "tugas-lock")
          break;

        default:
          break;
      }
      return active ? `${src}-active.svg` : `${src}.svg`;
    }

    const getTitleNavKegiatan = () => {
      switch (type) {
        case "pertemuan":
          return "Tatap Maya";

        case "materi":
          return "Materi";

        case "tugas":
          return "Tugas";

        case "tugas-kuis":
          return "Tugas Kuis";

        default:
          break;
      }
    }

    const getSubTitleNavKegiatan = () => {
      switch (type) {
        case "materi":
          return judulMateri;

        case "tugas":
        case "tugas-kuis":
          return judulTugas;

        default:
          break;
      }
    }

    return (
      <Link href={getLinkDetail()}>
        <a>
          <div
          className={`step-ppdb position-relative`}
          key={id}
          itemID={id}
          onClick={() => setPage(id)}
        >
          {tuntas && (
            <div
              className="step-check position-absolute rounded-circle bg-white align-items-center justify-content-center"
              style={{
                width: "45px",
                height: "45px",
                right: "0",
                top: "-10%",
              }}
            >
              <div
                className="rounded-circle bg-success shadow-success-ss d-flex align-items-center justify-content-center text-white"
                style={{ width: "35px", height: "35px" }}
              >
                <FaCheck />
              </div>
            </div>
          )}
          <div
            className={`step-content d-flex align-items-center rounded-ss p-4 pointer me-3 ${active ? "active text-white" : ""}`}
            style={{
              width: "242px",
            }}
          >
            <img
              src={getIconNavKegiatan()}
              alt="icon-kegiatan"
            />
            <div className="ms-4" style={{ width: "65%" }}>
              <h6 className="m-0 fw-bold text-truncate">
                {getTitleNavKegiatan()}
              </h6>
              {type != "pertemuan" && (
                <Tooltip title={judulMateri || judulTugas}>
                  <p
                    className={`fs-12-ss fw-bold  text-truncate mt-1 mb-0  ${
                      active ? "text-white" : "color-secondary"
                    }`}
                  >
                    {getSubTitleNavKegiatan()}
                  </p>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        </a>
      </Link>
    );
  };

  const Kegiatan = (data) => {
    return data?.map((d, idx) => {
      return (
        <KegiatanItem
          type={d.type}
          judulMateri={d.judulMateri}
          judulTugas={d.judulTugas}
          id={d.id}
          tuntas={d?.tuntas}
          active={page == d.id}
        />
      );
    });
  }

  const kegiatan = Kegiatan(data);

  const Arrow = ({ text, className }) => {
    return <div className={className}>{text}</div>;
  };

  const ArrowLeft = Arrow({
    text: (
      <div
        className="bg-white rounded-circle shadow-dark-ss d-flex justify-content-center align-items-center p-1"
        style={{ height: "60px", width: "60px" }}
      >
        <img src={"/img/arrow-rekap-left.svg"} className="ms-1" />
      </div>
    ),
    className: "arrow-prev",
  });
  const ArrowRight = Arrow({
    text: (
      <div
        className="bg-white rounded-circle shadow-dark-ss d-flex justify-content-center align-items-center p-1"
        style={{ height: "60px", width: "60px" }}
      >
        <img src={"/img/arrow-rekap-right.svg"} className="me-1" />
      </div>
    ),
    className: "arrow-next",
  });

  return (
    <div>
      <div className="nav-kegiatan kelas-rekap card card-ss mb-4">
        <div className="card-body p-4 pt-3">
          <div className="d-flex justify-content-between align-items-stretch flex-wrap">
            <ScrollMenu
              hideArrows={true}
              hideSingleArrow={true}
              data={kegiatan}
              arrowLeft={ArrowLeft}
              arrowRight={ArrowRight}
              clickWhenDrag={false}
              selected={page}
              //   onSelect={onSelect}
              wheel={false}
              translate={2}
              scrollBy={1}
              alignCenter={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavTypeKegiatan;
