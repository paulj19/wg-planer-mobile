import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as secureStorage from "../util/storage/SecureStore";
import {StoredItems} from "../util/storage/SecureStore";
import {BASE_URL_DEV} from "./UrlPaths";
import {initializeMocks} from "./MockRequests";

const client = axios.create({baseURL: BASE_URL_DEV});

axiosRetry(client, {
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 1000;
    },
    retryCondition: (error) => {
        // if retry condition is not specified, by default idempotent requests are retried
        return 500 <= error.response.status && error.response.status < 600;
    },
    retries: 3
});

client.interceptors.request.use(async (config) => {
        //todo make this fetch and set parallel vs cost of making things parallel
        //do profiling, secure store has cache?
        //why await?
        const accessToken = await secureStorage.load(StoredItems.ACCESS_TOKEN).catch(() => null);
        const refreshToken = await secureStorage.load(StoredItems.REFRESH_TOKEN).catch(() => null);
        if (accessToken) {
            config.headers.authentication = 'Bearer: '.concat(accessToken);
        }
        if (refreshToken) {
            config.headers.refresh_token = refreshToken;
        }
        //else if(not includes in non-auth urls) {
        //redirect to login page with correct nav.stack/can return to target url
        //}
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)
client.interceptors.response.use(async function (response) {
        let accessToken = response.headers.authentication?.substring("Bearer: ".length);
        let refreshToken = response.headers.refresh_token;
        //verify if idempotent
        if (accessToken) {
            await secureStorage.save(StoredItems.ACCESS_TOKEN, accessToken);
        }
        if (refreshToken) {
            await secureStorage.save(StoredItems.REFRESH_TOKEN, refreshToken);
        }
        //if 2xx and no auth token do nothing, hoping next request would give a 401
        return response;
    }, function (error) {
        //xxx if access token null, clear previous => only for /validate => clear in /validate
        //401 => login screen
        return Promise.reject(error);
    }
)

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    // initializeMocks(client);
}
export default client;
