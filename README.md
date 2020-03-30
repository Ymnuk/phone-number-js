# Подготовка списка телефонов для рассылки

Простой скрипт для подготовки списка телефонов для обзвона (рассылки СМС). Необходимо скормить скрипту файл со списком телефонов. Формат файла (csv):

    Телефон;Фамилия;Имя;Отчество

Разделитель обязательно дорлжен быть точка с запятой (;)

Если в поле с номером телефона будет встречена точка, то она будет преобразована в запятую. Далее поле будет разделено по запятым и обработано каждое значение. Если система посчитает из нескольких номеров какой-то мобильный номер, то он будет выведен в выходной файл (все остальные будут отброшены). Если будет только один единственный номер не мобильный, то он будет выведен в файл. В выходной файл добавится еще два столбца, которые будут содержать столбец "Комментарий" и признак мобильного номера или нет.

# Использование

    npm start -- --input <Входной файл> -- <Выходной файл>

либо

    node index.js --input <Входной файл> --output <Выходной файл>