import { checkKeteranganSikap } from "../../utilities/RaporUtils";

const SectionSikap = ({
  isReadOnly = false,
  sikap,
  siswa,
  sikapsosial,
  sikapspiritual,
  tingkat,
  sekolah,
  ta,
}) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold text-uppercase mb-3 ms-4">A. Sikap</h6>
      <table className="w-100 table">
        <thead>
          <tr>
            <th
              className="text-center fw-bold fs-12-ss"
              style={{ width: "5%", paddingTop: "19px", paddingBottom: "19px" }}
            >
              No
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "30%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Kompetensi Inti
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "52%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Deskripsi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="align-text-top fs-12-ss text-center">1</td>
            <td className="align-text-top fs-12-ss">Sikap Spiritual</td>
            {sekolah?.id == 578 ? (
              <td className="align-text-top fs-12-ss">
                {!sikap?.mSikapSpiritualDitunjukkanId
                  ? `-`
                  : `${siswa} 
                       ${checkKeteranganSikap(
                         sikap?.mSikapSpiritualDitunjukkanId,
                         sikapspiritual
                       )}`}{" "}
                perlu meningkatkan{" "}
                {!sikap?.mSikapSpiritualDitingkatkanId
                  ? `-`
                  : ` ${checkKeteranganSikap(
                      sikap?.mSikapSpiritualDitingkatkanId,
                      sikapspiritual
                    )}`}
              </td>
            ) : (
              <>
                <p className="align-text-top fs-12-ss" height={150}>
                  {sekolah?.id == 15 ? (
                    <>
                      {(ta?.id == 40 || ta?.id == 41) && tingkat == "X" ? (
                        `
                      Peserta didik telah menunjukkan sikap Menjalankan ibadah sesuai dengan agamanya, Memberi salam pada saat awal dan akhir kegiatan. Namun sikap Berdoa sebelum dan sesudah melakukan kegiatan masih perlu ditingkatkan lagi.
                      `
                      ) : // ${siswa} Berdoa sebelum dan sesudah melakukan kegiatan, Menjalankan ibadah sesuai dengan agamanya, Memberi salam pada saat awal dan akhir kegiatan
                      (ta?.id == 47 || ta?.id == 8186) && tingkat == "XI" ? (
                        `
                        Peserta didik telah menunjukkan sikap Menjalankan ibadah sesuai dengan agamanya, Bersyukur atas nikmat dan karunia Tuhan yang Maha Esa, Mensyukuri kemampuan manusia dalam mengendalikan diri. Namun sikap Bersyukur ketika berhasil mengerjakan sesuatu masih perlu ditingkatkan lagi.
                        `
                      ) : // ${siswa} Menjalankan ibadah sesuai dengan agamanya, Bersyukur atas nikmat dan karunia Tuhan yang Maha Esa, Mensyukuri kemampuan manusia dalam mengendalikan diri, Bersyukur ketika berhasil mengerjakan sesuatu
                      (ta?.id == 8385 || ta?.id == 8692) && tingkat == "XII" ? (
                        `
                        Peserta didik telah menunjukkan sikap Menjalankan ibadah sesuai dengan agamanya, Berserah Diri (tawakal) kepada Tuhan setelah berikhtiar atau melakukan usaha, Memelihara hubungan baik dengan sesama umat. Namun sikap Menghormati orang lain yang menjalankan ibadah sesuai dengan agamany masih perlu ditingkatkan lagi.
                        `
                      ) : (
                        // ${siswa} Menjalankan ibadah sesuai dengan agamanya, Berserah Diri (tawakal) kepada Tuhan setelah berikhtiar atau melakukan usaha, Memelihara hubungan baik dengan sesama umat, Menghormati orang lain yang menjalankan ibadah sesuai dengan agamany
                        <>
                          {!sikap?.mSikapSpiritualDitunjukkanId
                            ? `-`
                            : `Peserta didik telah menunjukkan sikap
                    ${checkKeteranganSikap(
                      sikap?.mSikapSpiritualDitunjukkanId,
                      sikapspiritual
                    )} 
                    dengan baik. Namun sikap 
                    ${checkKeteranganSikap(
                      sikap?.mSikapSpiritualDitingkatkanId,
                      sikapspiritual
                    )} 
                    masih perlu ditingkatkan lagi.`}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {!sikap?.mSikapSpiritualDitunjukkanId
                        ? `-`
                        : `${siswa} 
                ${checkKeteranganSikap(
                  sikap?.mSikapSpiritualDitunjukkanId,
                  sikapspiritual
                )}`}
                    </>
                  )}
                </p>
              </>
              // <td className="align-text-top fs-12-ss" height={150}>
              //   {!sikap?.mSikapSpiritualDitunjukkanId
              //     ? `-`
              //     : `${siswa} ${checkKeteranganSikap(
              //         sikap?.mSikapSpiritualDitunjukkanId,
              //         sikapspiritual
              //       )}`}
              // </td>
            )}
          </tr>
          <tr>
            <td className="align-text-top fs-12-ss text-center">2</td>
            <td className="align-text-top fs-12-ss">Sikap Sosial</td>
            {sekolah?.id == 578 ? (
              <td className="align-text-top fs-12-ss">
                {!sikap?.mSikapSosialDitunjukkanId
                  ? `-`
                  : `${siswa} 
                      ${checkKeteranganSikap(
                        sikap?.mSikapSosialDitunjukkanId,
                        sikapsosial
                      )}`}{" "}
                perlu meningkatkan{" "}
                {!sikap?.mSikapSosialDitingkatkanId
                  ? `-`
                  : `${checkKeteranganSikap(
                      sikap?.mSikapSosialDitingkatkanId,
                      sikapsosial
                    )}`}
              </td>
            ) : (
              <>
                {sekolah?.id == 15 ? (
                  <p className="align-text-top fs-12-ss" height={150}>
                    {(ta?.id == 40 || ta?.id == 41) && tingkat == "X" ? (
                      `Peserta didik telah menunjukkan sikap Tekun, Jujur, Disiplin, Percaya Diri dengan baik. Namun sikap Gotong Royong masih perlu ditingkatkan lagi.`
                    ) : // ${siswa} Tekun, Jujur, Disiplin, Percaya Diri
                    (ta?.id == 47 || ta?.id == 8186) && tingkat == "XI" ? (
                      `
                      Peserta didik telah menunjukkan sikap Bersykur, Percaya Diri, Bekerja Sama, Sopan Santun dengan baik. Namun sikap Tanggung Jawab masih perlu ditingkatkan lagi.
                      `
                    ) : // ${siswa} Bersykur, Percaya Diri, Bekerja Sama, Sopan Santun
                    (ta?.id == 8385 || ta?.id == 8692) && tingkat == "XII" ? (
                      `
                      Peserta didik telah menunjukkan sikap Jujur, Percaya Diri, Tanggung Jawab, Gotong Royong dengan baik. Namun sikap Bekerja Sama masih perlu ditingkatkan lagi.
                      `
                    ) : (
                      // ${siswa} Jujur, Percaya Diri, Tanggung Jawab, Gotong Royong
                      <>
                        {!sikap?.mSikapSosialDitunjukkanId
                          ? `-`
                          : `Peserta didik telah menunjukkan sikap
                    ${checkKeteranganSikap(
                      sikap?.mSikapSosialDitunjukkanId,
                      sikapsosial
                    )} 
                    dengan baik. Namun sikap 
                    ${checkKeteranganSikap(
                      sikap?.mSikapSosialDitingkatkanId,
                      sikapsosial
                    )} 
                    masih perlu ditingkatkan lagi.`}
                      </>
                    )}
                  </p>
                ) : (
                  <p className="fw-semibold mb-0">
                    {!sikap?.mSikapSosialDitunjukkanId
                      ? `-`
                      : `${siswa} 
                      ${checkKeteranganSikap(
                        sikap?.mSikapSosialDitunjukkanId,
                        sikapsosial
                      )}`}
                  </p>
                )}
              </>
              // <td className="align-text-top fs-12-ss" height={150}>
              //   {!sikap?.mSikapSosialDitunjukkanId
              //     ? `-`
              //     : `${siswa}
              //           ${checkKeteranganSikap(
              //             sikap?.mSikapSosialDitunjukkanId,
              //             sikapsosial
              //           )}`}
              // </td>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default SectionSikap;
