import { getHasilUjian } from "client/UjianClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ id }) => {
  // const [dataHasilUjian, setDataHasilUjian] = useState({});

  // const getHasilUJian = async () => {
  //   const { data } = await getHasilUjian(id);
  //   if (data) {
  //     setDataHasilUjian(data);
  //   }
  // };

  // useEffect(() => {
  //   getHasilUJian();
  // }, []);

  return (
    <Layout modalWrapper={<></>}>
      <AnimatePage>
        <div className="row gy-4">
          {/* Header Jadwal Ujian Detail End */}
          <div className="col-md-12">
            <Link href={`${ssURL}/jadwal-ujian?subnav=berlangsung`}>
              <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>

            <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 mt-4">
              {/* Card Label & Option Start */}
              <h4 className="fw-extrabold text-center color-dark mb-4">
                Peringatan
              </h4>
              <div className="row justify-content-center">
                <div className="col-lg-5 col-md-6 col-sm-8">
                  <img
                    src={`/img/warning-illustration.png`}
                    alt="illustration"
                    className="img-fluid mb-4"
                    // style={{ width: "275px", height: "200px" }}
                  />
                </div>
              </div>
              <div className="row justify-content-center">
                <div className={`col-md-8 text-center mb-4`}>
                  <h6 className={`fs-18-ss md-fs-6 mb-4 fw-bold color-dark`}>
                    Anda dikeluarkan dari halaman ujian
                  </h6>
                                    <p className="fw-semibold text-center md-fs-14-ss text-start">
                   Hubungi Pengawas Ujian / Guru Pengawas
                  </p>
                </div>
              </div>
                {/* <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-8">
                    <button
                      className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                      type="button"
                      // onClick={onClickClose}
                    >
                      Lanjutkan Ujian
                    </button>
                  </div>
                </div> */}

              {/* Jadwal Ujian Info End */}
            </div>
          </div>
          {/* Header Jadwal Ujian Detail End */}
        </div>
      </AnimatePage>
    </Layout>
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
