import { getProfilUser } from "client/AuthClient";
import { meSekolah } from "client/SekolahClient";
import { getDetailUser } from "client/UserClient";
import useSekolah from "hooks/useSekolah";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import { useEffect, useState } from "react";
import { getFormatDate, momentPackage, padNumber } from "utilities/HelperUtils";

const index = ({id}) => {
  const { ta } = useTa();
  const { sekolah, setSekolah } = useSekolah();
  const { user, setUser } = useUser();
  const [detailUser, setDetailUser] = useState(null)

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
    }
  };

  const _getDetailUser = async () => {
    const {data} = await getDetailUser(id, {rombel_id: id});

    if (data) {
    setDetailUser(data?.user)
    }}
    
    useEffect(() => {
        setTimeout(function () {
          window.print();
        }, 1500);
    }, []);
    
    useEffect(() => {
      _getProfil();
      getMeSekolahData();
      _getDetailUser();
    }, []);

  return (
    <>
      <div className="print-page">
        <div className="border border-dark">
          <div className="p-4 d-flex align-items-center justify-content-between">
            <img
              src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
              alt=""
              height={sekolah?.id !== 14 ? "50px" : "100px"}
              width={sekolah?.id !== 14 ? "50px" : "100px"}
              className="img-fit-contain"
            />
            <div className="text-center fw-bold text-uppercase">
              <h6 className="fs-14-ss">
                KARTU PESERTA UJIAN SISWA{" "}
              </h6>
              <h6 className="fs-14-ss">{sekolah?.nama}</h6>
              {user?.mSekolahId == 70 && (
                <h6></h6>
              )}
              {sekolah?.id == 70 ? (
                <h6 className="fs-14-ss mb-0">TAHUN 2023 - 2024</h6>
              ) : (
                <h6 className="fs-14-ss mb-0">
                  TAHUN {momentPackage().add(6, "months").format("YYYY")} -{" "}
                  {momentPackage().add(18, "months").format("YYYY")}
                </h6>
              )}
            </div>
            {sekolah?.id !== 14 ? (
              <img
                src={`${
                  sekolah?.id == 7789
                    ? "/img/ppdbannahl/logo-kementerian-agama.png"
                    : sekolah?.logoSs || `/img/ss-logo-icon.png`
                } `}
                alt=""
                height="50px"
                width="50px"
                className="img-fit-contain"
              />
            ) : (
              <div></div>
            )}
          </div>
          <div className="p-2 bg-primary text-white">
            <h6 className="fw-bold text-uppercase fs-14-ss mb-0">
              Data Peserta
            </h6>
          </div>
          <div className="p-3">
            <div className="row justify-content-between">
              <div className="col-3 d-flex justify-content-start justify-content-center">
                <img
                  src={detailUser?.avatar || 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'}
                  alt="Foto Siswa"
                  className="img-fit-cover d-sm-block d-none"
                  width="220px"
                  height="220px"
                />
              </div>
              <div className="col-7">
                <table className="w-100">
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">NOMOR PESERTA</div>{" "}
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">
                          {detailUser?.noUjian || "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">NAMA</div>
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="mb-3 fs-12-ss">
                        <span className="fw-bold">{detailUser?.nama}</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="">
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "30%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">ASAL SEKOLAH</div>
                    </td>
                    <td
                      className="text-uppercase align-text-top"
                      style={{ width: "5%" }}
                    >
                      {" "}
                      <div className="mb-3 fs-12-ss">:</div>{" "}
                    </td>
                    <td className="text-uppercase align-text-top">
                      {" "}
                      <div className="fs-12-ss">
                        <span className="fw-bold">
                          {sekolah?.nama}
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;


export async function getServerSideProps({
  params: { id },
}) {
  return {
    props: {
      id,
    },
  };
}