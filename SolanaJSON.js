const fs = require('fs');
const { Connection, clusterApiUrl } = require('@solana/web3.js');

const connection = new Connection(clusterApiUrl('mainnet-beta'));

// Parametros introducidos por el usuario
const slot = parseInt(process.argv[2], 10);
if(isNaN(slot)){
  console.log("\nSlot invalido\n");
  process.exit(1);
}

const address = process.argv[3];

async function storeJson(){
  // Obtiene la informacion del slot solicitado
  const block = await connection.getBlock(slot, { maxSupportedTransactionVersion: 0 });

  // Busca el address dentro de las transacciones del bloque
  var addressFound = false;  
  for(const transaction of block.transactions){
    const keys = transaction.transaction.message.staticAccountKeys;
    if(keys.some(key => key == address)){
      addressFound = true;
      break;
    }
  }
  
  if(addressFound){
    console.log(`\nAddress ${address} participo en slot ${slot}\n`);
  }else{
    console.log(`\nAddress ${address} no participo en slot ${slot}\n`);
  }

  // Guarda la informacion en un archivo .json
  try{
    const filename = `Solana_${slot}.json`;
    fs.writeFileSync(filename, JSON.stringify(block, null, 4));
    console.log(`Informacion de bloque guardada en ${filename}\n`);
  }catch(error){
    console.error("Ocurrio un error al escribir en archivo. ", error);
  }
}

storeJson();