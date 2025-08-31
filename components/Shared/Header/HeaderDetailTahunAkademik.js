import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";
import Link from "next/link";
import SelectShared from "../SelectShared/SelectShared";
import { useEffect, useState } from "react";

const HeaderDetailTahunAkademik = ({ semuaTA, dataTA, route }) => {
  const router = useRouter();

  // const { tingkat = "X", id, jadwal_mengajar_id, hari, rombel } = router.query;

  const [refresh, setRefresh] = useState(false);

  // const handleChangeTingkatKelas = (tingkat) => {
  //   const queryParams = {
  //     tingkat: tingkat,
  //     hari: hari,
  //   };
  const [taId, setTaId] = useState(router.query?.id);

  //   router.replace({
  //     pathname: `${ssURL}/tahun-akademik/${idTa}/jadwal-mengajar/${jadwal_mengajar_id}`,
  //     query: queryParams,
  //   });
  // };
  if (taId != router?.query?.id) {
    setTaId(router?.query?.id);
    // useEffect(() => {
    router.reload();
    // }, [refresh]);
  }

  return (
    <header className="sticky-top" style={{ zIndex: "1050" }}>
      <nav
        className="navbar navbar-ss navbar-expand-lg bg-primary w-100 p-sm-2 py-2 px-1"
        style={{ zIndex: "1030px" }}
      >
        <div className="container-fluid">
          <div className="w-100">
            <div className="row">
              <div className="col-md-12">
                <div className="row justify-content-between align-items-center">
                  <div className="col-md-5">
                    <div className="d-flex justify-content-between mb-md-0 mb-2">
                      <h6 className="mb-md-2 mb-0 fw-extrabold text-white">
                        Tahun Akademik
                      </h6>
                      <Link
                        href={`${ssURL}/tahun-akademik-v2`}
                        as={`${ssURL}/tahun-akademik-v2`}
                      >
                        <a className="ms-auto d-md-none d-block">
                          <img src="/img/btn-close.svg" alt="" />
                        </a>
                      </Link>
                    </div>
                    <div className="row">
                      <div className="col-6 mb-md-0 mb-2 pe-2">
                        <div className="select-jadwal-mengajar">
                          <SelectShared
                            name="tahun_akademik"
                            placeholder="Pilih tahun akademik"
                            handleChangeSelect={(e) => {
                              router.replace(
                                `${ssURL}/tahun-akademik/${e?.value}/${route}`
                              );
                              // router.push(
                              //   `${ssURL}/tahun-akademik/${e?.value}/${route}`
                              // );
                              // setRefresh(true);
                              window.onload = function () {
                                if (!window.location.hash) {
                                  window.location = window.location + "#loaded";
                                  window.location.reload();
                                }
                              };
                              // location.reload();
                            }}
                            value={dataTA?.id}
                            options={semuaTA?.map((d) => {
                              return {
                                value: d?.id,
                                label: `${d?.tahun} - ${d?.semester} ${
                                  d?.aktif ? `( Aktif )` : ""
                                }`,
                              };
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 d-flex justify-content-end">
                    <Link
                      href={`${ssURL}/tahun-akademik-v2`}
                      as={`${ssURL}/tahun-akademik-v2`}
                    >
                      <a className="ms-auto d-md-block d-none">
                        <img src="/img/btn-close.svg" alt="" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderDetailTahunAkademik;
