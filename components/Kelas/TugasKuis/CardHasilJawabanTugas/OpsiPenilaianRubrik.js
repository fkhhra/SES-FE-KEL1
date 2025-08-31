import { editJawabanUjianSiswa } from "client/PesertaUjianClient";
import useUser from "hooks/useUser";
import toast from "react-hot-toast";

const OpsiPenilaianRubrik = ({ soal, jawaban, _getDetailTimeline }) => {

  const { user } = useUser();

  const soalId = soal?.soal?.id;

  const listRubrikKJSoal = JSON.parse(soal?.soal?.rubrikKj || "[]");

  const jawabanRubrikEsai = JSON.parse(jawaban?.jawabanRubrikEsai);

  const isEsaiSalah = jawaban?.dinilai ? jawabanRubrikEsai.findIndex(jawaban => jawaban?.benar) === -1 : false;

  const updatePenilaianEsai = async (e, updateId) => {
    let jawabanRubrik = [...jawabanRubrikEsai];

    jawabanRubrik = jawabanRubrik.map(jawaban => ({
      ...jawaban,
      benar: false
    }));

    const updateIndex = jawabanRubrik.findIndex(({ id }) => id === updateId);
    updateId !== null && (jawabanRubrik[updateIndex].benar = e.target.checked);

    let body = { jawabanRubrikEsai: jawabanRubrik }

    const { data } = await editJawabanUjianSiswa(body, jawaban?.id);
    if (data) {
      toast.success(data.message);
      _getDetailTimeline(null, false);
    }
  }

  return (
    <div>
      <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Rubrik</h6>

      <div className="rubrik-container">
        <div className={`rubrik-items form-check-ss d-flex mb-3 ${isEsaiSalah ? "pe-none" : ""}`}>
          <input className={`form-check-input form-check-input-salah me-3 p-2 ${user?.role == "siswa" ? "pe-none" : ""}`} type="checkbox" id={`rubrik-opsi-salah-${soalId}`} style={{ width: 24, height: 24 }} checked={isEsaiSalah} onChange={(e) => updatePenilaianEsai(e, null)} />
          <label className="form-check form-check-label form-check-label-salah p-4 rounded-ss border border-light-secondary-ss w-100" htmlFor={user?.role == "guru" ? `rubrik-opsi-salah-${soalId}` : ""}>
            <span class="bg-danger text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-3" style={{ width: 75, height: 25 }}>
              0 Poin
            </span>
            <p class="mb-0">Jawaban Salah</p>
          </label>
        </div>

        { listRubrikKJSoal.map((rubrik, index) => {

          const benar = jawabanRubrikEsai?.find(jawaban => jawaban.id === rubrik.id)?.benar;

          return (
            <div class={`rubrik-items form-check-ss d-flex mb-3 ${benar ? "pe-none" : ""}`}>
              <input class={`form-check-input me-3 p-2 ${user?.role == "siswa" ? "pe-none" : ""}`} type="checkbox" id={`rubrik-${soalId}-${index}`} value="" style={{ width: 24, height: 24 }} checked={benar} onChange={(e) => updatePenilaianEsai(e, rubrik.id)} />
              <label class="form-check-label p-4 rounded-ss border border-light-secondary-ss w-100" htmlFor={user?.role === "guru" ? `rubrik-${soalId}-${index}` : ""}>
                <span class="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-3" style={{ width: 75, height: 25 }}>
                  {`${rubrik?.poin} Poin`}
                </span>
                <p class="mb-0">
                  {rubrik?.indikator}
                </p>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OpsiPenilaianRubrik;