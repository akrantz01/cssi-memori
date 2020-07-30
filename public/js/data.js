/**
 * Add a value to an average
 *
 * @param average {number} the old average
 * @param value {number} the value to add to the average
 * @param size {number} the number of values in the average
 * @return {number} the new average
 */
function addToAverage(average, value, size) {
    return average + ((value - average) / size);
}

class GameData {
    constructor(gameCollection) {
        this.uid = "";
        this.collection = gameCollection;

        this.lastPlayed = new Date();
        this.totalGames = 0;
        this.accuracyPerDay = [];
        this.gamesPerDay = [];
        this.scorePerDay = [];

        firebase.auth().onAuthStateChanged(user => {
            // Stop execution if not signed in
            if (!user) return;

            this.uid = user.uid;

            firebase.firestore().collection(this.collection).doc(this.uid)
                .onSnapshot(doc => {
                    // Retrieve the data
                    let data = doc.data();

                    // Set the current data
                    if (data["last-played"]) this.lastPlayed = new Date(data["last-played"].seconds * 1000);
                    this.totalGames = data["total-games"];
                    this.accuracyPerDay = data["accuracy-per-day"];
                    this.gamesPerDay = data["games-per-day"];
                    this.scorePerDay = data["score-per-day"];

                    // Dispatch an event notifying of updated data
                    document.dispatchEvent(new CustomEvent("analytics-data"));
                });
        });
    }

    /**
     * Add data for a played game
     *
     * @param accuracy {number} the accuracy as a percent (not decimal)
     * @param score {number} the player's score
     * @return {Promise<void>}
     */
    async playedGame(accuracy, score) {
        // Increment the games played that day
        this.gamesPerDay[this.gamesPerDay.length - 1]++;

        // Modify the average score and accuracy
        this.accuracyPerDay[this.accuracyPerDay.length - 1] = addToAverage(this.accuracyPerDay[this.accuracyPerDay.length - 1], accuracy, this.gamesPerDay[this.gamesPerDay.length - 1]);
        this.scorePerDay[this.scorePerDay.length - 1] = addToAverage(this.scorePerDay[this.scorePerDay.length - 1], score, this.gamesPerDay[this.gamesPerDay.length - 1]);

        // Update the database
        await firebase.firestore().collection(this.collection).doc(this.uid).update({
            "total-games": firebase.firestore.FieldValue.increment(1),
            "last-played": firebase.firestore.FieldValue.serverTimestamp(),
            "accuracy-per-day": this.accuracyPerDay,
            "games-per-day": this.gamesPerDay,
            "score-per-day": this.scorePerDay
        });
    }


}

const Numbers = new GameData("numbers");
const Elements = new GameData("elements");
