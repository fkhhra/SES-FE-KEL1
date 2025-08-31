import { getRppGuru } from "client/RppClient";
import { useState } from "react";
import { useEffect } from "react";
import { FaPrint } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";
import { useDebounce } from "use-debounce";
import { useRef } from "react";
import { getPreviewURL } from "utilities/FileViewer";

import useUser from "hooks/useUser";

const SectionSuratKeputusan = ({ userId }) => {

  const { user } = useUser();
  const firstRender = useRef(true);

  const [listSurat, setListSurat] = useState([]);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);

  const _getRpp = async (search) => {
    const { data } = await getRppGuru(userId ? userId : user?.id, { search });
    if (data) {
      setListSurat(data?.surat);
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      _getRpp(debounceSearch);
    }
  }, [debounceSearch]);

  useEffect(() => {
    _getRpp();
  }, []);

  return (
    <div className="card-ss bg-white shadow-dark-ss card-body rounded-ss w-100 d-flex flex-md-row flex-column p-0 pb-5 ">
      <div className="col-md-12 ">
        <div className="row p-4 justify-content-between">
          <div className="col-lg-4 col-12 d-flex align-citems-center">
            <h1 className="fw-extrabold fs-4 color-dark mb-0">
              Surat Keputusan
            </h1>
          </div>
          <div className="col-lg-3 d-flex flex-md-row flex-column justify-content-lg-end justify-content-between mt-lg-0 mt-3">
            <div className="flex-grow-1 me-md-4 mb-md-0 mb-3">
              <input
                type="text"
                className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                style={{ height: "42px", width: "100%" }}
                id="exampleFormControlInput1"
                placeholder="Cari Surat Keputusan"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="" data-joyride="table-rombel">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Tahun Akademik</th>
                  <th>Tanggal</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                { listSurat?.map((surat, index) =>
                  <tr key={surat?.id}>
                    <td data-th="No">{index+1}</td>
                    <td data-th="Nama">
                      <img src="/img/icon-file.svg" style={{ width: "40px", height: "40px" }} className="me-3" />
                      {surat?.surat?.nama || "--"}
                    </td>
                    <td data-th="Tahun Akademik">
                      {surat?.surat?.tahun || "--"}
                    </td>
                    <td data-th="Tanggal">
                      {momentPackage(surat?.surat?.createdAt).format(
                        "DD MMM YYYY"
                      )}
                    </td>
                    <td data-th="Detail">
                      <a
                        href={getPreviewURL(surat?.surat?.file)} target="_blank"
                        className="rounded-circle bg-soft-primary mx-md-auto color-secondary btn-link btn p-1"
                        style={{ height: "30px", width: "30px" }}
                      >
                        <FaPrint />
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionSuratKeputusan;