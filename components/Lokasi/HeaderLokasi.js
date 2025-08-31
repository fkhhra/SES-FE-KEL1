import { FaCloudDownloadAlt, FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { baseURL, downloadURL } from "../../client/clientAxios";
import { dowloadSarana } from "../../client/SaranaPrasaranaClient";

const HeaderLokasi = ({ setEditData, search, setSearch }) => {
  const handleClickDownload = async () => {
    const { data } = await dowloadSarana();

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  return (
    <div className="card card-ss mb-4">
      <div className="card-header p-4 card-header-ss">
        <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
          <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">Lokasi</h4>
          <div
            className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
            data-bs-toggle="modal"
            data-bs-target="#modalTambahPrasarana"
            onClick={() => setEditData(null)}
          >
            <FaPlus className="me-2" />
            Tambah Lokasi
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-lg-6 col-md-6 mb-3">
            <input
              type="text"
              className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
              style={{ height: "42px", width: "100%" }}
              id="exampleFormControlInput1"
              placeholder="Cari Lokasi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-joyride="cari-siswa"
            />
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <button
              className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss w-100"
              onClick={handleClickDownload}
            >
              <FaCloudDownloadAlt className="me-2 fs-5" />
              Rekap Lokasi
            </button>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <button
              className="btn btn-ss btn-secondary btn-secondary-ss rounded-pill fw-semibold  border border-light-secondary-ss w-100"
              data-bs-toggle="modal"
              data-bs-target="#ModalImportExcel"
              data-joyride="btn-tambah-mapel"
            >
              <FaCloudUploadAlt className="me-2 fs-5" color="white" />
              Unggah Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLokasi;
