(function () {
  "use strict";

  const calculateTotal = ({ sets, type, giftBox, engraving, express }) => {
    const typeFees = { classic: 0, premium: 600, collector: 1500 };
    if (!Object.prototype.hasOwnProperty.call(typeFees, type)) return null;
    return 200 + sets * 450 + typeFees[type] +
      (giftBox ? 250 : 0) + (engraving ? 400 : 0) + (express ? 300 : 0);
  };

  const validateSets = (raw) => {
    const message = "Введіть кількість наборів — ціле число від 1 до 50.";
    if (typeof raw !== "string" && typeof raw !== "number") {
      return { ok: false, value: null, message };
    }
    const trimmed = String(raw).trim();
    if (!/^\d{1,3}$/.test(trimmed)) {
      return { ok: false, value: null, message };
    }
    const value = Number(trimmed);
    if (!Number.isInteger(value) || value < 1 || value > 50) {
      return { ok: false, value: null, message };
    }
    return { ok: true, value, message: "" };
  };

  const initWidget = (rootEl) => {
    try {
      if (!rootEl || typeof rootEl.querySelector !== "function") return null;
      const setsInput = rootEl.querySelector('[data-field="sets"]');
      const typeSelect = rootEl.querySelector('[data-field="type"]');
      const giftBox = rootEl.querySelector('[data-field="gift-box"]');
      const engraving = rootEl.querySelector('[data-field="engraving"]');
      const express = rootEl.querySelector('[data-field="express"]');
      const totalPrice = rootEl.querySelector('[id="total-price"]');
      const baseRow = rootEl.querySelector('[id="breakdown-base"]');
      const setsRow = rootEl.querySelector('[id="breakdown-sets"]');
      const typeRow = rootEl.querySelector('[id="breakdown-type"]');
      const optionsRow = rootEl.querySelector('[id="breakdown-options"]');
      const errorSets = rootEl.querySelector('[id="error-sets"]');
      const resetButton = rootEl.querySelector('[data-action="reset"]');
      const orderButton = rootEl.querySelector('[data-action="order"]');
      const orderMessage = rootEl.querySelector('[id="order-message"]');

      if (!setsInput || !typeSelect || !giftBox || !engraving || !express || !totalPrice) return null;
      if (!baseRow || !setsRow || !typeRow || !optionsRow || !errorSets || !resetButton || !orderButton || !orderMessage) return null;

      const formatPrice = (value) => value.toLocaleString("uk-UA") + " грн";
      let orderLocked = false;

      const update = () => {
        const setsValidation = validateSets(setsInput.value);
        const typeFees = { classic: 0, premium: 600, collector: 1500 };
        const typeValid = Object.prototype.hasOwnProperty.call(typeFees, typeSelect.value);

        setsInput.setAttribute("aria-invalid", String(!setsValidation.ok));
        setsInput.classList.toggle("is-valid", setsValidation.ok);
        typeSelect.setAttribute("aria-invalid", String(!typeValid));
        typeSelect.classList.toggle("is-valid", typeValid);

        if (!setsValidation.ok) {
          errorSets.textContent = setsValidation.message;
          totalPrice.textContent = "—";
          baseRow.textContent = "—";
          setsRow.textContent = "—";
          typeRow.textContent = "—";
          optionsRow.textContent = "—";
          orderButton.disabled = true;
          orderMessage.textContent = "";
          return;
        }

        if (!typeValid) {
          errorSets.textContent = "Оберіть тип набору зі списку.";
          totalPrice.textContent = "—";
          baseRow.textContent = "—";
          setsRow.textContent = "—";
          typeRow.textContent = "—";
          optionsRow.textContent = "—";
          orderButton.disabled = false;
          orderMessage.textContent = "";
          return;
        }

        errorSets.textContent = "";
        const options = giftBox.checked || engraving.checked || express.checked;
        const optionsTotal = (giftBox.checked ? 250 : 0) +
          (engraving.checked ? 400 : 0) + (express.checked ? 300 : 0);
        const total = calculateTotal({
          sets: setsValidation.value,
          type: typeSelect.value,
          giftBox: giftBox.checked,
          engraving: engraving.checked,
          express: express.checked
        });

        totalPrice.textContent = formatPrice(total);
        baseRow.textContent = "200 грн";
        setsRow.textContent = formatPrice(setsValidation.value * 450);
        typeRow.textContent = formatPrice(typeFees[typeSelect.value]);
        optionsRow.textContent = options ? formatPrice(optionsTotal) : "0 грн";
        orderButton.disabled = false;
        orderMessage.textContent = "";
      };

      setsInput.addEventListener("input", update);
      typeSelect.addEventListener("change", update);
      giftBox.addEventListener("change", update);
      engraving.addEventListener("change", update);
      express.addEventListener("change", update);

      resetButton.addEventListener("click", () => {
        setsInput.value = "1";
        typeSelect.value = "classic";
        giftBox.checked = false;
        engraving.checked = false;
        express.checked = false;
        orderLocked = false;
        orderButton.disabled = false;
        orderMessage.textContent = "";
        update();
      });

      orderButton.addEventListener("click", () => {
        if (orderLocked || orderButton.disabled) return;
        orderLocked = true;
        orderButton.disabled = true;
        orderMessage.textContent = "Дякуємо! Це демонстраційне замовлення, дані нікуди не надсилаються.";
        window.setTimeout(() => {
          orderLocked = false;
          orderButton.disabled = !validateSets(setsInput.value).ok;
        }, 1500);
      });

      update();
      return { update };
    } catch (error) {
      return null;
    }
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
