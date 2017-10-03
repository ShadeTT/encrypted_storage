"use strict";

function open_panel() {
    slideIt();
    var a = document.getElementById("sidebar");
    a.setAttribute("id", "sidebar1");
    a.setAttribute("onclick", "close_panel()");
}

function slideIt() {
    var slidingDiv = document.getElementById("slider");
    var stopPosition = 0;
    if (parseInt(slidingDiv.style.right) < stopPosition) {
        slidingDiv.style.right = parseInt(slidingDiv.style.right) + 6 + "px";
        setTimeout(slideIt, 1);
    }
}

function close_panel() {
    slideIn();
    var a = document.getElementById("sidebar1");
    a.setAttribute("id", "sidebar");
    a.setAttribute("onclick", "open_panel()");
}

function slideIn() {
    var slidingDiv = document.getElementById("slider");
    var stopPosition = -404;
    if (parseInt(slidingDiv.style.right) > stopPosition) {
        slidingDiv.style.right = parseInt(slidingDiv.style.right) - 6 + "px";
        setTimeout(slideIn, 1);
    }
}

$(document).ready(function () {
    $("#id-upload-form").submit(function (e) {

        var formData = new FormData(this);
        var url = $(this).attr("action");

        e.preventDefault();

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            async: false,
            success: function (data) {
                console.log(data);
            },
            cache: false,
            contentType: false,
            processData: false
        });

        return false;
    });
});
