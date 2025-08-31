import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { hideModal } from "utilities/ModalUtils";
import { getJamMengajar, editJamMengajar } from "client/JamMengajarClient";
import { buildSettingForm } from "data/form";
import { renderFormInput, renderJamMengajar } from "utilities/HelperUtils";
import { FaChevronLeft, FaPen } from "react-icons/fa";
import { ssURL } from "client/clientAxios";

import moment from "moment";
import toast from "react-hot-toast";
import Link from "next/link";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Skeleton from "react-loading-skeleton";
import Layout from "components/Layout/Layout";
import NewModal from "components/Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import MyJoyride from "components/Shared/MyJoyride/MyJoyride";
import SideNavTahunAkademik from "components/TahunAkademik/SideNavTahunAkademik";
import LayoutDetailTahunAkademik from "components/Layout/LayoutDetailTahunAkademik";

const initialFormData = {
  hari: "",
  jamKe: "",
  kodeHari: 1,
  jamKe: "",
  jamMulai: "",
  jamSelesai: "",
  istirahat: null,
};

const index = ({ id }) => {
  const router = useRouter();

  // const { id } = router.query;

  const [jamMengajar, setJamMengajarSekolah] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  // const { semuaTA, dataTA } = data;

  const settingList = buildSettingForm(
    formData,
    setFormData,
    "Hari Jam Mengajar"
  );

  const inputJamMengajar = buildSettingForm(
    formData,
    setFormData,
    "Tambah Jam Mengajar"
  );

  const getJamMengajarSekolah = async () => {
    setLoading(true);
    const params = { ...router.query, taId: id };

    const { data } = await getJamMengajar(params);
    if (data) {
      setLoading(false);
      setJamMengajarSekolah(data.jamMengajar);
      setData(data);
    }
  };

  const handleModalSubmit = async () => {
    const { data, error } = await editJamMengajar(editId, {
      ...formData,
      jamMulai: moment(formData?.jamMulai).format("HH:mm"),
      jamSelesai: moment(formData?.jamSelesai).format("HH:mm"),
    });
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      getJamMengajarSekolah();
      hideModal("modal-jam-mengajar");
    } else {
      if (error?.length > 0) {
        error?.map((err) => toast.error(err?.message));
      } else {
        toast.error(error?.message);
      }
      setButtonState("error");
    }
  };

  const setFilter = () => {
    const queryParams = {
      hari: formData?.kodeHari,
    };

    // delete queryParams if value is null
    Object.keys(queryParams).map((query) => {
      !queryParams[query] && delete queryParams[query];
    });

    router.push({
      pathname: `${ssURL}/tahun-akademik/${id}/jam-mengajar`,
      query: queryParams,
    });
  };

  useEffect(() => {
    setFilter();
  }, [formData.kodeHari]);

  useEffect(() => {
    getJamMengajarSekolah();
  }, [router.query]);

  const steps = [
    {
      target: '[data-joyride="filter-hari-jam-mengajar"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hari Jam Mengajar</h5>
          <p className="color-secondary fw-semibold">
            Disini anda dapat mengganti dan melihat jam mengajar anda
            berdasarkan hari. Tekan tombol untuk mengganti hari untuk jam
            mengajar anda.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="table-jam-mengajar"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Jam Mengajar</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar jam mengajar yang sudah ditambahkan ke sekolah
            anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-jam-mengajar"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Jam Mengajar</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai jam
            mengajar yang sudah dibuat.
          </p>
        </div>
      ),
    },
  ];

  return (
    <LayoutDetailTahunAkademik
      modalWrapper={
        <NewModal
          modalId="modal-jam-mengajar"
          title={
            <>
              <p className="mb-0 fw-bold">Edit Jam Mengajar</p>
              <span className="fs-6">
                Isi informasi dibawah untuk mengubah data jam mengajar
              </span>
            </>
          }
          content={
            <>
              <div>{renderFormInput(inputJamMengajar)}</div>
            </>
          }
          submitButton={
            <ReactiveButton
              buttonState={buttonState}
              onClick={handleModalSubmit}
              color={"primary"}
              idleText={"Simpan"}
              loadingText={"Diproses"}
              successText={"Berhasil"}
              errorText={"Gagal"}
              type={"button"}
              data-bs-dismiss="modal"
              className={"btn btn-primary"}
            />
          }
        />
      }
      semuaTA={data?.semuaTA}
      dataTA={data?.dataTA}
      route={"jam-mengajar"}
    >
      <MyJoyride steps={steps} />
      <AnimatePage>
        <div
          className="row mb-4 mt-md-0 mt-4 sticky-top md-position-static"
          style={{ top: "101px" }}
        >
          <div className="col-md-12">
            <Link href={`${ssURL}/tahun-akademik-v2/`}>
              <a
                className="text-decoration-none fw-bolder position-relative color-primary pointer"
                data-joyride="button-kembali"
              >
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <SideNavTahunAkademik ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                    Jam Mengajar
                  </h4>
                  <div
                    data-joyride="filter-hari-jam-mengajar"
                    className="filter-hari-jam-mengajar"
                  >
                    {renderFormInput(settingList)}
                  </div>
                </div>
              </div>
              {loading ? (
                <Skeleton count={4} height={50} />
              ) : (
                <div
                  className="table-responsive"
                  data-joyride="table-jam-mengajar"
                >
                  <table className="table-ss">
                    <thead>
                      <tr>
                        <th>Jam</th>
                        <th>Waktu</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jamMengajar?.map((data, idx) => {
                        if (data.istirahat) {
                          return (
                            <tr key={`${idx}-${new Date().getTime()}`}>
                              <td
                                colSpan="2"
                                className="table-istirahat color-warning fw-bold text-center text-uppercase"
                              >
                                Istirahat
                              </td>
                              <td className="color-warning table-istirahat">
                                <button
                                  type="button"
                                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#modal-jam-mengajar"
                                  onClick={() => {
                                    setEditId(data?.id);
                                    setFormData({
                                      ...formData,
                                      hari: data?.hari,
                                      jamKe: data?.jamKe,
                                      jamMulai: new Date(
                                        `2021-01-03 ${data?.jamMulai}`
                                      ),
                                      jamSelesai: new Date(
                                        `2021-01-03 ${data?.jamSelesai}`
                                      ),
                                    });
                                  }}
                                  data-joyride="edit-jam-mengajar"
                                >
                                  <FaPen className="color-secondary" />
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr>
                            <td data-th="Jam">{data.jamKe}</td>
                            <td data-th="Waktu">
                              {renderJamMengajar(
                                data.jamMulai,
                                data.jamSelesai
                              )}
                            </td>
                            <td data-th="Edit" className="actions">
                              <button
                                type="button"
                                className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                data-bs-toggle="modal"
                                data-bs-target="#modal-jam-mengajar"
                                onClick={() => {
                                  setEditId(data?.id);
                                  setFormData({
                                    ...formData,
                                    hari: data?.hari,
                                    jamKe: data?.jamKe,
                                    jamMulai: new Date(
                                      `2021-01-03 ${data?.jamMulai}`
                                    ),
                                    jamSelesai: new Date(
                                      `2021-01-03 ${data?.jamSelesai}`
                                    ),
                                  });
                                }}
                                data-joyride="edit-jam-mengajar"
                              >
                                <FaPen className="color-secondary" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
    </LayoutDetailTahunAkademik>
  );
};
export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
