import { ssURL } from "client/clientAxios";
import {
  otomatisRencanaArusKas,
  otomatisRencanaNeraca,
} from "client/KeuanganSekolahClient";
import HeaderPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderPerencanaanKeuangan";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useUser from "hooks/useUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ tanggalAwal, tanggalAkhir, search, id }) => {
  const [neraca, setNeraca] = useState([]);
  const { user } = useUser();
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [debounceSearch] = useDebounce(searchTransaksi, 300);
  const _otomatisRencanaNeraca = async () => {
    const { data } = await otomatisRencanaNeraca(id);
    // if (data) {
    //   setRekeningSekolah(data.rekSekolah);
    // }
  };
  const _otomatisRencanaArusKas = async () => {
    const { data } = await otomatisRencanaArusKas(id);
    // if (data) {
    //   setRekeningSekolah(data.rekSekolah);
    // }
  };
  useEffect(() => {
    _otomatisRencanaArusKas();
    _otomatisRencanaNeraca();
  }, []);
  const laporanKeuanganItems = [
    {
      nama: "Jurnal Umum",
      href: `${ssURL}/perencanaan-keuangan/[id]/laporan-jurnal-umum`,
      as: `${ssURL}/perencanaan-keuangan/${id}/laporan-jurnal-umum`,
      bgImg: `url("/img/bg-card-laporan-keuangan-jurnal-umum.svg")`,
    },
    {
      nama: "Laba Rugi",
      href: `${ssURL}/perencanaan-keuangan/[id]/laporan-laba-rugi/data-laporan`,
      as: `${ssURL}/perencanaan-keuangan/${id}/laporan-laba-rugi/data-laporan`,
      bgImg: `url("/img/bg-card-laporan-keuangan-laba-rugi.svg")`,
    },
    {
      nama: "Neraca",
      href: `${ssURL}/perencanaan-keuangan/[id]/laporan-neraca/data-laporan`,
      as: `${ssURL}/perencanaan-keuangan/${id}/laporan-neraca/data-laporan`,
      bgImg: `url("/img/bg-card-laporan-keuangan-neraca.svg")`,
    },
    {
      nama: "Arus Kas",
      href: `${ssURL}/perencanaan-keuangan/[id]/laporan-arus-kas/data-laporan`,
      as: `${ssURL}/perencanaan-keuangan/${id}/laporan-arus-kas/data-laporan`,
      bgImg: `url("/img/bg-card-laporan-keuangan-arus-kas.svg")`,
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <HeaderPerencanaanKeuangan ssURL={ssURL} id={id} user={user} />
        <div className="row g-4">
          {laporanKeuanganItems?.map((d) => {
            return (
              <div className="col-md-4">
                <Link href={d?.href} as={d?.as}>
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

export async function getServerSideProps({
  query: { tanggalAwal, tanggalAkhir, search },
  params: { id },
}) {
  return {
    props: {
      id: id || null,
      tanggalAwal: tanggalAwal || null,
      tanggalAkhir: tanggalAkhir || null,
      search: search || null,
    },
  };
}

export default index;
