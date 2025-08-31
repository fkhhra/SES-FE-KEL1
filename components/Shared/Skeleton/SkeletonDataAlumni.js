import React from "react";
import Skeleton from "react-loading-skeleton";
import { alphabet } from "../../../utilities/HelperUtils";

const SkeletonDataAlumni = () => {
  return (
    <div className="d-flex align-items-stretch">
      <Skeleton height={30} />

      <div className="flex-grow-1">
        <div className="h-100 d-flex flex-column justify-content-between">
          <div>
            <p className="fs-18-ss fw-extrabold mb-0 color-dark clamp-1">
              <Skeleton height={100} />
            </p>
            <p className="fs-14-ss fw-semi-bold clamp-2 mb-0">
              {/* Sistem Informatika Jaringan dan Aplikasi */}
              <Skeleton height={100} />
            </p>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span className={`fs-12-ss fw-semibold color-primary`}>
              <Skeleton height={100} />
            </span>

            <img
              src={`/img/icon-alumni-${
                <Skeleton height={100} /> == "bekerja"
                  ? "bekerja"
                  : <Skeleton height={100} /> == "kuliah"
                  ? "kuliah"
                  : <Skeleton height={100} /> == "mencari-kerja"
                  ? "mencari-kerja"
                  : <Skeleton height={100} /> == "berwirausaha"
                  ? "berwirausaha"
                  : ""
              }.svg`}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDataAlumni;
