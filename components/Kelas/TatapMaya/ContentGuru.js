import React from "react";
import Tabs from "components/Shared/Tabs/Tabs";
import Informasi from "./tabs-guru/Informasi";
import AbsenSiswa from "./tabs-guru/AbsenSiswa";
import JurnalHarian from "./tabs-guru/JurnalHarian";

const ContentGuru = ({ detailData, setDetailData, postKomen, _getDetailTimeline }) => {
  const navItemsPertemuan = [
    {
      id: "informasi",
      nav: "Informasi",
      active: true,
      dataJoyride: "informasi",
      content: <Informasi detailData={detailData} postKomen={postKomen} />
    },
    {
      id: "absen-siswa",
      nav: "Absen Siswa",
      active: false,
      dataJoyride: "absen-siswa",
      content: <AbsenSiswa detailData={detailData} setDetailData={setDetailData} _getDetailTimeline={_getDetailTimeline} />,
    },
    {
      id: "jurnal-harian",
      nav: "Jurnal Harian",
      active: false,
      dataJoyride: "jurnal-harian",
      content: <JurnalHarian detailData={detailData} _getDetailTimeline={_getDetailTimeline} />,
    },
  ];

  return <Tabs navItems={navItemsPertemuan} />
}

export default ContentGuru;