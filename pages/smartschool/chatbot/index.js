import { useEffect } from "react";
import { useRouter } from "next/router";
import Chatbot from "../../../components/ChatBot/ChatAI 2.0";
// import Layout from "../../../components/Layout/Layout";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import useUserSiswa from "hooks/useUserSiswa";
import useSekolah from "hooks/useSekolah";
import { meSekolah } from "client/SekolahClient";
import { getProfil } from "client/sharedClient";
import { ppdbURL, ssURL } from "client/clientAxios";

export default function index() {
  const router = useRouter();
  const { ta, setTa } = useTa();
  const { setUser, user } = useUser();
  const { setUserSiswa, userSiswa } = useUserSiswa();
  const { setSekolah, sekolah } = useSekolah();

  const getProfilData = async () => {
    const { data, status } = await getProfil();
    if (data && status === 200) {
      if (data.user?.role == "ppdb") {
        router.push(`${ppdbURL}`);
      }

      setTa(data?.ta);
      setUser(data?.user);
      if (
        (data?.user?.role == "siswa" && sekolah?.id == 8123) ||
        (data?.user?.role == "siswa" && sekolah?.id == 8027)
      ) {
        await checkUserAgent(JSON?.parse(sekolah?.fitur?.fitur));
      }
      setUserSiswa(data?.userSiswa);
    }

    if (status === 401 || status === 403) {
      router.push(`${ssURL}/login`);
    }
  };

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      if (data?.sekolah?.domainBackup) {
        if (location.href.indexOf(data?.sekolah?.domainBackup) > -1) {
          return;
        }
        router.push(data?.sekolah?.domainBackup);
      }
      setSekolah(data.sekolah);
    }
  };

  useEffect(() => {
    if (window.location.origin !== 'https://vps.smarteschool.id' && 
      !window.location.origin.includes('localhost')) router.push(`/under-construction`);

    getMeSekolahData();
    
    getProfilData();
  }, []);

  return (
    <>
      <Chatbot />
    </>
  );
}