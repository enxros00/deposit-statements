import dayjs from "dayjs"

const formatDate = "DD-MM-YYYY HH:mm:ss"
const HeaderFullRequest = async () => {
    const system_name = import.meta.env.VITE_REACT_APP_SYSTEM_DSE
    const teller_id = "AL94071"
    // await CheckTellerID("ACCOUNT")
    const header = {
        "Content-Type": "application/json",
        teller_id: teller_id,
        system_name: system_name,
        dateTime: dayjs().format(formatDate),
    }
    return header
}

export { HeaderFullRequest } 