import mongoose from "mongoose";
import APIError from "../helpers/APIError";
import httpStatus from "http-status";

const OAuthRefreshTokensSchema = new mongoose.Schema({
    refreshToken: { type: String, required: true, unique: true },
    clientId: String,
    userId: { type: String, required: true },
    expires: Date
});


const model = mongoose.model('OAuthRefreshTokensSchema', OAuthRefreshTokensSchema);


function saveRefreshToken(token, clientId, expires, userId) {
    return new Promise((resolve, reject) => {
        if (userId.id) {
            userId = userId.id;
        }

        var refreshToken = new model({
            refreshToken: token,
            clientId: clientId,
            userId: userId,
            expires: expires
        });

        refreshToken.save((err, token) => {
            if (err || !token) reject(new APIError('saveRefresh error', httpStatus.FORBIDDEN));
            resolve(token);
        });
    });
}

function getRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
        model.findOne({refreshToken: refreshToken}, (err, token) => {
            // node-oauth2-server defaults to .user or { id: userId }, but { id: userId} doesn't work
            // This is in node-oauth2-server/lib/grant.js on line 256
            if (token) {
                token.user = token.userId;
                resolve(token);
            }
            else {
                reject(new APIError('getRefresh error', httpStatus.NOT_ACCEPTABLE))
            }
        });
    });
}

export default {saveRefreshToken, getRefreshToken};