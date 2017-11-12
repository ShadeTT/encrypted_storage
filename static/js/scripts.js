"use strict";

$(document).ready(function () {

    var key;

    _.templateSettings.variable = "rc";
    function update_content() {
        var template = _.template(
            $("script.template").html()
        );

        var parent_id = $("#id_parent_id").data("parent_id");
        var url = "/content_list/";

        if (parent_id != "") {
            url += parent_id + "/";
        }

        $.getJSON(url, function (response) {
            $(".wrapper").html(template(response));
            if (key != undefined) {
                decrypt();
            }
        });
    }

    update_content();

    function decrypt() {
        $(".encrypted").each(function (i) {

            try {
                $(this).text(sjcl.decrypt(key, JSON.stringify($(this).data("content"))));
            } catch (err) {
                $(this).text("");
            }
        });
        $(".hide-if-encrypted").removeClass("hide-if-encrypted");
    }

    function base64ToArrayBuffer(base64) {
        var binaryString = base64;
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    var saveByteArray = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, name) {
            var blob = new Blob(data, {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    document.querySelector("input#id_file[type='file']").addEventListener("change", function (e) {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var result = this.result;

            $("#id_file_content").val(sjcl.encrypt(key, result));

            $("#id_name").val(sjcl.encrypt(key, file.name));
        };
        reader.readAsBinaryString(file);

    }, false);

    document.querySelector("input#id_key[type='file']").addEventListener("change", function (e) {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            key = this.result;

            $(".right-button.hidden").removeClass("hidden");
            decrypt();
        };
        reader.readAsText(file);
    }, false);

    $("#id-create-folder").submit(function (e) {

        $("#id_name_folder_hidden").val(sjcl.encrypt(key, $("#id_name_folder").val()));

        var formData = new FormData(this);
        var url = $(this).attr("action");

        e.preventDefault();

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            async: false,
            success: function (data) {
                update_content();
            },
            cache: false,
            contentType: false,
            processData: false
        });

        return false;
    });

    $("#id-upload-form").submit(function (e) {

        $("#id_description_hidden").val(sjcl.encrypt(key, $("#id_description").val()));

        var formData = new FormData(this);
        var url = $(this).attr("action");

        e.preventDefault();

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            async: false,
            success: function (data) {
                update_content();
            },
            cache: false,
            contentType: false,
            processData: false
        });

        return false;
    });

    $("#id_decrypt").click(function () {

        $("input#id_key[type=file]").trigger("click");
    });

    $(".wrapper").on("click", ".download", function (e) {

        e.preventDefault();
        $.getJSON($(this).attr("href"), function (answer) {

            var sampleBytes = base64ToArrayBuffer(sjcl.decrypt(key, JSON.stringify(JSON.parse(answer.file_content))));
            saveByteArray([sampleBytes], sjcl.decrypt(key, answer.name));
        });
    });

    function download(text, name, type) {
        var a = document.createElement("a");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

});