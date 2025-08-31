import { editTimeline } from "client/TimelineClient";
import Editor from "components/Shared/Editor/Editor";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";

const JurnalHarian = ({ detailData, _getDetailTimeline }) => {

  const postJurnalHarian = async () => {

    const jurnal = window.$(`#editorJurnalHarian`).summernote("code") === "<br>" ? null : window.$(`#editorJurnalHarian`).summernote("code");

    let body = {
      jurnal: jurnal,
      id: detailData?.id,
      tipe: "absen",
      deskripsi: detailData?.deskripsi
    }

    const { data } = await editTimeline(detailData?.id, body);
    if (data) {
      toast.success(data?.message);
      _getDetailTimeline(null, false);
    }
  }

  return (
    <div className="row mt-4">
      <div className="col-md-12" data-joyride="jurnal">
        <h4 className="color-dark fw-bold m-0 mb-4">Jurnal Harian</h4>
        <Editor id="editorJurnalHarian" defaultValue={detailData?.jurnal} />
        <div className="mt-3 d-flex justify-content-end">
          <ReactiveButton
            // buttonState={buttonJurnal}
            onClick={postJurnalHarian}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className="btn btn-primary bg-gradient-primary rounded-pill py-2 fs-6 fw-bold"
          />
        </div>
      </div>
    </div>
  )
}

export default JurnalHarian;