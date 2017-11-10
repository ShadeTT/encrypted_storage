$(document).ready(function () {

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


    document.querySelector('input[type="file"]').addEventListener('change', function (e) {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var result = this.result;

            $('#id_file_content').val(sjcl.encrypt('pppppppppp', result));

            $('#id_name').val(sjcl.encrypt('pppppppppp', file.name));
        };
        reader.readAsBinaryString(file);

    }, false);


    $("#id-upload-form").submit(function (e) {

        $('#id_description_hidden').val(sjcl.encrypt('pppppppppp', $('#id_description').val()));

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

    $('#id_decrypt').click(function () {
        $(".encrypted").each(function (i) {
            $(this).text(sjcl.decrypt('pppppppppp', JSON.stringify($(this).data("content"))));
        });
    });

    $('.download').click(function (e) {
        e.preventDefault();

        $.getJSON($(this).attr('href'), function (answer) {

            var sampleBytes = base64ToArrayBuffer(sjcl.decrypt('pppppppppp', JSON.stringify(JSON.parse(answer.file_content))));
            saveByteArray([sampleBytes], sjcl.decrypt('pppppppppp', answer.name));

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