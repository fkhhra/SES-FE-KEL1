import NewModal from "components/Shared/NewModal/NewModal";
import useUser from "hooks/useUser";
import { FaFile } from "react-icons/fa";

const ModalBuktiKeteranganAbsen = ({
  waktuAbsen = "",
  keterangan = "",
  lampiran = [],
}) => {
  const { user } = useUser();

  return (
    <NewModal
      modalId="modalBuktiKeteranganAbsen"
      title={<h4 className="fs-18-ss mb-0 fw-bold">{user?.nama}</h4>}
      content={
        <div>
          <div className="mb-3">
            <h6 className="fw-bold color-dark mb-3">Keterangan Izin</h6>
            <span className="fs-6 color-secondary">{waktuAbsen}</span>
          </div>
          <div className="post-content mt-4">
            <p className="color-secondary">{keterangan}</p>
          </div>
          <h6 className="mt-0 fw-bold color-dark mb-3">Lampiran</h6>
          {lampiran?.length > 0 &&
            lampiran?.map((lampiranData, idx) => (
              <a
                key={`${idx}-${new Date().getTime()}`}
                href={`${lampiranData}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <div className="bg-soft-primary p-3 rounded-ss mb-3">
                  <div className="file-content d-flex align-items-center flex-wrap">
                    <div
                      className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                      style={{
                        width: "48px",
                        height: "48px",
                      }}
                    >
                      <FaFile />
                    </div>
                    <div className="p-2 d-flex flex-column">
                      <p className="fw-bold color-dark mb-1">{lampiranData}</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
        </div>
      }
    />
  );
};

export default ModalBuktiKeteranganAbsen;
