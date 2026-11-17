# Фрагменти звіту

## HTML-розмітка ключових полів

```html
<section id="widget" aria-labelledby="widget-title" data-widget-root>
  <input id="sets-count" data-field="sets" type="number"
    min="1" max="50" step="1" inputmode="numeric" required value="1">
  <p id="error-sets" aria-live="polite" role="alert"></p>
  <select id="set-type" data-field="type">
    <option value="classic">Класичний</option>
  </select>
  <p id="total-price" aria-live="polite">650 грн</p>
  <button id="reset-widget" data-action="reset" type="button">Скинути</button>
  <button id="order-widget" data-action="order" type="button">Замовити</button>
</section>
```

## Фінальний JS лістинг валідації та розрахунку

```js
const validateSets = (raw) => {
  const message = "Введіть кількість наборів — ціле число від 1 до 50.";
  const trimmed = String(raw).trim();
  if (!/^\d{1,3}$/.test(trimmed)) return { ok: false, value: null, message };
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    return { ok: false, value: null, message };
  }
  return { ok: true, value, message: "" };
};

const calculateTotal = ({ sets, type, giftBox, engraving, express }) => {
  const fees = { classic: 0, premium: 600, collector: 1500 };
  if (!Object.prototype.hasOwnProperty.call(fees, type)) return null;
  return 200 + sets * 450 + fees[type] +
    (giftBox ? 250 : 0) + (engraving ? 400 : 0) + (express ? 300 : 0);
};
```

UI оновлює `totalPrice.textContent`, `baseRow.textContent`, `setsRow.textContent`, `typeRow.textContent` та `optionsRow.textContent`; `innerHTML` у новому віджеті не використовується.

## Happy Path

Вхід: `5`, `premium`, пакет `true`, гравіювання `true`.

Розрахунок: `200 + 5 * 450 + 600 + 250 + 400 + 0 = 3700`.

Результат: `3 700 грн`.

## Ручний стрес-тест Chrome DevTools

1. Відкрити `index.html` через Live Server.
2. Відкрити DevTools (`F12`) → Console.
3. Увімкнути `Preserve log`.
4. Виконати `document.querySelector('#sets-count')`, щоб прочитати поле.
5. Перевірити порожнє значення, `0`, `-5`, `2.5`, `abc`, `5e2`, `9999999999999999`, `1`, `50` та `51`.
6. Перевірити: `document.getElementById('total-price').textContent`.
7. Зробити скриншоти на 320, 768 і 1280 px.
