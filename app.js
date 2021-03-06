const config = {
    apiKey: "AIzaSyB7qp4Hhvwf-NcDfNxjZMs9JUXqQay7ML0",
    authDomain: "trainscheduler-5da9e.firebaseapp.com",
    databaseURL: "https://trainscheduler-5da9e.firebaseio.com",
    projectId: "trainscheduler-5da9e",
    storageBucket: "trainscheduler-5da9e.appspot.com",
    messagingSenderId: "64201272535"
};
const settings = {
    timestampsInSnapshots: true
};
firebase.initializeApp(config);
var database = firebase.firestore();
database.settings(settings);

/**
 * @param {string} docID The document ID. Null for an auto-generated ID.
 * @param  {object} jsonData Document field data. Doesn't support functions.
 */
function createDocument(docID, jsonData) {
    if (docID == undefined) database.collection('trains').add(jsonData);
    else database.collection('trains').doc(docID).set(jsonData);
}

/**
 * @param {string} docID The document ID. Must not be empty.
 */
function deleteDocument(docID) {
    database.collection('trains').doc(docID).delete();
}

/**
 * 
 * @param {string} docID The document ID. Must not be empty.
 * @param {object} jsonData Document field data. Doesn't support functions.
 */
function updateDocument(docID, jsonData) {
    database.collection('trains').doc(docID).update(jsonData);
}

/**
 * @param {string} input The string to format. (replaces every space with '-')
 */
function formatName(input) {
    return input.replace(/\s/g, '-').toLowerCase();
}

/**
 * @param {string} time Takes the inputted value and verifies that it's in HH:mm format
 */
function validateTime(time) {
    return moment(time, "HH:mm", true).isValid();
}

/**
 * @param {string} time The future time value in which to get the minutes remaining from the current time.
 */
function timeRemaining(time, interval, docID) {
    if (moment().format("YYYY-MM-DD HH:mm") >= moment().format(`YYYY-MM-DD ${time}`)) {
        let newTime = moment().add(interval, 'minutes').format("HH:mm");
        updateDocument(docID, {
            Arrival: newTime
        })
        time = newTime;
    }
    return moment(time, "HH:mm").endOf('minute').fromNow("HH:mm");
}

function addHeaderRow() {
    $('<div class="row header-row">').append($('<div class="col-sm-2">').text("Train Name"),
        $('<div class="col-sm-2">').text("Destination"),
        $('<div class="col-sm-2">').text("Frequency (min)"),
        $('<div class="col-sm-2">').text("Next Arrival"),
        $('<div class="col-sm-2">').text("Arrives In"),
        $('<div class="col-sm-2">').text("Actions")).appendTo($('.train-content'));
}

function addRow(trainName, trainDest, trainArrival, trainFrequency, trainMinutes) {
    $('<div>').attr('class', `row ${formatName(trainName)}`).append($('<div>').addClass('col-sm-2 train-name').text(trainName),
        $('<div>').addClass('col-sm-2 train-destination').text(trainDest),
        $('<div>').addClass('col-sm-2 train-frequency').text(trainFrequency),
        $('<div>').addClass('col-sm-2 train-arrival').text(trainArrival),
        $('<div>').addClass('col-sm-2 train-minutes').text(trainMinutes),
        $('<a style="color: red" href="#">').addClass('col-sm-2').attr('value', formatName(trainName)).text("Delete").click(function () {
            let tn = $(`.${$(this).attr('value')} > .train-name`)[0];
            deleteDocument($(tn).html());
            populateTrains();
        })).appendTo('.train-content');
}

function populateTrains() {
    $('.train-content').empty();
    let doc = database.collection('trains');
    doc.get().then(value => {
        if (value.docs.length == 0) {
            $('.train-content').text("You don't have any trains yet. You can add one below.");
            return;
        } else {
            addHeaderRow();
            value.forEach(result => {
                addRow(result.id, result.data().Destination, result.data().Arrival, result.data().Frequency, timeRemaining(result.data().Arrival, result.data().Frequency, result.id));
            })
        }
    })
}

// =====================================================================================================================

$('.btn-info').click(event => {
    event.preventDefault();

    let trainName = $('#train-name').val(),
        trainDest = $('#train-destination').val(),
        trainArrival = $('#train-arrival').val(),
        trainFrequency = $('#train-frequency').val();

    if (!validateTime(trainArrival)) { alert("First train time must be in a valid HH:mm format.\n\nThe time must also be in the future."); return; }
    if (trainName.length == 0) { alert("What's the Train's name...?"); return; }
    if (trainDest.length == 0) { alert("Where's the Train heading...?"); return; }
    if (!parseInt(trainFrequency)) { alert('Frequency must be a number'); return; }

    createDocument(trainName, {
        Destination: trainDest,
        Frequency: trainFrequency,
        Arrival: trainArrival,
    })

    populateTrains();
    $('form').trigger('reset');
})

$(document).ready(() => {
    populateTrains();
})

// =====================================================================================================================

/*

td = $(`.${$(this).attr('value')} > .train-destination`)[0].text(),
                tf = $(`.${$(this).attr('value')} > .train-frequency`)[0].text(),
                ta = $(`.${$(this).attr('value')} > .train-arrival`)[0].text(),
                tm = $(`.${$(this).attr('value')} > .train-minutes`)[0].text();

            updateDocument(`$(.${$(this).attr('value')}`, {
                Destination: td,
                Frequency: tf,
                Arrival: ta,
                Minutes: tm
            })
*/