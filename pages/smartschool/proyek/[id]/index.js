import { Badge } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaGlobeAmericas,
  FaPlus,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { ssURL } from "../../../../client/clientAxios";
import {
  detailProyek,
  postAnggotaProyek,
  postKategoriPekerjaan,
  postPekerjaanProyek,
  putAnggotaProyek,
  putKategoriPekerjaan,
  putPekerjaanProyek,
} from "../../../../client/ProyekClient";
import ForumPage from "../../../../components/Kolaborasi/ForumPage";
import ModalDetailKategori from "../../../../components/Kolaborasi/ModalDetailKategori";
import ModalDitugaskan from "../../../../components/Kolaborasi/ModalDitugaskan";
import ModalKategori from "../../../../components/Kolaborasi/ModalKategori";
import RuangKerjaPage from "../../../../components/Kolaborasi/RuangKerjaPage";
import TentangPage from "../../../../components/Kolaborasi/TentangPage";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import { db } from "../../../../config/config";
import useUser from "../../../../hooks/useUser";
import { hideModal } from "../../../../utilities/ModalUtils";

const MemoizedModalDetailKategori = React.memo(
  ({
    formData,
    handleChangeForm,
    handleDetailKategori,
    setFormData,
    user,
    jobs,
    anggota,
    proyekRef,
  }) => (
    <ModalDetailKategori
      formData={formData}
      handleChangeForm={handleChangeForm}
      handleSubmit={handleDetailKategori}
      setFormData={setFormData}
      user={user}
      jobs={jobs}
      anggota={anggota}
      proyekRef={proyekRef}
    />
  ),
  (prev, next) => {
    return prev.formData === next.formData;
  }
);

const index = ({ id, rombel_id, nav, subnav }) => {
  const proyekRef = db.collection("kolaborasi").doc(`${id}`);

  const { user } = useUser();
  const initialStateForm = {
    btnKategori: "idle",
    mProyekId: id,
    namaKategori: "",
    warna: "",
    kategori_id: "",
    judul: "",
    prioritas: "Rendah",
    status: "Baru",
    batas_waktu: "",
    deskripsi: "",
    urutan: "",
    lampiran: [],
    anggota: [],
    jobdesk: [],
  };

  const [formData, setFormData] = useState(initialStateForm);
  const [detail, setDetail] = useState({});
  const [anggota, setAnggota] = useState([]);
  const [isAnggota, setIsAnggota] = useState(0);
  const [logs, setLogs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [request, setRequest] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [pekerjaan, setPekerjaan] = useState({});
  const [myRole, setMyRole] = useState({});
  const [forum, setForum] = useState([]);

  const getLogs = async () => {
    const temp = [];
    proyekRef.collection("logs").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((changes) => {
        temp.push(changes.doc.data());
      });
      setLogs([
        ...temp.sort((a, b) => b.tanggal.toDate() - a.tanggal.toDate()),
      ]);
    });
  };

  const _detailProyek = async () => {
    const { data } = await detailProyek(id);
    let proyek = await proyekRef.get();
    proyek = proyek.data();
    proyekRef.onSnapshot((snapshot) => {
      setDetail(snapshot.data());
    });

    if (data) {
      const temp = [];
      data?.proyek?.anggota?.map((d) => {
        if (d.status === "menerima") {
          proyekRef
            .collection("anggota")
            .doc(`${d.id}`)
            .set(d, { merge: true });
          temp.push(d);
        } else if (d.status === "permintaan") {
          proyekRef
            .collection("anggota")
            .doc(`${d.id}`)
            .set(d, { merge: true });
        } else if (d.status === "undangan") {
          proyekRef
            .collection("anggota")
            .doc(`${d.id}`)
            .set(d, { merge: true });
        }
      });
      setDetail(proyek);
    }
  };

  const getAnggota = async () => {
    const anggotaData = [];
    const anggotaObserver = proyekRef
      .collection("anggota")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            const index = anggotaData.findIndex((d) => d.id == change.doc.id);
            anggotaData[index] = change.doc.data();
          } else if (change.type === "added") {
            anggotaData.push(change.doc.data());
          } else if (change.type == "removed") {
            const index = anggotaData.findIndex((d) => d.id == change.doc.id);
            anggotaData.splice(index, 1);
          }
        });
        setAnggota(
          anggotaData.filter(
            (d) => d.status == "menerima" || d.status == "undangan"
          )
        );
        setRequest(anggotaData.filter((d) => d.status == "permintaan"));
      });
  };

  const _getKategoriPekerjaan = async () => {
    const data = [];
    const observer = proyekRef
      .collection("kategori")
      .orderBy("urutan", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            const index = data.findIndex((d) => d.id == change.doc.id);
            const { pekerjaan: temp } = change.doc.data();
            data[index] = change.doc.data();
          } else if (change.type === "added") {
            const { pekerjaan: temp } = change.doc.data();
            data.push(change.doc.data());
          } else if (change.type === "removed") {
            const index = data.findIndex((d) => d.id == change.doc.id);
            data.splice(index, 1);
          }
        });
        setKategori([...data.sort((a, b) => a.urutan - b.urutan)]);
      });

    const temp = {};
    const pekerjaanObserver = proyekRef
      .collection("pekerjaan")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            temp[change.doc.id] = change.doc.data();
            // setPekerjaan(temp);
          } else if (change.type === "added") {
            temp[change.doc.id] = change.doc.data();
          } else if (change.type === "removed") {
            delete temp[change.doc.id];
          }
        });
        setPekerjaan({ ...temp });
        // setKategori(data.sort((a, b) => a.urutan - b.urutan));
      });
  };

  const _getForumPostingan = async () => {
    const postingan = [];
    const observer = proyekRef
      .collection("forum")
      .orderBy("updatedAt", "desc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((changes) => {
          if (changes.type == "added") {
            postingan.push(changes.doc.data());
          } else if (changes.type == "removed") {
            const index = postingan.findIndex(
              (post) => post.id == changes.doc.id
            );
            postingan.splice(index, 1);
          } else if (changes.type == "modified") {
            const index = postingan.findIndex(
              (post) => post.id == changes.doc.id
            );
            postingan[index] = changes.doc.data();
          }
        });
        setForum([
          ...postingan.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        ]);
      });
  };

  const getRoles = async () => {
    const data = await proyekRef.collection("roles").get();
    const tempRole = [];
    const roleObserver = proyekRef
      .collection("roles")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "removed") {
            const index = tempRole.findIndex((d) => d.label == change.doc.id);
            tempRole.splice(index, 1);
          } else if (change.type == "modified") {
            const index = tempRole.findIndex((d) => d.label == change.doc.id);
            tempRole[index] = {
              label: change.doc.id,
              permissions: change.doc.data(),
            };
          } else if (change.type == "added") {
            tempRole.push({
              label: change.doc.id,
              permissions: change.doc.data(),
            });
          }
        });
        setRoles([...tempRole]);
      });
    return roleObserver;
    // data.docs.forEach((role) => {
    //   tempRole.push({ label: role.id, permissions: role.data() });
    // });
  };

  const putRole = async (d) => {
    const { data } = await putAnggotaProyek(d.anggotaId, {
      status: d.status,
      role: d.role,
    });

    if (data) {
      if (d.status == "menolak") {
        await proyekRef.collection("anggota").doc(`${d.anggotaId}`).delete();
        proyekRef
          .collection("logs")
          .doc()
          .set({
            message: `${d.anggotaNama} dikeluarkan dari proyek`,
            by: user.nama,
            tanggal: moment().toDate(),
          });
        toast.success(data?.message);
        _detailProyek();
        return;
      }
      await proyekRef
        .collection("anggota")
        .doc(`${d.anggotaId}`)
        .update({
          jobdesk: d.jobdesk ? d.jobdesk : [],
        });
      const message =
        d.status === "menerima"
          ? `role ${d.anggotaNama} diubah`
          : `${d.anggotaNama} dikeluarkan dari proyek`;
      proyekRef
        .collection("logs")
        .doc()
        .set({ message: message, by: user.nama, tanggal: moment().toDate() });
      toast.success(data?.message);
      _detailProyek();
    }
  };

  const postRoles = async (d) => {
    if (d.type == "edit") {
      if (d.role !== d.roleBefore) {
        const data = await proyekRef
          .collection("anggota")
          .where("role.role", "==", d.roleBefore)
          .get();
        data.docs.forEach(async (doc) => {
          putRole({
            anggotaId: doc.id,
            status: "menerima",
            role: d.role,
            anggotaNama: doc.data().user.nama,
          });
        });
        await proyekRef.collection("roles").doc(`${d.roleBefore}`).delete();
      }
      await proyekRef
        .collection("roles")
        .doc(`${d.role}`)
        .set({ ...d.permissions });
    } else if (d.type == "delete") {
      const data = await proyekRef
        .collection("anggota")
        .where("role.role", "==", d.roleBefore)
        .get();
      data.docs.forEach(async (doc) => {
        putRole({ anggotaId: doc.id, status: "menerima", role: d.role });
      });
      await proyekRef.collection("roles").doc(`${d.roleBefore}`).delete();
    } else {
      await proyekRef
        .collection("roles")
        .doc(`${d.role}`)
        .set({ ...d.permissions });
    }
    getRoles();
  };

  const getJobdesk = async () => {
    const jobdesk = [];
    const observerJobdesk = proyekRef
      .collection("jobdesk")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            jobdesk.push(change.doc.data());
          } else if (change.type == "modified") {
            const index = jobdesk.findIndex((d) => d.id == change.doc.id);
            jobdesk[index] = change.doc.data();
          } else if (change.type == "removed") {
            const index = jobdesk.findIndex((d) => d.id == change.doc.id);
            jobdesk.splice(index, 1);
          }
        });
        setJobs([...jobdesk]);
      });
  };

  const handleSubmitJobdesk = async (data) => {
    if (data.type == "Post") {
      const jobdesk = await proyekRef
        .collection("jobdesk")
        .where("name", "==", data.job)
        .get();
      if (jobdesk.docs.length > 0) {
        toast.error("Jobdesk Sudah Ada");
        hideModal("modalJobdesk");
      } else {
        postJobdesk(data);
      }
    } else if (data.type == "Edit") {
      putJobdesk(data);
    }
  };

  const postJobdesk = async (data) => {
    const id = v4();
    await proyekRef.collection("jobdesk").doc(`${id}`).set({
      id,
      name: data.job,
    });
    toast.success("Jobdesk berhasil ditambahkan");
    hideModal("modalJobdesk");
    getJobdesk();
  };

  const putJobdesk = async (data) => {
    await proyekRef.collection("jobdesk").doc(`${data.id}`).update({
      name: data.job,
    });
    toast.success("Jobdesk berhasil diubah");
    hideModal("modalJobdesk");
    getJobdesk();
  };

  const gabungProyek = async () => {
    if (
      !request?.find((d) => d?.user?.id == user.id) &&
      !anggota?.find((d) => d?.user?.id == user.id)
    ) {
      const payload = {
        anggotaProyekId: anggota?.find((d) => d.role.role == "Pemilik")?.id,
        proyekId: id,
        userId: [user.id],
        status: "permintaan",
      };

      const { data, error, isSuccess } = await postAnggotaProyek(payload);

      if (isSuccess) {
        toast.success(data?.message);

        _detailProyek();
      } else {
        toast.error(error?.message);
      }
    } else {
      toast.info("Permintaan sudah dikirim");
    }
  };

  const checkPermission = (type) => {
    const data = roles.find((d) => d.label == myRole);
    if (myRole == "Pemilik") {
      return 1;
    }
    if (data?.permissions[type]) {
      return 1;
    } else {
      return;
    }
  };

  const getContrast = (hexcolor) => {
    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === "#") {
      hexcolor = hexcolor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
      hexcolor = hexcolor
        .split("")
        .map(function (hex) {
          return hex + hex;
        })
        .join("");
    }

    // Convert to RGB value
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);

    // Get YIQ ratio
    let yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Check contrast
    return yiq >= 128 ? "black" : "white";
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const postNewLog = (message) => {
    proyekRef.collection("logs").doc().set({
      message: message,
      by: user.nama,
      tanggal: moment().toDate(),
    });
  };

  const handleSubmitKategori = (data = "") => {
    if (formData.type == "edit") {
      _putKategoriPekerjaan();
    } else {
      _postKategoriPekerjaan();
    }
  };
  const _postKategoriPekerjaan = async () => {
    if (checkPermission("Buat_Kategori")) {
      setFormData({ ...formData, btnKategori: "loading" });
      const { data, error } = await postKategoriPekerjaan({
        nama: formData.namaKategori,
        mProyekId: formData.mProyekId,
        warna: formData.warna,
      });

      if (data) {
        const payload = {
          ...data?.kategori,
          urutan: kategori[kategori.length - 1].urutan + 1,
          pekerjaan: [],
        };
        postNewLog(`kategori pekerjaan ${formData.namaKategori} ditambahkan`);
        proyekRef
          .collection("kategori")
          .doc(`${data?.kategori?.id}`)
          .set(payload);
        setFormData({ ...formData, btnKategori: "success" });
        hideModal("modalBuatKategori");
        toast.success(data?.message);
      } else {
        setFormData({ ...formData, btnKategori: "error" });
        toast.error(error?.message);
      }
    } else {
      hideModal("modalBuatKategori");
      toast.error("Tidak Diizinkan");
    }
  };

  const _putKategoriPekerjaan = async () => {
    if (checkPermission("Edit_Kategori")) {
      setFormData({ ...formData, btnKategori: "loading" });
      const { data, error } = await putKategoriPekerjaan(formData.kategori_id, {
        nama: formData.namaKategori,
        mProyekId: formData.mProyekId,
        warna: formData.warna,
      });

      if (data) {
        postNewLog(`kategori pekerjaan ${formData.namaKategori} diedit`);
        proyekRef.collection("kategori").doc(`${formData.kategori_id}`).update({
          nama: formData.namaKategori,
          warna: formData.warna,
        });
        setFormData({ ...formData, btnKategori: "success" });
        hideModal("modalBuatKategori");
        toast.success(data?.message);
      } else {
        setFormData({ ...formData, btnKategori: "error" });
        toast.error(error?.message);
      }
    } else {
      hideModal("modalBuatKategori");
      toast.error("Tidak Diizinkan");
    }
  };

  const postLogPekerjaan = async (message, id) => {
    const payload = {
      by: user,
      message,
      createdAt: moment().toDate(),
    };
    await proyekRef
      .collection("pekerjaan")
      .doc(`${id}`)
      .collection("logs")
      .add(payload);
  };

  const handleSubmitDitugaskan = () => {};

  const handleDetailKategori = () => {
    if (formData.type == "update") {
      _putPekerjaanProyek();
    } else {
      _postPekerjaanProyek();
    }
  };
  const _postPekerjaanProyek = async () => {
    if (checkPermission("Buat_Pekerjaan")) {
      setFormData({ ...formData, btnKategori: "loading" });
      const batasWaktu =
        formData.batas_waktu !== "" ? moment(formData.batas_waktu) : moment();
      const { data, error } = await postPekerjaanProyek(
        {
          judul: formData.judul,
          prioritas: formData.prioritas,
          status: formData.status,
          batas_waktu: moment(batasWaktu).format("YYYY-MM-DD HH:mm:ss"),
          deskripsi: formData.deskripsi,
          urutan: formData.urutan,
        },
        formData.kategori_id
      );

      if (data) {
        const index = kategori?.findIndex(
          (d) => d.id === parseInt(data?.pekerjaan?.mKategoriPekerjaanId)
        );
        const payload = [...kategori[index]?.pekerjaan, data?.pekerjaan?.id];
        postNewLog(`pekerjaan ${formData.judul} ditambahkan`);
        proyekRef
          .collection("pekerjaan")
          .doc(`${data?.pekerjaan?.id}`)
          .set({
            ...data?.pekerjaan,
            batas_waktu: moment(batasWaktu).format("YYYY-MM-DD HH:mm:ss"),
            lampiran: JSON.stringify(formData.lampiran),
            anggota: JSON.stringify(formData.anggota),
            jobdesk: JSON.stringify(formData.jobdesk),
          });
        postLogPekerjaan(
          `Pekerjaan "${data?.pekerjaan?.judul}" dibuat`,
          data?.pekerjaan?.id
        );
        proyekRef
          .collection("kategori")
          .doc(`${data?.pekerjaan.mKategoriPekerjaanId}`)
          .update({ pekerjaan: payload });
        setFormData({ ...initialStateForm, btnKategori: "success" });
        hideModal("modalDetailKategori");
        toast.success(data?.message);
      } else {
        setFormData({ ...formData, btnKategori: "error" });
        toast.error(error?.message);
      }
    } else {
      hideModal("modalDetailKategori");
      toast.error("Tidak Diizinkan");
    }
  };

  const _putPekerjaanProyek = async () => {
    if (checkPermission("Edit_Pekerjaan")) {
      const { data, error } = await putPekerjaanProyek(
        {
          judul: formData.judul,
          prioritas: formData.prioritas,
          status: formData.status,
          batas_waktu: moment(formData.batas_waktu).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          deskripsi: formData.deskripsi,
          m_kategori_pekerjaan_id: formData.kategori_id,
          urutan: formData.urutan,
        },
        formData.pekerjaan_id
      );

      if (data) {
        postNewLog(`pekerjaan ${formData.judul} diubah`);
        if (formData.hasOwnProperty("before")) {
          Object.keys(formData.before).map((d) => {
            if (
              [
                "batas_waktu",
                "prioritas",
                "status",
                "deskripsi",
                "judul",
              ].includes(d)
            ) {
              if (d == "batas_waktu") {
                postLogPekerjaan(`batas waktu baru ditambahkan`, formData?.id);
              } else {
                postLogPekerjaan(
                  `${d} pekerjaan diubah menjadi "${formData.before[d]}"`,
                  formData?.id
                );
              }
            } else {
              if (d == "lampiran") {
                formData.before.lampiran.map((d) => {
                  postLogPekerjaan(
                    `Dokumen Baru Ditambahkan Dengan Judul "${d
                      .split("?")[0]
                      ?.replace(
                        "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/",
                        ""
                      )}"`,
                    formData?.id
                  );
                });
              }
            }
          });
        }
        proyekRef
          .collection("pekerjaan")
          .doc(`${formData.pekerjaan_id}`)
          .update({
            judul: formData.judul,
            prioritas: formData.prioritas,
            status: formData.status,
            batas_waktu: moment(formData.batas_waktu).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            deskripsi: formData.deskripsi,
            lampiran: JSON.stringify(formData.lampiran),
            anggota: JSON.stringify(formData.anggota),
            jobdesk: JSON.stringify(formData.jobdesk),
          });
        setFormData({ ...initialStateForm, btnKategori: "success" });
        hideModal("modalDetailKategori");
        toast.success(data?.message);
      } else {
        setFormData({ ...formData, btnKategori: "error" });
        toast.error(error?.message);
      }
    } else {
      hideModal("modalDetailKategori");
      toast.error("Tidak Diizinkan");
    }
  };

  useEffect(() => {
    getAnggota();
    _detailProyek();
  }, []);

  useEffect(() => {
    if (isAnggota || parseInt(detail?.privasi) === 0) {
      getLogs();
      getRoles();
      getJobdesk();
      _getKategoriPekerjaan();
      _getForumPostingan();
    }
  }, [isAnggota, detail]);

  useEffect(() => {
    const me = anggota?.find((d) => d?.user?.id == user.id);
    if (me) {
      setIsAnggota(1);
      setMyRole(me.role.role);
    } else {
      setIsAnggota(0);
    }
  }, [anggota, user]);

  const ProyekLayout = ({ children }) => {
    // const tugasLength = timelineData?.timeline?.filter(
    //   (data) => data.tipe === "tugas" && !data.dikumpulkan
    // )?.length;
    // const pertemuanLength = timelineData?.timeline?.filter(
    //   (data) => data.tipe === "absen" && !data.waktuAbsen
    // )?.length;

    const navMenus = [
      {
        href: `${ssURL}/proyek/[id]?nav=ruang-kerja`,
        as: `${ssURL}/proyek/${id}?nav=ruang-kerja`,
        text: "Ruang Kerja",
        active: nav == "ruang-kerja" || !nav,
        isVisible: true,
        dataJoyride: "ruang-kerja",
      },
      {
        href: `${ssURL}/proyek/[id]?nav=forum`,
        as: `${ssURL}/proyek/${id}?nav=forum`,
        text: "Forum",
        active: nav == "forum",
        isVisible: true,
        dataJoyride: "forum",
      },
      {
        href: `${ssURL}/proyek/[id]?nav=tentang`,
        as: `${ssURL}/proyek/${id}?nav=tentang`,
        text: "Tentang",
        active: nav == "tentang",
        isVisible: true,
        dataJoyride: "tentang",
      },
    ];
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <div
              className={`${
                user?.role == "guru" && "d-flex justify-content-between"
              }`}
            >
              <Link href={`${ssURL}/${isAnggota ? "proyek-saya" : "proyek"}`}>
                <a className="text-decoration-none fw-bolder color-primary">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>

            <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mt-3 mb-4 card-proyek">
              <img
                src={
                  detail?.banner
                    ? detail?.banner
                    : "https://picsum.photos/1920/1080"
                }
                className="card-img-top card-header-ss img-fit-cover bg-detail-proyek-kolaborasi mb-lg-0 mb-3"
              />
              <div className="card-img-overlay p-lg-4 px-3 pt-4">
                <span
                  className={`rounded-pill px-4 py-1 fs-12-ss fw-semibold mb-3`}
                  style={{
                    backgroundColor: detail?.warnaStatus
                      ? detail?.warnaStatus
                      : "#80849c",
                    color: getContrast(
                      detail?.warnaStatus ? detail?.warnaStatus : "#80849c"
                    ),
                  }}
                >
                  {detail?.status
                    ? detail?.status
                    : "Dalam Tahap Perencanaan Produk"}
                </span>
                <div className="card-kelas-name text-white mt-3">
                  <h2 className="mb-2 fw-black">{detail?.nama}</h2>
                </div>
                <div className="d-flex align-items-center text-white">
                  <div className="d-flex align-items-center me-5">
                    <FaGlobeAmericas className="me-2" />
                    <h6 className="mb-0 fw-semibold">
                      {parseInt(detail?.privasi)
                        ? "Proyek Privat"
                        : "Proyek Publik"}
                    </h6>
                  </div>

                  {/* If Privasi == Privat */}

                  {/* <div className="d-flex align-items-center me-5">
                    <FaLock className="me-2" />
                    <h6 className="mb-0 fw-semibold">Proyek Publik</h6>
                  </div> */}

                  <div className="d-flex align-items-center">
                    <FaUsers className="me-2 fs-5" />
                    <h6 className="mb-0 fw-semibold">
                      {anggota?.length} Anggota
                    </h6>
                  </div>
                </div>
              </div>
              <div className="card-footer card-footer-ss card-kelas-footer py-lg-3 py-0 px-lg-3 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch">
                <div className="kelas-nav d-flex flex-column flex-lg-row">
                  {navMenus.map((d) => {
                    return (
                      d.isVisible && (
                        <Link href={d.href} as={d.as}>
                          <a
                            className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                              d.active ? "color-primary" : "color-secondary"
                            }`}
                            data-joyride={d.dataJoyride || ""}
                          >
                            {d?.withBadge?.show && (
                              <Badge
                                count={parseInt(d?.withBadge?.text)}
                                className="position-absolute"
                                style={{ top: "-18px", right: "-40px" }}
                              />
                            )}
                            {d.text}
                          </a>
                        </Link>
                      )
                    );
                  })}
                </div>
                <div className="card-header-button d-flex flex-lg-row flex-column">
                  <div className="button-items d-flex flex-column">
                    <a
                      href="https://chat.whatsapp.com/KDMx875yz511IUjDcI5IIy"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-14-ss fw-bolder py-1 px-3 mb-3 mb-lg-0 mx-2 me-lg-4"
                      data-joyride="grup-kelas"
                    >
                      <FaWhatsapp className="fs-5" />
                      <span className="ms-2">Grup Whatsapp</span>
                    </a>
                  </div>
                  {isAnggota ? (
                    anggota?.find((d) => d?.user?.id == user.id)?.role.role ==
                      "Pemilik" ||
                    roles.find(
                      (role) =>
                        role.label ==
                        anggota?.find((d) => d?.user?.id == user.id)?.role.role
                    )?.permissions.Undang_Anggota ? (
                      <Link
                        href={`${ssURL}/proyek/[id]/undang-anggota`}
                        as={`${ssURL}/proyek/${id}/undang-anggota`}
                      >
                        <a className="text-decoration-none d-flex flex-column">
                          <button
                            className="btn btn-ss rounded-pill btn-primary-ss fs-14-ss fw-bolder py-1 px-3 mb-3 mb-lg-0 mx-2 mx-lg-0 mt-lg-0 mt-3"
                            data-joyride="grup-kelas"
                          >
                            <FaPlus />
                            <span className="ms-2">Undang Anggota</span>
                          </button>
                        </a>
                      </Link>
                    ) : (
                      ""
                    )
                  ) : (
                    <a className="text-decoration-none d-flex flex-column">
                      <button
                        className="btn btn-ss rounded-pill btn-primary-ss fs-14-ss fw-bolder py-1 px-3 mb-3 mb-lg-0 mx-2 mx-lg-0 mt-lg-0 mt-3"
                        data-joyride="grup-kelas"
                        onClick={() => {
                          gabungProyek();
                        }}
                        disabled={
                          request?.find((d) => d?.user?.id == user.id) ||
                          anggota?.find((d) => d?.user?.id == user.id)
                            ? 1
                            : 0
                        }
                      >
                        <FaPlus />
                        <span className="ms-2">Gabung Proyek</span>
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </>
    );
  };

  const steps = [];

  if (user?.role == "guru") {
    steps.push({
      target: '[data-joyride="kelas-info"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Informasi kelas</h5>
          <p className="color-secondary fw-semibold">
            Klik tombol ini, untuk melihat informasi dari kelas anda. Disini
            anda bisa melihat siapa saja anggota dari kelas anda dan informasi
            dari setiap anggota kelas anda.
          </p>
        </div>
      ),
      disableBeacon: true,
    });
  }

  return (
    <Layout>
      <MyJoyride steps={steps} />
      <AnimatePage>
        <ProyekLayout>
          {isAnggota || parseInt(detail?.privasi) === 0 ? (
            <>
              {(!nav || nav == "ruang-kerja") && (
                <>
                  <RuangKerjaPage
                    id={id}
                    roles={roles}
                    isAnggota={isAnggota}
                    jobs={jobs}
                    anggota={anggota}
                    kategori={kategori}
                    pekerjaan={pekerjaan}
                    myRole={myRole}
                    checkPermission={checkPermission}
                    // formData={formData}
                    setFormData={setFormData}
                    handleChangeForm={handleChangeForm}
                  />
                </>
              )}
              {nav == "tentang" && (
                <TentangPage
                  subnav={subnav}
                  detail={detail}
                  anggota={anggota}
                  logs={logs}
                  roles={roles}
                  jobs={jobs}
                  postRoles={postRoles}
                  putRole={putRole}
                  isAnggota={isAnggota}
                  request={request}
                  checkPermission={checkPermission}
                  handleSubmitJobdesk={handleSubmitJobdesk}
                />
              )}
              {nav == "forum" && (
                <ForumPage
                  id={id}
                  anggota={anggota}
                  roles={roles}
                  isAnggota={isAnggota}
                  jobs={jobs}
                  forum={forum}
                  checkPermission={checkPermission}
                />
              )}
            </>
          ) : (
            <>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img
                  src="/img/proyek-privasi.png"
                  alt="icon-privat"
                  srcset=""
                  height={230}
                />
                <h2 className="fw-black color-dark">
                  Proyek ini Bersifat Privat
                </h2>
                <p className="fw-semibold">
                  Gabung ke proyek ini untuk melihat aktivitas atau
                  berpartisipasi dalam proyek
                </p>
              </div>
            </>
          )}
        </ProyekLayout>
        <ModalKategori
          handleChangeForm={handleChangeForm}
          formData={formData}
          _postKategoriPekerjaan={handleSubmitKategori}
        />
        <ModalDetailKategori
          formData={formData}
          handleChangeForm={handleChangeForm}
          handleSubmit={handleDetailKategori}
          setFormData={setFormData}
          user={user}
          jobs={jobs}
          anggota={anggota}
          proyekRef={proyekRef}
        />
        <ModalDitugaskan
          formData={formData}
          handleChangeFormCheck={handleChangeForm}
          handleSubmit={handleSubmitDitugaskan}
          jobs={jobs}
          anggota={anggota}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { rombel_id, nav, subnav },
}) {
  return {
    props: {
      id,
      rombel_id: rombel_id || null,
      nav: nav || null,
      subnav: subnav || null,
    },
  };
}

export default index;
