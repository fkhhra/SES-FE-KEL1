import React, { useState } from "react";
import { getPreviewURL } from "utilities/FileViewer";
import { FaFile, FaTimes } from "react-icons/fa";

export const FileViewerComponent = React.memo(
  ({ d, handleDelete }) => {
    const [name, setName] = useState(d);

    const [path] = ("" + d).split("?");
    fetch(path)
      .then((response) => response.json())
      .then((data) => {
        const { name } = data;
        setName(name);
      });
    return (
      <div className="bg-soft-primary p-3 rounded-ss mb-2">
        <div className="file-content d-flex align-items-center justify-content-between flex-wrap">
          <a href={getPreviewURL(d)} target="_blank" rel="noreferrer noopener">
            <div className="d-flex">
              <div
                className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                style={{
                  width: "48px",
                  height: "48px",
                }}
              >
                <FaFile />
              </div>
              <div className="p-2 d-flex flex-column">
                <p className="fw-bold color-dark mb-1 text-break">{name}</p>
                {/* <p className="fs-12-ss fw-bold color-secondary mb-0">
            PDF
          </p> */}
              </div>
            </div>
          </a>

          {handleDelete ? (
            <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
              <FaTimes
                className="text-secondary pointer"
                onClick={() => handleDelete()}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  },
  (prev, next) => {
    return prev.d === next.d;
  }
);
