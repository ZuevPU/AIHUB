export interface PromptBuilderOption {
  id: string;
  text: string;
  isRecommended?: boolean;
  /** Подсказка: когда использовать, рекомендация */
  hint?: string;
  /** Под-опции (специфики) для множественного выбора при выборе родителя */
  specs?: string[];
}

export interface PromptBuilderCategory {
  id: string;
  title: string;
  icon: string;
  options: PromptBuilderOption[];
  /** Одиночный выбор (только 1 вариант) */
  singleSelect?: boolean;
}

export const promptBuilderCategories: PromptBuilderCategory[] = [
  {
    id: "subject",
    title: "Субъект (Главный объект)",
    icon: "🎭",
    options: [
      { id: "s1", text: "Молодая женщина в традиционном русском сарафане" },
      { id: "s2", text: "Пожилой мужчина с бородой в военной форме" },
      { id: "s3", text: "Ребёнок с книгой в руках" },
      { id: "s4", text: "Группа друзей на пикнике" },
      { id: "s5", text: "Животное в естественной среде" },
      { id: "s_best", text: "Портрет русской женщины 30-35 лет в народном костюме", isRecommended: true },
    ],
  },
  {
    id: "action",
    title: "Действие и Поза",
    icon: "🏃",
    options: [
      { id: "a1", text: "Стоит в полный рост, смотрит в камеру" },
      { id: "a2", text: "Идёт по дороге, вид сбоку" },
      { id: "a3", text: "Сидит за столом, пишет" },
      { id: "a4", text: "Танцует, динамичное движение" },
      { id: "a5", text: "Лежит на траве, отдыхает" },
      { id: "a_best", text: "Естественная поза, лёгкий поворот головы, мягкий взгляд", isRecommended: true },
    ],
  },
  {
    id: "location",
    title: "Локация",
    icon: "📍",
    options: [
      { id: "l1", text: "Городская улица, старинная архитектура" },
      { id: "l2", text: "Деревенский дом с резными наличниками" },
      { id: "l3", text: "Лесная поляна, берёзовая роща" },
      { id: "l4", text: "Морской пляж, галечный берег" },
      { id: "l5", text: "Горная вершина, панорамный вид" },
      { id: "l_best", text: "Солнечный пляж Сочи, кипарисы на заднем плане", isRecommended: true },
    ],
  },
  {
    id: "time",
    title: "Время и Погода",
    icon: "🌤️",
    options: [
      { id: "t1", text: "Солнечный летний день" },
      { id: "t2", text: "Золотой час, закат" },
      { id: "t3", text: "Облачно, мягкий рассеянный свет" },
      { id: "t4", text: "Дождливый осенний день" },
      { id: "t5", text: "Зимнее утро, иней на деревьях" },
      { id: "t_best", text: "Яркий солнечный день, безоблачное небо, тёплый свет", isRecommended: true },
    ],
  },
  {
    id: "style",
    title: "Стиль",
    icon: "🎨",
    options: [
      { id: "st1", text: "Советский плакат 1960-х годов" },
      { id: "st2", text: "Киберпанк, неоновое свечение" },
      { id: "st3", text: "Акварель, мягкие переходы" },
      { id: "st4", text: "Масляная живопись, импасто" },
      { id: "st5", text: "Минимализм, чистые линии" },
      { id: "st6", text: "Соцреализм в современной обработке" },
      { id: "st_best", text: "Советский туристический плакат с ретро-налётом", isRecommended: true },
    ],
  },
  {
    id: "artist",
    title: "Референс художника",
    icon: "🖼️",
    options: [
      { id: "ar1", text: "В стиле Дейнеки" },
      { id: "ar2", text: "В стиле Шишкина" },
      { id: "ar3", text: "В стиле Репина" },
      { id: "ar4", text: "В стиле Васнецова" },
      { id: "ar5", text: "В стиле Малевича" },
      { id: "ar6", text: "Без указания художника" },
    ],
  },
  {
    id: "camera",
    title: "Камера и Ракурс",
    icon: "📷",
    options: [
      { id: "c1", text: "Крупный план, портрет" },
      { id: "c2", text: "Средний план, по пояс" },
      { id: "c3", text: "Общий план, фигура в интерьере" },
      { id: "c4", text: "Вид сверху, bird's eye" },
      { id: "c5", text: "Низкий ракурс, снизу вверх" },
      { id: "c_best", text: "Средний план, чуть снизу, динамичная композиция", isRecommended: true },
    ],
  },
  {
    id: "lighting",
    title: "Освещение",
    icon: "💡",
    options: [
      { id: "li1", text: "Мягкий рассеянный свет" },
      { id: "li2", text: "Контровой свет, силуэт" },
      { id: "li3", text: "Студийное освещение, 3 точки" },
      { id: "li4", text: "Естественный дневной свет" },
      { id: "li5", text: "Тёплый золотой час" },
      { id: "li_best", text: "Мягкое естественное освещение, лёгкие тени", isRecommended: true },
    ],
  },
  {
    id: "colors",
    title: "Цветовая гамма",
    icon: "🌈",
    options: [
      { id: "co1", text: "Небесно-голубой, жёлтый, зелёный" },
      { id: "co2", text: "Изумрудный, белый, серый" },
      { id: "co3", text: "Тёплые землистые тона" },
      { id: "co4", text: "Пастельные пастельные оттенки" },
      { id: "co5", text: "Контрастные неоновые цвета" },
      { id: "co_best", text: "Доминирующие небесно-голубой, тёплый жёлтый, сочный зелёный", isRecommended: true },
    ],
  },
  {
    id: "quality",
    title: "Детали качества",
    icon: "✨",
    options: [
      { id: "q1", text: "Чистые линии, высокая детализация, 8k" },
      { id: "q2", text: "Мягкая штриховка, качество постера" },
      { id: "q3", text: "Плоские цветовые пятна, векторный стиль" },
      { id: "q4", text: "Фотореализм, ultra detailed" },
      { id: "q5", text: "Высокое разрешение, sharp focus" },
      { id: "q_best", text: "Чистые линии, плоские пятна с мягкой штриховкой, высокая детализация", isRecommended: true },
    ],
  },
  {
    id: "negative",
    title: "Исключить (Negative prompt)",
    icon: "🚫",
    options: [
      { id: "n1", text: "Размытость, низкое качество" },
      { id: "n2", text: "Искажённые лица, лишние пальцы" },
      { id: "n3", text: "Текст на изображении" },
      { id: "n4", text: "Водяные знаки, логотипы" },
      { id: "n5", text: "Переэкспонирование, шум" },
      { id: "n_best", text: "blurry, low quality, distorted, watermark", isRecommended: true },
    ],
  },
];
