const ROTORS = {
  I:  'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
  II: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  III:'BDFHJLCPRTXVZNYEIWGAKMUSQO',
  IV: 'HQZGPJTMOBLNCIFDYAWVEUSRKX',
  V:  'VZBRGITYUPSDNHLXAWMJQOFECK',
};

const REFLECTOR_B = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function rotorForward(c, rotor, pos, ring) {
  const idx = (alphabet.indexOf(c) + pos - ring + 26) % 26;
  const out = rotor[idx];
  return alphabet[(alphabet.indexOf(out) - pos + ring + 26) % 26];
}

function rotorBackward(c, rotor, pos, ring) {
  const idx = (alphabet.indexOf(c) + pos - ring + 26) % 26;
  const outIdx = rotor.indexOf(alphabet[idx]);
  return alphabet[(outIdx - pos + ring + 26) % 26];
}

function reflector(c, ref) {
  return ref[alphabet.indexOf(c)];
}

function stepRotors(positions, notchPositions) {
  const r2Step = positions[1] === notchPositions[1];
  positions[2] = (positions[2] + 1) % 26;
  if (positions[2] === notchPositions[2] || r2Step) {
    positions[1] = (positions[1] + 1) % 26;
  }
  if (r2Step) {
    positions[0] = (positions[0] + 1) % 26;
  }
}

function enigmaEncrypt(text, rotorOrder, rings, startPos, plugboard={}) {
  let pos = [...startPos];
  const notchMap = {I: 16, II: 4, III: 21, IV: 9, V: 25};
  const notchPositions = rotorOrder.map(r => notchMap[r]);
  let result = '';
  
  for (const char of text.toUpperCase()) {
    if (!alphabet.includes(char)) { result += char; continue; }
    
    stepRotors(pos, notchPositions);
    
    let c = plugboard[char] || char;
    
    for (let i = 2; i >= 0; i--) {
      c = rotorForward(c, ROTORS[rotorOrder[i]], pos[i], rings[i]);
    }
    
    c = reflector(c, REFLECTOR_B);
    
    for (let i = 0; i < 3; i++) {
      c = rotorBackward(c, ROTORS[rotorOrder[i]], pos[i], rings[i]);
    }
    
    c = plugboard[c] || c;
    result += c;
  }
  return result;
}

const fs = require('fs');
const filePath = 'C:/Users/Vanya/Documents/WEB/wiki/app/src/data/articles.js';
const content = fs.readFileSync(filePath, 'utf8');

// Config: Spanish Navy Beta rotor IV, rings 1978 and 1987
const rings1 = [18, 6, 7];  // 19,7,8 = 1978
const rings2 = [18, 7, 6];  // 19,8,7 = 1987

const encrypted1 = enigmaEncrypt(content, ['IV','II','I'], rings1, [0,0,0]);
const encrypted2 = enigmaEncrypt(content, ['IV','II','I'], rings2, [0,0,0]);

const output = `// ENIGMA ENCRYPTED - Spanish Navy Beta (Wiring B)
// Rotors: IV-II-I | Rings: 19-07-08 (1978) and 19-08-07 (1987)
// Reflector: B | Plugboard: none
// Decrypt with same settings (Enigma is reciprocal)

=== CONFIG 1 (1978 RINGS) ===
${encrypted1}

=== CONFIG 2 (1987 RINGS) ===
${encrypted2}
`;

fs.writeFileSync(filePath, output, 'utf8');
console.log('articles.js encrypted with Enigma (Spanish Beta wiring B)');
console.log('Two configs: rings 1978 and 1987');