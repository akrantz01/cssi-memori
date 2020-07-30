/**
 * Generate the date labels on the x-axis
 *
 * @param to {number} the number of labels to generate in reverse
 * @param from {number}
 * @return {Array<string>} the resulting time labels as ISO date strings
 */
function generateLabels(to, from=0) {
    // Create data and remove hours, minutes and seconds
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Subtract starting days from the current date
    date.setDate(date.getDate() + 1 - from);

    // Resulting labels
    let labels = [];

    // Decrement the date, format it, and add it to the labels
    for (let i = 0; i < (to - from); i++) {
        date.setDate(date.getDate() - 1);
        labels.push(date.toISOString());
    }

    // Reverse the date
    return labels.reverse();
}

/**
 * Retrieve the data for a given range of dates and draw the graphs
 *
 * @param to {number} the end day for the data, relative to the current date
 * @param from {number} the start day for the data, relative to the current date
 */
function displayRange(to, from=0) {
    // Generate the date labels
    let labels = generateLabels(to, from);

    // Get the starting and ending indices
    let startIdx = Numbers.accuracyPerDay.length - to;
    let endIdx = Numbers.accuracyPerDay.length - from;

    // Render graphs
    renderGamesPerDayChart({ numbers: Numbers.gamesPerDay.slice(startIdx, endIdx), elements: Elements.gamesPerDay.slice(startIdx, endIdx) }, labels);
    renderAverageScorePerGameChart({ numbers: Numbers.scorePerDay.slice(startIdx, endIdx), elements: Elements.gamesPerDay.slice(startIdx, endIdx) }, labels);
    renderAccuracyPerGameChart({ numbers: Numbers.accuracyPerDay.slice(startIdx, endIdx), elements: Elements.accuracyPerDay.slice(startIdx, endIdx) }, labels);

    // Render smaller charts
    renderGamesDistributionChart(50, 50);
}

/**
 * Handle callbacks for the date range selection dropdown
 *
 * @param to {number} the end day for the range
 * @param from {number} the start day for the range
 */
function selectDateRangeCallback(to, from=0) {
    // Select the text for the range
    if (to === 7) $("#dateRangeText").text("This week");
    else if (to === 14) $("#dateRangeText").text("Last week");
    else if (to === 30) $("#dateRangeText").text("This month");
    else if (to === 90) $("#dateRangeText").text("Last 3 months");
    else if (to === 180) $("#dateRangeText").text("Last 6 months");

    // Render the new chart
    displayRange(to, from);
}

/**
 * Display the current activity for a game
 * @param game {{collection: string, lastPlayed: Date, gamesPerDay: Array<number>, scorePerDay: Array<number>}} the game data object
 */
function displayCurrentGameActivity(game) {
    $(`#${game.collection}GamesPlayed`).text(
        (game.lastPlayed.getDate() < (new Date()).getDate()) ?
            0 :
            game.gamesPerDay[game.gamesPerDay.length - 1]
    );
    $(`#${game.collection}AverageScore`).text(
        (game.lastPlayed.getDate() < (new Date()).getDate()) ?
            0 :
            game.scorePerDay[game.scorePerDay.length - 1]
    );
}

// Ensure users are logged in
checkUserLoggedIn();

// Run script on page load
$(document).ready(() => {
    'use strict'

    // Listen for new event data and re-render everything
    document.addEventListener("analytics-data", () => {
        // Display the big numbers
        [Numbers, Elements].forEach(displayCurrentGameActivity);

        // Re-draw graphs
        displayRange(7);
    })
});
