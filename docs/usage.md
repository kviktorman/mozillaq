Currently supported language selection for quizlanguages 'en','de','hu'.
At front-end side this can be expand here. In database this is matching with the quizLanguage field.

index.html

    <select name="select-language" id="select-language" data-iconpos="right">
        <option value="en">English</option>
        <option value="hu">Magyar</option>
        <option value="de">Deutsch</option>
    </select>

Extra quiz types can be added to here. The Quiz type is the 2nd number like 1-2 => quizType "2" This is matching with the quizType field in the database

index.html

    <ul data-role="listview" data-inset="true">
        <li><a onclick='pageChange("1-1");' id='menu-1'>Quiz 1</a></li>
        <li><a onclick='pageChange("1-2");' id='menu-2'>Quiz 2</a></li>
        <li><a onclick='pageChange("1-3");' id='menu-3'>Quiz 3</a></li>
        <li><a onclick='pageChange("2");'>Language</a></li>
    </ul>

