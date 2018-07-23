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

const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
const setup = require('../lib/setupIT.js').setup;

const expect = chai.expect;

chai.use(chaiHttp);


describe('commercetools getProduct', function() {

    describe('Integration tests', function() {

        // Get environment
        let env = setup();

        // Increase test timeout
        this.slow(env.slow);
        this.timeout(env.timeout);

        const productId = '526dc571-104f-40fb-b761-71781a97910b';
        const variantId = `${productId}-2`;

        it('returns a product for a valid product id', function() {
            return chai.request(env.openwhiskEndpoint)
                .get(env.productsPackage + 'getProductById')
                .query({id: productId})
                .set('Accept-Language', 'en-US')
                .then(function (res) {
                    expect(res).to.be.json;
                    expect(res).to.have.status(HttpStatus.OK);

                    // Verify structure
                    expect(res.body).to.have.own.property('name');
                    expect(res.body.name).to.equal('El Gordo Down Jacket');
                    expect(res.body).to.have.own.property('masterVariantId');
                    expect(res.body).to.have.own.property('description');
                    expect(res.body).to.have.own.property('id');
                    expect(res.body.id).to.equal(productId);
                    expect(res.body).to.have.own.property('categories');
                    expect(res.body).to.have.own.property('variants');
                    expect(res.body).to.have.own.property('createdDate');
                })
                .catch(function(err) {
                    throw err;
                });
        });

        it('returns a product for a valid product variant id', function() {
            return chai.request(env.openwhiskEndpoint)
                .get(env.productsPackage + 'getProductById')
                .query({id: variantId})
                .set('Accept-Language', 'en-US')
                .then(function (res) {
                    expect(res).to.be.json;
                    expect(res).to.have.status(HttpStatus.OK);
                    expect(res.body).to.have.own.property('name');
                    expect(res.body.name).to.equal('El Gordo Down Jacket');
                    expect(res.body).to.have.own.property('id');
                    expect(res.body.id).to.equal(productId);
                })
                .catch(function(err) {
                    throw err;
                });
        });

        it('returns a 404 error for a non existent product', function() {
            return chai.request(env.openwhiskEndpoint)
                .get(env.productsPackage + 'getProductById')
                .query({id: 'does-not-exist'})
                .catch(function(err) {
                    expect(err.response).to.have.status(HttpStatus.NOT_FOUND);
                });
        });

    });
});