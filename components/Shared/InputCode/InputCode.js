import React, { useState, useRef } from "react";

const InputCode = ({ length, label, loading, onComplete }) => {
  const [code, setCode] = useState([...Array(length)].map(() => ""));
  const inputs = useRef([]);
  // Typescript
  // useRef<(HTMLInputElement | null)[]>([])

  const processInput = (e, slot) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (slot !== length - 1) {
      inputs.current[slot + 1].focus();
    }
    if (newCode.every((num) => num !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const onKeyDown = (e, slot) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1].focus();
    }
  };

  const onPaste = (e, slot) => {
    const newCode = [...code];
    const pasteText = e.clipboardData.getData("Text");
    for (let i = slot; i < length; i++) {
      if (/[^0-9]/.test(pasteText.charAt(i))) return;
      newCode[i] = pasteText.charAt(i);
    }
    setCode(newCode);
    if (slot !== length - 1) {
      inputs.current[
        pasteText.length > length ? length - 1 : pasteText.length - 1
      ].focus();
    }
    if (newCode.every((num) => num !== "")) {
      onComplete(newCode.join(""));
    }
  };

  return (
    <div className="code-input">
      <label className="code-label d-none">{label}</label>
      <div className="code-inputs">
        {code.map((num, idx) => {
          return (
            <input
              className="form-control"
              key={`${idx}-${new Date().getTime()}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={num}
              autoFocus={!code[0].length && idx === 0}
              readOnly={loading}
              onChange={(e) => processInput(e, idx)}
              onKeyDown={(e) => onKeyDown(e, idx)}
              ref={(ref) => inputs.current.push(ref)}
              onPaste={(e) => onPaste(e, idx)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InputCode;
