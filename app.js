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
 * @param {string} docID The document ID. Leave empty for an auto-generated ID.
 * @param  {object} jsonData Document field data. Doesn't support functions.
 */
function createDocument(docID, jsonData) {
    if(docID == undefined) database.collection('trains').add(jsonData);
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

function formatName(input) {
    return input.replace(/\s/g, '-').toLowerCase();
}
// =====================================================================================================================

$('.btn-info').click(event => {
    event.preventDefault();

    let trainName = $('#train-name').val(), 
        trainDest = $('#train-destination').val(),
        trainArrival = $('#train-arrival').val(),
        trainFrequency = $('#train-frequency').val();

    if(trainName.length == 0) { alert("What's the Train's name...?"); return; }
    if(trainDest.length == 0) { alert("Where's the Train heading...?"); return; }
    if(!parseInt(trainFrequency)) { alert('Frequency must be a number'); return; }

    // createDocument(trainName, {
    //     Destination: trainDest,
    //     Arrival: trainArrival,
    //     Frequency: trainFrequency
    // })

    $('<div>').attr('class', `row ${formatName(trainName)}`).append($('<div>').addClass('col-sm-2').text(trainName),
        $('<div>').addClass('col-sm-2').text(trainDest),
        $('<div>').addClass('col-sm-2').text(trainFrequency),
        $('<div>').addClass('col-sm-2').text(trainArrival),
        $('<div>').addClass('col-sm-2').text(0),
        $('<button>').addClass('btn btn-danger col-sm-2').attr('value', formatName(trainName)).text("Delete").click(function() {
            $(`.${$(this).attr('value')}`).remove();
        })).appendTo('.train-content');
})

// =====================================================================================================================