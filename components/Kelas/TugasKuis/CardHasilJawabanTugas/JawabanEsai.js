import { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";

const JawabanEsai = ({ jawaban }) => {

  const [imagesEsaiIndex, setImagesEsaiIndex] = useState(0);
  const [imagesEsai, setImageEsai] = useState([]);
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

  const onClickJawabanEsai = (e) => {
    if (e.target.nodeName === "IMG") {
      const index = imagesEsai?.findIndex(
        (image) => image === e.target.currentSrc
      );
      setImagesEsaiIndex(index);
      setIsLightBoxOpen(true);
    }
  }

  const getImageSource = () => {
    const jawabanString = jawaban?.jawabanEsai;

    let element = document.createElement("div");
    element.innerHTML = jawabanString;

    const images = element.getElementsByTagName("img");
    let imageSrc = [];

    for (var i = 0; i < images.length; i++) {
      imageSrc.push(images[i].src);
    }

    setImageEsai(imageSrc);
  }

  useEffect(() => {
    if (jawaban) {
      getImageSource();
    }
  }, [jawaban]);

  return (
    <div className="mb-4">
      <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Jawaban</h6>
      <div className="konten-pembahasan-soal mb-2">
        <p
          className="mb-0 dangerous-html"
          dangerouslySetInnerHTML={{
            __html: jawaban?.jawabanEsai,
          }}
          onClick={onClickJawabanEsai}
        ></p>
      </div>

      {isLightBoxOpen && (
        <Lightbox
          mainSrc={imagesEsai[imagesEsaiIndex]}
          nextSrc={imagesEsai[(imagesEsaiIndex + 1) % imagesEsai.length]}
          prevSrc={
            imagesEsai[
              (imagesEsaiIndex + imagesEsai.length - 1) % imagesEsai.length
            ]
          }
          onCloseRequest={() => {
            setIsLightBoxOpen(false), setImagesEsaiIndex(0);
          }}
          onMovePrevRequest={() =>
            setImagesEsaiIndex(
              (imagesEsaiIndex + imagesEsai.length - 1) % imagesEsai.length
            )
          }
          onMoveNextRequest={() =>
            setImagesEsaiIndex((imagesEsaiIndex + 1) % imagesEsai.length)
          }
        />
      )}
    </div>
  )
}

export default JawabanEsai;