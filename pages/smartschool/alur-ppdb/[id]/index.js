import { motion } from "framer-motion";
import Link from "next/link";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/router";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = () => {
  const { nav } = useRouter().query;

  let content;
  let navActive;

  const data = [
    {
      nama: "Rochim",
      nisn: "0019431997",
      nik: "31751212010006",
      nokk: "31751212010005",
    },
    {
      nama: "Alif",
      nisn: "0019431997",
      nik: "31751212010006",
      nokk: "31751212010005",
    },
    {
      nama: "Qolbu",
      nisn: "0019431997",
      nik: "31751212010006",
      nokk: "31751212010005",
    },
    {
      nama: "Wangsa",
      nisn: "0019431997",
      nik: "31751212010006",
      nokk: "31751212010005",
    },
    {
      nama: "Aldava",
      nisn: "0019431997",
      nik: "31751212010006",
      nokk: "31751212010005",
    },
  ];

  if (nav == undefined || nav == "pendaftar") {
    navActive = (
      <ul className="nav nav-pills">
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=pendaftar`}>
            <a
              className="nav-link nav-link-ss py-4 mx-4 active"
              aria-current="page"
            >
              Pendaftar
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=terverifikasi`}>
            <a className="nav-link nav-link-ss py-4 mx-4">Terverifikasi</a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=lapor-diri`}>
            <a className="nav-link nav-link-ss py-4 mx-4">Lapor Diri</a>
          </Link>
        </li>
      </ul>
    );
    content = (
      <div className="card card-ss mb-4">
        <div className="card-header p-4 card-header-ss">Pendaftar</div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>NISN</th>
                  <th>NIK</th>
                  <th>No KK</th>
                  <th>Berkas</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((data, idx) => {
                  return (
                    <tr key={`${idx}-${new Date().getTime()}`}>
                      <td data-th="Nama">{data.nama}</td>
                      <td data-th="NISN">{data.nisn}</td>
                      <td data-th="NIK">{data.nik}</td>
                      <td data-th="No KK">{data.nokk}</td>
                      <td data-th="Berkas">{/* <FormBerkas /> */}</td>
                      <td className="actions">
                        <button className="btn btn-danger rounded-circle">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else if (nav == "terverifikasi") {
    navActive = (
      <ul className="nav nav-pills">
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=pendaftar`}>
            <a className="nav-link nav-link-ss py-4 mx-4">Pendaftar</a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=terverifikasi`}>
            <a
              className="nav-link nav-link-ss py-4 mx-4 active"
              aria-current="page"
            >
              Terverifikasi
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=lapor-diri`}>
            <a className="nav-link nav-link-ss py-4 mx-4">Lapor Diri</a>
          </Link>
        </li>
      </ul>
    );
    content = (
      <div className="card card-ss mb-4">
        <div className="card-header p-4 card-header-ss">Terverifikasi</div>
        <div className="card-body px-4 py-0">
          <table className="table table-hover table-striped table-responsive mt-4">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nama Lengkah</th>
                <th scope="col">NISN</th>
                <th scope="col">NIK</th>
                <th scope="col">No KK</th>
                <th scope="col">Verifikasi Berkas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>123456789</td>
                <td>123456789</td>
                <td>123456789</td>
                <td>123456789</td>
                <td>123456789</td>
                <td>
                  <FormTingkatKerusakanRuang />
                  <button className="btn btn-danger rounded-circle">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (nav == "lapor-diri") {
    navActive = (
      <ul className="nav nav-pills">
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=pendaftar`}>
            <a className="nav-link nav-link-ss py-4 mx-4">Pendaftar</a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=terverifikasi`}>
            <a className="nav-link nav-link-ss py-4 mx-4">Terverifikasi</a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/ppdb?nav=lapor-diri`}>
            <a
              className="nav-link nav-link-ss py-4 mx-4 active"
              aria-current="page"
            >
              Lapor Diri
            </a>
          </Link>
        </li>
      </ul>
    );
    content = (
      <div className="card card-ss mb-4">
        <div className="card-header p-4 card-header-ss">Lapor Diri</div>
        <div className="card-body px-4 py-0">
          <table className="table table-hover table-striped table-responsive mt-4">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nama Lengkah</th>
                <th scope="col">NISN</th>
                <th scope="col">NIK</th>
                <th scope="col">No KK</th>
                <th scope="col">Verifikasi Berkas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>123456789</td>
                <td>123456789</td>
                <td>123456789</td>
                <td>123456789</td>
                <td>123456789</td>
                <td>
                  <FormTingkatKerusakanRuang />
                  <button className="btn btn-danger rounded-circle">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    useRouter().push(`${ssURL}/ppdb`);
  }

  return (
    <Layout>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="card card-ss mb-4">
          <nav className="d-flex justify-content-between align-items-center">
            {navActive}
          </nav>
        </div>
        {content}
      </motion.div>
    </Layout>
  );
};

export default index;
