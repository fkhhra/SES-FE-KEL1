import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "../../../client/uploadFileClient";
import LoadingProgress from "../LoadingProgress/LoadingProgress";

const InputFile = ({ name, id, onChange, accept, setLoading = () => {} }) => {
  const [progress, setProgress] = useState(0);

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      setProgress(uploadProgress);
    }
    if (uploadProgress == 100) setLoading(false);
  };

  const handleChange = async (e) => {
    setLoading(true);
    if (!e.target.files[0]) {
      setLoading(false);
      return;
    }
    if (e.target.files[0].size / 100000000 > 1) {
      setLoading(false);
      toast.error("File yang dimasukan Melebihi batas 100MB");
      return;
    }
    await uploadFile(e.target.files[0], checkProgress, (fileUrl) => {
      if (fileUrl) {
        onChange(e, fileUrl);
      }
    });
  };

  return (
    <>
      <LoadingProgress progress={progress} />
      <input
        className="form-control d-none"
        type="file"
        name={name}
        id={id}
        accept={accept}
        onChange={handleChange}
      />
    </>
  );
};

export default InputFile;
