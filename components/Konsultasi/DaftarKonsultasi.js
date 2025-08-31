import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ssURL } from "../../client/clientAxios";
import { getKonsultasi } from "../../client/KonsultasiClient";
import useUser from "../../hooks/useUser";
import AnimatePage from "../Shared/AnimatePage/AnimatePage";
import TableKunjunganGuru from "./TableBukuKunjungan/TableKunjunganGuru";
import TableKunjunganSiswa from "./TableBukuKunjungan/TableKunjunganSiswa";

const DaftarKonsultasi = () => {

  const { user } = useUser();

  const router = useRouter();
  
  const { query } = router;
  const { nav } = query || "";

  const showDetail = () => {
    const path = `${ssURL}/konsultasi?menu=konsultasi-saya&nav=${!nav ? "pengajuan" : nav}&detail=amirullah`;
    router.push(path);
  }

  return (
    <AnimatePage>
      <div className="card card-ss mt-4">
        <div className="card-header card-header-ss p-0 pt-4">
          <div className="d-flex justify-content-between align-items-sm-center flex-md-row flex-column px-4">
            <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
              Daftar Konsultasi
            </h4>
            <section className="d-flex flex-md-row flex-column">
              <input
                type="text"
                className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100 mb-3 mb-md-0  me-0 me-md-4"
                style={{ height: "42px", width: "100%" }}
                id="exampleFormControlInput1"
                placeholder="Cari Guru"
              />
            </section>
          </div>
        </div>

        <div className="table-responsive mt-3">
          { user?.role === "siswa"
            ? (
              <TableKunjunganSiswa />
            ) : (
              <TableKunjunganGuru />
            )
          }
        </div>
      </div>
    </AnimatePage>
  )
}

export default DaftarKonsultasi;