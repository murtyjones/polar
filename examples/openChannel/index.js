"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Due to updated ECDSA generated tls.cert we need to let gprc know that
// // we need to use that cipher suite otherwise there will be a handhsake
// // error when we communicate with the lnd rpc server.
// process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'
// // We need to give the proto loader some extra options, otherwise the code won't
// // fully work with lnd.
// const loaderOptions = {
//     keepCase: true,
//     longs: String,
//     enums: String,
//     defaults: true,
//     oneofs: true
// };
// const packageDefinition = loadSync(process.env.LND_PROTO_PATH!, loaderOptions);
// //  Lnd cert is at ~/.lnd/tls.cert on Linux and
// //  ~/Library/Application Support/Lnd/tls.cert on Mac
// let lndCert = fs.readFileSync(process.env.LND_CERT!);
// let credentials = grpc.credentials.createSsl(lndCert);
// let lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
// let lnrpc = lnrpcDescriptor.lnrpc;
// // @ts-ignore
// let lightning = new lnrpc.Lightning(process.env.LND_HOST, credentials);
// // @ts-ignore
// lightning.getInfo({}, function(err, response) {
//     if (err) {
//       console.log('Error: ' + err);
//     }
//     console.log('GetInfo:', response);
//   });
var lightning_rpc_1 = require("lightning-rpc");
require('dotenv').config();
var config = {
    host: String(process.env.LND_HOST),
    port: String(process.env.LND_PORT),
    certPath: String(process.env.LND_CERT_PATH),
    macaroonPath: String(process.env.LND_MACAROON_PATH),
};
var walletUnlocker = lightning_rpc_1.createWalletUnlocker(config);
console.log(walletUnlocker);
walletUnlocker.waitForReady(Infinity, function (error) {
    if (error) {
        console.error(error);
    }
    var unlockWalletRequest = new lightning_rpc_1.UnlockWalletRequest();
    if (!process.env.LND_WALLET_PASSWORD) {
        throw 'No wallet password. Set the LND_WALLET_PASSWORD enviroment variable.';
    }
    unlockWalletRequest.setWalletPassword(Buffer.from(process.env.LND_WALLET_PASSWORD));
    walletUnlocker.unlockWallet(unlockWalletRequest, function (error, response) { return __awaiter(void 0, void 0, void 0, function () {
        var lightning;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (error) {
                        console.error(error);
                    }
                    console.log('Wallet unlocked');
                    return [4 /*yield*/, lightning_rpc_1.createLightning(config)];
                case 1:
                    lightning = _a.sent();
                    lightning.waitForReady(Infinity, function (error) {
                        if (error) {
                            throw error;
                        }
                        var getInfoRequest = new lightning_rpc_1.GetInfoRequest();
                        lightning.getInfo(getInfoRequest, function (error, response) {
                            if (error) {
                                console.error(error);
                            }
                            console.log(response);
                        });
                        var invoiceSubscription = new lightning_rpc_1.InvoiceSubscription();
                        var stream = lightning.subscribeInvoices(invoiceSubscription);
                        stream.on('data', function (invoice) {
                            console.log('invoice', invoice);
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
