export type ComplexityLevel = 'simple' | 'medium' | 'complex';

export interface ArtifactType {
  id: string;
  name: string;
  complexity: ComplexityLevel[];
  promptTemplate: string;
}

export interface ArtifactCategory {
  id: string;
  name: string;
  icon: string;
  types: ArtifactType[];
}

export interface ArtifactStyle {
  id: string;
  name: string;
  value: string;
}

export const artifactsConfig = {
  version: '1.0',
  categories: [
    {
      id: 'education',
      name: 'Образование',
      icon: '🎓',
      types: [
        { id: 'quiz', name: 'Викторина / Тест', complexity: ['simple', 'medium', 'complex'], promptTemplate: 'Создай интерактивный тест по теме "{topic}" с {questionsCount} вопросами. Формат: {quizFormat}. Включи: мгновенную проверку ответов, подсчёт баллов, интерпретацию результатов. Стиль: {style}.' },
        { id: 'matching', name: 'Сопоставление (Matching)', complexity: ['simple', 'medium'], promptTemplate: 'Создай упражнение на сопоставление по теме "{topic}". Два списка для связи: {list1} и {list2}. Механика: перетаскивание или соединение линиями. Добавь проверку и подсчёт правильных пар. Стиль: {style}.' },
        { id: 'timeline', name: 'Хронологическая линейка', complexity: ['simple', 'medium', 'complex'], promptTemplate: 'Создай интерактивную временную шкалу по теме "{topic}". События: {events}. Механика: drag-and-drop для расстановки в правильном порядке. Добавь описание каждого события при клике. Стиль: {style}.' },
        { id: 'flashcards', name: 'Флеш-карточки', complexity: ['simple'], promptTemplate: 'Создай набор флеш-карточек по теме "{topic}". Количество: {cardsCount}. Механика: клик для переворота (вопрос/ответ). Добавь прогресс изучения и режим повторения. Стиль: {style}.' },
        { id: 'crossword', name: 'Кроссворд', complexity: ['medium', 'complex'], promptTemplate: 'Создай интерактивный кроссворд по теме "{topic}". Сетка: {gridSize} клеток. Вопросы: {questionsCount} штук. Добавь проверку ответов, подсветку правильных/неправильных. Стиль: {style}.' },
        { id: 'worksheet', name: 'Интерактивный рабочий лист', complexity: ['medium', 'complex'], promptTemplate: 'Создай интерактивный рабочий лист по теме "{topic}". Включи задания разных типов: выбор ответа, сопоставление, ввод текста, заполнение пропусков. Добавь автоматическую проверку и итоговый счёт. Стиль: {style}.' },
        { id: 'case_study', name: 'Кейс-стади', complexity: ['medium', 'complex'], promptTemplate: 'Создай интерактивный кейс по теме "{topic}". Структура: описание ситуации → вопросы → варианты решений → разбор каждого варианта с объяснением. Добавь навигацию по шагам. Стиль: {style}.' },
        { id: 'calculator', name: 'Образовательный калькулятор', complexity: ['simple', 'medium'], promptTemplate: 'Создай калькулятор для темы "{topic}". Формулы: {formulas}. Поля для ввода: {inputs}. Вывод: результат + пошаговое объяснение расчёта. Стиль: {style}.' },
        { id: 'masterclass', name: 'Мастер-класс / Вебинар', complexity: ['complex'], promptTemplate: 'Создай страницу мастер-класса "{topic}". Секции: hero (название, дата), программа (тайминг, аккордеон), спикеры (карточки), материалы (скачивание), форма регистрации, FAQ, таймер до начала. Стиль: {style}.' },
        { id: 'longread', name: 'Лонгрид с объяснением', complexity: ['complex'], promptTemplate: 'Создай лонгрид по теме "{topic}". Структура: оглавление (якорные ссылки), разделы с раскрытыми блоками, иллюстрации, цитаты, выводы. Прогресс чтения, время на чтение. Стиль: {style}.' },
        { id: 'interactive_textbook', name: 'Интерактивный учебник', complexity: ['complex'], promptTemplate: 'Создай интерактивный учебник по "{topic}". Главы: {chaptersCount}. Навигация: содержание, тесты после раздела, прогресс изучения, закладки, поиск по тексту. Стиль: {style}.' },
        { id: 'knowledge_base', name: 'База знаний', complexity: ['complex'], promptTemplate: 'Создай базу знаний для "{topic}". Категории: {categories}. Поиск по статьям, алфавитный указатель, связанные материалы, версия документа, дата обновления. Стиль: {style}.' },
        { id: 'checklist', name: 'Чек-лист процесса', complexity: ['simple', 'medium'], promptTemplate: 'Создай чек-лист для "{topic}". Шаги: {stepsCount}. Отметки выполнения, прогресс-бар, возможность экспорта, сохранение состояния. Стиль: {style}.' },
        { id: 'glossary', name: 'Глоссарий терминов', complexity: ['medium'], promptTemplate: 'Создай глоссарий для "{topic}". Термины: {termsCount}. Поиск, алфавитная навигация, карточки с определениями и примерами, избранное. Стиль: {style}.' },
        { id: 'workbook', name: 'Рабочая тетрадь', complexity: ['complex'], promptTemplate: 'Создай рабочую тетрадь по "{topic}". Структура: теория + практические задания + место для заметок. Разные типы заданий, проверка, итоговый счёт. Стиль: {style}.' },
      ],
    },
    {
      id: 'games',
      name: 'Игры',
      icon: '🎮',
      types: [
        { id: 'millionaire', name: 'Кто хочет стать миллионером?', complexity: ['complex'], promptTemplate: 'Создай игру «Кто хочет стать миллионером?» по теме "{topic}". 15 вопросов с нарастающей сложностью. 4 варианта ответа. 3 подсказки (50:50, звонок другу, помощь зала). Система денег, сохранение прогресса. Стиль: {style}.' },
        { id: 'jeopardy', name: 'Своя Игра (Jeopardy)', complexity: ['complex'], promptTemplate: 'Создай игру «Своя Игра» по теме "{topic}". Категории: {categories}. Стоимость вопросов: 100-500. Таблица с выбором, модальные окна для вопросов, подсчёт очков. Стиль: {style}.' },
        { id: 'memory', name: 'Найди пару (Memory)', complexity: ['simple', 'medium'], promptTemplate: 'Создай игру «Найди пару» по теме "{topic}". Карточек: {cardsCount}. Механика: переворот, поиск совпадений, подсчёт ходов, таймер. Добавь разные уровни сложности. Стиль: {style}.' },
        { id: 'clicker', name: 'Кликер (Idle Game)', complexity: ['medium', 'complex'], promptTemplate: 'Создай игру-кликер по теме "{topic}". Основная валюта: {currency}. Улучшения: {upgrades}. Механика: клик → ресурс → покупка улучшений → авто-доход. Добавь достижения и сохранения. Стиль: {style}.' },
        { id: 'hangman', name: 'Виселица', complexity: ['simple'], promptTemplate: 'Создай игру «Виселица» по теме "{topic}". Список слов: {wordsCount} штук. Отрисовка виселицы по шагам, ввод букв, подсчёт побед/поражений. Стиль: {style}.' },
        { id: 'snake', name: 'Змейка', complexity: ['medium'], promptTemplate: 'Создай классическую игру «Змейка» с тематикой "{topic}". Управление стрелками, счёт, рекорд, ускорение со временем. Добавь бонусы и препятствия. Стиль: {style}.' },
        { id: 'puzzle', name: 'Пазл / Сборка', complexity: ['medium'], promptTemplate: 'Создай игру-пазл по теме "{topic}". Количество элементов: {piecesCount}. Механика: перетаскивание, сборка изображения/текста. Добавь таймер и подсказки. Стиль: {style}.' },
        { id: 'battle', name: 'Битва знаний (2 игрока)', complexity: ['complex'], promptTemplate: 'Создай игру на двоих по теме "{topic}". По очереди отвечают на вопросы, правильные ответы = очки атаки. Здоровье, раунды, определение победителя. Стиль: {style}.' },
      ],
    },
    {
      id: 'data',
      name: 'Данные и Визуализация',
      icon: '📊',
      types: [
        { id: 'dashboard', name: 'Интерактивный Дашборд', complexity: ['complex'], promptTemplate: 'Создай интерактивный дашборд для "{topic}". Метрики: {metrics}. Визуализация: карточки с цифрами, графики (CSS/SVG), фильтры по периодам. Добавь экспорт данных. Стиль: {style}.' },
        { id: 'charts', name: 'Диаграммы и Графики', complexity: ['medium'], promptTemplate: 'Создай набор диаграмм для "{topic}". Типы: круговая, столбчатая, линейная. Данные: {data}. Интерактивность: tooltips при наведении, легенда, фильтрация. Стиль: {style}.' },
        { id: 'kanban', name: 'Канбан-доска', complexity: ['medium', 'complex'], promptTemplate: 'Создай канбан-доску для "{topic}". Колонки: {columns}. Карточки задач с перетаскиванием (drag-and-drop), редактирование, удаление, сохранение в localStorage. Стиль: {style}.' },
        { id: 'mindmap', name: 'Майнд-карта', complexity: ['medium', 'complex'], promptTemplate: 'Создай интерактивную майнд-карту для "{topic}". Центральная идея: {centralIdea}. Ветви: раскрывающиеся узлы, добавление/удаление, экспорт структуры. Стиль: {style}.' },
        { id: 'calendar', name: 'Календарь-планировщик', complexity: ['medium'], promptTemplate: 'Создай календарь-планировщик для "{topic}". Вид: месяц/неделя. Добавление событий по клику, категории цветом, напоминания, сохранение данных. Стиль: {style}.' },
        { id: 'converter', name: 'Конвертер величин', complexity: ['simple'], promptTemplate: 'Создай конвертер для "{topic}". Единицы: {units}. Механика: выбор из/в, ввод значения, мгновенный пересчёт. Добавь историю конверсий. Стиль: {style}.' },
      ],
    },
    {
      id: 'business',
      name: 'Бизнес и Презентации',
      icon: '💼',
      types: [
        { id: 'meeting_summary', name: 'Страница по итогам совещания', complexity: ['medium'], promptTemplate: 'Создай страницу по итогам совещания для "{topic}". Разделы: участники, обсуждённые вопросы, принятые решения, задачи (исполнитель + дедлайн), следующая встреча. Возможность отметить задачу выполненной. Стиль: {style}.' },
        { id: 'project_presentation', name: 'Презентация проекта', complexity: ['complex'], promptTemplate: 'Создай презентацию проекта "{topic}". Слайды: {slidesCount}. Навигация: вперёд/назад, прогресс-бар, переходы между секциями. Контент: проблема, решение, метрики, команда, план. Стиль: {style}.' },
        { id: 'product_landing', name: 'Лендинг продукта', complexity: ['complex'], promptTemplate: 'Создай лендинг продукта "{topic}". Секции: hero, преимущества, как работает, тарифы, отзывы, FAQ, форма заявки. Плавная прокрутка, якорные ссылки, валидация формы. Стиль: {style}.' },
        { id: 'business_card', name: 'Страница-визитка', complexity: ['simple'], promptTemplate: 'Создай страницу-визитку для "{topic}". Контент: фото, имя, должность, контакты, соцсети (иконки), QR-коды, краткое био. Адаптивность под мобильные. Стиль: {style}.' },
        { id: 'roadmap', name: 'Дорожная карта (Roadmap)', complexity: ['medium'], promptTemplate: 'Создай дорожную карту для "{topic}". Этапы: {stages}. Визуализация: временная шкала, статусы (запланировано/в работе/готово), вехи, описание каждого этапа. Стиль: {style}.' },
        { id: 'report', name: 'Отчёт о проделанной работе', complexity: ['medium'], promptTemplate: 'Создай отчёт для "{topic}". Разделы: метрики, графики, достижения, проблемы, планы. Период: {period}. Добавь экспорт в PDF. Стиль: {style}.' },
      ],
    },
    {
      id: 'documents',
      name: 'Документы и Отчёты',
      icon: '📄',
      types: [
        { id: 'technical_spec', name: 'Техническое задание (ТЗ)', complexity: ['complex'], promptTemplate: 'Создай интерактивный шаблон ТЗ для "{topic}". Разделы: цели, требования (функциональные/нефункциональные), сроки и этапы, бюджет, риски, команда. Поля для заполнения, чек-боксы, экспорт в текст. Стиль: {style}.' },
        { id: 'commercial_offer', name: 'Коммерческое предложение', complexity: ['medium'], promptTemplate: 'Создай коммерческое предложение для "{topic}". Структура: проблема клиента → решение → выгоды → цена → CTA. Персонализация, калькулятор стоимости, форма заявки. Стиль: {style}.' },
        { id: 'policy', name: 'Политика / Регламент', complexity: ['medium'], promptTemplate: 'Создай страницу политики/регламента для "{topic}". Навигация по разделам, поиск, версия документа, дата обновления, история изменений. Стиль: {style}.' },
        { id: 'manual', name: 'Инструкция / Мануал', complexity: ['medium'], promptTemplate: 'Создай инструкцию для "{topic}". Пошаговые шаги, скриншоты/иллюстрации, предупреждения, FAQ, поиск по шагам. Стиль: {style}.' },
        { id: 'survey', name: 'Анкета / Опросник', complexity: ['medium'], promptTemplate: 'Создай анкету для "{topic}". Типы вопросов: выбор, ввод текста, шкала, множественный выбор. Валидация, прогресс-бар, экспорт результатов. Стиль: {style}.' },
      ],
    },
    {
      id: 'marketing',
      name: 'Маркетинг и Продвижение',
      icon: '🎯',
      types: [
        { id: 'quiz_landing', name: 'Квиз-лендинг', complexity: ['complex'], promptTemplate: 'Создай квиз-лендинг для "{topic}". Вопросы: {questionsCount}. Прогресс-бар, варианты ответов, финальный экран с формой контактов, страница благодарности. Сохранение ответов, отправка данных. Стиль: {style}.' },
        { id: 'event_landing', name: 'Страница о мероприятии', complexity: ['complex'], promptTemplate: 'Создай страницу о мероприятии "{topic}". Секции: дата/место, программа, спикеры, регистрация, таймер до начала, карта, контакты. Валидация формы, подтверждение регистрации. Стиль: {style}.' },
        { id: 'lead_magnet', name: 'Генератор лид-магнита', complexity: ['medium'], promptTemplate: 'Создай генератор лид-магнита для "{topic}". Ввод данных пользователем, персонализированный вывод (чек-лист/PDF), форма email для получения, скачивание. Стиль: {style}.' },
        { id: 'email_template', name: 'Email-шаблон', complexity: ['simple'], promptTemplate: 'Создай визуализацию email-шаблона для "{topic}". Предпросмотр письма, структура (header, body, footer), текст для копирования, адаптивность. Стиль: {style}.' },
        { id: 'content_calendar', name: 'Контент-план', complexity: ['medium'], promptTemplate: 'Создай контент-план для "{topic}". Календарь, темы публикаций, форматы, статусы, дедлайны, ответственные. Фильтрация, экспорт. Стиль: {style}.' },
      ],
    },
    {
      id: 'creative',
      name: 'Креатив и Визуал',
      icon: '🎨',
      types: [
        { id: 'pattern_generator', name: 'Генератор паттернов', complexity: ['medium'], promptTemplate: 'Создай генератор паттернов для "{topic}". Настройки: форма, цвет, размер, плотность. Предпросмотр, скачивание как PNG, бесшовность. Стиль: {style}.' },
        { id: 'particles', name: 'Частицы (Particles)', complexity: ['medium'], promptTemplate: 'Создай анимацию частиц для "{topic}". Реакция на мышь: след, взрыв, связь. Настройки: количество, цвет, скорость, размер. Стиль: {style}.' },
        { id: 'css_art', name: 'CSS-Арт', complexity: ['complex'], promptTemplate: 'Создай CSS-арт на тему "{topic}". Изображение: {description}. Только CSS (без изображений), адаптивность, анимация элементов. Стиль: {style}.' },
        { id: '3d_scene', name: '3D-сцена (CSS 3D)', complexity: ['complex'], promptTemplate: 'Создай 3D-сцену на тему "{topic}". Объекты: вращающиеся кубы/карточки, управление мышью, освещение, тени. Только CSS. Стиль: {style}.' },
      ],
    },
  ] as ArtifactCategory[],

  defaults: {
    complexity: {
      simple: { sections: 1, features: 'базовые' },
      medium: { sections: '3-5', features: 'расширенные' },
      complex: { sections: '10+', features: 'полный функционал' },
    },
    styles: [
      { id: 'light', name: 'Светлая тема', value: 'светлая тема, акцентный цвет синий' },
      { id: 'dark', name: 'Тёмная тема', value: 'тёмная тема, акцентный цвет оранжевый' },
      { id: 'corporate', name: 'Корпоративный', value: 'корпоративный стиль, светлая тема, акцентный цвет серый' },
      { id: 'creative', name: 'Креативный', value: 'креативный дизайн, яркие цвета, анимации' },
      { id: 'minimal', name: 'Минимализм', value: 'минимализм, светлая тема, акцентный цвет чёрный' },
    ] as ArtifactStyle[],
  },
};
