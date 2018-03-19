$(document).ready(function () {
    // var for connecting to Firebase
    var config = {
        apiKey: "AIzaSyC1rQKRFXW8VMTsrJD-S_4lTXre0pS6aFk",
        authDomain: "train-scheduler-db-8ccc3.firebaseapp.com",
        databaseURL: "https://train-scheduler-db-8ccc3.firebaseio.com",
        projectId: "train-scheduler-db-8ccc3",
        storageBucket: "",
        messagingSenderId: "1058123752513"
    };
    firebase.initializeApp(config);

    // variable reference to the database
    var database = firebase.database();
    // initial variables
    var name = '';
    var destination = '';
    var firstTime = '';
    var frequency = 0;
  

    //clock feature
    function timedUpdate() {
        updateClock();
        setTimeout(timedUpdate, 1000);
    }
    
    function updateClock() {
        var now = moment().format('LTS')
        $('#time-display').html(`<h1>${now}</h1>`);
    }
    
    timedUpdate();

    // submit button
    $('#submit-button').on('click', function (event) {
        //prevent page from refreshing
        event.preventDefault();
        // need to change ids based on form ids
        name = $('#name').val().trim();
        destination = $('#destination').val().trim();
        firstTime = $('#last-time').val().trim();
        frequency = $('#frequency').val().trim();

        var nextTrain = moment(firstTime,"HH:mm").add(frequency, 'm').format('HH:mm');
        var timeAway = moment(nextTrain,"HH:mm").fromNow('m');
        

        database.ref().push({
            name: name,
            destination: destination,
            frequency: frequency,
            firstTime:firstTime,
            nextTrain: nextTrain,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        name = $('#name').val("");
        destination = $('#destination').val("");
        firstTime = $('#last-time').val("");
        frequency = $('#frequency').val("");
    });

    database.ref().on("child_added", function (snapshot) {
        var sv = snapshot.val();
        nextTrain = moment().add(sv.frequency, 'm').format('HH:mm');
        console.log(nextTrain);
        var timeAway = moment().fromNow('m');

        timeAway.from(nextTrain);


        var newRow = $('<tr>');
        newRow.append('<td>' + sv.name + '</td>');
        newRow.append('<td>' + sv.destination + '</td>');
        newRow.append('<td>' + sv.firstTime + '</td>');
        newRow.append('<td>' + sv.frequency + '</td>');
        newRow.append('<td>' + sv.nextTrain + '</td>');
        newRow.append('<td>' + timeAway + '</td>');
        
        $('.table-data').append(newRow);

    });
});