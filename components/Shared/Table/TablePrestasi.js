import { useEffect, useRef, useState } from "react";
import { FaFilter, FaPen, FaTrash, FaTrashAlt } from "react-icons/fa";
import Dropdown from "../Dropdown/Dropdown";
import ModalTambahPrestasi from "../ModalTambahPrestasi/ModalTambahPrestasi";
import swal from "sweetalert";
import Skeleton from "react-loading-skeleton";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { deletePrestasi, getPrestasi } from "../../../client/PrestasiClient";
import { Pagination } from "antd";
import { ssURL } from "../../../client/clientAxios";
import ModalTambahPenghargaan from "components/TataTertib/modal/ModalTambahPenghargaan";
import Link from "next/link";
import useSekolah from "hooks/useSekolah";
import SelectShared from "../SelectShared/SelectShared";

const TablePrestasi = ({
  editData,
  setEditData,
  tingkatProps,
  tingkatPrestasi,
  loading,
  listPrestasi,
  prestasiData,
  _getPrestasi,
  taProps,
  listTa
}) => {
  const { sekolah } = useSekolah();

  const router = useRouter();
  const firstRender = useRef(true);

  const { page = 1 } = router.query;

  const [collapseOpen, setcollapseOpen] = useState(false);
  const [search, setSearch] = useState(router.query.search || "");
  const [tingkat, setTingkat] = useState(tingkatProps || "");
  const [ta, setTa] = useState(taProps || "");

  const [debounceSearch] = useDebounce(search, 600);

  const listOptionsPrestasi = tingkatPrestasi?.map((prestasi) => {
    return {
      value: prestasi?.id,
      label: prestasi?.tingkat,
    };
  });

  const listOptionsTa = listTa?.map((ta) => {
    return {
      value: ta?.id,
      label: `${ta?.tahun} - ${ta?.semester}`,
    };
  });

  const _deletePrestasi = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deletePrestasi(id);
        if (data) {
          toast.success(data.message);
          _getPrestasi();
        } else {
          toast.error(error.message);
        }
      }
    });
  };

  const setFilter = () => {
    const queryParams = {
      search: search,
      tingkat: tingkat,
      m_ta_id: ta,
    };

    // delete queryParams if value is null
    Object.keys(queryParams).map((query) => {
      !queryParams[query] && delete queryParams[query];
    });

    router.push({
      pathname: router.pathname,
      query: queryParams,
    });
  };

  const restructurePenghargaan = (penghargaan) => {
    return penghargaan?.map((data) => {
      return {
        value: data?.id,
        label: data?.tingkat,
      };
    });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      setFilter();
    }
  }, [debounceSearch, tingkat, ta]);

  return (
    <div className="card card-ss mt-4">
      <div className="card-header card-header-ss p-4">
        <div className="d-flex justify-content-between align-items-sm-center flex-md-row flex-column">
          <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
            Daftar Prestasi
          </h4>
          <div className="d-flex align-items-md-center flex-md-row flex-column">
            <input
              type="text"
              className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-md-3 mb-md-0 mb-3 md-w-100"
              style={{ height: "42px", width: "100%" }}
              id="exampleFormControlInput1"
              placeholder="Cari"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-joyride="cari"
            />
            <button
              className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white fw-bold mb-md-0 mb-3 color-secondary ${
                collapseOpen && "active"
              }`}
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
              onClick={() => setcollapseOpen(!collapseOpen)}
              data-joyride="filter-perpus-collapse"
            >
              <FaFilter className="me-3 fs-14-ss color-secondary" />
              Filter
            </button>
            {/* {tingkatPrestasi?.length && (
              <Dropdown
                listValue={listOptionsPrestasi}
                defaultValue={
                  listOptionsPrestasi?.find((d) => d.value == tingkat)?.label
                }
                onChange={(e) => setTingkat(e.value)}
                isDropdownMutasi
                dataJoyride="tingkat-prestasi"
              />
            )}
            <Dropdown
              listValue={listOptionsTa}
              defaultValue={
                listOptionsTa?.find((d) => d.value == ta)?.label
              }
              onChange={(e) => setTa(e.value)}
              isDropdownMutasi
              dataJoyride="ta"
            /> */}
          </div>
        </div>
        <div className="collapse" id="collapseExample">
          <hr className="hr-ss my-4" />
          <div className="row">
            <div className="col-md-6">
              <div className="select-akun-keuangan">
                <SelectShared
                  handleChangeSelect={(e) => setTingkat(e?.value)}
                  value={listOptionsPrestasi?.find((d) => d.value == tingkat)?.value}
                  options={listOptionsPrestasi}
                  isClearable
                  isDropdownMutasi
                  placeholder="Pilih tingkat prestasi"
                  dataJoyride="tingkat-prestasi"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="select-akun-keuangan">
                <SelectShared
                  handleChangeSelect={(e) => setTa(e?.value)}
                  value={listOptionsTa?.find((d) => d.value == ta)?.value}
                  options={listOptionsTa}
                  isClearable
                  isDropdownMutasi
                  placeholder="Pilih tahun akademik"
                  dataJoyride="tahun-akademik"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive mt-3">
          {loading && <Skeleton count={3} height={50} />}
          {!loading && (
            <table className="table-ss" data-joyride="table-prestasi">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}</th>
                  <th>Nama Prestasi</th>
                  <th>Tingkat</th>
                  <th className="text-center">Peringkat</th>
                  <th className="text-center">Detail</th>
                  {!router.pathname.includes("web") && <th></th>}
                </tr>
              </thead>
              <tbody>
                {listPrestasi?.map((prestasi, index) => (
                  <tr key={`${index}-${new Date().getTime()}`}>
                    <td data-th="No">{index + 1}</td>
                    <td data-th="Nama">{prestasi?.user?.nama}</td>
                    <td data-th="Nama Prestasi">{prestasi?.nama}</td>
                    <td data-th="Tingkat">
                      {prestasi?.tingkatPrestasi?.tingkat}
                    </td>
                    <td
                      data-th="Peringkat"
                      className="fw-extrabold text-center color-dark"
                    >
                      {prestasi.peringkat}
                    </td>
                    <td data-th="Detail" className="text-center">
                      <Link href={`prestasi/${prestasi?.id}`}>
                        <a className="btn btn-primary-ss rounded-pill px-3 py-1 text-decoration-none fs-12-ss shadow-primary-ss">
                          Detail
                        </a>
                      </Link>
                    </td>
                    {!router.pathname.includes("web") && (
                      <td data-th="Aksi" className="actions">
                        {/* Dropdown Option Start */}

                        <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                          <div
                            role="button"
                            id="dropdownOption"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img
                              src={`/img/icon-dropdown-option.svg`}
                              alt="icon-option"
                            />
                          </div>
                          <ul
                            className="dropdown-menu dropdown-menu-ss my-1"
                            aria-labelledby="dropdownOption"
                          >
                            <li
                              data-bs-toggle="modal"
                              data-bs-target="#ModalTambahPenghargaan"
                              onClick={() => setEditData(prestasi)}
                            >
                              <a className="dropdown-item">
                                <FaPen className="me-2" />
                                <span>Edit</span>
                              </a>
                            </li>
                            <li onClick={() => _deletePrestasi(prestasi.id)}>
                              <a className="dropdown-item color-danger">
                                <FaTrashAlt className="me-2" />
                                <span>Hapus</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Option End */}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
            <Pagination
              total={prestasiData?.total}
              showSizeChanger={false}
              current={page || 1}
              pageSize={20}
              onChange={(e) => router.push(`${ssURL}/prestasi?page=${e}`)}
            />
          </div>
        </div>
      </div>

      {!router.pathname.includes("web") && (
        <ModalTambahPenghargaan
          listPenghargaan={tingkatPrestasi}
          restructurePenghargaan={restructurePenghargaan}
          // editDataPenghargaan={null}
          _getDetailSiswa={_getPrestasi}
          editDataPenghargaan={editData}
          title="Prestasi"
          sekolah={sekolah}
        />
      )}
    </div>
  );
};

export default TablePrestasi;
