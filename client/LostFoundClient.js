import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";

// ✅ Ambil semua postingan Lost & Found
export async function getLostFoundItems() {
  try {
    const res = await axios.get(`${baseURL}/lostfound`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    } else {
      console.error("Format data tidak sesuai:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Gagal ambil Lost & Found:", error);
    throw new Error("Gagal mengambil data Lost & Found");
  }
}
export async function getArchivedLostFoundItems() {
  const res = await axios.get(`${baseURL}/lostfound?archived=1`);
  return Array.isArray(res.data?.data) ? res.data.data : [];
}

// ✅ Ambil 1 postingan berdasarkan ID
export async function getLostFoundById(id) {
  try {
    const res = await axios.get(`${baseURL}/lostfound/${id}`);
    if (res.data && res.data.data) {
      return res.data.data;
    } else {
      console.error("Data tidak ditemukan:", res.data);
      return null;
    }
  } catch (error) {
    console.error(`Gagal ambil data Lost & Found ID ${id}:`, error);
    throw new Error("Gagal mengambil data berdasarkan ID");
  }
}

// ✅ Ambil semua kategori unik dari Lost & Found
export async function getAllKategori() {
  try {
    const res = await axios.get(`${baseURL}/lostfound/kategori`);
    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return [
      "Barang", "Buku", "Elektronik", "Dokumen", "Kunci", "Dompet", "Tas", "Sepatu", "HP", "Lainnya"
    ];
  } catch (error) {
    console.error("Gagal ambil kategori:", error);
    // fallback agar UI tidak crash ketika backend/offline
    return [
      "Barang", "Buku", "Elektronik", "Dokumen", "Kunci", "Dompet", "Tas", "Sepatu", "HP", "Lainnya"
    ];
  }
}

// ✅ Tambah postingan Lost & Found (form multipart)
export async function createLostFound(data) {
  try {
    const res = await axios.post(`${baseURL}/lostfound`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Gagal membuat postingan:", error);
    throw new Error("Gagal membuat postingan Lost & Found");
  }
}

export const updateLostFound = async (id, formData) => {
  const res = await axios.put(`${baseURL}/lostfound/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

