import { FaPen, FaTrashAlt } from "react-icons/fa";

const CardBukuKerja = ({
  title,
  titleElement = "h5",
  topLabel = [],
  bottomLabel = [],
  onClick,
  withDropdown,
  backgroundIcon = "/img/icon-background-card-buku-kerja.svg",
  colClass = "col-md-6",
  penyusun,
}) => {
  const wrapperElement = `<${titleElement} class="color-dark fw-black mb-2">${title}</${titleElement}>`;

  const isTopLabelExist = topLabel?.length > 0;

  return (
    <a className={colClass} onClick={() => onClick && onClick()}>
      <div
        className="card-ss py-4 px-3 bg-white"
        style={{ position: "relative", minHeight: "107px" }}
      >
        {(withDropdown || topLabel?.length > 0) && (
          <div className="d-flex align-items-start justify-content-between flex-column flex-sm-row">
            <div className="order-2 order-sm-0 mb-2 d-flex align-items-center">
              {isTopLabelExist &&
                topLabel?.map((label, index) => (
                  <span
                    className="bg-primary text-white rounded-pill fs-12-ss label-ss"
                    key={`${index}-${new Date().getTime()}`}
                  >
                    {label?.text}
                  </span>
                ))}
              {!isTopLabelExist && (
                <div dangerouslySetInnerHTML={{ __html: wrapperElement }} />
              )}
            </div>
            {withDropdown && (
              <div className="dropdown dropdown-ss order-1 order-sm-0 ms-auto ms-sm-0">
                <div
                  className="ellipsis-h m-0 d-flex justify-content-end"
                  role="button"
                  id={withDropdown?.dropdownId}
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={`/img/icon-dropdown-option.svg`}
                    alt="icon-option"
                    className="ps-3 pb-4"
                  />
                </div>
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1"
                  aria-labelledby={withDropdown?.dropdownId}
                >
                  <li
                    className="d-flex align-items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      withDropdown?.onClickEdit && withDropdown?.onClickEdit();
                    }}
                  >
                    <a className="dropdown-item color-secondary">
                      <FaPen /> &nbsp; Edit
                    </a>
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      withDropdown?.onClickDelete &&
                        withDropdown?.onClickDelete();
                    }}
                  >
                    <a className="dropdown-item color-danger">
                      <FaTrashAlt /> &nbsp; Hapus
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        {(isTopLabelExist || !withDropdown) && (
          <div dangerouslySetInnerHTML={{ __html: wrapperElement }} />
        )}
        <div className="d-flex align-items-center">
          {bottomLabel?.length > 0 &&
            bottomLabel?.map((label, index) => (
              <div
                className="d-flex align-items-center me-2"
                key={`${index}-${new Date().getTime()}`}
              >
                <img src={label.icon} className="me-2" />
                <p className="color-primary mb-0">{label.text}</p>
              </div>
            ))}
        </div>
        <img
          src={backgroundIcon}
          style={{
            position: "absolute",
            bottom: penyusun ? "66px" : "0",
            right: "0",
            pointerEvents: "none",
          }}
        />
        {penyusun && (
          <>
            <hr
              className="mt-3 color-secondary"
              style={{ margin: "0 -16px" }}
            />
            <p className="mb-0 mt-3 color-secondary fw-bold">{penyusun}</p>
          </>
        )}
      </div>
    </a>
  );
};

export default CardBukuKerja;
