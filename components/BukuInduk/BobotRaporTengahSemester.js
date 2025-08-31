import { InputNumber } from "antd";
import React, { useState } from "react";
import { FaCheck, FaPen } from "react-icons/fa";

const BobotRaporTengahSemester = ({ ssURL, subnav }) => {
  const [showInput, setShowInput] = useState(null);

  const instrumenPenilaian = [
    { instrumen: "Rata Rata Tugas", type: "pengetahuan" },
    { instrumen: "Rata Rata Penilaian Harian", type: "pengetahuan" },
    {
      instrumen: "Penilaian Tengah Semester / Sumatif Tengah Semester",
      type: "pengetahuan",
    },
    { instrumen: "Praktik", type: "keterampilan" },
    { instrumen: "Produk", type: "keterampilan" },
    { instrumen: "Proyek", type: "keterampilan" },
    { instrumen: "Portofolio", type: "keterampilan" },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-ss px-0 pt-4 pb-5">
          <h4 className="fw-extrabold color-dark mb-4 mx-4">
            Nilai Pengetahuan
          </h4>
          <div className="table-responsive mb-4">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>Instrumen Penilaian</th>
                  <th className="text-md-center text-start">Bobot</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {instrumenPenilaian
                  ?.filter((d) => d.type == "pengetahuan")
                  .map((d, idx) => {
                    return (
                      <tr>
                        <td style={{ width: "70%" }}>
                          <h6 className="fw-semibold color-dark">
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
                            defaultValue={0}
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
                  })}
                <tr style={{ background: "#F6FAFF" }}>
                  <td>
                    <h6 className="fw-bold color-primary">Jumlah</h6>
                  </td>
                  <td className="text-md-center text-start">
                    <h6 className="fw-bold color-primary">100%</h6>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="fw-extrabold color-dark mb-4 mx-4">
            Nilai Keterampilan
          </h4>
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>Instrumen Penilaian</th>
                  <th className="text-md-center text-start">Bobot</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {instrumenPenilaian
                  ?.filter((d) => d.type == "keterampilan")
                  .map((d, idx) => {
                    return (
                      <tr>
                        <td style={{ width: "70%" }}>
                          <h6 className="fw-semibold color-dark">
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
                            defaultValue={0}
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
                  })}
                <tr style={{ background: "#F6FAFF" }}>
                  <td>
                    <h6 className="fw-bold color-primary">Jumlah</h6>
                  </td>
                  <td className="text-md-center text-start">
                    <h6 className="fw-bold color-primary">100%</h6>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BobotRaporTengahSemester;
