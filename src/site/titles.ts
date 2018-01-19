import DOMUtils from './site-utils';

export default {
    infoPanel: function (rootId: string): void {
        let rootEl = document.getElementById(rootId);
        if (!rootEl) {
            return;
        }
        DOMUtils.setTitle('.pi-lr', 'Доходность за последние календарные месяцы. Новые месяцы добавляются сверху.', rootEl);
        DOMUtils.setTitle('.pi-eq-usd', 'Капитал счёта в долларах США', rootEl);
        DOMUtils.setTitle('.pi-i-size', 'Число счетов в портфеле/индексе', rootEl);
        DOMUtils.setTitle('.pi-cur', 'Базовая валюта счёта', rootEl);
        DOMUtils.setTitle('.pi-n-offers', 'Число открытых оферт', rootEl);
        DOMUtils.setTitle('.pi-percent', 'Процент за календарную неделю', rootEl);
        DOMUtils.setTitle('.pi-total', 'Для Форекс: доходность счёта в % за все время.\nДля биржи: текущее значение котировки.', rootEl);
        DOMUtils.setTitle('.pi-fav', 'Избранный инструмент', rootEl);
        DOMUtils.setTitle('.pi-rec', 'Рекомендуемый счёт', rootEl);
        DOMUtils.setTitle('.pi-nc', 'Есть новые комментарии!', rootEl);
        DOMUtils.setTitle('.pi-i-share', 'Доля инвестора в лучшей оферте', rootEl);
        DOMUtils.setTitle('.pi-i-min', 'Минимальная инвестиция в валюте счёта', rootEl);
        DOMUtils.setTitle('.pi-age', 'Возраст счета', rootEl);
        DOMUtils.setTitle('.pi-prt', 'Счёт входит в один из портфелей пользователя', rootEl);
        DOMUtils.setTitle('.pi-lst', 'Счёт входит в один списков пользователя', rootEl);
        DOMUtils.setTitle('.pi-dec-ok', 'Управляющий соблюдает собственную декларацию о торговле.', rootEl);
        DOMUtils.setTitle('.pi-dec-bad', 'Управляющий не соблюдает собственную декларацию о торговле.', rootEl);
        DOMUtils.setTitle('.pi-shares', 'Число акций', rootEl);
    },
    page: function () {
        let rootEl = document.body;

        DOMUtils.setTitle('.tt-calmar',
            'Для ПАММ-счетов это отношение усредненной дневной доходности к усредненной по дням максимальной просадке.\n\n' +
            'Инвестирование в стратегию с более высоким коэффициентом Кальмара будет менее рискованным.\n\n' +
            'Сравнивать абсолютное значение коэффициента корректно только для счетов одного брокера.'
            , rootEl);

        DOMUtils.setTitle('.tt-sharp',
            'Для ПАММ-счетов это отношение усредненной дневной доходности к дневной волатильности.\n\n' +
            'Инвестирование в стратегию с более высоким коэффициентом Шарпа будет менее рискованным.'
            , rootEl);

        DOMUtils.setTitle('.tt-sortino',
            'Для ПАММ-счетов это отношение усредненной дневной доходности к среднеквадратическому отклонению просадки по дням с отрицательной доходностью.\n\n' +
            'Инвестирование в стратегию с более высоким коэффициентом Сортино будет менее рискованным.'
            , rootEl);

        DOMUtils.setTitle('.tt-shvager',
            'Для ПАММ-счетов это отношение усредненной дневной доходности к усредненной просадке для дней с отрицательной доходностью.\n\n' +
            'Инвестирование в стратегию с более высоким коэффициентом Швагера будет менее рискованным.'
            , rootEl);

        DOMUtils.setTitle('.tt-loss-chance', 'Вероятность убыточной недели ПАММ-счета считается за весь срок его существования ' +
            'по формуле (L+1)/(N+1), где L - число убыточных недель, N - всего недель.', rootEl)
    }
};
