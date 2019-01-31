
$(document).ready(function () {
    // $('#showbooking').DataTable();
    "use strict";
    var ref = localStorage['ref'];
    $('.logout').hide();
    $('.back').hide();
    $('.switch').hide();
    $('.print').hide();
    $('.address').hide();
    $('.orderItems').hide();
    if (ref == null) {
        window.location.href = "/index.html";
    }
    else {
        get_order_details(ref);
    }

    $('.logout').on("click", function () {
        localStorage.clear();
        window.location.href = "/index.html";
    });

    /*===============================prilagođene funkcije======================================*/

    function get_order_details(ref_order) {
        var ref = firebase.database().ref(ref_order);
        ref.once('value').then(function (snapshot) {
            // var order_comment = snapshot.val().comment;
            // var order_date = snapshot.val().date;
            var newOrder = snapshot.val().newOrder;

            ref.child("newOrder").on("value", function (res) {
                var states = res.val();
                $('#cmn-toggle-1').prop('checked', states);
            });

            $('#cmn-toggle-1').on('change', function () {
                if (this.checked) {
                    //console.log(this, "On");
                    ref.update({ newOrder: true });
                }
                else {
                    //console.log(this, "Off");
                    ref.update({ newOrder: false });
                }
            });

            var order_delivery = snapshot.val().delivery;
            if (order_delivery == "false") var lastNamePickup = snapshot.val().lastNamePickup;
            snapshot.forEach(function (child) {
                var child_key = child.key;
                if (child_key == "orderItems") {
                    var ref_orderitems = ref_order + '/' + child_key;
                    get_html_orderitems(ref_orderitems);
                }
                else if (child_key == "deliveryAddress") {
                    var ref_deliveryAddress = ref_order + '/' + child_key;
                    get_html_deliveryAddress(ref_deliveryAddress);
                }
            });
        });
    }

    function get_html_orderitems(ref_orderitems) {
        var ref = firebase.database().ref(ref_orderitems);
        ref.once('value').then(function (snapshot) {
            var html = "";
            snapshot.forEach(function (child) {
                // var order_key = child.key;
                // var addedToCart = child.val().addedToCart;
                // var clicked = child.val().clicked;
                var type = child.val().type;
                var title = child.val().title;
                var ingredients = child.val().ingredients;
                var quantity = child.val().quantity;
                var price = child.val().price;

                html += "<tr>" + "<td>" + type + "</td>"
                html += "<td>" + title + "</td>";
                html += "<td>" + ingredients + "</td>";
                html += "<td>" + quantity + "</td>";
                html += "<td>" + price + 'kn' + "</td>" + "</tr>";
            });
            $("#orderItems tbody").append(html);
            $("#loading").hide();
            $('.logout').show();
            $('.back').show();
            $('.switch').show();
            $('.print').show();
            $(".orderItems").show();
            $('#orderItems').DataTable({
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Croatian.json"
                }
            });
        });
    }

    function get_html_deliveryAddress(ref_deliveryAddress) {
        var ref = firebase.database().ref(ref_deliveryAddress);
        var html = "";
        ref.once('value').then(function (snapshot) {
            // var defaultAddress = snapshot.val().defaultAddress;
            var lastName = snapshot.val().lastName;
            var street = snapshot.val().street;
            var streetNumber = snapshot.val().streetNumber;
            var city = snapshot.val().city;
            var floor = snapshot.val().floor;
            var apartmentNumber = snapshot.val().apartmentNumber
            var phoneNumber = snapshot.val().phoneNumber;

            html += "<tr>" + "<td>" + lastName + "</td>";
            html += "<td>" + street + "</td>";
            html += "<td>" + streetNumber + "</td>";
            html += "<td>" + city + "</td>";
            html += "<td>" + floor + "</td>";
            html += "<td>" + apartmentNumber + "</td>";
            html += "<td>" + phoneNumber + "</td>" + "</tr>";

            $("#address tbody").append(html);
            $(".address").show();
        });
    }
    /*===============================prilagođene funkcije======================================*/
});