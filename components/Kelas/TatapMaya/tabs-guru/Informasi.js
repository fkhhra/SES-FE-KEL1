import { deleteTimelineKomen } from "client/TimelineClient";
import KomenInput from "components/Shared/KomenTimeline/KomenInput";
import KomenTimeline from "components/Shared/KomenTimeline/KomenTimeline";
import { isValidGmeetUrl } from "utilities/HelperUtils";


const Informasi = ({ detailData, postKomen }) => {

  const deleteKomen = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteTimelineKomen(id);
        if (data) {
          toast.success(data?.message);
          _getDetailTimeline();
        }
      }
    });
  };

  return <>
    <div className="row mt-4">
      <div className="col-md-8 pe-2 mb-md-0 mb-3">
        <div
          className="status-info px-4 p-3 pb-md-3 pb-0 bg-very-soft-secondary-2 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
          data-joyride="informasi-absen"
        >
          <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
            <p className="fs-14-ss fw-bold color-secondary mb-2">Hadir</p>
            <p className="fs-18-ss fw-extrabold color-primary m-0">
              {detailData?.meta?.totalHadir} Siswa
            </p>
          </div>
          <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
            <p className="fs-14-ss fw-bold color-secondary mb-2">Sakit</p>
            <p className="fs-18-ss fw-extrabold color-primary m-0">
              {detailData?.meta?.totalSakit} Siswa
            </p>
          </div>
          <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
            <p className="fs-14-ss fw-bold color-secondary mb-2">Izin</p>
            <p className="fs-18-ss fw-extrabold color-primary m-0">
              {detailData?.meta?.totalIzin} Siswa
            </p>
          </div>
          <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
            <p className="fs-14-ss fw-bold color-secondary mb-2">Alpa</p>
            <p className="fs-18-ss fw-extrabold color-primary m-0">
              {detailData?.meta?.totalAlpa} Siswa
            </p>
          </div>
        </div>
        <div className="post-content mt-4">
          <p className="color-secondary">
            {`Absen Kelas ${detailData?.rombel?.nama} Tanggal ${detailData?.tanggalPertemuan}`}
          </p>
          {detailData?.deskripsi}
        </div>
      </div>
      <div className="col-md-4 ps-2">
        {/* <a
          onClick={(e) => handleClickPilihanAbsen("hadir", e)}
          rel="noreferrer noopener"
          className={`btn ${
            isValidGmeetUrl(
              timeline?.gmeet || timeline?.timeline?.gmeet
            ) == "#!"
              ? "btn-secondary btn-secondary-ss"
              : "btn-primary btn-primary-ss"
          } rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4`}
          style={{
            height: "90px",
          }}
          data-joyride="btn-tatap-muka"
        >
          <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row">
            <img
              src={`/img/icon-tatap-muka.svg`}
              alt="icon-tatap-muka"
              style={{
                width: "50px",
                height: "50px",
              }}
            />
            <p className="m-0 text-white fw-bold ps-lg-4 pe-lg-5 px-md-0 ps-4 pe-5">
              {isValidGmeetUrl(
                timeline?.gmeet || timeline?.timeline?.gmeet
              ) == "#!"
                ? "Tidak ada tatap muka"
                : "Tatap Muka"}
            </p>
          </div>
        </a> */}
        <a
          onClick={(e) => isValidGmeetUrl(detailData?.gmeet) && window.open(detailData?.gmeet)}
          rel="noreferrer noopener"
          className={`btn ${
            isValidGmeetUrl(
              detailData?.gmeet
            ) == "#!"
              ? "btn-secondary btn-secondary-ss"
              : "btn-primary btn-primary-ss"
          } rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4`}
          style={{
            height: "90px",
          }}
          data-joyride="btn-tatap-muka"
        >
          <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row">
            <img
              src={`/img/icon-tatap-muka.svg`}
              alt="icon-tatap-muka"
              style={{
                width: "50px",
                height: "50px",
              }}
            />
            <p className="m-0 text-white fw-bold ps-lg-4 pe-lg-5 px-md-0 ps-4 pe-5">
              {isValidGmeetUrl(detailData?.gmeet) == "#!" ? "Tidak ada tatap muka" : "Tatap Muka"}
            </p>
          </div>
        </a>
      </div>
    </div>
    <hr />
    {detailData?.komen?.map((komenData, idx) => (
      <KomenTimeline
        idx={idx}
        totalKomen={detailData?.komen?.length}
        komen={komenData?.komen}
        userObj={komenData?.user}
        userId={komenData?.mUserId}
        createdAt={komenData?.createdAt}
        onClickDelete={deleteKomen}
        komenId={komenData?.id}
      />
    ))}
    <KomenInput postKomen={postKomen} />
  </>
}

export default Informasi;