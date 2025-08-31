import { motion } from "framer-motion";
import {
  FaCheck,
  FaCross,
  FaInfo,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrash,
  FaTrashAlt,
} from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import ModalFormGelombangPPDB from "../../../components/PPDB/ModalFormGelombangPPDB";
import useTa from "../../../hooks/useTa";
import Link from "next/link";
import { ppdbURL, ssURL } from "../../../client/clientAxios";
import {
  deleteGelombangPPDB,
  getGelombangPPDB,
} from "../../../client/GelombangPPDB";
import {
  currencyFormatter,
  momentPackage,
} from "../../../utilities/HelperUtils";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import toast from "react-hot-toast";

const PrasaranaPage = () => {
  const { ta } = useTa();
  const initialFormData = {
    nama: "",
    dibuka: momentPackage(),
    ditutup: momentPackage().add(7, "days"),
    tesAkademik: 0,
    buttonState: "idle",
  };

  const [editData, setEditData] = useState(initialFormData);
  const [isEdit, setIsEdit] = useState(false);

  const handleClickEdit = (data) => {
    setEditData(data);
    setIsEdit(true);
  };

  const handleClickTambah = () => {
    setEditData(initialFormData);
    setIsEdit(false);
  };

  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang } = gelombangPPDB;

  const prasaranaBackend = [
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Ekonid",
      panjang: "7",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Kepala Sekolah",
      panjang: "3",
      lebar: "1.8",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja PLN",
      panjang: "6",
      lebar: "12",
    },
    {
      jenis: "Lapangan",
      kepemilikan: "Milik",
      nama: "Lapangan Basket",
      panjang: "54.15",
      lebar: "21.64",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel Sistem Informatika, Jaringan dan Aplikasi",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja X. KGSP",
      panjang: "9.75",
      lebar: "8",
    },
    {
      jenis: "Laboratorium Fisika",
      kepemilikan: "Milik",
      nama: "Fisika",
      panjang: "8",
      lebar: "9",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 14",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 04",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang OSIS",
      kepemilikan: "Milik",
      nama: "Ruang Ekskul Student Company",
      panjang: "3",
      lebar: "9",
    },
    {
      jenis: "Kamar Mandi/WC Guru Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Guru SIJA",
      panjang: "3",
      lebar: "2",
    },
    {
      jenis: "Ruang Serba Guna/Aula",
      kepemilikan: "Milik",
      nama: "Ruang AULA",
      panjang: "33.3",
      lebar: "14.85",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Fabrikasi Logam XI. TFLM",
      panjang: "7",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Guru TEDK",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 4 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Ruang OSIS",
      kepemilikan: "Milik",
      nama: "Ruang Kesekretariatan Ekskul",
      panjang: "4",
      lebar: "5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki SIJA",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja E. 07 TEDK",
      panjang: "7.6",
      lebar: "8",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 09",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel Kerja Bangku TEDK",
      panjang: "7.4",
      lebar: "10",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel Konstruksi Gedung, Sanitasi dan Perawatan (Praktek Kayu)",
      panjang: "13",
      lebar: "12",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Plumbing KGSP",
      panjang: "25.2",
      lebar: "5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan SIJA",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 5 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Gudang",
      kepemilikan: "Milik",
      nama: "Ruang Alat TFLM",
      panjang: "4.8",
      lebar: "4",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Diskusi/Teori XI TMPO",
      panjang: "11.8",
      lebar: "6",
    },
    {
      jenis: "Lapangan",
      kepemilikan: "Milik",
      nama: "Lapangan Futsal",
      panjang: "45.12",
      lebar: "3.86",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan 2",
      panjang: "1.4",
      lebar: "1.2",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Elektromekanik/Motor TTL",
      panjang: "7",
      lebar: "8",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 16",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 03",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 3 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki 2",
      panjang: "1.4",
      lebar: "1.2",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Guru TFLM",
      panjang: "2",
      lebar: "1.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Produktif X. SIJA",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Perpustakaan",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Lapangan",
      kepemilikan: "Milik",
      nama: "Lapangan Upacara",
      panjang: "40",
      lebar: "25",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Gambar Teknik TEDK",
      panjang: "7.5",
      lebar: "10",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 1 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Ruang OSIS",
      kepemilikan: "Milik",
      nama: "Ruang Inventaris Ekskul",
      panjang: "4",
      lebar: "5",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 11",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki KGSP",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 13",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Gambar Teknik TTL",
      panjang: "7",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 3 Aula",
      panjang: "1.2",
      lebar: "1.5",
    },
    {
      jenis: "Gudang",
      kepemilikan: "Milik",
      nama: "Ruang Alat TFLM",
      panjang: "4.8",
      lebar: "4",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan SIJA",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Laboratorium Komputer",
      kepemilikan: "Milik",
      nama: "Laboratorium N 03 SIJA",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Kamar Mandi/WC Guru Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Lab Fisika-Kimia",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Laboratorium Komputer",
      kepemilikan: "Milik",
      nama: "Laboratorium B 03 KGSP",
      panjang: "24",
      lebar: "15",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja LAS TFLM",
      panjang: "15",
      lebar: "10",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel Teknik dan Manajemen Perawatan Otomotif Binaan Daihatsu",
      panjang: "36",
      lebar: "7.8",
    },
    {
      jenis: "Ruang Guru",
      kepemilikan: "Milik",
      nama: "Ruang Guru KGSP",
      panjang: "6.5",
      lebar: "4",
    },
    {
      jenis: "Laboratorium Komputer",
      kepemilikan: "Milik",
      nama: "Laboratorium E 01 TEDK",
      panjang: "20",
      lebar: "9",
    },
    {
      jenis: "Ruang Guru",
      kepemilikan: "Milik",
      nama: "Ruang Guru SIJA",
      panjang: "8.8",
      lebar: "10",
    },
    {
      jenis: "Ruang UKS",
      kepemilikan: "Milik",
      nama: "Ruang UKS",
      panjang: "4",
      lebar: "8",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 12",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Diskusi/Teori XII TMPO 2",
      panjang: "12",
      lebar: "7.7",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang COE (Centre Of Exellence)/Schneider TTL",
      panjang: "12",
      lebar: "8",
    },
    {
      jenis: "Lapangan",
      kepemilikan: "Milik",
      nama: "Lapangan Badminton",
      panjang: "27.15",
      lebar: "11.44",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja XI. KGSP",
      panjang: "9.75",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Guru Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Guru Perempuan KGSP",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Ruang Guru",
      kepemilikan: "Milik",
      nama: "Ruang Guru Normatif Adaptif",
      panjang: "10.5",
      lebar: "10",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel Teknik dan Manajemen Perawatan Otomotif Binaan Toyota",
      panjang: "28",
      lebar: "9.3",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 10",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang Multimedia",
      kepemilikan: "Milik",
      nama: "Ruang Multimedia",
      panjang: "10",
      lebar: "10",
    },
    {
      jenis: "Ruang Perpustakaan",
      kepemilikan: "Milik",
      nama: "Perpustakaan",
      panjang: "12",
      lebar: "10",
    },
    {
      jenis: "Gudang",
      kepemilikan: "Milik",
      nama: "Ruang Alat TEDK",
      panjang: "8.6",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Guru TMPO",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Ruang OSIS",
      kepemilikan: "Milik",
      nama: "Ruang Keg. Band",
      panjang: "3",
      lebar: "5",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 08",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan SIJA",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan KGSP",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 2 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Ruang Kepala Sekolah",
      kepemilikan: "Milik",
      nama: "Ruang Kepala Sekolah",
      panjang: "10.5",
      lebar: "4",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Guru Laki-laki TEDK",
      panjang: "3",
      lebar: "2",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Sistem Televisi TEDK",
      panjang: "8.8",
      lebar: "8",
    },
    {
      jenis: "Laboratorium Komputer",
      kepemilikan: "Milik",
      nama: "Laboratorium B 01 KGSP",
      panjang: "24",
      lebar: "15",
    },
    {
      jenis: "Gudang",
      kepemilikan: "Milik",
      nama: "Ruang Alat TTL",
      panjang: "4",
      lebar: "7",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 6 Masjid",
      panjang: "2.1",
      lebar: "1",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Diskusi/Teori XII TMPO",
      panjang: "8",
      lebar: "6",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Gambar Manual KGSP",
      panjang: "12",
      lebar: "9",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Pneumatik/PLC TTL",
      panjang: "8",
      lebar: "12",
    },
    {
      jenis: "Kamar Mandi/WC Guru Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Perempuan 1 Aula",
      panjang: "1",
      lebar: "1.5",
    },
    {
      jenis: "Lapangan",
      kepemilikan: "Milik",
      nama: "Lapangan Volley",
      panjang: "7",
      lebar: "14",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Pengukuran TTL",
      panjang: "7",
      lebar: "12",
    },
    {
      jenis: "Laboratorium Bahasa",
      kepemilikan: "Milik",
      nama: "Lab. Bahasa",
      panjang: "10",
      lebar: "10",
    },
    {
      jenis: "Koperasi/Toko",
      kepemilikan: "Milik",
      nama: "Koperasi",
      panjang: "5",
      lebar: "12",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja E. 10 TEDK",
      panjang: "8.6",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 1 Aula",
      panjang: "1",
      lebar: "1.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Audio Video dan Sist. Trans. TEDK",
      panjang: "7.2",
      lebar: "8",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Produktif XII. SIJA 2",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Ruang Keterampilan",
      kepemilikan: "Milik",
      nama: "Ruang Project Center",
      panjang: "2",
      lebar: "8",
    },
    {
      jenis: "Ruang Guru",
      kepemilikan: "Milik",
      nama: "Ruang Guru TEDK",
      panjang: "3",
      lebar: "7.6",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 07",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Laboratorium Komputer",
      kepemilikan: "Milik",
      nama: "Laboratorium N 02 SIJA",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Ruang BP/BK",
      kepemilikan: "Milik",
      nama: "Ruang Bimbingan Konseling",
      panjang: "11.5",
      lebar: "8.5",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 2 Aula",
      panjang: "1",
      lebar: "1.5",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 17",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki 3",
      panjang: "1.4",
      lebar: "1.2",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 01",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Diskusi/Teori X TMPO",
      panjang: "11.8",
      lebar: "6",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 05",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Perempuan 1 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Cisco SIJA",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel CNC TFLM",
      panjang: "11",
      lebar: "10",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel Mesin Bubut 1 TFLM",
      panjang: "30.6",
      lebar: "14",
    },
    {
      jenis: "Gudang",
      kepemilikan: "Milik",
      nama: "Ruang Alat KGSP",
      panjang: "4",
      lebar: "5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki SIJA",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki SIJA",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Bengkel Mesin Bubut 2 TFLM",
      panjang: "25",
      lebar: "14",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Guru SIJA",
      panjang: "3",
      lebar: "2",
    },
    {
      jenis: "Ruang OSIS",
      kepemilikan: "Milik",
      nama: "Ruang Keg. Rohkris",
      panjang: "5",
      lebar: "5",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki TEDK",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan TEDK",
      panjang: "1.5",
      lebar: "2.3",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Produktif XI. SIJA",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R.18",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Area Praktik Inst. Penerangan TTL",
      panjang: "10",
      lebar: "20",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa TMPO",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Perencanaan Rangkaian Dasar Elektronika dan Komunikasi TEDK",
      panjang: "9",
      lebar: "8",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 06",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Produktif XII. SIJA 1",
      panjang: "8",
      lebar: "10",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Laki-laki 7 Masjid",
      panjang: "2.4",
      lebar: "1.2",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Perempuan 3 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 02",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Kamar Mandi/WC Guru Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Perempuan 2 Aula",
      panjang: "1",
      lebar: "1.5",
    },
    {
      jenis: "Gudang",
      kepemilikan: "Milik",
      nama: "Gudang Logistik",
      panjang: "11",
      lebar: "10",
    },
    {
      jenis: "Kamar Mandi/WC Guru Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Guru Perempuan NORA",
      panjang: "4.95",
      lebar: "1.8",
    },
    {
      jenis: "Laboratorium Kimia",
      kepemilikan: "Milik",
      nama: "Kimia",
      panjang: "8",
      lebar: "9",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Produktif XI. TFLM",
      panjang: "7",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Guru Laki-laki KGSP",
      panjang: "1.78",
      lebar: "2.5",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja XII. KGSP",
      panjang: "9.75",
      lebar: "8",
    },
    {
      jenis: "Bengkel",
      kepemilikan: "Milik",
      nama: "Area Praktik Dasar Mekanik, JTR dan JTM TTL",
      panjang: "12",
      lebar: "25",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Perempuan 2 Masjid",
      panjang: "1",
      lebar: "1.3",
    },
    {
      jenis: "Ruang Guru",
      kepemilikan: "Milik",
      nama: "Ruang Guru TTL",
      panjang: "8",
      lebar: "12",
    },
    {
      jenis: "Ruang Teori/Kelas",
      kepemilikan: "Milik",
      nama: "Ruang Teori R. 15",
      panjang: "10",
      lebar: "8.5",
    },
    {
      jenis: "Ruang OSIS",
      kepemilikan: "Milik",
      nama: "Ruang Studio",
      panjang: "5",
      lebar: "8",
    },
    {
      jenis: "Ruang TU",
      kepemilikan: "Milik",
      nama: "Ruang Tata Usaha",
      panjang: "7",
      lebar: "6",
    },
    {
      jenis: "Kamar Mandi/WC Guru Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Guru Laki-laki NORA",
      panjang: "3",
      lebar: "1.75",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Laki-laki",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Laki-laki 1",
      panjang: "1.4",
      lebar: "1.2",
    },
    {
      jenis: "Ruang Praktik Kerja",
      kepemilikan: "Milik",
      nama: "Ruang Praktik Kerja Fabrikasi Logam XII. TFLM",
      panjang: "5",
      lebar: "8",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan 3",
      panjang: "1.4",
      lebar: "1.2",
    },
    {
      jenis: "Kamar Mandi/WC Siswa Perempuan",
      kepemilikan: "Milik",
      nama: "Toilet Siswa Perempuan 1",
      panjang: "1.4",
      lebar: "1.2",
    },
    {
      jenis: "Ruang Guru",
      kepemilikan: "Milik",
      nama: "Ruang Guru TFLM",
      panjang: "5",
      lebar: "8",
    },
  ];

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
    }
  };

  const _deleteGelombangPPDB = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteGelombangPPDB(id);
        if (data) {
          toast.success(data.message);
          _getGelombangPPDB();
        }
      }
    });
  };

  useEffect(() => {
    _getGelombangPPDB();
  }, []);

  return (
    <Layout isFluid={true}>
      <AnimatePage>
        <div className="card card-ss">
          {ta ? (
            <>
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                    Prasarana
                  </h4>
                  <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalFormGelombangPPDB"
                      onClick={() => handleClickTambah()}
                    >
                      <FaPlus /> Tambah
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table-ss">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Jenis</th>
                        <th>Kepemilikan</th>
                        <th>Nama</th>
                        <th>Panjang</th>
                        <th>Lebar</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prasaranaBackend?.length &&
                        prasaranaBackend?.map((data, idx) => {
                          return (
                            <tr key={`${idx}-${new Date().getTime()}`}>
                              <td data-th="No">{idx + 1}</td>
                              <td data-th="Jenis">{data?.jenis}</td>
                              <td data-th="Kepemilikan">{data?.kepemilikan}</td>
                              <td data-th="Nama">{data?.nama}</td>
                              <td data-th="Panjang">{data?.panjang}</td>
                              <td data-th="Lebar">{data?.lebar}</td>
                              <td data-th="Aksi" className="actions">
                                <div className="d-flex flex-lg-row flex-md-column flex-row">
                                  <button
                                    type="button"
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#ModalFormGelombangPPDB"
                                    onClick={() => handleClickEdit(data)}
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() =>
                                      _deleteGelombangPPDB(data?.id)
                                    }
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4">
              <div className="alert alert-danger">
                Anda belum mengaktifkan tahun akademik. Klik{" "}
                <Link href={`${ssURL}/tahun-akademik`}>disini</Link> untuk
                memilih tahun akademik yang aktif
              </div>
            </div>
          )}
        </div>
        <ModalFormGelombangPPDB
          _getGelombangPPDB={_getGelombangPPDB}
          editData={editData}
          isEdit={isEdit}
        />
      </AnimatePage>
    </Layout>
  );
};

export default PrasaranaPage;
