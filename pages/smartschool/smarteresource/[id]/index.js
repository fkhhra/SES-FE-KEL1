import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { Pagination } from "antd";
import SkeletonCardHistory from "components/Shared/Skeleton/SkeletonCardHistory";
import { useDebounce } from "use-debounce";
import { getHistory } from "client/SerClient";
import { useRouter } from "next/router";

const sortBy = {
  waktu: [
    {
      name: "Terbaru",
    },
    {
      name: "Terlama",
    },
  ],
  abjad: [
    {
      name: "A-Z",
    },
    {
      name: "Z-A",
    },
  ],
};

const Index = ({ id }) => {
  const router = useRouter();
  const [history, setHistory] = useState(null);
  const { page = 1 } = router.query;
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 600);
  const [abjad, setAbjad] = useState("");
  const [waktu, setWaktu] = useState("");
  const [loading, setLoading] = useState(false);

  const _getAllHistory = async () => {
    setLoading(true);
    const { data } = await getHistory(id, {
      search,
      page,
      abjad,
      waktu,
    });
    if (data) {
      setHistory(data.data);
    }
    setLoading(false);
  };

  const timeAgoString = (timeDifference) => {
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      return "Hari ini";
    } else if (daysDifference === 1) {
      return "1 hari lalu";
    } else {
      return `${daysDifference} hari lalu`;
    }
  };

  useEffect(() => {
    _getAllHistory();
  }, [page, debounceSearch, abjad, waktu]);

  return (
    <Layout>
      <AnimatePage>
        <section className="position-absolute banner-ser"></section>
        <div className="row text-center mb-2">
          <div className="text-white" style={{ zIndex: "1" }}>
            <h1 className="fw-black">Daftar Riwayat Lamaran</h1>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card card-ss mb-4">
              <div className="row flex-sm-row f lex-column">
                <div
                  className="col d-flex flex-column"
                  data-joyride="cari-buku"
                >
                  <form>
                    <input
                      type="text"
                      className="form-control form-search-perpustakaan fs-5 fw-bold ms-4 pe-sm-0 pe-4 overflow-hidden"
                      placeholder="Cari nama perusahaan atau posisi yang dilamar..."
                      name="cariJob"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="d-none">
                      Cari
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-5 gy-3 gy-lg-0">
          <div className="col-md-6">
            <select
              className="form-select"
              aria-label="Default select example"
              placeholder="Urutkan Berdasarkan Abjad"
              value={abjad}
              onChange={(e) => setAbjad(e.target.value)}
            >
              <option value="">Urutkan Berdasarkan Abjad</option>
              {sortBy.abjad.map((d) => (
                <option key={d.name} value={d.name.toLowerCase()}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              aria-label="Default select example"
              placeholder="Urutkan Berdasarkan Waktu"
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
            >
              <option value="">Urutkan Berdasarkan Waktu</option>
              {sortBy.waktu.map((d) => (
                <option key={d.name} value={d.name.toLowerCase()}>
                  {d?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex flex-column gap-4 mb-5">
          {loading ? (
            Array.from(Array(25), (_, i) => <SkeletonCardHistory key={i} />)
          ) : history && history.data && history.data.length > 0 ? (
            history.data.map((d) => (
              <a
                href={`https://ser.smarteschool.id/${d.jobId}`}
                key={d.id}
                target="_blank"
              >
                <div className="card card-ss pointer">
                  <div className="text-decoration-none p-4 gap-md-0 gap-2 d-flex flex-md-row flex-column justify-content-md-between align-items-md-end">
                    <div className="card-body p-0">
                      <h6 className="fw-semibold color-dark mb-2 text-truncate">
                        {d.companyName}
                      </h6>
                      <h5 className="mb-0 fw-black text-truncate color-dark">
                        {d.jobTitle}
                      </h5>
                    </div>
                    <div className="d-flex align-items-center color-dark">
                      <FaClock className="me-2" />
                      {timeAgoString(new Date() - new Date(d.createdAt))}
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="my-3 text-center">
              <img src="/img/empty-state-data.svg" />
              <h3 className="fw-black">Belum ada riwayat lamaran</h3>
            </div>
          )}
        </div>

        <Pagination
          className="text-center"
          total={history?.total}
          showSizeChanger={false}
          current={history?.page}
          pageSize={25}
          onChange={(e) =>
            router.push(`${ssURL}/smarteresource/${id}?page=${e}`)
          }
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default Index;
