var mot
var currentFrame
var currentLine
var guess
var goodLetters
var allWords



function regroup(){
    let allWords = ""
    if(!document.getElementById("checkbox").checked){
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

document.getElementById("checkbox").onchange = function(){
    document.getElementById("wordLength").disabled = !document.getElementById("checkbox").checked
}

document.getElementById("def").onclick = function(){
    window.open("https://fr.wiktionary.org/wiki/" + mot.toLowerCase(), "_blank");
}

document.getElementById("replay").onclick = function(){replay()}

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
            key.className = "key"
            key.classList.add("specialKey")
            document.getElementById(key.id).appendChild(img)
        }
        else if(letters[i] == ','){
            key.id = "Enter"
            img = document.createElement("img")
            img.src = "icons/enter.svg"
            key.className = "key"
            key.classList.add("specialKey")
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
    if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key)){
        if(currentFrame.id[1] != mot.length - 1 && !(currentFrame.id[1] == 0 && key.toUpperCase() == mot[0])){
            currentFrame = document.getElementById(currentLine.id + String(Number(currentFrame.id[1]) + 1))
            currentFrame.style.borderColor = "transparent"
            currentFrame.innerHTML = (key).toUpperCase()
            currentFrame.style.color = "#2f0c50"
            currentFrame.style.backgroundColor = "#B3AEC8"
            currentFrame.classList.remove("placement")
            currentFrame.offsetWidth
            currentFrame.classList.add("placement")
            if(Number(currentFrame.id[1]) + 1 < mot.length){
                document.getElementById(currentLine.id + String(Number(currentFrame.id[1]) + 1)).style.borderColor = "black"
            }
            guess += (key).toUpperCase()
        }
    }
    else if(key == "Backspace"){
        if(currentFrame.id[1] != 0){
            if(currentFrame.id[1] != '0'){
                currentFrame.style.borderColor = "black"
                if(Number(currentFrame.id[1]) + 1 < mot.length){
                    document.getElementById(currentLine.id + String(Number(currentFrame.id[1]) + 1)).style.borderColor = "transparent"
                }
            }
            currentFrame.innerHTML = ""
            if(goodLetters.includes(currentFrame.id[1])){
                currentFrame.innerHTML = mot[Number(currentFrame.id[1])]
            }
            currentFrame.style.backgroundColor = "#8981A9"
            currentFrame = document.getElementById(currentLine.id + String(Number(currentFrame.id[1]) - 1))
            guess = guess.slice(0, -1)
        }
    }
    else if(key == "Enter"){
        if(guess.length == mot.length && allWords.includes(guess)){
            if(!verification()){
                currentFrame.style.backgroundColor = "#B3AEC8"
            }
        }
        else if(guess.length != mot.length){
            for(let i = 0; i < guess.length; i++){
                document.getElementById(currentLine.id + String(i)).classList.remove("placement")
                document.getElementById(currentLine.id + String(i)).classList.remove("error")
                document.getElementById(currentLine.id + String(i)).offsetWidth
                document.getElementById(currentLine.id + String(i)).classList.add("error")
            }
        }
        else if(!allWords.includes(guess)){
            for(let i = 0; i < guess.length; i++){
                document.getElementById(currentLine.id + String(i)).classList.remove("placement")
                document.getElementById(currentLine.id + String(i)).classList.remove("error")
                document.getElementById(currentLine.id + String(i)).offsetWidth
                document.getElementById(currentLine.id + String(i)).classList.add("error")
            }
            document.getElementById("notif").innerHTML = "Ce mot n'est pas dans le dictionnaire."
            document.getElementById("notif").classList.remove("notif")
            document.getElementById("notif").offsetWidth
            document.getElementById("notif").classList.add("notif")
        }
    }
}

function verification(){
    let a = guess
    let tempGuess = guess
    if(mot == guess){
        setTimeout(() => {
            document.getElementById("message").innerHTML = "Bine joue tu as gagne !"
            document.getElementById("end").classList.remove("depop")
            document.getElementById("end").offsetWidth
            document.getElementById("end").classList.add("pop")
            return true
        }, mot.length * 300);
    }
    else if(currentLine.id == '5'){
        setTimeout(() => {
            document.getElementById("message").innerHTML = "Bine joue tu as perdu !"
            document.getElementById("end").classList.remove("depop")
            document.getElementById("end").offsetWidth
            document.getElementById("end").classList.add("pop")
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
    setTimeout(() => {
        currentLine = document.getElementById(String(Number(currentLine.id) + 1))
        currentFrame = document.getElementById(currentLine.id + "0")
    }, mot.length * 299);
    guess = mot[0]
}

function lineAnim(l, i, guess){
    setTimeout(() => {
        document.getElementById(String(Number(currentLine.id)) + String(i)).classList.remove("error")
        document.getElementById(String(Number(currentLine.id)) + String(i)).classList.remove("placement")
        document.getElementById(String(Number(currentLine.id)) + String(i)).classList.add("verif")
        setTimeout(() => {
            switch(l){
                case 'r':
                    document.getElementById(String(Number(currentLine.id)) + String(i)).style.backgroundColor = "#2E6B65"
                    document.getElementById(mot[i]).style.backgroundColor = "#2E6B65"
                    break;
                case 'j':
                    if(!document.getElementById(guess[i]).style["backgroundColor"] == rgb(46, 107, 101)){
                        document.getElementById(String(Number(currentLine.id)) + String(i)).style.backgroundColor = "#AC8949"
                    }
                    document.getElementById(guess[i]).style.backgroundColor = "#AC8949"
                    break;
                case 'g':
                    if(document.getElementById(guess[i]).style["backgroundColor"] == ''){
                        document.getElementById(guess[i]).style.backgroundColor = "rgb(50, 50, 54)"
                    }
                    document.getElementById(String(Number(currentLine.id)) + String(i)).style.backgroundColor = "#8981A9"
                    break;
            }
            if(goodLetters.includes(i) && currentLine.id < 5){
                document.getElementById(String(Number(currentLine.id) + 1) + String(i)).innerHTML = mot[i]
                document.getElementById(String(Number(currentLine.id) + 1) + String(i)).style.color = '#392c45'
                if(i == 0){
                    document.getElementById(String(Number(currentLine.id) + 1) + String(i)).style.color = '#2f0c50'
                    document.getElementById(String(Number(currentLine.id) + 1) + String(i)).style.backgroundColor = '#B3AEC8'
                }
                
            }
        }, 150)
    }, 200 * i)
}

function replay(){
    if(document.getElementById("grille")){
        document.getElementById("grille").remove()
        document.getElementById("keyboard").remove()
        document.getElementById("end").classList.remove("pop")
        document.getElementById("end").offsetWidth
        document.getElementById("end").classList.add("depop")
    }
    allWords = regroup()
    mot = wordChoice()
    document.getElementById("word").innerHTML = mot
    guess = mot[0]
    goodLetters = ''
    const Grille = document.createElement("table")
    Grille.id = "grille"
    document.body.appendChild(Grille)
    creationGrille(mot)
    currentLine = document.getElementById("0")
    document.getElementById("00").innerHTML = mot[0]
    currentFrame = document.getElementById("00")
    currentFrame.style.backgroundColor = "#B3AEC8"
    document.getElementById("01").style.borderColor = "black"
    initKeyboard()
}

replay()