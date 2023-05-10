import axios from "axios";
// import https from "https";
import { UNAUTHORIZE_CODE, NOT_ALLOW } from "../constants/authorizeConstant";

const isMock = false;

// const httpsAgent = new https.Agent({
//     rejectUnauthorized: false,
//     requestCert: false,
// });

// Please use file name as url + _response.json
const get = async (url, config) => {
    // Case use manual mock
    if (url.endsWith(".json")) {
      return await axios.get(url);
    }
    const mockPath = url.split("/")[url.split("/").length - 1].replace(/[-]/g, "_");
    if (isMock) return await axios.get(`/data/${mockPath}_response.json`);
    return await axios
    .get(url, {
        ...config,
        // httpsAgent,
        headers: config?.header || config?.headers || headers,
    }).then(res => {
        if (res.data?.api_status?.api_code !== "0000") {
          let urlSplit = url.split('/');
          let service = url ? urlSplit[urlSplit.length - 1] : "";
        }
        return res;
    })
    .catch(error => {
        if ( error?.response?.status === UNAUTHORIZE_CODE ) {
        //   handleForbidden();
          return;
        }
        let urlSplit = url.split('/')
        let service = url ? urlSplit[urlSplit.length - 1] : ""
        return error;
    });
};

const post = async (url, body, config) => {

    const mockPath = url.split("/")[url.split("/").length - 1].replace(/[-]/g, "_");
    if (isMock) return await axios.get(`./data/${mockPath}_response.json`);
    return await axios 
        .post(url, body,{
            ...config,
            // httpsAgent,
            headers: config?.header || config?.headers || headers,
        }).then(res => {
            if (res.data?.api_status?.api_code !== "0000") {
                let urlSplit = url.split('/')
                let service = url ? urlSplit[urlSplit.length - 1] : ""
            }
            return res
        }).catch(error => {
            if( error?.response?.status === UNAUTHORIZE_CODE ){
                // handleForbidden();
                return;
            }
            let urlSplit = url.split('/');
            let service = url ? urlSplit[urlSplit.length - 1] : "";
            return error;
        })
}

export default { get, post };