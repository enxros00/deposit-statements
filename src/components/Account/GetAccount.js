import { HeaderFullRequest } from "../../utils/headers"
import { UNAUTHORIZE_CODE, NOT_ALLOW } from "../../constants/authorizeConstant"
import apiCallGlobal from "../../utils/apiCallGlobal"

const GetAccount = async function (requesetGetAccount) {
    const header = await HeaderFullRequest()
    try {
        return await apiCallGlobal 
            .post(
                window.$API_CUSTOMER_URL + "get-account",
                JSON.stringify(requesetGetAccount),
                {
                    headers: header,
                }
            )
            .then(async (res) => {
                return res.data
            })
            .catch((error) => {
                console.log(error)
                if ( error?.response?.status === UNAUTHORIZE_CODE &&
                    import.meta.env.VITE_REACT_APP_IS_DUPLICATE_LOGIN === NOT_ALLOW ) {
                    // handleForbidden()
                    return
                }
                return null
            })
    } catch (error) {
        return null
    }
}

const GetAccountCurrent = async function (requesetGetAccount) {
    const header = await HeaderFullRequest()
    try {
        return await apiCallGlobal 
            .post(
                window.$API_CUSTOMER_URL + "current/get-account",
                JSON.stringify(requesetGetAccount),
                {
                    headers: header,
                }
            )
            .then(async (res) => {
                return res.data
            })
            .catch((error) => {
                console.log(error)
                if ( error?.response?.status === UNAUTHORIZE_CODE &&
                    import.meta.env.VITE_REACT_APP_IS_DUPLICATE_LOGIN === NOT_ALLOW ) {
                    // handleForbidden()
                    return
                }
                return null
            })
    } catch (error) {
        return null
    }
}

const GetAccountMock = async function (requesetGetAccount) {
    try {
        return await apiCallGlobal 
            .get(`/get_account`)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                onsole.log(error)
            })
    } catch (error) {
        return null
    }
}

export { GetAccount, GetAccountCurrent, GetAccountMock }
