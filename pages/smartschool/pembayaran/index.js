import { getRekeningSekolah } from "client/RekeningSekolahClient";
import ListPembayaran from "components/Pembayaran/ListPembayaran";
import NavPembayaran from "components/Pembayaran/NavPembayaran";
import Navbar from "components/Shared/Navbar/Navbar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { motion } from "framer-motion";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { textStatusPembayaran } from "utilities/PembayaranUtils";
import { ssURL } from "../../../client/clientAxios";
import {
  deletePembayaran,
  getPembayaran,
} from "../../../client/PembayaranClient";
import Layout from "../../../components/Layout/Layout";
import ModalBuatPembayaran from "../../../components/Shared/ModalBuatPembayaran/ModalBuatPembayaran";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import PembayaranSkeleton from "../../../components/Shared/Skeleton/PembayaranSkeleton";
import Dropdown from "../../../components/Shared/Dropdown/Dropdown";
import { currencyFormatter } from "utilities/HelperUtils";
import Link from "next/link";

const index = ({ nav, taId, subnav }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tipePembayaran, settipePembayaran] = useState(false);
  const [tipeUjian, setTipeUjian] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [rekeningSekolah, setRekeningSekolah] = useState();
  const [pembayaran, setPembayaran] = useState([]);
  const [totalPelunasan, setTotalPelunasan] = useState([]);
  const [ta, setTa] = useState([]);
  const [editData, setEditData] = useState(null);
  const [rombelId, setRombelId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [debounceSearchValue] = useDebounce(searchValue, 600);
  const [akun, setAkun] = useState([]);
  const [userData, setUserData] = useState([]);
  const { user } = useUser();

  const firstRender = useRef(true);

  const onClickEdit = (pembayaranData) => {
    setEditData(pembayaranData);
    settipePembayaran(pembayaranData?.jenis);
  };

  const navItems = [
    {
      url: `${ssURL}/pembayaran?nav=spp`,
      as: `${ssURL}/pembayaran?nav=spp`,
      text: "SPP",
      active: nav == "spp" || nav == undefined,
      dataJoyride: "spp",
    },
    {
      url: `${ssURL}/pembayaran?nav=ujian`,
      as: `${ssURL}/pembayaran?nav=ujian`,
      text: "Ujian",
      active: nav == "ujian",
      dataJoyride: "ujian",
    },
    {
      url: `${ssURL}/pembayaran?nav=lainnya`,
      as: `${ssURL}/pembayaran?nav=lainnya`,
      text: "Lainnya",
      active: nav == "lainnya",
      dataJoyride: "lainnya",
    },
    {
      url: `${ssURL}/pembayaran?nav=khusus`,
      as: `${ssURL}/pembayaran?nav=khusus`,
      text: "Khusus",
      active: nav == "khusus",
      dataJoyride: "khusus",
    },
  ];

  const _deletePembayaran = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deletePembayaran(id);
        if (data) {
          toast.success(data?.message);
          _getPembayaran();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const _getPembayaran = async () => {
    setLoading(true);
    const params = {
      tipe: nav ? nav : "spp",
      search: searchValue,
      taId,
      rombelId: rombelId?.value,
      ...router.query,
    };

    const { data } = await getPembayaran(params);
    if (data) {
      setRombel(data.rombel);
      setTa(data?.ta);
      setPembayaran(data.pembayaran);
      setTipeUjian(data?.tipeUjian);
      setTotalPelunasan(data?.totalPelunasan);
      setAkun(data?.akun);
      setUserData(data?.userData);
    }
    setLoading(false);
  };

  const _getRekeningSekolah = async () => {
    setLoading(true);
    const { data } = await getRekeningSekolah();
    if (data) {
      setRekeningSekolah(data.rekSekolah);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      _getPembayaran();
    }
  }, [debounceSearchValue]);

  useEffect(() => {
    _getPembayaran();
  }, [nav, taId, rombelId, subnav]);

  useEffect(() => {
    _getRekeningSekolah();
  }, []);

  const steps = [
    {
      target: '[data-joyride="spp"]',
      content: "Pembayaran SPP",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="ujian"]',
      content: "Pembayaran Ujian",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="lainnya"]',
      content: "Lainnya",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="button-buat-pembayaran"]',
      content: "Buat Pembayaran",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="cari-pembayaran"]',
      content: "Cari Pembayaran",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="card-pembayaran"]',
      content: "Detail Pembayaran",
      disableBeacon: true,
    },
  ];

  const handleChangeDropdown = (value) => {
    setRombelId(value);
  };
  const renderStatus = (status) => {
    let className = "";
    let text = "";

    switch (status) {
      case 0:
        className = "bg-soft-warning color-warning";
        text = "Butuh Konfirmasi";
        break;
      case 1:
        className = "bg-soft-success color-success";
        text = "Sudah Lunas";
        break;
      case 3:
        className = "bg-soft-warning color-warning";
        text = "Ditangguhkan";
        break;
      default:
        className = "bg-soft-danger color-danger";
        text = "Belum Lunas";
        break;
    }

    return {
      className,
      text,
    };
  };
  const navItemsSiswa = [
    {
      url: `${ssURL}/pembayaran?nav=khusus&subnav=semua`,
      as: `${ssURL}/pembayaran?nav=khusus&subnav=semua`,
      text: "Semua",
      active: subnav == "semua" || subnav == undefined,
    },
    {
      url: `${ssURL}/pembayaran?nav=khusus&subnav=belum-lunas`,
      as: `${ssURL}/pembayaran?nav=khusus&subnav=belum-lunas`,
      text: "Belum Lunas",
      active: subnav == "belum-lunas",
    },
    {
      url: `${ssURL}/pembayaran?nav=khusus&subnav=butuh-konfirmasi`,
      as: `${ssURL}/pembayaran?nav=khusus&subnav=butuh-konfirmasi`,
      text: "Butuh Konfirmasi",
      active: subnav == "butuh-konfirmasi",
    },
  ];
  return (
    <Layout isIndex={true}>
      <MyJoyride steps={steps} />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row">
            <div className="col-md-12">
              <NavPembayaran
                setEditData={setEditData}
                settipePembayaran={settipePembayaran}
                navItems={navItems}
              />
              <div className=" card card-ss mb-4">
                <div className="row w-100 ">
                  <div className="d-flex justify-content-between align-items-md-center flex-sm-row flex-column">
                    <div className="col-md-8 ms-5">
                      <input
                        type="text"
                        className="form-control  my-4"
                        placeholder={`Cari ${
                          nav == "khusus" ? "siwa..." : "pembayaran..."
                        }`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        data-joyride="cari-pembayaran"
                      />
                    </div>
                    <div className="col-md-3 mx-4 ">
                      {ta ? (
                        <SelectShared
                          className="me-4"
                          options={ta?.map((e) => {
                            return {
                              label: `Tahun ${e?.tahun} - semester ${e?.semester}`,
                              value: e?.id,
                            };
                          })}
                          value={parseInt(taId)}
                          handleChangeSelect={(e) => {
                            router.push({
                              pathname: router.pathname,
                              query: {
                                ...router.query,
                                taId: e?.value,
                              },
                            });
                          }}
                          isClearable
                          placeholder="Pilih tahun akademik"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                {loading && (
                  <div>
                    <PembayaranSkeleton count={2} />
                  </div>
                )}
                {!loading && nav == "khusus" ? (
                  <>
                    <div className="col-md-12">
                      <Navbar nav={navItemsSiswa} />
                    </div>

                    <div className="col-md-12">
                      <div className="card card-ss">
                        <div className="card-header-ss p-4 d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                          <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                            Daftar Siswa
                          </h4>
                          <div className="d-flex justify-content-md-start justify-content-between flex-sm-row flex-column">
                            <Dropdown
                              listValue={[
                                { label: "Semua Kelas", value: "" },
                                ...rombel?.map((d) => {
                                  return { label: d?.nama, value: d?.id };
                                }),
                              ]}
                              defaultValue={
                                rombelId ? rombelId?.label : "Semua Kelas"
                              }
                              onChange={handleChangeDropdown}
                            />
                            {/* <button
                                className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-md-0 ms-3 mb-3"
                                onClick={() => {
                                  _refreshPembayaranSiswa();
                                }}
                              >
                                Update{" "}
                                {sekolah?.tingkat == "kampus"
                                  ? "Mahasiswa"
                                  : "Siswa"}
                              </button> */}
                            {/* <button
                                className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-md-0 ms-3 mb-3 me-md-3"
                                data-bs-toggle="modal"
                                data-bs-target="#importSPP"
                              >
                                <FaCloudUploadAlt className="me-2" /> Unggah
                                Data
                              </button> */}
                          </div>
                        </div>
                        <div className="card-body p-0 pb-4">
                          <div className="table-responsive">
                            <table className="table-ss">
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Nama</th>
                                  <th>Kelas</th>
                                  <th>Nama Pembayaran</th>
                                  <th>Pembayaran</th>
                                  <th>Sisa</th>
                                  <th>Status</th>
                                  <th>Detail</th>
                                  <th>Aksi</th>
                                  {/* <th>Cetak</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {router.query.subnav == "butuh-konfirmasi" ? (
                                  <>
                                    {pembayaran
                                      ?.filter((siswa) =>
                                        siswa?.riwayat?.some(
                                          (item) => !item.dikonfirmasi
                                        )
                                      )
                                      ?.sort((a, b) =>
                                        ("" + a.user?.nama).localeCompare(
                                          b.user?.nama
                                        )
                                      )
                                      ?.map((siswa, idx) => {
                                        const totalSudahBayar =
                                          siswa?.riwayat?.reduce(
                                            (a, b) => a + parseInt(b.nominal),
                                            0
                                          );
                                        const nominal =
                                          siswa?.rombelPembayaran?.pembayaran
                                            ?.nominal;
                                        let status = textStatusPembayaran(
                                          siswa,
                                          totalSudahBayar,
                                          nominal
                                        );
                                        return (
                                          <tr>
                                            <td>{idx + 1}</td>
                                            <td>{siswa?.user?.nama}</td>
                                            <td>
                                              {
                                                siswa?.user?.anggotaRombel
                                                  ?.rombel?.nama
                                              }
                                            </td>
                                            <td>
                                              {
                                                siswa?.rombelPembayaran
                                                  ?.pembayaran?.nama
                                              }
                                            </td>
                                            <td>
                                              {currencyFormatter(
                                                totalSudahBayar
                                              )}
                                            </td>
                                            <td>
                                              {currencyFormatter(
                                                parseInt(pembayaran?.nominal) -
                                                  parseInt(totalSudahBayar) <
                                                  0
                                                  ? 0
                                                  : parseInt(
                                                      pembayaran?.nominal
                                                    ) -
                                                      parseInt(totalSudahBayar)
                                              )}
                                            </td>
                                            <td>
                                              <div
                                                className={`rounded-pill fw-bold py-1 d-flex justify-content-center fs-12-ss ${
                                                  renderStatus(status).className
                                                }`}
                                                style={{
                                                  width: "125px",
                                                }}
                                              >
                                                {renderStatus(status).text}
                                              </div>
                                            </td>
                                            <td>
                                              <Link
                                                href={`${ssURL}/transaksi/[id]`}
                                                as={`${ssURL}/transaksi/${siswa?.id}`}
                                              >
                                                <a className="text-decoration-none">
                                                  <button className="btn  btn-primary btn-primary-ss shadow-primary-ss fs-14-ss rounded-pill py-1 px-4">
                                                    Detail
                                                  </button>
                                                </a>
                                              </Link>
                                            </td>
                                            <td>
                                              <div className="dropdown dropdown-ss">
                                                <button
                                                  className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                                  style={{
                                                    width: "40px",
                                                    height: "40px",
                                                  }}
                                                  onClick={() =>
                                                    _deletePembayaran
                                                  }
                                                >
                                                  <FaTrashAlt className="color-secondary" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </>
                                ) : (
                                  <>
                                    {pembayaran
                                      ?.sort((a, b) =>
                                        ("" + a.user?.nama).localeCompare(
                                          b.user?.nama
                                        )
                                      )
                                      ?.map((siswa, idx) => {
                                        const totalSudahBayar =
                                          siswa?.riwayat?.reduce(
                                            (a, b) => a + parseInt(b.nominal),
                                            0
                                          );
                                        const nominal =
                                          siswa?.rombelPembayaran?.pembayaran
                                            ?.nominal;
                                        let status = textStatusPembayaran(
                                          siswa,
                                          totalSudahBayar,
                                          nominal
                                        );

                                        return (
                                          <tr>
                                            <td>{idx + 1}</td>
                                            <td>{siswa?.user?.nama}</td>
                                            <td>
                                              {
                                                siswa?.user?.anggotaRombel
                                                  ?.rombel?.nama
                                              }
                                            </td>
                                            <td>
                                              {
                                                siswa?.rombelPembayaran
                                                  ?.pembayaran?.nama
                                              }
                                            </td>
                                            <td>
                                              {currencyFormatter(
                                                totalSudahBayar
                                              )}
                                            </td>
                                            <td>
                                              {`${
                                                parseInt(nominal) -
                                                  parseInt(totalSudahBayar) <
                                                0
                                                  ? "+"
                                                  : ""
                                              } ${currencyFormatter(
                                                Math.abs(
                                                  parseInt(nominal) -
                                                    parseInt(totalSudahBayar)
                                                )
                                              )}`}
                                            </td>
                                            <td>
                                              <div
                                                className={`rounded-pill fw-bold py-1 d-flex justify-content-center fs-12-ss ${
                                                  renderStatus(status).className
                                                }`}
                                                style={{
                                                  width: "125px",
                                                }}
                                              >
                                                {renderStatus(status).text}
                                              </div>
                                            </td>
                                            <td>
                                              <Link
                                                href={`${ssURL}/transaksi/[id]`}
                                                as={`${ssURL}/transaksi/${siswa?.id}`}
                                              >
                                                <a className="text-decoration-none">
                                                  <button className="btn  btn-primary btn-primary-ss shadow-primary-ss fs-14-ss rounded-pill py-1 px-4">
                                                    Detail
                                                  </button>
                                                </a>
                                              </Link>
                                            </td>
                                            <td>
                                              <div className="dropdown dropdown-ss d-flex">
                                                <button
                                                  className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
                                                  style={{
                                                    width: "40px",
                                                    height: "40px",
                                                  }}
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#modalBuatPembayaran"
                                                  onClick={() =>
                                                    onClickEdit({
                                                      ...siswa?.rombelPembayaran
                                                        ?.pembayaran,
                                                      user: siswa?.user,
                                                    })
                                                  }
                                                >
                                                  <FaPen className="color-secondary" />
                                                </button>
                                                <button
                                                  className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                                  style={{
                                                    width: "40px",
                                                    height: "40px",
                                                  }}
                                                  onClick={() =>
                                                    _deletePembayaran(
                                                      siswa?.rombelPembayaran
                                                        ?.pembayaran?.id
                                                    )
                                                  }
                                                >
                                                  <FaTrashAlt className="color-secondary" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {pembayaran?.length > 0 &&
                      pembayaran?.map((pembayaranData) => {
                        const rombelData = pembayaranData?.rombel?.slice(0, 5);
                        const pelunasanData = totalPelunasan?.find(
                          (item) => item.id == pembayaranData.id
                        );

                        return (
                          <ListPembayaran
                            pembayaranData={pembayaranData}
                            onClickEdit={onClickEdit}
                            _deletePembayaran={_deletePembayaran}
                            rombelData={rombelData}
                            pelunasanData={pelunasanData}
                            rekeningSekolah={rekeningSekolah}
                          />
                        );
                      })}
                  </>
                )}
              </div>
            </div>
          </div>
          <ModalBuatPembayaran
            _getPembayaran={_getPembayaran}
            tipePembayaran={tipePembayaran}
            tipeUjian={tipeUjian}
            rombel={rombel}
            editData={editData}
            setEditData={setEditData}
            ta={ta}
            rekeningSekolah={rekeningSekolah}
            akun={akun}
            taId={taId}
            user={user}
            userData={userData}
            tipe={nav}
          />
        </>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({ query: { nav, taId, subnav } }) {
  return {
    props: {
      nav: nav || null,
      taId: taId || null,
      subnav: subnav || null,
    },
  };
}

export default index;
