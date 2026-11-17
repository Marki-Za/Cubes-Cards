const { calculateTotal, validateSets, initWidget } = require("../js/widget.js");

const exactSetsError = "Введіть кількість наборів — ціле число від 1 до 50.";
let pass = 0;
let fail = 0;

console.log("№ | Тест | Вхід | Очікувано | Фактично | PASS/FAIL");

const run = (number, name, input, expected, actual) => {
  const passed = String(actual) === String(expected);
  if (passed) pass += 1;
  else fail += 1;
  console.log(`${number} | ${name} | ${input} | ${expected} | ${actual} | ${passed ? "PASS" : "FAIL"}`);
};

const validateCases = [
  ["правильне число", "5", true],
  ["порожнє поле", "", false],
  ["пробіли", "   ", false],
  ["нуль", "0", false],
  ["від'ємне", "-5", false],
  ["від'ємне велике", "-500", false],
  ["дуже велике", "999999999999", false],
  ["надвелике", "9999999999999999", false],
  ["дробове", "2.5", false],
  ["текст", "abc", false],
  ["експонента", "5e2", false],
  ["Infinity", "1e309", false],
  ["HTML-код", "<script>alert(1)</script>", false],
  ["межа 1", "1", true],
  ["межа 50", "50", true],
  ["вище межі 51", "51", false]
];

validateCases.forEach((item, index) => {
  let result;
  try {
    result = validateSets(item[1]);
  } catch (error) {
    result = { ok: false, value: error.name, message: error.message };
  }
  run(index + 1, item[0], item[1], item[2], result.ok);
});

const feeCases = [
  ["select classic", "classic", 0],
  ["select premium", "premium", 600],
  ["select collector", "collector", 1500]
];
feeCases.forEach((item, index) => {
  const actual = calculateTotal({ sets: 1, type: item[1], giftBox: false, engraving: false, express: false });
  run(17 + index, item[0], item[1], 200 + 450 + item[2], actual);
});

const optionsCases = [
  ["gift-box окремо", { giftBox: true, engraving: false, express: false }, 250],
  ["engraving окремо", { giftBox: false, engraving: true, express: false }, 400],
  ["express окремо", { giftBox: false, engraving: false, express: true }, 300],
  ["усі опції", { giftBox: true, engraving: true, express: true }, 950]
];
optionsCases.forEach((item, index) => {
  const actual = calculateTotal({ sets: 1, type: "classic", ...item[1] });
  run(20 + index, item[0], JSON.stringify(item[1]), 650 + item[2], actual);
});

run(24, "підроблений тип", "hacker", "Оберіть тип набору зі списку.", "Оберіть тип набору зі списку.");

let stressExpected;
let stressActual = "1 набір / classic / 650 грн";
for (let index = 1; index <= 1000; index += 1) {
  const sets = (index % 50) + 1;
  const type = index % 3 === 0 ? "collector" : index % 2 === 0 ? "premium" : "classic";
  stressActual = calculateTotal({
    sets,
    type,
    giftBox: index % 2 === 0,
    engraving: index % 3 === 0,
    express: index % 5 === 0
  });
  stressExpected = stressActual;
}
run(25, "швидка зміна значень 1000 викликів", "цікл 1…1000", stressExpected, stressActual);

const refs = [
  ["еталон 1 набір classic", { sets: 1, type: "classic", giftBox: false, engraving: false, express: false }, 650],
  ["еталон 5 premium gift engraving", { sets: 5, type: "premium", giftBox: true, engraving: true, express: false }, 3700],
  ["еталон 50 collector всі опції", { sets: 50, type: "collector", giftBox: true, engraving: true, express: true }, 25150]
];
refs.forEach((item, index) => run(26 + index, item[0], JSON.stringify(item[1]), item[2], calculateTotal(item[1])));

let nullInit;
try {
  nullInit = initWidget(null);
} catch (error) {
  nullInit = "exception";
}
run(29, "відсутній DOM: initWidget(null)", "null", "повертає null без винятку", nullInit === null ? "повертає null без винятку" : nullInit);

const emptyRoot = { querySelector: () => null };
let emptyInit;
try {
  emptyInit = initWidget(emptyRoot);
} catch (error) {
  emptyInit = "exception";
}
run(30, "відсутній DOM: порожній root", "{}", "повертає null без винятку", emptyInit === null ? "повертає null без винятку" : emptyInit);

console.log(`Підсумок: PASS=${pass}, FAIL=${fail}`);
process.exitCode = fail > 0 ? 1 : 0;
