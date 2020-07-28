/**
 * Generate the date labels on the x-axis
 *
 * @param to {number} the number of labels to generate in reverse
 * @param from {number}
 * @return {Array<string>} the resulting time labels as ISO date strings
 */
function generateLabels(to, from=0) {
    // Clone the date to not modify the original
    let date = new Date();
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
    let labels = generateLabels(to, from);

    let numbersData = [];
    for (let i = 0; i < to - from; i++) numbersData.push(Math.floor(Math.random() * 101));
    let elementsData = [];
    for (let i = 0; i < to - from; i++) elementsData.push(Math.floor(Math.random() * 101));

    // Render graphs
    renderGamesPerDayChart({ numbers: numbersData, elements: elementsData }, labels);
    renderAverageScorePerGameChart({ numbers: numbersData, elements: elementsData }, labels);
    renderAccuracyPerGameChart({ numbers: numbersData, elements: elementsData }, labels);

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

// Ensure users are logged in
checkUserLoggedIn();

// Run script on page load
$(document).ready(() => {
    'use strict'

    // Create the graph
    displayRange(7);
});
