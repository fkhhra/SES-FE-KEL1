import { getGelombangPPDB } from "client/GelombangPPDB";
import usePPDB from "hooks/usePPDB";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ppdbURL } from "../../../client/clientAxios";
import Layout from "../../../components/PPDB/Layout";
import StepPPDB from "../../../components/PPDB/StepPPDB";
import SectionKemampuanBahasa from "../../../components/Profil/SectionKemampuanBahasa";
import SectionPengalaman from "../../../components/Profil/SectionPengalaman";
import SectionPrestasiDanSertifikasi from "../../../components/Profil/SectionPrestasiDanSertifikasi";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const PrestasiPPDB = () => {
  const { setTerdaftar } = usePPDB();

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setTerdaftar(data);
    }
  };
  useEffect(() => {
    _getGelombangPPDB();
  }, []);

  const initialStateForm = { fisika1: 70, matematika1: 0, bindo1: 0, bing1: 0 };
  const [formData, setFormData] = useState(initialStateForm);

  const handleChangeInput = (e, numberlimit) => {
    const { value, name } = e.target;

    if (numberlimit) {
      if (value > 100) {
        setFormData({ ...formData, [name]: 100 });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDB />

          <div className="row gy-4">
            <div className="col-md-12">
              <SectionPengalaman isPPDB />
            </div>
            <div className="col-md-12">
              <SectionPrestasiDanSertifikasi isPPDB />
            </div>
            <div className="col-md-12">
              <SectionKemampuanBahasa isPPDB />
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-body p-4 text-center">
                  <p className="fw-bold color-dark">
                    Pastikan data yang anda cantumkan di atas adalah benar dan
                    dapat dipertanggungjawabkan.
                  </p>
                  <Link href={`${ppdbURL}/pilih-jurusan`}>
                    <button className="btn btn-primary btn-primary-ss shadow-primary-ss bg-gradient-primary rounded-pill px-5 py-2 fw-bold">
                      Selanjutnya
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default PrestasiPPDB;
