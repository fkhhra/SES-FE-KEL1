import ReactiveButton from "reactive-button";
import NewModal from "components/Shared/NewModal/NewModal";
import { useEffect, useState } from "react";
import { editBab, postBab } from "client/BabClient";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import useEditModal from "hooks/useEditModal";

const initialFormData = {
  judul: ""
}

const ModalBuatBab = ({ mMateriId, _getDetailMateri }) => {

  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);

  const editModalData = useEditModal(state => state.editModal?.modalBuatBab);

  const onChangeFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  }

  const saveBab = async () => {
    setButtonState("loading");
    let body = {
      ...formData,
      mMateriId
    }
    const { data } = editModalData ? await editBab(editModalData?.id, body) : await postBab(body);
    if (data) {
      setButtonState("success");
      toast.success(data?.message);
      _getDetailMateri();
      setFormData(initialFormData);
      hideModal("modalBuatBab");
    }

    setTimeout(() => {
      setButtonState("idle");
    }, 1000)
  }

  useEffect(() => {
    if (editModalData) {
      setFormData({ judul: editModalData?.judul });
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="modalBuatBab"
      modalSize="md"
      title={
        <>
          <h4 className="mb-0 fw-extrabold">
            {`${editModalData ? "Ubah" : "Buat"} BAB`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${editModalData ? "mengubah" : "membuat"} BAB`}
          </span>
        </>
      }
      content={
        <>
          <h6 className="fs-18-ss fw-bold color-dark mb-4">Judul</h6>
          <input
            required
            className="form-control"
            autoComplete="off"
            placeholder="Tuliskan Judul BAB"
            value={formData.judul}
            onChange={(e) => onChangeFormData("judul", e.target.value)}
          />
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={saveBab}
          color={"primary"}
          idleText={`${editModalData ? "Ubah" : "Buat"} BAB`}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          className={"btn btn-primary"}
        />
      }
    />
  )
}

export default ModalBuatBab;