import Skeleton from "react-loading-skeleton";

const SkeletonKegiatan = () => {
  return (
    <div className="col-lg-10">
      <div className="card card-ss px-4 py-0">
        <div className="py-4">
          <div className="d-flex align-items-center w-100">
            <Skeleton width={60} height={60} circle />
            <div className="w-100">
              <Skeleton width={"40%"} height={30} className="ms-3" />
            </div>
          </div>
          <div className="kegiatan-items py-3 pointer rounded-ss mb-4 px-4 mt-4">
            <div className="d-flex align-items-center">
              <Skeleton width={50} height={50} circle />
              <div className="w-100 ms-3 d-flex justify-content-between">
                <div style={{ width: "60%" }}><Skeleton width={"100%"} height={25} /></div>
                <div style={{ width: "10%" }}><Skeleton width={"100%"} height={25} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonKegiatan;