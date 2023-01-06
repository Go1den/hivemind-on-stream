class Rank {
    constructor() {

    };

    getRank(percentage) {
        if (percentage < 2) {
            return "Beeswax";
        } else if (percentage < 5) {
            return "Larva";
        } else if (percentage < 10) {
            return "Pupa";
        } else if (percentage < 25) {
            return "New Bee";
        } else if (percentage < 40) {
            return "Worker Bee";
        } else if (percentage < 55) {
            return "Busy Bee";
        } else if (percentage < 70) {
            return "Drone";
        } else if (percentage < 100) {
            return "Queen Bee";
        } else {
            return "Bee's Knees";
        }
    }

    getStartingPercentage(rankName) {
        if (rankName === "Beeswax") {
            return 0.00;
        } else if (rankName === "Larva") {
            return .02;
        } else if (rankName === "Pupa") {
            return .05;
        } else if (rankName === "New Bee") {
            return .10;
        } else if (rankName === "Worker Bee") {
            return .25;
        } else if (rankName === "Busy Bee") {
            return .40;
        } else if (rankName === "Drone") {
            return .55;
        } else if (rankName === "Queen Bee") {
            return .70;
        } else {
            return 1.00;
        }
    }

    getTargetPercentage(rankName) {
        if (rankName === "Beeswax") {
            return .02;
        } else if (rankName === "Larva") {
            return .05;
        } else if (rankName === "Pupa") {
            return .10;
        } else if (rankName === "New Bee") {
            return .25;
        } else if (rankName === "Worker Bee") {
            return .40;
        } else if (rankName === "Busy Bee") {
            return .55;
        } else if (rankName === "Drone") {
            return .70;
        } else {
            return 1.00;
        }
    }

    getProgressToNextRank(rankName, totalPossiblePoints, myScore) {
        let startingPercentage = this.getStartingPercentage(rankName);
        let targetPercentage = this.getTargetPercentage(rankName);
        let lowerThreshold = startingPercentage * totalPossiblePoints;
        let upperThreshold = targetPercentage * totalPossiblePoints;
        let pointsInRange = upperThreshold - lowerThreshold;
        let pointsEarnedInRange = Math.max(0, myScore - lowerThreshold);
        return Math.round(1000 * (pointsEarnedInRange / pointsInRange)) / 10;
    }

    getPointsToNextRank(rankName, totalPossiblePoints, myScore) {
        let startingPercentage = this.getStartingPercentage(rankName);
        let targetPercentage = this.getTargetPercentage(rankName);
        let lowerThreshold = Math.ceil(startingPercentage * totalPossiblePoints);
        let upperThreshold = Math.ceil(targetPercentage * totalPossiblePoints);
        console.log("lowerThreshold: " + lowerThreshold);
        console.log("upperThreshold: " + upperThreshold);
        let pointsInRange = upperThreshold - lowerThreshold;
        console.log("Points in range: " + pointsInRange);
        let pointsEarnedInRange = Math.max(0, myScore - lowerThreshold);
        console.log("Points earned in range: " + pointsEarnedInRange);
        return Math.max(0, pointsInRange - pointsEarnedInRange);
    }
}