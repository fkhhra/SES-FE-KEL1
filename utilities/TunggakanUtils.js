import { currencyFormatter } from "./HelperUtils";

export const getJumlahBulan = (data = []) => {
  const temp = [];
  return data?.filter((d) => {
    if (
      d?.rombelPembayaran?.pembayaran?.jenis == "spp" &&
      !temp.includes(d?.rombelPembayaran?.pembayaran?.id)
    ) {
      temp.push(d?.rombelPembayaran?.pembayaran?.id);
      return 1;
    }
  }).length;
};

export const getTotalTagihanSPP = (data = []) => {
  return data
    ?.filter(
      (d) =>
        d?.rombelPembayaran?.pembayaran?.jenis == "spp" &&
        d?.rombelPembayaran?.pembayaran?.dihapus == 0
    )
    .reduce((a, b) => {
      return parseInt(a) + parseInt(b?.rombelPembayaran?.pembayaran?.nominal);
    }, 0);
};

export const getTotalDibayar = (data = [], jenis) => {
  let totalDibayar = 0;
  data
    ?.filter(
      (d) =>
        d?.rombelPembayaran?.pembayaran?.jenis == jenis &&
        d?.rombelPembayaran?.pembayaran?.dihapus == 0
    )
    .map((c) => {
      totalDibayar =
        totalDibayar +
        c?.riwayat?.reduce((a, b) => {
          return parseInt(a) + parseInt(b?.nominal);
        }, 0);

      return totalDibayar;
    }, 0);
  if (totalDibayar == NaN || !totalDibayar) {
    totalDibayar = 0;
  }
  console.log(totalDibayar);
  return totalDibayar;
};

export const getTunggakanUjian = (data = []) => {
  return (
    <>
      {data
        ?.filter((d) => d?.rombelPembayaran?.pembayaran?.jenis == "ujian")
        ?.map((d) => {
          const totalDibayar = d?.riwayat?.reduce((a, b) => {
            return parseInt(a) + parseInt(b?.nominal);
          }, 0);
          return (
            <li>
              {d?.rombelPembayaran?.pembayaran?.tipeUjian?.toUpperCase()} :{" "}
              <span className="fw-bold">
                {currencyFormatter(
                  d?.rombelPembayaran?.pembayaran?.nominal - totalDibayar
                )}
              </span>
            </li>
          );
        })}
    </>
  );
};

export const getTunggakanLainnya = (data = []) => {
  return (
    <>
      {data
        ?.filter((d) => d?.rombelPembayaran?.pembayaran?.jenis == "lainnya")
        ?.map((d) => {
          const totalDibayar = d?.riwayat?.reduce((a, b) => {
            return parseInt(a) + parseInt(b?.nominal);
          }, 0);
          return (
            <li>
              {d?.rombelPembayaran?.pembayaran?.nama} :{" "}
              <span className="fw-bold">
                {currencyFormatter(
                  d?.rombelPembayaran?.pembayaran?.nominal - totalDibayar
                )}
              </span>
            </li>
          );
        })}
    </>
  );
};

export const getTotalTunggakan = (data = []) => {
  return data
    ?.filter((d) => d?.rombelPembayaran?.pembayaran?.dihapus == 0)
    .reduce((a, b) => {
      return parseInt(a) + parseInt(b?.rombelPembayaran?.pembayaran?.nominal);
    }, 0);
};

export const getTotalDibayarSemua = (data = []) => {
  let totalDibayar = 0;
  data
    ?.filter((d) => d?.rombelPembayaran?.pembayaran?.dihapus == 0)
    .map((a) => {
      totalDibayar =
        totalDibayar +
        a?.riwayat?.reduce((a, b) => {
          return parseInt(a) + parseInt(b?.nominal);
        }, 0);
    }, 0);

  return totalDibayar;
};
