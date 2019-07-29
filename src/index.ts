import shim = require('fabric-shim');
import { SimpleChaincode } from './chaincodes/simpleChaincode';

shim.start(new SimpleChaincode());
