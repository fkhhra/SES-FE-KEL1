import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import TablePrestasi from "../../../components/Shared/Table/TablePrestasi";
import Layout from "../../../components/Layout/Layout";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import { getPrestasi } from "client/PrestasiClient";
import { useRouter } from "next/router";
import { joyridePrestasi } from "utilities/JoyrideUtils";
import { useRef } from "react";

const index = ({ tingkat, m_ta_id }) => {
  const router = useRouter();
  const firstRender = useRef(true);

  const { page = 1 } = router.query;

  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [prestasiData, setPrestasiData] = useState({
    prestasi: [],
    tingkat: [],
  });

  const { prestasi: listPrestasi, tingkat: tingkatPrestasi, ta: listTa } =
    prestasiData || {};

  const listTingkatCount = tingkatPrestasi?.map((prestasi) => {
    return {
      tingkatPrestasi: prestasi?.tingkat,
      count: prestasi?.meta?.total,
    };
  });

  const _getPrestasi = async () => {
    const params = {
      ...router.query,
      page: page,
    };

    const { data } = await getPrestasi(params);
    if (data) {
      setPrestasiData({
        ...prestasiData,
        ta: data.semuaTa,
        tingkat: data.tingkat,
        prestasi: data.prestasi.data,
        total: data.prestasi.total,
      });
    }
  };

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      _getPrestasi();
    }
  }, [page]);

  useEffect(() => {
    // if (!isEmpty(router.query)) {
    //   _getPrestasi();
    // }
    _getPrestasi();
  }, [router.query]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await _getPrestasi();
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <MyJoyride steps={joyridePrestasi} />
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-0">
              <div
                className="card-header card-header-ss p-4 pb-0"
              >
                <div
                  className="d-flex align-items-center flex-md-row flex-column"
                  style={{
                    alignItems: "center !important",
                  }}
                >
                  <div
                    className="rounded-circle shadow-primary-ss me-4 mb-0"
                    style={{
                      width: "86px",
                      height: "86px",
                    }}
                  >
                    <img
                      src={`/img/icon-prestasi.svg`}
                      alt="icon"
                      width="86px"
                      height="86px"
                    />
                  </div>
                  <h1
                    className="color-dark fw-black m-0"
                    style={{
                      fontSize: "48px",
                    }}
                  >
                    Prestasi
                  </h1>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-9 mb-lg-0 mb-3">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      {listTingkatCount?.map((tingkat, index) => (
                        <div
                          className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1"
                          key={`${index}-${new Date().getTime()}`}
                        >
                          <h6 className="fw-bold fs-14-ss  color-secondary mb-2">
                            {tingkat?.tingkatPrestasi}
                          </h6>
                          <h4 className="fw-extrabold fs-5 color-primary m-0">
                            {`${tingkat?.count} Prestasi`}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-3 ps-2">
                    <a
                      className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalTambahPenghargaan"
                      onClick={() => setEditData(null)}
                      data-joyride="btn-tambah-prestasi"
                    >
                      <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                        <img
                          src={`/img/icon-tambah-prestasi.svg`}
                          alt="icon-tambah-prestasi"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                          Tambah Prestasi
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <TablePrestasi
            editData={editData}
            setEditData={setEditData}
            tingkatProps={tingkat}
            tingkatPrestasi={tingkatPrestasi}
            loading={loading}
            listPrestasi={listPrestasi}
            prestasiData={prestasiData}
            _getPrestasi={_getPrestasi}
            taProps={m_ta_id}
            listTa={listTa}
          />
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { tingkat, m_ta_id } }) {
  return {
    props: {
      tingkat: tingkat || null,
      m_ta_id: m_ta_id || null,
    },
  };
}

export default index;
