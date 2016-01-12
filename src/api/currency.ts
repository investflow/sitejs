let currency = {
    EUR: {id: "euro", name: "Евро"},
    RUB: {id: "ruble", name: "Рубль"},
    USD: {id: "usd", name: "Доллар США"}
};
Object.freeze(currency);

export {
    currency as Currency
};