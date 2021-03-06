var collections = {
    quizQuestions: [],
    quizEvaluated: [],
    sendResults: [],
    reachedScore: 0,
    maxScore: 0,
    selectedQuiz: 0,

}

$(window).on("navigate", function (event, data) {
    var direction = data.state.direction;
    if (direction == 'back') {
        location.reload();
    }
    if (direction == 'forward') {}
});


$(document).on("pagechange", function (event) {

    var loadedPage = $.mobile.pageContainer.pagecontainer("getActivePage");

    if ((loadedPage.attr('id') == "quizPage") && ($.urlParam("language") != null) && ($.urlParam("quiztype") != null)) {
        getQuestions();
    }
});

$(document).ready(function () {

});

var app = angular.module('QuizApp', []);

app.controller('quizAppController', ['$scope', function ($scope) {
    $scope.quizList = collections.quizQuestions;
    $scope.quizLoaded = 0;
    $scope.selectedQuizType = "";
    $scope.resultQuizArray = collections.quizEvaluated;
    $scope.reachedScore = collections.reachedScore;
    $scope.maxScore = collections.maxScore;
    $scope.eBadgeRequest = 0;
    $scope.precentageScore = 0;

    $scope.updateQuizList = function () {
        $scope.quizList = collections.quizQuestions;
        if ($scope.quizList.length > 0) {
            $scope.quizLoaded = 1;
            $scope.selectedQuizType = $("#menu-" + $.urlParam("quiztype")).html();

        } else {
            $scope.quizLoaded = 0;
            $scope.selectedQuizType = "";
        }
        $scope.$apply();
    };

    $scope.evaluateResults = function () {
        populateQuizEvaluated().done(function () {
            $scope.resultQuizArray = collections.quizEvaluated;
            $scope.reachedScore = collections.reachedScore;
            $scope.maxScore = collections.maxScore;
            var precentage = $scope.reachedScore / $scope.maxScore;
            $scope.precentageScore = precentage.toFixed(4) * 100;
            $('#nameFull').val("");
            $('#email').val("");
            $('#eBadge').trigger('create').checkboxradio();
            if ($scope.eBadgeRequest != 0) {
                $scope.eBadgeRequest = 0;
                $('#eBadge').prop('checked', false);
                $('#eBadge').checkboxradio('refresh');
            }

            pageChange("3");

        });
    }

    $scope.sendInfo = function () {
        sendReslts();
    }
}]);

function pageChange(page) {
    var location = "#"
    if (page == 1) {
        //language selected only
        location += "quizPage?language=" + $('#select-language').val();
        angular.element($('#quizMainList')).scope().updateQuizList();
    } else if (page == 2) {
        location += "selectLanguage";
        collections.quizQuestions = [];
    } else if (page == 3) {
        location += "resultPage";
    } else {
        var parts = page.split('-');
        location += "quizPage?quiztype=" + parts[1] + "&language=" + $.urlParam("language");
        collections.quizQuestions = [];
        angular.element($('#quizMainList')).scope().updateQuizList();
        $("#quizMenuPanel").panel("close");
    }

    window.location.href = location;
}
