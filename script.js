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
        const hash = sha256((proof ** 2 - prevProof ** 2).toString());
        if (hash.startsWith("0000")) break;
        proof++;
      }
      return proof;
    }
  
    hash(block) {
      return sha256(JSON.stringify(block));
    }
  
    addCertificate(cert) {
      this.pendingCertificates.push(cert);
    }
  
    isChainValid() {
      let prevBlock = this.chain[0];
      for (let i = 1; i < this.chain.length; i++) {
        const block = this.chain[i];
        if (block.previousHash !== this.hash(prevBlock)) return false;
  
        const hash = sha256((block.proof ** 2 - prevBlock.proof ** 2).toString());
        if (!hash.startsWith("0000")) return false;
  
        prevBlock = block;
      }
      return true;
    }
  }
  
  // Simple SHA256 function using Web Crypto
  function sha256(str) {
    return CryptoJS.SHA256(str).toString();
  }
  
  const blockchain = new CertificateBlockchain();
  
  function addCertificate() {
    const name = document.getElementById("name").value;
    const course = document.getElementById("course").value;
    const grade = document.getElementById("grade").value;
  
    if (!name || !course || !grade) {
      alert("Fill all fields");
      return;
    }
  
    blockchain.addCertificate({
      student_name: name,
      course,
      grade,
      issuer: "Frontend Blockchain University"
    });
  
    document.getElementById("output").innerText = "✅ Certificate added to pending pool.";
  }
  
  function mineBlock() {
    const prev = blockchain.getLastBlock();
    const proof = blockchain.proofOfWork(prev.proof);
    const hash = blockchain.hash(prev);
    const newBlock = blockchain.createBlock(proof, hash);
  
    document.getElementById("output").innerText =
      "⛏️ Block mined!\n" + JSON.stringify(newBlock, null, 2);
  }
  
  function viewBlockchain() {
    const chain = blockchain.chain;
    const valid = blockchain.isChainValid();
  
    document.getElementById("output").innerText =
      "📘 Blockchain (Valid: " + valid + ")\n\n" + JSON.stringify(chain, null, 2);
  }
  