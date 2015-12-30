module.exports = {
    infoPanel: function (rootId) {
        var DOMUtils = require("./dom-utils");
        var rootEl = document.getElementById(rootId);
        if (!rootEl) {
            return;
        }
        DOMUtils.setTitle(".pi-lr", "Доходность за последние календарные месяцы. Новые снизу.", rootEl);
        DOMUtils.setTitle(".pi-eq-usd", "Капитал счета в долларах США.", rootEl);
        DOMUtils.setTitle(".pi-i-size", "Число счетов в портфеле/индексе.", rootEl);
        DOMUtils.setTitle(".pi-cur", "Базовая валюта счета.", rootEl);
        DOMUtils.setTitle(".pi-n-offers", "Число открытых оферт.", rootEl);
        DOMUtils.setTitle(".pi-percent", "Процент за календарную неделю.", rootEl);
        DOMUtils.setTitle(".pi-fav", "Избранный ПАММ-счет.", rootEl);
        DOMUtils.setTitle(".pi-nc", "Есть новые комментарии!", rootEl);
        DOMUtils.setTitle(".pi-i-share", "Доля инвестора в лучшей оферте.", rootEl);
        DOMUtils.setTitle(".pi-i-min", "Минимальная инвестиция в валюте счета.", rootEl);
    }
};
