import SoalInfo from "./CardHasilJawabanTugas/SoalInfo";
import Header from "./CardHasilJawabanTugas/Header";
import AudioPlayer from "components/Shared/AudioPlayer/AudioPlayer";
import OpsiPilihanGanda from "./CardHasilJawabanTugas/OpsiPilihanGanda";
import Pembahasan from "./CardHasilJawabanTugas/Pembahasan";
import Pertanyaan from "./CardHasilJawabanTugas/Pertanyaan";
import OpsiPenilaianRubrik from "./CardHasilJawabanTugas/OpsiPenilaianRubrik";
import JawabanEsai from "./CardHasilJawabanTugas/JawabanEsai";

const CardHasilJawabanTugas = ({
  soal,
  jawaban,
  totalSoal,
  index,
  _getDetailTimeline
}) => {

  const bentuk = soal?.soal?.bentuk;
  const jawabanPilihanGandaBenar = soal?.soal?.kjPg === jawaban?.jawabanPg;

  return (
    <div className="detail-jawaban-peserta-pg card bg-white rounded-ss mb-4" style={{ border: "1px solid #E1E1E7" }}>
      <Header
        jawabanPilihanGandaBenar={jawabanPilihanGandaBenar}
        bentuk={bentuk}
        jawaban={jawaban}
      />

      <div className="card-body p-4">
        <SoalInfo
          index={index}
          totalSoal={totalSoal}
          soal={soal}
          jawaban={jawaban}
          bentuk={bentuk}
          jawabanPilihanGandaBenar={jawabanPilihanGandaBenar}
        />

        { jawaban?.soal?.audio &&
          <AudioPlayer
            customContainerClass="mb-4"
            src={jawaban?.soal?.audio}
          />
        }

        <Pertanyaan soal={soal} />

        { bentuk === "esai" && <JawabanEsai jawaban={jawaban} />}

        { bentuk === "pg" &&
          <OpsiPilihanGanda
            jawaban={jawaban}
            soal={soal}
          />
        }

        <Pembahasan
          bentuk={bentuk}
          soal={soal}
        />

        { bentuk === "esai" &&
          <OpsiPenilaianRubrik
            soal={soal}
            jawaban={jawaban}
            _getDetailTimeline={_getDetailTimeline}
          />
        }
      </div>
    </div>
  )
}

export default CardHasilJawabanTugas;