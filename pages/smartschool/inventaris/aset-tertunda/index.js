import { DatePicker } from "antd";
import HeaderInventaris from "components/Keuangan/Inventaris/HeaderInventaris";
import ModalInventaris from "components/Keuangan/Inventaris/ModalInventaris";
import React, { useEffect, useState } from "react";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { baseURL, ssURL } from "../../../../client/clientAxios";
import { getInventaris, getInventarisAktif } from "client/InventarisClient";
import { formatAngkaTitik, momentPackage } from "utilities/HelperUtils";
import { useDebounce } from "use-debounce";
import router from "next/router";
const { RangePicker } = DatePicker;

const index = ({ search, tanggalAwal, tanggalAkhir, page }) => {
  const [editData, setEditData] = useState(null);
  const [inventaris, setInventaris] = useState({});
  const [rencana, setRencana] = useState([]);
  const [akun, setAkun] = useState([]);
  const [searchNama, setSearchNama] = useState("");
  const [debounceSearch] = useDebounce(searchNama, 400);

  const _getInventaris = async () => {
    const { data, error } = await getInventaris({
      tanggalAkhir,
      tanggalAwal,
      search,
    });

    if (data) {
      setInventaris(data?.barang);
    }
  };

  const _getInventarisAktif = async () => {
    const { data, error } = await getInventarisAktif();

    if (data) {
      setRencana(data?.rencana);
      setAkun(data?.akun);
    }
  };

  useEffect(() => {
    _getInventaris();
  }, [page, search, tanggalAkhir, tanggalAwal]);

  useEffect(() => {
    _getInventarisAktif();
  }, []);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);

  return (
    <Layout isFluid={true}>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <HeaderInventaris ssURL={ssURL} />
          </div>
        </div>
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Daftar Aset Belum Tersimpan
                  </h4>
                </div>
                <hr className="my-4" />
                <div className="row px-4">
                  <div className="col-md-6 mb-4">
                    <div className="select-perencanaan-analisis-keuangan">
                      <input
                        type="text"
                        className="form-control form-search form-search-mutasi form-search-tunggakan rounded-pill fw-semibold border-secondary-ss w-100"
                        style={{ height: "42px", width: "100%" }}
                        onChange={(e) => setSearchNama(e.target.value)}
                        value={searchNama}
                        // id="exampleFormControlInput1"
                        placeholder="Cari Aset"
                        data-joyride="cari-aset"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <RangePicker
                      onChange={(date, dateString) =>
                        router.push({
                          pathname: router.pathname,
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
              {/* {tanggalAwal && tanggalAkhir && rencanaId ? ( */}
              <div className="card-body p-0 pb-4">
                <table className="table-ss table-mutasi">
                  <thead>
                    <tr>
                      <th className="text-center">Tanggal Pembelian</th>
                      <th>Nama</th>
                      <th>Spesifikasi</th>
                      <th className="text-center">Harga Satuan</th>
                      <th className="text-center">Jumlah</th>
                      <th>Harga Total</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {template?.map((d) => {
                        const totalRencana = rencana?.find(
                          (e) => e?.id == d?.akun?.id
                        )?.total;
                        const totalRealisasi = realisasi?.find(
                          (e) => e?.id == d?.akun?.id
                        )?.total; */}
                    {/* return ( */}
                    {inventaris?.data?.map((d) => {
                      const desc = "" + d?.deskripsi;
                      return (
                        <tr>
                          <td className="py-2 fw-semibold border-start-0 text-center">
                            {/* {d?.akun?.kode} */}
                            {momentPackage(d?.tahunBeli).format("DD/MM/YYYY")}
                          </td>
                          <td className="py-2">
                            <div>
                              <span className={`fw-semibold border-start-0`}>
                                {/* {formatAngkaKoma(totalRencana)} */}
                                {d?.nama}
                              </span>
                              <br></br>
                              <span className={`fw-semibold border-start-0`}>
                                {/* {formatAngkaKoma(totalRencana)} */}
                                {d?.merk}
                              </span>
                            </div>
                          </td>
                          <td className="py-2">
                            <span className={`py-2 fw-semibold border-start-0`}>
                              {/* {formatAngkaKoma(totalRencana)} */}
                              {desc.length > 50
                                ? `${desc.substring(0, 50)}...`
                                : desc}
                            </span>
                          </td>
                          <td className="py-2 text-center">
                            <span className={`py-2 fw-semibold border-end-0`}>
                              {/* {formatAngkaKoma(totalRealisasi)} */}
                              Rp{formatAngkaTitik(d?.harga)}
                            </span>
                          </td>
                          <td className="py-2 text-center">
                            <span className={`py-2 fw-semibold border-start-0`}>
                              {/* {formatAngkaKoma(totalRencana - totalRealisasi)} */}
                              {d?.jumlah}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={`color-dark fw-extrabold`}>
                              {/* {formatAngkaKoma(totalRencana - totalRealisasi)} */}
                              Rp{formatAngkaTitik(d?.harga * d?.jumlah)}
                            </span>
                          </td>
                          <td className="py-2 border-end-0 text-center">
                            <button
                              className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                              data-bs-toggle="modal"
                              data-bs-target="#ModalInventaris"
                              onClick={() => setEditData({ ...d })}
                            >
                              Proses
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {/* ); */}
                    {/* // })} */}
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
              {/* // ) : ( */}
              {/* <div className="card-body p-4">
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
                          barang di menu Sarpras
                        </a>{" "}
                        di atas untuk mendapatkan data
                      </p>
                    </div>
                  </div>
                </div> */}
              {/* // )} */}
            </div>
          </div>
        </div>
        <ModalInventaris
          editData={editData}
          getData={() => _getInventaris()}
          rencana={rencana}
          akun={akun}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  query: { page, tanggalAkhir, tanggalAwal, search },
}) {
  return {
    props: {
      page: page || null,
      tanggalAkhir: tanggalAkhir || null,
      tanggalAwal: tanggalAwal || null,
      search: search || null,
    },
  };
}

export default index;
