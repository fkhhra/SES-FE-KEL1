import React from "react";
import { useEffect, useState } from "react";
import { FaPen, FaUndo } from "react-icons/fa";
import {
  checkLabelStatusTuntasWalas,
  checkStatusTuntasWalas,
  filterRanking,
  getTotalNilai,
  sortRanking,
} from "../../utilities/RaporUtils";

const DaftarRanking = ({
  keterangan,
  getDetailRombelData,
  kkm,
  totalMapel,
}) => {
  const [listKKM, setListKKM] = useState([
    { mMataPelajaranId: 0, kkm2: 0, kkm: 0 },
  ]);
  useEffect(() => {
    const temp = [];
    kkm?.map((item) => {
      item?.mapelRapor?.map((mapel) => {
        temp.push({
          mMataPelajaranId: mapel?.mMataPelajaranId,
          kkm2: mapel?.kkm2,
          kkm: mapel.mataPelajaran.kkm,
        });
      });
    });
    setListKKM(temp);
  }, [kkm]);
  return (
    <>
      <div className="card card-ss">
        <div className="card-header p-4 card-header-ss">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
              Ranking Nilai Siswa
            </h4>
            <div className="d-flex">
              <button
                className="btn btn-primary p-2 px-3"
                onClick={() => getDetailRombelData()}
              >
                <FaUndo />
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th
                    className="text-md-center text-start"
                    style={{ width: "10%" }}
                  >
                    Rank
                  </th>
                  <th>Nama</th>
                  <th className="text-md-center text-start">Nilai</th>
                  <th className="text-md-center text-start">Rata Rata</th>
                  <th className="text-md-center text-start">Status</th>
                </tr>
              </thead>
              {sortRanking(keterangan)?.map((d, idx) => {
                const siswa = d?.user;
                const nilaiSemuaUjian = d?.user?.nilaiSemuaUjian?.filter((d) =>
                  listKKM?.find((e) => e?.mMataPelajaranId == d?.mapel?.id)
                );
                const totalNilai = getTotalNilai(nilaiSemuaUjian, siswa);
                const filtered = filterRanking(nilaiSemuaUjian, siswa);
                return (
                  <tbody>
                    <tr>
                      <td data-th="No" className="text-md-center text-start">
                        {idx + 1}
                      </td>
                      <td data-th="Nama">
                        <span className="fw-semibold">{siswa.nama}</span>
                      </td>
                      <td data-th="Nilai" className="text-md-center text-start">
                        {totalNilai}
                      </td>
                      <td data-th="Rata" className="text-md-center text-start">
                        {filtered?.length
                          ? (totalNilai / (filtered?.length * 2)).toFixed(2)
                          : "-"}
                      </td>
                      <td
                        data-th="Status"
                        className="text-md-center text-start"
                      >
                        <span
                          className={checkLabelStatusTuntasWalas(
                            d,
                            listKKM,
                            totalMapel,
                            "akhirSemester",
                            siswa
                          )}
                        >
                          {checkStatusTuntasWalas(
                            d,
                            listKKM,
                            totalMapel,
                            "akhirSemester",
                            siswa
                          )}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DaftarRanking;
