/**
 * Generate the options for the chart
 *
 * @param title {string} the graph title
 * @param yLabel {string} the label for the y-axis
 * @param labels {Array<string>} the array of all labels
 * @return {Object} the generated display options
 */
function generateChartOptions(title, yLabel, labels) {
    return {
        // Display the legend at the bottom
        legend: {
            display: true,
            position: "bottom"
        },

        // Enable zooming in and panning
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x",
                    speed: 5,
                    rangeMin: {
                        x: new Date(labels[0])
                    },
                    rangeMax: {
                        x: new Date(labels[labels.length - 1])
                    }
                },
                zoom: {
                    enabled: true,
                    mode: "x",
                    sensitivity: 3,
                    rangeMin: {
                        x: new Date(labels[0])
                    },
                    rangeMax: {
                        x: new Date(labels[labels.length - 1])
                    }
                }
            }
        },

        // Labelling on the y-axis
        scales: {
            xAxes: [
                {
                    type: "time",
                    distribution: "linear",
                    ticks: {
                        bounds: "data",
                        source: "auto"
                    },
                    time: {
                        unit: "day"
                    }
                }
            ],
            yAxes: [
                {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    },
                }
            ]
        },

        // Set the graph title
        title: {
            display: true,
            text: title
        },

        // Change how the tooltip is displayed on mouse over
        tooltip: {
            enabled: true,
            position: "nearest"
        }
    }
}

/**
 * Apply styling and labels to the datasets
 *
 * @param numbers the data for the numbers game
 * @param elements the data for the elements game
 * @return {Array<Object>} the styled data to be passed into the chart
 */
function styleDatasets(numbers, elements) {
    return [
        {
            backgroundColor: "hsla(117, 47%, 51%, 0.45)",
            borderColor: "hsla(117, 47%, 51%, 0.75)",
            borderWidth: 2,
            data: numbers,
            label: "Numbers"
        },
        {
            backgroundColor: "hsla(210, 74%, 68%, 0.35)",
            borderColor: "hsla(210, 74%, 68%, 0.6)",
            borderWidth: 2,
            data: elements,
            label: "Elements"
        }
    ]
}

/**
 * Replace a chart with a new, blank canvas
 *
 * @param id {string} the id of the canvas to replace
 * @return {HTMLElement} the newly created canvas
 */
function replaceChart(id) {
    // Replace the old chart
    $(`#${id}`).replaceWith(`<canvas class="my-4 w-100" id="${id}"></canvas>`);

    // Retrieve the new canvas
    return document.getElementById(id);
}

/**
 * Render the games played per day chart with data for each game
 *
 * @param numbers {Array<number>} the data for the numbers game
 * @param elements {Array<number>} the data for the elements game
 * @param labels {Array<string>} the labels to give each dataset
 */
function renderGamesPerDayChart({ numbers, elements }, labels) {
    // Retrieve drawing context
    let ctx = replaceChart("gamesPerDayChart");

    // Render the chart
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: styleDatasets(numbers, elements)
        },
        options: generateChartOptions("Games Played per Day", "Number of games", labels)
    });
}

/**
 * Render the average score per day chart with data for each game
 *
 * @param numbers {Array<number>} the data for the numbers game
 * @param elements {Array<number>} the data for the elements game
 * @param labels {Array<string>} the labels to give each dataset
 */
function renderAverageScorePerGameChart({ numbers, elements }, labels) {
    // Retrieve drawing context
    let ctx = replaceChart("averageScorePerGameChart");

    // Add additional style to the datasets
    let datasets = styleDatasets(numbers, elements);
    for (const dataset of datasets) dataset.fill = false;

    // Render the chart
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: generateChartOptions("Average Score per Game per Day", "Average Score", labels)
    });
}

/**
 * Render the accuracy chart with data for each game
 *
 * @param numbers {Array<number>} the data for the numbers game
 * @param elements {Array<number>} the data for the elements game
 * @param labels {Array<String>} the labels to give each dataset
 */
function renderAccuracyPerGameChart({ numbers, elements }, labels) {
    // Retrieve drawing context
    let ctx = replaceChart("accuracyPerGameChart");

    // Setup the chart options
    let options = generateChartOptions("Accuracy per Game per Day", "Accuracy (%)", labels);
    options.scales.yAxes[0].ticks = {
        suggestedMax: 100,
        suggestedMin: 0
    };

    // Style the data
    let datasets = styleDatasets(numbers, elements)
    for (const dataset of datasets) {
        dataset.fill = false;
        dataset.lineTension = 0;
    }

    // Render the chart
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: options
    });
}

/**
 * Render the percent of each game played
 *
 * @param numbers {number} the percent played of the numbers game
 * @param elements {number} the percent played of the elements game
 */
function renderGamesDistributionChart(numbers, elements) {
    // Retrieve drawing context
    let ctx = replaceChart("gamesDistributionChart");

    // Render the chart
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: [
                "Numbers",
                "Elements"
            ],
            datasets: [
                {
                    data: [
                        numbers,
                        elements
                    ],
                    backgroundColor: [
                        "hsla(117, 47%, 51%, 0.45)",
                        "hsla(210, 74%, 68%, 0.35)"
                    ]
                }
            ]
        },
        options: {
            animation: {
                animateScale: true,
                animateRotate: true
            },
            legend: {
                display: true,
                position: "bottom"
            },
            title: {
                display: true,
                text: "Number of each Game Played"
            },
            responsive: true
        }
    })
}
