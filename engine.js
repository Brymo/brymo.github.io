const ALPHABET = ["A", "B", "C", "D", "E", "F","G", "H", "I","J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W","X", "Y", "Z"];

function key(cipherCode) {

  const ciphertext = cipherCode.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const keyLength = getKeyLength(ciphertext);
  return getFinalKey(keyLength);

  function getFinalKey(keyLength, keysDecrypted = 0){

    if(keysDecrypted == keyLength) return "";

    const columnNumber = keysDecrypted;
    const column = getColumn(ciphertext, columnNumber, keyLength);

    const deviations = ALPHABET.reduce((processedDeviations, potentialKeyChar)=>{
      const decryptAttempt = decryptColumn(column, potentialKeyChar);
      const decrFrequencies = getFrequencies(decryptAttempt);
      const newDeviations = {...processedDeviations};
      newDeviations[potentialKeyChar] = getDeviationFromEnglish(decrFrequencies);
      return newDeviations;  
    },{})

    return mostLikelyChar(deviations) + getFinalKey(keyLength, keysDecrypted+1,)

  }

  function ascii(chr){
    return chr.charCodeAt(0);
  };

  // Past Bryan discovered some sorcery here
  function getKeyLength(ciphertext){
    let ICList = [];
    let cipherChars = ciphertext.split("");

    for (let keyLen = 1; keyLen < 20; keyLen++) {
      let ICSum = 0.0;

      let freqList = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]; // 26 0's
      for (let col = 0; col < keyLen; col++) {
        let colLength = 0.0;
        let chr = 0;
        while (chr < cipherChars.length) {
          if (chr % keyLen == col) {
            freqList[ascii(cipherChars[chr]) - ascii("A")] += 1;
            colLength++;
          }
          chr++;
        }

        let sum = 0.0;
        for (let i = 0; i < 26; i++) sum += freqList[i] * (freqList[i] - 1);

        ICSum += sum / ((colLength * (colLength - 1)) / 26);

        freqList = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ];
      }

      ICList.push(ICSum / keyLen);
    }

    let maxIC = Math.max(...ICList);
    const tweakCoefficient = 0.2;
    const maxIndex = ICList.findIndex(element => element == maxIC) + 1; //Accomodate for there being no 0 key
    const otherCandidates = ICList.filter(
      (IC, index) =>
        IC > maxIC - tweakCoefficient && maxIndex % (index + 1) == 0
    );
    const runnerUp = otherCandidates.length > 0 && ICList.findIndex(element => element == otherCandidates[0]) + 1;
    return runnerUp || maxIndex;
  };

  function getColumn(cipherText, columnNumber, keyLength){
    return cipherText.split("").filter((letter, index)=> index % keyLength == columnNumber);
  };

  function decryptColumn(column, potentialKey){

    return column.map((columnLetter)=>{
      const asciiOfDecodedLetter = mod(ascii(columnLetter) - ascii(potentialKey), 26) + ascii("A");
      return String.fromCharCode(asciiOfDecodedLetter);
    });

    // I think this accounts for negative numbers
    function mod(base, modulus){
      return ((base % modulus) + modulus) % modulus;
    };

  };

  function getFrequencies(column) {

    return ALPHABET.reduce((acc,letter)=>{
      const newAcc = {...acc};
      const frequency = column.filter((columnLetter)=>columnLetter == letter).length;
      newAcc[letter] = (frequency/column.length) * 100;
      return newAcc;
    },{});

  }

  function getDeviationFromEnglish(frequencies) {
    const englishFreq = {
      A: 8.167,
      B: 1.492,
      C: 2.782,
      D: 4.253,
      E: 12.702,
      F: 2.228,
      G: 2.015,
      H: 6.094,
      I: 6.966,
      J: 0.153,
      K: 0.772,
      L: 4.025,
      M: 2.406,
      N: 6.749,
      O: 7.507,
      P: 1.929,
      Q: 0.095,
      R: 5.987,
      S: 6.327,
      T: 9.056,
      U: 2.758,
      V: 0.978,
      W: 2.36,
      X: 0.15,
      Y: 1.974,
      Z: 0.074
    };

    const dev = ALPHABET.reduce((sumOfDeviations, letter)=>{
      return sumOfDeviations + Math.abs(frequencies[letter] - englishFreq[letter]);
    },0);

    return dev / ALPHABET.length;
  }

  function mostLikelyChar(deviations) {
    // find the key with the smallest deviation
    return ALPHABET.reduce((lowestDeviationsLetter, currentLetter) => {
      return deviations[currentLetter] < deviations[lowestDeviationsLetter] ? currentLetter : lowestDeviationsLetter; 
    },"A");
  }

}
