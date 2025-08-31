import React from "react";
import { formatAngkaTitik } from "utilities/HelperUtils";

const ListPasivaNeraca = ({
  data,
  levelAkun = [],
  totalSemuaAktiva,
  totalSemuaRencanaAktiva,
}) => {
  let totalSemua = [];
  let totalSemuaRencana = [];

  return (
    <>
      <tr>
        <td
          className="py-2 border-start-0 border-end-0"
          style={{ background: "#F0F0F1" }}
        ></td>
        <td
          className="py-2 border-start-0 border-end-0"
          colSpan={5}
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold text-uppercase`}>
            Pasiva
          </span>
        </td>
      </tr>
      {data?.map((d) => {
        totalSemua.push(d?.total);
        return (
          <>
            <tr>
              <td className="py-2 border-start-0 border-end-0"></td>
              <td className="py-2 border-start-0 border-end-0" colSpan={5}>
                <span className={`color-dark fw-bold text-uppercase`}>
                  {d?.nama}
                </span>
              </td>
            </tr>
            {d?.akunNeraca?.map((e) => {
              let totalAkun = e?.total;
              let totalAkunRencana = e?.totalRencana;
              // if (e?.akun?.nama == "MODAL") {
              //   totalAkun =
              //     totalSemuaAktiva.reduce((a, b) => a + b, 0) - e?.total;
              //   totalAkunRencana =
              //     totalSemuaRencanaAktiva.reduce((a, b) => a + b, 0) -
              //     e?.totalRencana;
              // }
              // if (e?.pengaturan == "negatif") {
              //   totalSemua.push(-totalAkun);
              //   totalAkun = totalAkun * -1;
              // } else {
              //   totalSemua.push(totalAkun);
              // }
              totalSemuaRencana.push(totalAkunRencana);
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
          TOTAL PASIVA
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>
            {" "}
            {formatAngkaTitik(totalSemuaRencana.reduce((a, b) => a + b, 0))}
          </span>
        </td>
        <td
          className="py-2 fw-semibold border-start-0 border-end-0"
          style={{ background: "#F0F0F1" }}
        ></td>
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
        <td className="py-2 border-start-0 border-end-0"></td>
        <td className="py-2 border-start-0 border-end-0" colSpan={3}>
          <span className={`color-dark fw-bold text-uppercase`}>
            HUTANG LANCAR
          </span>
        </td>
      </tr>
      <tr>
        <td className="py-2 fw-semibold border-start-0">4110</td>
        <td className="py-2 fw-semibold text-uppercase">HUTANG WESEL</td>
        <td className="py-2">
          <span className={`color-dark fw-extrabold`}>10.000</span>
        </td>
        <td className="py-2 border-end-0">
          <span className={`color-dark fw-extrabold`}></span>
        </td>
      </tr>
      <tr>
        <td className="py-2 fw-semibold border-start-0"></td>
        <td className="py-2 color-dark fw-bold text-uppercase">
          TOTAL HUTANG LANCAR
        </td>
        <td className="py-2">
          <span className={`color-dark fw-extrabold`}></span>
        </td>
        <td className="py-2 border-end-0">
          <span className={`color-dark fw-extrabold`}>10.000</span>
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
          TOTAL PASIVA
        </td>
        <td
          className="py-2 border-end-0 border-start-0 border-left-0"
          style={{ background: "#F0F0F1" }}
        >
          <span className={`color-dark fw-extrabold`}>10.000</span>
        </td>
      </tr> */}
    </>
  );
};

export default ListPasivaNeraca;
