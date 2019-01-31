
(function ($) {
    "use strict";
    $('#loading').hide();
    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    });

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('#login').on('click', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        if (check) {
            $('#loading').show();
            var email = $('#loginEmail').val();
            var password = $('#loginPassword').val();
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (authData) {
                    var userId = firebase.auth().currentUser.uid;
                    localStorage.setItem('userId', userId);
                    //document.cookie = userId;
                    $('#loading').hide();
                    window.location.href = "/orders.html";
                })
                .catch(function (error) {
                    // Handle Errors here.
                    $('#loading').hide();
                    var delayTime = 500;
                    setTimeout(function () {
                        //your code to be executed after 1 second
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode === 'auth/wrong-password') {
                            alert('Wrong password.');
                        } else {
                            alert(errorMessage);
                        }
                        console.log(error);
                    }, delayTime);

                });
        }
        else
            return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    /*==================================================================
    [ Show pass ]*/

    var showPass = 0;
    $('.btn-show-pass').on('click', function () {
        if (showPass == 0) {
            $(this).next('input').attr('type', 'text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type', 'password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }

    });

    input.keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#login').click();
            return false;
        }
    });


})(jQuery);