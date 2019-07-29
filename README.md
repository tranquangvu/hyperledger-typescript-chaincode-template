# Hyperledger typescript chaincode template
A template to build your hyperledger fabric chaincode in typescript

Common scripts:

```
yarn install
yarn build
yarn test
```

## How to testing chaincode (create by nodejs) using dev mode
Note: This guide use `chaincode_example02` chaincode from hyperledger `fabric-samples`.

First stop all containers in docker

```
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)
docker network rm $(docker network ls | tail -n+2 | awk '{if($2 !~ /bridge|none|host/){ print $1 }}')
```

Navigate to the `chaincode-docker-devmode` directory of the `fabric-samples` clone:

```
cd chaincode-docker-devmode
```

Now open three terminals and navigate to your chaincode-docker-devmode directory in each.

#### Terminal 1 - Start the network

```
docker-compose -f docker-compose-simple.yaml up
```

#### Terminal 2 - Build & start the chaincode

```
docker exec -it chaincode bash
```

You should see the following:

```
root@d2629980e76b:/opt/gopath/src/chaincode#
```

Now run the chaincode:

```
cd chaincode_example02/node
yarn install
CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=mycc:0 node chaincode_example02.js --peer.address=peer:7052
```

The chaincode is started with peer and chaincode logs indicating successful registration with the peer. Note that at this stage the chaincode is not associated with any channel. This is done in subsequent steps using the `instantiate` command

#### Terminal 3 - Use the chaincode

We’ll leverage the CLI container to drive these calls.

```
docker exec -it cli bash
```

```
peer chaincode install -p chaincodedev/chaincode/sacc -n mycc -v 0
peer chaincode install -l node -n mycc -p /opt/gopath/src/chaincodedev/chaincode/chaincode_example02/node -v 0
peer chaincode instantiate -o orderer:7050 -C myc -l node -n mycc -v 0 -c '{"Args":["init","a", "100", "b","200"]}'
```

```
peer chaincode query -C myc -n mycc -c '{"Args":["query","a"]}'
peer chaincode query -C myc -n mycc -c '{"Args":["query","b"]}'
peer chaincode invoke -C myc -n mycc -c '{"Args":["invoke","a","b","10"]}'
```

If you update chaincode source code, go to terminal 2, stop and start chaincode again.
