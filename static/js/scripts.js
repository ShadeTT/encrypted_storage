$(document).ready(function () {

    document.querySelector('input[type="file"]').addEventListener('change', function (e) {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var result = this.result;

            // console.log(result);

            $('#id_file_content').val(sjcl.encrypt('pppppppppp', result));
            download(sjcl.decrypt('pppppppppp', $('#id_file_content').val()), '111.png', 'image/png');
            $('#id_file_content').val(sjcl.encrypt('pppppppppp', result))
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

    $('.download').click(function(e){
        e.preventDefault();

        $.getJSON($(this).attr('href'), function (answer) {

            console.log(typeof answer.file_content);
            console.log(JSON.parse(answer.file_content));

            download(sjcl.decrypt('pppppppppp', JSON.stringify(JSON.parse(answer.file_content))), sjcl.decrypt('pppppppppp', answer.name), 'text/plain');

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