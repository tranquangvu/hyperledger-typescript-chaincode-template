/* tslint:disable */

import { SimpleChaincode } from '../../src/chaincodes/simpleChaincode';
import { ChaincodeMockStub, Transform } from '@theledger/fabric-mock-stub';

import { expect } from 'chai';

const chaincode = new SimpleChaincode();

describe('Test SimpleChaincode', () => {
  it('Should init without issues', async () => {
    const stub = new ChaincodeMockStub('MyMockStub', chaincode);

    const response = await stub.mockInit('tx1', []);

    expect(response.status).to.eql(200);
  });

  it('Should be able to get asset', async () => {
    const stub = new ChaincodeMockStub('MyMockStub', chaincode);
    await stub.mockInvoke("txID1", ["initLedger"]);

    const response = await stub.mockInvoke('tx1', ['getAsset', JSON.stringify({ key: 'a' })]);

    expect(Transform.bufferToObject(response.payload)).to.eql('100')
  });

  it('Should be able to set asset', async () => {
    const stub = new ChaincodeMockStub('MyMockStub', chaincode);

    const invokeResponse = await stub.mockInvoke('tx1', ['setAsset', JSON.stringify({ key: 'a', value: 100 })]);

    expect(invokeResponse.status).to.eql(200)

    const queryResponse = await stub.mockInvoke('tx1', ['getAsset', JSON.stringify({ key: 'a' })]);

    expect(Transform.bufferToObject(queryResponse.payload)).to.eq('100')
  });
});
