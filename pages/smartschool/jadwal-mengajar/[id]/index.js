import React from "react";
import { FaCamera, FaVideoSlash } from "react-icons/fa";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";

const index = () => {
  return (
    <Layout>
      <AnimatePage>
        <div className="card card-ss">
          <div className="card-header p-4 card-header-ss">
            <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-4">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">CCTV</h4>
            </div>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="cctv">
                  <div>
                    <FaVideoSlash className="h1" />
                    <p>CCTV sedang offline</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="cctv">
                  <div>
                    <FaVideoSlash className="h1" />
                    <p>CCTV sedang offline</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="cctv">
                  <div>
                    <FaVideoSlash className="h1" />
                    <p>CCTV sedang offline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
