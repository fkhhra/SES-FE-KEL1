import Skeleton from "react-loading-skeleton";

const SkeletonDetailKegiatan = () => {
  return (
    <div className="card card-ss p-4 pb-5 mb-4">
      <div className="d-flex align-items-center">
        <div>
          <Skeleton width={86} height={86} circle />
        </div>
        <div className="ms-4 w-100">
          <Skeleton width={"50%"} height={20} className="mb-2" /> <br />
          <Skeleton width={"60%"} height={25} />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <div style={{ width: "75%" }}><Skeleton width={"100%"} height={83} /></div>
        <div style={{ width: "20%" }}><Skeleton width={"100%"} height={83} /></div>
      </div>

      <div className="mt-4">
        <Skeleton width={"60%"} height={20} className="mb-2" /> <br />
        <Skeleton width={"50%"} height={20} className="mb-2" /> <br />
        <Skeleton width={"40%"} height={25} />
      </div>
    </div>
  )
}

export default SkeletonDetailKegiatan;