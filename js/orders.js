
$(document).ready(function () {

    "use strict";
    var restaurantId = 0;
    var restaurantName = '';
    var orders = new Array();
    $(".container").hide();
    var userId = localStorage['userId'];

    if (userId == null) {
        window.location.href = "/index.html";
    }
    else {
        get_restaurantId(userId);
        var ref = firebase.database().ref("/restaurantData");
        ref.on('child_changed', function (snapshot) {
            var table = $('#showbooking').DataTable();
            table.destroy();
            $("tbody").empty();
            get_restaurantId(userId);
        });
    }
    $('tbody').on("click", 'tr', function () {
        var ref = $(this).attr('id');
        localStorage.setItem('ref', ref);
        window.location.href = "/orderdetails.html";
    });

    $('.logout').on("click", function () {
        localStorage.clear();
        window.location.href = "/index.html";
    });

    /*===============================prilagođene funkcije======================================*/

    function get_restaurantId(userId) {
        var ref = firebase.database().ref("/restaurantUsers/" + userId + "/restaurantID");
        ref.once('value').then(function (snapshot) {
            restaurantId = snapshot.val();
            get_restaurantName(restaurantId);
        });
    }

    function get_restaurantName(restaurantId) {
        var ref = firebase.database().ref("/restaurants/" + restaurantId);
        ref.once('value').then(function (snapshot) {
            restaurantName = snapshot.val().name;
            get_orders(restaurantName);
        });
    }

    function get_orders(restaurantName) {
        var ref = firebase.database().ref("/restaurantData/" + restaurantName);
        ref.once('value').then(function (snapshot) {
            var order_name = "";
            snapshot.forEach(function (child) {
                var order_id = child.key;
                var new_order = child.val().newOrder;
                if (new_order == true) {
                    new_order = "Da";
                } else {
                    new_order = "Ne";
                }
                var order_date = child.val().orderTime;
                var date = new Date(order_date);
                // var order_delivery = child.val().delivery;                
                var order_ref = '/restaurantData/' + restaurantName + '/' + order_id;
                var order_name_ref = '/restaurantData/' + restaurantName + '/' + order_id + '/' + 'deliveryAddress';

                if (child.val().lastNamePickup) {
                    var html = "";
                    order_name = child.val().lastNamePickup;
                    html += "<tr id='" + order_ref + "'>" + "<td>" + order_name + "</td>";
                    html += "<td>" + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' - ' + (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(); + "</td>";
                    html += "<td>" + "Ne" + "</td>";
                    html += "<td>" + new_order + "</td>" + "</tr>";
                    $("tbody").append(html);
                }
                else {
                    var ref_name = firebase.database().ref(order_name_ref);
                    ref_name.once('value').then(function (snapshot) {
                        order_name = snapshot.val().lastName;
                        var html = "";
                        html += "<tr id='" + order_ref + "'>" + "<td>" + order_name + "</td>";
                        html += "<td>" + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' - ' + (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(); + "</td>";
                        html += "<td>" + "Da" + "</td>";
                        html += "<td>" + new_order + "</td>" + "</tr>";
                        $("tbody").append(html);
                    });
                }
            });

            var delay = 2000;
            setTimeout(function () {
                $("#loading").hide();
                $(".container").show();
                $('#showbooking').DataTable({
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Croatian.json"
                    }
                });
            }, delay);
        });
    }

    /*===============================prilagođene funkcije======================================*/

});