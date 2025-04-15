const crypto = require("crypto");

class CertificateBlockchain {
  constructor() {
    this.chain = [];
    this.pendingCertificates = [];
    this.createBlock(1, "0");
  }

  createBlock(proof, previousHash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      certificates: this.pendingCertificates,
      proof,
      previousHash
    };
    this.pendingCertificates = [];
    this.chain.push(block);
    return block;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(prevProof) {
    let proof = 1;
    while (true) {
      const hash = crypto.createHash("sha256").update((proof ** 2 - prevProof ** 2).toString()).digest("hex");
      if (hash.startsWith("0000")) break;
      proof++;
    }
    return proof;
  }

  hash(block) {
    return crypto.createHash("sha256").update(JSON.stringify(block)).digest("hex");
  }

  isChainValid() {
    let prevBlock = this.chain[0];
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i];
      if (block.previousHash !== this.hash(prevBlock)) return false;

      const hash = crypto.createHash("sha256").update((block.proof ** 2 - prevBlock.proof ** 2).toString()).digest("hex");
      if (!hash.startsWith("0000")) return false;

      prevBlock = block;
    }
    return true;
  }

  addCertificate(cert) {
    this.pendingCertificates.push(cert);
  }

  getChain() {
    return this.chain;
  }
}

module.exports = CertificateBlockchain;
