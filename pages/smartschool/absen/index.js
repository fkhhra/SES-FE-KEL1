import { useEffect, useState } from "react";
import { detailAbsen } from "../../../client/AbsenClient";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import CalendarComponent from "../../../components/Shared/CalendarComponent/CalendarComponent";

const index = () => {
  const [detailAbsenData, setDetailAbsenData] = useState([]);

  const getDetailAbsenData = async () => {
    const { data } = await detailAbsen();
    if (data) {
      const absenData = await Promise.all(
        data.absen?.reduce((t, d) => {
          t.push(
            {
              id: d.id,
              start: d.createdAt,
              className: "bg-success text-white",
              color: "white",
            },
            {
              id: d.id,
              start: d.waktuPulang,
              className: "bg-danger text-white",
              color: "white",
            }
          );
          return t;
        }, [])
      );
      setDetailAbsenData(absenData);
    }
  };

  const handleClick = (e) => {};

  useEffect(() => {
    getDetailAbsenData();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        {detailAbsenData.length ? (
          <CalendarComponent events={detailAbsenData} onClick={handleClick} />
        ) : null}
      </AnimatePage>
    </Layout>
  );
};

export default index;
