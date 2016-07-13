#issue 1
quizMain.js => function sendReslts()

done function not triggered after first trigger.

Somehow $post changes the "application/json" to "text/html; charset=UTF-8". It's weird, because the other post message are not doing it. 

    var posting = $.post(url, storeMessage, null, "json");
    posting.done(function (data) {
        alert(" Thank you ! ");
        pageChange("2");
    });
    posting.fail(function () {
        alert("Sorry. Server unavailable. ");
    });

Quick fix for this issue is to reload the whole page after upload.

app.js => function pageChange

   if (page == 2) {
           window.location.reload();
    }

This can be removed after issue fix

#issue 1
Caracter encoding at db store.
GÃ©za bÃ©la bÃ¡rmi => Géza béla bármi
