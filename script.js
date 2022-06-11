var mot
var currentFrame
var currentLine
var guess
var goodLetters
var allWords


function regroup(){
    let allWords = ""
    if(!document.getElementById("checkbox").checked){
        console.log(document.getElementById("checkbox").checked)
        for(let i = 4; i < 10; i++){
            let wordList = new XMLHttpRequest();
            wordList.open("GET", "mots/mots_" + String(i) + ".txt", false)
            wordList.send(null);
            allWords += wordList.responseText.toUpperCase()
        }
    }
    else{
        let wordList = new XMLHttpRequest();
        wordList.open("GET", "mots/mots_" + Number(document.getElementById("wordLength").value) + ".txt", false)
        wordList.send(null);
        allWords += wordList.responseText.toUpperCase()
    }

    return allWords.split("\n")
}

function wordChoice(){
    let i = Math.floor(Math.random() * allWords.length)
    return allWords[i]
}

document.getElementById("wordLength").onchange = function(){
    document.getElementById("grille").remove()
    document.getElementById("keyboard").remove()
    allWords = regroup()
    replay()
}

function creationGrille(mot){
    for(let i = 0; i < 6; i++){
        let ligne = document.createElement("tr")
        ligne.id = String(i)
        ligne.className = "line"
        document.getElementById("grille").appendChild(ligne)
        for(let j = 0; j < mot.length; j++){
            let frame = document.createElement("td")
            frame.id = String(i) + String(j)
            frame.className = "frame"
            document.getElementById(String(i)).appendChild(frame)
        }
    }
}

function initKeyboard(){
    let letters = "AZERTYUIOPQSDFGHJKLM.WXCVBN,"
    let keyboard = document.createElement("div")
    document.body.appendChild(keyboard)
    keyboard.id = "keyboard"
    for(let i = 0; i < 28; i++){
        let key = document.createElement("button")
        document.getElementById("keyboard").appendChild(key)
        if(letters[i] == '.'){
            key.id = "Backspace"
            img = document.createElement("img")
            img.src = "icons/del.svg"
            key.className = "specialKey"
            document.getElementById(key.id).appendChild(img)
        }
        else if(letters[i] == ','){
            key.id = "Enter"
            img = document.createElement("img")
            img.src = "icons/enter.svg"
            key.className = "specialKey"
            document.getElementById(key.id).appendChild(img)
        }
        else{
            key.id = letters[i]
            key.className = "key"
            key.innerHTML = key.id
        }
        key.onclick = function(){write(key.id)}
    }
}

document.onkeydown = function (e) {write(e.key)}
function write(key){
    console.log(currentFrame)
    if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key)){
        if(currentFrame.id[1] != mot.length - 1){
            currentFrame = document.getElementById(currentLine.id + String(Number(currentFrame.id[1]) + 1))
            currentFrame.innerHTML = (key).toUpperCase()
            currentFrame.style.color = "#2f0c50"
            currentFrame.style.backgroundColor = "#008cff"
            guess += (key).toUpperCase()
        }
    }
    else if(key == "Backspace"){
        if(currentFrame.id[1] != 0){
            currentFrame.innerHTML = ""
            if(goodLetters.includes(currentFrame.id[1])){
                currentFrame.innerHTML = mot[Number(currentFrame.id[1])]
            }
            currentFrame.style.backgroundColor = "#135b96"
            currentFrame = document.getElementById(currentLine.id + String(Number(currentFrame.id[1]) - 1))
            guess = guess.slice(0, -1)
        }
    }
    else if(key == "Enter"){
        if(guess.length == mot.length && allWords.includes(guess)){
            if(!verification()){
                currentLine = document.getElementById(String(Number(currentLine.id) + 1))
                currentFrame = document.getElementById(currentLine.id + "0")
                currentFrame.innerHTML = guess
                currentFrame.style.backgroundColor = "#008cff"
            }
        }
        else if(guess.length != mot.length){
            alert("Ce mot est trop court.")
        }
        else if(!allWords.includes(guess)){
            alert("Ce mot n'est pas dans le dictionnaire.")
        }
    }
}

function verification(){
    let a = guess
    let tempGuess = guess
    if(mot == guess){
        setTimeout(() => {
            alert("Gagne !")
            document.getElementById("grille").remove()
            document.getElementById("keyboard").remove()
            replay()
            return true
        }, mot.length * 300);
    }
    if(currentLine.id == '5'){
        setTimeout(() => {
            alert("Tu as perdu ! \n Le mot etait " + mot + '.')
            document.getElementById("grille").remove()
            document.getElementById("keyboard").remove()
            replay()
        return true
        }, mot.length * 300);
    }
    let motTempon = mot
    for(let i = 0; i < guess.length; i++){
        if(mot[i] == guess[i]){
            motTempon = motTempon.substring(0, i) + '.' + motTempon.substring(i + 1)
            a = a.substring(0, i) + 'r' + a.substring(i + 1)
            guess = guess.substring(0, i) + ',' + guess.substring(i + 1)
            if(!goodLetters.includes(String(i))){
                goodLetters += String(i)
            }

        }
    }
    for(let i = 0; i < guess.length; i++){
        if(motTempon.includes(guess[i])){
            motTempon = motTempon.replace(guess[i], '.')
            a = a.substring(0, i) + 'j' + a.substring(i + 1)
            guess = guess.substring(0, i) + ',' + guess.substring(i + 1)
        }
    }
    for(let i = 0; i < guess.length; i++){
        if(guess[i] != ','){
            a = a.substring(0, i) + 'g' + a.substring(i + 1)
        }
    }
    for(let i = 0; i < a.length; i ++){
        lineAnim(a[i], i, tempGuess)
    }
    guess = mot[0]
}

function lineAnim(l, i, guess){
    setTimeout(() => {
        document.getElementById(String(Number(currentLine.id - 1)) + String(i)).className = "verif"
        setTimeout(() => {
            switch(l){
                case 'r':
                    document.getElementById(String(Number(currentLine.id - 1)) + String(i)).style.backgroundColor = "red"
                    document.getElementById(mot[i]).style.backgroundColor = "red"
                    break;
                case 'j':
                    document.getElementById(String(Number(currentLine.id - 1)) + String(i)).style.backgroundColor = "yellow"
                    document.getElementById(guess[i]).style.backgroundColor = "yellow"
                    break;
                case 'g':
                    document.getElementById(String(Number(currentLine.id - 1)) + String(i)).style.backgroundColor = "#135b96"
                    document.getElementById(guess[i]).style.backgroundColor = "rgb(50, 50, 54)"
                    break;
            }
            if(goodLetters.includes(i) && i > 0){
                document.getElementById(currentLine.id + String(i)).innerHTML = mot[i]
                document.getElementById(currentLine.id + String(i)).style.color = '#392c45'
            }
        }, 150)
    }, 200 * i)
}

function replay(){
    allWords = regroup()
    mot = wordChoice()
    guess = mot[0]
    goodLetters = ''
    const Grille = document.createElement("table")
    Grille.id = "grille"
    document.body.appendChild(Grille)
    creationGrille(mot)
    currentLine = document.getElementById("0")
    document.getElementById("00").innerHTML = mot[0]
    currentFrame = document.getElementById("00")
    currentFrame.style.backgroundColor = "#008cff"
    initKeyboard()
}

replay()