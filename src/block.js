// algoritmo para poder cifrar y hacer el hash de los bloques
const SHA256 = require('crypto-js/sha256');

const DIFFICULTY = 3;
const MINE_RATE = 3000;

class Block{
    // el bloque se va a crear mientras se mine
    constructor(time, previousHash, hash, data, nonce, difficulty){
        this.time = time;
        this.previousHash = previousHash;
        this.data = data;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    
    /* método de clase static: permite ejecutar o acceder al método sin necesidad de crear
    una nueva instancia */ 
    static get genesis(){
        // primer bloque de la blockchain de bitcoin 'genesis'
        const time = new Date('2009-03-01').getTime();
        return new this(
            time,
            undefined,
            'genesis_hash',
            'Genesis Block',
            0,
            DIFFICULTY,
        )
    }

    // el nuevo bloque se va a crear una vez se haya generado el hash y se haya añadido a la blockchain
    static mine(previousBlock, data){
        const { hash: previousHash } = previousBlock;
        let { difficulty } = previousBlock;
        let hash;
        let time;
        let nonce = 0;

        do {
            time = Date.now();
            nonce +=1;
            /* manera de gestionar el algoritmo de minado: si muchos bloques se están minando continuamente 
            lo que vamos a hacer es subir la dificultad, de esta maner ralentizamos la generacion de nuevos bloques, y si 
            los bloques ya están más espaciados en el tiempo, pues, vamos bajando la dificultad */
            difficulty = previousBlock.time + MINE_RATE > time ? difficulty + 1 : difficulty - 1;
            /* si alguno de estos valores cambia , aunque sea minimamente el hash va a ser diferente, por lo cual, se va 
            a poder detectar si ha sido manipulado ese bloque, y pot lo tanto no será válido */
            hash = SHA256(previousHash + time + data + nonce + difficulty).toString();
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(time, previousHash, hash, data, nonce, difficulty);
    }

    toString(){
        const { time, previousHash, hash, data, nonce, difficulty } = this;
        return `Block - 
        Time: ${time}
        Previouis Hash: = ${previousHash}
        Hash: ${hash}
        Data: ${data}
        Nonce: ${nonce}
        Difficulty: ${difficulty}
        --------------------------`;
    }
}

module.exports = Block;