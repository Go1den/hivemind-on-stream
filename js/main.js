let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let puzzle = urlParams.get('puzzle');
let daily = urlParams.get('daily');

let hivemind = new Hivemind();
hivemind.calendar.getDailyPuzzleNumber();

if ((puzzle !== undefined && puzzle !== null) || (daily !== undefined && daily !== null)) {
    hivemind.showLinkedPuzzle();
} else {
    hivemind.hideLinkedPuzzle();
}

ComfyJS.onChat = (user, message, flags, self, extra) => {
    console.log(user);
    console.log(message);
    console.log(flags);
    console.log(self);
    console.log(extra);
    hivemind.submitFromChat(message.toUpperCase(), user);
}

ComfyJS.Init("Go1den");

function tweet(e, isScoreTweet) {
    hivemind.tweet(isScoreTweet);
    e.blur();
}

function toggleSound(e) {
    hivemind.toggleSound();
    e.blur();
}

function todaysGame(e) {
    hivemind.todaysGame();
    e.blur();
}

function newGame(e) {
    hivemind.randomGame();
    e.blur();
}

function linkedGame(e) {
    if (daily !== undefined && daily !== null) {
        let param = Number(daily);
        if (param <= hivemind.calendar.getDailyPuzzleNumber()) {
            hivemind.specificGame(Number(daily), true);
        } else {
            alert("The puzzle in your URL is not valid. Try playing today's puzzle or a random puzzle instead!");
        }
    } else if (puzzle !== undefined && puzzle !== null) {
        hivemind.specificGame(Number(puzzle), false);
    } else {
        alert("The puzzle in your URL is not valid. Try playing today's puzzle or a random puzzle instead!");
    }
    e.blur();
}

function backToHomeScreen(e) {
    location.href = "https://go1den.github.io/hivemind";
}

function scramble(e) {
    if (hivemind.getIsGameGoing()) {
        hivemind.scramble(true);
    }
    e.blur();
}

function addLetter(field) {
    if (hivemind.getIsGameGoing()) {
        hivemind.addLetter(field);
    }
}

function putLetterBack(e) {
    if (hivemind.getIsGameGoing()) {
        hivemind.putLetterBack();
    }
    e.blur();
}

function submit(e) {
    if (hivemind.getIsGameGoing()) {
        hivemind.submit();
    }
    e.blur();
}

function giveUp(e) {
    if (hivemind.getIsGameGoing()) {
        hivemind.giveUp();
    }
    e.blur();
}

function onAnswerBoardClick(e, index, isFoundWord) {
    if (hivemind.getIsGameGoing()) {
        hivemind.typePreviouslyFoundWord(index);
    } else {
        hivemind.updateDefinition(index, isFoundWord);
    }
    e.blur();
}

document.addEventListener("keydown", function(event) {
    if (hivemind.getIsGameGoing()) {
        if (event.key === "Backspace") {
            hivemind.putLetterBack();
        } else if (event.key === "Enter") {
            hivemind.processEnter();
        } else if (event.key === " ") {
            hivemind.scramble(true);
        } else if (event.code.startsWith("Key") && event.code.length == 4) {
            let charCode = event.code.charCodeAt(3);
            if (charCode >= 65 && charCode <= 90) {
                hivemind.typeLetter(event.code.charAt(3));
            }
        }
    }
});