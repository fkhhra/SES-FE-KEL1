import { Button, InputNumber } from "antd";
import { editBobot, getPredikat } from "client/BukuIndukClient";
import useSekolah from "hooks/useSekolah";
import useTa from "hooks/useTa";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaPen } from "react-icons/fa";

const TabelBobotNilai = ({ ssURL, subnav }) => {
  const [showInput, setShowInput] = useState(null);

  const instrumenPenilaian = [
    { instrumen: "Rata Rata Tugas", type: "pengetahuan", jenis: "tugas" },
    {
      instrumen: "Rata Rata Penilaian Harian",
      type: "pengetahuan",
      jenis: "uh",
    },
    {
      instrumen: "Penilaian Tengah Semester / Sumatif Tengah Semester",
      type: "pengetahuan",
      jenis: "uts",
    },
    {
      instrumen: "Penilaian Akhir Semester / Sumatif Akhir Semester",
      type: "pengetahuan",
      jenis: "uas",
      isHide: true,
    },
    {
      instrumen: "Praktik",
      type: "keterampilan",
      uts: "praktikPts",
      uas: "praktikPas",
    },
    {
      instrumen: "Produk",
      type: "keterampilan",
      uts: "produkPts",
      uas: "produkPas",
    },
    {
      instrumen: "Proyek",
      type: "keterampilan",
      uts: "proyekPts",
      uas: "proyekPas",
    },
    {
      instrumen: "Portofolio",
      type: "keterampilan",
      uts: "portofolioPts",
      uas: "portofolioPas",
    },
  ];
  const [bobotNilai, setBobotNilai] = useState({});
  const [loading, setLoading] = useState(false);
  const { ta } = useTa();

  const _getBukuInduk = async () => {
    setLoading(true);
    const { data } = await getPredikat({ taId: ta?.id });
    if (data) {
      setBobotNilai(data?.bobot);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getBukuInduk();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());

    const { data, error } = await editBobot(formData, bobotNilai?.id);
    if (data) {
      toast.success("Berhasil");
      setShowInput(null);
      _getBukuInduk();
    }
    if (error) {
      toast.error(error.message);
      setShowInput(null);
      _getBukuInduk();
    }
  };
  console.log(bobotNilai);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-ss px-0 pt-4 pb-5">
          <form onSubmit={handleSubmit}>
            <h4 className="fw-extrabold color-dark mb-4 mx-4">
              Nilai Pengetahuan
            </h4>
            <div className="table-responsive mb-4">
              <table className="table-ss table-bobot-nilai">
                <thead>
                  <tr>
                    <th
                      rowSpan="2"
                      className="border border-white border-3 border-start-0 border-top-0"
                    >
                      Instrumen Penilaian
                    </th>
                    <th
                      className="text-md-center text-start py-1 border border-white border-3 border-start-0 border-end-0 border-top-0"
                      colSpan="2"
                    >
                      Bobot Rapor
                    </th>
                    <th className="border border-white border-3 border-start-0 border-end-0 border-top-0"></th>
                  </tr>
                  <tr>
                    <th className="text-md-center text-start py-1 border border-white border-3 border-start-0 border-start-0">
                      <h6 className="fs-14-ss mb-0">Tengah Semester</h6>
                    </th>
                    <th className="text-md-center text-start py-1 border border-white border-3 border-end-0 border-start-0">
                      <h6 className="fs-14-ss mb-0">Akhir Semester</h6>
                    </th>
                    <th className="border border-white border-3 border-start-0 border-end-0 border-top-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* {instrumenPenilaian
                  ?.filter((d) => d.type == "pengetahuan")
                  .map((d, idx) => {
                    return (
                      <tr>
                        <td className="td-judul" data-th={d.instrumen}>
                          <h6 className="fw-semibold color-dark mb-0">
                            {d.instrumen}
                          </h6>
                        </td>
                        <td
                          data-th="Tengah Semester"
                          className="d-md-none d-block"
                          style={{ background: "#F4F4F7" }}
                        >
                          <div style={{ opacity: "0" }}>a</div>
                        </td>
                        <td
                          data-th="Nilai"
                          className="text-md-center text-start"
                        >
                          {d?.isHide ? (
                            "-"
                          ) : (
                            <InputNumber
                              className="form-control text-center mx-md-auto"
                              min={0}
                              max={100}
                              defaultValue={bobotNilai?.tugasPts}
                              // onChange={(value) => setFormNilai(value)}
                              disabled={showInput != d.instrumen}
                              style={{ width: "72px" }}

                              // onKeyPress={(e) => {
                              //   e.key === "Enter"
                              //     ? _editRekapNilai(e.target.value, d)
                              //     : "";
                              // }}
                            />
                          )}
                        </td>
                        <td
                          data-th="Akhir Semester"
                          className="d-md-none d-block"
                          style={{ background: "#F4F4F7" }}
                        >
                          <div style={{ opacity: "0" }}>a</div>
                        </td>
                        <td
                          data-th="Nilai"
                          className="text-md-center text-start"
                        >
                          <InputNumber
                            className="form-control text-center mx-md-auto"
                            min={0}
                            max={100}
                            defaultValue={bobotNilai?.tugasPas}
                            value={bobotNilai?.tugasPas}
                            // onChange={(value) => setFormNilai(value)}
                            disabled={showInput != d.instrumen}
                            style={{ width: "72px" }}
                            // onKeyPress={(e) => {
                            //   e.key === "Enter"
                            //     ? _editRekapNilai(e.target.value, d)
                            //     : "";
                            // }}
                          />
                        </td>
                        <td>
                          {showInput == d.instrumen ? (
                            <button
                              type="button"
                              className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              onClick={() => {
                                setShowInput(null);
                              }}
                            >
                              <FaCheck className="color-white" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              onClick={() => {
                                setShowInput(d.instrumen);
                              }}
                            >
                              <FaPen className="color-secondary" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })} */}
                  {/* Tugas */}
                  <tr>
                    <td className="td-judul" data-th="Rata Rata Tugas">
                      <h6 className="fw-semibold color-dark mb-0">
                        Rata Rata Tugas
                      </h6>
                    </td>
                    <td
                      data-th="Tengah Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.tugasPts}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Rata Rata Tugas"}
                        style={{ width: "72px" }}
                        name="tugasPts"
                        onChange={(value) =>
                          setBobotNilai({
                            ...bobotNilai,
                            tugasPts: value?.target?.value,
                          })
                        }
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td
                      data-th="Akhir Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.tugasPas}
                        onChange={(value) =>
                          setBobotNilai({
                            ...bobotNilai,
                            tugasPas: value?.target?.value,
                          })
                        }
                        disabled={showInput != "Rata Rata Tugas"}
                        style={{ width: "72px" }}
                        name="tugasPas"
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput == "Rata Rata Tugas" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          htmlType="submit"
                          // onClick={() => {
                          //   setShowInput(null);
                          // }}
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput("Rata Rata Tugas");
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr>
                  {/* UH */}
                  <tr>
                    <td
                      className="td-judul"
                      data-th={"Rata Rata Penilaian Harian"}
                    >
                      <h6 className="fw-semibold color-dark mb-0">
                        {"Rata Rata Penilaian Harian"}
                      </h6>
                    </td>
                    <td
                      data-th="Tengah Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.uhPts}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Rata Rata Penilaian Harian"}
                        style={{ width: "72px" }}
                        name="uhPts"
                        onChange={(value) =>
                          setBobotNilai({
                            ...bobotNilai,
                            uhPts: value?.target?.value,
                          })
                        }
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td
                      data-th="Akhir Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.uhPas}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Rata Rata Penilaian Harian"}
                        style={{ width: "72px" }}
                        name="uhPas"
                        onChange={(value) =>
                          setBobotNilai({
                            ...bobotNilai,
                            uhPas: value?.target?.value,
                          })
                        }
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput == "Rata Rata Penilaian Harian" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          // onClick={() => {
                          //   setShowInput(null);
                          //   // handleSubmit;
                          // }}
                          htmlType="submit"
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput("Rata Rata Penilaian Harian");
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr>
                  {/* UTS */}
                  <tr>
                    <td
                      className="td-judul"
                      data-th={
                        "Penilaian Tengah Semester / Sumatif Tengah Semester"
                      }
                    >
                      <h6 className="fw-semibold color-dark mb-0">
                        {"Penilaian Tengah Semester / Sumatif Tengah Semester"}
                      </h6>
                    </td>
                    <td
                      data-th="Tengah Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.utsPts}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={
                          showInput !=
                          "Penilaian Tengah Semester / Sumatif Tengah Semester"
                        }
                        style={{ width: "72px" }}
                        name="utsPts"
                        onChange={(value) =>
                          setBobotNilai({
                            ...bobotNilai,
                            utsPts: value?.target?.value,
                          })
                        }
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td
                      data-th="Akhir Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.utsPas}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={
                          showInput !=
                          "Penilaian Tengah Semester / Sumatif Tengah Semester"
                        }
                        style={{ width: "72px" }}
                        name="utsPas"
                        onChange={(value) =>
                          setBobotNilai({
                            ...bobotNilai,
                            utsPas: value?.target?.value,
                          })
                        }
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput ==
                      "Penilaian Tengah Semester / Sumatif Tengah Semester" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          // onClick={() => {
                          //   setShowInput(null);
                          // }}
                          htmlType="submit"
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput(
                              "Penilaian Tengah Semester / Sumatif Tengah Semester"
                            );
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr>
                  {/* UAS */}
                  <tr>
                    <td
                      className="td-judul"
                      data-th={
                        "Penilaian Akhir Semester / Sumatif Akhir Semester"
                      }
                    >
                      <h6 className="fw-semibold color-dark mb-0">
                        {"Penilaian Akhir Semester / Sumatif Akhir Semester"}
                      </h6>
                    </td>
                    <td
                      data-th="Tengah Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      -
                    </td>
                    <td
                      data-th="Akhir Semester"
                      className="d-md-none d-block"
                      style={{ background: "#F4F4F7" }}
                    >
                      <div style={{ opacity: "0" }}>a</div>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.uasPas}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Penilaian Akhir Semester"}
                        style={{ width: "72px" }}
                        name="uasPas"
                        onChange={(value) =>
                          setBobotNilai({
                            ...bobotNilai,
                            uasPas: value?.target?.value,
                          })
                        }
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput == "Penilaian Akhir Semester" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          // onClick={() => {
                          //   setShowInput(null);
                          // }}
                          htmlType="submit"
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput("Penilaian Akhir Semester");
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr style={{ background: "#F6FAFF" }}>
                    <td className="d-md-block d-none">
                      <h6 className="fw-bold color-primary">Jumlah</h6>
                    </td>
                    <td
                      className="d-block d-md-none position-relative td-judul-jumlah border border-3 border-white border-start-0 border-top-0 border-end-0"
                      data-th="Jumlah"
                    >
                      <h6
                        className="fw-bold color-primary"
                        style={{ opacity: "0" }}
                      >
                        a
                      </h6>
                    </td>
                    <td
                      className="text-md-center text-start td-jumlah-bobot position-relative border border-white border-start-0 border-top-0 border-end-0 border-3"
                      data-th="Tengah Semester"
                    >
                      <h6 className="fw-bold color-primary mb-0">
                        {bobotNilai.tugasPts +
                          bobotNilai.uhPts +
                          bobotNilai.utsPts}
                        %
                      </h6>
                    </td>
                    <td
                      className="text-md-center text-start td-jumlah-bobot position-relative"
                      data-th="Akhir Semester"
                    >
                      <h6 className="fw-bold color-primary mb-0">
                        {" "}
                        {bobotNilai.tugasPas +
                          bobotNilai.uhPas +
                          bobotNilai.utsPas +
                          bobotNilai.uasPas}
                        %
                      </h6>
                    </td>
                    <td className="d-md-block d-none"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h4 className="fw-extrabold color-dark mb-4 mx-4">
              Nilai Keterampilan
            </h4>
            <div className="table-responsive">
              <table className="table-ss table-bobot-nilai">
                <thead>
                  <tr>
                    <th
                      rowSpan="2"
                      className="border border-white border-3 border-start-0 border-top-0"
                    >
                      Instrumen Penilaian
                    </th>
                    <th
                      className="text-md-center text-start py-1 border border-white border-3 border-start-0 border-end-0 border-top-0"
                      colSpan="2"
                    >
                      Bobot Rapor
                    </th>
                    <th className="border border-white border-3 border-start-0 border-end-0 border-top-0"></th>
                  </tr>
                  <tr>
                    <th className="text-md-center text-start py-1 border border-white border-3 border-start-0 border-start-0">
                      <h6 className="fs-14-ss mb-0">Tengah Semester</h6>
                    </th>
                    <th className="text-md-center text-start py-1 border border-white border-3 border-end-0 border-start-0">
                      <h6 className="fs-14-ss mb-0">Akhir Semester</h6>
                    </th>
                    <th className="border border-white border-3 border-start-0 border-end-0 border-top-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {instrumenPenilaian
                    ?.filter((d) => d.type == "keterampilan")
                    .map((d, idx) => {
                      return (
                        <tr>
                          <td className="td-judul" data-th={d.instrumen}>
                            <h6 className="fw-semibold color-dark mb-0">
                              {d.instrumen}
                            </h6>
                          </td>
                          <td
                            data-th="Nilai"
                            className="text-md-center text-start"
                          >
                            <InputNumber
                              className="form-control text-center mx-md-auto"
                              min={0}
                              max={100}
                              value={bobotNilai?.[`${d?.uts}`]}
                              // onChange={(value) => setFormNilai(value)}
                              name={d?.uts}
                              onChange={(value) =>
                                setBobotNilai({
                                  ...bobotNilai,
                                  [`${d?.uts}`]: value?.target?.value,
                                })
                              }
                              disabled={showInput != d.instrumen}
                              style={{ width: "72px" }}
                              // onKeyPress={(e) => {
                              //   e.key === "Enter"
                              //     ? _editRekapNilai(e.target.value, d)
                              //     : "";
                              // }}
                            />
                          </td>
                          <td
                            data-th="Nilai"
                            className="text-md-center text-start"
                          >
                            <InputNumber
                              className="form-control text-center mx-md-auto"
                              min={0}
                              max={100}
                              name={d?.uas}
                              value={bobotNilai?.[`${d?.uas}`]}
                              // onChange={(value) => setFormNilai(value)}
                              disabled={showInput != d.instrumen}
                              style={{ width: "72px" }}
                              onChange={(value) =>
                                setBobotNilai({
                                  ...bobotNilai,
                                  [`${d?.uas}`]: value?.target?.value,
                                })
                              }
                              // onKeyPress={(e) => {
                              //   e.key === "Enter"
                              //     ? _editRekapNilai(e.target.value, d)
                              //     : "";
                              // }}
                            />
                          </td>
                          <td>
                            {showInput == d.instrumen ? (
                              <Button
                                type="button"
                                className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                htmlType="submit"
                              >
                                <FaCheck className="color-white" />
                              </Button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                onClick={() => {
                                  setShowInput(d.instrumen);
                                }}
                              >
                                <FaPen className="color-secondary" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  {/* <tr>
                    <td className="td-judul" data-th={"Praktik"}>
                      <h6 className="fw-semibold color-dark mb-0">
                        {"Praktik"}
                      </h6>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.praktikUts}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Praktik"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.praktikUas}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Praktik"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput == "Praktik" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          htmlType="submit"
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput("Praktik");
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="td-judul" data-th={"Produk"}>
                      <h6 className="fw-semibold color-dark mb-0">
                        {"Produk"}
                      </h6>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.produkUts}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Produk"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.produkUas}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Produk"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput == "Produk" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          htmlType="submit"
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput("Produk");
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="td-judul" data-th={"Proyek"}>
                      <h6 className="fw-semibold color-dark mb-0">
                        {"Proyek"}
                      </h6>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.proyekUts}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Proyek"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.proyekUas}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Proyek"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput == "Proyek" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          htmlType="submit"
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput("Proyek");
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="td-judul" data-th={"Portofolio"}>
                      <h6 className="fw-semibold color-dark mb-0">
                        {"Portofolio"}
                      </h6>
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.portofolioUts}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Portofolio"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td data-th="Nilai" className="text-md-center text-start">
                      <InputNumber
                        className="form-control text-center mx-md-auto"
                        min={0}
                        max={100}
                        value={bobotNilai?.portofolioUas}
                        // onChange={(value) => setFormNilai(value)}
                        disabled={showInput != "Portofolio"}
                        style={{ width: "72px" }}
                        // onKeyPress={(e) => {
                        //   e.key === "Enter"
                        //     ? _editRekapNilai(e.target.value, d)
                        //     : "";
                        // }}
                      />
                    </td>
                    <td>
                      {showInput == "Portofolio" ? (
                        <Button
                          type="button"
                          className="btn btn-primary-ss shadow-primary-ss p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          htmlType="submit"
                        >
                          <FaCheck className="color-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            setShowInput("Portofolio");
                          }}
                        >
                          <FaPen className="color-secondary" />
                        </button>
                      )}
                    </td>
                  </tr> */}

                  <tr style={{ background: "#F6FAFF" }}>
                    <td className="d-md-block d-none">
                      <h6 className="fw-bold color-primary">Jumlah</h6>
                    </td>
                    <td
                      className="d-block d-md-none position-relative td-judul-jumlah border border-3 border-white border-start-0 border-top-0 border-end-0"
                      data-th="Jumlah"
                    >
                      <h6
                        className="fw-bold color-primary"
                        style={{ opacity: "0" }}
                      >
                        a
                      </h6>
                    </td>
                    <td
                      className="text-md-center text-start td-jumlah-bobot position-relative border border-white border-start-0 border-top-0 border-end-0 border-3"
                      data-th="Tengah Semester"
                    >
                      <h6 className="fw-bold color-primary mb-0">100%</h6>
                    </td>
                    <td
                      className="text-md-center text-start td-jumlah-bobot position-relative"
                      data-th="Akhir Semester"
                    >
                      <h6 className="fw-bold color-primary mb-0">100%</h6>
                    </td>
                    <td className="d-md-block d-none"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TabelBobotNilai;
