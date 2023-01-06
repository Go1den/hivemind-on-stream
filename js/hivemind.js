class Hivemind {

    dictionary;
    seedPuzzle;
    seedWord;
    seedCenterLetter;
    upperCaseSeedWord;
    letters;
    answerArray;
    answerCount = 0;
    usedLetterIndex = 1;
    originalPositionArray;
    score;
    foundWords = new Array();
    missedWords = new Array();
    soundboard;
    isGameGoing = false;
    pageManager;
    totalRoundPoints;
    lastSubmittedGuess = '';
    clearRate = 0;
    rank;
    currentRank = 'Beeswax';
    puzzleID;
    isSoundOn = true;
    calendar;
    dayNumber = 0;
    isDaily;

    constructor() {
        this.dictionary = new Dictionary();
        this.soundboard = new Soundboard();
        this.pageManager = new PageManager();
        this.rank = new Rank();
        this.calendar = new Calendar();
    }

    todaysGame() {
        this.isDaily = true;
        this.dayNumber = this.calendar.getDailyPuzzleNumber();
        this.seedRandomForToday();
        this.newGame();
    }

    seedRandomForToday() {
        Math.seedrandom(this.calendar.getTodaysDateString());
    }

    randomGame() {
        this.isDaily = false;
        Math.seedrandom();
        this.newGame();
    }

    specificGame(param, isDaily) {
        this.isDaily = isDaily;
        if (isDaily) { //param is the daily puzzle #
            let dayAsString = this.calendar.getPastDailyPuzzleString(param);
            this.dayNumber = param;
            Math.seedrandom(dayAsString);
            this.newGame();
        } else {
            this.newGame(param); //param is puzzleID
        }
    }

    updateURL() {
        let currentURL = location.protocol + '//' + location.host + location.pathname;
        let nextURL;
        if (this.isDaily) {
            nextURL = currentURL + '?daily=' + this.dayNumber;
        } else {
            nextURL = currentURL + '?puzzle=' + this.puzzleID;
        }
        let nextTitle = 'Hive Mind by Go1den';
        let nextState = { additionalInformation: 'New puzzle data' };
        window.history.pushState(nextState, nextTitle, nextURL);
    }

    newGame(puzzleID) {
        this.isGameGoing = true;
        this.usedLetterIndex = 1;
        this.lastSubmittedGuess = '';
        this.score = 0;
        this.currentRank = 'Beeswax';
        this.pageManager.setRank(this.currentRank);
        this.foundWords = new Array();
        this.missedWords = new Array();
        let centerLetterIndex;
        if (puzzleID !== undefined && puzzleID !== null) {
            this.seedPuzzle = this.dictionary.getPuzzleByID(puzzleID).split(',');
            centerLetterIndex = Math.floor(puzzleID / 10000) - 1;
        } else {
            this.seedPuzzle = this.dictionary.getRandomPuzzle().split(',');
            centerLetterIndex = Math.floor(Math.random() * this.seedPuzzle[1].length);
        }
        this.puzzleID = Number(this.seedPuzzle[2]);
        this.seedWord = this.seedPuzzle[0];
        this.puzzleID += (10000 * (centerLetterIndex + 1)); //This will always be a 5 digit number where the first digit is 1 + the index of the center letter in the puzzle definition
        this.seedCenterLetter = this.seedPuzzle[1].charAt(centerLetterIndex);
        this.upperCaseSeedWord = this.seedWord.toUpperCase();
        this.letters = this.seedWord.split('');
        this.answerArray = this.dictionary.getValidWordArray(this.seedWord, this.seedCenterLetter);
        this.answerCount = this.answerArray.length;
        this.originalPositionArray = [];
        this.letters = this.upperCaseSeedWord.split('');
        this.pageManager.clearAllTables();
        this.scramble(false);
        this.setTotalPossibleRoundPoints();
        this.pageManager.setScore(this.score, this.totalRoundPoints, 0);
        this.setThreshold();
        this.setPointThreshold();
        this.setRankThreshold(false);
        if (this.isDaily) {
            this.pageManager.showPuzzleNumber(this.dayNumber);
        }
        this.pageManager.turnOffWelcomeScreenElements();
        this.pageManager.addBorderedClass();
        this.pageManager.turnOnGameElements();
        this.pageManager.hideDefinition();
        this.pageManager.hideMissedWordsTable();
        this.pageManager.hideLinkedPuzzle();
        this.updateURL();
    }

    setTotalPossibleRoundPoints() {
        let total = 0;
        for (let i=0; i<this.answerCount; i++) {
            let word = this.answerArray[i];
            total += this.getWordScore(word, this.isPangram(word));
        }
        this.totalRoundPoints = total;
    }

    getIsGameGoing() {
        return this.isGameGoing;
    }

    giveUp() {
        for (let i=0; i<this.answerCount; i++) {
            let word = this.answerArray[i];
            if (this.foundWords.indexOf(word) < 0 && this.missedWords.indexOf(word) < 0) {
                this.missedWords.push(word);
                this.revealMissedWord(word);
            }
        }
        this.#endRound();
    }

    #endRound() {
        this.isGameGoing = false;
        this.pageManager.showDefinition();
        this.pageManager.showMissedWordsTable();
        this.pageManager.hideGuessAndTiles();
        this.pageManager.displayInBetweenGamesElements();
        this.pageManager.hideInBetweenGamesElements();
        this.soundboard.playSound("gameOverSound", .25, this.isSoundOn);
    }

    getWordScore(word, isPangram) {
        let points = word.length;
        if (points == 4) {
            points = 1;
        }
        if (isPangram) {
            points += 7;
        }
        return points;
    }

    isPangram(word) {
        let pangramCheck = String.prototype.concat(...new Set(word)).length;
        return pangramCheck == 7;
    }

    scoreWord(word) {
        let isPangram = this.isPangram(word);
        let thisScore = this.getWordScore(word, isPangram);
        this.score += thisScore;
        let percentage = Math.round(1000 * (this.score / this.totalRoundPoints)) / 10;
        this.pageManager.setScore(this.score, this.totalRoundPoints, percentage);
        this.setThreshold();
        let isRankUp = this.setPointThreshold();
        this.setRankThreshold(isRankUp);
        this.pageManager.setToast(this.getToastTextForWord(thisScore, isPangram));
    }

    tweet(isScoreTweet) {
        let hashtags, text;
        if (isScoreTweet) {
            text = 'I found ' + this.foundWords.length + ' words and scored ' + this.score + ' points to achieve the rank of ' + this.currentRank;
            if (this.calendar.isCurrentPuzzleSameAsTodaysPuzzle(this.dayNumber)) {
                text += ' in today\'s #HiveMind, a word game by @GoldenSRL. Can you beat my score?';
            } else {
                text += ' in #HiveMind, a word game by @GoldenSRL. Can you beat my score?';
            }
            if (this.isDaily) {
                hashtags = "HiveMind" + this.dayNumber;
            }
        } else {
            text = 'I\'m playing #HiveMind, a word game by @GoldenSRL. Check it out!';
        }

        let myUrlWithParameters = new URL ("https://twitter.com/intent/tweet");
        if (hashtags !== undefined) {
            myUrlWithParameters.searchParams.append("hashtags", hashtags);
        }
        myUrlWithParameters.searchParams.append("ref_src", "twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E");
        myUrlWithParameters.searchParams.append("text", text);
        myUrlWithParameters.searchParams.append("url", document.URL);

        window.open(myUrlWithParameters, "");
    }

    getToastTextForWord(points, isPangram) {
        if (isPangram) {
            return 'Pangram! +' + points;
        } else if (points == 1) {
            return 'Good! +' + points;
        } else if (points > 4 && points < 7) {
            return 'Nice! +' + points;
        } else {
            return 'Awesome! +' + points; 
        }
    }

    setPointThreshold() {
        let isRankUp = false;
        let pointsToNextRank;
        if (this.isGameGoing) {
            let percentage = Math.round(1000 * (this.score / this.totalRoundPoints)) / 10;
            let tempRank = this.rank.getRank(percentage);
            pointsToNextRank = this.rank.getPointsToNextRank(this.currentRank, this.totalRoundPoints, this.score);
            this.pageManager.setToNextRank(pointsToNextRank);
            if (this.currentRank !== tempRank) {
                this.currentRank = tempRank;
                pointsToNextRank = this.rank.getPointsToNextRank(this.currentRank, this.totalRoundPoints, this.score);
                this.pageManager.animateRankUp(this.soundboard, this.currentRank, this.isSoundOn, pointsToNextRank);
                isRankUp = true;
            }
        }
        return isRankUp;
    }

    setThreshold() {
        if (this.isGameGoing) {
            let foundWordCount = this.foundWords.length;
            let percentage = Math.round(1000 * (foundWordCount / this.answerCount)) / 10;
            this.pageManager.setThreshold(percentage, foundWordCount, this.answerCount);
        }
    }

    setRankThreshold(isRankUp) {
        if (this.isGameGoing) {
            let percentage = this.rank.getProgressToNextRank(this.currentRank, this.totalRoundPoints, this.score);
            if (isRankUp) {
                setTimeout(() => {this.pageManager.setRankThreshold(percentage)}, 2000);
            } else {
                this.pageManager.setRankThreshold(percentage); 
            }
        }
    }

    submitFromChat(word, guesser) {
        console.log(word);
        console.log(guesser);
        let answerArrayIndex = this.answerArray.indexOf(word);
        if (word.length > 0) {
            if (this.isChatSubmissionValid(word, answerArrayIndex)) {
                this.revealWord(answerArrayIndex);
                this.foundWords.push(word);
                this.scoreWord(word);
                if (this.foundWords.length === this.answerCount) {
                    this.#endRound();
                } else {
                    this.soundboard.playSound("correctSound", 0.5, this.isSoundOn);
                }
            }
        }
        return;
    }

    submit() {
        let word = this.pageManager.getGuess();
        let answerArrayIndex = this.answerArray.indexOf(word);

        if (word.length > 0) {
            this.lastSubmittedGuess = word;
            if (this.isSubmissionValid(word, answerArrayIndex)) {
                this.revealWord(answerArrayIndex);
                this.foundWords.push(word);
                this.scoreWord(word);
                if (this.foundWords.length === this.answerCount) {
                    this.#endRound();
                } else {
                    this.soundboard.playSound("correctSound", 0.5, this.isSoundOn);
                }
            } else {
                this.soundboard.playSound("wrongSound", 0.3, this.isSoundOn);
            }
            for (let i=0; i<word.length; i++) {
                this.putLetterBack();
            }
        }
        return;
    }

    isChatSubmissionValid(word, answerArrayIndex) {
        if (word.length < 4) {
            return false;
        }
        if (!word.includes(this.seedCenterLetter.toUpperCase())) {
            return false;
        }
        let foundWordsIndex = this.foundWords.indexOf(word);
        if (foundWordsIndex >= 0) {
            return false;
        }
        if (answerArrayIndex < 0) {
            return false;
        }
        return true;
    }

    isSubmissionValid(word, answerArrayIndex) {
        if (word.length < 4) {
            this.pageManager.setToast("Too short!");
            return false;
        }
        if (!word.includes(this.seedCenterLetter.toUpperCase())) {
            this.pageManager.setToast("Missing center letter!");
            return false;
        }
        let foundWordsIndex = this.foundWords.indexOf(word);
        if (foundWordsIndex >= 0) {
            this.pageManager.setToast("Already found!");
            return false;
        }
        if (answerArrayIndex < 0) {
            this.pageManager.setToast("Not in word list!");
            return false;
        }
        return true;
    }

    typeLetter(letter) {
        for (let i=0; i<this.scrambledLetters.length; i++) {
            let field = "unusedLetterRow"+ (i+1).toString();
            if (this.scrambledLetters[i] === letter && document.getElementById(field).innerHTML !== undefined && document.getElementById(field).innerHTML.length > 0) {
                addLetter(field);
                break;
            }
        }
    }

    revealMissedWord(word) {
        this.pageManager.revealMissedWord(word, this.missedWords.length);
    }

    revealWord(index) {
        this.pageManager.revealWord(this.answerArray[index], this.foundWords.length + 1);
    }

    addLetter(field) {
        let letterToBeAdded = document.getElementById(field).innerHTML[30];
        if (this.usedLetterIndex < 18 && letterToBeAdded !== '' && letterToBeAdded !== undefined) {
            let className = letterToBeAdded == this.seedCenterLetter.toUpperCase() ? 'textY' : 'textW';
            this.pageManager.addLetterToGuess(letterToBeAdded, className)
            this.usedLetterIndex++;
        }
    }

    putLetterBack() {
        if (this.usedLetterIndex > 1) {
            this.pageManager.removeLetterFromGuess();
            this.usedLetterIndex--;
        }
    }

    scramble(playSound) {
        if (this.isGameGoing) {
            let copyLettersArray = [...this.letters];
            let centerLetterIndex = copyLettersArray.indexOf(this.seedCenterLetter.toUpperCase());
            copyLettersArray.splice(centerLetterIndex, 1);
            let newArray = [];
            for (let i=0; i<3; i++) {
                let nextIndex = Math.floor(Math.random() * copyLettersArray.length);
                newArray.push(copyLettersArray[nextIndex]);
                copyLettersArray.splice(nextIndex, 1);
            }
            newArray.push(this.seedCenterLetter.toUpperCase());
            for (let j=0; j<3; j++) {
                let nextIndex = Math.floor(Math.random() * copyLettersArray.length);
                newArray.push(copyLettersArray[nextIndex]);
                copyLettersArray.splice(nextIndex, 1);
            }
            this.scrambledLetters = newArray;
            this.pageManager.clearGuess();
            this.pageManager.shuffleTiles(this.scrambledLetters);
            this.usedLetterIndex = 1;
            this.originalPositionArray = [];
            if (playSound) {
                this.soundboard.playSound("shuffleSound", 0.15, this.isSoundOn);
            }
        }
    }

    processEnter() {
        if (this.usedLetterIndex > 1) {
            this.submit();
        } else {
            if (this.lastSubmittedGuess !== '' && this.usedLetterIndex === 1) {
                for (let i=0; i<this.lastSubmittedGuess.length; i++) {
                    this.typeLetter(this.lastSubmittedGuess.charAt(i));
                }
            }
        }
    }

    typePreviouslyFoundWord(index) {
        let selectedWord = this.answerArray[index-1];
        if (this.foundWords.indexOf(selectedWord) >= 0) {
            do {
                this.putLetterBack();
            } while (this.usedLetterIndex > 1);
            for (let i=0; i<selectedWord.length; i++) {
                this.typeLetter(selectedWord.charAt(i));
            }
        }
    }

    hideDefinition() {
        this.pageManager.hideDefinition();
    }

    async updateDefinition(index, isFoundWord) {
        if (index <= this.answerCount) {
            let word;
            if (isFoundWord && index <= this.foundWords.length) {
                word = this.foundWords[index-1];
            } else if (!isFoundWord && index <= this.missedWords.length) {
                word = this.missedWords[index-1];
            } else {
                return;
            }
            let result = await this.dictionary.lookup(word);
            this.pageManager.updateDefinition(result);
        }
    }

    toggleSound() {
        this.isSoundOn = !this.isSoundOn;
        this.pageManager.updateSoundButton(this.isSoundOn);
    }

    showLinkedPuzzle() {
        this.pageManager.showLinkedPuzzle();
    }

    hideLinkedPuzzle() {
        this.pageManager.hideLinkedPuzzle();
    }
}