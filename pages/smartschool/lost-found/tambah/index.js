import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { ssURL } from "../../../../client/clientAxios";
import { getInformasiSekolah, updateInformasiSekolah, } from "../../../../client/InformasiSekolahClient";
import { deletePost, getPost } from "../../../../client/PostClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import PostinganSkeleton from "../../../../components/Shared/Skeleton/PostinganSkeleton";
import Tabs from "../../../../components/Shared/Tabs/Tabs";
import UploadBanner from "../../../../components/Shared/UploadBanner/UploadBanner";
import useUser from "../../../../hooks/useUser";
import styles from "../../../../styles/LostAndFound.module.scss";
import Image from "next/image";
import { getAllKategori, createLostFound } from "../../../../client/LostFoundClient";

const Index = () => {
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    judul: "",
    status: "",
    kategori: "",
    lokasi: "",
    waktu: "",
    kontak: "",
    deskripsi: "",
    gambar: null,
  });

  const [kategoriOptions, setKategoriOptions] = useState([]);
  
  useEffect(() => {
    (async () => {
      const list = await getAllKategori(); 
      setKategoriOptions(list);
    })();
  }, []);

  const statusOptions = ["Dicari", "Ditemukan", "Selesai"];
  const isDeskripsiRequired = form.status === "Dicari";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar") {
      setForm({ ...form, gambar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { judul, status, kategori, lokasi, waktu, kontak, deskripsi, gambar } = form;
  
    if (
      !judul.trim() ||
      !status.trim() ||
      !kategori.trim() ||
      !lokasi.trim() ||
      !waktu.trim() ||
      !kontak.trim() ||
      (isDeskripsiRequired && !deskripsi.trim()) ||
      !gambar
    ) {
      swal("Oops!", "Harap lengkapi semua form!", "error");
      return;
    }
  
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("status", status);
    formData.append("kategori", kategori);
    formData.append("lokasi", lokasi);
    formData.append("waktu", waktu);
    formData.append("kontak", kontak);
    formData.append("deskripsi", isDeskripsiRequired ? deskripsi : "-");
    formData.append("gambar", gambar);
    formData.append("created_by", user?.id || 1);
  
    try {
      await createLostFound(formData);
      swal("Berhasil!", "Postingan berhasil dibuat!", "success");
      router.push("/smartschool/lost-found");
    } catch (error) {
      console.error(error);
      swal("Gagal!", "Gagal mengirim data ke server!", "error");
    }
    // router.push("/smartschool/lost-found?refresh=1");
  };

  return (
    <Layout>
      <AnimatePage>
        <div className="container py-4">
          <div
            className="card shadow-sm p-4 mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <h5 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
              Tambah Lost And Found
            </h5>
            <form onSubmit={handleSubmit}>
              {/* Judul */}
              <div className="mb-3 mt-3">
                <label htmlFor="judul" className="form-label">
                  Judul
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Status</label>
                <div className="dropdown w-100">
                  <button
                    className="form-select shadow-sm border border-2 rounded-pill px-3 py-2 text-start"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {form.status || "Pilih Status"}
                  </button>
                  <ul className="dropdown-menu w-100 shadow-sm border border-1 rounded">
                    {statusOptions.map((item, index) => (
                      <li key={index}>
                        <button
                          className="dropdown-item py-2 px-3 fw-semibold"
                          type="button"
                          onClick={() =>
                            setForm({ ...form, status: item, deskripsi: "" })
                          }
                          style={{
                            borderBottom:
                              index < statusOptions.length - 1
                                ? "1px solid rgba(0,0,0,0.05)"
                                : "none",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{item}</span>
                            <span
                              className="rounded-circle"
                              style={{
                                width: 10,
                                height: 10,
                                backgroundColor:
                                  item === "Dicari"
                                    ? "#FFD600"
                                    : item === "Ditemukan"
                                    ? "#2979FF"
                                    : "#00E676",
                              }}
                            />
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Upload Gambar */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Upload Gambar</label>
                <input
                  type="file"
                  className="form-control rounded-pill"
                  name="gambar"
                  onChange={handleChange}
                />
              </div>

              {/* Kategori */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Kategori</label>
                <select
                  className="form-select rounded-pill px-3 py-2"
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Pilih kategori</option>
                  {kategoriOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* <div className="mb-3">
                <label className="fw-bold mb-2">Kategori</label>
                <input
                  type="text"
                  className="form-control rounded-pill px-3 py-2"
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                />
              </div> */}

              {/* Lokasi */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Lokasi</label>
                <input
                  type="text"
                  className="form-control rounded-pill px-3 py-2"
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                />
              </div>

              {/* Waktu */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Waktu</label>
                <input
                  type="datetime-local"
                  className="form-control rounded-pill px-3 py-2"
                  name="waktu"
                  value={form.waktu}
                  onChange={handleChange}
                />
              </div>

              {/* Kontak WhatsApp */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Kontak WhatsApp</label>
                <input
                  type="text"
                  className="form-control rounded-pill px-3 py-2"
                  name="kontak"
                  value={form.kontak}
                  onChange={handleChange}
                />
              </div>

              {/* Deskripsi */}
              <div className="mb-4">
                <label className="fw-bold mb-2">Deskripsi Detail</label>
                <textarea
                  className={`form-control px-3 py-2 ${
                    !isDeskripsiRequired ? "bg-light text-muted" : ""
                  }`}
                  name="deskripsi"
                  rows="3"
                  value={form.deskripsi}
                  onChange={handleChange}
                  disabled={!isDeskripsiRequired}
                  placeholder={
                    !isDeskripsiRequired
                      ? "Deskripsi tidak diperlukan"
                      : "Tuliskan detail deskripsi di sini"
                  }
                  required={isDeskripsiRequired}
                  style={{
                    cursor: !isDeskripsiRequired ? "not-allowed" : "text",
                  }}
                />
              </div>

              {/* Submit */}
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default Index;



// import Link from "next/link";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
// import swal from "sweetalert";
// import { ssURL } from "../../../../client/clientAxios";
// import {
//   getInformasiSekolah,
//   updateInformasiSekolah,
// } from "../../../../client/InformasiSekolahClient";
// import { deletePost, getPost } from "../../../../client/PostClient";
// import Layout from "../../../../components/Layout/Layout";
// import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
// import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
// import PostinganSkeleton from "../../../../components/Shared/Skeleton/PostinganSkeleton";
// import Tabs from "../../../../components/Shared/Tabs/Tabs";
// import UploadBanner from "../../../../components/Shared/UploadBanner/UploadBanner";
// import useUser from "../../../../hooks/useUser";
// import styles from "../../../../styles/LostAndFound.module.scss";
// import Image from "next/image";
// import { createLostFound } from "../../../../client/LostFoundClient";


// const index = () => {
//   const { user } = useUser();
//   const [form, setForm] = useState({
//     status: "",
//     kategori: "",
//     lokasi: "",
//     waktu: "",
//     kontak: "",
//     deskripsi: "",
//     gambar: null,
//   });

//   const statusOptions = ["Dicari", "Ditemukan", "Selesai"];

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "gambar") {
//       setForm({ ...form, gambar: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();

//   //   const { status, kategori, lokasi, waktu, kontak, deskripsi, gambar } = form;

//   //   if (
//   //     !status.trim() ||
//   //     !kategori.trim() ||
//   //     !lokasi.trim() ||
//   //     !waktu.trim() ||
//   //     !kontak.trim() ||
//   //     !deskripsi.trim() ||
//   //     !gambar
//   //   ) {
//   //     swal("Oops!", "Harap lengkapi semua form!", "error");
//   //     return;
//   //   }

//   //   // Simulasi berhasil
//   //   swal("Berhasil!", "Postingan berhasil dibuat!", "success");

//   //   console.log("Form Data:", form);

//   //   // Reset form setelah submit sukses (opsional)
//   //   setForm({
//   //     status: "",
//   //     kategori: "",
//   //     lokasi: "",
//   //     waktu: "",
//   //     kontak: "",
//   //     deskripsi: "",
//   //     gambar: null,
//   //   });
//   // };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const { status, kategori, lokasi, waktu, kontak, deskripsi, gambar } = form;

//   if (
//     !status.trim() ||
//     !kategori.trim() ||
//     !lokasi.trim() ||
//     !waktu.trim() ||
//     !kontak.trim() ||
//     (!deskripsi.trim() && !isDeskripsiDisabled) ||
//     !gambar
//   ) {
//     swal("Oops!", "Harap lengkapi semua form!", "error");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("status", status);
//   formData.append("kategori", kategori);
//   formData.append("lokasi", lokasi);
//   formData.append("waktu", waktu);
//   formData.append("kontak", kontak);
//   formData.append("deskripsi", deskripsi);
//   formData.append("gambar", gambar);

//   try {
//     await createLostFound(formData);
//     swal("Berhasil!", "Postingan berhasil dibuat!", "success");

//     setForm({
//       status: "",
//       kategori: "",
//       lokasi: "",
//       waktu: "",
//       kontak: "",
//       deskripsi: "",
//       gambar: null,
//     });
//   } catch (error) {
//     swal("Gagal!", "Gagal mengirim data ke server!", "error");
//     console.error(error);
//   }
// };


//   return (
//     <Layout>
//       <AnimatePage>
//         <div className="container py-4">
//           <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
//             <h5 className="fw-extrabold color-dark title-border mb-md-0 mb-4">Tambah Lost And Found</h5>
//             <form onSubmit={handleSubmit}>
//               {/* Status */}
//               <div className="mb-3 mt-3">
//                 <label className="fw-bold mb-2">Status</label>
//                 <div className="dropdown w-100">
//                   <button
//                     className="form-select shadow-sm border border-2 rounded-pill px-3 py-2 text-start"
//                     type="button"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     {form.status || "Pilih Status"}
//                   </button>
//                   <ul className="dropdown-menu w-100 shadow-sm border border-1 rounded">
//                     {statusOptions.map((item, index) => (
//                       <li key={index}>
//                         <button
//                           className="dropdown-item py-2 px-3 fw-semibold"
//                           type="button"
//                           onClick={() => setForm({ ...form, status: item })}
//                           style={{
//                             borderBottom:
//                               index < statusOptions.length - 1
//                                 ? "1px solid rgba(0,0,0,0.05)"
//                                 : "none",
//                           }}
//                         >
//                           <div className="d-flex justify-content-between align-items-center">
//                             <span>{item}</span>
//                             <span
//                               className="rounded-circle"
//                               style={{
//                                 width: 10,
//                                 height: 10,
//                                 backgroundColor:
//                                   item === "Dicari"
//                                     ? "#FFD600"
//                                     : item === "Ditemukan"
//                                     ? "#2979FF"
//                                     : "#00E676",
//                               }}
//                             />
//                           </div>
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Upload Gambar */}
//               <div className="mb-3">
//                 <label className="fw-bold mb-2 ">Upload Gambar</label>
//                 <input
//                   type="file"
//                   className="form-control rounded-pill"
//                   name="gambar"
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Kategori */}
//               <div className="mb-3">
//                 <label className="fw-bold mb-2">Kategori</label>
//                 <input
//                   type="text"
//                   className="form-control rounded-pill px-3 py-2"
//                   name="kategori"
//                   value={form.kategori}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Lokasi */}
//               <div className="mb-3">
//                 <label className="fw-bold mb-2">Lokasi</label>
//                 <input
//                   type="text"
//                   className="form-control rounded-pill px-3 py-2"
//                   name="lokasi"
//                   value={form.lokasi}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Waktu */}
//               <div className="mb-3">
//                 <label className="fw-bold mb-2">Waktu</label>
//                 <input
//                   type="date"
//                   className="form-control rounded-pill px-3 py-2"
//                   name="waktu"
//                   value={form.waktu}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Kontak WhatsApp */}
//               <div className="mb-3">
//                 <label className="fw-bold mb-2">Kontak WhatsApp</label>
//                 <input
//                   type="text"
//                   className="form-control rounded-pill px-3 py-2"
//                   name="kontak"
//                   value={form.kontak}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Deskripsi */}
//               <div className="mb-4">
//                 <label className="fw-bold mb-2">Deskripsi Detail</label>
//                 <textarea
//                   className="form-control px-3 py-2"
//                   name="deskripsi"
//                   rows="3"
//                   value={form.deskripsi}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Submit */}
//               <div className="text-end">
//                 <button type="submit" className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </AnimatePage>
//     </Layout>
//   );
// };

// export default index;
