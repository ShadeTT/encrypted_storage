$(document).ready(function () {

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

});