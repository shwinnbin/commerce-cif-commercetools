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

'use strict';

const assert = require('chai').assert;
const setup = require('../lib/setupTest').setup;
const samplecart1 = require('../resources/sample-cart');
const config = require('../lib/config').config;

/**
 * Describes the unit tests for commerce tools cart shipping method operation.
 */
describe('commercetools postShippingMethod', () => {

    describe('Unit Tests', () => {

        //build the helper in the context of '.this' suite
        setup(this, __dirname, 'postShippingMethod');

        it('POST /cart/{id}/shippingmethod HTTP 400 - missing cart id', () => {
            return this.execute()
                       .then(result => {
                           assert.isDefined(result.response);
                           assert.isDefined(result.response.error);
                           assert.strictEqual(result.response.error.message, 'Parameter \'id\' is missing.');
                       });
        });

        it('POST /cart/{id}/shippingmethod HTTP 400 - missing shipping method parameter', () => {
            return this.execute({'id': '12345'})
                       .then(result => {
                           assert.isDefined(result.response);
                           assert.isDefined(result.response.error);
                           assert.strictEqual(result.response.error.name, 'MissingPropertyError');
                       });
        });

        it('POST /cart/{id}/shippingmethod HTTP 200 ', () => {
            const args = {
                id: '12345-7',
                shippingMethodId: '6f0b3638-73a5-4d80-8455-081d3e9f98bb',
                __ow_headers: {
                    'accept-language': 'en-US'
                }
            };
            const expectedArgs = [{
                uri: encodeURI(
                    `/${config.CT_PROJECTKEY}/carts/12345?${config.CART_EXPAND_QS}`),
                method: 'GET',
                headers: undefined
            }, {
                uri: encodeURI(
                    `/${config.CT_PROJECTKEY}/carts/12345?${config.CART_EXPAND_QS}`),
                method: 'POST',
                body: `{"actions":[{"action":"setShippingMethod","shippingMethod":{"typeId":"shipping-method","id":"6f0b3638-73a5-4d80-8455-081d3e9f98bb"}}],"version":7}`,
                headers: undefined
            }];
            return this.prepareResolve(samplecart1, expectedArgs)
                       .execute(args)
                       .then(result => {
                           assert.isUndefined(result.response.error, JSON.stringify(result.response.error));
                           assert.isDefined(result.response);
                           assert.strictEqual(result.response.statusCode, 200);
                           assert.isDefined(result.response.body);
                       });
        });

    });
});

