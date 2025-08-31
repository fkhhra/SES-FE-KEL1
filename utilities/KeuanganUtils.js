import { ssURL } from "client/clientAxios";
import { getLaba } from "client/LabaRugiClient";
import { getLaba as getLabaRencana } from "client/LaporanRencanaClient";
import { detailRencanaKeuangan } from "client/RencanaKeuanganClient";
import { getPreviewURL } from "./FileViewer";

export const hitungRumusArus = (
  rumus,
  data,
  levelAkun,
  tipeAkun,
  withRencana,
  nilaiKasAwal
) => {
  const { rumusKenaikan = {}, rumusAwal = {}, rumusAkhir = {} } = rumus;

  let kenaikan = 0;
  let awal = 0;
  let akhir = 0;
  let kenaikanRencana = 0;
  let awalRencana = nilaiKasAwal ? nilaiKasAwal : 0;
  let akhirRencana = 0;

  JSON.parse(rumusKenaikan?.rumus || "[]").map((d, idx, thisArray) => {
    if (d?.id) {
      let total = data?.find((e) => e?.id == d?.id)?.total;

      if (!total) {
        total = 0;
      }

      if (idx == 0) {
        kenaikan = kenaikan + total;
      } else {
        if (thisArray[idx - 1]?.operator == "plus") {
          kenaikan = kenaikan + total;
        } else {
          kenaikan = kenaikan - total;
        }
      }
      if (withRencana) {
        let totalRencana = data?.find((e) => e?.id == d?.id)?.totalRencana;

        if (idx == 0) {
          kenaikanRencana += totalRencana;
        } else {
          if (thisArray[idx - 1]?.operator == "plus") {
            kenaikanRencana += totalRencana;
          } else {
            kenaikanRencana -= totalRencana;
          }
        }
      }
    }
  });
  // JSON.parse(rumusAwal?.rumus || "[]").map((d, idx, thisArray) => {
  //   if (d?.id) {
  //     const index = tipeAkun?.findIndex((e) => e?.id == d?.id);
  //     let totalTipe = levelAkun?.find((e) => d?.id == e?.id).total1;
  //     totalTipe = Math.abs(totalTipe);
  //     if (idx == 0) {
  //       awal += totalTipe;
  //     } else {
  //       if (thisArray[idx - 1]?.operator == "plus") {
  //         awal += totalTipe;
  //       } else {
  //         awal -= totalTipe;
  //       }
  //     }
  //     if (withRencana) {
  //       let totalTipe = levelAkun?.find((e) => d?.id == e?.id).totalRencana;
  //       if (idx == 0) {
  //         awalRencana += totalTipe;
  //       } else {
  //         if (thisArray[idx - 1]?.operator == "plus") {
  //           awalRencana += totalTipe;
  //         } else {
  //           awalRencana -= totalTipe;
  //         }
  //       }
  //     }
  //   }
  // });
  JSON.parse(rumusAkhir?.rumus || "[]").map((d, idx, thisArray) => {
    if (d?.id) {
      let total = data?.find((e) => e?.id == d?.id)?.total;
      if (!total) {
        total = 0;
      }

      if (idx == 0) {
        akhir += total;
      } else {
        if (thisArray[idx - 1]?.operator == "plus") {
          akhir += total;
        } else {
          akhir -= total;
        }
      }
      if (withRencana) {
        let totalRencana = data?.find((e) => e?.id == d?.id)?.totalRencana;

        if (idx == 0) {
          akhirRencana += totalRencana;
        } else {
          if (thisArray[idx - 1]?.operator == "plus") {
            akhirRencana += totalRencana;
          } else {
            akhirRencana -= totalRencana;
          }
        }
      }
    }
  });

  return { akhir, awal, kenaikan, kenaikanRencana, akhirRencana, awalRencana };
};

export const hitungKategoriArus = (
  data = [],
  levelAkun,
  labaRugi,
  withRencana,
  labaRencana = 0
) => {
  const kategori = data?.map((d) => {
    let total = 0;
    let totalRencana = 0;
    const tipeAkun = d?.tipeAkun?.map((e, index) => {
      let totalTipe = 0;
      let periode1 = 0;
      let periode2 = 0;
      let totalRencanaTipe = 0;
      let pengaturan = "";
      let text = "";
      if (e?.akunArusKas?.pengaturan) {
        pengaturan = JSON.parse(e?.akunArusKas?.pengaturan);
      }
      if (e?.laba) {
        totalTipe += labaRugi;
        if (withRencana) {
          totalRencanaTipe += labaRencana;
        }
      } else {
        e?.akunArusKas?.akun?.map((f) => {
          const totalAkun = levelAkun?.find((x) => f?.akun?.id == x?.id);
          if (pengaturan?.rumus == "periode2") {
            totalTipe += totalAkun?.total2;
          } else {
            totalTipe += totalAkun?.total;
            periode1 += totalAkun?.total1;
            periode2 += totalAkun?.total2;
          }
          if (withRencana) {
            totalRencanaTipe += totalAkun?.totalRencana;
          }
        });
      }

      if (pengaturan?.pilihanPeriode == "sembunyikan" && periode2 == 0) {
        return;
      }
      if (pengaturan?.format == "positif") {
        totalTipe = Math.abs(totalTipe);
        totalRencanaTipe = Math.abs(totalRencanaTipe);
      } else if (pengaturan?.format == "negatif") {
        totalTipe = totalTipe * -1;
        totalRencanaTipe = totalRencanaTipe * -1;
      }

      if (periode2 > periode1 && pengaturan) {
        text = pengaturan?.periode2;
      } else if (periode2 < periode1 && pengaturan) {
        text = pengaturan?.periode1;
      }

      total += totalTipe;
      totalRencana += totalRencanaTipe;
      return {
        ...e,
        total: totalTipe,
        totalRencana: totalRencanaTipe,
        text,
        periode2,
      };
    });
    const data = tipeAkun.filter((d) => d != null);
    return { ...d, total, tipeAkun: data, totalRencana };
  });
  return kategori;
};

export const arusKasHitungLevelAkun = (
  akun,
  template,
  jurnal1 = "jurnal1",
  jurnal2 = "jurnal2",
  withRencana,
  dataAkunPendapatan = []
) => {
  let temp = [];
  if (akun?.length) {
    function diveTree(data, level, path = []) {
      data.map((d, idx) => {
        const akunKecil = akun?.find((e) => e?.id == d?.id);

        if (akunKecil) {
          if (dataAkunPendapatan?.find((c) => c == akunKecil?.id)) {
            if (d?.children?.length) {
              temp.push({ id: d?.id, level });
              diveTree(d?.children, level + 1, [...path, d?.id]);
            } else {
              let total = 0;
              let totalRencana = 0;
              let totalAkumulasi = 0;
              let totalAkumulasiRencana = 0;
              akunKecil?.[jurnal2]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  total = total - jurnal?.saldo;
                } else {
                  total = total + jurnal?.saldo;
                }
              });
              akunKecil?.jurnal3?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalAkumulasi = totalAkumulasi - jurnal?.saldo;
                } else {
                  totalAkumulasi = totalAkumulasi + jurnal?.saldo;
                }
              });
              if (withRencana) {
                akunKecil?.rencanaJurnal2?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalRencana = totalRencana - jurnal?.saldo;
                  } else {
                    totalRencana = totalRencana + jurnal?.saldo;
                  }
                });
                akunKecil?.rencanaJurnal3?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana - jurnal?.saldo;
                  } else {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana + jurnal?.saldo;
                  }
                });
              }

              if (d?.rek || d?.rekRencana) {
                total +=
                  typeof d?.rek?.saldo != "undefined"
                    ? d?.rek?.saldo
                    : d?.rekRencana?.saldo;
              }
              if (d?.rekRencana) {
                totalRencana += d?.rekRencana?.saldo;
              }

              total = Math.abs(total);
              totalRencana = Math.abs(totalRencana);
              temp.push({
                id: d?.id,
                total,
                level,
                path,
                totalRencana,
                totalAkumulasi,
                totalAkumulasiRencana,
              });
            }
            return;
          }

          if (d?.children?.length) {
            temp.push({ id: d?.id, level });
            diveTree(d?.children, level + 1, [...path, d?.id]);
          } else {
            let total1 = 0;
            let total2 = 0;
            let totalRencana1 = 0;
            let totalRencana2 = 0;
            akunKecil?.[jurnal1]?.map((jurnal) => {
              if (jurnal?.jenis == "kredit") {
                total1 = total1 - jurnal?.saldo;
              } else {
                total1 = total1 + jurnal?.saldo;
              }
            });
            akunKecil?.[jurnal2]?.map((jurnal) => {
              if (jurnal?.jenis == "kredit") {
                total2 = total2 - jurnal?.saldo;
              } else {
                total2 = total2 + jurnal?.saldo;
              }
            });
            if (withRencana) {
              akunKecil?.["rencanaJurnal1"]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalRencana1 = totalRencana1 - jurnal?.saldo;
                } else {
                  totalRencana1 = totalRencana1 + jurnal?.saldo;
                }
              });
              akunKecil?.["rencanaJurnal2"]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalRencana2 = totalRencana2 - jurnal?.saldo;
                } else {
                  totalRencana2 = totalRencana2 + jurnal?.saldo;
                }
              });
            }

            if (d?.rek1 || d?.rekRencana1) {
              total1 +=
                typeof d?.rek1?.saldo != "undefined"
                  ? d?.rek1?.saldo
                  : d?.rekRencana1?.saldo;
            }
            if (d?.rek2 || d?.rekRencana2) {
              total2 +=
                typeof d?.rek2?.saldo != "undefined"
                  ? d?.rek2?.saldo
                  : d?.rekRencana2?.saldo;
            }
            if (d?.rekRencana1) {
              totalRencana1 += d?.rekRencana1?.saldo;
            }
            if (d?.rekRencana2) {
              totalRencana2 += d?.rekRencana2?.saldo;
            }

            temp.push({
              id: d?.id,
              total: total2 - total1,
              totalRencana: totalRencana2 - totalRencana1,
              total1,
              total2,
              totalRencana1,
              level,
              path,
            });
          }
        }
      });
    }
    diveTree(template, 0);
  }
  const hasil = temp.map((d) => {
    if (d?.path) {
      return d;
    } else {
      let total = 0;
      let total1 = 0;
      let total2 = 0;
      let totalRencana = 0;
      let totalRencana1 = 0;
      temp?.map((e) => {
        const path = e?.path;
        if (path) {
          if (path[d?.level] == d?.id) {
            total += e?.total;
            total1 += e?.total1;
            total2 += e?.total2;
            totalRencana += e?.totalRencana;
            totalRencana1 += e?.totalRencana1;
          }
        } else {
          return 0;
        }
      });

      if ((d?.rek1 && d?.rek2) || (d?.rekRencana1 && d?.rekRencana2)) {
        total +=
          (typeof d?.rek2?.saldo != "undefined"
            ? d?.rek2?.saldo
            : d?.rekRencana2?.saldo) -
          (typeof d?.rek1?.saldo != "undefined"
            ? d?.rek1?.saldo
            : d?.rekRencana1?.saldo);
      }
      if (d?.rek1) {
        total1 += d?.rek1?.saldo;
        total2 += d?.rek1?.saldo;
      }
      if (d?.rekRencana1 && d?.rekRencana2) {
        totalRencana += d?.rekRencana2?.saldo - d?.rekRencana1?.saldo;
      }
      if (d?.rekRencana1) {
        totalRencana1 += d?.rekRencana1?.saldo;
      }

      return {
        ...d,
        total,
        total1,
        total2,
        totalRencana,
        totalRencana1,
      };
    }
  });
  return hasil;
};

export const hitungLabaRugiArus = (
  laba,
  levelAkun,
  rumusLaba,
  dataSemuaAkun,
  total = "total",
  akumulasi = 0,
  totalSiswa
) => {
  // console.log(akumulasi, rumusLaba);
  let totalTipe = 0;
  let totalAkun = {};
  laba?.map((d) => {
    let temp = 0;
    d?.akunLabaRugi?.map((akunLabaRugi) => {
      let nilaiRumus = 0;
      let nilaiRumusRencana = 0;
      JSON.parse(akunLabaRugi?.akun?.rumusAkun?.rumus || "[]").map(
        (d, idx, thisArray) => {
          if (d?.id) {
            // const index = dataSemuaAkun?.findIndex((e) => e?.id == d?.id);
            let totalRumusRencana;
            if (total == "totalRencana") {
              totalRumusRencana = levelAkun?.find(
                (e) => d?.id == e?.id
              )?.totalRencana;
            } else {
              totalRumusRencana = levelAkun?.find((e) => d?.id == e?.id)?.total;
            }

            if (idx == 0) {
              nilaiRumus += totalRumusRencana;
            } else {
              if (thisArray[idx - 1]?.operator == "plus") {
                nilaiRumus += totalRumusRencana;
              } else {
                nilaiRumus -= totalRumusRencana;
              }
            }
          }
        }
      );
      if (!nilaiRumus) {
        nilaiRumus = 0;
      }
      const akunKecil = levelAkun?.find((x) => akunLabaRugi?.akun?.id == x?.id);
      if (akumulasi) {
        temp = temp + akunKecil?.totalAkumulasi;
      } else {
        temp = temp + akunKecil?.[total] + nilaiRumus;
      }
    });
    totalAkun[d?.id] = temp;
  });
  // console.log(totalAkun, tes);

  rumusLaba.map((d, idx) => {
    if (d?.id == "siswa") {
      totalTipe = totalTipe / totalSiswa;
    }
    if (!totalAkun[d?.id]) {
      totalAkun[d?.id] = 0;
    }
    if (d?.id && idx == 0) {
      totalTipe += totalAkun[d?.id];
    } else if (d?.id) {
      rumusLaba[idx - 1]?.operator == "plus"
        ? (totalTipe += totalAkun[d?.id])
        : (totalTipe -= totalAkun[d?.id]);
    }
  });
  return totalTipe;
};

export const neracaHitungLevelAkun = (
  akun,
  template,
  jurnal = "jurnal",
  withRencana,
  nilaiArusKas
) => {
  let temp = [];
  // console.log(nilaiArusKas);
  if (akun?.length) {
    function diveTree(data, level, path = []) {
      data.map((d, idx) => {
        const akunKecil = akun?.find((e) => e?.id == d?.id);

        if (akunKecil) {
          if (d?.children?.length) {
            temp.push({ id: d?.id, jurnal: akunKecil?.[jurnal], level });
            diveTree(d?.children, level + 1, [...path, d?.id]);
          } else {
            let total = 0;
            let totalAkumulasi = 0;
            if (akunKecil?.nama == "KAS") {
              total = total + nilaiArusKas?.akhir;
            }
            akunKecil?.[jurnal]?.map((jurnal) => {
              if (jurnal?.jenis == "kredit") {
                total = total - jurnal?.saldo;
              } else {
                total = total + jurnal?.saldo;
              }
            });
            akunKecil?.[jurnal + 1]?.map((jurnal) => {
              if (jurnal?.jenis == "kredit") {
                totalAkumulasi = totalAkumulasi - jurnal?.saldo;
              } else {
                totalAkumulasi = totalAkumulasi + jurnal?.saldo;
              }
            });
            let totalRencana = 0;
            let totalAkumulasiRencana = 0;
            if (withRencana) {
              if (akunKecil?.nama == "KAS") {
                totalRencana = totalRencana + nilaiArusKas?.akhirRencana;
              }
              akunKecil?.["rencanaJurnal"]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalRencana = totalRencana - jurnal?.saldo;
                } else {
                  totalRencana = totalRencana + jurnal?.saldo;
                }
              });
              akunKecil?.rencanaJurnal1?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalAkumulasiRencana = totalAkumulasiRencana - jurnal?.saldo;
                } else {
                  totalAkumulasiRencana = totalAkumulasiRencana + jurnal?.saldo;
                }
              });
            }

            if (akunKecil?.rek || akunKecil?.rekRencana) {
              total +=
                typeof akunKecil?.rek?.saldo != "undefined"
                  ? akunKecil?.rek?.saldo
                  : akunKecil?.rekRencana?.saldo;
            }
            if (akunKecil?.rekRencana) {
              totalRencana += akunKecil?.rekRencana?.saldo;
            }

            temp.push({
              id: d?.id,
              jurnal: akunKecil?.[jurnal],
              total: Math.abs(total),
              totalRencana: Math.abs(totalRencana),
              totalAkumulasi: Math.abs(totalAkumulasi),
              totalAkumulasiRencana: Math.abs(totalAkumulasiRencana),
              level,
              path,
            });
          }
        }
      });
    }
    diveTree(template, 0);
  }
  const hasil = temp.map((d) => {
    if (d?.path) {
      return d;
    } else {
      let total = 0;
      let totalAkumulasi = 0;
      let totalRencana = 0;
      temp?.map((e) => {
        const path = e?.path;
        if (path) {
          if (path[d?.level] == d?.id) {
            total += e?.total;
            totalAkumulasi += e?.totalAkumulasi;
            totalRencana += e?.totalRencana;
          }
        } else {
          return 0;
        }
      });

      if (d?.rek || d?.rekRencana) {
        total +=
          typeof d?.rek?.saldo != "undefined"
            ? d?.rek?.saldo
            : d?.rekRencana?.saldo;
      }
      if (d?.rekRencana) {
        totalRencana += d?.rekRencana?.saldo;
      }

      return {
        ...d,
        total: Math.abs(total),
        totalRencana: Math.abs(totalRencana),
        totalAkumulasi: Math.abs(totalAkumulasi),
      };
    }
  });
  return hasil;
};

export const hitungKategoriNeraca = (
  data,
  levelAkun,
  akun,
  template,
  kategoriLabaRugi,
  withRencana,
  rumusLabaRugi,
  dataKumulatif,
  dataKumulatifRencana
) => {
  const kategori = data?.map((d) => {
    let total = 0;
    let totalRencana = 0;
    const akunNeraca = d?.akunNeraca?.map((e) => {
      // console.log(e);
      let totalLabaRugi = 0;
      let totalLabaRugiRencana = 0;
      // if (e.akun.nama == "MODAL" || e.akun.nama == "LABA DITAHAN") {
      //   const rumusLaba = JSON.parse(e?.akun?.rumusAkun?.rumus || "[]");
      //   let hasil;
      //   let kategoriss;
      //   if (withRencana) {
      //     hasil = labaRugiHitungLevelAkun(akun, template, "jurnal", 1);
      //     kategoriss = hitungKategoriLabaRugi(kategoriLabaRugi, hasil, 1);
      //   } else {
      //     hasil = labaRugiHitungLevelAkun(akun, template, "rencanaJurnal");
      //     kategoriss = hitungKategoriLabaRugi(kategoriLabaRugi, hasil);
      //   }

      //   // console.log(hasil);
      //   // console.log(kategoriss);

      //   totalLabaRugi = hitungLabaRugiArus(kategoriss, hasil, rumusLaba);
      //   totalLabaRugiRencana = hitungLabaRugiArus(
      //     kategoriss,
      //     hasil,
      //     rumusLaba,
      //     "totalRencana"
      //   );
      // }
      let nilaiRumus = 0;
      let nilaiRumusRencana = 0;
      if (e?.akun?.nama == "AKUMULASI PENYUSUTAN") {
        JSON.parse(e?.akun?.rumusAkun?.rumus || "[]").map(
          (d, idx, thisArray) => {
            if (d?.id) {
              // const index = dataSemuaAkun?.findIndex((e) => e?.id == d?.id);
              let totalTipe = levelAkun?.find((e) => d?.id == e?.id)?.total;
              if (!totalTipe) {
                totalTipe = 0;
              }

              if (idx == 0) {
                nilaiRumus += totalTipe;
              } else {
                if (thisArray[idx - 1]?.operator == "plus") {
                  nilaiRumus += totalTipe;
                } else {
                  nilaiRumus -= totalTipe;
                }
              }
              if (withRencana) {
                let totalTipe = levelAkun?.find(
                  (e) => d?.id == e?.id
                )?.totalRencana;
                if (idx == 0) {
                  nilaiRumusRencana += totalTipe;
                } else {
                  if (thisArray[idx - 1]?.operator == "plus") {
                    nilaiRumusRencana += totalTipe;
                  } else {
                    nilaiRumusRencana -= totalTipe;
                  }
                }
              }
            }
          }
        );
        let totalAkun = levelAkun?.find((x) => x?.id == e?.akun?.id)?.total;
        if (e?.pengaturan == "negatif") {
          total = total - totalAkun + totalLabaRugi - nilaiRumus;
        } else {
          total = total + totalAkun + totalLabaRugi + nilaiRumus;
        }
        let totalAkunRencana = 0;
        if (withRencana) {
          totalAkunRencana = levelAkun?.find(
            (x) => x?.id == e?.akun?.id
          )?.totalRencana;

          if (e?.pengaturan == "negatif") {
            totalRencana =
              totalRencana -
              totalAkunRencana +
              totalLabaRugiRencana -
              nilaiRumusRencana;
          } else {
            totalRencana =
              totalRencana +
              totalAkunRencana +
              totalLabaRugiRencana +
              nilaiRumusRencana;
          }
        }
        if (e?.pengaturan == "negatif") {
          return {
            ...e,
            total: totalAkun - totalLabaRugi - nilaiRumus,
            totalRencana:
              totalAkunRencana - totalLabaRugiRencana - nilaiRumusRencana,
          };
        } else {
          return {
            ...e,
            total: totalAkun + totalLabaRugi + nilaiRumus,
            totalRencana:
              totalAkunRencana + totalLabaRugiRencana + nilaiRumusRencana,
          };
        }
      }
      if (
        e?.akun?.nama == "KUMULATIF LABA (RUGI)" ||
        e?.akun?.kode == "00000" ||
        e?.akun?.nama == "AKUMULATIF LABA (RUGI)"
      ) {
        // const rumusLaba = JSON.parse(
        //   rumusLabaRugi?.find(
        //     (d) => d?.id == parseInt(e?.akun?.rumusAkun?.rumus)
        //   )?.rumus || "[]"
        // );
        // let hasil;
        // let kategoriss;
        // if (withRencana) {
        //   hasil = labaRugiHitungLevelAkun(
        //     akun,
        //     template,
        //     "jurnal",
        //     1,
        //     dataAkunPendapatan
        //   );
        //   kategoriss = hitungKategoriLabaRugi(kategoriLabaRugi, hasil, 1);
        // } else {
        //   hasil = labaRugiHitungLevelAkun(akun, template, "rencanaJurnal");
        //   kategoriss = hitungKategoriLabaRugi(kategoriLabaRugi, hasil);
        // }

        // totalLabaRugi = hitungLabaRugiArus(
        //   kategoriss?.kategori,
        //   hasil,
        //   rumusLaba,
        //   akun,
        //   "total",
        //   1
        //   // 1
        // );
        // // const totalLabaRugiKumulatif = hitungLabaRugiArus(
        // //   kategori?.kategori,
        // //   hasil,
        // //   rumusLabaKumulatif,
        // //   data?.akun,
        // //   "total",
        // //   1
        // // );
        // totalLabaRugiRencana = hitungLabaRugiArus(
        //   kategoriss?.kategori,
        //   hasil,
        //   rumusLaba,
        //   "totalRencana"
        // );
        const totalLabaRugi = dataKumulatif?.totalLabaRugiKumulatif;
        const totalLabaRugiRencana =
          dataKumulatifRencana?.totalLabaRugiKumulatif;

        let totalAkun = levelAkun?.find((x) => x?.id == e?.akun?.id)?.total;
        if (e?.pengaturan == "negatif") {
          total = total - totalAkun + totalLabaRugi - nilaiRumus;
        } else {
          total = total + totalAkun + totalLabaRugi + nilaiRumus;
        }
        let totalAkunRencana = 0;
        if (withRencana) {
          totalAkunRencana = levelAkun?.find(
            (x) => x?.id == e?.akun?.id
          )?.totalRencana;
          // console.log({
          //   totalRencana,
          //   totalAkunRencana,
          //   totalLabaRugiRencana,
          //   nilaiRumusRencana,
          // });

          if (e?.pengaturan == "negatif") {
            totalRencana =
              totalRencana -
              totalAkunRencana +
              totalLabaRugiRencana -
              nilaiRumus;
          } else {
            totalRencana =
              totalRencana +
              totalAkunRencana +
              totalLabaRugiRencana +
              nilaiRumusRencana;
          }
        }
        return {
          ...e,
          total: totalAkun + totalLabaRugi + nilaiRumus,
          totalRencana:
            totalAkunRencana + totalLabaRugiRencana + nilaiRumusRencana,
        };
      }
      if (
        e?.akun?.nama == "AKUMULASI DIVIDEN" ||
        e?.akun?.nama == "AKUMULATIF DIVIDEN" ||
        e?.akun?.nama == "DIVIDEN"
      ) {
        JSON.parse(e?.akun?.rumusAkun?.rumus || "[]").map(
          (d, idx, thisArray) => {
            if (d?.id) {
              // const index = dataSemuaAkun?.findIndex((e) => e?.id == d?.id);
              let totalTipe = levelAkun?.find(
                (e) => d?.id == e?.id
              )?.totalAkumulasi;
              if (!totalTipe) {
                totalTipe = 0;
              }

              if (idx == 0) {
                nilaiRumus += totalTipe;
              } else {
                if (thisArray[idx - 1]?.operator == "plus") {
                  nilaiRumus += totalTipe;
                } else {
                  nilaiRumus -= totalTipe;
                }
              }
              if (withRencana) {
                let totalTipe = levelAkun?.find(
                  (e) => d?.id == e?.id
                )?.totalRencana;
                if (idx == 0) {
                  nilaiRumusRencana += totalTipe;
                } else {
                  if (thisArray[idx - 1]?.operator == "plus") {
                    nilaiRumusRencana += totalTipe;
                  } else {
                    nilaiRumusRencana -= totalTipe;
                  }
                }
              }
            }
          }
        );
        let totalAkun = levelAkun?.find((x) => x?.id == e?.akun?.id)?.total;
        if (e?.pengaturan == "negatif") {
          total = total - totalAkun + totalLabaRugi - nilaiRumus;
        } else {
          total = total + totalAkun + totalLabaRugi + nilaiRumus;
        }
        let totalAkunRencana = 0;
        if (withRencana) {
          totalAkunRencana = levelAkun?.find(
            (x) => x?.id == e?.akun?.id
          )?.totalRencana;

          if (e?.pengaturan == "negatif") {
            totalRencana =
              totalRencana -
              totalAkunRencana +
              totalLabaRugiRencana -
              nilaiRumusRencana;
          } else {
            totalRencana =
              totalRencana +
              totalAkunRencana +
              totalLabaRugiRencana +
              nilaiRumusRencana;
          }
        }

        if (e?.pengaturan == "negatif") {
          return {
            ...e,
            total: totalAkun - totalLabaRugi - nilaiRumus,
            totalRencana:
              totalAkunRencana - totalLabaRugiRencana - nilaiRumusRencana,
          };
        } else {
          return {
            ...e,
            total: totalAkun + totalLabaRugi + nilaiRumus,
            totalRencana:
              totalAkunRencana + totalLabaRugiRencana + nilaiRumusRencana,
          };
        }
      }
      let totalAkun = levelAkun?.find((x) => x?.id == e?.akun?.id)?.total;
      if (e?.pengaturan == "negatif") {
        total = total - totalAkun + totalLabaRugi;
      } else {
        total = total + totalAkun + totalLabaRugi;
      }
      let totalAkunRencana = 0;
      if (withRencana) {
        totalAkunRencana = levelAkun?.find(
          (x) => x?.id == e?.akun?.id
        )?.totalRencana;
        totalRencana = totalRencana + totalAkunRencana + totalLabaRugiRencana;
      }
      return {
        ...e,
        total: totalAkun + totalLabaRugi,
        totalRencana: totalAkunRencana + totalLabaRugiRencana,
      };
    });
    return { ...d, total, akunNeraca, totalRencana };
  });
  return kategori;
};

export const labaRugiHitungLevelAkun = (
  akun,
  template,
  jurnal = "jurnal",
  withRencana,
  dataAkunPendapatan = []
) => {
  let temp = [];
  if (akun?.length) {
    function diveTree(data, level, path = []) {
      data.map((d, idx) => {
        const akunKecil = akun?.find((e) => e?.id == d?.id);
        if (akunKecil) {
          if (dataAkunPendapatan?.find((c) => c == akunKecil?.id)) {
            if (d?.children?.length) {
              if (jurnal == "jurnal") {
                temp.push({
                  id: d?.id,
                  jurnal: akunKecil?.jurnal2,
                  kode: akunKecil?.kode,
                  nama: akunKecil?.nama,
                  level,
                });
              } else {
                temp.push({
                  id: d?.id,
                  jurnal: akunKecil?.rencanaJurnal2,
                  kode: akunKecil?.kode,
                  nama: akunKecil?.nama,
                  level,
                });
              }
              diveTree(d?.children, level + 1, [...path, d?.id]);
            } else {
              let total = 0;
              let totalRencana = 0;
              let totalAkumulasi = 0;
              let totalAkumulasiRencana = 0;
              akunKecil?.[`${jurnal}2`]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  total = total - jurnal?.saldo;
                } else {
                  total = total + jurnal?.saldo;
                }
              });
              akunKecil?.[`${jurnal}3`]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalAkumulasi = totalAkumulasi - jurnal?.saldo;
                } else {
                  totalAkumulasi = totalAkumulasi + jurnal?.saldo;
                }
              });
              if (withRencana) {
                akunKecil?.rencanaJurnal2?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalRencana = totalRencana - jurnal?.saldo;
                  } else {
                    totalRencana = totalRencana + jurnal?.saldo;
                  }
                });
                akunKecil?.rencanaJurnal3?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana - jurnal?.saldo;
                  } else {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana + jurnal?.saldo;
                  }
                });
              }

              if (d?.rek || d?.rekRencana) {
                total +=
                  typeof d?.rek?.saldo != "undefined"
                    ? d?.rek?.saldo
                    : d?.rekRencana?.saldo;
              }
              if (d?.rekRencana) {
                totalRencana += d?.rekRencana?.saldo;
              }

              total = Math.abs(total);
              totalRencana = Math.abs(totalRencana);
              temp.push({
                id: d?.id,
                total,
                level,
                path,
                kode: akunKecil?.kode,
                nama: akunKecil?.nama,
                totalRencana,
                totalAkumulasi,
                totalAkumulasiRencana,
                pedapat: 1,
              });
            }
            return;
          }

          if (d?.children?.length) {
            temp.push({
              id: d?.id,
              jurnal: akunKecil?.[jurnal],
              kode: akunKecil?.kode,
              nama: akunKecil?.nama,
              level,
            });
            diveTree(d?.children, level + 1, [...path, d?.id]);
          } else {
            let total = 0;
            let totalRencana = 0;
            let totalAkumulasi = 0;
            let totalAkumulasiRencana = 0;
            const check = path?.find(
              (x) => dataAkunPendapatan?.find((ss) => ss == x) == x
            );
            if (check) {
              akunKecil?.[`${jurnal}2`]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  total = total - jurnal?.saldo;
                } else {
                  total = total + jurnal?.saldo;
                }
              });
              akunKecil?.[`${jurnal}3`]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalAkumulasi = totalAkumulasi - jurnal?.saldo;
                } else {
                  totalAkumulasi = totalAkumulasi + jurnal?.saldo;
                }
              });
            } else {
              akunKecil?.[jurnal]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  total = total - jurnal?.saldo;
                } else {
                  total = total + jurnal?.saldo;
                }
              });

              akunKecil?.[`${jurnal}1`]?.map((jurnal) => {
                if (jurnal?.jenis == "kredit") {
                  totalAkumulasi = totalAkumulasi - jurnal?.saldo;
                } else {
                  totalAkumulasi = totalAkumulasi + jurnal?.saldo;
                }
              });
            }
            if (withRencana) {
              if (check) {
                akunKecil?.rencanaJurnal2?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalRencana = totalRencana - jurnal?.saldo;
                  } else {
                    totalRencana = totalRencana + jurnal?.saldo;
                  }
                });
                akunKecil?.rencanaJurnal3?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana - jurnal?.saldo;
                  } else {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana + jurnal?.saldo;
                  }
                });
              } else {
                akunKecil?.["rencanaJurnal"]?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalRencana = totalRencana - jurnal?.saldo;
                  } else {
                    totalRencana = totalRencana + jurnal?.saldo;
                  }
                });
                akunKecil?.rencanaJurnal1?.map((jurnal) => {
                  if (jurnal?.jenis == "kredit") {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana - jurnal?.saldo;
                  } else {
                    totalAkumulasiRencana =
                      totalAkumulasiRencana + jurnal?.saldo;
                  }
                });
              }
            }

            if (d?.rek || d?.rekRencana) {
              total +=
                typeof d?.rek?.saldo != "undefined"
                  ? d?.rek?.saldo
                  : d?.rekRencana?.saldo;
            }
            if (d?.rekRencana) {
              totalRencana += d?.rekRencana?.saldo;
            }

            total = Math.abs(total);
            totalRencana = Math.abs(totalRencana);
            // console.log(akunKecil);
            temp.push({
              id: d?.id,
              total,
              level,
              path,
              kode: akunKecil?.kode,
              nama: akunKecil?.nama,
              totalRencana,
              totalAkumulasi,
              totalAkumulasiRencana,
            });
          }
        }
      });
    }
    diveTree(template, 0);
  }

  const hasil = temp.map((d) => {
    if (d?.path) {
      return d;
    } else {
      let total = 0;
      let totalRencana = 0;
      let totalAkumulasi = 0;
      temp?.map((e) => {
        const path = e?.path;
        if (path) {
          if (path[d?.level] == d?.id) {
            total += e?.total;
            totalRencana += e?.totalRencana;
            totalAkumulasi += e?.totalAkumulasi;
          }
        } else {
          return 0;
        }
      });

      if (d?.rek || d?.rekRencana) {
        total +=
          typeof d?.rek?.saldo != "undefined"
            ? d?.rek?.saldo
            : d?.rekRencana?.saldo;
      }
      if (d?.rekRencana) {
        totalRencana += d?.rekRencana?.saldo;
      }

      return {
        ...d,
        total: Math.abs(total),
        totalRencana: Math.abs(totalRencana),
        totalAkumulasi: Math.abs(totalAkumulasi),
      };
    }
  });
  return hasil;
};

export const hitungKategoriLabaRugi = (
  data,
  levelAkun,
  dataSemuaAkun,
  withRencana
) => {
  let totalAkumulasi = 0;
  let totalAkumulasiRencana = 0;
  // let totalBebanRencana = 0;
  const kategori = data?.map((d) => {
    // if (d?.kategori == "Lainnya") {
    let total = 0;
    let totalRencana = 0;
    const akunLabaRugi = d?.akunLabaRugi?.map((e) => {
      let nilaiRumus = 0;
      let nilaiRumusRencana = 0;
      JSON.parse(e?.akun?.rumusAkun?.rumus || "[]").map((d, idx, thisArray) => {
        if (d?.id) {
          // const index = dataSemuaAkun?.findIndex((e) => e?.id == d?.id);
          let totalTipe = levelAkun?.find((e) => d?.id == e?.id)?.total;
          if (!totalTipe) {
            totalTipe = 0;
          }

          if (idx == 0) {
            nilaiRumus += totalTipe;
          } else {
            if (thisArray[idx - 1]?.operator == "plus") {
              nilaiRumus += totalTipe;
            } else {
              nilaiRumus -= totalTipe;
            }
          }
          if (withRencana) {
            let totalTipe = levelAkun?.find(
              (e) => d?.id == e?.id
            )?.totalRencana;

            if (!totalTipe) {
              totalTipe = 0;
            }

            if (idx == 0) {
              nilaiRumusRencana += totalTipe;
            } else {
              if (thisArray[idx - 1]?.operator == "plus") {
                nilaiRumusRencana += totalTipe;
              } else {
                nilaiRumusRencana -= totalTipe;
              }
            }
          }
        }
      });
      let totalAkun = levelAkun?.find((x) => x?.id == e?.akun?.id)?.total;

      const childrenLength = levelAkun?.find(
        (x) => x?.path?.find((ss) => ss == e?.akun?.id) == e?.akun?.id
      )?.path?.length;

      let totalAkunAkumulasi = levelAkun?.find(
        (x) => x?.id == e?.akun?.id
      )?.totalAkumulasi;

      total = total + totalAkun + nilaiRumus;
      totalAkumulasi = totalAkumulasi + totalAkunAkumulasi;

      let totalAkunRencana = 0;
      let totalAkunAkumulasiRencana = 0;
      if (withRencana) {
        totalAkunRencana = levelAkun?.find(
          (x) => x?.id == e?.akun?.id
        )?.totalRencana;

        totalAkunAkumulasiRencana = levelAkun?.find(
          (x) => x?.id == e?.akun?.id
        )?.totalAkumulasiRencana;

        if (!totalAkumulasiRencana) {
          totalAkumulasiRencana = 0;
        }

        totalRencana = totalRencana + totalAkunRencana + nilaiRumusRencana;
        totalAkumulasiRencana =
          totalAkumulasiRencana + totalAkunAkumulasiRencana;
      }
      return {
        ...e,
        children: levelAkun?.filter(
          (x) =>
            x?.path?.find((ss) => ss == e?.akun?.id) == e?.akun?.id &&
            x?.path?.length == childrenLength
        ),
        total: totalAkun + nilaiRumus,
        totalRencana: totalAkunRencana + nilaiRumusRencana,
      };
    });

    return { ...d, total, akunLabaRugi, totalRencana };
    // }
    // if (d?.kategori == "Beban") {
    //   let total = 0;
    //   let totalRencana = 0;
    //   const akunLabaRugi = d?.akunLabaRugi?.map((e) => {
    //     let nilaiRumus = 0;
    //     let nilaiRumusRencana = 0;
    //     JSON.parse(e?.akun?.rumusAkun?.rumus || "[]").map(
    //       (d, idx, thisArray) => {
    //         if (d?.id) {
    //           // const index = dataSemuaAkun?.findIndex((e) => e?.id == d?.id);
    //           let totalTipe = levelAkun?.find((e) => d?.id == e?.id).total;

    //           if (idx == 0) {
    //             nilaiRumus += totalTipe;
    //           } else {
    //             if (thisArray[idx - 1]?.operator == "plus") {
    //               nilaiRumus += totalTipe;
    //             } else {
    //               nilaiRumus -= totalTipe;
    //             }
    //           }
    //           if (withRencana) {
    //             let totalTipe = levelAkun?.find(
    //               (e) => d?.id == e?.id
    //             ).totalRencana;
    //             if (idx == 0) {
    //               nilaiRumusRencana += totalTipe;
    //             } else {
    //               if (thisArray[idx - 1]?.operator == "plus") {
    //                 nilaiRumusRencana += totalTipe;
    //               } else {
    //                 nilaiRumusRencana -= totalTipe;
    //               }
    //             }
    //           }
    //         }
    //       }
    //     );
    //     let totalAkun = levelAkun?.find((x) => x?.id == e?.akun?.id)?.total;
    //     total = total + totalAkun + nilaiRumus;
    //     let totalAkunRencana = 0;
    //     if (withRencana) {
    //       totalAkunRencana = levelAkun?.find(
    //         (x) => x?.id == e?.akun?.id
    //       )?.totalRencana;
    //       totalRencana = totalRencana + totalAkunRencana + nilaiRumusRencana;
    //     }
    //     return {
    //       ...e,
    //       total: totalAkun + nilaiRumus,
    //       totalRencana: totalAkunRencana + nilaiRumusRencana,
    //     };
    //   });
    //   totalBeban = totalBeban + total;
    //   totalBebanRencana = totalBebanRencana + totalRencana;
    //   return {
    //     ...d,
    //     total,
    //     akunLabaRugi,
    //     totalRencana,
    //     totalBeban,
    //     totalBebanRencana,
    //   };
    // }
  });
  return { kategori, totalAkumulasi, totalAkumulasiRencana };
};

export const detailRencana = async (id) => {
  const { data } = await detailRencanaKeuangan(id);

  if (data) {
    return data?.perencanaan;
  }
};

export const hitungTotalPerencanaan = (data) => {
  let total = 0;
  data?.transaksi?.map((d) => {
    d?.jurnal?.map((e) => {
      if (e?.jenis == "debit") {
        total += e?.saldo;
      }
    });
  });
  return total;
};

export const analisisHitungLevel = (akun, template, jurnal = "jurnal") => {
  let temp = [];
  if (akun?.length) {
    function diveTree(data, level, path = []) {
      data.map((d, idx) => {
        const akunKecil = akun?.find((e) => e?.id == d?.id);

        if (akunKecil) {
          if (d?.children?.length) {
            temp.push({ id: d?.id, jurnal: akunKecil?.[jurnal], level });
            diveTree(d?.children, level + 1, [...path, d?.id]);
          } else {
            let total = 0;
            akunKecil?.[jurnal]?.map((jurnal) => {
              if (jurnal?.jenis == "kredit") {
                total = total - jurnal?.saldo;
              } else {
                total = total + jurnal?.saldo;
              }
            });
            temp.push({
              id: d?.id,
              jurnal: akunKecil?.[jurnal],
              total,
              level,
              path,
            });
          }
        }
      });
    }
    diveTree(template, 0);
  }
  const hasil = temp.map((d) => {
    if (d?.path) {
      return d;
    } else {
      let total = 0;
      temp?.map((e) => {
        const path = e?.path;
        if (path) {
          path[d?.level] == d?.id ? (total += e?.total) : null;
        } else {
          return 0;
        }
      });
      return { ...d, total };
    }
  });
  return hasil;
};

export const getLinkHistori = (d) => {
  const lowerCase = ("" + d?.jenis)?.toLowerCase();
  const tipe = ("" + d?.tipe)?.toLowerCase();
  const bawah = ("" + d?.bawah)?.toLowerCase();
  const awal = ("" + d?.awal)?.toLowerCase();
  let link;
  if (lowerCase.includes("akun")) {
    link = "/smartschool/akun-keuangan";
  } else if (lowerCase.includes("transaksi")) {
    link = "/smartschool/mutasi/v2";
  } else if (lowerCase.includes("rencana anggaran")) {
    link = `/smartschool/perencanaan-keuangan/${d?.alamatId}/rencana`;
  } else if (lowerCase.includes("perencanaan")) {
    link = "/smartschool/perencanaan-keuangan";
  } else if (lowerCase.includes("laporan")) {
    if (d?.alamatId) {
      if (bawah?.includes("neraca")) {
        link = `/smartschool/perencanaan-keuangan/${d?.alamatId}/laporan-neraca/template-laporan`;
      } else if (bawah?.includes("laba")) {
        link = `/smartschool/perencanaan-keuangan/${d?.alamatId}/laporan-laba-rugi/template-laporan`;
      } else {
        if (awal?.includes("akun")) {
          link = `/smartschool/perencanaan-keuangan/${d?.alamatId}/laporan-arus-kas/tipe-akun`;
        } else {
          link = `/smartschool/perencanaan-keuangan/${d?.alamatId}/laporan-arus-kas/template-laporan`;
        }
      }
    } else if (bawah?.includes("analisis")) {
      link = "/smartschool/analisis-keuangan/template-laporan";
    } else {
      if (awal?.includes("akun")) {
        link = `/smartschool/laporan-keuangan/arus-kas/tipe-akun`;
      } else {
        link = `/smartschool/laporan-keuangan/arus-kas/template-laporan`;
      }
    }
  } else if (tipe.includes("sarpras")) {
    if (lowerCase.includes("ubah barang")) {
      link = `${ssURL}/barang`;
    }
    if (lowerCase.includes("ubah lokasi")) {
      link = `${ssURL}/lokasi`;
    }
  }
  return link;
};

export const hitungRumus = (
  rumus = "[]",
  daftarBesaran = [{ id: "", nilai: "" }]
) => {
  let hasilRumus = 0;

  const rumusArray = JSON.parse(rumus);

  rumusArray?.map((arahan, urutan, thisArray) => {
    let cariNilai = daftarBesaran?.find(
      (besaran) => besaran?.id == arahan?.id
    )?.nilai;

    if (!cariNilai) {
      return;
    }
    if (urutan == 0) {
      hasilRumus += cariNilai;
    } else {
      if (thisArray[urutan - 1]?.operator == "plus") {
        hasilRumus += cariNilai;
      } else {
        hasilRumus -= cariNilai;
      }
    }
  });

  return hasilRumus;
};

export const _getLabaKumulatif = async (search, tanggalAwal, tanggalAkhir) => {
  const { data } = await getLaba({ search, tanggalAwal, tanggalAkhir });

  if (data) {
    // setRumus(data?.rumus);
    // setKeuangan(data?.keuangan);
    // setAkun(data?.akun);
    // setRencana(data?.rencana);

    const template = JSON.parse(data?.keuangan?.template || "[]");
    const hasil = labaRugiHitungLevelAkun(
      data?.akun,
      template,
      "jurnal",
      1,
      data?.dataAkunPendapatan
    );

    const kategori = hitungKategoriLabaRugi(
      data?.kategori,
      hasil,
      data?.akun,
      1
    );

    const hasilRumus = data?.rumus?.map((d) => {
      const rumusLaba = JSON.parse(d?.rumus || "[]");
      const totalLabaRugi = hitungLabaRugiArus(
        kategori?.kategori,
        hasil,
        rumusLaba,
        data?.akun
      );
      const totalLabaRugiRencana = hitungLabaRugiArus(
        kategori?.kategori,
        hasil,
        rumusLaba,
        data?.akun,
        "totalRencana"
      );
      return { totalLabaRugi, totalLabaRugiRencana, nama: d?.nama };
    });
    // setHasilRumus([...hasilRumus]);

    const labaKumulatifRumusId = parseInt(
      data?.akun?.find(
        (d) =>
          (d.kode == "00000" || d.kode == null) &&
          (d?.nama == "AKUMULATIF LABA (RUGI)" ||
            d?.nama == "KUMULATIF LABA (RUGI)")
      )?.rumusAkun?.rumus
    );
    const rumusLabaKumulatif = JSON.parse(
      data?.rumus?.find((d) => d.id == labaKumulatifRumusId)?.rumus || "[]"
    );
    const totalLabaRugiKumulatif = hitungLabaRugiArus(
      kategori?.kategori,
      hasil,
      rumusLabaKumulatif,
      data?.akun,
      "total",
      1
    );

    return { totalLabaRugiKumulatif, hasilRumus };
  }
};
export const _getLabaKumulatifRencana = async (
  search,
  tanggalAwal,
  tanggalAkhir,
  id,
  check
) => {
  const { data } = await getLabaRencana(id, {
    search,
    tanggalAwal,
    tanggalAkhir,
  });

  if (data) {
    // setRumus(data?.rumus);
    // setKeuangan(data?.keuangan);
    // setAkun(data?.akun);
    // setRencana(data?.rencana);

    const template = JSON.parse(data?.keuangan?.template || "[]");
    const hasil = labaRugiHitungLevelAkun(
      data?.akun,
      template,
      "rencanaJurnal",
      0,
      data?.dataAkunPendapatan
    );

    const kategori = hitungKategoriLabaRugi(
      data?.kategori,
      hasil,
      data?.akun,
      0
    );

    const hasilRumus = data?.rumus?.map((d) => {
      const rumusLaba = JSON.parse(d?.rumus || "[]");
      const totalLabaRugi = hitungLabaRugiArus(
        kategori?.kategori,
        hasil,
        rumusLaba,
        data?.akun
      );
      return { totalLabaRugi, nama: d?.nama };
    });
    // setHasilRumus([...hasilRumus]);

    const labaKumulatifRumusId = parseInt(
      data?.akun?.find(
        (d) =>
          (d.kode == "00000" || d.kode == null) &&
          (d?.nama == "AKUMULATIF LABA (RUGI)" ||
            d?.nama == "KUMULATIF LABA (RUGI)")
      )?.rumusAkun?.rumus
    );
    const rumusLabaKumulatif = JSON.parse(
      data?.rumus?.find((d) => d.id == labaKumulatifRumusId)?.rumus || "[]"
    );
    const totalLabaRugiKumulatif = hitungLabaRugiArus(
      kategori?.kategori,
      hasil,
      rumusLabaKumulatif,
      data?.akun,
      "total",
      1
    );

    return { totalLabaRugiKumulatif, hasilRumus };
  }
};
