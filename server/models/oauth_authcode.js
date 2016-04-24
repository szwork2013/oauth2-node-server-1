import mongoose from "mongoose";
import APIError from "../helpers/APIError";
import httpStatus from "http-status";

const OAuthAuthCodeSchema = new mongoose.Schema({
    authCode: {type: String, required: true, unique: true},
    clientId: String,
    userId: {type: String, required: true},
    expires: Date
});

const OAuthAuthCodeModel = mongoose.model('oauth_authcodes', OAuthAuthCodeSchema);

function getAuthCode(authCode, callback) {
    OAuthAuthCodeModel.findOne({authCode: authCode}, callback);
}

function saveAuthCode(code, clientId, expires, userId) {
    return new Promise((resolve, reject) => {
        const fields = {
            clientId: clientId,
            userId: userId.id,
            expires: expires
        };

        OAuthAuthCodeModel.update({authCode: code}, fields, {upsert: true},
            (err, update) => {
                if (err) {
                    reject(new APIError('saveAuthCode', httpStatus.NOT_ACCEPTABLE));
                } else {
                    resolve(update);
                }
            });
    });
}

export default {getAuthCode, saveAuthCode}