import { DatePicker } from "antd";
import { getDetailAlumni, editAlumni } from "client/AlumniV2Client";
import ScrollMenuDetailAlumni from "components/Alumni/ScrollMenuDetailAlumni";
import SectionBerkas from "components/Alumni/SectionBerkas";
import SectionDetailProfilAlumni from "components/Alumni/SectionDetailProfilAlumni";
import SectionBioAlumni from "components/Alumni/SectionBioAlumni";
import SectionStatusSaatIni from "components/Alumni/SectionStatusSaatIni";
import LayoutDetailAlumni from "components/Layout/LayoutDetailAlumni";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Avatar from "components/Shared/Avatar/Avatar";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { ssURL } from "client/clientAxios";
const { RangePicker } = DatePicker;

const index = ({ id }) => {
  const [formData, setFormData] = useState({
    TahunData: "",
    JurusanData: "",
    StatusAlumni: "",
    verifikasi: 1,
  });

  const initialEditVerifikasi = {
    verifikasi: 1,
    dihapus: 1,
  };

  const [editVerifikasi, setEditVerifikasi] = useState(initialEditVerifikasi);

  const router = useRouter();
  const [editData, setEditData] = useState(null);
  const { page = 1 } = router.query;
  const { user } = useUser();
  const [jurusan, setJurusan] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filterGrafik, setFilterGrafik] = useState("jurusan");
  const [tipeRombel, setTipeRombel] = useState({});
  const [detailAlumni, setDetailAlumni] = useState([]);
  const [dataAlumni, setDataAlumni] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [datajurusan, setDataJurusan] = useState([]);
  const [tahunData, setTahunData] = useState([]);

  const _getDetailAlumni = async () => {
    const { data, error } = await getDetailAlumni(id, {
      jurusan: formData?.JurusanData,
      status: formData?.StatusAlumni,
      tahun_masuk: formData?.TahunData,
    });

    if (data) {
      setDetailAlumni(data?.alumni1);
      setDataAlumni(data?.alumni);
      setDataStatus(data?.statusAlumni);
      setDataJurusan(data?.jurusanData);
      setTahunData(data?.tahunData);
    }
  };
  const _editAlumni = async () => {
    const { data, error } = await editAlumni(id, {
      verifikasi: editVerifikasi.verifikasi,
    });

    if (data) {
      toast.success(data.message);
      setEditVerifikasi(initialEditVerifikasi);
      _getDetailAlumni();
    }
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Bar Chart - Stacked",
      },
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderSkipped: "middle",
      },
    },
  };

  const handleChangeAngkatan = (e, name) => {
    setIsLoading(true);

    setFormData({
      ...formData,
      TahunData: e?.value,
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };
  const handleChangeJurusan = (e, name) => {
    setIsLoading(true);

    setFormData({
      ...formData,
      JurusanData: e?.value,
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  const handleChangeStatus = (e, name) => {
    setIsLoading(true);

    setFormData({
      ...formData,
      StatusAlumni: e?.value,
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  const _tolakAlumni = async () => {
    swal({
      title: "Yakin tolak verifikasi?",
      text: "Perhatikan kembali data yang ingin anda tolak",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await editAlumni(id, {
          ...editVerifikasi,
          dihapus: 1,
          verifikasi: null,
        });
        router.push(`${ssURL}/alumni`);
        toast.success(data?.message);
        _getDetailAlumni();
      }
    });
  };

  const _terimaAlumni = async (e) => {
    if (e) {
      await editAlumni(id, {
        ...editVerifikasi,
        verifikasi: 1,
      });
      toast.success(data?.message);
      _getDetailAlumni();
    }
  };

  useEffect(() => {
    _getDetailAlumni();
  }, [formData?.TahunData, formData?.JurusanData, formData?.StatusAlumni, id]);

  return (
    <LayoutDetailAlumni
      listAngkatan={tahunData}
      listJurusan={datajurusan}
      listStatus={dataStatus}
      selectAngkatan={formData?.TahunData}
      selectJurusan={formData?.JurusanData}
      selectStatus={formData?.StatusAlumni}
      urlAngkatan={handleChangeAngkatan}
      urlJurusan={handleChangeJurusan}
      urlStatus={handleChangeStatus}
    >
      <AnimatePage>
        <div className="mb-4">
          <ScrollMenuDetailAlumni
            listAlumni={dataAlumni}
            listAngkatan={tahunData}
            listJurusan={datajurusan}
            listStatus={dataStatus}
            selectedId={id}
          />
        </div>
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 ">
              <img
                // src={user?.home || "https://picsum.photos/1920/1080"}
                src={"https://picsum.photos/1920/1080"}
                className="card-img-top card-header-ss img-fit-cover bg-detail-partner-kolaborasi mb-lg-0 mb-3"
              />
              <div className="name-user-profil p-4 position-relative d-flex justify-content-lg-between justify-content-center align-items-sm-center text-center flex-lg-row flex-column text-sm-start text-center">
                <div className="position-absolute img-user-profil img-user-profil-alumni mx-sm-0 mx-auto">
                  <div className="position-relative rounded-circle border border-5 border-white">
                    {/* <Avatar name={user?.nama} size={120} src={user?.avatar} /> */}
                    <Avatar
                      name={detailAlumni?.user?.nama}
                      size={120}
                      src={detailAlumni?.user?.avatar}
                    />
                  </div>
                </div>
                <h4 className="fw-extrabold color-dark mb-lg-0 mb-4">
                  {detailAlumni?.user?.nama}
                </h4>
                {detailAlumni?.verifikasi != 1 && (
                  <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                    <button
                      className="btn btn-ss btn-danger btn-danger-ss rounded-pill fs-14-ss fw-bold me-sm-4 mb-sm-0 mb-3"
                      onClick={_tolakAlumni}
                    >
                      <FaTimes className="mb-1 me-2" /> Tolak
                    </button>
                    <button
                      className="btn btn-ss btn-success btn-success-ss rounded-pill fs-14-ss fw-bold"
                      onClick={_terimaAlumni}
                    >
                      <FaCheck className="mb-1 me-2" /> Terima
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <SectionStatusSaatIni isReadOnly dataDetailAlumni={detailAlumni} />
          </div>

          {detailAlumni?.status != "mencari-kerja" &&
            detailAlumni?.status != "berwirausaha" && (
              <div className="col-md-12">
                <SectionBerkas isReadOnly dataBerkasAlumni={detailAlumni} />
              </div>
            )}

          <div className="col-md-12">
            <SectionBioAlumni isReadOnly dataDetailAlumni={detailAlumni} />
          </div>

          <div className="col-md-12">
            <SectionDetailProfilAlumni
              isReadOnly
              dataDetailAlumni={detailAlumni}
            />
          </div>
        </div>
      </AnimatePage>
    </LayoutDetailAlumni>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
