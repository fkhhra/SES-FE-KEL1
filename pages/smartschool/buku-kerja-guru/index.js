import { getBukuKerjaGuru } from "client/BukuKerjaGuruClient";
import LayoutBukuKerja from "components/BukuKerjaGuru/LayoutBukuKerja";
import { useEffect, useState } from "react";
import startCase from "lodash/startCase";
import { ssURL } from "client/clientAxios";
import Link from "next/link";
import CardBukuKerja from "components/BukuKerjaGuru/CardBukuKerja";
import Title from "components/BukuKerjaGuru/Title";
import router from "next/router";
import useSekolah from "hooks/useSekolah";

const index = () => {
  const { sekolah } = useSekolah();

  const [bukuKerja, setBukuKerja] = useState({});

  const _getBukuKerjaGuru = async () => {
    const { data } = await getBukuKerjaGuru();
    if (data) {
      setBukuKerja(data);
    }
  };

  const getInstrumen = (key) => {
    if (key.includes(1)) {
      return `${bukuKerja[key]}/4`;
    }

    if (key.includes(2)) {
      return `${bukuKerja[key]}/9`;
    }

    if (key.includes(3)) {
      return `${bukuKerja[key]}/12`;
    }

    if (key.includes(4)) {
      return `${bukuKerja[key]}/2`;
    }
  };

  const getRedirectUrl = (key) => {
    if (key.includes(1)) {
      return `${ssURL}/buku-kerja-guru/skl-ki-kd?buku_kerja=1`;
    }

    if (key.includes(2)) {
      return `${ssURL}/buku-kerja-guru/kode-etik?buku_kerja=2`;
    }

    if (key.includes(3)) {
      return `${ssURL}/buku-kerja-guru/daftar-kehadiran?buku_kerja=3`;
    }

    if (key.includes(4)) {
      return `${ssURL}/buku-kerja-guru/evaluasi-diri-kerja-guru?buku_kerja=4`;
    }
  };

  useEffect(() => {
    _getBukuKerjaGuru();
  }, []);

  const getBottomLabel = (key) => {
    return [
      {
        icon: "/img/icon-buku-kerja.svg",
        text: `${getInstrumen(key)} Instrumen`,
      },
    ];
  };

  return (
    <LayoutBukuKerja>
      <Title>Buku Kerja {sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}</Title>

      <div className="row mt-4 pt-4 gy-4">
        {Object.keys(bukuKerja).map((key, index) => (
          <Link href={getRedirectUrl(key)}>
            <a className="col-md-6">
              <CardBukuKerja
                key={`${index}-${new Date().getTime()}`}
                titleElement="h4"
                title={startCase(key)}
                bottomLabel={getBottomLabel(key)}
                // onClick={() => router.push(getRedirectUrl(key))}
              />
            </a>
          </Link>
        ))}
      </div>
    </LayoutBukuKerja>
  );
};

export default index;
