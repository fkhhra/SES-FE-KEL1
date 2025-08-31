import moment from "moment";
import React, { useEffect, useState } from "react";
import { momentPackage } from "../../../utilities/HelperUtils";

const CalendarComponent = ({ events, onClick, currentDate }) => {

  const isValidDate = currentDate ? momentPackage(currentDate)._isValid : false;

  useEffect(() => {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      initialDate: moment(currentDate && isValidDate ? currentDate : new Date()).format("YYYY-MM-01"),
      locale: "id",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      eventClick: (e) => {
        onClick(e);
      },
      events: events,
    });

    calendar.render();
  }, [events]);
  return (
    <div>
      <div id="calendar"></div>
    </div>
  );
};

export default CalendarComponent;
