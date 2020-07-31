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

const assignRandomIfZero = (max) => (value) => (value !== 0) ? value : Math.floor(Math.random() * (max + 1));

// Add the ability to randomly generate
exports.generateRandomData = functions.https.onRequest(async (req, res) => {
    if (!req.query.hasOwnProperty("uid")) return res.status(400).json({"success": false});
    let uid = req.query.uid.toString();

    let docPromises = [];
    for (let type of ["numbers", "elements"]) docPromises.push(firestore.collection(type).doc(uid).get());
    let documents = await Promise.all(docPromises);

    let setPromises = [];
    for (let doc of documents) {
        // Retrieve the data
        let data = doc.data();

        // Assign random data points
        data["accuracy-per-day"] = data["accuracy-per-day"].map(assignRandomIfZero(100));
        data["games-per-day"] = data["games-per-day"].map(assignRandomIfZero(10));
        data["score-per-day"] = data["score-per-day"].map(assignRandomIfZero(10));
        data["total-games"] = Math.floor(Math.random() * 301);

        // Update the document
        setPromises.push(doc.ref.set(data));
    }
    await Promise.all(setPromises);

    return res.status(200).json({"success": true});
});
