import { deleteSoalUjian } from "client/SoalUjianClient";
import useUjian from "hooks/useUjian";
import React from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ListSoal } from "./ListSoal";

export const DetailContentUjian = ({
  setFormData,
  initialFormData,
  getDetailUjianData,
  handleClickEditSoalUjian,
  nav,
}) => {
  const { detailUjianData } = useUjian();
  const { bentukSoal, ujian } = detailUjianData;

  const handleDeleteSoalUjianData = (soal_id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteSoalUjian(soal_id, {
          m_ujian_id: ujian?.id,
        });
        if (data) {
          toast.success(data?.message);
          getDetailUjianData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };
  return (
    <div className="col-md-12">
      <div className="card card-ss">
        <div className="card-header-ss px-4 py-3">
          <h4 className="color-dark fw-extrabold mb-0">
            Soal{" "}
            {
              bentukSoal?.filter(
                (bentuk) => bentuk.value === (nav || "pg")
              )?.[0]?.label
            }
          </h4>
        </div>
        <div className="card-body pt-0">
          {ujian?.soalUjian?.filter(
            (soal) => soal?.soal?.bentuk.trim().toLowerCase() === (nav || "pg")
          )?.length === 0 && (
            <>
              <div className="row justify-content-center">
                <div className="col-sm-3 col-8">
                  <img
                    src="/img/empty-state-daftar-soal.png"
                    alt="empty-state"
                    className="img-fluid mb-2"
                  />
                </div>
                <div className="col-12 text-center">
                  <h5 className="color-dark fw-black">
                    Belum Ada Soal Yang Dibuat
                  </h5>
                  <p className="fw-bold fs-14-ss">
                    Tekan tombol{" "}
                    <a
                      className="text-decoration-none color-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modalBuatSoalUjian"
                      onClick={() => setFormData(initialFormData)}
                    >
                      {" "}
                      Buat Soal
                    </a>{" "}
                    untuk membuat soal
                  </p>
                </div>
              </div>
            </>
          )}
          {ujian?.soalUjian
            ?.filter(
              (soal) =>
                soal?.soal?.bentuk.trim().toLowerCase() === (nav || "pg")
            )
            ?.map((detailSoal, idx) => (
              <ListSoal
                soal={detailSoal?.soal}
                handleDeleteSoalUjianData={handleDeleteSoalUjianData}
                handleClickEditSoalUjian={handleClickEditSoalUjian}
                nomor={idx + 1}
                key={`${idx}-${new Date().getTime()}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
