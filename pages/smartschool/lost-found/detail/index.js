import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import useUser from "../../../../hooks/useUser";
import styles from "../../../../styles/LostAndFoundDetail.module.scss";
import { getLostFoundById } from "../../../../client/LostFoundClient";

export default function DetailPage() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const data = await getLostFoundById(id);
        setPost(data);
      } catch (err) {
        toast.error("Gagal mengambil data detail");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleEdit = () => {
    router.push(`/smartschool/lost-found/${id}/edit`);
  };

  // Mapping warna status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "dicari":
        return "#FFD600"; // Kuning
      case "ditemukan":
        return "#2196F3"; // Biru
      case "selesai":
        return "#4CAF50"; // Hijau
      default:
        return "#9E9E9E"; // Abu-abu (fallback)
    }
  };

  if (loading) return <p>Memuat detail...</p>;
  if (!post) return <p>Data tidak ditemukan.</p>;

  return (
    <Layout>
      <AnimatePage>
        <div className={styles.detailWrapper}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
              Detail Lost And Found
            </h4>
            <Link href="/smartschool/lost-found/tambah">
              <a className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
                + Tambah Postingan
              </a>
            </Link>
          </div>

          <div className={styles.detailBox}>
            <div className={styles.leftSide}>
              <Image
                src={
                  post?.gambar
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${encodeURI(
                        post.gambar
                      )}`
                    : "/img/avatar-lost.png"
                }
                alt="Barang Hilang"
                width={240}
                height={240}
                className={styles.image}
              />
            </div>

            <div className={styles.rightSide}>
              <h3 className="fw-bold mb-3">{post.judul}</h3>
              <p>
                <strong>Kategori</strong> : {post.kategori}
              </p>
              <p>
                <strong>Status</strong> :{" "}
                <span
                  className={styles.bullet}
                  style={{ backgroundColor: getStatusColor(post.status) }}
                ></span>
                {post.status}
              </p>
              <p>
                <strong>Lokasi</strong> : {post.lokasi}
              </p>
              <p>
                <strong>Waktu</strong> :{" "}
                {new Date(post.waktu).toLocaleDateString()}
              </p>
              <p>
                <strong>Deskripsi</strong> : {post.deskripsi}
              </p>

              {post.kontak && (
                <a
                  href={`https://wa.me/${post.kontak}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.whatsappLink} d-inline-flex align-items-center mt-2 mb-3`}
                >
                  <FaWhatsapp className="me-2" />
                  WhatsApp Pemilik
                </a>
              )}

              {user?.id === post?.created_by && (
                <div className="d-flex justify-content-end mt-4">
                  <button
                    onClick={handleEdit}
                    className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
}



// ini versi button edit hanya tersedia untuk user yang memposting 
// const Index = () => {
//   const { user } = useUser();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Ambil data postingan
//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await getPost("id-postingan"); // Ganti sesuai ID
//         setPost(response);
//       } catch (error) {
//         toast.error("Gagal memuat data postingan");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, []);

//   if (loading) return <PostinganSkeleton />;

//   return (
//     <Layout>
//       <AnimatePage>
//         <div className={styles.detailWrapper}>
//           {/* Header */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
//               Detail Lost And Found
//             </h4>
//             <Link href="/smartschool/lost-found/tambah">
//               <a className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
//                 + Tambah Postingan
//               </a>
//             </Link>
//           </div>

//           {/* Konten detail */}
//           <div className={styles.detailBox}>
//             <div className={styles.leftSide}>
//               <Image
//                 src="/img/avatar-lost.png"
//                 alt="Barang Hilang"
//                 width={240}
//                 height={240}
//                 className={styles.image}
//               />
//             </div>
//             <div className={styles.rightSide}>
//               <h5 className="fw-bold mb-3">{post?.judul}</h5>
//               <p><strong>Kategori</strong> : {post?.kategori}</p>
//               <p>
//                 <strong>Status</strong> :
//                 <span className={styles.bullet} style={{ backgroundColor: "#FFD600" }}></span>
//                 {post?.status}
//               </p>
//               <p><strong>Lokasi</strong> : {post?.lokasi}</p>
//               <p><strong>Waktu</strong> : {post?.waktu}</p>
//               <p><strong>Deskripsi</strong> : {post?.deskripsi}</p>

//               <a
//                 href={`https://wa.me/${post?.kontak}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={`${styles.whatsappLink} d-inline-flex align-items-center mt-2 mb-3`}
//               >
//                 <FaWhatsapp className="me-2" />
//                 WhatsApp Pemilik
//               </a>

//               {/* Tombol Edit hanya muncul jika user yg login adalah pembuat */}
//               {user?.id === post?.createdBy && (
//                 <div className="d-flex justify-content-end">
//                   <button className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
//                     Edit
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </AnimatePage>
//     </Layout>
//   );
// };

// export default Index;
