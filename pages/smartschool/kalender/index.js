import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import SidebarTabMenu from "../../../components/Shared/SidebarTabMenu/SidebarTabMenu";
import useUser from "../../../hooks/useUser";
import { FaPlus } from "react-icons/fa";
import CalendarComponent from "../../../components/Shared/CalendarComponent/CalendarComponent";
import ModalBuatKalenderPendidikan from "../../../components/Kalender/ModalBuatKalenderPendidikan";
import ModalBuatKegiatan from "../../../components/Kalender/ModalBuatKegiatan";
import ModalBuatLabelKalender from "../../../components/Kalender/ModalBuatLabelKalender";
import {
  deleteKalenderLabel,
  getKalenderData,
  getKalenderLabel,
} from "../../../client/KalenderClient";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { momentPackage } from "../../../utilities/HelperUtils";
import ModalDetailPendidikan from "../../../components/Kalender/ModalDetailPendidikan";
import ModalDetailKegiatan from "../../../components/Kalender/ModalDetailKegiatan";

const months = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

const PageKalender = () => {
  const { user } = useUser();

  const router = useRouter();
  const label = router.query.label;

  const [activeMenuIndex, setActiveMenuIndex] = useState(0);

  const [editKalenderData, setEditKalenderData] = useState(null);

  const [editData, setEditData] = useState(null);
  const [editDataPendidikan, setEditDataPendidikan] = useState(null);
  const [kalender, setKalender] = useState({});
  const { label: kalenderLabel } = kalender;

  const [calendarEvents, setCalendarEvents] = useState([]);

  const [currentDate, setCurrentDate] = useState(
    momentPackage().format("YYYY-MM")
  );

  const [eventClickedData, setEventClickedData] = useState(null);

  const listMenu =
    kalenderLabel?.length > 0
      ? kalenderLabel?.map((dt, index) => ({
          data: dt,
          url: `${ssURL}/kalender?label=${dt?.nama}`,
          nama: (
            <div className="d-flex align-items-center text-overflow-ellipsis overflow-hidden">
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: dt?.warna,
                  borderRadius: "50%",
                }}
              />
              <span className="ms-3 text-truncate">{dt?.nama}</span>
            </div>
          ),
        }))
      : [];

  const _getKalenderData = async () => {
    let query = { tanggal: currentDate };
    const { data } = await getKalenderData(query);
    if (data) {
      setKalender(data);

      const eventsDataKegiatan = data?.kegiatan?.map((dt) => ({
        title: dt?.nama,
        start:
          momentPackage(dt?.tanggalMulai).format("YYYY-MM-DD") ||
          momentPackage(dt?.tanggalAwal).format("YYYY-MM-DD"),
        end: momentPackage(dt?.tanggalAkhir)
          .add(1, "days")
          .format("YYYY-MM-DD"),
        id: dt?.id,
        isKegiatanEvent: true,
        isPendidikanEvent: false,
        color: dt?.label?.warna,
      }));

      const eventsDataPendidikan = data?.pendidikan?.map((dt) => ({
        title: dt?.nama,
        start:
          momentPackage(dt?.tanggalMulai).format("YYYY-MM-DD") ||
          momentPackage(dt?.tanggalAwal).format("YYYY-MM-DD"),
        end: momentPackage(dt?.tanggalAkhir)
          .add(1, "days")
          .format("YYYY-MM-DD"),
        id: dt?.id,
        isKegiatanEvent: false,
        isPendidikanEvent: true,
        color: dt?.label?.warna,
      }));

      const allEvents = [...eventsDataKegiatan, ...eventsDataPendidikan];

      setCalendarEvents(allEvents);
    }
  };

  const handleDeleteLabel = async (id) => {
    const { data } = await deleteKalenderLabel(id);
    if (data) {
      toast.success(data?.message);
      _getKalenderData();
      router.push(
        {
          pathname: `${ssURL}/kalender`,
          query: { label: listMenu[listMenu.length - 2].data.nama },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const onClickCalendar = (e) => {
    setEventClickedData({ id: e.event._def.publicId });
    const modalId = e.event._def.extendedProps.isPendidikanEvent
      ? "ModalDetailPendidikan"
      : "ModalDetailKegiatan";
    const modal = document.getElementById(modalId);
    new bootstrap.Modal(modal).show();
  };

  const handleDomCharacterDataModified = (event) => {
    const strDate = event?.newValue;

    const yearNumber = strDate.replace(/\D/g, "");
    const monthString = strDate.replace(/[^a-z]/gi, "");
    const monthNumber = months[monthString];

    if (!strDate.includes("–")) {
      setCurrentDate(`${yearNumber}-${monthNumber}`);
    }
  };

  useEffect(() => {
    const fcToolbarTitle = document.querySelector(".fc-toolbar-title");

    fcToolbarTitle.addEventListener(
      "DOMCharacterDataModified",
      handleDomCharacterDataModified,
      false
    );

    return () => {
      fcToolbarTitle.removeEventListener(
        "keydown",
        handleDomCharacterDataModified,
        false
      );
    };
  }, []);

  useEffect(() => {
    _getKalenderData();
  }, [currentDate]);

  // find active menu
  useEffect(() => {
    if (label) {
      const index = listMenu.findIndex((menu) => menu.url.includes(label));
      setActiveMenuIndex(index === -1 ? 0 : index);
    }
  }, [label]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <SidebarTabMenu
            listMenu={listMenu}
            activeMenuIndex={activeMenuIndex}
            withHeader={{
              text: "Label Kalender",
              dataBsTarget: "#ModalBuatLabelKalender",
              onClick: () => setEditKalenderData(null),
            }}
            withDropdown={{
              onClickEdit: (data) => setEditKalenderData(data),
              onClickDelete: (data) => handleDeleteLabel(data?.data?.id),
              dataBsTarget: "ModalBuatLabelKalender",
            }}
          />
          <div className="col-md-12 col-lg-9">
            <div className="px-3 py-2 bg-white shadow-dark-ss rounded-ss mb-4">
              <div style={{ display: "grid" }} className="dropdown dropdown-ss">
                <button
                  className="btn btn-primary bg-gradient-primary shadow-primary-ss fw-bold py-3 rounded-pill btn-ss"
                  aria-expanded="false"
                  style={{ justifySelf: "flex-end" }}
                  role="button"
                  id="dropdownBuatKalender"
                  data-bs-toggle="dropdown"
                  // aria-expanded="false"
                >
                  <FaPlus className="me-2" />
                  Buat
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1"
                  aria-labelledby="dropdownBuatKalender"
                >
                  <li className="d-flex align-items-center">
                    <a
                      className="dropdown-item color-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalBuatKalenderPendidikan"
                    >
                      Kalender Pendidikan
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item color-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalBuatKegiatan"
                    >
                      Kegiatan
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-3 py-4 bg-white shadow-dark-ss rounded-ss">
              <CalendarComponent
                events={calendarEvents}
                currentDate={currentDate}
                onClick={onClickCalendar}
              />
            </div>
          </div>
        </div>
      </AnimatePage>
      <ModalBuatKalenderPendidikan
        _getKalenderData={_getKalenderData}
        editData={editDataPendidikan}
      />
      <ModalBuatKegiatan
        _getKalenderData={_getKalenderData}
        editData={editData}
      />
      <ModalBuatLabelKalender
        _getKalenderData={_getKalenderData}
        editKalenderData={editKalenderData}
      />
      <ModalDetailPendidikan
        _getKalenderData={_getKalenderData}
        id={eventClickedData?.id}
        editDataPendidikan={editDataPendidikan}
        setEditDataPendidikan={setEditDataPendidikan}
      />
      <ModalDetailKegiatan
        _getKalenderData={_getKalenderData}
        id={eventClickedData?.id}
        editData={editData}
        setEditData={setEditData}
      />
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(PageKalender), {
  ssr: false,
});
