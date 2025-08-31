import { getProfilUser } from "client/AuthClient";
import { getGelombangPPDB } from "client/GelombangPPDB";
import { getMajors } from "client/MajorsClient";
import { meSekolah } from "client/SekolahClient";
import useSekolah from "hooks/useSekolah";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import { useEffect, useState } from "react";
import { getFormatDate, momentPackage, padNumber } from "utilities/HelperUtils";

const index = ({}) => {
  const { ta } = useTa();
  const { sekolah, setSekolah } = useSekolah();
  const { user, setUser } = useUser();
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const [loading, setLoading] = useState(true);

  const {
    gelombang,
    gelombangAktif,
    gelombangPembelian,
    semuaGelombangPengembalian,
  } = gelombangPPDB;
  const namaGelombang = gelombangAktif?.gelombang?.nama?.toLowerCase();

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
      setLoading(false);
    }
  };

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
    }
  };

  const [majors, setMajors] = useState([]);

  const getMajorsData = async () => {
    const { data } = await getMajors();

    if (data) {
      setMajors(data.jurusan);
    }
  };

  useEffect(() => {
    if (!loading) {
      setTimeout(function () {
        window.print();
      }, 1500);
    }
  }, [loading]);
  useEffect(() => {
    _getGelombangPPDB();
    _getProfil();
    getMeSekolahData();
    getMajorsData();
  }, []);

  const today = new Date().toLocaleDateString();

  return (
    <>
    <div className="w-[640px] h-[400px] border-2 border-gray-300 p-8 rounded-md bg-gradient-to-r from-blue-100 to-blue-300 relative">
      <div className="flex items-start">
        <img 
          src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
          alt="Logo SMA" 
          className="w-20 h-20 object-contain mr-4"
        />
        <div className="ml-12">
          <h1 className="text-xl font-bold text-center">KARTU PESERTA</h1>
          <h2 className="text-lg font-semibold text-center leading-tight">SELEKSI MASUK PENERIMAAN MURID BARU</h2>
          <h2 className="text-lg font-semibold text-center leading-tight">{sekolah?.nama}</h2>
          <h3 className="text-md font-semibold text-center">TAHUN {momentPackage().add(6, "months").format("YYYY")} -{" "}
          {momentPackage().add(18, "months").format("YYYY")}</h3>
        </div>
      </div>

      <div className="flex mt-4">
        <div className="w-[108px] h-[144px] bg-gray-300 mr-4 flex items-center justify-center">
          <img 
            src={user?.avatar}
            alt="Photo"
          />
        </div>

        <div className="flex flex-col space-y-2 text-md">
          <pre>
            <div><strong>NAMA          :</strong>{user?.nama || "-"}</div>
            <div><strong>NO REGRISTASI :</strong> 09876543</div>
            <div><strong>JALUR         :</strong> SMP Suluh</div>
            <div><strong>ASAL SEKOLAH  :</strong> {user?.profil?.asalSekolah || "-"}</div>
            <div><strong>KETERANGAN    :</strong> Gagal</div>
          </pre>
        </div>
      </div>

      <div className="absolute bottom-4 right-8 text-sm">
        <div className="d-flex justify-end items-center text-center">
          <p className="italic">KEPALA SMA SULUH</p>
          <img 
            src="https://staging.dimensy.id/assets/img/articles/mceclip017.png" 
            alt="Tanda Tangan" 
            className="w-20 h-20 mx-auto"
          />
          <p className="font-bold">YUDI TRI NUGRAHA, SE</p>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-sm">
        <p className="font-semibold">{today}</p>
      </div>
    </div>
    </>
  
    )
};
export default index;