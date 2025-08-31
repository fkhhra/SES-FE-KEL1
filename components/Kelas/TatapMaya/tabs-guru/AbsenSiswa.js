import { editTimeline } from "client/TimelineClient";
import ModalKeteranganAbsen from "components/Kelas/ModalKeteranganAbsen";
import Avatar from "components/Shared/Avatar/Avatar";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";
import useAbsenSiswa from "hooks/useAbsenSiswa";
import React from "react";
import toast from "react-hot-toast";
import { FaPen } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";

const AbsenSiswa = ({ detailData, setDetailData, _getDetailTimeline }) => {
  const { setAbsenSiswa } = useAbsenSiswa();

  const onChangeSearch = (value) => {
    if (value === "") {
      _getDetailTimeline(null, false);
      return;
    }

    const copyTkTimeline = [...detailData?.tkTimeline];
    const newTkTimeline = copyTkTimeline?.filter(
      (timeline) =>
        timeline?.user?.nama?.toLowerCase()?.indexOf(value?.toLowerCase()) >= 0
    );
    setDetailData({
      ...detailData,
      tkTimeline: [...newTkTimeline],
    });
  };

  const handleAbsensi = async (absen = null, targetSiswaObj = null) => {
    const payload = {
      tipe: "absen",
      absen: absen,
      keterangan: "",
      waktuAbsen: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      lampiran: [],
      ...(targetSiswaObj && { ...targetSiswaObj }),
    };

    const { isSuccess } = await editTimeline(detailData?.id, payload);
    if (isSuccess) {
      _getDetailTimeline(null, false);
      toast.success("Berhasil mengubah data");
      return;
    }

    toast.error("Gagal mengubah data");
  };

  const handleClickPilihanAbsen = (type, d) => {
    const targetSiswaObj = {
      siswaId: d?.user?.id,
      tkId: d.id,
    };
    handleAbsensi(type, targetSiswaObj);
  };

  const getStatusAbsensi = (absen, d) => {
    const izin = absen === "izin";
    const alpha = !absen;
    const hadir = absen === "hadir";
    const sakit = absen === "sakit";

    if (izin) {
      return (
        <>
          <div className="label-ss bg-soft-success color-success rounded-pill d-flex justify-content-center align-items-center me-3">
            Izin
          </div>
          <button
            className="btn btn-ss btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#keteranganAbsen"
            onClick={() => setAbsenSiswa(d)}
          >
            Keterangan
          </button>
        </>
      );
    } else if (alpha) {
      return (
        <>
          <div className="label-ss bg-soft-danger color-danger rounded-pill d-flex justify-content-center align-items-center me-3">
            Alpa
          </div>
          <WhatsappLink
            phoneNumber={d.user?.whatsapp}
            text={`Halo nak ${d.user?.nama}`}
          >
            <button className="btn btn-ss btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center">
              Hubungi Siswa
            </button>
          </WhatsappLink>
        </>
      );
    } else if (hadir) {
      return (
        <>
          <div
            className={`label-ss bg-${
              detailData.tanggalAkhir
                ? momentPackage(d.updatedAt).utcOffset(7) <
                  momentPackage(detailData.tanggalAkhir).utcOffset(7)
                  ? "light-primary color-primary"
                  : "warning text-white"
                : "light-primary color-primary"
            }  rounded-pill d-flex justify-content-center align-items-center me-3`}
          >
            {detailData.tanggalAkhir
              ? momentPackage(d.updatedAt).utcOffset(7) <
                momentPackage(detailData.tanggalAkhir).utcOffset(7)
                ? "Hadir"
                : "Telat"
              : "Hadir"}
          </div>
          <div
            className="bg-very-soft-secondary color-secondary d-flex justify-content-center py-1 px-2 rounded-pill"
            style={{ minWidth: "160px" }}
          >
            {d.waktuAbsen}
          </div>
        </>
      );
    } else if (sakit) {
      return (
        <>
          <div className="label-ss bg-soft-warning color-warning rounded-pill d-flex justify-content-center align-items-center me-3">
            Sakit
          </div>
          <button
            className="btn btn-ss btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#keteranganAbsen"
            onClick={() => setAbsenSiswa(d)}
          >
            Keterangan
          </button>
        </>
      );
    }
  };

  return (
    <>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between flex-column flex-md-row align-items-center mb-4">
            <h4 className="color-dark fw-bold m-0 mb-md-0 mb-3">
              Daftar Absen Siswa
            </h4>
            <input
              type="text"
              className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss px-3"
              id="exampleFormControlInput1"
              placeholder="Cari Nama Siswa"
              onChange={(e) => onChangeSearch(e.target.value)}
            />
          </div>
          <ul className="list-absen-kelas list-group list-group-flush">
            {detailData?.tkTimeline?.map((d, idx) => (
              <li
                className="list-group-item"
                key={`${idx}-${new Date().getTime()}`}
              >
                <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column">
                  <div className="list-group-member d-flex align-items-center mb-3 mb-md-0">
                    <Avatar
                      name={d?.user?.nama}
                      src={d?.user?.avatar}
                      size={45}
                    />
                    <p className="m-0 ms-4 fw-semibold color-secondary">
                      {d?.user?.nama}
                    </p>
                  </div>
                  <div className="list-group-info d-flex justify-content-end justify-content-md-start align-items-center">
                    {getStatusAbsensi(d?.absen, d)}

                    <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end order-md-2 order-1 ms-3">
                      <div
                        role="button"
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <button
                          type="button"
                          className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 mb-lg-0 mb-md-3 mb-0"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      </div>
                      <ul
                        className="dropdown-menu dropdown-menu-ss my-1"
                        aria-labelledby="dropdownMenuLink"
                      >
                        <li onClick={() => handleClickPilihanAbsen("hadir", d)}>
                          <a className="dropdown-item">
                            <span>Hadir</span>
                          </a>
                        </li>
                        <li onClick={() => handleClickPilihanAbsen("izin", d)}>
                          <a className="dropdown-item">
                            <span>Izin</span>
                          </a>
                        </li>
                        <li onClick={() => handleClickPilihanAbsen("sakit", d)}>
                          <a className="dropdown-item">
                            <span>Sakit</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ModalKeteranganAbsen />
    </>
  );
};

export default AbsenSiswa;
