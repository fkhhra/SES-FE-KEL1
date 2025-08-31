import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";

const AutoplaySlider = withAutoplay(AwesomeSlider);

const TvSlider = ({ children }) => {
  return (
    <AutoplaySlider
      play={true}
      interval={4000}
      infinite={true}
      transitionDelay={2000}	
    >
      {children}
    </AutoplaySlider>
  );
};

export default TvSlider;
