import React, { useEffect, useRef, useState } from "react";
import { getFileName, getFileType } from "utilities/FileViewer";
import { baseURL } from "../../../client/clientAxios";
import { uploadFile } from "../../../client/uploadFileClient";
import LoadingProgress from "../LoadingProgress/LoadingProgress";
import "mathlive";
import { Button } from "antd";

const Editor = ({
  id,
  defaultValue = "",
  setLoading = () => {},
  ujian,
  soal,
}) => {
  const [progress, setProgress] = useState(0);

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      setProgress(uploadProgress);
    }
    if (uploadProgress == 100) setLoading(false);
  };
  const [value, setValue] = useState("");

  useEffect(() => {
    // set value to editor:
    // get value to editor: window.$(`#${id}`).summernote("code");

    window.$(document).ready(function () {
      window.$(`#${id}`).summernote({
        airMode: false,
        callbacks: {
          onImageUpload: async (files) => {
            setLoading(true);
            setProgress(0);
            await uploadFile(files[0], checkProgress, (data) => {
              if (data) {
                if (
                  getFileType(data).toLowerCase() == "jpeg" ||
                  getFileType(data).toLowerCase() == "jpg" ||
                  getFileType(data).toLowerCase() == "png" ||
                  getFileType(data).toLowerCase() == "gif"
                ) {
                  const img = `<img src="${data}"/>`;
                  // upload image to server and create imgNode...
                  window.$(`#${id}`).summernote("pasteHTML", img);
                } else if (
                  getFileType(data).toLowerCase() == "mp3" ||
                  getFileType(data).toLowerCase() == "m4a"
                ) {
                  const audio = `<audio
                  controls controlsList="nodownload noremoteplayback nofullscreen"
                   src="${data}"></audio>`;
                  window.$(`#${id}`).summernote("pasteHTML", audio);
                } else {
                  const div = `<a href='${data}'>${getFileName(data)}</a>`;
                  window.$(`#${id}`).summernote("pasteHTML", div);
                }
              }
            });
          },
          // onChange: () => onChange(window.$(`#${id}`).summernote("code")),
        },
        toolbar: [
          ["style", ["bold", "italic", "underline"]],
          ["font", ["strikethrough", "superscript", "subscript"]],
          ["fontsize", ["fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["height", ["height"]],
          ["insert", ujian ? ["picture"] : ["link", "picture", "video"]],
        ],
      });

      window.$(`#${id}`).summernote("code", defaultValue);
    });
  }, []);

  const mf = useRef();

  // Customize the mathfield when it is created
  useEffect(() => {
    if (soal) {
      mf.current.mathVirtualKeyboardPolicy = "manual";
      mf.current.addEventListener("focusin", (evt) =>
        window.mathVirtualKeyboard.show()
      );
      mf.current.addEventListener("focusout", (evt) =>
        window.mathVirtualKeyboard.hide()
      );
    }
  }, []);

  // useEffect(() => {
  //   window.$(`#${id}`).summernote("code", value);
  // }, [value]);
  // useEffect(() => {
  //   window.$(`#${id}`).summernote(
  //     "pasteHTML",
  //     `<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  //   <script
  //     id="MathJax-script"
  //     src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
  //   ></script>
  //   <script src="https://unpkg.com/mathlive"></script>`
  //   );
  // }, []);

  useEffect(() => {
    if (typeof window?.MathJax !== "undefined" && soal) {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [value]);

  return (
    <>
      <LoadingProgress progress={progress} />
      {soal && (
        <>
          <math-field ref={mf} onInput={(evt) => setValue(evt.target.value)}>
            {value}
          </math-field>
          <Button
            className="ms-2
        "
            onClick={() => {
              window
                .$(`#${id}`)
                .summernote(
                  "code",
                  `${window.$(`#${id}`).summernote("code")} $$${value}$$`
                );
              setValue("");
            }}
          >
            {" "}
            Input
          </Button>
        </>
      )}

      <textarea
        id={id}
        onChange={(e) => {
          console.log(e);
        }}
        //
      ></textarea>
    </>
  );
};

export default Editor;
