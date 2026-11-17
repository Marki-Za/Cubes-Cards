(function () {
  "use strict";

  const calculateTotal = ({ sets, type, giftBox, engraving, express }) => {
    const typeFees = { classic: 0, premium: 600, collector: 1500 };
    return 200 + Number(sets) * 450 + typeFees[type] +
      (giftBox ? 250 : 0) + (engraving ? 400 : 0) + (express ? 300 : 0);
  };

  const validateSets = (raw) => {
    const value = Number(raw);
    return { ok: Number.isInteger(value) && value >= 1 && value <= 50, value, message:
      "Введіть кількість наборів — ціле число від 1 до 50." };
  };

  const initWidget = (rootEl) => {
    if (!rootEl || typeof rootEl.querySelector !== "function") return null;
    const setsInput = rootEl.querySelector('[data-field="sets"]');
    const typeSelect = rootEl.querySelector('[data-field="type"]');
    const giftBox = rootEl.querySelector('[data-field="gift-box"]');
    const engraving = rootEl.querySelector('[data-field="engraving"]');
    const express = rootEl.querySelector('[data-field="express"]');
    const totalPrice = rootEl.querySelector("#total-price");
    if (!setsInput || !typeSelect || !giftBox || !engraving || !express || !totalPrice) return null;

    setsInput.addEventListener("input", () => update());
    typeSelect.addEventListener("change", () => update());
    [giftBox, engraving, express].forEach((control) => control.addEventListener("change", update));

    function update() {
      const sets = validateSets(setsInput.value);
      if (!sets.ok) {
        totalPrice.textContent = "—";
        return;
      }
      const total = calculateTotal({
        sets: sets.value,
        type: typeSelect.value,
        giftBox: giftBox.checked,
        engraving: engraving.checked,
        express: express.checked
      });
      totalPrice.textContent = total.toLocaleString("uk-UA") + " грн";
    }

    update();
    return { update };
  };

  document.addEventListener("DOMContentLoaded", () => {
    try {
      document.querySelectorAll("[data-widget-root]").forEach((root) => initWidget(root));
    } catch (error) {
      // Помилка окремого віджета не повинна зупиняти інші скрипти.
    }
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { calculateTotal, validateSets, initWidget };
  }
})();
