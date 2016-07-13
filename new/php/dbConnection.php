<?php

    $config_file = "/var/www/html/mozillaq-master/new/php/mysql.login";
    $conn = null;

    function getDBLogin(){

        global $config_file;
        $nameServer = null;
        $username = null;
        $password = null;
        $nameDatabase = null;

        $configfile = fopen ($config_file,"r") or die ("[ERROR] Unable to open file: ".$config_file);

        while (!feof($configfile)) {
            $line_of_text = fgets($configfile);
            $parts = explode('=', $line_of_text);

            if($parts[0] == "servername"){
                $nameServer = trim($parts[1]);
            }
            elseif($parts[0] == "username"){
                 $username = trim($parts[1]);
            }
            elseif($parts[0] == "password"){
                 $password = trim($parts[1]);
            }elseif($parts[0] == "databasename"){
                 $nameDatabase = trim($parts[1]);
            }
        }
        create_connection($nameServer,$nameDatabase,$username,$password);
    }

    function create_connection($servername,$database,$user,$password){
        try {

            global $conn;
            $conn = new PDO("mysql:dbname=$database;host=$servername;", $user, $password);

            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            //UTF8 caracter set fix
            $sql = "SET NAMES utf8";
            $conn->query($sql);

        }
        catch(PDOException $e)
        {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    function close_connection(){
        global $conn;
        $conn = null;
    }

    /* Query statements */

    function getFilteredQuestions($selectedLanguage,$quizType){
        global $conn;

        $sql = "SELECT * FROM quizQuestions WHERE quizLanguage='".$selectedLanguage."' AND quizType=".$quizType.";";

        $returnResult = array();

        foreach ($conn->query($sql) as $row)
        {
            $element  = array('idQuestion' => $row['idQuestion'],'textQuestion' => $row['textQuestion']);
            array_push($returnResult,$element);
        }
        return $returnResult;
    }

    function getLanguageFilteredAnswers($selectedLanguage,$idQuestion){
        global $conn;

        $sql = "SELECT * FROM quizQuestionChoices WHERE quizLanguage='".$selectedLanguage."' AND idQuestion=".$idQuestion.";";

        $returnResult = array();

        foreach ($conn->query($sql) as $row)
        {
            $element  = array('idChoice' => $row['idChoice'],'textChoice' => $row['textChoice']);
            array_push($returnResult,$element);
        }
        return $returnResult;
    }

    function getIdFilteredRightAnswers($idQuestion){
        global $conn;

        $sql = "SELECT * FROM rightAnswers WHERE idQuestion=".$idQuestion.";";

        $returnResult = array();

        foreach ($conn->query($sql) as $row)
        {
            $element  = array('idChoice' => $row['idChoice'],'score' => $row['score']);
            array_push($returnResult,$element);
        }
        return $returnResult;
    }

    function storeaAnswers($storeArray){
        global $conn;

        $sql = "SELECT COUNT(1) as rownumbers FROM resultHolder;";

        foreach ($conn->query($sql) as $row)
        {
            $element  = $row['rownumbers'] +1;
        }

        $sql = "INSERT INTO `resultHolder` (`resultId`,`name`,`email`,`filldate`,`quizType`,`reachedScore`) ";
        $sql = $sql."VALUES (".$element.",'".$storeArray['name']."','".$storeArray['email']."','";
        $sql = $sql.$storeArray['filldate']."',".$storeArray['quizType'].",";
        $sql = $sql.$storeArray['reachedScore'].");";

        $conn->query($sql);

        foreach($storeArray['answers'] as $qElement){
            foreach($qElement['marked'] as $mElement){
                $sql = "INSERT INTO `resultRawData` (`resultId`,`idQuestion`,`idChoice`) ";
                $sql = $sql."VALUES (".$element.",'".$qElement['idQuestion']."',".$mElement['idChoice'].");";
                $conn->query($sql);
            }
        }
    }
?>
