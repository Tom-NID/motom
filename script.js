var mot
var currentFrame
var currentLine
var guess


function regroup(){
    console.log("regroup")
    let allWords = ""
    for(let i = 4; i < 12; i++){
        let wordList = new XMLHttpRequest();
        wordList.open("GET", "mots/mots_" + String(i) + ".txt", false)
        wordList.send(null);
        allWords += wordList.responseText.toUpperCase()
    }
    return allWords.split("\n")
}

const allWords = regroup()

function wordChoice(){
    console.log("wordChoice")
    let l = String(Math.floor(Math.random() * 8 + 4))
    var wordList = new XMLHttpRequest();
    wordList.open("GET", "mots/mots_" + l + ".txt", false)
    wordList.send(null);
    wordList = wordList.responseText.split("\n")
    let i = Math.floor(Math.random() * wordList.length)
    return wordList[i].toUpperCase()
}

function creationGrille(mot){
    console.log("creationGrille")
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
            img.src = "del.svg"
            key.className = "specialKey"
            document.getElementById(key.id).appendChild(img)
        }
        else if(letters[i] == ','){
            key.id = "Enter"
            img = document.createElement("img")
            img.src = "enter.svg"
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
    console.log("onkeydomn")
    if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key)){
        if(currentFrame.id[1] != mot.length - 1){
            currentFrame = document.getElementById(currentLine.id + String(Number(currentFrame.id[1]) + 1))
            currentFrame.innerHTML = (key).toUpperCase()
            guess += (key).toUpperCase()
        }
    }
    else if(key == "Backspace"){
        if(currentFrame.id[1] != 0){
            currentFrame.innerHTML = ""
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
    console.log("verification")
    if(mot == guess){
        alert("Gagne !")
        document.getElementById("grille").remove()
        document.getElementById("keyboard").remove()
        replay()
        return true
    }
    let motTempon = mot
    for(let i = 0; i < guess.length; i++){
        if(mot[i] == guess[i]){
            odocument.getElementById(currentLine.id + String(i)).style.backgroundColor = "red"
            document.getElementById(String(Number(currentLine.id) + 1) + String(i)).innerHTML = guess[i]
            motTempon = motTempon.replace(motTempon[i], '.')
            guess = guess.replace(guess[i], ',')
        }
    }
    for(let i = 0; i < guess.length; i++){
        if(motTempon.includes(guess[i])){
            motTempon = motTempon.replace(guess[i], '.')
            document.getElementById(currentLine.id + String(i)).style.backgroundColor = "yellow"
        }
    }
    guess = mot[0]
}

function replay(){
    console.log("replay")
    mot = wordChoice()
    guess = mot[0]
    const Grille = document.createElement("table")
    Grille.id = "grille"
    document.body.appendChild(Grille)
    creationGrille(mot)
    currentLine = document.getElementById("0")
    document.getElementById("00").innerHTML = mot[0]
    currentFrame = document.getElementById("00")
    console.log(currentFrame, currentLine)
    initKeyboard()
}


replay()
