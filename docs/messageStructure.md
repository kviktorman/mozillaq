###############
##> Request <##
###############

#> Quiz Question request

{
  "messageName": "getQuiz", 
  "language": "en", 
  "quiztype": 1
}


################
##> Response <##
################

#> Quiz Question response

{
  "messageName": "returnQuizQuestions", 
  "quizQuestions": [
    {
      "idQuestion": 1,
      "rightAnswers": [
        {"idChoice": 1, "score": 1}
      ],
      "selectChoices": [
        {"idChoice": 1, "textChoice": "choice 1 - right"},
        {"idChoice": 2, "textChoice": "choice 2"},
        {"idChoice": 3, "textChoice": "choice 3"},
        {"idChoice": 4, "textChoice": "choice 4"}],
      "textQuestion": "This is the first test Question"
    },
    {
      "idQuestion": 2,
      "rightAnswers": [
        {"idChoice": 3, "score": 1},
        {"idChoice": 4, "score": 12}
      ],
      "selectChoices": [
        {"idChoice": 1, "textChoice": "choice 1"},
        {"idChoice": 2, "textChoice": "choice 2"},
        {"idChoice": 3, "textChoice": "choice 3 - right"},
        {"idChoice": 4, "textChoice": "choice 4 - right"}],
      "textQuestion": "This is the second test Question"
    }
  ]
}

#############
##> Store <##
#############
If E-budge not selected than name and email is going to be the one which is in the message structure definied.

{
  "messageName": "storeQuiz", 
  "name": "Anonymous", 
  "email": "anonymous@anonymous.com", 
  "filldate": "2016-07-12 23:38:00", 
  "quizType": 1, 
  "reachedScore": 1,
  "answers": [
    {
      "idQuestion": "1", 
      "marked": [
        {
          "idChoice": "1"
        }
      ]
    }, 
    {
      "idQuestion": "2", 
      "marked": [
        {
          "idChoice": "3"
        }, 
        {
          "idChoice": "4"
        }
      ]
    }
  ]
}

