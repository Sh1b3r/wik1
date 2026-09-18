// Enigma M3 with Spanish Navy wiring (Beta rotor set)
const ROTORS = {
  I:  'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
  II: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  III:'BDFHJLCPRTXVZNYEIWGAKMUSQO',
  IV: 'HQZGPJTMOBLNCIFDYAWVEUSRKX',  // Spanish Navy Beta (wiring B)
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

function stepRotors(positions, notches) {
  const r2Step = positions[1] === notches[1];
  positions[2] = (positions[2] + 1) % 26;
  if (positions[2] === notches[2] || r2Step) {
    positions[1] = (positions[1] + 1) % 26;
  }
  if (r2Step) {
    positions[0] = (positions[0] + 1) % 26;
  }
}

function enigmaEncrypt(text, rotorOrder, rings, startPos, plugboard={}) {
  let pos = [...startPos];
  const notches = rotorOrder.map(r => 'QEVJZ'['IV'.indexOf(r) >= 0 ? 0 : 'II'.indexOf(r) >= 0 ? 1 : 2]);
  // Correct notches for each rotor
  const notchMap = {I: 16, II: 4, III: 21, IV: 9, V: 25}; // Q, E, V, J, Z
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

const text = "LEGO CLASSIC SPACE (VNUTRENNEE POZNACHENIE SPACE CLASSIC) ETO PERVAYA BOLSHAYA KOSMICHESKAYA TEMA LEGO VYPUSCHENNAYA S 1978 PO 1987 GOD ONO ZAKLALO FUNDAMENT DLIA VSEH POSLEDUYUSHCHIKH KOSMICHESKIKH SERIY FUTRON BLACKTRON SPACE POLICE M TRON ICE PLANET SPYRIUS UNITRON EXPLORIENS ROBOFORCE LIFE ON MARS MARS MISSION ALIEN CONQUEST GALAXY SQUAD I DRUGIH KLJUCHOVYE VIZUALNYE PRIZNAKI SINIE KOREPSI (BLUE) SIRYE PANELI ZHOVTIE DETALI (YELLOW ACCENTS) PROZORIE ZHOVTIE VIZIRY I BILIE MINIFIGURI ASTRONAVTOV V SHOLOMAH BEZ VIZIROV LISHHE POZZHE S PROZORIMI LOGOTIP BELAYA STRELA RAKETA V KOLE STAL IKONICHNIM BRENDOM EPOHI";

const rings1 = [18, 6, 7];  // 19,7,8 (0-indexed) = 1978
const rings2 = [18, 7, 6];  // 19,8,7 (0-indexed) = 1987

console.log('=== Config 1: Rings 19-07-08 (1978), Rotors IV-II-I ===');
console.log(enigmaEncrypt(text, ['IV','II','I'], rings1, [0,0,0]));

console.log('\n=== Config 2: Rings 19-08-07 (1987), Rotors IV-II-I ===');
console.log(enigmaEncrypt(text, ['IV','II','I'], rings2, [0,0,0]));

console.log('\n=== Config 3: Rings 19-07-08, Rotors I-II-III (standard) ===');
console.log(enigmaEncrypt(text, ['I','II','III'], rings1, [0,0,0]));

console.log('\n=== Config 4: Rings 19-08-07, Rotors I-II-III (standard) ===');
console.log(enigmaEncrypt(text, ['I','II','III'], rings2, [0,0,0]));