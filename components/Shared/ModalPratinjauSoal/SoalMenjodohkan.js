import { alphabet } from "utilities/HelperUtils";

const SoalMenjodohkan = ({ data }) => {
  return (
    <div>
      <h4
        className="content-soal mb-4"
        dangerouslySetInnerHTML={{ __html: data?.soal?.pertanyaan }}
      ></h4>

      {data?.soal?.soalMenjodohkan?.map((item, idx) => {
        return (
          <div className="rounded-ss border border-light-secondary p-3 mb-4">
            <div className="mb-4">
              <span
                className="px-3 border border-primary-ss rounded-pill color-primary fs-14-ss fw-extrabold"
                style={{ paddingTop: "2px", paddingBottom: "2px" }}
              >
                Soal {idx + 1}
              </span>
            </div>

            <div className="mb-4">
              <p
                className="m-0"
                dangerouslySetInnerHTML={{ __html: item?.soal }}
              ></p>
            </div>
            <div className="mb-4">
              <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">
                Jawaban Benar
              </h6>
              <div className="list-jawaban-soal rounded-ss bg-soft-success border border-success-ss px-4 py-3 d-flex align-items-center mb-3">
                <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">
                  {alphabet[item?.jawaban]}
                </h6>
                <div className="konten-list-jawaban-soal">
                  <p
                    className="mb-0"
                    dangerouslySetInnerHTML={{
                      __html: data?.soal?.pilihanMenjodohkan[item?.jawaban],
                    }}
                  />
                </div>
              </div>
            </div>

            <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">
              Pembahasan
            </h6>
            <div className="konten-pembahasan-soal mb-2">
              <p
                className="mb-0"
                dangerouslySetInnerHTML={{ __html: item?.pembahasan }}
              ></p>
            </div>
            <p className="color-dark fw-bold mb-0">
              Jadi Jawaban yang tepat adalah {alphabet[item?.jawaban]}.
            </p>
          </div>
        );
      })}
      {/* <div className="rounded-ss border border-light-secondary p-3 mb-4">
        <div className="mb-4">
          <span
            className="px-3 border border-primary-ss rounded-pill color-primary fs-14-ss fw-extrabold"
            style={{ paddingTop: "2px", paddingBottom: "2px" }}
          >
            Soal 2
          </span>
        </div>

        <div className="mb-4">
          <p className="m-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            maiores natus, officiis, fugiat, officia asperiores ratione adipisci
            aliquam delectus exercitationem assumenda accusamus molestiae.
            Voluptatum quos animi deserunt quisquam! Modi, a?
          </p>
        </div>
        <div className="mb-4">
          <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">
            Jawaban Benar
          </h6>
          <div className="list-jawaban-soal rounded-ss bg-soft-success border border-success-ss px-4 py-3 d-flex align-items-center mb-3">
            <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">E</h6>
            <div className="konten-list-jawaban-soal">
              <p className="mb-0">Jawaban E</p>
            </div>
          </div>
        </div>

        <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Pembahasan</h6>
        <div className="konten-pembahasan-soal mb-2">
          <p className="mb-0">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
            optio maxime explicabo magni ullam cumque! Cum nam quibusdam
            aspernatur laborum facilis nostrum officia autem sequi deserunt
            quos, consectetur molestiae beatae.
          </p>
        </div>
        <p className="color-dark fw-bold mb-0">
          Jadi Jawaban yang tepat adalah E.
        </p>
      </div> */}
    </div>
  );
};

export default SoalMenjodohkan;
