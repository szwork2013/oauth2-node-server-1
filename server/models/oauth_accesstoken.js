import mongoose from "mongoose";
import APIError from "../helpers/APIError";
import httpStatus from "http-status";

const OAuthAccessTokensSchema = new mongoose.Schema({
    accessToken: {type: String, required: true, unique: true},
    clientId: String,
    userId: {type: String, required: true},
    expires: Date
});


const OAuthAccessTokensModel = mongoose.model('oauth_accesstokens', OAuthAccessTokensSchema);

function getAccessToken(bearerToken) {
    return new Promise((resolve, reject) => {
        OAuthAccessTokensModel.findOne({accessToken: bearerToken},
            (err, token) => {
                if (err || !token) {
                    resolve(token)
                } else {
                    reject(new APIError('getAccessToken', httpStatus.FORBIDDEN));
                }
            });
    })

}

function saveAccessToken (token, clientId, expires, userId) {
    return new Promise((resolve, reject) => {
        const fields = {
            clientId: clientId,
            userId: userId.id,
            expires: expires
        };

        OAuthAccessTokensModel.update({accessToken: token}, fields, {upsert: true},
            (err, modifier) => {
                if (err) {
                    reject(new Promise(new APIError('saveAccessToken', httpStatus.NOT_ACCEPTABLE)));
                } else {
                    resolve(modifier);
                }
            });
    })
}

export default {saveAccessToken, getAccessToken}
