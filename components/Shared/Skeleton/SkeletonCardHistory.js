import Skeleton from 'react-loading-skeleton';
import { FaClock } from 'react-icons/fa';

const SkeletonCard = () => (
  <div className="card card-ss pointer">
    <div className="text-decoration-none p-4 gap-md-0 gap-2 d-flex flex-md-row flex-column justify-content-md-between align-items-md-end">
      <div className="card-body p-0">
        <h6 className="fw-semibold color-dark mb-2 text-truncate">
          <Skeleton width={200} />
        </h6>
        <h5 className="mb-0 fw-black text-truncate color-dark">
          <Skeleton width={300} />
        </h5>
      </div>
      <div className="d-flex align-items-center">
        <FaClock className="me-2" />
        <Skeleton width={100} />
      </div>
    </div>
  </div>
);

export default SkeletonCard;