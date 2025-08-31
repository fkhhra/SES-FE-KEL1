import { downloadURL, ssURL } from "client/clientAxios";
import {
  deleteRekeningSekolah,
  downloadRekening,
} from "client/RekeningSekolahClient";
import { getRencanaRekeningSekolah } from "client/RencanaKeuanganClient";
import HeaderPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderPerencanaanKeuangan";
import Layout from "components/Layout/Layout";
import ListRekening from "components/Rekening/ListRekening";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalTambahRekening from "components/Shared/ModalTambahRekening/ModalTambahRekening";
import useUser from "hooks/useUser";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { neracaHitungLevelAkun } from "utilities/KeuanganUtils";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ id }) => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState();
  const [rekeningSekolah, setRekeningSekolah] = useState([]);
  const [loading, setLoading] = useState(false);
  const [levelAkun, setLevelAkun] = useState([]);

  const [searchDebounce] = useDebounce(search, 300);

  const _getRekeningSekolah = async () => {
    setLoading(true);
    const { data } = await getRencanaRekeningSekolah(id, { search: search });
    if (data) {
      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = neracaHitungLevelAkun(
        data?.akun,
        template,
        "rencanaJurnal"
      );
      setLevelAkun(hasil);
      setRekeningSekolah(data.rekSekolah);
    }
    setLoading(false);
  };

  const handleDeleteRekening = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Kontak CS Smartschool jika sengaja terhapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteRekeningSekolah(id);
        if (data) {
          toast.success(data?.message);
          _getRekeningSekolah();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const onClickEdit = (data) => {
    setEditData({
      ...data,
    });
  };
  const handleClickDownload = async () => {
    const { data } = await downloadRekening({ m_rencana_keuangan_id: id });

    window.open(`${downloadURL}/${data}`, "_blank");
  };
  useEffect(() => {
    _getRekeningSekolah();
  }, [searchDebounce]);

  return (
    <Layout>
      <AnimatePage>
        <HeaderPerencanaanKeuangan ssURL={ssURL} id={id} user={user} />
        <div className="row">
          <div className="col-md-12">
            <div>
              <div className="card card-ss mb-4 p-4">
                <div className="d-flex jusitfy-content-start align-items-sm-center flex-sm-row flex-column">
                  <input
                    type="text"
                    className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-3 mb-sm-0 mb-3"
                    style={{ height: "42px" }}
                    id="exampleFormControlInput1"
                    placeholder="Cari Akun"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    className="btn btn-ss btn-outline-secondary  btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss"
                    type="button"
                    onClick={() => handleClickDownload()}
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Rekening
                  </button>
                </div>
              </div>
              <div className="">
                {rekeningSekolah?.map((item) => {
                  return (
                    <ListRekening
                      data={item}
                      onClickEdit={onClickEdit}
                      handleDeleteRekening={handleDeleteRekening}
                      levelAkun={levelAkun}
                      edit={false}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <ModalTambahRekening
          editData={editData}
          _getRekeningSekolah={_getRekeningSekolah}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
