import { DatePicker } from "antd";
import { getHistoriSarpras } from "client/HistoriClient";
import ListHistori from "components/Keuangan/Histori/ListHistori";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import router from "next/router";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { getPreviewURL } from "utilities/FileViewer";
import { momentPackage } from "utilities/HelperUtils";
import { getLinkHistori } from "utilities/KeuanganUtils";
const { RangePicker } = DatePicker;

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ tanggalAwal, tanggalAkhir, search, jenis, u }) => {
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [debounceSearch] = useDebounce(searchTransaksi, 400);
  const [histori, setHistori] = useState([]);
  const [listJenis, setListJenis] = useState([]);
  const [listUser, setListUser] = useState([]);

  const listDropdownValue = [
    {
      label: "Semua Jenis",
      value: "",
    },
    {
      label: "Mingguan",
      value: "mingguan",
    },
    {
      label: "Bulanan",
      value: "bulanan",
    },
    {
      label: "Tahunan",
      value: "tahunan",
    },
  ];

  const _getHistori = async () => {
    const { data } = await getHistoriSarpras({
      search,
      tanggalAkhir,
      tanggalAwal,
      jenis,
      mUserId: u,
    });
    if (data) {
      setHistori(data?.histori);
      setListJenis(
        data?.jenis?.map((d) => {
          return { ...d, label: d, value: d };
        })
      );
      setListUser(
        data?.users?.map((d) => {
          return { ...d, label: d?.nama, value: d?.id };
        })
      );
    }
  };

  useEffect(() => {
    _getHistori();
  }, [search, jenis, tanggalAkhir, tanggalAwal, u]);

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
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Daftar Histori Sarana Prasarana
                  </h4>
                </div>
                <hr className="my-4" />
                <div className="row px-4">
                  <div className="col-md-3 mb-4">
                    <input
                      type="text"
                      className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 w-100"
                      style={{ height: "42px" }}
                      id="exampleFormControlInput1"
                      placeholder="Cari aktivitas"
                      value={searchTransaksi}
                      onChange={(e) => setSearchTransaksi(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3 mb-4">
                    <RangePicker
                      className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi"
                      value={[
                        tanggalAwal ? momentPackage(tanggalAwal) : "",
                        tanggalAkhir ? momentPackage(tanggalAkhir) : "",
                      ]}
                      style={{
                        height: "42px",
                        paddingLeft: "14px",
                        paddingRight: "14px",
                      }}
                      placeholder={["Tanggal Mulai", "Tanggal Selesai"]}
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
                    />
                  </div>
                  <div className="col-md-3 mb-4">
                    {/* <Dropdown
                      listValue={listDropdownValue}
                      //   defaultValue={
                      //     listDropdownValue?.find((item) => item.value == tipe)
                      //       ?.label
                      //   }
                      //   onChange={handleChangeDropdown}
                      className="w-100"
                      isDropdownMutasi
                    /> */}
                    <div className="select-akun-keuangan">
                      <SelectShared
                        name="jenis"
                        isClearable={true}
                        placeholder="Pilih jenis histori"
                        handleChangeSelect={(e, name) => {
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              jenis: e?.value,
                            },
                          });
                        }}
                        value={jenis}
                        options={[
                          {
                            label: "Semua Jenis",
                            value: "",
                          },
                          ...listJenis,
                        ]}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    {/* <Dropdown
                      listValue={listDropdownValue}
                      //   defaultValue={
                      //     listDropdownValue?.find((item) => item.value == tipe)
                      //       ?.label
                      //   }
                      //   onChange={handleChangeDropdown}
                      className="w-100"
                      isDropdownMutasi
                    /> */}
                    <div className="select-akun-keuangan">
                      <SelectShared
                        name="jenis"
                        isClearable={true}
                        placeholder="Pilih pengguna"
                        handleChangeSelect={(e, name) => {
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              u: e?.value,
                            },
                          });
                        }}
                        value={parseInt(u)}
                        options={[
                          {
                            label: "Semua Jenis",
                            value: "",
                          },
                          ...listUser,
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 pb-4">
                <table className="table-ss table-mutasi">
                  <thead>
                    <tr>
                      <th>Pengguna</th>
                      <th>Jenis</th>
                      <th>Aktivitas</th>
                      <th className="text-center">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {histori?.map((d) => {
                      let data = d;
                      const link = getLinkHistori(d);

                      if (
                        ("" + d?.awal)
                          .toLowerCase()
                          .includes("nota barang telah diubah")
                      ) {
                        data.awal = `Nota Barang : <a class="color-primary" href=${getPreviewURL(
                          ("" + d?.akhir).replace('"', "")
                        )} target="_blank" rel="noopener noreferrer">File nota barang</a> telah diubah`;
                        data.akhir = "";
                      }

                      return <ListHistori data={data} link={link} />;
                    })}
                    {/* <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Buat Transaksi
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-bold">
                            Pembelian Monitor HP 19 inch
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Transaksi
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Judul : Pembelian Monitor HP 19 inch menjadi {""}
                            <span className="fw-bold">
                              "Pembelian Monitor Samsung 19 inch"
                            </span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Transaksi
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Jurnal Umum - Nama Akun : Dana BOS menjadi {""}
                            <span className="fw-bold">"Dana Yayasan"</span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Transaksi
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Jurnal Umum - Nama Akun : dibuat akun {""}
                            <span className="fw-bold">Dana BOS</span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Transaksi
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Jurnal Umum - Nama Akun : dihapus akun {""}
                            <span className="fw-bold">Dana BOS</span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Transaksi
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Jurnal Umum - Nama Akun - Perlengkapan Usaha : Debit
                            860.000 menjadi {""}
                            <span className="fw-bold">"Debit 880.000"</span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Hapus Transaksi
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-bold">
                            Pembelian Monitor Samsung 19 inch
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Buat Akun
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-bold">Dana BOP</h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Akun
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Terhubung dengan Akun Rekening? : Tidak menjadi {""}
                            <span className="fw-bold">"Ya"</span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Akun
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Pilih Bank : BCA menjadi {""}
                            <span className="fw-bold">"DKI"</span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Hapus Akun
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-bold">Dana BOP</h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Buat Perencanaan Anggaran
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-bold">
                            Pembelian Spanduk PPDB
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Rencana Keuangan Tahun 2022
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Perencanaan Anggaran
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Judul : Pembelian Spanduk PPDB menjadi {""}
                            <span className="fw-bold">
                              "Pembelian Spanduk PPDB"
                            </span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Rencana Keuangan Tahun 2022
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Hapus Perencanaan Perencanaan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-bold">
                            Pembelian Monitor Samsung 19 inch
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Rencana Keuangan Tahun 2022
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Buat Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Aktiva - Aktiva Lancar : {""}
                            <span className="fw-bold">KAS</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Perencanaan - Laporan Neraca
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Aktiva - Aktiva Lancar : KAS menjadi {""}
                            <span className="fw-bold">"DANA BPMU"</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Perencanaan - Laporan Neraca
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr> */}
                    {/* <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Hapus Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Aktiva - Aktiva Lancar : {""}
                            <span className="fw-bold">KAS</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Perencanaan - Laporan Neraca
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Rumus Laba / Rugi : Pendapatan + Beban menjadi
                            <span className="fw-bold">
                              {" "}
                              "Pendapatan - Beban"
                            </span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Perencanaan - Laporan Laba/Rugi
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Tipe Akun - Kas dan Bank : DANA BOS menjadi
                            <span className="fw-bold"> "KAS"</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Perencanaan - Laporan Arus Kas
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Buat Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Template Laporan : {""}
                            <span className="fw-bold">KAS</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Analisis
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Template Laporan : KAS menjadi {""}
                            <span className="fw-bold">"Dana BOS"</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Analisis
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Hapus Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Template Laporan : {""}
                            <span className="fw-bold">Dana BOS</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Analisis
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Buat Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Aktiva - Aktiva Lancar : {""}
                            <span className="fw-bold">KAS</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Realisasi - Laporan Neraca
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Aktiva - Aktiva Lancar : KAS menjadi {""}
                            <span className="fw-bold">"DANA BPMU"</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Realisasi - Laporan Neraca
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Hapus Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Aktiva - Aktiva Lancar : {""}
                            <span className="fw-bold">KAS</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Realisasi - Laporan Neraca
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Rumus Laba / Rugi : Pendapatan + Beban menjadi
                            {""}
                            <span className="fw-bold">
                              {" "}
                              "Pendapatan - Beban"
                            </span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Realisasi - Laporan Laba/Rugi
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Template Laporan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-1 color-dark fw-semibold">
                            Tipe Akun - Kas dan Bank : DANA BOS menjadi
                            {""}
                            <span className="fw-bold"> "KAS"</span>
                          </h6>
                          <h6 className="fs-14-ss mb-0 fw-semibold">
                            Realisasi - Laporan Arus Kas
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Buat Perencanaan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-bold">
                            Rencana Keuangan Tahun 2022
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Ubah Perencanaan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-semibold">
                            Judul : Rencana Keuangan Tahun 2022 menjadi {""}
                            <span className="fw-bold">
                              "Rencana Keuangan Tahun 2023"
                            </span>
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 fw-semibold border-start-0">
                        <div className="d-flex align-items-center">
                          <Avatar name="AA" src="AA" />
                          <div className="ms-3">
                            <h6 className="color-dark mb-1 fw-semibold">
                              Admin Keuangan
                            </h6>
                            <h6 className="fs-14-ss mb-0 fw-semibold">
                              17 Des 2022 07:59:00
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 fw-semibold">
                        <h6 className="mb-0 color-dark fw-semibold">
                          Hapus Perencanaan
                        </h6>
                      </td>
                      <td className="py-2">
                        <div className="">
                          <h6 className="mb-0 color-dark fw-bold">
                            Rencana Keuangan Tahun 2023
                          </h6>
                        </div>
                      </td>
                      <td className="py-2 border-end-0 text-center">
                        <button
                          className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4 mx-auto hover-shadow-none`}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  query: { tanggalAwal, tanggalAkhir, search, jenis, u },
}) {
  return {
    props: {
      tanggalAwal: tanggalAwal || null,
      tanggalAkhir: tanggalAkhir || null,
      search: search || null,
      jenis: jenis || null,
      u: u || null,
    },
  };
}

export default index;
