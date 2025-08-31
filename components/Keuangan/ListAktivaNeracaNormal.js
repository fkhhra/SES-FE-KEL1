import React from "react";
import { currencyFormatter, formatAngkaTitik } from "utilities/HelperUtils";

const ListAktivaNeracaNormal = ({ data, levelAkun = [], totalSemua }) => {
  return (
    <>
      <tr>
        <td
          className="py-2 border-start-0 border-end-0"
          style={{ background: "#F0F0F1" }}
        ></td>
        <td
          className="py-2 border-start-0 border-end-0 color-dark fw-extrabold text-uppercase"
          colSpan={3}
          style={{ background: "#F0F0F1" }}
        >
          Aktiva
        </td>
      </tr>
      {data?.map((d) => {
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
            {d?.akunNeraca?.map((e) => {
              let totalAkun = e?.total;
              totalSemua.push(totalAkun);
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
          </>
        );
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
          TOTAL AKTIVA
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>
            {" "}
            {formatAngkaTitik(totalSemua.reduce((a, b) => a + b, 0))}
          </span>
        </td>
      </tr>
      {/* <tr>
        <td className="py-2 fw-semibold border-start-0">1120</td>
        <td className="py-2 fw-semibold text-uppercase">Kas Kecil</td>
        <td className="py-2">
          <span className={`color-dark fw-extrabold`}>400.000</span>
        </td>
        <td className="py-2 border-end-0">
          <span className={`color-dark fw-extrabold`}></span>
        </td>
      </tr>
      <tr>
        <td className="py-2 fw-semibold border-start-0"></td>
        <td className="py-2 color-dark fw-bold text-uppercase">
          TOTAL AKTIVA LANCAR
        </td>
        <td className="py-2">
          <span className={`color-dark fw-extrabold`}></span>
        </td>
        <td className="py-2 border-end-0">
          <span className={`color-dark fw-extrabold`}>10.400.000</span>
        </td>
      </tr>
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
          TOTAL AKTIVA
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>10.400.000</span>
        </td>
      </tr> */}
    </>
  );
};

export default ListAktivaNeracaNormal;
