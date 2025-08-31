import TextareaAutosize from "react-textarea-autosize";

const SectionKontakSekolah = ({ formData, handleChangeForm }) => {
  return (
    <>
      <div
        className="card-body px-4 pt-4 pb-0 mb-5"
        data-joyride="kontak-sekolah"
      >
        <h4 className="fw-extrabold color-dark title-border mb-5">
          Kontak Sekolah
        </h4>
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">Email Sekolah</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              placeholder="Masukan email Sekolah sekolah"
              name="email"
              value={formData.email}
              onChange={handleChangeForm}
            />
          </div>{" "}
          <div className="col-md-6">
            <div data-joyride="nomor-telpon">
              <label className="form-label">Nomor Telpon</label>
              <input
                type="number"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan nomor telpon sekolah"
                name="telp"
                value={formData.telp}
                onChange={handleChangeForm}
              />
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <div data-joyride="nomor-telpon">
              <label className="form-label">Kode Pos</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan Kode Pos sekolah"
                name="kodePos"
                value={formData.kodePos}
                maxLength={255}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div data-joyride="nomor-fax">
              <label className="form-label">Link Web Sekolah</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan Link Website sekolah"
                name="linkWeb"
                value={formData.linkWeb}
                maxLength={255}
                onChange={handleChangeForm}
              />
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <div data-joyride="nomor-telpon">
              <label className="form-label">Link E-Rapor</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan Link E rapor sekolah"
                name="linkRapor"
                value={formData.linkRapor}
                maxLength={255}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div data-joyride="nomor-fax">
              <label className="form-label">Link Dapodik</label>
              <input
                type="text"
                className="form-control"
                autoComplete="off"
                placeholder="Masukan Link dapodik sekolah"
                name="linkDapodik"
                value={formData.linkDapodik}
                maxLength={255}
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

export default SectionKontakSekolah;
