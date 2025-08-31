import { getAkunTransaksi } from "client/KeuanganSekolahClient";
import React, { useEffect, useState } from "react";
import { async } from "regenerator-runtime";
import { formatAngkaTitik } from "utilities/HelperUtils";
import ModalDataTransaksiAkun from "./ModalDataTransaksiAkun";

const ListLabaRugi = ({
  data,
  rumus,
  levelAkun,
  hasilRumus,
  labaAkumulasi,
  totalSiswa,
}) => {
  const dataLain = data.filter((e) => e?.kategori);
  const [dataTransaksi, setDataTransaksi] = useState([]);

  const handleClickData = async (data) => {
    const { data: akunTransaksi } = await getAkunTransaksi(data);

    if (akunTransaksi) {
      setDataTransaksi(akunTransaksi);
    }
  };
  console.log(dataTransaksi);
  // const datass = data.filter((e) => e.kategori == "Beban");
  // const beban = [
  //   { kategori: "Beban", urutan: datass?.[0]?.urutan, data: [...datass] },
  // ];

  const dataFix = [...rumus, ...dataLain];
  // console.log(
  //   dataFix.sort(function (a, b) {
  //     return a.urutan - b.urutan;
  //   })
  // );

  let rumus1 = 0;
  return (
    <>
      {dataFix
        .sort(function (a, b) {
          return a.urutan - b.urutan;
        })
        .map((d) => {
          if (!d?.kategori) {
            rumus1 = rumus1 + 1;
          }
          if (d?.kategori) {
            return (
              <>
                <tr>
                  <td className="py-2 border-start-0 border-end-0"></td>
                  <td className="py-2 border-start-0 border-end-0" colSpan={3}>
                    <span className={`color-dark fw-bold text-uppercase`}>
                      {d?.nama}
                    </span>
                  </td>
                </tr>
                {d?.akunLabaRugi?.map((e) => {
                  let totalAkun = e?.total;
                  let totalAkunRencana = e?.totalRencana;

                  return (
                    <>
                      <tr>
                        <td className="py-2 fw-semibold border-start-0">
                          <a
                            data-bs-toggle="modal"
                            data-bs-target="#modalDataTransaksiAkun"
                            onClick={() => handleClickData(e?.akun?.id)}
                          >
                            {e?.akun?.kode}
                          </a>
                        </td>
                        <td className="py-2 fw-semibold text-uppercase">
                          {e?.akun?.nama}
                        </td>
                        <td className="py-2">
                          <span className={`color-dark fw-extrabold`}>
                            {formatAngkaTitik(totalAkunRencana)}
                          </span>
                        </td>
                        <td className="py-2 border-end-0">
                          <span className={`color-dark fw-extrabold`}></span>
                        </td>
                        <td className="py-2">
                          <span className={`color-dark fw-extrabold`}>
                            {formatAngkaTitik(totalAkun)}
                          </span>
                        </td>
                        <td className="py-2 border-end-0">
                          <span className={`color-dark fw-extrabold`}></span>
                        </td>
                      </tr>
                      {e?.children?.length
                        ? e?.children?.map((ss) => (
                            <tr>
                              <td className="py-2 fw-semibold border-start-0">
                                {ss?.kode}
                              </td>
                              <td className="py-2 fw-semibold text-uppercase">
                                - {ss?.nama}
                              </td>
                              <td className="py-2">
                                <span className={`color-dark fw-extrabold`}>
                                  {formatAngkaTitik(ss?.totalRencana)}
                                </span>
                              </td>
                              <td className="py-2 border-end-0">
                                <span
                                  className={`color-dark fw-extrabold`}
                                ></span>
                              </td>
                              <td className="py-2">
                                <span className={`color-dark fw-extrabold`}>
                                  {formatAngkaTitik(ss?.total)}
                                </span>
                              </td>
                              <td className="py-2 border-end-0">
                                <span
                                  className={`color-dark fw-extrabold`}
                                ></span>
                              </td>
                            </tr>
                          ))
                        : ""}
                    </>
                  );
                })}
                <tr>
                  <td className="py-2 fw-semibold border-start-0"></td>
                  <td className="py-2 color-dark fw-bold text-uppercase">
                    TOTAL {d?.nama}
                  </td>
                  <td className="py-2">
                    <span className={`color-dark fw-extrabold`}></span>
                  </td>
                  <td className="py-2 border-end-0">
                    <span className={`color-dark fw-extrabold`}>
                      {formatAngkaTitik(d?.totalRencana)}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`color-dark fw-extrabold`}></span>
                  </td>
                  <td className="py-2 border-end-0">
                    <span className={`color-dark fw-extrabold`}>
                      {formatAngkaTitik(d?.total)}
                    </span>
                  </td>
                </tr>
              </>
            );
          }
          // else if (d?.kategori == "Beban") {
          //   const beban = d?.data.map((s, id) => {
          //     console.log(s);
          //     return (
          //       <>
          //         {id == 0 ? (
          //           <tr>
          //             <td className="py-2 border-start-0 border-end-0"></td>
          //             <td
          //               className="py-2 border-start-0 border-end-0"
          //               colSpan={6}
          //             >
          //               <span className={`color-dark fw-bold text-uppercase`}>
          //                 BEBAN
          //               </span>
          //             </td>
          //           </tr>
          //         ) : (
          //           <tr></tr>
          //         )}
          //         <tr>
          //           <td className="py-2 border-start-0 border-end-0"></td>
          //           <td
          //             className="py-2 border-start-0 border-end-0"
          //             colSpan={3}
          //           >
          //             <span className={`color-dark fw-bold text-uppercase`}>
          //               {s?.nama}
          //             </span>
          //           </td>
          //         </tr>
          //         {s?.akunLabaRugi?.map((e) => {
          //           let totalAkun = e?.total;
          //           let totalAkunRencana = e?.totalRencana;

          //           return (
          //             <tr>
          //               <td className="py-2 fw-semibold border-start-0">
          //                 {e?.akun?.kode}
          //               </td>
          //               <td className="py-2 fw-semibold text-uppercase">
          //                 {e?.akun?.nama}
          //               </td>
          //               <td className="py-2">
          //                 <span className={`color-dark fw-extrabold`}>
          //                   {formatAngkaTitik(totalAkunRencana)}
          //                 </span>
          //               </td>
          //               <td className="py-2 border-end-0">
          //                 <span className={`color-dark fw-extrabold`}></span>
          //               </td>
          //               <td className="py-2">
          //                 <span className={`color-dark fw-extrabold`}>
          //                   {formatAngkaTitik(totalAkun)}
          //                 </span>
          //               </td>
          //               <td className="py-2 border-end-0">
          //                 <span className={`color-dark fw-extrabold`}></span>
          //               </td>
          //             </tr>
          //           );
          //         })}
          //         <tr>
          //           <td className="py-2 fw-semibold border-start-0"></td>
          //           <td className="py-2 color-dark fw-bold text-uppercase">
          //             TOTAL {s?.nama}
          //           </td>
          //           <td className="py-2">
          //             <span className={`color-dark fw-extrabold`}></span>
          //           </td>
          //           <td className="py-2 border-end-0">
          //             <span className={`color-dark fw-extrabold`}>
          //               {formatAngkaTitik(s?.totalRencana)}
          //             </span>
          //           </td>
          //           <td className="py-2">
          //             <span className={`color-dark fw-extrabold`}></span>
          //           </td>
          //           <td className="py-2 border-end-0">
          //             <span className={`color-dark fw-extrabold`}>
          //               {formatAngkaTitik(s?.total)}
          //             </span>
          //           </td>
          //         </tr>
          //         {id + 1 ==
          //         data.filter((er) => er?.kategori == "Beban").length ? (
          //           <tr>
          //             <td className="py-2 fw-semibold border-start-0"></td>
          //             <td className="py-2 color-dark fw-bold text-uppercase">
          //               TOTAL BEBAN
          //             </td>
          //             <td className="py-2">
          //               <span className={`color-dark fw-extrabold`}></span>
          //             </td>
          //             <td className="py-2 border-end-0">
          //               <span className={`color-dark fw-extrabold`}>
          //                 {formatAngkaTitik(s?.totalBebanRencana)}
          //               </span>
          //             </td>
          //             <td className="py-2">
          //               <span className={`color-dark fw-extrabold`}></span>
          //             </td>
          //             <td className="py-2 border-end-0">
          //               <span className={`color-dark fw-extrabold`}>
          //                 {formatAngkaTitik(s?.totalBeban)}
          //               </span>
          //             </td>
          //           </tr>
          //         ) : (
          //           <tr></tr>
          //         )}
          //       </>
          //     );
          //   });
          //   return beban;
          // }
          else {
            return (
              <tr>
                <td
                  className="py-2 fw-semibold border-start-0 border-end-0"
                  style={{ background: "#F0F0F1" }}
                ></td>
                <td
                  className="py-2 color-dark fw-extrabold text-uppercase border-start-0 border-end-0"
                  colSpan={2}
                  style={{ background: "#F0F0F1" }}
                >
                  {d?.nama} {d?.nama == "HPS" ? `(${totalSiswa} Siswa)` : ""}
                </td>
                <td
                  className="py-2 border-end-0 border-start-0 border-left-0"
                  style={{ background: "#F0F0F1" }}
                >
                  <span className={`color-dark fw-extrabold`}>
                    {formatAngkaTitik(
                      hasilRumus?.[rumus1 - 1]?.["totalLabaRugiRencana"]
                    )}
                  </span>
                </td>
                <td
                  className="py-2 border-end-0 border-start-0 border-left-0"
                  style={{ background: "#F0F0F1" }}
                ></td>
                <td
                  className="py-2 border-end-0 border-start-0 border-left-0"
                  style={{ background: "#F0F0F1" }}
                >
                  <span className={`color-dark fw-extrabold`}>
                    {formatAngkaTitik(
                      hasilRumus?.[rumus1 - 1]?.["totalLabaRugi"]
                    )}
                  </span>
                </td>
              </tr>
            );
          }
        })}

      <tr>
        <td
          className="py-2 fw-semibold border-start-0 border-end-0"
          style={{ background: "#F0F0F1" }}
        ></td>
        <td
          className="py-2 color-dark fw-extrabold text-uppercase border-start-0 border-end-0"
          colSpan={2}
          style={{ background: "#F0F0F1" }}
        >
          KUMULATIF LABA (RUGI)
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>
            {" "}
            {formatAngkaTitik(labaAkumulasi.totalLabaRugiKumulatifRencana)}
          </span>
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        ></td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>
            {formatAngkaTitik(labaAkumulasi.totalLabaRugiKumulatif)}
          </span>
        </td>
      </tr>
      {/* {data
        ?.filter((er) => er?.kategori == "Lainnya")
        .map((d) => {
          return (
            <>
              <tr>
                <td className="py-2 border-start-0 border-end-0"></td>
                <td className="py-2 border-start-0 border-end-0" colSpan={3}>
                  <span className={`color-dark fw-bold text-uppercase`}>
                    {d?.nama}
                  </span>
                </td>
              </tr>
              {d?.akunLabaRugi?.map((e) => {
                let totalAkun = e?.total;
                let totalAkunRencana = e?.totalRencana;

                return (
                  <tr>
                    <td className="py-2 fw-semibold border-start-0">
                      {e?.akun?.kode}
                    </td>
                    <td className="py-2 fw-semibold text-uppercase">
                      {e?.akun?.nama}
                    </td>
                    <td className="py-2">
                      <span className={`color-dark fw-extrabold`}>
                        {formatAngkaTitik(totalAkunRencana)}
                      </span>
                    </td>
                    <td className="py-2 border-end-0">
                      <span className={`color-dark fw-extrabold`}></span>
                    </td>
                    <td className="py-2">
                      <span className={`color-dark fw-extrabold`}>
                        {formatAngkaTitik(totalAkun)}
                      </span>
                    </td>
                    <td className="py-2 border-end-0">
                      <span className={`color-dark fw-extrabold`}></span>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="py-2 fw-semibold border-start-0"></td>
                <td className="py-2 color-dark fw-bold text-uppercase">
                  TOTAL {d?.nama}
                </td>
                <td className="py-2">
                  <span className={`color-dark fw-extrabold`}></span>
                </td>
                <td className="py-2 border-end-0">
                  <span className={`color-dark fw-extrabold`}>
                    {formatAngkaTitik(d?.totalRencana)}
                  </span>
                </td>
                <td className="py-2">
                  <span className={`color-dark fw-extrabold`}></span>
                </td>
                <td className="py-2 border-end-0">
                  <span className={`color-dark fw-extrabold`}>
                    {formatAngkaTitik(d?.total)}
                  </span>
                </td>
              </tr>
            </>
          );
        })}
      {data
        ?.filter((er) => er?.kategori == "Beban")
        .map((d, id) => {
          return (
            <>
              {id == 0 ? (
                <tr>
                  <td className="py-2 border-start-0 border-end-0"></td>
                  <td className="py-2 border-start-0 border-end-0" colSpan={6}>
                    <span className={`color-dark fw-bold text-uppercase`}>
                      BEBAN
                    </span>
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
              <tr>
                <td className="py-2 border-start-0 border-end-0"></td>
                <td className="py-2 border-start-0 border-end-0" colSpan={3}>
                  <span className={`color-dark fw-bold text-uppercase`}>
                    {d?.nama}
                  </span>
                </td>
              </tr>
              {d?.akunLabaRugi?.map((e) => {
                let totalAkun = e?.total;
                let totalAkunRencana = e?.totalRencana;

                return (
                  <tr>
                    <td className="py-2 fw-semibold border-start-0">
                      {e?.akun?.kode}
                    </td>
                    <td className="py-2 fw-semibold text-uppercase">
                      {e?.akun?.nama}
                    </td>
                    <td className="py-2">
                      <span className={`color-dark fw-extrabold`}>
                        {formatAngkaTitik(totalAkunRencana)}
                      </span>
                    </td>
                    <td className="py-2 border-end-0">
                      <span className={`color-dark fw-extrabold`}></span>
                    </td>
                    <td className="py-2">
                      <span className={`color-dark fw-extrabold`}>
                        {formatAngkaTitik(totalAkun)}
                      </span>
                    </td>
                    <td className="py-2 border-end-0">
                      <span className={`color-dark fw-extrabold`}></span>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="py-2 fw-semibold border-start-0"></td>
                <td className="py-2 color-dark fw-bold text-uppercase">
                  TOTAL {d?.nama}
                </td>
                <td className="py-2">
                  <span className={`color-dark fw-extrabold`}></span>
                </td>
                <td className="py-2 border-end-0">
                  <span className={`color-dark fw-extrabold`}>
                    {formatAngkaTitik(d?.totalRencana)}
                  </span>
                </td>
                <td className="py-2">
                  <span className={`color-dark fw-extrabold`}></span>
                </td>
                <td className="py-2 border-end-0">
                  <span className={`color-dark fw-extrabold`}>
                    {formatAngkaTitik(d?.total)}
                  </span>
                </td>
              </tr>
              {id + 1 == data.filter((er) => er?.kategori == "Beban").length ? (
                <tr>
                  <td className="py-2 fw-semibold border-start-0"></td>
                  <td className="py-2 color-dark fw-bold text-uppercase">
                    TOTAL BEBAN
                  </td>
                  <td className="py-2">
                    <span className={`color-dark fw-extrabold`}></span>
                  </td>
                  <td className="py-2 border-end-0">
                    <span className={`color-dark fw-extrabold`}>
                      {formatAngkaTitik(d?.totalBebanRencana)}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`color-dark fw-extrabold`}></span>
                  </td>
                  <td className="py-2 border-end-0">
                    <span className={`color-dark fw-extrabold`}>
                      {formatAngkaTitik(d?.totalBeban)}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
            </>
          );
        })}
      {rumus.map((d, idx) => {
        return (
          <tr>
            <td
              className="py-2 fw-semibold border-start-0 border-end-0"
              style={{ background: "#F0F0F1" }}
            ></td>
            <td
              className="py-2 color-dark fw-extrabold text-uppercase border-start-0 border-end-0"
              colSpan={2}
              style={{ background: "#F0F0F1" }}
            >
              {d?.nama}
            </td>
            <td
              className="py-2 border-end-0 border-start-0 border-left-0"
              style={{ background: "#F0F0F1" }}
            >
              <span className={`color-dark fw-extrabold`}>
                {formatAngkaTitik(hasilRumus?.[idx]?.["totalLabaRugiRencana"])}
              </span>
            </td>
            <td
              className="py-2 border-end-0 border-start-0 border-left-0"
              style={{ background: "#F0F0F1" }}
            ></td>
            <td
              className="py-2 border-end-0 border-start-0 border-left-0"
              style={{ background: "#F0F0F1" }}
            >
              <span className={`color-dark fw-extrabold`}>
                {formatAngkaTitik(hasilRumus?.[idx]?.["totalLabaRugi"])}
              </span>
            </td>
          </tr>
        );
      })} */}
      <ModalDataTransaksiAkun dataTransaksi={dataTransaksi} />
    </>
  );
};

export default ListLabaRugi;
