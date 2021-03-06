/*******************************************************************************
 *
 *    Copyright 2018 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/

"use strict";

const HttpStatusCodes = require('http-status-codes');
const CommerceServiceResourceNotFoundError = require('@adobe/commerce-cif-common/exception').CommerceServiceResourceNotFoundError;
const CommerceServiceBadRequestError = require('@adobe/commerce-cif-common/exception').CommerceServiceBadRequestError;
const CommerceServiceForbiddenError = require('@adobe/commerce-cif-common/exception').CommerceServiceForbiddenError;
const UnexpectedError = require('@adobe/commerce-cif-common/exception').UnexpectedError;

function respondWithCommerceToolsError(error, args, resolve, errorType) {

    let errorCode = null;
    let cause = null;

    if(error && error.code) {
        errorCode = error.code;
        cause = error;
    } else if (error && error.body) {
        // latest CT sdk returns a different response for certain invalid requests
        // i.e customer login with bad password
        errorCode = error.body.statusCode;
        cause = { message: error.body.error };
    }

    if (errorCode === HttpStatusCodes.NOT_FOUND) {
        args['response'] =
            {'error': new CommerceServiceResourceNotFoundError('CommerceTools resource not found', cause)};
    } else if (errorCode === HttpStatusCodes.BAD_REQUEST) {
        args['response'] =
            {'error': new CommerceServiceBadRequestError('Bad CommerceTools Request', cause)};
    } else if (errorCode === HttpStatusCodes.FORBIDDEN) {
        args['response'] =
            {'error': new CommerceServiceForbiddenError('Forbidden Request', cause)};
    } else {
        args['response'] = {'error': new UnexpectedError('Unknown error while communicating with CommerceTools', cause)};
    }

    if (args.DEBUG) {
        args.response.headers = args.response.headers || {};
        args.response.headers['OW-Activation-Id'] = process.env.__OW_ACTIVATION_ID;
    }

    args.response.errorType = errorType;
    return resolve(args);
}

module.exports.respondWithCommerceToolsError = respondWithCommerceToolsError;
