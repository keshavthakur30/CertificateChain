const readline = require("readline");
const CertificateBlockchain = require("./blockchain");

const blockchain = new CertificateBlockchain();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log("\n==== CertificateChain Menu ====");
  console.log("1. Add Certificate");
  console.log("2. Mine Block");
  console.log("3. View Blockchain");
  console.log("4. Check Validity");
  console.log("5. Exit");
  rl.question("Choose option: ", handleChoice);
}

function handleChoice(choice) {
  switch (choice.trim()) {
    case "1":
      rl.question("Student Name: ", (name) => {
        rl.question("Course: ", (course) => {
          rl.question("Grade: ", (grade) => {
            const cert = {
              student_name: name,
              course,
              grade,
              issuer: "NodeJS University"
            };
            blockchain.addCertificate(cert);
            console.log("✅ Certificate added to pending pool.");
            menu();
          });
        });
      });
      break;
    case "2":
      const lastBlock = blockchain.getLastBlock();
      const proof = blockchain.proofOfWork(lastBlock.proof);
      const hash = blockchain.hash(lastBlock);
      const newBlock = blockchain.createBlock(proof, hash);
      console.log("✅ Block mined:");
      console.log(newBlock);
      menu();
      break;
    case "3":
      console.log("📘 Full Blockchain:");
      console.log(JSON.stringify(blockchain.getChain(), null, 2));
      menu();
      break;
    case "4":
      const valid = blockchain.isChainValid();
      console.log(valid ? "✅ Blockchain is valid." : "❌ Blockchain is invalid!");
      menu();
      break;
    case "5":
      rl.close();
      break;
    default:
      console.log("❗ Invalid option.");
      menu();
  }
}

menu();
