import { deleteBukuKerja } from "client/BukuKerjaGuruClient";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { showModal } from "utilities/ModalUtils";
import { getPreviewURL } from "utilities/FileViewer";
import CardBukuKerja from "components/BukuKerjaGuru/CardBukuKerja";
import Title from "components/BukuKerjaGuru/Title";
import LayoutPerangkatPembelajaranDetail from "components/PerangkatPembelajaran/LayoutPerangkatPembelajaranDetail";
import Link from "next/link";
import { ssURL } from "client/clientAxios";
import {
  showTingkat,
  showTingkatFolder,
} from "client/PerangkatPembelajaranClient";
import { useEffect, useState } from "react";

const index = ({ type, id }) => {
  const [tingkat, setTingkat] = useState([]);

  const _showTingkat = async () => {
    const { data, error } = await showTingkat(id);

    if (data) {
      setTingkat(data);
    }
  };

  useEffect(() => {
    _showTingkat();
  }, []);

  const [tingkatFolder, setTingkatFolder] = useState({});

  const _showTingkatFolder = async () => {
    const { data, error } = await showTingkatFolder(type);

    if (data) {
      setTingkatFolder(data);
    }
  };

  useEffect(() => {
    _showTingkatFolder();
  }, [type]);

  return (
    <LayoutPerangkatPembelajaranDetail
      type={type}
      tingkat={tingkat}
      title={`Kelas ${tingkat?.tingkat} ${tingkat?.jenjang}`}
    >
      <Title>{tingkatFolder?.judul}</Title>

      <div className="row mt-4 pt-4 g-4">
        {tingkatFolder?.folderContent?.map((d, idx) => {
          return (
            <div className="col-md-6" key={`${idx}-${new Date().getTime()}`}>
              <a href={d?.file}>
                <div
                  className="card card-ss p-4 bg-no-repeat bg-x-right bg-y-bottom"
                  style={{
                    minHeight: "105px",
                    background: `url("/img/bg-card-perangkat-pembelajaran.svg")`,
                  }}
                >
                  <h4 className="fw-extrabold color-dark mb-0">{d?.judul}</h4>
                  <div className="d-flex align-items-center">
                    <img
                      src="/img/icon-konten-perangkat-pembelajaran.svg"
                      alt="icon-konten-perangkat-pembelajaran"
                    />
                    <span className="ms-2 fs-14-ss fw-semibold color-primary">
                      {d?.klasifikasi}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </LayoutPerangkatPembelajaranDetail>
  );
};

export async function getServerSideProps({ query: { type }, params: { id } }) {
  return {
    props: {
      type: type || null,
      id: id || null,
    },
  };
}

export default index;
