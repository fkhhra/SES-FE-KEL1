import { downloadURL } from "client/clientAxios";
import {
  downloadLegder,
  downloadLegderYadika,
  downloadLegderYadikaTahun,
} from "client/RombelClient";
import useUser from "hooks/useUser";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { getTotalNilai, sortRanking } from "utilities/RaporUtils";

const ListTingkatLedger = ({ data, rombel, taId }) => {
  const { user } = useUser();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (rombelData) => {
    toast.loading("downloading", { id: `download-rombel${rombelData?.id}` });
    setDownloading(true);
    const ranking = sortRanking(rombelData?.anggotaRombel).map((d, idx) => {
      const siswa = d?.user;
      const listKKM = [];
      rombelData?.kkm?.map((item) => {
        item?.mapelRapor?.map((mapel) => {
          listKKM.push({
            mMataPelajaranId: mapel?.mMataPelajaranId,
            kkm2: mapel?.kkm2,
            kkm: mapel.mataPelajaran.kkm,
          });
        });
      });
      const nilaiSemuaUjian = d?.user?.nilaiSemuaUjian?.filter((d) =>
        listKKM?.find((e) => e?.mMataPelajaranId == d?.mapel?.id)
      );
      const totalNilai = getTotalNilai(nilaiSemuaUjian, siswa);
      return {
        m_user_id: siswa?.id,
        total_nilai: totalNilai,
        ranking: idx + 1,
      };
    });

    document.getElementById("downloadIframe").src = "about:blank";
    const { data, error } =
      user?.mSekolahId == "33"
        ? await downloadLegderYadikaTahun(rombelData?.id, {
            ranking,
            m_ta_id: taId,
          })
        : await downloadLegder(rombelData?.id, { ranking });

    setDownloading(false);
    if (data) {
      document.getElementById("downloadIframe").src = `${downloadURL}${data}`;
      if (data == "Data untuk Leger Nilai Belum Lengkap") {
        toast.error(data, {
          id: `download-rombel${rombelData?.id}`,
          duration: 10000,
        });
      } else {
        toast.success("file tersimpan", {
          id: `download-rombel${rombelData?.id}`,
        });
      }
      return;
    } else if (error) {
      toast.error(error?.message, {
        id: `download-rombel${rombelData?.id}`,
      });
      return;
    }
    toast.error("silahkan coba beberapa saat lagi", {
      id: `download-rombel${rombelData?.id}`,
    });
  };
  return (
    <div className="row mt-3 g-4 mb-4">
      <div className="col-md-12">
        <div className="w-100 position-relative">
          <hr
            className="m-0 w-100 position-absolute"
            style={{
              top: "50%",
              left: "0",
              transform: "tranlateY(-50%)",
            }}
          />
          <h5
            className="position-relative fs-14-ss fw-bold bg-main pe-4 py-1 fs-18-ss fw-black color-dark d-inline"
            style={{ zIndex: "2" }}
          >
            Kelas {data}
          </h5>
        </div>
      </div>
      {rombel?.map((d) => {
        return (
          <div className="col-md-3">
            <a>
              <div
                className="card card-ss p-3 bg-no-repeat"
                style={{
                  background: `url("/img/bg-card-leger.png")`,
                  backgroundPosition: "right bottom",
                }}
                onClick={() => {
                  downloading ? "" : handleDownload(d);
                }}
              >
                <h5 className="fw-black color-dark">{d?.nama}</h5>
                <div className="d-flex align-items-center">
                  <img
                    src="/img/icon-anggota.svg"
                    alt="icon-user"
                    className="me-2"
                    style={{ width: "24px", heigth: "24px" }}
                  />
                  <span className="fs-14-ss color-primary fw-bold">
                    {d?.meta?.total} Siswa
                  </span>
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default ListTingkatLedger;
