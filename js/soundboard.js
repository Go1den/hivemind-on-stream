class Soundboard {
    correctSound = new Audio("audio/correct.mp3");
    wrongSound = new Audio("audio/wrong.mp3");
    shuffleSound = new Audio("audio/shuffle.mp3");
    gameOverSound = new Audio("audio/gameover.mp3");
    rankUpSound = new Audio("audio/rankup.mp3");
    soundMap = new Map();

    constructor () {
        this.soundMap.set("correctSound", this.correctSound);
        this.soundMap.set("wrongSound", this.wrongSound);
        this.soundMap.set("shuffleSound", this.shuffleSound);
        this.soundMap.set("gameOverSound", this.gameOverSound);
        this.soundMap.set("rankUpSound", this.rankUpSound);
    }

    playSound(soundName, volume, isSoundOn) {
        if (isSoundOn) {
            let targetSound = this.soundMap.get(soundName);
            targetSound.currentTime = 0;
            targetSound.volume = volume;
            targetSound.play();
        }
    }

    stopAllSounds() {
        this.soundMap.forEach((v) => v.pause());
    }
}