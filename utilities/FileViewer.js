import fileTypes from "data/supported-file-types.json";
import officeTypes from "data/office-live-types.json";

export const getPreviewURL = (file) => {
  if (file) {
    const fileName = file
      .split("?")[0]
      .replace(
        "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/",
        ""
      );
    const type =
      fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
      fileName;

    return ["PNG", "JPEG", "JPG"].includes(type.toUpperCase())
      ? file
      : officeTypes.includes(type.toUpperCase())
      ? `http://view.officeapps.live.com/op/view.aspx?src=${file}`
      : fileTypes.includes(type.toUpperCase())
      ? `https://drive.google.com/viewerng/viewer?url=${file}`
      : file;
  }
};

export const getFileName = (file) => {
  if (file) {
    return file
      .split("?")[0]
      .replace(
        "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/",
        ""
      );
  }
};

export const getFileType = (file) => {
  const fileName = file
    .split("?")[0]
    .replace(
      "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/",
      ""
    );
  return (
    fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
    fileName
  );
};
