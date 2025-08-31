import React from "react";

const FileAttachment = ({ href, nama = "", icon, onClick }) => {

  let fileAttachmentProps = {
    className: "file-attachment-ss d-flex align-items-center p-3 rounded-ss w-100 pointer",
    href: href,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: onClick
  }

  if (href) {
    delete fileAttachmentProps.onClick
  } else {
    delete fileAttachmentProps.href;
    delete fileAttachmentProps.target;
    delete fileAttachmentProps.rel;
  }

  return (
    <a {...fileAttachmentProps}>
      <img
        src={`/img/icon-${icon == "file-download" ? "file-download" : "file"}.svg`}
        alt="file"
      />
      <h6 className="fw-bold color-dark ms-3 mb-0">{nama}</h6>
    </a>
  );
};

export default FileAttachment;
