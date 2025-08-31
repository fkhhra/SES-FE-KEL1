import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";
import Link from "next/link";
import SelectShared from "components/Shared/SelectShared/SelectShared";

const HeaderPengawasanBukuKerjaGuru = ({ listGuru, currentUser }) => {
  const router = useRouter();
  const { pathname } = router;

  const optionsGuru = listGuru?.map(guru => {
    return {
      value: guru?.id,
      label: guru?.nama
    }
  });

  return (
    <header>
      <nav className="navbar navbar-ss navbar-expand-lg bg-primary position-fixed w-100 p-4 position-fixed py-3">
        <div className="container">
          <div className="w-100">
            <div className="row">
              <div className="col-md-12">
                <div className="row justify-content-between align-items-center">
                  <div className="col-md-5">
                    <div className="d-flex justify-content-between mb-md-0 mb-2">
                      <h6 className="mb-md-2 mb-0 fw-extrabold text-white">
                        Buku Kerja Guru
                      </h6>
                      <Link href={`${ssURL}/pengawasan/buku-kerja-guru`}>
                        <a className="ms-auto d-md-none d-block">
                          <img src="/img/btn-close.svg" alt="" />
                        </a>
                      </Link>
                    </div>
                    <div className="row">
                      <div className="col-md-8 mb-md-0 mb-2 pe-2">
                        <div className="select-jadwal-mengajar">
                          <SelectShared
                            name="guru"
                            placeholder="Pilih guru"
                            options={optionsGuru}
                            handleChangeSelect={(e) => router.replace(`${pathname}?user_id=${e?.value}`)}
                            value={currentUser?.id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 d-flex justify-content-end">
                    <Link href={`${ssURL}/pengawasan/buku-kerja-guru`}>
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

export default HeaderPengawasanBukuKerjaGuru;
