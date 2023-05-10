import { HeaderFullRequest } from "../../utils/headers"
import { UNAUTHORIZE_CODE, NOT_ALLOW } from "../../constants/authorizeConstant";
import apiCallGlobal from "../../utils/apiCallGlobal";

const GetStatements = async function (requestGetStatment) {
    const header = await HeaderFullRequest();
    try {
        return await apiCallGlobal 
            .post(
                window.$API_CUSTOMER_URL + "get-statements",
                JSON.stringify(requestGetStatment),
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

const GetStatementsMock = async function (requestGetStatment) {
    try {
        return await apiCallGlobal 
            .get(`/get_statements`)
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

export { GetStatements, GetStatementsMock }