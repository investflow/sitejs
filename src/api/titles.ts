import DOMUtils from "./site-utils";

export default {
    infoPanel: function (rootId:string):void {
        let rootEl = document.getElementById(rootId);
        if (!rootEl) {
            return;
        }
        DOMUtils.setTitle(".pi-lr", "Доходность за последние календарные месяцы. Новые снизу.", rootEl);
        DOMUtils.setTitle(".pi-eq-usd", "Капитал счета в долларах США.", rootEl);
        DOMUtils.setTitle(".pi-i-size", "Число счетов в портфеле/индексе.", rootEl);
        DOMUtils.setTitle(".pi-cur", "Базовая валюта счета.", rootEl);
        DOMUtils.setTitle(".pi-n-offers", "Число открытых оферт.", rootEl);
        DOMUtils.setTitle(".pi-percent", "Процент за календарную неделю.", rootEl);
        DOMUtils.setTitle(".pi-total", "Для Форекс: доходность счета в % за все время.\nДля биржи: текущее значение котировки.", rootEl);
        DOMUtils.setTitle(".pi-fav", "Избранный инструмент.", rootEl);
        DOMUtils.setTitle(".pi-rec", "Рекомендуемый счет.", rootEl);
        DOMUtils.setTitle(".pi-nc", "Есть новые комментарии!", rootEl);
        DOMUtils.setTitle(".pi-i-share", "Доля инвестора в лучшей оферте.", rootEl);
        DOMUtils.setTitle(".pi-i-min", "Минимальная инвестиция в валюте счета.", rootEl);
        DOMUtils.setTitle(".pi-age", "Возраст счета.", rootEl);
    }
};
