import React from "react";
import { formatAngkaTitik } from "utilities/HelperUtils";

const ListAktivitasArusKasNormal = ({ data, hasilRumus }) => {
  const { kenaikan, awal, akhir } = hasilRumus;

  return (
    <>
      {data?.map((d, idx) => {
        let total = [];
        return (
          <>
            <tr>
              <td
                className="py-2 border-start-0 border-end-0 color-dark fw-extrabold text-uppercase"
                colSpan={3}
                style={{ background: "#F0F0F1" }}
              >
                Arus Kas dari Aktivitas {d?.nama}
              </td>
            </tr>
            {d?.tipeAkun?.map((e, index) => {
              return (
                <tr>
                  <td className="py-2 fw-semibold text-uppercase border-start-0">
                    {e?.text + " " + e?.judul}
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
              );
            })}
            <tr>
              <td
                className="py-2 color-dark fw-extrabold text-uppercase border-start-0 border-end-0"
                colSpan={2}
                style={{ background: "#F0F0F1" }}
              >
                TOTAL Aktivitas {d?.nama}
              </td>
              <td
                className="py-2 border-end-0 border-start-0 border-left-0"
                style={{ background: "#F0F0F1" }}
              >
                <span className={`color-dark fw-extrabold`}>
                  {/* {formatAngkaTitik(total?.reduce((a, b) => a + b, 0))} */}
                  {formatAngkaTitik(d?.total)}
                </span>
              </td>
            </tr>
          </>
        );
      })}

      <tr>
        <td
          className="py-2 color-dark fw-extrabold text-uppercase border-start-0 border-end-0"
          colSpan={2}
          style={{ background: "#F0F0F1" }}
        >
          Penambahan Kas
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>
            {formatAngkaTitik(kenaikan)}
          </span>
        </td>
      </tr>
      <tr>
        <td
          className="py-2 color-dark fw-extrabold text-uppercase border-start-0 border-end-0"
          colSpan={2}
          style={{ background: "#F0F0F1" }}
        >
          Saldo Kas Awal
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>
            {formatAngkaTitik(awal)}
          </span>
        </td>
      </tr>
      <tr>
        <td
          className="py-2 color-dark fw-extrabold text-uppercase border-start-0 border-end-0"
          colSpan={2}
          style={{ background: "#F0F0F1" }}
        >
          Saldo Kas Akhir
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>
            {formatAngkaTitik(akhir + awal)}
          </span>
        </td>
      </tr>
    </>
  );
};

export default ListAktivitasArusKasNormal;
