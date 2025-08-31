import { DatePicker } from "antd";
import { downloadAnalisis, getAnalisis } from "client/AnalisisKeuanganClient";
import HeaderAnalisisKeuangan from "components/Keuangan/AnalisisKeuangan/HeaderAnalisisKeuangan";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { formatAngkaKoma, momentPackage } from "utilities/HelperUtils";
import { analisisHitungLevel } from "utilities/KeuanganUtils";
import { baseURL, ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
const { RangePicker } = DatePicker;

const index = ({ rencanaId, tanggalAwal, tanggalAkhir }) => {
  const [template, setTemplate] = useState([]);
  const [akunKecil, setAkunKecil] = useState([]);
  const [realisasi, setRealisasi] = useState([]);
  const [rencana, setRencana] = useState([]);
  const [listRencana, setListRencana] = useState([]);
  // const [ditambah, setDitambah] = useState(false);
  // const [edit, setEdit] = useState({});

  const _getAnalisis = async () => {
    const { data } = await getAnalisis({
      rencanaId,
      tanggalAwal,
      tanggalAkhir,
    });

    if (data) {
      setTemplate(data?.analisis);
      const template = JSON.parse(data?.keuangan?.template || "[]");

      const akun = data?.akun;
      let temp = [];
      function recursive(data) {
        data.map((d) => {
          const akunKecil = akun?.find((e) => e?.id == d?.id);

          if (akunKecil) {
            if (d?.children?.length) {
              recursive(d?.children);
            } else {
              temp.push(akunKecil);
            }
          }
        });
      }
      recursive(template);

      const hasil = analisisHitungLevel(akun, template);
      const hasilRencana = analisisHitungLevel(
        data?.akun,
        template,
        "rencanaJurnal"
      );
      setRealisasi(hasil);
      setRencana(hasilRencana);
      setAkunKecil(temp);
      setListRencana(
        data?.rencana?.map((d) => {
          return { ...d, label: d?.nama, value: d?.id };
        })
      );
    }
  };

  const _rekap = async () => {
    const payload = template?.map((d) => {
      const totalRencana = rencana?.find((e) => e?.id == d?.akun?.id)?.total;
      const totalRealisasi = realisasi?.find(
        (e) => e?.id == d?.akun?.id
      )?.total;
      return {
        nomor: d?.akun?.kode,
        nama: d?.akun?.nama,
        rencana: formatAngkaKoma(totalRencana),
        realisasi: formatAngkaKoma(totalRealisasi),
        selisih: formatAngkaKoma(totalRencana - totalRealisasi),
        persen: totalRencana
          ? ((totalRealisasi / totalRencana) * 100).toFixed(2)
          : "Tak Hingga",
      };
    });

    const { data } = await downloadAnalisis({ data: payload });

    if (data) {
      window.open(`${baseURL}${data}`);
    }
  };

  const handleChangeSelect = (e, name) => {
    if (name == "perencanaan") {
      router.push({
        pathname: "/smartschool/analisis-keuangan/data-laporan",
        query: {
          ...router.query,
          rencanaId: e?.value,
        },
      });
    }
  };

  useEffect(() => {
    _getAnalisis();
  }, [tanggalAkhir, tanggalAwal, rencanaId]);
  return (
    <Layout isFluid={true}>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <HeaderAnalisisKeuangan ssURL={ssURL} />
          </div>
        </div>
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Laporan Analisis
                  </h4>
                  <button
                    className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss`}
                    onClick={_rekap}
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Analisis
                  </button>
                </div>
                <hr className="my-4" />
                <div className="row px-4">
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-2 fw-bold color-dark">Perencanaan</h6>
                    <div className="select-perencanaan-analisis-keuangan">
                      <SelectShared
                        name="perencanaan"
                        placeholder="Pilih perencanaan"
                        className="rounded-pill"
                        handleChangeSelect={handleChangeSelect}
                        value={parseInt(rencanaId)}
                        options={listRencana}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-2 fw-bold color-dark">Realisasi</h6>
                    <RangePicker
                      onChange={(date, dateString) =>
                        router.push({
                          pathname:
                            "/smartschool/analisis-keuangan/data-laporan",
                          query: {
                            ...router.query,
                            tanggalAwal: dateString[0],
                            tanggalAkhir: dateString[1],
                          },
                        })
                      }
                      placeholder={["Tanggal Awal", "Tanggal Akhir"]}
                      className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                      autoComplete="off"
                      style={{
                        height: "42px",
                        paddingLeft: "14px",
                        paddingRight: "14px",
                      }}
                      value={[
                        tanggalAwal ? momentPackage(tanggalAwal) : "",
                        tanggalAkhir ? momentPackage(tanggalAkhir) : "",
                      ]}
                    />
                  </div>
                </div>
              </div>
              {tanggalAwal && tanggalAkhir && rencanaId ? (
                <div className="card-body p-0 pb-4">
                  <table className="table-ss table-mutasi">
                    <thead>
                      <tr>
                        <th>No Akun</th>
                        <th>Nama Akun</th>
                        <th>Rencana Anggaran (Rp)</th>
                        <th>Realisasi (Rp)</th>
                        <th>Selisih (Rp)</th>
                        <th>Persentase (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {template?.map((d) => {
                        const totalRencana = rencana?.find(
                          (e) => e?.id == d?.akun?.id
                        )?.total;
                        const totalRealisasi = realisasi?.find(
                          (e) => e?.id == d?.akun?.id
                        )?.total;
                        return (
                          <tr>
                            <td className="py-2 fw-semibold border-start-0">
                              {d?.akun?.kode}
                            </td>
                            <td className="py-2 fw-semibold text-uppercase">
                              {d?.akun?.nama}
                            </td>
                            <td className="py-2">
                              <span className={`color-dark fw-extrabold`}>
                                {formatAngkaKoma(totalRencana)}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={`color-dark fw-extrabold`}>
                                {formatAngkaKoma(totalRealisasi)}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={`color-dark fw-extrabold`}>
                                {formatAngkaKoma(totalRencana - totalRealisasi)}
                              </span>
                            </td>
                            <td className="py-2 border-end-0">
                              <span className={`color-dark fw-extrabold`}>
                                {totalRencana
                                  ? (
                                      (totalRealisasi / totalRencana) *
                                      100
                                    ).toFixed(2)
                                  : "Tak Hingga"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* <div className="my-4 text-center">
  <Pagination
    total={listMutasi?.total}
    showSizeChanger={false}
    current={parseInt(page) || 1}
    pageSize={25}
    onChange={(e) => setPage(e)}
  />
</div> */}
                </div>
              ) : (
                <div className="card-body p-4">
                  <div className="row justify-content-center">
                    <div className="col-md-6 col-sm-8 col-10 text-center">
                      <img
                        src="/img/empty-state-data.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-12 text-center">
                      <h4 className="color-dark fw-black mt-4 mb-2">
                        Tidak Ada Data
                      </h4>
                      <p className="fw-bold">
                        Atur{" "}
                        <a href="#peride-laporan" className="color-primary">
                          Perencanaan dan Realisasi
                        </a>{" "}
                        di atas untuk mendapatkan data Analisis
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  query: { rencanaId, tanggalAwal, tanggalAkhir },
}) {
  return {
    props: {
      rencanaId: rencanaId || null,
      tanggalAwal: tanggalAwal || null,
      tanggalAkhir: tanggalAkhir || null,
    },
  };
}

export default index;
