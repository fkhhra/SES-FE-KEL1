import ctl from "@netlify/classnames-template-literals"

const AlertNotification = ({ onClick, children, type="warning" }) => {

  const AlertNotificationCN = ctl(`
    pointer
    w-100
    d-flex
    justify-content-center
    text-white
    py-3
    px-4
    notification-bar-verification
    alert-notification
    ${ type == "warning"
      ? "bg-warning"
      : type == "danger"
      ? "bg-danger"
      : type == "info"
      && "bg-primary"
    }
  `);

  return (
    <div
      className={AlertNotificationCN}
      onClick={() => onClick && onClick()}
    >
      <div className="d-flex align-items-sm-center align-items-start">
        <img
          src="/img/exclamation-notification-bar.svg"
          alt="icon"
          className="me-3"
        />
          {children}
      </div>
    </div>
  )
}

export default AlertNotification