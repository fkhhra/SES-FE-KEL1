import {
  editJadwalMengajar,
  getJadwalMengajar,
} from "client/JadwalMengajarClient";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { FaCheck, FaPen, FaTrashAlt } from "react-icons/fa";
import { renderJamMengajar } from "utilities/HelperUtils";

import LayoutJadwalMengajar from "components/Layout/LayoutJadwalMengajar";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

const index = ({ id }) => {
  const router = useRouter();

  const { tingkat, hari, rombel } = router.query;

  const [aktifJamMengajar, setAktifJamMengajar] = useState("");
  const [jadwalMengajarData, setJadwalMengajarData] = useState([]);
  const [listRombel, setListRombel] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    jamMengajar: jamMengajarData,
    mataPelajaran,
    tingkatRombel,
  } = jadwalMengajarData || {};

  const listGuru = mataPelajaran?.map((data) => {
    return {
      value: data.id,
      label: `${data?.user?.nama} - ${data?.nama}`,
    };
  });

  const jamMengajar = jamMengajarData?.map((data) => {
    return {
      jam: renderJamMengajar(data?.jamMulai, data?.jamSelesai),
    };
  });

  const _getJadwalMengajar = async () => {
    let params = {
      tingkat: tingkat,
      hari: hari || new Date().getDay(),
      taId: id,
    };
    setLoading(true);
    const { data } = await getJadwalMengajar(params);
    if (data) {
      setJadwalMengajarData(data);
      const temp = {};
      data?.jamMengajar?.[0]?.jadwalMengajar?.map((dataJadwalMengajar) => {
        temp[dataJadwalMengajar?.mRombelId] = dataJadwalMengajar?.rombel?.nama;
      });
      setListRombel({ ...temp });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tingkat) {
      _getJadwalMengajar();
    }
  }, [tingkat, hari]);

  useEffect(() => {
    if (aktifJamMengajar == "" && jamMengajar?.length > 0) {
      setAktifJamMengajar(`section-0`);
    }
  }, [jamMengajar]);

  return (
    <LayoutJadwalMengajar
      jamMengajar={jamMengajar}
      tingkatRombel={tingkatRombel}
      listRombel={listRombel}
      id={id}
    >
      <AnimatePage>
        {loading ? (
          <>
            <div
              id={`section-0`}
              className={`p-4 bg-white shador-dark-ss mb-4`}
            >
              <p className={`fs-14-ss fw-bold mb-3 ms-5`}>
                <Skeleton height={15} width={100} />
              </p>
              <div className="row g-4">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, idx) => (
                  <>
                    <div className="col-sm-6 h-100 d-flex align-items-center kelas-jadwal-mengajar pointer">
                      {/* <input
                        class={`form-check-input rounded-circle me-4 mt-0 pointer`}
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        style={{
                          width: "24px",
                          height: "24px",
                        }}
                      ></input> */}
                      <div className="flex-grow-1 d-flex flex-column mb-4">
                        <div className="pe-2 text-break w-100">
                          <h6 className="text-uppercase text-primary fw-bold">
                            <Skeleton height={22} width={`50%`} />
                          </h6>
                        </div>
                        <div className="md-w-100 mb-md-0 mb-2">
                          <div className="select-kelas-jadwal-mengajar">
                            <Skeleton height={55} />
                          </div>
                        </div>
                      </div>
                      <hr className="hr-ss mb-0" />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {jamMengajarData?.map((data, idx) => (
              <div
                id={`section-${idx}`}
                className={`p-4 bg-${
                  data?.istirahat ? "soft-warning" : "white"
                } shador-dark-ss mb-4`}
              >
                <p
                  className={`fs-14-ss fw-bold mb-3 ${
                    data?.istirahat && "color-warning"
                  }`}
                >
                  {renderJamMengajar(data?.jamMulai, data?.jamSelesai)}
                </p>
                <div className="row g-4">
                  {data?.istirahat ? (
                    <>
                      <h4 className="text-center color-warning text-uppercase fw-bold">
                        Istirahat
                      </h4>
                    </>
                  ) : (
                    <>
                      {data?.jadwalMengajar?.map((dataJadwalMengajar) => {
                        if (rombel && rombel == dataJadwalMengajar?.mRombelId) {
                          return (
                            <Kelas
                              key={dataJadwalMengajar?.id}
                              dataJadwalMengajar={dataJadwalMengajar}
                              mataPelajaran={mataPelajaran}
                              listGuru={listGuru}
                              _getJadwalMengajar={_getJadwalMengajar}
                            />
                          );
                        }
                        if (!rombel) {
                          return (
                            <Kelas
                              key={dataJadwalMengajar?.id}
                              dataJadwalMengajar={dataJadwalMengajar}
                              mataPelajaran={mataPelajaran}
                              listGuru={listGuru}
                              _getJadwalMengajar={_getJadwalMengajar}
                            />
                          );
                        }
                      })}
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </AnimatePage>
    </LayoutJadwalMengajar>
  );
};

const Kelas = ({
  dataJadwalMengajar,
  mataPelajaran,
  _getJadwalMengajar,
  listGuru,
}) => {
  // const [editMapel, setEditMapel] = useState(
  //   !dataJadwalMengajar?.mataPelajaran
  // );

  const [mataPelajaranId, setMataPelajaranId] = useState(
    dataJadwalMengajar?.mataPelajaran?.id
  );

  const updateGuru = async (mataPelajaranId) => {
    let body = {
      mMataPelajaranId: mataPelajaranId,
      tingkat: dataJadwalMengajar.rombel?.tingkat,
      mRombelId: dataJadwalMengajar.mRombelId,
      mJurusanId: dataJadwalMengajar.rombel?.mJurusanId,
    };
    const { data } = await editJadwalMengajar(dataJadwalMengajar?.id, body);
    if (data) {
      setMataPelajaranId(mataPelajaranId);
      // toast.success(data?.message);
      // _getJadwalMengajar();
    }
  };

  const removeGuru = async () => {
    let body = { kosongkan: true };
    const { data } = await editJadwalMengajar(dataJadwalMengajar?.id, body);
    if (data) {
      setMataPelajaranId("");
      // toast.success(data?.message);
      // _getJadwalMengajar();
      // setEditMapel(true);
    }
  };

  return (
    <div className="col-sm-6 h-100">
      <div className="d-flex flex-column mb-4">
        <div className="pe-2 text-break w-100">
          <h6 className="text-uppercase text-primary fw-bold">
            {dataJadwalMengajar?.rombel?.nama}
          </h6>
        </div>
        <div className="md-w-100 mb-md-0 mb-2">
          <div className="select-kelas-jadwal-mengajar">
            <SelectShared
              className="w-100"
              placeholder="Pilih guru"
              handleChangeSelect={(e) => {
                e ? updateGuru(e.value) : removeGuru();
              }}
              value={mataPelajaranId}
              options={listGuru}
              isClearable
            />
          </div>
        </div>
        {/* <div className="ms-auto d-flex flex-lg-row flex-md-column flex-row">
          {editMapel ? (
            <button
              type="button"
              className="btn btn-primary btn-primary-ss rounded-circle d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0 shadow-primary-ss hover-shadow-none"
              style={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => mataPelajaranId && setEditMapel(false)}
            >
              <FaCheck />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
              style={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => setEditMapel(true)}
            >
              <FaPen className="color-secondary" />
            </button>
          )}

          <button
            className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
            style={{
              width: "40px",
              height: "40px",
            }}
            onClick={() => mataPelajaranId && removeGuru()}
          >
            <FaTrashAlt className="color-secondary" />
          </button>
        </div> */}
      </div>
      <hr className="hr-ss mb-0" />
    </div>
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
