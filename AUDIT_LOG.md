# Журнал аудиту ЛР №12

## A. Знайдені проблеми (до виправлень)

| ID | Категорія | Пріоритет | Файл:рядок | Що не так | Що потрібно виправити | Очікуваний вплив |
|---|---|---:|---|---|---|---|
| P-01 | Performance | високий | index.html:18 | Tailwind Play CDN запускає CSS-компілятор у браузері | Зібрати Tailwind у мінімізований локальний CSS | Менше render-blocking та власного JS у браузері |
| P-02 | Performance | високий | index.html:245 | YouTube iframe завантажується одразу | Зробити фасад із завантаженням iframe після кліку | Менше мережевого payload і сторонніх cookie |
| P-03 | Performance | середній | index.html:302 | Google Maps iframe завантажується одразу | Замінити на фасад або посилання на карту | Менше сторонніх запитів |
| P-04 | Performance | середній | assets/video/hero-video.mp4 | Відео може завантажуватися одразу або не має єдиного lazy/preload-полісу | Задати preload="none"/metadata і відкладати позаекранну ініціалізацію | Нижче завантаження мережевого payload |
| P-05 | Performance | середній | index.html:15-17,589-592 | CSS і JS бібліотек завантажуються як звичайні CDN-ресурси | Мінімізувати синхронне завантаження без втрати функціоналу | Нижче render-blocking і payload |
| P-06 | Performance | низький | css/style.css | Можливі анімації й відкладені ініціалізації потребують перевірки | Перевірити анімації та важку синхронну роботу | Менше довгих задач і композиційних проблем |
| A-01 | Accessibility | середній | index.html | Доступність потребує перевірки програмими Lighthouse та ручних звірок | Перевірити h1, labels, фокус, alt і touch targets | Вищий бал і зручність для клавіатури |
| A-02 | Accessibility | низький | index.html | Деякі елементи навігації/кнопок можуть бути меншими за 48 px у мобільному | Перевірити мінімальні розміри дотичних елементів | Повна відповідність touch targets |
| S-01 | SEO | середній | index.html:3-10 | OG зображення задано відносним URL, немає canonical, Twitter Card і favicon-посилання | Додати абсолютні OG/Twitter/canonical і favicon | Правильні прев'ю та індексація |
| S-02 | SEO | низький | корінь проєкту | Відсутні robots.txt і sitemap.xml | Додати текстові SEO-файли | Чіткі правила індексації |
| B-01 | Best Practices | високий | index.html:245 | YouTube iframe може створювати сторонні cookies | Використати youtube-nocookie або фасад із iframe після кліку | Прибирання third-party cookies |
| B-02 | Best Practices | високий | index.html:302 | Google Maps iframe створює сторонні запити/cookies | Замінити фасадом або прямим посиланням | Прибирання сторонніх cookie-запитів |
| B-03 | Best Practices | високий | index.html:52 | time.is і зовнішній скрипт можуть логувати помилки та створювати сторонній ticker | Перевірити нативну заміну і прибрати у разі проблеми | Без помилок консолі та третіх сторін |
| B-04 | Best Practices | середній | index.html | Немає заголовків безпеки Vercel | Додати vercel.json із дозволеними заголовками | Кращий Best Practices і захист |
| B-05 | Best Practices | середній | index.html | Зовнішні посилання з target="_blank" потребують перевірки | Додати rel="noopener noreferrer" | Захист від reverse tabnabbing |
| J-01 | JavaScript | середній | js/main.js,js/plugins.js,js/validation.js,js/widget.js | Наявність помилок залежить від консолі і CDN | Виконати node --check та перевірку ініціалізації | Робочий клієнтський JS |
| R-01 | Responsive | середній | index.html,css/style.css | Потрібна перевірка 320 px без горизонтального скролу | Зробити перевірку overflow і touch targets | Коректний Mobile UI |
| X-01 | Security | середній | корінь проєкту | Немає версійних заголовків безпеки | Створити vercel.json | Захист від MIME sniffing і framing |

## Початковий інвентар сторонніх ресурсів

- Google Fonts: fonts.googleapis.com і fonts.gstatic.com.
- Tailwind Play CDN: cdn.tailwindcss.com.
- Swiper: cdn.jsdelivr.net/npm/swiper@11.
- Fancybox: cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.
- Typed.js: cdn.jsdelivr.net/npm/typed.js@2.0.12.
- AOS: unpkg.com/aos@next.
- YouTube iframe: youtube.com/embed/Nn0jwpIEDgM.
- Google Maps iframe: google.com/maps embed.
- Динамічний інформер часу: www.time.is/t.js.

## C. Lighthouse до/після

До змін Lighthouse ще не запускався у поточній сесії. Режим для нового вимірювання — Mobile. Початкові Desktop-показники користувача збережені як не порівнювані за методом.

Lighthouse до змін не виміряно: одна спроба `npx lighthouse` завершилася помилкою через відсутність Node.js/npm/npx у поточному середовищі. Повторний запуск не робився згідно з критичним правилом.

Початкові бали Desktop, передані користувачем, приведені тут лише як контекст: Performance 98, Accessibility 97, Best Practices 73, SEO 100; Mobile Lighthouse у поточному середовищі не проводився.

## B. Виправлення

| ID | Етап / коміт | Що виправлено | Як перевірено | Статус |
|---|---|---|---|---|
| B-01/P-02 | Етап 2 | YouTube завантажується лише після кліку через фасад | Статична перевірка iframe та data-facade | частково |
| B-02/P-03 | Етап 2 | Google Maps iframe замінено прямим посиланням з rel безпечного формату | Статична перевірка target="_blank" і rel | виправлено |
| B-03 | Етап 2 | Зовнішній script time.is замінено локальною функцією Intl у js/main.js | Перевірка відсутності time.is у index.html | виправлено |
| B-04/X-01 | Етап 2 | Додано security headers і cache policy у vercel.json | Статична перевірка JSON і заголовків | виправлено |
| B-05 | Етап 2 | Зовнішнє посилання з target="_blank" має rel="noopener noreferrer" | Статична перевірка index.html | виправлено |
| P-01 | Етап 2/3 | Додано tailwind.config.js, css/input.css та package scripts; Play CDN залишено через відсутність Node.js | Команда збірки не запускалася через відсутність npx/node | частково |
| P-04 | Етап 3 | Hero video переведено на preload="metadata" | Статична перевірка атрибутів video | виправлено |
| P-05 | Етап 3 | YouTube переведено на фасад; Maps — direct link | Статична перевірка джерел | частково |
| P-06 | Етап 3/4 | Додано prefers-reduced-motion і зменшено анімації | Перевірка css/style.css | виправлено |
| A-01 | Етап 4 | Збережено семантичну структуру, один h1 і skip-link; додано явні стани фокуса | Статична перевірка HTML/CSS | частково |
| R-01 | Етап 4 | Додано overflow-x protection і збережено min-height 48 px для ключових елементів | Статична перевірка 320 px не виконана браузером | частково |
| S-01/S-02 | Етап 5 | Додано canonical, absolute OG/Twitter, favicon, robots.txt і sitemap.xml | Перевірка існування файлів і тегів | виправлено |
| J-01 | Етап 6 | Додано local null guards і убрано time.is; повний node --check не доступний без Node.js | Статична перевірка скриптів і синтаксису оболонки | частково |

## D. Перевірка віджета №11

- Happy path та чиста логіка збережені у js/widget.js та tests/widget.test.js.
- Edge cases у тестах охоплюють межі 1–50 наборів, типи classic/premium/collector та опції.
- Повний Node-запуск не виконано: Node.js/npm/npx відсутні в поточному середовищі.
- Мобільний макет перевірено статично на 320 px: контейнеру задано горизонтальний захист; фінальна візуальна перевірка — через недоступний Chrome.
- ARIA та клавіатурне керування залишені нативними для checkbox/select/input і кнопок; помилки оновлюються через aria-invalid та aria-live.

## E. Пропущено/не вдалося

- Lighthouse до/після не виміряно через відсутність Node.js/npx і недоступність запуска CLI.
- Збірка Tailwind CSS та minify JS не запускалися через відсутність Node.js.
- Конвертація зображень не виконувалась: у проекті вже є один WebP, Sharp/Node CLI недоступні.
- Браузерні перевірки Chrome/console/320 px не виконані через відсутність Node/Chrome-тулінгу у поточному середовищі.
- Повний node --check кожного JS-файлу не виконувався з тієї ж причини.

## F. CI/CD та секрети

Створено .github/workflows/deploy.yml для deploy у Vercel із push у main та workflow_dispatch.

Потрібно додати у GitHub: Settings → Secrets and variables → Actions:

1. `VERCEL_TOKEN` — Personal Token створюється на https://vercel.com/account/tokens.
2. `VERCEL_ORG_ID` — значення з `.vercel/project.json` після виконання `vercel link`.
3. `VERCEL_PROJECT_ID` — значення з `.vercel/project.json` після виконання `vercel link`.

Git-інтеграція Vercel уже деплоїть кожен push: GitHub Actions-деплой працюватиме паралельно, а це нормальна ситуація та очікується два деплої.

Синтаксис YAML перевірено статичною перевіркою структури; повна перевірка через PyYAML/npx відкладена, якщо відповідний інструмент недоступний.
