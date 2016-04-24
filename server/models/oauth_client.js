import mongoose from "mongoose";
import APIError from "../helpers/APIError";
import httpStatus from "http-status";

var authorizedClientIds = ['op'];

const OAuthClientsSchema = new mongoose.Schema({
    clientId: String,
    clientSecret: String,
    redirectUri: String
});

const OAuthClientsModel = mongoose.model('oauth_clients', OAuthClientsSchema);

OAuthClientsSchema.statics = {
    getClient: function (clientId, clientSecret) {
        return new Promise((resolve, reject) =>{
            var params = {clientId: clientId};
            if (clientSecret != null) {
                params.clientSecret = clientSecret;
            }
            OAuthClientsModel.findOne(params, (err, client) => {
                if (err || !client) {
                    reject(new APIError('getClient error', httpStatus.FORBIDDEN));
                } else {
                    resolve(client);
                }
            });
        })
    },

    grantTypeAllowed: function (clientId, grantType) {
        return new Promise((resolve, reject) => {
            if (grantType === 'password' || grantType === 'authorization_code') {
                resolve(authorizedClientIds.indexOf(clientId) >= 0);
            } else {
                reject(new APIError('grantTypeAllowed', httpStatus.NOT_ACCEPTABLE))
            }
        });
    }
};



export default OAuthClientsModel;
