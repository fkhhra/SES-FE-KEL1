import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";
import Link from "next/link";
import SelectShared from "../SelectShared/SelectShared";

const HeaderDetailPenerimaanPerusahaan = ({
  tingkatRombel,
  listRombel,
  perusahaan,
  listpenerimaan,
  selectPenerimaan,
  urlPenerimaan,
  dataPerusahaan,
}) => {
  const router = useRouter();

  const { tingkat = "X", id, jadwal_mengajar_id, hari, rombel } = router.query;

  const handleChangeTingkatKelas = (tingkat) => {
    const queryParams = {
      tingkat: tingkat,
      hari: hari,
    };

    router.replace({
      pathname: `${ssURL}/tahun-akademik/${id}/jadwal-mengajar/${jadwal_mengajar_id}`,
      query: queryParams,
    });
  };

  return (
    <header className="sticky-top" style={{ zIndex: "1050" }}>
      <nav
        className="navbar navbar-ss navbar-expand-lg bg-primary w-100 p-sm-2 py-2 px-1"
        style={{ zIndex: "1030px" }}
      >
        <div className="container">
          <div className="w-100">
            <div className="row">
              <div className="col-md-12">
                <div className="row justify-content-between align-items-center">
                  <div className="col-md-7">
                    <div className="d-flex justify-content-between mb-md-0 mb-2">
                      <h6 className="mb-md-2 mb-0 fw-extrabold text-white">
                        Penerimaan {perusahaan}
                      </h6>
                      <Link href={`${ssURL}/perusahaan/1/penerimaan`}>
                        <a className="ms-auto d-md-none d-block">
                          <img src="/img/btn-close.svg" alt="" />
                        </a>
                      </Link>
                    </div>
                    <div className="row">
                      <div className="col-md-5 mb-md-0 mb-2 pe-2">
                        <div className="select-jadwal-mengajar">
                          <SelectShared
                            name="penerimaan"
                            placeholder="Pilih penerimaan"
                            handleChangeSelect={urlPenerimaan}
                            value={selectPenerimaan}
                            options={listpenerimaan?.map((d) => {
                              return {
                                value: d?.id,
                                label: d?.nama,
                              };
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 d-flex justify-content-end">
                    <Link
                      href={`${ssURL}/perusahaan/${dataPerusahaan?.id}/penerimaan`}
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

export default HeaderDetailPenerimaanPerusahaan;
