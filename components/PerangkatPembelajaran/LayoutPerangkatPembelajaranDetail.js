import { getBukuKerjaDetail } from "client/BukuKerjaGuruClient";
import LayoutDetail from "components/Layout/LayoutDetail";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { showModal } from "utilities/ModalUtils";
import SidebarPerangkatPembelajaranDetail from "./SidebarPerangkatPembelajaranDetail";

const LayoutPerangkatPembelajaranDetail = ({
  children,
  type,
  title,
  tingkat,
}) => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);

  return (
    <LayoutDetail
      backProps={`/smartschool/perangkat-pembelajaran`}
      title={title}
    >
      <AnimatePage>
        <div className="card-ss py-4 px-4 mt-4">
          <div className="row">
            <div className="col-sm-12 col-lg-6 d-flex align-items-center">
              <h4 className="color-dark fw-black mb-0">
                Daftar Perangkat Pembelajaran
              </h4>
            </div>
            <div className="col-sm-12 col-lg-6 mt-4 mt-lg-0 d-flex flex-sm-row flex-column">
              <div className="flex-grow-1 d-flex flex-column">
                <input
                  type="text"
                  className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100 sm-w-100"
                  id="exampleFormControlInput1"
                  placeholder="Cari"
                  onChange={(e) => setSearch(e.target.value)}
                  search={search}
                  // style={{ height: "42px", width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-4 mb-4" />
        <div className="row">
          <div className="col-md-3">
            <SidebarPerangkatPembelajaranDetail type={type} tingkat={tingkat} />
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      </AnimatePage>
    </LayoutDetail>
  );
};

export default LayoutPerangkatPembelajaranDetail;
