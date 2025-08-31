import Layout from "../../../components/Layout/Layout";
import React, { useEffect, useState } from "react";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { FaCloudDownloadAlt, FaSearch } from "react-icons/fa";
import { DatePicker, Pagination, Skeleton } from "antd";
import { getTamu } from "../../../client/TamuClient";
import moment from "moment";
import { baseURL } from "../../../client/clientAxios";
import { momentPackage } from "../../../utilities/HelperUtils";

const index = () => {
  const initialSearch = {
    date: moment(),
  };

  const [tamu, setTamu] = useState([]);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState(initialSearch);

  const _getTamu = async () => {
    const { data, error } = await getTamu({
      page,
      limit: 20,
      date: moment(searchData.date).format("YYYY-MM-DD"),
    });

    if (data) {
      setTamu(data.absen);
    }
  };

  useEffect(() => {
    _getTamu();
  }, [page, searchData]);
  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-md-0 mb-3">
                    Daftar Tamu
                  </h4>
                  <div className="d-flex flex-sm-row flex-column justify-content-md-start justify-content-sm-between justify-content-start">
                    {/* <button
                      type="button"
                      className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-sm-3 fs-14-ss mb-sm-0 mb-3"
                      onClick={() => {
                        downloadAbsenData();
                      }}
                      data-joyride="btn-download-rekapan"
                    >
                      <FaCloudDownloadAlt className="me-2 fs-6" />
                      Rekap Buku Tamu
                    </button> */}
                    <div
                      class="date-picker-kehadiran d-flex"
                      data-joyride="filter-tanggal"
                    >
                      <DatePicker
                        className="w-100"
                        onChange={(val) =>
                          setSearchData({ ...searchData, date: val })
                        }
                        placeholder="Pilih tanggal"
                        value={searchData.date}
                      />
                      <button
                        type="button"
                        className="btn btn-ss btn-primary btn-primary-ss fs-14-ss"
                        // onClick={() => {
                        //   handleGetAbsenData();
                        // }}
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  {/* {loading && <Skeleton count={4} height={50} />}
                  {!loading && ( */}
                  <table className="table-ss" data-joyride="table-kehadiran">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Foto</th>
                        <th>Suhu Badan</th>
                        <th>Status Masker</th>
                        <th>Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tamu?.data?.map((item, idx) => (
                        <tr>
                          <td data-th="No">{idx + 1}</td>
                          <td data-th="Foto">
                            <img
                              src={baseURL + item?.foto.replace("tmp", "")}
                              width={50}
                              height={50}
                              className="img-fit-cover rounded-circle pointer"
                            />
                          </td>
                          <td data-th="Suhu">
                            {item?.suhu
                              ? parseInt(item?.suhu).toFixed(2) + "°C"
                              : "tidak ada data"}
                          </td>
                          <td data-th="Waktu">
                            {item?.masker
                              ? "Memakai Masker"
                              : "Tidak Memakai Masker"}
                          </td>
                          <td data-th="Status">
                            {momentPackage(item?.waktuMasuk).format(
                              "DD MMMM YYYY"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* )} */}
                </div>
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <Pagination
                    total={tamu?.total}
                    pageSize={tamu?.perPage || 20}
                    showSizeChanger={false}
                    current={tamu?.page}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
