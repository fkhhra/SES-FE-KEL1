import { useEffect, useState } from "react";
import {
  getProfil,
  editProfil,
  changePassword,
} from "../../../../../client/sharedClient";
import LayoutDetail from "../../../../../components/Layout/LayoutDetail";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import { baseURL, ssURL } from "../../../../../client/clientAxios";
import toast from "react-hot-toast";
import UploadProfilePicture from "../../../../../components/Shared/UploadProfilePicture/UploadProfilePicture";
import { DatePicker, Pagination } from "antd";
import moment from "moment";
import useSekolah from "../../../../../hooks/useSekolah";
import { hideModal } from "../../../../../utilities/ModalUtils";
import ReactiveButton from "reactive-button";
import SearchKolaborasi from "../../../../../components/Kolaborasi/SearchKolaborasi";
import CardPartnerKolaborasi from "../../../../../components/Kolaborasi/CardPartnerKolaborasi";
import NewModal from "../../../../../components/Shared/NewModal/NewModal";
import Avatar from "../../../../../components/Shared/Avatar/Avatar";
import { getUser } from "../../../../../client/UserClient";
import { useRouter } from "next/router";
import ModalUndangAnggota from "../../../../../components/Proyek/ModalUndangAnggota";
import {
  postAnggotaProyek,
  detailProyek,
} from "../../../../../client/ProyekClient";
import useUser from "../../../../../hooks/useUser";

const index = ({ id, page }) => {
  const router = useRouter();
  const { cariPartner } = router.query;
  const { user } = useUser();

  const initialFormData = {
    userId: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChangeFormCheck = (e) => {
    const parse = JSON.parse(e.target.value);

    const check = formData[e.target.name].findIndex((d) => d.id == parse.id);

    if (check >= 0) {
      const filtered = formData[e.target.name].filter((d) => d.id != parse.id);

      setFormData({
        ...formData,
        [e.target.name]: [...filtered],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: [...formData[e.target.name], parse],
      });
    }
  };

  const [partner, setPartner] = useState();
  const [isInvited, SetIsInvited] = useState();

  const _getUser = async () => {
    const { data } = await getUser({
      page: page || 1,
      name: router?.query?.search || "",
      bentuk: router?.query?.bentuk || "",
      mSekolahId: router?.query?.sekolah || "",
    });
    const invited = await detailProyek(id);

    if (data) {
      setPartner(data?.user);
    }
    if (invited.data) {
      const { anggota } = invited.data?.proyek;
      if (anggota) {
        const filter = anggota?.map((user) => {
          if (user.status === "undangan" || user.status === "menerima") {
            return user.mUserId;
          } else {
            return 0;
          }
        });
        SetIsInvited(filter);
      } else {
        SetIsInvited([]);
      }
    }
  };

  const handleChangeFilter = (query) => {
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const _bagiUndangan = async () => {
    const invitedIds = formData.userId.map((user) => user.id);
    const payload = {
      anggotaProyekId: user.id,
      proyekId: id,
      userId: invitedIds,
      status: "undangan",
    };

    const { data, error, isSuccess } = await postAnggotaProyek(payload);

    if (isSuccess) {
      toast.success(data?.message);

      setFormData(initialFormData);
      _getUser();
    } else {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    _getUser();
  }, [page, router.query]);

  const FooterUndangAnggota = () => (
    <div
      className="w-100 p-md-4 p-3 position-fixed bg-very-soft-secondary"
      style={{ bottom: "0", left: "0", zIndex: "100" }}
    >
      <div className="container">
        <div className="d-flex justify-content-sm-between flex-sm-row flex-column">
          <div
            className="rounded-pill bg-light-primary color-primary fw-bold px-4 py-2 mb-sm-0 me-sm-02 text-center mb-sm-0 mb-2 pointer"
            data-bs-toggle="modal"
            data-bs-target="#modalPartnerDiundang"
          >
            {formData.userId?.length} Diundang
          </div>

          <div className="footer-button d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary me-3"
              data-bs-dismiss="modal"
              onClick={() => setFormData(initialFormData)}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={_bagiUndangan}
            >
              Bagikan Undangan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <LayoutDetail
        title={"Undang Anggota"}
        backProps={`${ssURL}/proyek/${id}/`}
      >
        <AnimatePage>
          <SearchKolaborasi
            cariPartner={cariPartner}
            _getUser={_getUser}
            handleChangeFilter={handleChangeFilter}
            query={router.query}
            hasilSearch={partner}
          />
          <div
            className="row mt-5 position-relative gy-4"
            style={{ zIndex: "50" }}
          >
            {partner?.data?.map((d, idx) => {
              return (
                <div
                  className="col-md-3"
                  key={`${idx}-${new Date().getTime()}`}
                >
                  <CardPartnerKolaborasi
                    isUndangan
                    isInvited={isInvited}
                    data={d}
                    handleChangeFormCheck={handleChangeFormCheck}
                    formData={formData}
                  />
                </div>
              );
            })}
          </div>
          <div className="my-4 text-center">
            <Pagination
              total={partner?.total}
              showSizeChanger={false}
              current={page || 1}
              pageSize={20}
              onChange={(e) =>
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    page: e,
                  },
                })
              }
            />
          </div>
          <FooterUndangAnggota />
          <ModalUndangAnggota formData={formData} setFormData={setFormData} />
        </AnimatePage>
      </LayoutDetail>
    </>
  );
};

export async function getServerSideProps({ params: { id }, query: { page } }) {
  return {
    props: {
      id,
      page: page || null,
    },
  };
}

export default index;
