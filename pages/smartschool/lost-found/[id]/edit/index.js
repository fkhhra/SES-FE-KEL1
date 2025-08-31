import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert";
import Layout from "../../../../../components/Layout/Layout";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import { getLostFoundById, updateLostFound, getAllKategori } from "../../../../../client/LostFoundClient";
import useUser from "../../../../../hooks/useUser";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [form, setForm] = useState({
    judul: "",
    status: "",
    kategori: "",
    lokasi: "",
    waktu: "",
    kontak: "",
    deskripsi: "",
    gambar: null, // untuk file baru
  });

  const [oldGambar, setOldGambar] = useState(null); // simpan gambar lama
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const statusOptions = ["Dicari", "Ditemukan", "Selesai"];
  const isDeskripsiRequired = form.status === "Dicari";

  // Ambil kategori dari API
  useEffect(() => {
    (async () => {
      try {
        const list = await getAllKategori();
        setKategoriOptions(list);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Ambil data by ID untuk edit
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const data = await getLostFoundById(id);
        setForm({
          judul: data.judul || "",
          status: data.status || "",
          kategori: data.kategori || "",
          lokasi: data.lokasi || "",
          waktu: data.waktu ? new Date(data.waktu).toISOString().slice(0, 16) : "",
          kontak: data.kontak || "",
          deskripsi: data.deskripsi || "",
          gambar: null, // file baru masih kosong
        });
        setOldGambar(data.gambar || null); // simpan gambar lama
      } catch (error) {
        console.error(error);
        swal("Gagal", "Gagal memuat data", "error");
      }
    };
    fetchData();
  }, [id]);

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

    const {
      judul,
      status,
      kategori,
      lokasi,
      waktu,
      kontak,
      deskripsi,
      gambar,
    } = form;

    if (
      !judul.trim() ||
      !status.trim() ||
      !kategori.trim() ||
      !lokasi.trim() ||
      !waktu.trim() ||
      !kontak.trim() ||
      (isDeskripsiRequired && !deskripsi.trim())
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

    if (gambar) {
      // kalau ada file baru, kirim file
      formData.append("gambar", gambar);
    } else if (oldGambar) {
      // kalau tidak upload baru, simpan gambar lama
      formData.append("oldGambar", oldGambar);
    }

    try {
      await updateLostFound(id, formData);
      swal("Berhasil", "Data berhasil diperbarui", "success").then(() => {
        router.push("/smartschool/lost-found"); // redirect
      });
    } catch (error) {
      console.error(error);
      swal("Gagal", "Gagal update data", "error");
    }
  };

  return (
    <Layout>
      <AnimatePage>
        <div className="container py-4">
          <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
            <h5 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
              Edit Lost And Found
            </h5>
            <form onSubmit={handleSubmit}>
              {/* Judul */}
              <div className="mb-3 mt-3">
                <label htmlFor="judul" className="form-label">Judul</label>
                <input
                  type="text"
                  className="form-control"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status Dropdown */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Status</label>
                <div className="dropdown w-100">
                  <button
                    className="form-select shadow-sm border border-2 rounded-pill px-3 py-2 text-start"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    {form.status || "Pilih Status"}
                  </button>
                  <ul className="dropdown-menu w-100 shadow-sm border border-1 rounded">
                    {statusOptions.map((item, index) => (
                      <li key={index}>
                        <button
                          className="dropdown-item py-2 px-3 fw-semibold"
                          type="button"
                          onClick={() => setForm({ ...form, status: item })}
                          style={{
                            borderBottom: index < statusOptions.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
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

              {/* Upload Gambar Baru */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Upload Gambar Baru (Opsional)</label>
                <input
                  type="file"
                  className="form-control rounded-pill"
                  name="gambar"
                  onChange={handleChange}
                />
                {oldGambar && (
                  <div className="mt-2">
                    <small className="text-muted">Gambar lama akan dipertahankan jika tidak diganti.</small>
                  </div>
                )}
              </div>

              {/* Kategori Select */}
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

              {/* Lokasi */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Lokasi</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
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
                  className="form-control rounded-pill"
                  name="waktu"
                  value={form.waktu}
                  onChange={handleChange}
                />
              </div>

              {/* Kontak */}
              <div className="mb-3">
                <label className="fw-bold mb-2">Kontak WhatsApp</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  name="kontak"
                  value={form.kontak}
                  onChange={handleChange}
                />
              </div>

              {/* Deskripsi */}
              <div className="mb-4">
                <label className="fw-bold mb-2">Deskripsi</label>
                <textarea
                  className={`form-control px-3 py-2 ${!isDeskripsiRequired ? "bg-light text-muted" : ""}`}
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

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
                >
                  Update
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






// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import swal from "sweetalert";
// import Layout from "../../../../../components/Layout/Layout";
// import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
// import useUser from "../../../../../hooks/useUser";
// import { getLostFoundById, updateLostFound } from "../../../../../client/LostFoundClient";

// const index = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const { id } = router.query;

//   const [form, setForm] = useState({
//     judul: "",
//     status: "",
//     kategori: "",
//     lokasi: "",
//     waktu: "",
//     kontak: "",
//     deskripsi: "",
//     gambar: null,
//   });

//   const statusOptions = ["Dicari", "Ditemukan", "Selesai"];
//   const isDeskripsiRequired = form.status === "Dicari";

//   useEffect(() => {
//     if (id) {
//       getLostFoundById(id).then((data) => {
//         setForm({
//           judul: data.judul || "",
//           status: data.status || "",
//           kategori: data.kategori || "",
//           lokasi: data.lokasi || "",
//           waktu: data.waktu?.split("T")[0] || "", // format ke YYYY-MM-DD
//           kontak: data.kontak || "",
//           deskripsi: data.deskripsi || "",
//           gambar: null,
//         });
//       });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "gambar") {
//       setForm({ ...form, gambar: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("judul", form.judul);
//     formData.append("status", form.status);
//     formData.append("kategori", form.kategori);
//     formData.append("lokasi", form.lokasi);
//     formData.append("waktu", form.waktu);
//     formData.append("kontak", form.kontak);
//     formData.append("deskripsi", isDeskripsiRequired ? form.deskripsi : "-");

//     if (form.gambar) {
//       formData.append("gambar", form.gambar);
//     }

//     try {
//       await updateLostFound(id, formData);
//       swal("Berhasil!", "Postingan berhasil diperbarui!", "success");
//       router.push("/dashboard/lost-found");
//     } catch (error) {
//       console.error(error);
//       swal("Gagal!", "Gagal mengirim data ke server!", "error");
//     }
//   };

//   return (
//     <Layout>
//       <AnimatePage>
//         <div className="container py-4">
//           <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
//             <h5 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
//               Edit Lost And Found
//             </h5>
//             <form onSubmit={handleSubmit}>
//               {/* Judul */}
//               <div className="mb-3 mt-3">
//                 <label htmlFor="judul" className="form-label">
//                   Judul
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="judul"
//                   value={form.judul}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Status */}
//               <div className="mb-3">
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
//                           onClick={() =>
//                             setForm({ ...form, status: item, deskripsi: "" })
//                           }
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
//                 <label className="fw-bold mb-2">Upload Gambar</label>
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
//                   className={`form-control px-3 py-2 ${
//                     !isDeskripsiRequired ? "bg-light text-muted" : ""
//                   }`}
//                   name="deskripsi"
//                   rows="3"
//                   value={form.deskripsi}
//                   onChange={handleChange}
//                   disabled={!isDeskripsiRequired}
//                   placeholder={
//                     !isDeskripsiRequired
//                       ? "Deskripsi tidak diperlukan"
//                       : "Tuliskan detail deskripsi di sini"
//                   }
//                   required={isDeskripsiRequired}
//                   style={{
//                     cursor: !isDeskripsiRequired ? "not-allowed" : "text",
//                   }}
//                 />
//               </div>

//               {/* Submit */}
//               <div className="text-end">
//                 <button
//                   type="submit"
//                   className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
//                 >
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









// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import swal from "sweetalert";
// import Layout from "../../../../../components/Layout/Layout";
// import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
// import useUser from "../../../../../hooks/useUser";

// const index = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const { id } = router.query;

//   const [form, setForm] = useState({
//     status: "",
//     kategori: "",
//     lokasi: "",
//     waktu: "",
//     kontak: "",
//     deskripsi: "",
//     gambar: null,
//   });

//   // Simulasi: data dummy berdasarkan ID
//   useEffect(() => {
//     if (!id) return;

//     // Kamu nanti ganti bagian ini dgn fetch ke backend by ID
//     const dummyData = {
//       status: "Dicari",
//       kategori: "Pakaian",
//       lokasi: "Kantin",
//       waktu: "2025-08-07",
//       kontak: "08123456789",
//       deskripsi: "Jaket hitam polos hilang di kantin.",
//     };

//     setForm(dummyData);
//   }, [id]);

//   const statusOptions = ["Dicari", "Ditemukan", "Selesai"];

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "gambar") {
//       setForm({ ...form, gambar: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const { status, kategori, lokasi, waktu, kontak, deskripsi } = form;

//     if (
//       !status.trim() ||
//       !kategori.trim() ||
//       !lokasi.trim() ||
//       !waktu.trim() ||
//       !kontak.trim() ||
//       !deskripsi.trim()
//     ) {
//       swal("Oops!", "Harap lengkapi semua form!", "error");
//       return;
//     }

//     swal("Berhasil!", "Postingan berhasil diperbarui!", "success");

//     console.log("Form Data:", form);
//   };

//   return (
//     <Layout>
//       <AnimatePage>
//         <div className="container py-4">
//           <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
//             <h5 className="fw-extrabold color-dark title-border mb-md-0 mb-4">Edit Lost And Found</h5>
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

//               {/* Gambar */}
//               <div className="mb-3">
//                 <label className="fw-bold mb-2">Ganti Gambar</label>
//                 <input
//                   type="file"
//                   className="form-control"
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

//               {/* Kontak */}
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

//               <div className="text-end">
//                 <button type="submit"className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss">
//                   Simpan Perubahan
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
