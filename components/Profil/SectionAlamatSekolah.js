import TextareaAutosize from "react-textarea-autosize";

const SectionAlamatSekolah = ({ formData, handleChangeForm }) => {
  return (
    <>
      <div
        className="card-body px-4 pt-4 pb-0 mb-5"
        data-joyride="kontak-sekolah"
      >
        <h4 className="fw-extrabold color-dark title-border mb-5">
          Alamat sekolah
        </h4>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-4" data-joyride="alamat-sekolah">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Alamat Sekolah
              </label>
              <TextareaAutosize
                className="form-control"
                autoComplete="off"
                style={{
                  resize: "none",
                  width: "100%",
                  height: "100%",
                }}
                placeholder="Masukan alamat sekolah disini"
                minRows={6}
                name="alamat"
                value={formData.alamat}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4" data-joyride="link-google-maps">
              <label className="form-label">Provinsi</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan nomor telpon sekolah"
                name="provinsi"
                maxLength={255}
                value={formData.provinsi}
                onChange={handleChangeForm}
              />
            </div>
            <div style={{ paddingTop: "6px" }} data-joyride="email-sekolah">
              <label className="form-label">Kabupaten / Kota</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan nomor fax sekolah"
                name="kabupaten"
                maxLength={255}
                value={formData.kabupaten}
                onChange={handleChangeForm}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div data-joyride="nomor-fax">
              <label className="form-label">Kecamatan</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan nomor fax sekolah"
                maxLength={255}
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div data-joyride="nomor-fax">
              <label className="form-label">Kelurahan</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan nomor fax sekolah"
                maxLength={255}
                name="kelurahan"
                value={formData.kelurahan}
                onChange={handleChangeForm}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <hr className="m-0" />
      </div>
    </>
  );
};

export default SectionAlamatSekolah;
