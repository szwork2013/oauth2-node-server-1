import AuthCode from "./oauth_authcode";
import RefreshToken from "./oauth_refreshtoken";
import AccessToken from "./oauth_accesstoken";
import User from "./user";
import Client from "./oauth_client";

// node-oauth2-server API
const getAuthCode = AuthCode.getAuthCode;
const saveAuthCode = AuthCode.saveAuthCode;
const getAccessToken = AccessToken.getAccessToken;
const saveAccessToken = AccessToken.saveAccessToken;
const saveRefreshToken = RefreshToken.saveRefreshToken;
const getRefreshToken = RefreshToken.getRefreshToken;
const getUser = User.getUser;
const getClient = Client.getClient;
const grantTypeAllowed = Client.grantTypeAllowed;

export default {
    getAuthCode,
    saveAuthCode,
    getAccessToken,
    saveAccessToken,
    saveRefreshToken,
    getRefreshToken,
    getUser,
    getClient,
    grantTypeAllowed
};
