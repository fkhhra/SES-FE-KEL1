import React from "react";

const WhatsappLink = ({ phoneNumber, text, children, customClass="" }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      href={`https://wa.me/62${
        phoneNumber?.indexOf("0") == 0 || phoneNumber?.indexOf(0) == 0
          ? phoneNumber?.substring(1)
          : phoneNumber
      }?text=${text}`}
      className={customClass}
    >
      {children}
    </a>
  );
};

export default WhatsappLink;
