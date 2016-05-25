$('#verborgen_file').hide();
$('#back').on('click', function () {
    $('#verborgen_file').click();
});

$('#verborgen_file').change(function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        $('body').css('background-image', 'url("' + reader.result + '")');
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
    }
});
window.onload = function(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/saveChanges',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 201) success();
            else fail();
        }
    }
    function success(){
        goodSave();
    };
    function fail(){
        badSave();
    }
    xhr.send(document.outerHTML);
}