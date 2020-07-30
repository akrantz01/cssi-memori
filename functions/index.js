const functions = require('firebase-functions');
const admin = require("firebase-admin").initializeApp();

const firestore = admin.firestore();

// Run function daily to add new data for a given day
exports.newDay = functions.pubsub.schedule("0 0 * * *").onRun(_ => {
    // Update the numbers collection
    firestore.collection("numbers").get().then(snapshot => snapshot.forEach(doc => doc.ref.update({
        "accuracy-per-day": admin.firestore.FieldValue.arrayUnion(0),
        "games-per-day": admin.firestore.FieldValue.arrayUnion(0),
        "score-per-day": admin.firestore.FieldValue.arrayUnion(0),
        "last-played": admin.firestore.FieldValue.serverTimestamp()
    }))).catch(console.error);

    // Update the elements collection
    firestore.collection("elements").get().then(snapshot => snapshot.forEach(doc => doc.ref.update({
        "accuracy-per-day": admin.firestore.FieldValue.arrayUnion(0),
        "games-per-day": admin.firestore.FieldValue.arrayUnion(0),
        "score-per-day": admin.firestore.FieldValue.arrayUnion(0),
        "last-played": admin.firestore.FieldValue.serverTimestamp()
    }))).catch(console.error);
});

// Setup a user's structure on account creation
exports.userRegistered = functions.auth.user().onCreate(async (user) => {
    // Setup zero array going back ~6 months
    let emptyData = [];
    for (let i = 0; i < 30 * 6; i++) emptyData.push(0);

    // Create the date they "last played"
    let date = new Date();
    date.setMonth(date.getMonth() - 6);

    // Create structure for numbers
    await firestore.collection("numbers").doc(user.uid).create({
        "accuracy-per-day": emptyData,
        "games-per-day": emptyData,
        "score-per-day": emptyData,
        "last-played": new Date(),
        "total-games": 0
    })

    // Create structure for elements
    await firestore.collection("elements").doc(user.uid).create({
        "accuracy-per-day": emptyData,
        "games-per-day": emptyData,
        "score-per-day": emptyData,
        "last-played": new Date(),
        "total-games": 0
    });
});
