import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useUser from "../../../hooks/useUser";
import styles from "../../../styles/LostAndFound.module.scss";
import Image from "next/image";
import { getLostFoundItems } from "../../../client/LostFoundClient";


const Index = () => {
  const { user } = useUser();
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [newPostNotif, setNewPostNotif] = useState(null); // notif merah
  const lastItemId = useRef(null);
  const dismissedNotifId = useRef(null); // id yg udah ditutup

  const colorMap = {
    Dicari: "#FFD600",
    Ditemukan: "#2979FF",
    Selesai: "#00E676",
  };

  const fetchAll = async () => {
    try {
      const data = await getLostFoundItems();
      if (!Array.isArray(data)) return;

      setLostFoundItems(data);

      if (selectedKategori) {
        const filtered = data.filter((item) => item.kategori === selectedKategori);
        setFilteredItems(filtered);
      } else {
        setFilteredItems(data);
      }

      const kategoriUnik = [...new Set(data.map((item) => item.kategori))];
      setKategoriList(kategoriUnik);

      // cek postingan baru
      if (lastItemId.current && data[0]?.id !== lastItemId.current) {
        const newItem = data[0];
        if (newItem.id !== dismissedNotifId.current) {
          setNewPostNotif(newItem);
        }
      }
      if (data.length > 0) {
        lastItemId.current = data[0].id;
      }
    } catch (err) {
      console.error("Gagal fetch data lost & found", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000); // setiap 10 detik
    return () => clearInterval(interval);
  }, [selectedKategori]);

  // Dengarkan pesan dari Service Worker untuk push realtime
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.serviceWorker) return;
    const handler = (event) => {
      const msg = event.data;
      if (msg?.type === 'LOSTFOUND_NEW') {
        const p = msg.payload;
        // tunjukkan banner merah segera
        if (p?.title || p?.body) {
          setNewPostNotif({ judul: p?.body || p?.title || 'Lost & Found Baru', waktu: new Date().toISOString(), id: 0 });
        }
        // segarkan data list
        fetchAll();
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  }, [selectedKategori]);


  useEffect(() => {
    const introShown = sessionStorage.getItem("lostFoundIntroShown");
    if (!introShown) {
      setShowIntroModal(true);
      sessionStorage.setItem("lostFoundIntroShown", "true");
    }
  }, []);

  const handleSelectKategori = (kategori) => {
    setSelectedKategori(kategori);
    const filtered = lostFoundItems.filter((item) => item.kategori === kategori);
    setFilteredItems(filtered);
    setShowModal(false);
  };

  return (
    <Layout>
      <AnimatePage>

        {/* 🔴 Notifikasi Merah */}
        {newPostNotif && (
          <div
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "10px 24px",
              fontWeight: "bold",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            <div>
              📌 Postingan Baru: <strong>{newPostNotif.judul}</strong> —{" "}
              {new Date(newPostNotif.waktu).toLocaleString("id-ID")}
            </div>
            <button
              onClick={() => {
                dismissedNotifId.current = newPostNotif.id;
                setNewPostNotif(null);
              }}
              style={{
                marginLeft: "20px",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
              aria-label="Tutup"
            >
              ×
            </button>
          </div>
        )}

        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card card-ss p-3 mt-3">
              <h5 className="fw-extrabold color-dark mb-3">Kategori</h5>
              <ul className="list-unstyled mt-3">
                {kategoriList.slice(0, 2).map((kategori, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => handleSelectKategori(kategori)}
                      className="sidebarKategoriLink text-decoration-none color-dark bg-transparent border-0 w-100 text-start"
                    >
                      <span className="fw-semibold">{kategori}</span>
                    </button>
                  </li>
                ))}
                <li className="mt-2">
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss w-100"
                  >
                    + Lainnya
                  </button></li>
                  <br />
                  <Link href="/smartschool/lost-found/arsip">
                  <a className="btn btn-ss btn-outline-primary rounded-pill fw-bold fs-14-ss shadow-none me-2 w-100">
                    Arsip
                  </a>
                </Link>
                
              </ul>
    
            </div>
          </div>

          <div className="col-md-9">
            <div className={styles.lostFoundContainer}>
              <div className={styles.header}>
                <div>
                  <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
                    Lost And Found {selectedKategori ? `- ${selectedKategori}` : ""}
                  </h4>
                </div>
                
                <Link href="/smartschool/lost-found/tambah">
                  <a className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
                    + Tambah Postingan
                  </a>
                </Link>
              </div>
            

              <div className={styles.cardWrapper}>
                {loading ? (
                  <p>Memuat data...</p>
                ) : filteredItems.length === 0 ? (
                  <p>Belum ada data Lost & Found.</p>
                ) : (
                  filteredItems.map((item, i) => (
                    <div className={styles.card} key={i}>
                      <Image
                        src={
                          item.gambar
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.gambar}`
                            : "/img/avatar-lost.png"
                        }
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
                          <span>{item.status}</span>
                        </div>
                        <p className={styles.judul}>{item.judul}</p>
                        <p className={styles.info}>Lokasi: {item.lokasi}</p>
                        <p className={styles.info}>
                          Waktu: {new Date(item.waktu).toLocaleDateString()}
                        </p>
                        <Link href={`/smartschool/lost-found/detail?id=${item.id}`}>
                          <a className={styles.detail}>Lihat Selengkapnya &gt;</a>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Modal kategori lainnya */}
          {showModal && (
            <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold color-dark title-border mb-0">Pilih Kategori</h5>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
                  >
                    X
                  </button>
                </div>

                <div className={styles.gridKategori}>
                  {kategoriList.map((kategori, idx) => (
                    <div
                      key={idx}
                      className={styles.kategoriItem}
                      onClick={() => handleSelectKategori(kategori)}
                      style={{ cursor: "pointer" }}
                    >
                      {kategori}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal intro Lost & Found */}
          {showIntroModal && (
            <div className={styles.modalOverlay} onClick={() => setShowIntroModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold color-dark title-border mb-0">Tentang Fitur</h5>
                  <button
                    onClick={() => setShowIntroModal(false)}
                    className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
                  >
                    X
                  </button>
                </div>
                <p className="mb-0">
                  <span className="fw-bold">Fitur Lost & Found</span><br />
                  merupakan sebuah layanan digital yang dirancang untuk memudahkan seluruh anggota komunitas sekolah dalam melaporkan serta melacak barang-barang yang hilang atau ditemukan di lingkungan sekolah.
                </p>
              </div>
            </div>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default Index;



// import { useRouter } from "next/router"; 
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import Layout from "../../../components/Layout/Layout";
// import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
// import useUser from "../../../hooks/useUser";
// import styles from "../../../styles/LostAndFound.module.scss";
// import Image from "next/image";
// import { getLostFoundItems } from "../../../client/LostFoundClient";

// const Index = () => {
//   const { user } = useUser();
//   const [lostFoundItems, setLostFoundItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [kategoriList, setKategoriList] = useState([]);
//   const [selectedKategori, setSelectedKategori] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showIntroModal, setShowIntroModal] = useState(false);

//   const colorMap = {
//     Dicari: "#FFD600",
//     Ditemukan: "#2979FF",
//     Selesai: "#00E676",
//   };

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const data = await getLostFoundItems();
//         if (!Array.isArray(data)) {
//           toast.error("Data tidak valid dari server");
//           return;
//         }

//         setLostFoundItems(data);
//         setFilteredItems(data);

//         // Ambil kategori unik dari data
//         const kategoriUnik = [...new Set(data.map((item) => item.kategori))];
//         setKategoriList(kategoriUnik);
//       } catch (err) {
//         toast.error("Gagal memuat data Lost & Found");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, []);
  

//   const handleSelectKategori = (kategori) => {
//     setSelectedKategori(kategori);
//     const filtered = lostFoundItems.filter((item) => item.kategori === kategori);
//     setFilteredItems(filtered);
//     setShowModal(false);
//   };

//   return (
//     <Layout>
//       <AnimatePage>
//         <div className="row">
//           {/* Sidebar kategori */}
//           <div className="col-md-3 mb-4">
//             <div className="card card-ss p-3 mt-3">
//               <h5 className="fw-extrabold color-dark mb-3">Kategori</h5>
//               <ul className="list-unstyled mt-3">
//                 {kategoriList.slice(0, 2).map((kategori, index) => (
//                   <li key={index} className="mb-2">
//                     <button
//                       onClick={() => handleSelectKategori(kategori)}
//                       className="sidebarKategoriLink text-decoration-none color-dark bg-transparent border-0 w-100 text-start"
//                     >
//                       {/* <img
//                         src={`/img/icon-${kategori.toLowerCase()}.png`}
//                         alt={kategori}
//                         className="me-3"
//                         width={24}
//                         height={24}
//                       /> */}
//                       <span className="fw-semibold">{kategori}</span>
//                     </button>
//                   </li>
//                 ))}
//                 {/* Tombol Lainnya */}
//                 <li className="mt-2">
//                   <button
//                     onClick={() => setShowModal(true)}
//                     className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss w-100"
//                   >
//                     + Lainnya
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Konten utama */}
//           <div className="col-md-9">
//             <div className={styles.lostFoundContainer}>
//               <div className={styles.header}>
//                 <div>
//                   <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
//                     Lost And Found {selectedKategori ? `- ${selectedKategori}` : ""}
//                   </h4>
//                 </div>
//                 <Link href="/smartschool/lost-found/tambah">
//                   <a className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
//                     + Tambah Postingan
//                   </a>
//                 </Link>
//               </div>

//               <div className={styles.cardWrapper}>
//                 {loading ? (
//                   <p>Memuat data...</p>
//                 ) : filteredItems.length === 0 ? (
//                   <p>Belum ada data Lost & Found.</p>
//                 ) : (
//                   filteredItems.map((item, i) => (
//                     <div className={styles.card} key={i}>
//                     <Image
//                       src={
//                         item.gambar
//                           ? `http://localhost:3333${item.gambar}`
//                           : "/img/avatar-lost.png"
//                       }
//                       alt="gambar"
//                       width={300}
//                       height={200}
//                       className={styles.cardImage}
//                     />

//                       <div className={styles.cardBody}>
//                         <div className={styles.status}>
//                           <span
//                             className={styles.bullet}
//                             style={{
//                               backgroundColor: colorMap[item.status] || "#999",
//                             }}
//                           />
//                           <span>{item.status}</span>
//                         </div>
//                         <p className={styles.judul}>{item.judul}</p>
//                         <p className={styles.info}>Lokasi: {item.lokasi}</p>
//                         <p className={styles.info}>
//                           Waktu: {new Date(item.waktu).toLocaleDateString()}
//                         </p>
//                         <Link href={`/smartschool/lost-found/detail?id=${item.id}`}>
//                           <a className={styles.detail}>Lihat Selengkapnya &gt;</a>
//                         </Link>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Modal kategori lainnya */}
//           {showModal && (
//             <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
//               <div
//                 className={styles.modalContent}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h5 className="fw-bold color-dark title-border mb-0">Pilih Kategori</h5>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
//                   >
//                     X
//                   </button>
//                 </div>

//                 <div className={styles.gridKategori}>
//                   {kategoriList.map((kategori, idx) => (
//                     <div
//                       key={idx}
//                       className={styles.kategoriItem}
//                       onClick={() => handleSelectKategori(kategori)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       {kategori}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </AnimatePage>
//     </Layout>
//   );
// };

// export default Index;


// import Link from "next/link";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
// import swal from "sweetalert";
// import { ssURL } from "../../../client/clientAxios";
// import {
//   getInformasiSekolah,
//   updateInformasiSekolah,
// } from "../../../client/InformasiSekolahClient";
// import { deletePost, getPost } from "../../../client/PostClient";
// import Layout from "../../../components/Layout/Layout";
// import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
// import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
// import PostinganSkeleton from "../../../components/Shared/Skeleton/PostinganSkeleton";
// import Tabs from "../../../components/Shared/Tabs/Tabs";
// import UploadBanner from "../../../components/Shared/UploadBanner/UploadBanner";
// import useUser from "../../../hooks/useUser";
// import styles from "../../../styles/LostAndFound.module.scss";
// import Image from "next/image";

// const index = () => {
//   const { user } = useUser();

//   const [showModal, setShowModal] = useState(false);

//   const allKategori = [
//     "Aksesoris", "Pakaian", "Elektronik", "Alat Tulis", "Dokumen", "Perhiasan",
//     "Makanan", "Kunci", "Dompet", "Kacamata", "Tas", "Sepatu", "HP", "Buku"
//   ];

//   const kategoriMenu = [
//     {
//       url: "#",
//       nama: "Aksesoris",
//       icon: "/img/icon-aksesoris.png",
//     },
//     {
//       url: "#",
//       nama: "Pakaian",
//       icon: "/img/icon-pakaian.png",
//     },
//   ];

//   const dataDummy = [
//     {
//       status: "Dicari",
//       color: "#FFD600",
//       title: "Jaket Hitam",
//       lokasi: "Kantin",
//       tanggal: "07/08/2025",
//     },
//     {
//       status: "Selesai",
//       color: "#00E676",
//       title: "Laptop Asus",
//       lokasi: "Lab Komputer",
//       tanggal: "05/08/2025",
//     },
//     {
//       status: "Ditemukan",
//       color: "#2979FF",
//       title: "Topi Hitam",
//       lokasi: "Lapangan",
//       tanggal: "03/08/2025",
//     },
//   ];

//   return (
//     <Layout>
//       <AnimatePage>
//         <div className="row">
//           {/* Sidebar kategori */}
//           <div className="col-md-3 mb-4">
//             <div className="card card-ss p-3 mt-3">
//               <h5 className="fw-extrabold color-dark mb-3">Kategori</h5>
//               {/* <ul className="list-unstyled mt-3">
//                 {kategoriMenu.map((menu, index) => (
//                   <li key={index} className="mb-2">
//                     <a
//                       href={menu.url}
//                       className="sidebarKategoriLink text-decoration-none color-dark"
//                     >
//                       <img
//                         src={menu.icon}
//                         alt={menu.nama}
//                         className="me-3"
//                         width={24}
//                         height={24}
//                       />
//                       <span className="fw-semibold">{menu.nama}</span>
//                     </a>
//                   </li>
//                 ))}
//               </ul> */}
//               <ul className="list-unstyled mt-3">
//                 {kategoriMenu.map((menu, index) => (
//                   <li key={index} className="mb-2">
//                     <a
//                       href={menu.url}
//                       className="sidebarKategoriLink text-decoration-none color-dark"
//                     >
//                       <img
//                         src={menu.icon}
//                         alt={menu.nama}
//                         className="me-3"
//                         width={24}
//                         height={24}
//                       />
//                       <span className="fw-semibold">{menu.nama}</span>
//                     </a>
//                   </li>
//                 ))}

//                 {/* Tombol Lainnya */}
//                 <li className="mt-2">
//                   <button
//                     onClick={() => setShowModal(true)}
//                     className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss w-100"
//                   >
//                     + Lainnya
//                   </button>
//                 </li>
//               </ul>

//             </div>
//           </div>

//           {/* Konten utama Lost & Found */}
//           <div className="col-md-9">
//             <div className={styles.lostFoundContainer}>
//               <div className={styles.header}>
//                 <div>
//                   <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
//                     Lost And Found
//                   </h4>
//                 </div>
//                 <Link href="/smartschool/lost-found/tambah">
//                   <a className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
//                     + Tambah Postingan
//                   </a>
//                 </Link>
//               </div>

//               <div className={styles.cardWrapper}>
//                 {dataDummy.map((item, i) => (
//                   <div className={styles.card} key={i}>
//                     <Image
//                       src="/img/avatar-lost.png"
//                       alt="avatar"
//                       width={300}
//                       height={200}
//                       className={styles.cardImage}
//                     />
//                     <div className={styles.cardBody}>
//                       <div className={styles.status}>
//                         <span
//                           className={styles.bullet}
//                           style={{ backgroundColor: item.color }}
//                         />
//                         <span>{item.status}</span>
//                       </div>
//                       <p className={styles.judul}>{item.title}</p>
//                       <p className={styles.info}>Lokasi: {item.lokasi}</p>
//                       <p className={styles.info}>Waktu: {item.tanggal}</p>
//                       <Link href={`/smartschool/lost-found/detail`}>
//                         <a className={styles.detail}>Lihat Selengkapnya &gt;</a>
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {showModal && (
//             <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
//               <div
//                 className={styles.modalContent}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h5 className="fw-bold mb-0">Pilih Kategori</h5>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="btn btn-sm btn-danger rounded-pill"
//                   >
//                     Tutup
//                   </button>
//                 </div>

//                 <div className={styles.gridKategori}>
//                   {allKategori.map((item, idx) => (
//                     <div key={idx} className={styles.kategoriItem}>
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}


//         </div>
//       </AnimatePage>
//     </Layout>
    
//   );
// };

// export default index;
