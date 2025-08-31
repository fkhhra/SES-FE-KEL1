import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Image from "next/image";
import styles from "../../../../styles/LostAndFound.module.scss";
import { getArchivedLostFoundItems } from "../../../../client/LostFoundClient";

const ArsipLostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState("Semua");

  const colorMap = { Dicari: "#FFD600", Ditemukan: "#2979FF", Selesai: "#00E676" };

  useEffect(() => {
    (async () => {
      try {
        const data = await getArchivedLostFoundItems(); // ?archived=1
        const selesaiOnly = (Array.isArray(data) ? data : []).filter(
          (i) => i.status === "Selesai"
        );
        // sort terbaru
        selesaiOnly.sort(
          (a, b) =>
            new Date(b.created_at || b.waktu) -
            new Date(a.created_at || a.waktu)
        );
        setItems(selesaiOnly);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kategoriList = useMemo(() => {
    const set = new Set(items.map((i) => i.kategori).filter(Boolean));
    return ["Semua", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (kategori !== "Semua" && i.kategori !== kategori) return false;
      if (q && !`${i.judul || ""}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [items, q, kategori]);

  // fungsi buat dapetin url gambar yang bener
  const getImageUrl = (gambar) => {
    if (!gambar) return "/img/avatar-lost.png";

    // kalau gambar sudah dimulai dengan "/img", gabungkan dengan API base
    if (gambar.startsWith("/img")) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}${gambar}`;
    }

    // kalau di DB cuma simpan nama file
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/img/${gambar}`;
  };

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <div className={styles.lostFoundContainer}>
              <div className={styles.header}>
                <div>
                  <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-2">
                    Arsip Lost & Found
                  </h4>
                  <p className="mb-0 text-muted">
                    Semua postingan yang sudah berstatus Selesai.
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Link href="/smartschool/lost-found">
                    <a className="btn btn-ss btn-outline-primary rounded-pill fw-bold fs-14-ss">
                      Kembali
                    </a>
                  </Link>
                </div>
              </div>

              {/* Toolbar filter */}
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <input
                  className="form-control"
                  style={{ maxWidth: 260 }}
                  placeholder="Cari judul…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <select
                  className="form-select"
                  style={{ maxWidth: 220 }}
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                >
                  {kategoriList.map((k, i) => (
                    <option key={i} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <span className="text-muted ms-auto">
                  {filtered.length} arsip
                </span>
              </div>

              <div className={styles.cardWrapper}>
                {loading ? (
                  <p>Memuat data…</p>
                ) : filtered.length === 0 ? (
                  <div className="text-center w-100 py-5">
                    <Image
                      src="/img/avatar-lost.png"
                      alt="empty"
                      width={120}
                      height={90}
                    />
                    <p className="mt-3 mb-0 text-muted">
                      Belum ada arsip yang cocok.
                    </p>
                  </div>
                ) : (
                  filtered.map((item, i) => (
                    <div className={styles.card} key={i}>
                      <Image
                        src={getImageUrl(item.gambar)}
                        alt="gambar"
                        width={300}
                        height={200}
                        className={styles.cardImage}
                      />
                      <div className={styles.cardBody}>
                        <div className={styles.status}>
                          <span
                            className={styles.bullet}
                            style={{
                              backgroundColor: colorMap[item.status] || "#999",
                            }}
                          />
                          <span className="me-2">{item.status}</span>
                          <span className="badge rounded-pill bg-light text-dark border">
                            {item.kategori}
                          </span>
                        </div>
                        <p className={styles.judul}>{item.judul}</p>
                        <p className={styles.info}>Lokasi: {item.lokasi}</p>
                        <p className={styles.info}>
                          Waktu:{" "}
                          {item.waktu
                            ? new Date(item.waktu).toLocaleString("id-ID")
                            : "-"}
                        </p>
                        <Link
                          href={`/smartschool/lost-found/detail?id=${item.id}`}
                        >
                          <a className={styles.detail}>
                            Lihat Selengkapnya &gt;
                          </a>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default ArsipLostFound;
