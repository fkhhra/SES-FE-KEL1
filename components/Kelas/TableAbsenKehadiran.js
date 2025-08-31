import { momentPackage } from "utilities/HelperUtils";
import ctl from "@netlify/classnames-template-literals";
import startCase from "lodash/startCase";
import { FaFile } from "react-icons/fa";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";
import Link from "next/link";
import { showModal } from "utilities/ModalUtils";
import ModalKeteranganAbsenHarian from "./ModalKeteranganAbsenHarian";
import useAbsenSiswa from "hooks/useAbsenSiswa";
import Skeleton from "react-loading-skeleton";

const TableAbsenKehadiran = ({ tableData, isLoading, isSiswa }) => {
  return (
    <div className="table-responsive">
      <table className="table-ss" data-joyride="table-kehadiran">
        <thead>
          <tr>
            <th
              style={{ width: "5%" }}
              rowSpan="2"
              className="border border-white border-3 border-start-0 border-top-0 border-end-0"
            >
              No
            </th>
            <th
              style={{ width: "35%" }}
              rowSpan="2"
              className="border border-white border-3 border-start-0 border-top-0 border-end-0"
            >
              Nama
            </th>
            <th
              style={{ width: "25%", height: "40px" }}
              colSpan="2"
              className="text-center border border-white border-3 border-start-0 border-top-0 border-end-0"
            >
              Absen Masuk
            </th>
            <th
              style={{ width: "25%", height: "40px" }}
              colSpan="2"
              className="text-center border border-white border-3 border-start-0 border-top-0 border-end-0"
            >
              Absen Pulang
            </th>
            <th
              style={{ width: "10%", height: "40px" }}
              rowSpan="2"
              className="text-center border border-white border-3 border-start-0 border-top-0 border-end-0"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [1, 2, 3, 4, 5].map((_, index) => (
              <tr key={`loading-row-${index}`}>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
              </tr>
            ))
          ) : tableData?.length > 0 ? (
            tableData?.map((data) => (
              <RowTemplate
                status={data?.status}
                data={data}
                key={data?.id}
                isSiswa={isSiswa}
              />
            ))
          ) : (
            <tr>
              <td colSpan="7">
                <div className="text-center">
                  <img src="/img/empty-state-data.svg" alt="" width="200" />
                  <h6 className="color-dark fw-bold mt-3">Tidak ada data</h6>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalKeteranganAbsenHarian />
    </div>
  );
};

const RowTemplate = ({ status, data, isSiswa }) => {
  const { setAbsenSiswa } = useAbsenSiswa();

  const getStatusCN = () => {
    return ctl(`
      label-ss
      rounded-pill
      fs-12-ss fw-bold
      ${status == "hadir" && "bg-light-primary color-primary"}
      ${status == "izin" && "bg-soft-success color-success"}
      ${status == "sakit" && "bg-soft-warning color-warning"}
      ${status == "alpa" && "bg-soft-danger color-danger"}
    `);
  };

  const showModalAbsenHarian = () => {
    setAbsenSiswa(data);
    showModal("modalKeteranganAbsen");
  };

  if (status == "hadir") {
    return (
      <>
        <tr>
          <td rowSpan={data?.status == "hadir" ? "2" : "1"} data-th="No">
            {data?.no}
          </td>
          <td rowSpan={data?.status == "hadir" ? "2" : "1"} data-th="Nama">
            {data?.nama}
            <div className="text-secondary">
              {isSiswa && (data?.rombel || "-")}
            </div>
          </td>

          <td
            rowSpan={data?.status == "hadir" ? "2" : "1"}
            className="text-md-center d-md-none d-block"
          >
            <span
              className={getStatusCN(data?.status)}
              style={{ whiteSpace: "nowrap" }}
            >
              {startCase(data?.status)}
            </span>
          </td>
          <td
            data-th="Absen Masuk"
            className="text-md-center py-2 d-md-none d-table-cell"
          >
            {data?.status == "hadir" ? (
              <div className="mx-auto">
                <p className="color-dark fw-semibold mb-0 mt-1">
                  {momentPackage(data?.waktuMasuk).format("HH:mm:ss")}
                </p>
              </div>
            ) : (
              "-- : -- : --"
            )}
          </td>
          <td className="text-md-center py-2">
            {data?.status == "hadir" ? (
              <div className="mx-md-auto d-flex d-md-block align-items-center">
                <Link
                  href={data?.fotoMasuk || ""}
                >
                  <a
                    style={{
                      pointerEvents: !data?.fotoMasuk ? "none" : "auto",
                    }}
                    target={data?.fotoMasuk ? "_blank" : undefined}
                    rel={data?.fotoMasuk ? "noopener noreferrer" : undefined}
                  >
                    <img
                      src={data?.fotoMasuk || "/img/empty-state-profile-picture.svg"}
                      className="img-fit-cover me-md-0 me-4"
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                      alt="Foto Masuk"
                    />
                  </a>
                </Link>
                <a
                  className="btn btn-light btn-light-ss bg-white rounded-circle py-2 text-decoration-none shadow-dark-ss hover-shadow-none d-flex align-items-center justify-content-center d-md-none"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  href={`https://www.google.com/maps/search/?api=1&query=${data?.lokasiMasuk?.latitude},${data?.lokasiMasuk?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/icon-google-maps.svg" alt="" />
                </a>
              </div>
            ) : (
              "-"
            )}
          </td>
          <td data-th="Lokasi" className="d-md-table-cell d-none py-2">
            <div className="text-md-center">
              {data?.lokasiMasuk ? (
                <a
                  className="btn btn-light btn-light-ss bg-white rounded-circle py-2 text-decoration-none shadow-dark-ss hover-shadow-none d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  href={`https://www.google.com/maps/search/?api=1&query=${data?.lokasiMasuk?.latitude},${data?.lokasiMasuk?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/icon-google-maps.svg" alt="" />
                </a>
              ) : (
                "-"
              )}
            </div>
          </td>
          <td
            colSpan="2"
            data-th="Absen Pulang"
            className="text-md-center py-2 d-md-none d-table-cell"
          >
            {data?.sudahAbsenPulang ? (
              <div>
                <p className="color-dark fw-semibold mb-0 mt-1">
                  {momentPackage(data?.waktuPulang).format("HH:mm:ss")}
                </p>
              </div>
            ) : (
              "-- : -- : --"
            )}
          </td>
          <td className="text-md-center py-2">
            {data?.sudahAbsenPulang ? (
              <div className="mx-md-auto d-flex d-md-block align-items-center">
                <Link
                  href={data?.fotoPulang || ""}
                >
                  <a
                    style={{
                      pointerEvents: !data?.fotoPulang ? "none" : "auto",
                    }}
                    target={data?.fotoPulang ? "_blank" : undefined}
                    rel={data?.fotoPulang ? "noopener noreferrer" : undefined}
                  >
                    <img
                      src={data?.fotoPulang || "/img/empty-state-profile-picture.svg"}
                      className="img-fit-cover me-md-0 me-4"
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                      alt="Foto Pulang"
                    />
                  </a>
                </Link>
                <a
                  className="btn btn-light btn-light-ss bg-white rounded-circle py-2 text-decoration-none shadow-dark-ss hover-shadow-none d-flex align-items-center justify-content-center d-md-none"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  href={`https://www.google.com/maps/search/?api=1&query=${data?.lokasiPulang?.latitude},${data?.lokasiPulang?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/icon-google-maps.svg" alt="" />
                </a>
              </div>
            ) : (
              "-"
            )}
          </td>
          <td data-th="Lokasi" className="d-md-table-cell d-none py-2">
            <div className="text-md-center">
              {data?.lokasiPulang ? (
                <a
                  className="btn btn-light btn-light-ss bg-white rounded-circle py-2 text-decoration-none shadow-dark-ss hover-shadow-none d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  href={`https://www.google.com/maps/search/?api=1&query=${data?.lokasiPulang?.latitude},${data?.lokasiPulang?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/img/icon-google-maps.svg" alt="" />
                </a>
              ) : (
                "-"
              )}
            </div>
          </td>
          <td
            rowSpan={data?.status == "hadir" ? "2" : "1"}
            className="text-md-center d-none d-md-table-cell"
          >
            <span
              className={getStatusCN(data?.status)}
              style={{ whiteSpace: "nowrap" }}
            >
              {startCase(data?.status)}
            </span>
          </td>
        </tr>
        {data?.status == "hadir" && (
          <tr className="d-md-table-row d-none">
            <td colSpan="2" data-th="Waktu" className="text-md-center py-2">
              {data?.status == "hadir" ? (
                <div className="mx-auto">
                  <p className="color-dark fw-semibold mb-0 mt-1">
                    {momentPackage(data?.waktuMasuk).format("HH:mm:ss")}
                  </p>
                </div>
              ) : (
                "-- : -- : --"
              )}
            </td>
            <td colSpan="2" data-th="Waktu" className="text-md-center py-2">
              {data?.sudahAbsenPulang ? (
                <div>
                  <p className="color-dark fw-semibold mb-0 mt-1">
                    {momentPackage(data?.waktuPulang).format("HH:mm:ss")}
                  </p>
                </div>
              ) : (
                "-- : -- : --"
              )}
            </td>
          </tr>
        )}
      </>
    );
  } else if (status == "izin" || status == "sakit") {
    return (
      <tr>
        <td data-th="No">{data?.no}</td>
        <td data-th="Nama">
          {data?.nama}{" "}
          <div className="text-secondary">
            {isSiswa && (data?.rombel || "-")}
          </div>
        </td>
        <td className="text-md-center d-block d-md-none">
          <span className={getStatusCN()} style={{ whiteSpace: "nowrap" }}>
            {startCase(data?.status)}
          </span>
        </td>
        <td data-th="Keterangan" colSpan={2} className="text-md-center py-2">
          <a
            className="btn btn-light btn-light-ss bg-white rounded-circle py-2 text-decoration-none shadow-dark-ss hover-shadow-none d-flex align-items-center justify-content-center mx-md-auto"
            style={{
              width: "50px",
              height: "50px",
            }}
            onClick={() => showModalAbsenHarian()}
          >
            <FaFile className="color-secondary fs-5" />
          </a>
        </td>
        <td
          data-th="Keterangan"
          colSpan={2}
          className="d-md-table-cell d-none text-md-center py-2"
        >
          <a
            className="btn btn-light btn-light-ss bg-white rounded-circle py-2 text-decoration-none shadow-dark-ss hover-shadow-none d-flex align-items-center justify-content-center mx-md-auto"
            style={{
              width: "50px",
              height: "50px",
            }}
            onClick={() => showModalAbsenHarian()}
          >
            <FaFile className="color-secondary fs-5" />
          </a>
        </td>
        <td className="text-md-center d-md-table-cell d-none">
          <span className={getStatusCN()} style={{ whiteSpace: "nowrap" }}>
            {startCase(data?.status)}
          </span>
        </td>
      </tr>
    );
  } else if (status == "alpa") {
    return (
      <tr>
        <td data-th="No">{data?.no}</td>
        <td data-th="Nama">
          {data?.nama}{" "}
          <div className="text-secondary">
            {isSiswa && (data?.rombel || "-")}
          </div>
        </td>
        <td className="text-md-center d-block d-md-none">
          <span
            className={getStatusCN(data?.status)}
            style={{ whiteSpace: "nowrap" }}
          >
            {startCase(data?.status)}
          </span>
        </td>
        <td data-th="Hubungi" colSpan={2} className="text-md-center py-2">
          <div className="d-flex justify-content-md-center">
            {" "}
            <WhatsappLink
              phoneNumber={data?.whatsapp ? data?.whatsapp : ""}
              text={`Halo nak ${data?.nama}`}
            >
              <div
                className="rounded-circle shadow-success-ss"
                style={{ width: "50px", height: "50px" }}
              >
                <img src={`/img/whatsapp.svg`} width={50} height={50} />
              </div>
            </WhatsappLink>
          </div>
        </td>
        <td
          data-th="Hubungi"
          colSpan={2}
          className="d-md-table-cell d-none text-md-center py-2"
        >
          <div className="d-flex justify-content-md-center">
            {" "}
            <WhatsappLink
              phoneNumber={data?.whatsapp ? data?.whatsapp : ""}
              text={`Halo nak ${data?.nama}`}
            >
              <div
                className="rounded-circle shadow-success-ss"
                style={{ width: "50px", height: "50px" }}
              >
                <img src={`/img/whatsapp.svg`} width={50} height={50} />
              </div>
            </WhatsappLink>
          </div>
        </td>
        <td className="text-md-center d-md-table-cell d-none">
          <span
            className={getStatusCN(data?.status)}
            style={{ whiteSpace: "nowrap" }}
          >
            {startCase(data?.status)}
          </span>
        </td>
      </tr>
    );
  } else {
    return null;
  }
};

export default TableAbsenKehadiran;
