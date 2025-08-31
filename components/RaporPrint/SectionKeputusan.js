import { FaPen } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import ModalEditBio from "../Profil/ModalEditBio";
import { postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { useState } from "react";
import toast from "react-hot-toast";
import { hideModal } from "../../utilities/ModalUtils";

const SectionKeputusan = ({
  isReadOnly = false,
  ta,
  keterangan,
  kenaikan,
  sekolah,
  tingkat,
}) => {
  const values = new Map([
    ["I", 1],
    ["V", 5],
    ["X", 10],
  ]);

  function romanToInt(string, hasil) {
    let result = 0,
      current,
      previous = 0;
    for (const char of string.split("").reverse()) {
      current = values.get(char);
      if (current >= previous) {
        result += current;
      } else {
        result -= current;
      }
      previous = current;
    }
    if (hasil == true) {
      return result + 1;
    } else if (hasil == false) {
      return result;
    }
  }

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
  function convert_hundreds(num) {
    if (num > 99) {
      return (
        ones[Math.floor(num / 100)] + " hundred " + convert_tens(num % 100)
      );
    } else {
      return convert_tens(num);
    }
  }
  return (
    <>
      <div
        className="border border-dark border-2 p-3"
        style={{ borderColor: "#000000" }}
      >
        <h6 className="mb-2 fs-14-ss fw-semibold">Keputusan:</h6>
        <p className="mb-2 fs-12-ss">
          {sekolah?.id == 13 || sekolah?.id == 578 ? (
            "BERDASARKAN RAPAT DEWAN GURU PADA TANGGAL 23 JUNI 2022, PESERTA DIDIK DINYATAKAN:"
          ) : sekolah?.id == 15 && kenaikan == "XII" ? (
            "BERDASARKAN RAPAT DEWAN GURU, PESERTA DIDIK DINYATAKAN:"
          ) : sekolah?.id == 33 && kenaikan == "XII" ? (
            <div>
              Berdasarkan pencapaian kompetensi dari semester ke-1 sampai dengan
              ke-6 dan rapat dewan guru , peserta didik ditetapkan*):
            </div>
          ) : (
            <div>
              Berdasarkan pencapaian kompetensi pada semester ke-
              {kenaikan == "X"
                ? 1
                : kenaikan == "XI"
                ? 3
                : kenaikan == "XII"
                ? 5
                : ta?.semester}{" "}
              dan ke-
              {kenaikan == "X"
                ? 2
                : kenaikan == "XI"
                ? 4
                : kenaikan == "XII"
                ? 6
                : ta?.semester}{" "}
              dan rapat dewan guru , peserta didik ditetapkan*):
            </div>
          )}
        </p>
        {kenaikan == "XII" ? (
          <>
            {sekolah?.id == 15 ? (
              <>
                <p className="mb-2 fs-12-ss ">Lulus</p>
                <p className="mb-5 fs-12-ss text-decoration-line-through ">
                  Tidak Lulus
                </p>
              </>
            ) : keterangan?.kelulusan == "naik" ||
              keterangan?.kelulusan == "lulus" ? (
              <>
                <p className="mb-2 fs-12-ss ">Lulus</p>
                <p className="mb-5 fs-12-ss text-decoration-line-through ">
                  Tidak Lulus
                </p>
              </>
            ) : (
              <>
                <p className="mb-2 fs-12-ss text-decoration-line-through ">
                  Lulus
                </p>
                <p className="mb-5 fs-12-ss ">Tidak Lulus</p>
              </>
            )}
          </>
        ) : (
          <>
            {(ta?.id == 41 && kenaikan == "X") ||
            (ta?.id == 8186 && kenaikan == "XI") ? (
              <>
                <p className="mb-2 fs-12-ss ">
                  naik ke kelas{" "}
                  {!kenaikan
                    ? `-`
                    : `${romanToInt(kenaikan, true)} ( ${convert_hundreds(
                        romanToInt(kenaikan, true)
                      )} )`}
                </p>
                <p className="mb-5 fs-12-ss text-decoration-line-through ">
                  tinggal di kelas{" "}
                  {!kenaikan
                    ? `-`
                    : `${romanToInt(kenaikan, false)} (
                ${convert_hundreds(romanToInt(kenaikan, false))} )`}
                </p>
              </>
            ) : keterangan?.kelulusan == "naik" ||
              keterangan?.kelulusan == "lulus" ? (
              <>
                <p className="mb-2 fs-12-ss ">
                  naik ke kelas{" "}
                  {!kenaikan
                    ? `-`
                    : `${romanToInt(kenaikan, true)} ( ${convert_hundreds(
                        romanToInt(kenaikan, true)
                      )} )`}
                </p>
                <p className="mb-5 fs-12-ss text-decoration-line-through ">
                  tinggal di kelas{" "}
                  {!kenaikan
                    ? `-`
                    : `${romanToInt(kenaikan, false)} (
                ${convert_hundreds(romanToInt(kenaikan, false))} )`}
                </p>
              </>
            ) : (
              <>
                <p className="mb-2 fs-12-ss text-decoration-line-through ">
                  naik ke kelas{" "}
                  {!kenaikan
                    ? `-`
                    : `${romanToInt(kenaikan, true)} ( ${convert_hundreds(
                        romanToInt(kenaikan, true)
                      )} )`}
                </p>
                <p className="mb-5 fs-12-ss ">
                  tinggal di kelas{" "}
                  {!kenaikan
                    ? `-`
                    : `${romanToInt(kenaikan, false)} (
                ${convert_hundreds(romanToInt(kenaikan, false))} )`}
                </p>
              </>
            )}
          </>
        )}

        <p className="mb-0 fs-12-ss">*) Coret yang tidak perlu.</p>
      </div>
    </>
  );
};

export default SectionKeputusan;
