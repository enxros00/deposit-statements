import React from 'react'

import DatePickerBirthdate from "../Datepicker/DatePickerBirthdate";
import dayjs from 'dayjs'

function Home() {
  const [ birth_date, setBirth_date ] = React.useState("")
  return (
    <div>Home
      <DatePickerBirthdate
        value={birth_date}
        handleDateChange={(date, name) =>
          this.handleDateChange(date, name)
        }
        isThai
        max={dayjs()}
        label={"วันเดือนปีเกิด"}
        name={"birth_date"}
        type={"multiple"}
        DisableStatus={true}
      />
    </div>
  )
}

export default Home