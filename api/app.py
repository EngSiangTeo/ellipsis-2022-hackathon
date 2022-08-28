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

def readDb():
    f = open("db.json", "r")
    db = json.loads(f.read())
    f.close()
    return db

def getData(table):
    db = readDb()
    return db[table]

def writeDb(table, data):
    db = readDb()
    if type(db[table]) is dict:
        db[table] = data
    else:
        db[table].append(data)
    f = open("db.json", "w")
    f.write(json.dumps(db))
    f.close()

@app.route("/loan", methods=["GET"])
def getLoans():
    loans = getData("loans")
    return json.dumps(loans)

@app.route("/loan", methods=["POST"])
def addLoan():
    loans = getData("loans")
    loans[request.json["address"]] = {
        "user" : request.json["wallet"],
        "approved": request.json["approved"]
    }
    writeDb("loans", loans)
    return "ok"

@app.route("/loan/<address>", methods=["GET"])
def getLoanByAddress(address):
    loans = getData("loans")
    if address not in loans:
        return {}
    return loans[address]

@app.route("/loan/<address>", methods=["POST"])
def updateLoanByAddress(address):
    loans = getData("loans")
    if address in loans:
        loans[address]["approved"] = "true"
    writeDb("loans", loans)
    return "ok"

@app.route("/onboard", methods=["POST"])
def onboard():
    transaction = {
        'chainId': 42,
        'gas': 70000,
        'maxFeePerGas': w3.toWei('2', 'gwei'),
        'maxPriorityFeePerGas': w3.toWei('1', 'gwei'),
        'nonce': w3.eth.getTransactionCount(os.getenv("DEPLOYED_ADDRESS")),
    }
    transfer=contract.functions.whitelistUser(Web3.toChecksumAddress(request.json["wallet"])).build_transaction(transaction)
    signed_txn = w3.eth.account.sign_transaction(transfer, private_key=os.getenv("DEPLOYER_KEY"))
    txn_hex = w3.eth.send_raw_transaction(signed_txn.rawTransaction) 
    w3.eth.wait_for_transaction_receipt(txn_hex.hex())
    
    user = getData("users")
    user[request.json["wallet"]] = {
        "username" : request.json['username']
    }
    writeDb("users", user)
    return "ok"

@app.route("/login", methods=["POST"])
def login():
    db = getData("users")
    if request.json["wallet"] not in db:
        return "not ok"
    return db[request.json["wallet"]]["username"]

@app.route("/deposit", methods=["POST"])
def deposit():
    transaction = {
        'chainId': 42,
        'gas': 70000,
        'maxFeePerGas': w3.toWei('2', 'gwei'),
        'maxPriorityFeePerGas': w3.toWei('1', 'gwei'),
        'nonce': w3.eth.getTransactionCount(os.getenv("DEPLOYED_ADDRESS")),
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
        'nonce': w3.eth.getTransactionCount(os.getenv("DEPLOYED_ADDRESS")),
    }
    transfer=contract.functions.withdraw(Web3.toChecksumAddress(request.json["address"]), int(request.json["amount"])).build_transaction(transaction)
    signed_txn = w3.eth.account.sign_transaction(transfer, private_key=os.getenv("DEPLOYER_KEY"))
    txn_hex = w3.eth.send_raw_transaction(signed_txn.rawTransaction) 
    w3.eth.wait_for_transaction_receipt(txn_hex.hex())
    return "ok"

app.run(host='0.0.0.0', port=4001, debug=True)
