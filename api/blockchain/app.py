from dotenv import load_dotenv
import os
import json
from web3 import Web3

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

f = open("goldcoinabi.json", "r")
abi = json.loads(f.read())
f.close()

token_address = os.getenv("GOLDCOIN_ADDRESS")
token_address=Web3.toChecksumAddress(token_address)

node_connection_address = "https://kovan.infura.io/v3/" + os.getenv("INFURA_API_KEY")

w3 = Web3(Web3.HTTPProvider(node_connection_address))

contract =w3.eth.contract(address=token_address, abi=abi)

@app.route("/deposit", methods=["POST"])
def deposit():
    transaction = {
        'chainId': 42,
        'gas': 70000,
        'maxFeePerGas': w3.toWei('2', 'gwei'),
        'maxPriorityFeePerGas': w3.toWei('1', 'gwei'),
        'nonce': w3.eth.getTransactionCount("0x80A9E6cD26b3e931faf138588E0a27C7C493C3A5"),
    }
    transfer=contract.functions.deposit(Web3.toChecksumAddress(request.json["address"]), int(request.json["amount"])).build_transaction(transaction)
    signed_txn = w3.eth.account.sign_transaction(transfer, private_key=os.getenv("DEPLOYER_KEY"))
    txn_hex = w3.eth.send_raw_transaction(signed_txn.rawTransaction) 
    w3.eth.wait_for_transaction_receipt(txn_hex.hex())
    return "ok"

@app.route("/withdraw", methods=["POST"])
def withdraw():
    transaction = {
        'chainId': 42,
        'gas': 70000,
        'maxFeePerGas': w3.toWei('2', 'gwei'),
        'maxPriorityFeePerGas': w3.toWei('1', 'gwei'),
        'nonce': w3.eth.getTransactionCount("0x80A9E6cD26b3e931faf138588E0a27C7C493C3A5"),
    }
    transfer=contract.functions.withdraw(Web3.toChecksumAddress(request.json["address"]), int(request.json["amount"])).build_transaction(transaction)
    signed_txn = w3.eth.account.sign_transaction(transfer, private_key=os.getenv("DEPLOYER_KEY"))
    txn_hex = w3.eth.send_raw_transaction(signed_txn.rawTransaction) 
    w3.eth.wait_for_transaction_receipt(txn_hex.hex())
    return "ok"

app.run(host='0.0.0.0', port=4001, debug=True)
