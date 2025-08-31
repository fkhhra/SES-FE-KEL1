import { useRouter } from "next/router";
import DaftarPengajuanKonsultasi from "./DaftarPengajuanKonsultasi";
import DetailPengajuanPertemuan from "./DetailPengajuanPertemuan";

const BukuKunjungan = () => {

  const router = useRouter();
  const { query: { detail } } = router;

  return (
    <div className="col-md-12 col-lg-9">
      { !detail
        ? <DaftarPengajuanKonsultasi />
        : <DetailPengajuanPertemuan />
      }
    </div>
  )
}

export default BukuKunjungan;