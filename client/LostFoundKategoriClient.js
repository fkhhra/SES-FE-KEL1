import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

export async function getAllKategori() {
  try {
    const response = await axios.get(`${baseURL}/lostfound/kategori`);
    return response.data;
  } catch (error) {
    console.error('Gagal ambil data kategori:', error);
    throw new Error('Gagal ambil data kategori');
  }
}
