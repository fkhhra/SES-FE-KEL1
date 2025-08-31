import { storage } from "../config/config";
import slugify from "slugify";
import toast from "react-hot-toast";

export const uploadFile = async (file, checkProgress, fileUrl) => {
  if (file) {
    if (file.size / 100000000 > 1) {
      toast.error("File yang dimasukan Melebihi batas 100MB");
      return;
    }
    const newFileName = `${new Date().getTime()}-${slugify(file?.name)}`;
    const uploadTask = storage.child(newFileName).put(file);

    if (checkProgress && fileUrl) {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          if (checkProgress) {
            checkProgress(progress.toFixed(0));
          }
        },
        (error) => {
          // handle error
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            if (fileUrl) {
              fileUrl(downloadURL);
            }
          });
        }
      );
    } else {
      await uploadTask;
      const url = await storage.child(newFileName).getDownloadURL();

      return url;
    }
  }
};

export const uploadString = async (name, string) => {
  if (name && string) {
    const newFileName = `${new Date().getTime()}-${slugify(name)}`;
    const uploadTask = await storage
      .child(newFileName)
      .putString(string, "data_url");

    const url = await storage.child(newFileName).getDownloadURL();
    return url;
  }
};
