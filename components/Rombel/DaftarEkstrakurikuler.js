import Link from "next/link";
import React, { useState } from "react";
import { FaClone, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { ssURL } from "../../client/clientAxios";
import useUser from "../../hooks/useUser";
import ModalKeteranganEkstrakurikuler from "./ModalKeteranganEkstrakurikuler";
import { postRaporEkskul, editRaporEkskul } from "../../client/RaporClient";
import { hideModal } from "../../utilities/ModalUtils";
import toast from "react-hot-toast";

const DaftarEkstrakurikuler = ({
  keterangan,
  getDetailRombelData,
  kelasRombel,
  rombel_id,
}) => {
  // const { user } = useUser();
  const initialStateForm = {
    id: "",
    keterangan: "",
    ekskul_id: "",
    btnBio: "idle",
  };
  const [formData, setFormData] = useState({
    ...initialStateForm,
  });

  const _postRaporEkskul = async () => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = formData.active
      ? await editRaporEkskul(
          {
            keterangan: formData.keterangan,
          },
          formData.ekskul_id,
          formData.id
        )
      : await postRaporEkskul(
          {
            keterangan: formData.keterangan,
          },
          formData.ekskul_id,
          formData.id
        );

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      getDetailRombelData();
      hideModal("modalKeteranganEkstrakurikuler");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onClickEdit = (data) => {
    if (data) {
      if (
        !data?.user?.raporEkskul.filter(
          (d) => d?.mEkstrakurikulerId == data?.id
        ).length
      ) {
        setFormData({
          id: data?.user?.id,
          keterangan: "",
          ekskul_id: data?.id,
        });
      } else {
        setFormData({
          id: data?.user?.id,
          keterangan: data?.user?.raporEkskul.find(
            (d) => d?.mEkstrakurikulerId == data?.id
          )?.keterangan,
          ekskul_id: data?.id,
          active: "active",
        });
      }
    }
  };

  return (
    <>
      <div className="card card-ss">
        <div className="card-header p-4 card-header-ss">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
              Daftar Ekstrakurikuler Siswa
            </h4>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Ekstrakurikuler</th>
                  <th className="text-md-center" text-start>
                    Status
                  </th>
                  <th className="text-md-center" text-start>
                    Keterangan
                  </th>
                </tr>
              </thead>
              {keterangan
                ?.sort((a, b) =>
                  ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                )
                ?.map((d, idx) => {
                  return (
                    <tbody>
                      <tr>
                        <td data-th="No" rowSpan={2}>
                          {idx + 1}
                        </td>
                        <td data-th="Nama" rowSpan={2}>
                          <span className="fw-semibold">{d?.user?.nama}</span>
                        </td>
                        <td data-th="Catatan">
                          <span className="color-dark text-md-center text-start fw-semibold">
                            {d?.user?.anggotaEkskul[0]
                              ? d?.user?.anggotaEkskul[0]?.ekskul?.nama
                              : "-"}
                          </span>
                        </td>
                        <td
                          data-th="Kelulusan"
                          className="text-md-center"
                          text-start
                        >
                          {!d?.user?.raporEkskul.filter(
                            (x) =>
                              x?.mEkstrakurikulerId ==
                              d?.user?.anggotaEkskul[0]?.ekskul?.id
                          ).length ? (
                            <span className="label-ss rounded-pill bg-soft-danger color-danger fs-12-ss fw-semibold text-capitalize">
                              Belum Diberikan
                            </span>
                          ) : (
                            <span className="label-ss rounded-pill bg-soft-success color-success fs-12-ss fw-semibold text-capitalize">
                              Sudah Diberikan
                            </span>
                          )}
                        </td>
                        <td
                          data-th="Kelulusan"
                          className="text-md-center"
                          text-start
                        >
                          {d?.user?.anggotaEkskul[0]?.ekskul?.nama && (
                            <a
                              className="bg-primary rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss shadow-primary-ss hover-shadow-none"
                              data-bs-toggle="modal"
                              data-bs-target="#modalKeteranganEkstrakurikuler"
                              onClick={() =>
                                onClickEdit({
                                  ...d,
                                  id: d?.user?.anggotaEkskul[0]
                                    ?.mEkstrakurikulerId,
                                })
                              }
                            >
                              Detail
                            </a>
                          )}
                        </td>
                      </tr>
                      {d?.user?.anggotaEkskul?.length > 1 ? (
                        <>
                          {d?.user?.anggotaEkskul
                            ?.slice(1, d?.user?.anggotaEkskul?.length)
                            ?.map((e) => {
                              return (
                                <tr>
                                  <td data-th="Catatan">
                                    <span className="color-dark text-md-center text-start fw-semibold">
                                      {e?.ekskul?.nama}
                                    </span>
                                  </td>
                                  <td
                                    data-th="Kelulusan"
                                    className="text-md-center"
                                    text-start
                                  >
                                    {!d?.user?.raporEkskul.filter(
                                      (x) =>
                                        x?.mEkstrakurikulerId == e?.ekskul?.id
                                    ).length ? (
                                      <span className="label-ss rounded-pill bg-soft-danger color-danger fs-12-ss fw-semibold text-capitalize">
                                        Belum Diberikan
                                      </span>
                                    ) : (
                                      <span className="label-ss rounded-pill bg-soft-success color-success fs-12-ss fw-semibold text-capitalize">
                                        Sudah Diberikan
                                      </span>
                                    )}
                                  </td>
                                  <td
                                    data-th="Kelulusan"
                                    className="text-md-center"
                                    text-start
                                  >
                                    <a
                                      className="bg-primary rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss shadow-primary-ss hover-shadow-none"
                                      data-bs-toggle="modal"
                                      data-bs-target="#modalKeteranganEkstrakurikuler"
                                      onClick={() =>
                                        onClickEdit({
                                          ...d,
                                          id: e?.ekskul?.id,
                                        })
                                      }
                                    >
                                      Detail
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      ) : null}
                    </tbody>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
      <ModalKeteranganEkstrakurikuler
        handleChangeForm={handleChangeForm}
        formData={formData}
        _postRaporEkskul={_postRaporEkskul}
      />
    </>
  );
};

export default DaftarEkstrakurikuler;
