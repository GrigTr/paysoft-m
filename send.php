<?php

if((isset($_POST['name']) && $_POST['name']!="") && (isset($_POST['email'])&&$_POST['email']!="") && (isset($_POST['subject'])&&$_POST['subject']!="") && (isset($_POST['message'])&&$_POST['message']!="")){ //Проверка отправилось ли наше поля name и не пустые ли они
        $descr = '';
        if(isset($_POST['descr'])){
            $descr = $_POST['descr'];
        }
        
        $to = 'truhanovg@yandex.ru';
        $subject = 'Письмо из формы обратной связи «Форсайт»'; //Загoловок сообщения
        $message = '
                <html>
                    <head>
                        <title>'.$subject.'</title>
                    </head>
                    <body>
                        <p>Описание: ' . $descr . '</p>
                        <p>Имя: ' .$_POST['name']. '</p>
                        <p>Почта: '.$_POST['email'].'</p> 
                        <p>Subject: '.$_POST['subject'].'</p>
                        <p>Сообщение: '.$_POST['message'].'</p>
                    </body>
                </html>'; //Текст нащего сообщения можно использовать HTML теги
        $headers  = 'Content-type: text/html; charset="utf-8" \r\n'; //Кодировка письма
        $headers .= "From: Отправитель <fabulade@vh170.timeweb.ru>\r\n"; //Наименование и почта отправителя
        mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail
}
?>