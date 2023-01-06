class Dictionary {
   
    #allWords = new Map();
   
    constructor() {
        this.#allWords.set('a', aWords);
        this.#allWords.set('b', bWords);
        this.#allWords.set('c', cWords);
        this.#allWords.set('d', dWords);
        this.#allWords.set('e', eWords);
        this.#allWords.set('f', fWords);
        this.#allWords.set('g', gWords);
        this.#allWords.set('h', hWords);
        this.#allWords.set('i', iWords);
        this.#allWords.set('j', jWords);
        this.#allWords.set('k', kWords);
        this.#allWords.set('l', lWords);
        this.#allWords.set('m', mWords);
        this.#allWords.set('n', nWords);
        this.#allWords.set('o', oWords);
        this.#allWords.set('p', pWords);
        this.#allWords.set('q', qWords);
        this.#allWords.set('r', rWords);
        this.#allWords.set('s', sWords);
        this.#allWords.set('t', tWords);
        this.#allWords.set('u', uWords);
        this.#allWords.set('v', vWords);
        this.#allWords.set('w', wWords);
        this.#allWords.set('x', xWords);
        this.#allWords.set('y', yWords);
        this.#allWords.set('z', zWords);
    }

    isValidPuzzle(word, center) {
        let firstLetter = word.charAt(0).toLowerCase();
        let wordList = this.#allWords.get(firstLetter);
        let match = puzzles.find(e => e.includes(word));
        if (match !== undefined) {
            let validCenterLetters = match.split(',')[1];
            if (validCenterLetters.includes(center)) {
                return true;
            }
        }
        return false;
    }

    getRandomPuzzle() {
        let index = Math.floor(Math.random() * puzzles.length);
        return puzzles[index] + ',' + index;
    }

    getPuzzleByID(puzzleID) {
        let index = puzzleID % 10000;
        return puzzles[index] + ',' + index;
    }

    getCenterLetterByID(puzzleID) {
        return Math.floor(puzzleID / 10000) - 1;
    }

    #usesOnlyLettersFromPangram(substring, word) {
        var letters = [...word];
        return [...substring].every(x => {
            var index = letters.indexOf(x);
            if (~index) {
                return true;
            }
        });
    }

    getValidWordArray(word, seedCenterLetter) {
        let result = new Array();
        for (let i=0; i<word.length; i++) {
            let letter = word.charAt(i);
            let wordSet = this.#allWords.get(letter);
            for (let j=0; j<wordSet.length; j++) {
                let substring = wordSet[j];
                if (substring.indexOf(seedCenterLetter) >= 0 && this.#usesOnlyLettersFromPangram(substring, word)) {
                    result.push(substring.toUpperCase());
                }
            }
        }
        return result;
    }

    getAllReasonablePuzzles() {
        for (let i=0; i<pangrams.length; i++) {
            let pangram = pangrams[i];
            let validCenterLetters = '';
            for (let j=0; j<pangram.length; j++) {
                let centerLetter = pangram.charAt(j);
                let wordCount = this.getValidWordArray(pangram, centerLetter).length;
                if (wordCount > 16 && wordCount < 81) {
                    validCenterLetters += centerLetter;
                }
            }
            if (validCenterLetters !== '') {
                console.log("\"" + pangram + "," + validCenterLetters + "\",");
            }
        }
    }

    async lookup(word) {
        let result = '';
        let myObject = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
        let myText = await myObject.text();
        let json = JSON.parse(myText);
        let hasWordBeenShown = false;
        for(let i=0; i<json.length; i++) {
            let word = json[i].word;
            if (!hasWordBeenShown) {
                result += '<h2>' + word + '</h2>';
                hasWordBeenShown = true;
            }
            for (let j=0; j<json[i].meanings.length; j++) {
                let meaning = json[i].meanings[j];
                let partOfSpeech = meaning.partOfSpeech;
                result += '<p><strong>' + partOfSpeech + '</strong></p>';
                for(let k=0; k<meaning.definitions.length; k++) {
                    let definition = meaning.definitions[k].definition;
                    result += '<p>' + (k+1) + '. ' + definition + '</p>';
                }
                result += '<br>';
            }
        }
        if (result === '') {
            result = '<h2>' + word.toLowerCase() + '</h2><p><strong>Unable to find defintion.</strong></p>';
        }
        return result;
    }
}