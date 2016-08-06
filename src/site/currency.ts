export class Currency {
    public static EUR = new Currency("euro", "Евро");
    public static RUB = new Currency("ruble", "Рубль");
    public static USD = new Currency("usd", "Доллар США");

    public static ALL_CURRENCIES:Array<Currency> = [Currency.EUR, Currency.RUB, Currency.USD];

    public id:string;
    public name:string;

    constructor(id:string, name:string) {
        this.id = id;
        this.name = name;
    }
}
