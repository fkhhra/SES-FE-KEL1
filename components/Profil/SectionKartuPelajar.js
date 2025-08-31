import { FaPen, FaPlus } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import ModalTambahKeahlian from "../Profil/ModalTambahKeahlian";
import useUser from "../../hooks/useUser";
import { momentPackage } from "../../utilities/HelperUtils";
import { bubble } from "react-burger-menu";
import useSekolah from "../../hooks/useSekolah";
import useTa from "../../hooks/useTa";

const SectionKartuPelajar = ({ isReadOnly = false, data }) => {
  const { user, setUser } = data || useUser();
  const { sekolah } = useSekolah();
  const { ta } = useTa();
  return (
    <>
      <div className="card card-ss p-4">
        <div className="container p-0 p-sm-4 pt-sm-0">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 pb-4 pt-0 mb-4">
              <div className="d-flex justify-content-center">
                <p className="btn-ss btn bg-white rounded-pill fw-bold border-2 border-primary-ss color-primary cursor-default ">
                  Tampak depan
                </p>
              </div>
              <div className="border rounded-ss border-light-secondary-ss">
                <div
                  className="card-header-ss bg-soft-primary p-4 fw-extrabold color-dark d-flex justify-content-between flex-column flex-sm-row"
                  style={{
                    borderBottom: "2px solid #2680eb",
                  }}
                >
                  <div className="d-flex d-sm-none justify-content-around mb-3">
                    <img
                      src={
                        sekolah?.id == "6521"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/logo-sekolah%2FWhatsApp_Image_2021-10-05_at_10.59.20-removebg-preview.png?alt=media&token=6fe1c450-1f5d-4213-9e1d-8d526b1623fe"
                          : sekolah?.id == "70"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1663917964233-1655542388101.png?alt=media&token=b16869a4-af37-42cc-b0ef-2e7b9b6f9131"
                          : "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1622802909890-ic-icon.png?alt=media&token=88700cba-717c-4e9a-a946-606bedea380f"
                      }
                      alt=""
                      height="65"
                    />
                    <img
                      src={
                        sekolah?.id == "6521"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/logo-sekolah%2FWhatsApp_Image_2021-10-05_at_10.59.20-removebg-preview.png?alt=media&token=6fe1c450-1f5d-4213-9e1d-8d526b1623fe"
                          : sekolah?.id == "70"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1663897393514-logo-pendidikan.png?alt=media&token=ece39daf-30a3-4e3f-92ed-e6c80f12c377"
                          : "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1622802909890-ic-icon.png?alt=media&token=88700cba-717c-4e9a-a946-606bedea380f"
                      }
                      alt=""
                      height="65"
                    />
                  </div>
                  <div className="logo-kartu-pelajar d-none d-sm-flex">
                    <img
                      src={
                        sekolah?.id == "6521"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/logo-sekolah%2FWhatsApp_Image_2021-10-05_at_10.59.20-removebg-preview.png?alt=media&token=6fe1c450-1f5d-4213-9e1d-8d526b1623fe"
                          : sekolah?.id == "70"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1640846817764-LOGOOO.jpg?alt=media&token=fc899986-f450-43e3-b415-02eb2d2381bc"
                          : "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1622802909890-ic-icon.png?alt=media&token=88700cba-717c-4e9a-a946-606bedea380f"
                      }
                      alt=""
                      height="65"
                    />
                  </div>
                  <div className="text-center">
                    <h6 className="fs-10-ss text-uppercase fw-semibold">
                      {sekolah?.id == "6521"
                        ? "PEMERINTAH PROVINSI SULAWESI BARAT"
                        : "PEMERINTAH PROVINSI DKI JAKARTA"}
                    </h6>
                    <h6 className="fs-10-ss text-uppercase fw-extrabold">
                      {sekolah?.id == "6521"
                        ? "DINAS PENDIDIKAN DAN KEBUDAYAAN"
                        : "DINAS PENDIDIKAN"}
                    </h6>
                    <h6
                      className="text-uppercase fw-bold color-primary"
                      style={{
                        fontSize: "17px",
                        fontFamily: "times",
                      }}
                    >
                      {sekolah?.nama}
                    </h6>
                    <h6
                      className="text-capitalize fw-bold "
                      style={{
                        fontSize: "8px",
                        lineHeight: "12px",
                      }}
                    >
                      {sekolah?.alamat || "-"}
                    </h6>
                  </div>
                  <div className="logo-kartu-pelajar d-none d-sm-flex">
                    <img
                      src={
                        sekolah?.id == "6521"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/logo-sekolah%2FWhatsApp_Image_2021-10-05_at_10.59.20-removebg-preview.png?alt=media&token=6fe1c450-1f5d-4213-9e1d-8d526b1623fe"
                          : sekolah?.id == "70"
                          ? "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1663897393514-logo-pendidikan.png?alt=media&token=ece39daf-30a3-4e3f-92ed-e6c80f12c377"
                          : "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1622802909890-ic-icon.png?alt=media&token=88700cba-717c-4e9a-a946-606bedea380f"
                      }
                      alt=""
                      height="65"
                    />
                  </div>
                </div>
                <div className="card-body p-4 bg-depan-kartu-pelajar">
                  <div className="row justify-content-sm-start justify-content-center flex-sm-row flex-column align-sm-start align-items-center">
                    <div className="col-lg-4 col-md-6 col-sm-5 col-8 foto-kartu-pelajar ">
                      <img
                        src={user?.avatar}
                        alt=""
                        style={{ width: "100%", height: "188px" }}
                        className="rounded-ss img-fit-cover img-fluid"
                      />
                    </div>
                    <div
                      style={{ width: "100%", marginTop: "12%" }}
                      className="text-center col d-flex flex-column justify-content-between nama-kartu-pelajar"
                    >
                      <div className="ms-0 ms-md-4">
                        <h5
                          style={{
                            fontSize: "19px",
                          }}
                          className="text-uppercase fw-black color-dark"
                        >
                          {user?.nama || "-"}
                        </h5>
                        <h6
                          style={{
                            fontSize: "15px",
                          }}
                          className="text-uppercase fw-bold color-primary"
                        >
                          NIS : {user?.profil?.nis || "-"}
                        </h6>
                      </div>
                      {sekolah?.id == 70 ? (
                        <div className="d-flex justify-content-center justify-content-lg-end position-relative order-1 order-md-2 ">
                          <div className="text-center">
                            {/* <p
                              className="mb-0 fw-bold color-dark"
                              style={{
                                fontSize: "8px",
                              }}
                            >
                              {momentPackage().format("dddd, DD MMMM YYYY")}
                            </p> */}
                            <p
                              className="mb-0 fw-bold color-dark"
                              style={{
                                fontSize: "8px",
                              }}
                            >
                              Kepala Sekolah,
                            </p>
                            <div
                              style={{
                                height: "33px",
                                background: "transparent",
                              }}
                            ></div>
                            <p
                              className="mb-0 fw-black color-dark"
                              style={{
                                fontSize: "8px",
                                textDecoration: "underline",
                              }}
                            >
                              {ta?.namaKepsek}
                            </p>
                            <p
                              className="mb-0 fw-bold color-dark"
                              style={{
                                fontSize: "8px",
                              }}
                            >
                              {ta?.nipKepsek}
                            </p>
                          </div>
                          <div className="position-absolute">
                            {/* <img
                            src="/img/contoh-ttd-kartu-pelajar.svg"
                            alt=""
                            height="70"
                          /> */}
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center justify-content-sm-end">
                          <img
                            src="/img/barcode-kartu-pelajar.svg"
                            alt="barcode"
                            // width="54px"
                            // height="54px"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8 ">
              <div className="d-flex justify-content-center">
                <p className="btn-ss btn bg-white rounded-pill fw-bold border-2 border-primary-ss color-primary cursor-default ">
                  Tampak Belakang
                </p>
              </div>
              <div className="border rounded-ss border-light-secondary-ss position-relative">
                <div
                  className="card-body p-4 bg-belakang-kartu-pelajar d-flex flex-column justify-content-between"
                  style={{
                    minHeight: "366px",
                  }}
                >
                  <div className="d-flex row z-index-2">
                    <div>
                      <h6 className="fw-black color-dark text-center">
                        DATA IDENTITAS SISWA
                      </h6>
                      <table
                        style={{
                          width: "100%",
                        }}
                      >
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              Nama Lengkap
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-black color-dark text-uppercase">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {user?.nama || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              NIS
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-bold color-dark ">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {user?.profil?.nis || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              No. Telpon
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-bold color-dark ">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {user?.whatsapp || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              Tempat/Tanggal Lahir
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-bold color-dark ">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {user?.tempatLahir}{" "}
                              {momentPackage(user?.tanggalLahir).format(
                                "DD MMM YYYY"
                              )}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              Agama
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-bold color-dark ">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {user?.profil?.agama || user?.agama || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              Alamat
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-bold color-dark ">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {/* Jl. Kober Kecil RT. 003 / RW. 008 No.20, Kel. Rawa
                              Bunga, Kec. Jatingera, Kota Jakarta Timur, DKI
                              Jakarta 13350 */}
                              {user?.profil?.alamat || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              Jenis Kelamin
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-bold color-dark ">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {user?.genderText || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "33%" }}
                          >
                            <p className="mb-0 fs-10-ss fw-bold color-dark">
                              Gol. Darah
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-0 fs-10-ss  fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-0 fs-10-ss fw-bold color-dark text-uppercase">
                              {/* {!buku?.nama ? `-` : `${buku?.nama}`} */}
                              {user?.profil?.golDarah || "-"}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="d-flex mt-auto justify-content-between z-index-2 flex-sm-row flex-column">
                    <div className=" mt-sm-auto mt-4 mb-sm-0 mb-4">
                      <div
                        className="bg-white rounded-ss "
                        style={{
                          width: "122px",
                          border: "1px solid #C3C3C8",
                        }}
                      >
                        <p
                          className="mb-0 fw-bold color-danger p-1 px-2"
                          style={{
                            fontSize: "8px",
                          }}
                        >
                          Kartu ini berlaku selama menjadi siswa di sekolah ini
                        </p>
                      </div>
                    </div>
                    {sekolah?.id == 70 ? (
                      <div className="d-flex justify-content-center justify-content-sm-end">
                        <img
                          src="/img/barcode-kartu-pelajar.svg"
                          alt="barcode"
                          // width="54px"
                          // height="54px"
                        />
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center justify-content-lg-end position-relative order-1 order-md-2 ">
                        <div className="text-center">
                          <p
                            className="mb-0 fw-bold color-dark"
                            style={{
                              fontSize: "8px",
                            }}
                          >
                            {momentPackage().format("dddd, DD MMMM YYYY")}
                          </p>
                          <p
                            className="mb-0 fw-bold color-dark"
                            style={{
                              fontSize: "8px",
                            }}
                          >
                            Kepala Sekolah,
                          </p>
                          <div
                            style={{
                              height: "33px",
                              background: "transparent",
                            }}
                          ></div>
                          <p
                            className="mb-0 fw-black color-dark"
                            style={{
                              fontSize: "8px",
                              textDecoration: "underline",
                            }}
                          >
                            {ta?.namaKepsek}
                          </p>
                          <p
                            className="mb-0 fw-bold color-dark"
                            style={{
                              fontSize: "8px",
                            }}
                          >
                            {ta?.nipKepsek}
                          </p>
                        </div>
                        <div className="position-absolute">
                          {/* <img
                            src="/img/contoh-ttd-kartu-pelajar.svg"
                            alt=""
                            height="70"
                          /> */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1622802909890-ic-icon.png?alt=media&token=88700cba-717c-4e9a-a946-606bedea380f"
                  alt=""
                  width="201"
                  style={{
                    opacity: "4%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  className="position-absolute"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-ss mt-4 d-none">
        <div className="card-body p-4">
          <h4 className="fw-extrabold color-dark title-border mb-5">
            Cetak Kartu Pelajar
          </h4>
          {/* <p className="fw-bold color-dark text-center mb-4">
            Silahkan mencetak kartu peserta dan kartu pendaftaran, lalu simpan
            untuk melihat hasil pendaftaran
          </p> */}
          <div className="row justify-content-center">
            <div className="col-md-6">
              {/* <Pdf
                      options={options}
                      targetRef={kartuRef}
                      filename="Kartu Peserta.pdf"
                    >
                      {({ toPdf }) => ( */}
              <div
                className="w-100 rounded-ss bg-soft-primary p-3 d-flex align-items-center justify-content-center pointer"
                // onClick={() => {
                //   setUserView(false);
                //   setTimeout(() => {
                //     toPdf();
                //     setUserView(true);
                //   }, 1);
                // }}
              >
                <img src="/img/icon-print.svg" alt="" />
                <h6 className="color-dark fw-bold ms-4 mb-0">
                  Cetak Kartu Pelajar
                </h6>
              </div>
              {/* )}
                    </Pdf> */}
            </div>
          </div>

          {/* formulir peserta */}
        </div>
      </div>
    </>
  );
};

export default SectionKartuPelajar;
