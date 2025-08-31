import LayoutKontenPerangkatPembelajaran from "components/Layout/LayoutKontenPerangkatPembelajaran";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import TitleKontenPerangkatPembelajaran from "components/PerangkatPembelajaran/TitleKontenPerangkatPembelajaran";

const index = () => {
  const konten = [
    {
      subtema: "Subtema 1",
      file: [
        { name: "Pertemuan 1" },
        { name: "Pertemuan 2" },
        { name: "Pertemuan 3" },
        { name: "Pertemuan 4" },
        { name: "Pertemuan 5" },
        { name: "Pertemuan 6" },
      ],
    },
    {
      subtema: "Subtema 2",
      file: [
        { name: "Pertemuan 1" },
        { name: "Pertemuan 2" },
        { name: "Pertemuan 3" },
        { name: "Pertemuan 4" },
        { name: "Pertemuan 5" },
        { name: "Pertemuan 6" },
      ],
    },
  ];

  return (
    <LayoutKontenPerangkatPembelajaran title={`RPP`}>
      <AnimatePage>
        <div className="mb-4">
          <TitleKontenPerangkatPembelajaran />
        </div>
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card card-ss py-4 px-4">
              <div className="row">
                <div className="col-sm-12 col-lg-6 d-flex align-items-center">
                  <h4 className="color-dark fw-black mb-0">Daftar Konten</h4>
                </div>
                <div className="col-sm-12 col-lg-6 mt-4 mt-lg-0 d-flex flex-sm-row flex-column">
                  <div className="flex-grow-1 d-flex flex-column">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100 sm-w-100"
                      id="exampleFormControlInput1"
                      placeholder="Cari konten"
                      //   onChange={(e) => setSearch(e.target.value)}
                      //   search={search}
                      // style={{ height: "42px", width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-4">
          {konten.map((d) => {
            return (
              <>
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
                      {d.subtema}
                    </h5>
                  </div>
                </div>
                {d.file.map((d) => {
                  return (
                    <div className="col-md-4">
                      <a className="card card-ss card-download-konten-pembelajaran p-4">
                        <div className="d-flex align-items-center">
                          <img
                            src="/img/icon-file.svg"
                            alt="icon-file"
                            width={`45px`}
                            height={`45px`}
                            className="me-4"
                          />
                          <h6 className="fw-bold color-dark mb-0">{d.name}</h6>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </>
            );
          })}
        </div>
      </AnimatePage>
    </LayoutKontenPerangkatPembelajaran>
  );
};

export default index;
