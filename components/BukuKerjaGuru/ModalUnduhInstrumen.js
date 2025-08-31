import {
  downloadRekapKehadiran,
  downloadRekapNilaiSiswa,
} from "client/BukuKerjaGuruClient";
import { downloadURL } from "client/clientAxios";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import React from "react";
import { getFileName, getPreviewURL } from "utilities/FileViewer";
import NewModal from "../Shared/NewModal/NewModal";

const ModalUnduhInstrumen = ({ modalData, modalType }) => {
  const getFileData = (data) => {
    if (modalType == "daftar-hadir" || modalType == "daftar-nilai") {
      return {
        judul: `${
          modalType == "daftar-hadir" ? "Daftar Hadir" : "Daftar Nilai"
        } ${data?.rombel?.nama}`,
        nama: `daftar-nilai-${data?.rombel?.nama}.xlsx`,
        href: "",
      };
    } else {
      return {
        nama: getFileName(data?.lampiran),
        href: getPreviewURL(data?.lampiran),
        judul: data?.judul,
      };
    }
  };

  const _onClick = async (id) => {
    if (modalType == "daftar-hadir") {
      const { data } = await downloadRekapKehadiran({ jadwalMengajarId: id });
      data && window.open(`${downloadURL}${data}`);
      return;
    }

    if (modalType == "daftar-nilai") {
      const { data } = await downloadRekapNilaiSiswa({ jadwalMengajarId: id });
      data && window.open(`${downloadURL}${data}`);
    }
  };

  return (
    <>
      <NewModal
        modalId="modalUnduhInstrumen"
        modalSize="md"
        removeFooter={true}
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Unduh Instrumen</h4>
          </>
        }
        content={
          <>
            <div className="mb-4">
              {modalData?.map((data, index) => {
                const { nama, href, judul } = getFileData(data);
                return (
                  <div className={`${index != 0 ? "mt-3" : ""}`}>
                    <h6 className="color-dark fw-black mb-2">{judul}</h6>
                    <FileAttachment
                      key={`${index}-${new Date().getTime()}`}
                      nama={nama}
                      icon="file"
                      href={href}
                      onClick={() => _onClick(data?.id)}
                    />
                    {index != modalData?.length - 1 && (
                      <hr className="hr-ss my-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        }
      />
    </>
  );
};

export default ModalUnduhInstrumen;
