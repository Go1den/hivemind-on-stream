class Calendar {
    
    constructor () {

    }

    getTodaysDateString() {
        let today = new Date();
        return this.getDateString(today);
    }

    getDateString(date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        return mm + dd + yyyy;
    }

    getFirstPuzzleDate() {
        let date = new Date(2022, 11, 21);
        return this.setToMidnight(date);
    }

    setToMidnight(date) {
        let result = new Date(date);
        result.setHours(0, 0, 0);
        return result;
    }

    getPastDailyPuzzleString(day) {
        let date = this.getFirstPuzzleDate();
        date.setDate(date.getDate() + (day - 1));
        return this.getDateString(date);
    }

    getDailyPuzzleNumber() { //coincidentally, this is also the maximum allowed daily puzzle number
        let today = new Date();
        today = this.setToMidnight(today);
        let result = 1 + (Math.floor((today.getTime() - this.getFirstPuzzleDate().getTime()) / (1000 * 3600 * 24)));
        return result;
    }

    isCurrentPuzzleSameAsTodaysPuzzle(dayNumber) {
        return dayNumber == this.getDailyPuzzleNumber();
    }
}