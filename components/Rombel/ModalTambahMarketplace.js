import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import { Select } from "antd";
import { postRombel, putRombel } from "../../client/RombelClient";
import { hideModal } from "../../utilities/ModalUtils";
import SelectShared from "../Shared/SelectShared/SelectShared";
import Editor from "components/Shared/Editor/Editor";
import UploadPhoto from "components/Shared/UploadPhoto.js/UploadPhoto";

const { Option } = Select;

const ModalTambahMarketplace = ({
  editId,
  listTingkat,
  listJurusan,
  listGuru,
  getRombelData,
  editData = {},
}) => {
  const initialFormData = {
    nama: "",
    deskripsi: "",
    linkTokopedia: "",
    linkBukalapak: "",
    linkShopee: "",
    whatsappPic: "",
    foto: "",
    harga: 0,
    discount: 0,
    mUserId: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  const handleModalSubmit = async () => {
    setButtonState("loading");

    const payload = {
      ...formData,
    };

    const { data, error } = editData?.id
      ? await putRombel(editData?.id, payload)
      : await postRombel(payload);
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData(initialFormData);
      getRombelData();
      hideModal("modal-rombel");
    } else {
      toast.error(error?.message);
      setButtonState("error");
    }
  };

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
  };

  return (
    <NewModal
      modalId="modal-marketplace"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {editData?.id ? "Edit" : "Tambah"} marketplace
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk{" "}
            {editData?.id ? "mengubah data marketplace" : "menambah marketplace"}
          </span>
        </>
      }
      content={
        <div>
          <div className="mb-4">
            <label className="form-label">Pilih PIC</label>
            {/* <SelectShared
              name="mUserId"
              handleChangeSelect={handleChangeSelect}
              value={formData.mUserId}
              options={listJurusan}
            /> */}
          </div>

          <div className="mb-4">
            <label htmlFor="whatsappPic" className="form-label">
              Nomor WhatsApp PIC
            </label>
            <input
              className="form-control"
              autoComplete="off"
              value={formData.whatsappPic}
              id="whatsappPic"
              onChange={handleChangeForm}
              type="text"
              placeholder="WhatsApp PIC produk/jasa"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nama" className="form-label">
              Nama Produk/Jasa
            </label>
            <input
              className="form-control"
              autoComplete="off"
              value={formData.nama}
              id="nama"
              onChange={handleChangeForm}
              type="text"
              placeholder="Nama produk/jasa"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="harga" className="form-label">
              Harga
            </label>
            <input
              className="form-control"
              autoComplete="off"
              value={formData.harga}
              id="harga"
              onChange={handleChangeForm}
              type="number"
            />
          </div>

          <div className="pt-4 pb-0 mb-5" data-joyride="galeri-jurusan">
            <h4 className="fw-extrabold color-dark title-border mb-5">
              Galeri Produk/Jasa
            </h4>
            <div>
              <div className="row">
                <UploadPhoto
                  name="galeri"
                  id="uploadPhotoGaleriJurusan"
                  label="Foto Foto Produk/Jasa"
                  listPhoto={formData.galeri}
                  onUpload={(onUpload) =>
                    setButtonState(onUpload ? "loading" : "idle")
                  }
                  onChange={(e, uploadedFile) =>
                    handleChangeForm(e, uploadedFile)
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="discount" className="form-label">
              Discount (%)
            </label>
            <input
              className="form-control"
              autoComplete="off"
              value={formData.discount}
              id="discount"
              onChange={handleChangeForm}
              type="number"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="linkTokopedia" className="form-label">
              Link Tokopedia
            </label>
            <input
              className="form-control"
              autoComplete="off"
              value={formData.linkTokopedia}
              id="linkTokopedia"
              onChange={handleChangeForm}
              type="text"
              placeholder="Link Tokopedia"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="linkBukalapak" className="form-label">
              Link Bukalapak
            </label>
            <input
              className="form-control"
              autoComplete="off"
              value={formData.linkBukalapak}
              id="linkBukalapak"
              onChange={handleChangeForm}
              type="text"
              placeholder="Link Bukalapak"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="linkShopee" className="form-label">
              Link Shopee
            </label>
            <input
              className="form-control"
              autoComplete="off"
              value={formData.linkShopee}
              id="linkShopee"
              onChange={handleChangeForm}
              type="text"
              placeholder="Link Shopee"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="deskripsi" className="form-label">
              Deskripsi
            </label>
            <Editor id="deskripsi" defaultValue={formData?.deskripsi} />
          </div>
        </div>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={handleModalSubmit}
          color={"primary"}
          idleText={"Simpan"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};

export default ModalTambahMarketplace;
