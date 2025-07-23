# careconnect_backend/api/blockchain.py


def log_transaction_to_blockchain(donor, amount, auction_item=None, donation=None):
    import uuid
    txn_hash = f"0x{uuid.uuid4().hex[:32]}"
    print(f"Simulated blockchain txn: {txn_hash} for {donor} amount: {amount}")
    return txn_hash