var vigDecode = (cipherText, key) => {
    const plainText = getPlainText(cipherText,key);
    return plainText;
}

function getPlainText(cipherText,key){
    const plainArr = [];
    return helper(cipherText.split(""),key.split(""),0,0,plainArr).join("");
}

function helper(cipherChars,key,key_index,traversed,plainArr){

    if(plainArr.length == cipherChars.length){
        return plainArr;
    }

    const currentKeyChar = key[key_index];
    const currentCipherChar = cipherChars[traversed];

    const isLetter = currentCipherChar.match(/[a-z]/i);

    const plainChar = isLetter ? augment(currentCipherChar,currentKeyChar) : currentCipherChar;

    const new_key_index = isLetter ? (key_index + 1)%key.length : key_index;
    const new_traversed = traversed + 1;
    const new_array = [...plainArr,plainChar];

    return helper(cipherChars,key, new_key_index, new_traversed,new_array);
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function augment(cipher,key){
    const letterValue  = (alphaPosition(cipher) - alphaPosition(key)).mod(26);
    const letter = ascii(cipher) >= ascii("a") ? String.fromCharCode(ascii("a")+letterValue) : String.fromCharCode(ascii("A")+letterValue);

    return letter;
}

function alphaPosition(chr){
    return ascii(chr.toUpperCase())-ascii("A");
};
var ascii = chr => {
    return chr.charCodeAt(0);
};





