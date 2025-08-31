import Link from "next/link";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "../../../client/clientAxios";
import toast from "react-hot-toast";
import { hideModal } from "../../../utilities/ModalUtils";
import ModalFormProyek from "../../../components/Proyek/ModalFormProyek";
import { getProyek, postProyek } from "../../../client/ProyekClient";
import React from "react";
import SearchRPP from "../../../components/RPP/SearchRPP";
import CardRPP from "../../../components/RPP/CardRPP";
import axios from "axios";
import CardRPPSkeleton from "../../../components/Shared/Skeleton/CardRRPSkeleton";
import SideBarRpp from "components/RPP/SideBarRpp";
import LayoutBukuKerja from "components/BukuKerjaGuru/LayoutBukuKerja";
import { Pagination } from "antd";

const index = ({ nav, search, page }) => {
  const initialStateForm = {
    nama: "",
    privasi: "",
    deskripsi: "",
    banner: "",
    mStatusProyekId: "",
    btnLoading: "idle",
    cari: "",
  };

  const [rppKemdikbud, setRppKemdikbud] = useState([]);
  const [formData, setFormData] = useState(initialStateForm);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  console.log(rppKemdikbud);
  const { halaman = 1 } = router.query;
  const handleChangeForm = (e, uploadedFile) => {
    if (uploadedFile) {
      setFormData({
        ...formData,
        [e.target.name]: uploadedFile,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const _postProyek = async () => {
    setFormData({ ...formData, btnLoading: "loading" });
    const { data } = await postProyek(formData);

    if (data) {
      toast.success(data?.message);
      hideModal("modalBuatProyek");
      setFormData({ ...formData, btnLoading: "success" });
      setFormData(initialStateForm);
      _getRppKemdikbud();
    } else {
      toast.error(data?.message);
      setFormData({ ...formData, btnLoading: "error" });
    }
  };

  const _getRppKemdikbud = async () => {
    setLoading(true);
    console.log(search);
    const { data } = await axios.get(
      `https://ayoguruberbagi.kemdikbud.go.id/wp-json/wp/v2/rpp?per_page=40&search=${
        search || ""
      }`
    );

    if (data) {
      setRppKemdikbud(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getRppKemdikbud();
  }, [search, page]);

  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const useLayoutBukuKerja = true;

  return (
    <ConditionalWrapper
      wrapper={(children) =>
        useLayoutBukuKerja ? (
          <LayoutBukuKerja>{children}</LayoutBukuKerja>
        ) : (
          <Layout>
            <AnimatePage>{children}</AnimatePage>
          </Layout>
        )
      }
    >
      <div className="row gy-4">
        {!useLayoutBukuKerja && (
          <div className="col-lg-3 positon-relative">
            <SideBarRpp activeMenu={activeMenu} />
          </div>
        )}
        <div className={useLayoutBukuKerja ? "col-lg-12" : "col-lg-9"}>
          <SearchRPP
            nav={nav}
            handleChangeForm={handleChangeForm}
            formData={formData}
          />
          <div
            className="row mt-4 position-relative gy-4 search-rpp-content"
            style={{ zIndex: "50" }}
          >
            <div className="col-md-12">
              <div className="d-flex align-items-center">
                <div className="px-4 py-2 color-secondary bg-soft-secondary rounded-pill fw-bold me-4">
                  Daring
                </div>
                <div className="px-4 py-2 color-secondary bg-soft-secondary rounded-pill fw-bold me-4">
                  SMK/MAK
                </div>
                <span className="color-primary fw-bold pointer">
                  Hapus Semua
                </span>
              </div>
              <hr />
            </div>
            {loading && (
              <>
                <CardRPPSkeleton count={2} />
              </>
            )}
            {!loading && (
              <>
                {rppKemdikbud?.map((rpp, idx) => {
                  return (
                    <div className="col-md-6">
                      <CardRPP isRppKemdikbud={true} mode="luring" rpp={rpp} />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
          <Pagination
            total={rppKemdikbud?.total}
            showSizeChanger={false}
            current={halaman || 1}
            pageSize={20}
            onChange={(e) => router.push(`${ssURL}/rpp?page=${e}`)}
          />
        </div>
      </div>
      <ModalFormProyek
        setFormData={setFormData}
        handleChangeForm={handleChangeForm}
        formData={formData}
        _postProyek={_postProyek}
      />
    </ConditionalWrapper>
  );
};

const ConditionalWrapper = ({ children, wrapper }) => {
  return wrapper(children);
};

export async function getServerSideProps({ query: { nav, search, page } }) {
  return {
    props: {
      nav: nav || null,
      search: search || null,
      page: page || null,
    },
  };
}

export default index;
