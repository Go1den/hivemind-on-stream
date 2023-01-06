class PageManager {

    timeoutID;

    constructor() {

    };

    setDisplayOfElements(selectorValue, displayValue) {
        let elements = document.querySelectorAll(selectorValue);
        elements.forEach(el => {
            el.style.display = displayValue;
        });
    }

    turnOffWelcomeScreenElements() {
        this.setDisplayOfElements('.onAtStartOnly', 'none');
    }

    turnOnGameElements() {
        this.setDisplayOfElements('.offAtStart', 'initial');
    }

    addBorderedClass() {
        let gameElements = document.querySelectorAll('.toBeBordered');
        gameElements.forEach(el => {
            el.classList.add("bordered");
        });
    }

    displayInBetweenRoundsElements() {
        this.setDisplayOfElements('.showOnNextRoundOnly', 'inline');
    }

    hideInBetweenRoundsElements() {
        this.setDisplayOfElements('.showOnNextRoundOnly', 'none');
    }
    
    displayInBetweenGamesElements() {
        this.setDisplayOfElements('.newGame', 'table');
    }

    hideInBetweenGamesElements() {
        this.setDisplayOfElements('.gameButtons', 'none');
    }

    hideNewGameButton() {
        this.setDisplayOfElements('.newGame', 'none');
    }

    displayNextRoundButton() {
        this.setDisplayOfElements('.round', 'table');
    }

    hideNextRoundButton() {
        this.setDisplayOfElements('.round', 'none');
    }

    clearAllTables() {
        this.clearAnswerTable();
        this.clearRevealedAnswerTable();
        this.clearUnusedLetterRow();
    }

    clearGuess() {
        document.getElementById("guess").innerHTML = '';
    }

    revealWord(word, index) {
        let answerTextDiv = document.getElementById("answerText");
        answerTextDiv.innerHTML += '<span id="' + word + '" onclick="onAnswerBoardClick(this, ' + index + ', true)"><strong>&nbsp;' + word + '&nbsp;</strong></span>';
        answerTextDiv.scrollLeft = answerTextDiv.scrollWidth;
    }

    revealMissedWord(word, index) {
        let answerTextDiv = document.getElementById("revealedAnswerText");
        answerTextDiv.innerHTML += '<span id="' + word + '" onclick="onAnswerBoardClick(this, ' + index + ', false)"><strong>&nbsp;' + word + '&nbsp;</strong></span>';
        answerTextDiv.scrollLeft = answerTextDiv.scrollWidth;
    }

    getGuess() {
        let spans = document.getElementById("guess").getElementsByTagName("span");
        let guess = '';
        for (let i=0; i<spans.length; i++) {
            guess += spans[i].innerHTML;
        }
        return guess;
    }

    clearAnswerTable() {
        document.getElementById("answerText").innerHTML = '';
    }

    clearRevealedAnswerTable() {
        document.getElementById("revealedAnswerText").innerHTML = '';
    }

    clearUnusedLetterRow() {
        for(let i=1; i<8; i++) {
            document.getElementById("unusedLetterRow" + i.toString()).innerHTML = '';
        }
    }

    shuffleTiles(scrambledLetters) {
        for (let i=0; i<scrambledLetters.length; i++) {
            let currentLetter = scrambledLetters[i];
            if (i == 3) {
                document.getElementById("unusedLetterRow" + (i+1).toString()).innerHTML = '<div class="goldImage letter">' + currentLetter + '</div>';
            } else {
                document.getElementById("unusedLetterRow" + (i+1).toString()).innerHTML = '<div class="silvImage letter">' + currentLetter + '</div>';
            }
        }
    }
    
    updateDefinition(definition) {
        document.getElementById("definitionText").innerHTML = definition;
        document.getElementById("definitionText").scrollTop = 0;
    }

    showDefinition() {
        document.getElementById("definition").style.display = 'initial';
    }

    hideDefinition() {
        document.getElementById("definitionText").innerHTML = '';
        document.getElementById("definition").style.display = 'none';
    }

    hideGuessAndTiles() {
        document.getElementById("usedLetterRow").style.display = 'none';
        document.getElementById("unusedLetterRow").style.display = 'none';
        document.getElementById("toastRow").style.display = 'none';
    }

    hideMissedWordsTable() {
        document.getElementById("revealedAnswerTable").style.display = 'none';
    }

    showMissedWordsTable() {
        document.getElementById("revealedAnswerTable").style.display = 'initial';
    }

    setRankThreshold(percentage) {
        document.getElementById("toNextRank").style.backgroundPosition = 100 - percentage + '%';
    }

    animateRankUp(soundboard, currentRank, isSoundOn, pointsToNextRank) {
        this.setRankThreshold(100);
        setTimeout(() => {
            document.getElementById("toNextRank").classList.remove("progressBar");
            soundboard.playSound("rankUpSound", 0.25, isSoundOn);
            this.setRankThreshold(0);
            this.setRank(currentRank);
            this.setToast("Rank up!");
            this.setToNextRank(pointsToNextRank);
            document.getElementById("toNextRank").classList.add("progressBar");
        }, 1000);
    }

    setThreshold(percentage, wordsFound, totalWords) {
        document.getElementById("threshold").innerHTML = '<strong>' + wordsFound + ' of ' + totalWords + '</strong>';
        document.getElementById("threshold").style.backgroundPosition = 100 - percentage + '%';
    }

    setToNextRank(points) {
        document.getElementById("toNextRank").innerHTML = '<strong>' + points + '</strong>';
    }

    setRank(rank) {
        document.getElementById("rank").innerHTML = '<strong>' + rank + '</strong>';
    }

    setScore(score, totalPoints, percentage) {
        document.getElementById("score").innerHTML = '<strong>' + score + ' of ' + totalPoints + '</strong>';
        document.getElementById("score").style.backgroundPosition = 100 - percentage + '%';
    }

    setToast(text) {
        this.interruptFade();
        let toast = document.getElementById("toast");
        document.getElementById("toast").innerHTML = text;
        toast.classList.remove('fade');
        this.timeoutID = setTimeout(() => {
            toast.classList.add('fade');
            this.timeoutID = 0;
        }, 2000);
    }

    interruptFade() {
        if (this.timeoutID > 0) {
            clearTimeout(this.timeoutID);
            this.timeoutID = 0;
        }
    }

    addLetterToGuess(letter, className) {
        document.getElementById("guess").innerHTML += '<span class="' + className + '">' + letter + '</span>';
    }

    removeLetterFromGuess() {
        let current = document.getElementById("guess").innerHTML;
        document.getElementById("guess").innerHTML = current.substring(0, current.length - 30);
    }
    updateSoundButton(isSoundOn) {
        let text = isSoundOn ? 'Mute' : 'Unmute';
        document.getElementById("soundButton").innerHTML = text;
    }

    showLinkedPuzzle() {
        document.getElementById("linkedPuzzleRow").style.display = 'table';
    }

    hideLinkedPuzzle() {
        document.getElementById("linkedPuzzleRow").style.display = 'none';
    }

    showPuzzleNumber(dayNumber) {
        document.getElementById("puzzleNumber").innerHTML = '<p class="center">Hivemind #' + dayNumber + '</p>';
    }
}