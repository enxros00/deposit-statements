import React, { useState } from "react";
import dayjs from 'dayjs'
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)
// import "@mui/x-date-pickers/dist/DatePicker.css";

function DatePickerBirthdate() {
  const [selectedDate, setSelectedDate] = useState(new dayjs());

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  function validateDate(date) {
    if(!date.isSameOrAfter(dayjs().subtract(35, "month"), "month")){
      setSelectedDate("")
    } 
    // return !date.isSameOrAfter(dayjs().subtract(35, "month"), "month");
  }

  return (
    <div>
      <h2>Selected Date: {selectedDate.toString()}</h2>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          views={["year", "month"]}
          inputFormat="MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
          minDate={dayjs().subtract(35, "month")}
          maxDate={dayjs()}
          shouldDisableDate={validateDate}
        />
      </LocalizationProvider>
    </div>
  );
}

export default DatePickerBirthdate;


// export default DatePickerBirthdate;
