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
    var role = '';
    var startDate = '';
    var monthlyRate = 0;
    var totalBilled = 0;
    var monthsWorked = 0;
    // submit button
    $('#submit-button').on('click', function (event) {
        //prevent page from refreshing
        event.preventDefault();
        // need to change ids based on form ids
        name = $('#name').val().trim();
        role = $('#role').val().trim();
        startDate = $('#start-date').val().trim();
        monthlyRate = $('#monthly-rate').val().trim();
        var newDate = $('#start-date').val().trim();

        newDate = new Date(newDate);
        var today = new Date();
        var dif = today - newDate;
        //2629743 seconds in a month(on average), divided by 1000 ms in a second
        var monthsWorked = Math.floor((dif / 2629743) / 1000);
        console.log(monthsWorked);
        totalBilled = Math.round(monthsWorked * monthlyRate);
        
        database.ref().push({
            name: name,
            role: role,
            startDate: startDate,
            monthlyRate: monthlyRate,
            monthsWorked: monthsWorked,
            totalBilled: totalBilled,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        name = $('#name').val("");
        role = $('#role').val("");
        startDate = $('#start-date').val("");
        monthlyRate = $('#monthly-rate').val("");
    });
    
    database.ref().on("child_added", function (snapshot) {
        var sv = snapshot.val();
        var newRow = $('<tr>');
        newRow.append('<td>' + sv.name + '</td>');
        newRow.append('<td>' + sv.role + '</td>');
        newRow.append('<td>' + sv.startDate + '</td>');
        newRow.append('<td>' + sv.monthlyRate + '</td>');
        newRow.append('<td>' + sv.monthsWorked + '</td>');
        newRow.append('<td>' + sv.totalBilled + '</td>');
        $('.table-data').append(newRow);
        console.log(sv.name);
        console.log(sv.role);
        console.log(sv.startDate);
        console.log(sv.monthlyRate);
        console.log(sv.totalBilled);
    });
});