import React from "react";
import Select, { components } from "react-select";

const SelectShared = ({
  handleChangeSelect,
  name,
  value,
  options,
  isDisabled = false,
  placeholder = "Pilih",
  isImg = false,
  customSelect,
  colorLeft = false,
  customControlClass = "",
  isClearable = false,
}) => {
  const Option = (props) => {
    return isImg ? (
      <components.Option {...props}>
        <div className="option-container">
          {props.data.img && (
            <img
              src={props.data.img}
              alt={props.data.label}
              className="option-image"
            />
          )}
          <div className="option-text">
            <div className="option-label">{props.data.label}</div>
            <div className="option-value">{props.data.value}</div>
          </div>
        </div>
      </components.Option>
    ) : customSelect ? (
      <components.Option {...props}>
        {customSelect(props)}
      </components.Option>
    ) : (
      <components.Option {...props}>
        <div className="option-label">{props.data.label}</div>
      </components.Option>
    );
  };

  const Control = ({ children, ...rest }) => {
    return (
      <components.Control {...rest} className={`custom-control ${customControlClass}`}>
        {colorLeft && (
          <div className="color-indicator" style={{ background: rest.getValue()?.[0]?.value }} />
        )}
        {children}
      </components.Control>
    );
  };

  return (
    <div className="select-wrapper">
      <Select
        components={{ Option, Control }}
        options={options}
        placeholder={placeholder}
        onChange={(e) => handleChangeSelect(e, name)}
        value={options?.filter((d) => d.value === value)}
        isDisabled={isDisabled}
        menuPlacement={"auto"}
        name={name}
        isClearable={isClearable}
      />
    </div>
  );
};

export default SelectShared;
