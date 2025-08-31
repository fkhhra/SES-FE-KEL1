import React, { useEffect, useState } from "react";
import { formatAngkaTitik } from "utilities/HelperUtils";

const ListLabaRugiNormal = ({
  data,
  rumus,
  levelAkun,
  hasilRumus,
  labaAkumulasi,
}) => {
  const totalSemua = {};
  const dataLain = data.filter((e) => e?.kategori);

  // const datass = data.filter((e) => e.kategori == "Beban");
  // const beban = [
  //   { kategori: "Beban", urutan: datass?.[0]?.urutan, data: [...datass] },
  // ];
  // console.log(labaAkumulasi);

  const dataFix = [...rumus, ...dataLain];
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
          // console.log(rumus1);
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
                  let totalAkun = levelAkun?.find(
                    (x) => x?.id == e?.akun?.id
                  )?.total;
                  totalSemua[d?.id] = totalSemua[d?.id]
                    ? totalSemua[d?.id] + totalAkun
                    : totalAkun;

                  return (
                    <>
                      <tr>
                        <td className="py-2 fw-semibold border-start-0">
                          {e?.akun?.kode}
                        </td>
                        <td className="py-2 fw-semibold text-uppercase">
                          {e?.akun?.nama}
                        </td>
                        <td className="py-2">
                          <span className={`color-dark fw-extrabold`}>
                            {formatAngkaTitik(e?.total)}
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
                      {formatAngkaTitik(d?.total)}
                    </span>
                  </td>
                </tr>
              </>
            );
          } else {
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
                    {formatAngkaTitik(hasilRumus?.[rumus1 - 1])}
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
            {formatAngkaTitik(labaAkumulasi)}
          </span>
        </td>
      </tr>
      {/* {data
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
                let totalAkun = levelAkun?.find(
                  (x) => x?.id == e?.akun?.id
                )?.total;
                totalSemua[d?.id] = totalSemua[d?.id]
                  ? totalSemua[d?.id] + totalAkun
                  : totalAkun;

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
                      {formatAngkaTitik(d?.totalBeban)}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr></tr>
              )}
            </>
          );
        })} */}
      {/* {rumus.map((d, idx) => {
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
                {formatAngkaTitik(hasilRumus[idx])}
              </span>
            </td>
          </tr>
        );
      })} */}
    </>
  );
};

export default ListLabaRugiNormal;
