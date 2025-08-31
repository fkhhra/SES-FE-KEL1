import KomenTimeline from "components/Shared/KomenTimeline/KomenTimeline";
import { FaFile } from "react-icons/fa"

const HasilJawabanTugas = ({ detailData }) => {
  return (
    <div className="mt-3">
      <h4 className="mb-4 fw-extrabold color-dark">
        Jawaban Tugas
      </h4>

      <p>{detailData?.keterangan}</p>

      {detailData?.lampiran?.map((lampiran) => {
        return (
          <a
            href={lampiran}
            target="_blank"
            className="bg-soft-primary p-3 rounded-ss mb-3 d-block"
          >
            <div className="file-content d-flex align-items-center flex-wrap">
              <div
                className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                style={{
                  width: "48px",
                  height: "48px",
                }}
              >
                <FaFile />
              </div>
              <div className="p-2 d-flex flex-column">
                <p className="fw-bold color-dark mb-1">
                  {lampiran}
                </p>
              </div>
            </div>
          </a>
        );
      })}

      <h6 className="fs-18-ss fw-bold color-dark mb-3 mt-5">
        {`Komentar Pribadi ( ${detailData?.komen?.length} )`}
      </h6>

      { detailData?.komen?.length > 0 && detailData?.komen?.map((komenData, index) => (
          <KomenTimeline
            idx={index}
            komen={komenData?.komen}
            userObj={komenData?.user}
            userId={komenData?.mUserId}
            createdAt={komenData?.updatedAt}
          />
        ))}
    </div>
  )
}

export default HasilJawabanTugas;