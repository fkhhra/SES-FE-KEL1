import { Tooltip } from "antd";

const CardLampiran = ({ onClick, iconLeft = "", text = "", customClass="col-md-6" }) => {
  return (
    <div className={customClass} onClick={() => onClick && onClick()}>
      <div className="bg-soft-primary rounded-ss p-3 d-flex align-items-center w-100 pointer">
        <img
          width="40px"
          height="40px"
          src={iconLeft}
          alt={iconLeft}
          className="me-3"
        />
        <Tooltip title={text}>
          <span className="fw-bold color-dark text-truncate">{text}</span>
        </Tooltip>
      </div>
    </div>
  );
};

export default CardLampiran;