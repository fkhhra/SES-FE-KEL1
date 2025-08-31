import { getBukuKerjaGuru } from "client/BukuKerjaGuruClient";
import LayoutBukuKerja from "components/BukuKerjaGuru/LayoutBukuKerja";
import { useEffect, useState } from "react";
import startCase from "lodash/startCase";
import { ssURL } from "client/clientAxios";
import Link from "next/link";
import CardBukuKerja from "components/BukuKerjaGuru/CardBukuKerja";
import Title from "components/BukuKerjaGuru/Title";
import router from "next/router";
import { getTingkat } from "client/PerangkatPembelajaranClient";
import useSekolah from "hooks/useSekolah";

const index = () => {
  const [tingkat, setTingkat] = useState([]);
  const { sekolah } = useSekolah();

  const _getTingkat = async () => {
    const { data, error } = await getTingkat();

    if (data) {
      setTingkat(data?.data);
    }
  };

  useEffect(() => {
    _getTingkat();
  }, []);

  return (
    <LayoutBukuKerja>
      {sekolah?.trial ? (
        <>
          <div className="row justify-content-center mt-md-0 mt-4">
            <div className="col-sm-7 col-10">
              <img
                src="/img/state-content-premium.png"
                alt=""
                className="img-fluid mb-md-0 mb-2"
              />
            </div>
            <div className="col-lg-8 col-md-10 text-center">
              <h4 className="color-dark fw-black mb-2">
                Anda Belum Bisa Mengakses Konten Ini
              </h4>
            </div>
            <div className="col-lg-7 col-md-9 text-center">
              <p className="fw-bold">
                <>
                  Klik tombol
                  {""}
                  <a
                    href="https://siplah.blibli.com/product/platform-manajemen-perangkat-pembelajaran/SIIN-0006-00011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="color-primary text-decoration-none"
                  >
                    {" "}
                    di bawah ini
                  </a>{" "}
                  {""}
                  untuk berlangganan Platform Manajemen Perangkat Pembelajaran
                </>
              </p>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <div className="col-md-12 text-center">
              <a
                href="https://siplah.blibli.com/product/platform-manajemen-perangkat-pembelajaran/SIIN-0006-00011"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ss btn-primary btn-primary-ss shadow-primary-ss fw-bold rounded-pill"
              >
                Berlangganan Sekarang
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-md-0 mt-4">
          <Title>Perangkat Pembelajaran</Title>
          <div className="row mt-4 pt-4 gy-4">
            {tingkat?.map((d, idx) => {
              return (
                <div
                  className="col-md-6"
                  key={`${idx}-${new Date().getTime()}`}
                >
                  <Link href={`${ssURL}/perangkat-pembelajaran/${d?.id}`}>
                    <a>
                      <div
                        className="card card-ss bg-white p-4 bg-no-repeat bg-x-right bg-y-bottom"
                        style={{
                          minHeight: "105px",
                          background: `url("/img/bg-card-perangkat-pembelajaran.svg")`,
                        }}
                      >
                        <h4 className="fw-extrabold color-dark mb-0">
                          Kelas {d?.tingkat} {d?.jenjang}
                        </h4>
                      </div>
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </LayoutBukuKerja>
  );
};

export default index;
