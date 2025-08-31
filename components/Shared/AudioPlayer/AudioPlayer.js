import { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { getSekolah } from "client/SekolahClient";

const AudioPlayer = ({ src, customContainerClass }) => {
  const [played, setPlayed] = useState(
    localStorage.getItem("audioPlayed") === "true"
  );

  const [sekolahId, setSekolahId] = useState(null);

  const getSekolahData = async () => {
    try {
      const response = await getSekolah();
      const sekolah = response?.data;
      setSekolahId(sekolah?.id);
    } catch (error) {
      console.log("Error fetching data sekolah:", error);
    }
  };

  useEffect(() => {
    getSekolahData();
  }, []);

  const handleEnded = () => {
    if (!played) {
      setPlayed(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("audioPlayed", played);
  }, [played]);

  return (
    <div className={customContainerClass ? customContainerClass : ""}>
      {/* {sekolahId !== 8921 ? ( */}
      <ReactAudioPlayer
        className="w-100"
        src={src}
        controls
        controlsList="nodownload noremoteplayback nofullscreen"
      />
      {/* // ) : ( */}
      {/* //   <>
      //     {!played ? ( */}
      {/* //       <ReactAudioPlayer */}
      {/* //         className="w-100"
      //         src={src}
      //         controls
      //         controlsList="nodownload noremoteplayback nofullscreen"
      //         onEnded={handleEnded}
      //       />
      //     ) : (
      //       <p className="fw-bold text-primary">Audio telah diputar.</p>
      //     )}
      //   </>
      // )} */}
    </div>
  );
};

export default AudioPlayer;
