import { ssURL } from "client/clientAxios";
import CardBukuKerja from "components/BukuKerjaGuru/CardBukuKerja";
import LayoutBukuKerjaDetail from "components/BukuKerjaGuru/LayoutBukuKerjaDetail"
import Title from "components/BukuKerjaGuru/Title";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import Link from "next/link"
import router from "next/router";

const index = (props) => {

  const { bukuKerjaDetailData } = useBukuKerjaDetail();
  const {
    data: datas
  } = bukuKerjaDetailData || {};

  return (
    <LayoutBukuKerjaDetail>
      <Title>
        Daftar Nilai
      </Title>

      <div className="row mt-4 pt-4 g-4">
        { datas?.map(data =>
          <CardBukuKerja
            key={data?.id}
            title={`Kelas ${data?.rombel?.tingkat}`}
            topLabel={[{ text: `${data?.ta?.tahun} - ${data?.ta?.semester}` }]}
            bottomLabel={[ { icon: "/img/icon-mapel.svg", text: data?.mataPelajaran?.nama }, { icon: "/img/icon-kkm.svg", text: `KKM: ${data?.mataPelajaran?.kkm}` } ]}
            backgroundIcon="/img/icon-buku-kerja-3.png"
            onClick={() => router.push(`${ssURL}/buku-kerja-guru/daftar-nilai/${data?.id}?rombel_id=${data?.rombel?.id}&mata_pelajaran_id=${data?.mataPelajaran?.id}&nav=tugas`)}
          />
        )}
      </div>
    </LayoutBukuKerjaDetail>
  )
}

export default index