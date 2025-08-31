import { InputNumber } from "antd";
import React from "react";

const InputJumlahSoal = ({ handleChangeForm, value, maks, name }) => {
  return (
    <>
      <InputNumber
        className="form-control w-100"
        placeholder="0 Soal"
        name={name}
        value={value}
        max={maks}
        min={0}
        onChange={(e) =>
          handleChangeForm(
            {
              target: {
                name: name,
                value: e,
              },
            },
            null,
            null,
            true
          )
        }
      />
      <span className={`fs-14-ss fw-semibold color-secondary`}>
        Jumlah soal maksimal {maks}
      </span>
    </>
  );
};

export default InputJumlahSoal;
