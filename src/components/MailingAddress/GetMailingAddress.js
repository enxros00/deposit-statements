import { HeaderFullRequest } from "../../utils/headers"
import { UNAUTHORIZE_CODE, NOT_ALLOW } from "../../constants/authorizeConstant";
import apiCallGlobal from "../../utils/apiCallGlobal";

const GetMailingAddress = async function (requestGetMailingAddress) {
    const header = await HeaderFullRequest();
    try {
        return await apiCallGlobal 
            .post(
                window.$API_CUSTOMER_URL + "get-mailing-address",
                JSON.stringify(requestGetMailingAddress),
                {
                    headers: header,
                }
            )
            .then(async (res) => {
                return res.data
            })
            .catch((error) => {
                if ( error?.response?.status === UNAUTHORIZE_CODE &&
                    import.meta.env.VITE_REACT_APP_IS_DUPLICATE_LOGIN === NOT_ALLOW ) {
                    // handleForbidden();
                    return;
                }
                return null;
            })
    } catch (error) {
        return null;
    }
}   

const GetMailingAddressMock = async function (requestGetMailingAddress) {
    try {
        return await apiCallGlobal 
            .get(`/get_mailing_address`)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                onsole.log(error)
            })
    } catch (error) {
        return null;
    }
}

export { GetMailingAddress, GetMailingAddressMock }