import { FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";

export const checkLabelLulus = (data) => {
  switch (data) {
    case "lulus":
      return `label-ss rounded-pill bg-soft-success color-success fs-12-ss fw-semibold text-capitalize`;
    default:
      return `label-ss rounded-pill bg-soft-danger color-danger fs-12-ss fw-semibold text-capitalize`;
  }
};

export const checkKeteranganSikap = (data, sikap) => {
  let dataSikap = [];
  if (data?.length > 1) {
    var dataId = data.split(",");
  } else if (data?.length == 1) {
    var dataId = data;
  }
  for (let i = 0; i < sikap?.length; i++) {
    for (let d = 0; d < dataId.length; d++) {
      if (sikap[i].id == dataId[d]) {
        dataSikap.push(sikap[i].sikap);
      }
    }
  }
  return dataSikap.join(", ");
};

export const checkPredikatKeterampilan = (data, predikat) => {
  for (let i = 0; i < predikat?.length; i++) {
    if (
      data >= predikat[i].bbKeterampilan &&
      data <= predikat[i].baKeterampilan
    ) {
      return predikat[i].predikat;
    }
  }
};

export const checkPredikatPengetahuan = (data, predikat) => {
  for (let i = 0; i < predikat?.length; i++) {
    if (
      data >= predikat[i].bbPengetahuan &&
      data <= predikat[i].baPengetahuan
    ) {
      return predikat[i].predikat;
    }
  }
};

export const checkStatusTuntas = (nilai, kkm) => {
  if (nilai >= kkm) {
    return "Sudah Tuntas";
  } else if (nilai < kkm) {
    return "Belum Tuntas";
  } else {
    return "Belum Dinilai";
  }
};

const jumlahDibawah = (data, jenisRapor, listKKM, siswa) => {
  const nilaiSemuaUjian1 = data?.user?.nilaiSemuaUjian?.filter((d) =>
    listKKM?.find((e) => e?.mMataPelajaranId == d?.mapel?.id)
  );
  const janganUlangmapel = [];
  const nilaiSemuaUjian = nilaiSemuaUjian1.filter((d) => {
    if (
      !janganUlangmapel.find((e) => e.mMataPelajaranId == d.mMataPelajaranId)
    ) {
      janganUlangmapel.push(d);
      return true;
    } else {
      return false;
    }
  });
  const filtered = filterRanking(nilaiSemuaUjian, data?.siswa);
  return (
    filtered?.filter((item) => {
      const nilai =
        !jenisRapor || jenisRapor == "tengahSemester"
          ? item?.nilaiUts
          : item?.nilai;
      if (nilai == null) {
        return false;
      } else {
        if (
          nilai <
          listKKM.find((kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId)
            ?.kkm
        ) {
          return true;
        } else {
          return false;
        }
      }
    })?.length +
    filtered?.filter((item) => {
      const nilai =
        !jenisRapor || jenisRapor == "tengahSemester"
          ? item?.nilaiKeterampilanUts
          : item?.nilaiKeterampilanUt;
      if (nilai == null) {
        return false;
      } else {
        if (
          nilai <
          listKKM.find((kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId)
            ?.kkm2
        ) {
          return true;
        } else {
          return false;
        }
      }
    })?.length
  );
};

export const checkStatusTuntasWalas = (
  data,
  listKKM,
  totalMapel,
  jenisRapor,
  siswa
) => {
  if (
    data?.user?.meta?.jumlahMapelDikerjakan < totalMapel &&
    data?.user?.meta?.jumlahMapelDikerjakan != 0
  ) {
    return "Sedang Dinilai";
  }

  if (data?.user?.nilaiSemuaUjian?.length > 0) {
    const totalDibawah = jumlahDibawah(data, jenisRapor, listKKM, siswa);

    if (totalDibawah == 0) {
      return "Sudah Tuntas";
    } else {
      return "Belum Tuntas";
    }
  } else {
    return "Belum Dinilai";
  }
};

export const checkLabelStatusTuntas = (nilai, kkm) => {
  if (nilai >= kkm) {
    return "label-ss bg-soft-success rounded-pill color-success fs-12-ss fw-semibold py-1 px-3";
  } else if (nilai < kkm) {
    return "label-ss bg-soft-danger rounded-pill color-danger fs-12-ss fw-semibold py-1 px-3";
  } else {
    return "label-ss bg-soft-secondary rounded-pill color-secondary fs-12-ss fw-semibold py-1 px-3";
  }
};

export const checkLabelStatusTuntasWalas = (
  data,
  listKKM,
  totalMapel,
  jenisRapor,
  siswa
) => {
  if (
    data?.user?.meta?.jumlahMapelDikerjakan < totalMapel &&
    data?.user?.meta?.jumlahMapelDikerjakan != 0
  ) {
    return "label-ss bg-soft-warning rounded-pill color-warning fs-12-ss fw-semibold py-1 px-3";
  }
  if (data?.user?.nilaiSemuaUjian?.length > 0) {
    const totalDibawah = jumlahDibawah(data, jenisRapor, listKKM, siswa);

    if (totalDibawah == 0) {
      return "label-ss bg-soft-success rounded-pill color-success fs-12-ss fw-semibold py-1 px-3";
    } else {
      return "label-ss bg-soft-danger rounded-pill color-danger fs-12-ss fw-semibold py-1 px-3";
    }
  } else {
    return "label-ss bg-soft-secondary rounded-pill color-secondary fs-12-ss fw-semibold py-1 px-3";
  }
};

export const checkLabelStatusTuntasRaporWalas = (
  data,
  listKKM,
  totalMapel,
  jenisRapor,
  siswa
) => {
  if (
    data?.user?.meta?.jumlahMapelDikerjakan < totalMapel &&
    data?.user?.meta?.jumlahMapelDikerjakan != 0
  ) {
    return "color-warning fs-14-ss fw-bold ms-2";
  }

  if (data?.user?.nilaiSemuaUjian?.length > 0) {
    const totalDibawah = jumlahDibawah(data, jenisRapor, listKKM, siswa);

    if (totalDibawah == 0) {
      return "color-success fs-14-ss fw-bold ms-2";
    } else {
      return "color-danger fs-14-ss fw-bold ms-2";
    }
  } else {
    return "color-secondary fs-14-ss fw-bold ms-2";
  }
};

export const jumlahNilaiDibawah = (data, listKKM, siswa, jenisRapor) => {
  const nilaiSemuaUjian1 = data?.user?.nilaiSemuaUjian?.filter((d) =>
    listKKM?.find((e) => e?.mMataPelajaranId == d?.mapel?.id)
  );
  const janganUlangmapel = [];
  const nilaiSemuaUjian = nilaiSemuaUjian1.filter((d) => {
    if (
      !janganUlangmapel.find((e) => e.mMataPelajaranId == d.mMataPelajaranId)
    ) {
      janganUlangmapel.push(d);
      return true;
    } else {
      return false;
    }
  });
  const filtered = filterRanking(nilaiSemuaUjian, siswa);
  if (data?.user?.nilaiSemuaUjian?.length > 0) {
    const totalDibawah =
      filtered.filter((item) => {
        const nilai =
          !jenisRapor || jenisRapor == "tengahSemester"
            ? item?.nilaiUts
            : item?.nilai;
        if (nilai == null) {
          return false;
        } else {
          if (
            nilai <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length +
      filtered.filter((item) => {
        const nilai =
          !jenisRapor || jenisRapor == "tengahSemester"
            ? item?.nilaiKeterampilanUts
            : item?.nilaiKeterampilan;
        if (nilai == null) {
          return false;
        } else {
          if (
            nilai <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm2
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length;
    return `${totalDibawah} Nilai`;
  } else {
    return;
  }
};

export const checkStatusLihatRapor = (
  data,
  listKKM,
  totalMapel,
  jenisRapor,
  siswa
) => {
  if (
    data?.user?.meta?.jumlahMapelDikerjakan < totalMapel &&
    data?.user?.meta?.jumlahMapelDikerjakan != 0
  ) {
    return "Sedang Dikerjakan";
  }
  const janganUlangmapel = [];
  const nilaiSemuaUjian = data?.user?.nilaiSemuaUjian.filter((d) => {
    if (
      !janganUlangmapel.find((e) => e.mMataPelajaranId == d.mMataPelajaranId)
    ) {
      janganUlangmapel.push(d);
      return true;
    } else {
      return false;
    }
  });

  if (data?.user?.nilaiSemuaUjian?.length > 0) {
    const totalDibawah =
      filterAgama(nilaiSemuaUjian, siswa)?.filter((item) => {
        const nilai =
          !jenisRapor || jenisRapor == "tengahSemester"
            ? item?.nilaiUts
            : item?.nilai;
        if (nilai == null) {
          return false;
        } else {
          if (
            nilai <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length +
      filterAgama(nilaiSemuaUjian, siswa)?.filter((item) => {
        const nilai =
          !jenisRapor || jenisRapor == "tengahSemester"
            ? item?.nilaiKeterampilanUts
            : item?.nilaiKeterampilan;
        if (nilai == null) {
          return false;
        } else {
          if (
            nilai <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm2
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length;
    if (totalDibawah == 0) {
      return "Sudah Tuntas";
    } else {
      return "Belum Tuntas";
    }
  } else {
    return "Menunggu";
  }
};

export const checkIconLihatRapor = (data, listKKM, totalMapel) => {
  if (
    data?.user?.meta?.jumlahMapelDikerjakan < totalMapel &&
    data?.user?.meta?.jumlahMapelDikerjakan != 0
  ) {
    return <FaClock color="#F9AC50" className="fs-5" />;
  }
  const nilaiSemuaUjian1 = data?.user?.nilaiSemuaUjian?.filter((d) =>
    listKKM?.find((e) => e?.mMataPelajaranId == d?.mapel?.id)
  );
  const janganUlangmapel = [];
  const nilaiSemuaUjian = nilaiSemuaUjian1.filter((d) => {
    if (
      !janganUlangmapel.find((e) => e.mMataPelajaranId == d.mMataPelajaranId)
    ) {
      janganUlangmapel.push(d);
      return true;
    } else {
      return false;
    }
  });
  const filtered = filterRanking(nilaiSemuaUjian, data?.siswa);
  if (data?.user?.nilaiSemuaUjian?.length > 0) {
    const totalDibawah =
      filtered?.filter((item) => {
        if (item?.nilai == null) {
          return false;
        } else {
          if (
            item?.nilai <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length +
      filtered?.filter((item) => {
        if (item?.nilaiKeterampilan == null) {
          return false;
        } else {
          if (
            item?.nilaiKeterampilan <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm2
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length;
    if (totalDibawah == 0) {
      return <FaCheckCircle color="#2680EB" className="fs-5" />;
    } else {
      return <FaExclamationCircle color="#FC544B" className="fs-5" />;
    }
  } else {
    return <FaClock color="#80849C" className="fs-5" />;
  }
};

export const checkLabelStatusLihatRapor = (
  data,
  listKKM,
  totalMapel,
  jenisRapor,
  siswa
) => {
  if (
    data?.user?.meta?.jumlahMapelDikerjakan < totalMapel &&
    data?.user?.meta?.jumlahMapelDikerjakan != 0
  ) {
    return "color-warning rounded-pill fs-14-ss fw-bold ms-2";
  }
  const janganUlangmapel = [];
  const nilaiSemuaUjian = data?.user?.nilaiSemuaUjian?.filter((d) => {
    if (
      !janganUlangmapel.find((e) => e.mMataPelajaranId == d.mMataPelajaranId)
    ) {
      janganUlangmapel.push(d);
      return true;
    } else {
      return false;
    }
  });
  const filtered = filterRanking(nilaiSemuaUjian, data?.siswa);
  if (data?.user?.nilaiSemuaUjian?.length > 0) {
    const totalDibawah =
      filterAgama(filtered, siswa)?.filter((item) => {
        const nilai =
          !jenisRapor || jenisRapor == "tengahSemester"
            ? item?.nilaiUts
            : item?.nilai;
        if (nilai == null) {
          return false;
        } else {
          if (
            nilai <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length +
      filterAgama(filtered, siswa)?.filter((item) => {
        const nilai =
          !jenisRapor || jenisRapor == "tengahSemester"
            ? item?.nilaiKeterampilanUts
            : item?.nilaiKeterampilan;
        if (nilai == null) {
          return false;
        } else {
          if (
            nilai <
            listKKM.find(
              (kkm) => kkm.mMataPelajaranId == item?.mMataPelajaranId
            )?.kkm2
          ) {
            return true;
          } else {
            return false;
          }
        }
      })?.length;
    if (totalDibawah == 0) {
      return "color-primary rounded-pill fs-14-ss fw-bold ms-2";
    } else {
      return "color-danger rounded-pill fs-14-ss fw-bold ms-2";
    }
  } else {
    return "color-sceondary rounded-pill fs-14-ss fw-bold ms-2";
  }
};

export const checkLabelDibawahKKM = (
  keterampilan,
  pengetahuan,
  nilaiUjian,
  totalMapel,
  totalDikerjakan
) => {
  if (!nilaiUjian) {
    return "d-none";
  } else if (totalDikerjakan < totalMapel) {
    return "d-none";
  } else if (totalDikerjakan == totalMapel) {
    if (keterampilan + pengetahuan == 0) {
      return "label-ss bg-soft-success rounded-pill color-success fs-12-ss fw-semibold py-1 px-3";
    } else if (keterampilan + pengetahuan != 0) {
      return "label-ss bg-soft-danger rounded-pill color-danger fs-12-ss fw-semibold py-1 px-3";
    }
  }
};

export const checkDibawahKKM = (keterampilan, pengetahuan) => {
  if (keterampilan + pengetahuan == 0) {
    return "0";
  } else {
    return keterampilan + pengetahuan;
  }
};

export const ubahAngkaKeHuruf = (num) => {
  var ones = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
  ];
  var tens = [
    "",
    "",
    "dua puluh",
    "tiga puluh",
    "empat puluh",
    "lima puluh",
    "enam puluh",
    "tujuh puluh",
    "delapan puluh",
    "sembilan puluh",
  ];
  var teens = [
    "sepuluh",
    "sebelas",
    "dua belas",
    "tiga belas",
    "empat belas",
    "lima belas",
    "enam belas",
    "tujuh belas",
    "delapan belas",
    "sembilan belas",
  ];
  function convert_tens(num) {
    if (num < 10) return ones[num];
    else if (num >= 10 && num < 20) return teens[num - 10];
    else {
      return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    }
  }
  if (num > 99) {
    return ones[Math.floor(num / 100)] + " hundred " + convert_tens(num % 100);
  } else {
    return convert_tens(num);
  }
};

export const getDeskripsiPengetahuan = (
  mapel,
  predikat,
  rekapMaxPengetahuan,
  rekapMinPengetahuan
) => {
  const data = mapel?.mataPelajaran?.nilaiIndividu?.nilai;
  const template = mapel?.mataPelajaran?.templateDeskripsi;
  if (
    !mapel?.mataPelajaran?.nilaiIndividu?.nilai ||
    !predikat ||
    !rekapMaxPengetahuan ||
    !rekapMinPengetahuan
  ) {
    return "-";
  } else {
    for (let i = 0; i < predikat?.length; i++) {
      if (
        data >= predikat[i].bbPengetahuan &&
        data <= predikat[i].baPengetahuan
      ) {
        const deskripsi = template?.find(
          (item) =>
            item.predikat.predikat == predikat[i].predikat &&
            item.tipe == "Pengetahuan"
        );
        if (rekapMaxPengetahuan?.id == rekapMinPengetahuan?.id) {
          return `${deskripsi?.prolog} ${rekapMaxPengetahuan.judul}`;
        } else {
          return `${deskripsi?.prolog} ${rekapMaxPengetahuan.judul}. ${deskripsi?.epilog} ${rekapMinPengetahuan.judul}`;
        }
      }
    }
  }
};

export const getDeskripsiKeterampilan = (
  mapel,
  predikat,
  rekapMaxKeterampilan,
  rekapMinKeterampilan
) => {
  const data = mapel?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan;
  const template = mapel?.mataPelajaran?.templateDeskripsi;
  if (
    !mapel?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan ||
    !predikat ||
    !rekapMaxKeterampilan ||
    !rekapMinKeterampilan
  ) {
    return "-";
  } else {
    for (let i = 0; i < predikat?.length; i++) {
      if (
        data >= predikat[i]?.bbKeterampilan &&
        data <= predikat[i]?.baKeterampilan
      ) {
        const deskripsi = template?.find(
          (item) =>
            item?.predikat?.predikat == predikat[i]?.predikat &&
            item?.tipe == "Keterampilan"
        );
        if (rekapMaxKeterampilan?.id == rekapMinKeterampilan?.id) {
          return `${deskripsi?.prolog} ${rekapMaxKeterampilan?.judul}`;
        } else {
          return `${deskripsi?.prolog} ${rekapMaxKeterampilan?.judul}. ${deskripsi?.epilog} ${rekapMinKeterampilan?.judul}`;
        }
      }
    }
  }
};

export const getDeskripsiSikapSosial = (sikap, template, sikapsosial) => {
  if (!sikap) {
    return "Belum Dinilai";
  } else {
    const sikapDitunjukkan = sikapsosial?.filter(
      (d) =>
        sikap?.mSikapDitunjukkanId
          ?.split(",")
          .findIndex((item) => parseInt(item) == d.id) >= 0
    );
    const sikapDitingkatkan = sikapsosial?.filter(
      (d) =>
        sikap?.mSikapDitingkatkanId
          ?.split(",")
          .findIndex((item) => parseInt(item) == d.id) >= 0
    );
    const prolog = template?.find((item) => item.tipe == "Sikap")?.prolog;
    const epilog = template?.find((item) => item.tipe == "Sikap")?.epilog;
    return `${
      sikapDitunjukkan?.length > 0 &&
      `${prolog} ${sikapDitunjukkan?.map((d) => d.sikap).join(", ")}`
    }. ${
      sikapDitingkatkan?.length > 0 &&
      `${epilog} ${sikapDitingkatkan?.map((d) => d.sikap).join(", ")}`
    }`;
  }
};

export const getStyleTableRow = (nilai, kkm) => {
  if (nilai != null) {
    if (nilai < kkm) {
      return {
        backgroundColor: "#fef5f4",
        color: "#fc544b",
      };
    }
  } else {
    return {};
  }
};

export const getWarnaNilai = (nilai, kkm) => {
  if (nilai >= kkm) {
    return "primary";
  } else {
    return "danger";
  }
};

export const filterAgama = (mapelRapor, siswa) => {
  if (mapelRapor?.length) {
    const filtered = mapelRapor?.filter((data) => {
      if (
        data?.nama?.toLowerCase().includes("agama") &&
        siswa?.mSekolahId == 33
      ) {
        if (
          !siswa?.agama &&
          data?.mataPelajaran?.nama?.toLowerCase().includes("islam")
        ) {
          return true;
        } else if (
          siswa?.agama &&
          data?.mataPelajaran?.nama?.toLowerCase().includes(siswa?.agama)
        ) {
          return true;
        }
        if (!data?.mataPelajaran?.nilaiIndividu?.nilai) {
          return false;
        }
        if (
          siswa?.agama &&
          !data?.mataPelajaran?.nama?.toLowerCase().includes(siswa?.agama)
        ) {
          return false;
        }
        return false;
      } else {
        return true;
      }
    });
    return filtered.length ? filtered : [];
  } else {
    return [];
  }
};

export const filterRanking = (mapelRapor, siswa) => {
  if (mapelRapor?.length) {
    const filtered = mapelRapor?.filter((data) => {
      if (
        data?.mapel?.nama?.toLowerCase().includes("agama") &&
        siswa?.mSekolahId == 33
      ) {
        if (
          !siswa?.agama &&
          data?.mapel?.nama?.toLowerCase().includes("islam")
        ) {
          return true;
        } else if (
          siswa?.agama &&
          data?.mapel?.nama?.toLowerCase().includes(siswa?.agama)
        ) {
          return true;
        }
        if (!data?.nilai) {
          return false;
        }
        if (
          siswa?.agama &&
          !data?.mapel?.nama?.toLowerCase().includes(siswa?.agama)
        ) {
          return false;
        }
        return false;
      } else {
        return true;
      }
    });
    return filtered.length ? filtered : [];
  } else {
    return [];
  }
};

export const getDeskripsiSikapYadika1 = (predikat) => {
  const isi =
    predikat == "A"
      ? "Selalu melakukan"
      : predikat == "B"
      ? "Mulai meningkatkan"
      : "perlu meningkatkan";
  return `${isi} Sikap Jujur, ${isi} Sikap Santun, ${isi} Sikap Disiplin`;
};
export const getDeskripsiSikapYadika2 = (predikat) => {
  const isi = predikat == "A" ? "Selalu" : predikat == "B" ? "Mulai" : "perlu";
  return `${isi} memberi salam, Berdoa sebelum dan sesudah melakukan kegiatan, Melaksanakan ibadah sesuai agamanya`;
};
export const getDeskripsiSikapYadika3 = (predikat) => {
  const isi =
    predikat == "A"
      ? "Selalu menunjukkan"
      : predikat == "B"
      ? "Mulai menunjukkan"
      : "perlu menunjukkan";
  return `${isi} sikap nasionalis dengan tidak melakukan pelanggaran sedang dan berat sesuai aturan sekolah`;
};
export const getDeskripsiSikapYadika4 = (predikat) => {
  const isi = predikat == "A" ? "Selalu" : predikat == "B" ? "Mulai" : "perlu";
  return `${isi} menunjukkan sikap mandiri dengan selalu mengumpulkan tugas tepat waktu sesuai dengan arahan dari guru mata pelajaran`;
};
export const getDeskripsiSikapYadika5 = (predikat) => {
  const isi = predikat == "A" ? "Selalu" : predikat == "B" ? "Mulai" : "perlu";
  return `${isi} menunjukkan sikap gotong royong bersama teman-teman pada kegiatan sekolah`;
};

export const getCatatanAkademikYadika = (dibawah, siswa, kelas, kenaikan) => {
  
  if (dibawah.length > 0) {
    return `${siswa?.nama} perlu meningkatkan kompetensi ${dibawah
      ?.map((d, idx) => {
        if (idx == 0) {
          return `${d?.mataPelajaran?.nama}`;
        }
        if (idx == dibawah?.length - 1) {
          return ` dan ${d?.mataPelajaran?.nama}`;
        } else {
          return `, ${d?.mataPelajaran?.nama}`;
        }
      })
      .join(
        ""
      )} sebagai bekal pembelajaran kompetensi kejuruan & kelas ${kelas}.`;
  } else {
    return `${siswa?.nama} sudah menunjukkan perkembangan lebih baik ${
      kenaikan == `XII` ? `` : "& tingkatkan pada semester berikutnya."
    }`;
  }
};

export const getTotalNilai = (nilaiSemuaUjian, siswa) => {
  return filterRanking(nilaiSemuaUjian, siswa).reduce(
    (a, b) => a + b.nilai + b.nilaiKeterampilan,
    0
  );
};

export const sortRanking = (data = []) => {
  return data.sort((now, next) => {
    return (
      getTotalNilai(next?.user?.nilaiSemuaUjian, next?.user) -
      getTotalNilai(now?.user?.nilaiSemuaUjian, now?.user)
    );
  });
};
