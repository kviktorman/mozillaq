function getHostStart() {

    var protocol = $(location).attr('protocol');
    var hostname = $(location).attr('hostname');
    var path = $(location).attr('pathname');
    path = path.split("/")
    path.splice(path.length - 1, 1);
    path = path.join("/");

    var fullPath = protocol + "//" + hostname + path;

    return fullPath;
}


function getQuestions() {

    var url = getHostStart();
    url += '/php/middleLayer.php';
    var requestMessage = '{"messageName":"getQuiz","quizType":' + $.urlParam("quiztype") + ',"language":"' + $.urlParam("language") + '"}';

    var posting = $.post(url, requestMessage, null, "json");
    posting.done(function (data) {
        collections.selectedQuiz = $.urlParam("quiztype");
        afterDateLoad(data);
    });
    posting.fail(function () {
        alert("Sorry. Server unavailable. ");
    });

}

function afterDateLoad(jSONMessageArray) {
    populateQuestions(jSONMessageArray).done(function () {
        visualizeQuestions();
    });
}

function populateQuestions(inArray) {
    var notifier = $.Deferred();
    var questionElement;

    inArray.quizQuestions.forEach(function (entry, i) {
        questionElement = {};
        questionElement = entry;

        questionElement.multiSelect = 0;

        if (entry.rightAnswers.length > 1) {
            questionElement.multiSelect = 1;
        }

        entry.rightAnswers.forEach(function (rightA) {
            rightA.score = parseInt(rightA.score);
        });

        collections.quizQuestions.push(questionElement);

        entry.rightAnswers.forEach(function (rightA) {
            collections.maxScore += rightA.score;
        });

        if (inArray.quizQuestions.length - 1 == i) {
            notifier.resolve();
        }
    });

    //return $.when(dfrd1, dfrd2)
    return $.when(notifier).done(function () {
        // Both asyncs tasks are done
    }).promise();
}

function visualizeQuestions() {

    angular.element($('#quizMainList')).scope().updateQuizList();
    $('[data-role="controlgroup"]').trigger("create");
    $('[data-role="controlgroup"]').controlgroup().controlgroup("refresh");

}

function populateQuizEvaluated() {
    var notifier = $.Deferred();

    collections.quizEvaluated = [];

    var resultElement;
    var storeElement;
    collections.quizQuestions.forEach(function (entry, i) {
        resultElementEntry = {
            textQuestion: entry.textQuestion,
            idQuestion: entry.idQuestion,
            resultElement: []
        };
        collections.quizEvaluated.push(resultElementEntry);

        storeElement = {
            idQuestion: entry.idQuestion,
            marked: []
        };
        collections.sendResults.push(storeElement);
    });

    var selected;
    var idChecked;

    $('[data-role="controlgroup"] :checked').each(function () {
        idChecked = $(this).val();
        idChecked = idChecked.split("-");

        collections.quizEvaluated.forEach(function (entry, i) {

            if (entry.idQuestion == idChecked[0]) {
                selected = {
                    idResultAnswer: idChecked[1],
                    selectionType: 0
                };
                entry.resultElement.push(selected);
            }
        });

        collections.sendResults.forEach(function (entry, i) {
            if (entry.idQuestion == idChecked[0]) {
                storeElement = {
                    idChoice: idChecked[1]
                };
                entry.marked.push(storeElement);
            }
        });
    });


    var mixedAnswers;
    var exists;
    collections.quizEvaluated.forEach(function (evaluatedQuiz, i) {
        denyDupplicateAdding = 0;
        mixedAnswers = [];
        collections.quizQuestions.forEach(function (mainQuiz) {

            if (evaluatedQuiz.idQuestion == mainQuiz.idQuestion) {
                mainQuiz.rightAnswers.forEach(function (rightA) {
                    selected = {
                        idResultAnswer: rightA.idChoice,
                        selectionType: 1
                    };
                    mixedAnswers.push(selected);
                });
                evaluatedQuiz.resultElement.forEach(function (markedA) {
                    exists = 0;
                    mainQuiz.rightAnswers.forEach(function (rightA) {
                        if (markedA.idResultAnswer == rightA.idChoice) {
                            exists = 1;
                            collections.reachedScore += rightA.score;
                        }
                    });
                    if (exists < 1) {
                        selected = {
                            idResultAnswer: markedA.idResultAnswer,
                            selectionType: 0
                        };
                        mixedAnswers.push(selected);
                    }
                });
                mixedAnswers.forEach(function (entry) {
                    mainQuiz.selectChoices.forEach(function (entryTextOwner) {
                        if (entry.idResultAnswer == entryTextOwner.idChoice) {
                            entry.textResultAnswer = entryTextOwner.textChoice;
                        }
                    });
                });
            }
        });

        evaluatedQuiz.resultElement = mixedAnswers;

        if (i == collections.quizEvaluated.length - 1) {
            notifier.resolve();
        }
    });

    //return $.when(dfrd1, dfrd2)
    return $.when(notifier).done(function () {
        // Both asyncs tasks are done
    }).promise();
}

function sendReslts() {

    var url = getHostStart();
    url += '/php/middleLayer.php';

    var storeMessage = "";

    storeMessage += '{';
    storeMessage += '"messageName": "storeQuiz", ';
    storeMessage += '"quizType": ' + collections.selectedQuiz + ', ';
    name = $('#nameFull').val();
    if (name.trim() == "") {
        name = "Anonymous";
    }
    storeMessage += '"name": "' + name + '", ';
    mail = $('#email').val();
    if (mail.trim() == "") {
        mail = "anonymous@anonymous.com";
    }
    storeMessage += '"email": "' + mail + '", ';
    storeMessage += '"filldate": "' + moment().local().format("YYYY-MM-DD HH:mm:ss") + '", ';
    storeMessage += '"reachedScore": ' + collections.reachedScore + ',';
    storeMessage += '"answers":'

    cleanEmptyAnswers();

    var storeArray = JSON.stringify(collections.sendResults);
    storeMessage += storeArray;
    storeMessage += '}';

    if (storeArray == "[]") {
        alert('No quiz answers !');
        pageChange("2");
    }

    var posting = $.post(url, storeMessage, null, "json");
    posting.done(function (data) {
        alert(" Thank you ! ");
        pageChange("2");
    });
    posting.fail(function () {
        alert("Sorry. Server unavailable. ");
    });
}

function cleanEmptyAnswers() {
    var tempArray = [];
    collections.sendResults.forEach(function (entry) {
        if (entry.marked.length > 0) {
            tempArray.push(entry);
        }
    });
    collections.sendResults = tempArray;
}


$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};
