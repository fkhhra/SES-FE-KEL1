import { getGeneratePenyusutan } from "client/InventarisClient";
import { otomatisArusKas, otomatisNeraca } from "client/KeuanganSekolahClient";
import HeaderRealisasiKeuangan from "components/Keuangan/RealisasiKeuangan/HeaderRealisasiKeuangan";
import useUser from "hooks/useUser";
import Link from "next/link";
import { useEffect } from "react";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const index = () => {
  const { user, setUser } = useUser();
  const _otomatisNeraca = async () => {
    const { data } = await otomatisNeraca();

    await getGeneratePenyusutan();
    // if (data) {
    //   setRekeningSekolah(data.rekSekolah);
    // }
  };
  const _otomatisArusKas = async () => {
    const { data } = await otomatisArusKas();
    // if (data) {
    //   setRekeningSekolah(data.rekSekolah);
    // }
  };
  useEffect(() => {
    _otomatisArusKas();
    _otomatisNeraca();
  }, []);
  const laporanKeuanganItems = [
    {
      nama: "Jurnal Umum",
      href: `${ssURL}/laporan-keuangan/jurnal-umum`,
      bgImg: `url("/img/bg-card-laporan-keuangan-jurnal-umum.svg")`,
    },
    {
      nama: "Laba Rugi",
      href: `${ssURL}/laporan-keuangan/laba-rugi/data-laporan`,
      bgImg: `url("/img/bg-card-laporan-keuangan-laba-rugi.svg")`,
    },
    {
      nama: "Neraca",
      href: `${ssURL}/laporan-keuangan/neraca/data-laporan`,
      bgImg: `url("/img/bg-card-laporan-keuangan-neraca.svg")`,
    },
    {
      nama: "Arus Kas",
      href: `${ssURL}/laporan-keuangan/arus-kas/data-laporan`,
      bgImg: `url("/img/bg-card-laporan-keuangan-arus-kas.svg")`,
    },
  ];

  return (
    <Layout isFluid={true}>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <HeaderRealisasiKeuangan
              ssURL={ssURL}
              judul={`Laporan`}
              user={user}
            />
          </div>
        </div>
        <div className="row g-4">
          {laporanKeuanganItems?.map((d) => {
            return (
              <div className="col-md-3">
                <Link href={d?.href}>
                  <a className="text-decoration-none">
                    <div
                      className="card card-ss p-4 bg-no-repeat bg-cover"
                      style={{
                        minHeight: "130px",
                        backgroundImage: `${d?.bgImg}`,
                        backgroundColor: "white",
                        backgroundPosition: "right bottom",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <a className="flex-grow-1">
                          <div className="flex-grow-1">
                            <h4 className="fw-extrabold color-dark mb-2">
                              {d?.nama}
                            </h4>
                          </div>
                        </a>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
