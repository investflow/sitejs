export class Broker {
    id:number;
    name:string;

    constructor(id:number, name:string) {
        this.id = id;
        this.name = name;
        Object.freeze(this);
    }

    static ALFAFOREX:Broker = new Broker(11, "Альфа-Форекс");
    static AMARKETS:Broker = new Broker(4, "AMarkets");
    static ALPARI:Broker = new Broker(3, "Альпари");
    static COMON:Broker = new Broker(28, "Comon");
    static FOREX4YOU:Broker = new Broker(9, "Forex4you");
    static FXOPEN:Broker = new Broker(10, "FxOpen");
    static FRESHFOREX:Broker = new Broker(21, "FreshForex");
    static FIBOGROUP:Broker = new Broker(22, "FIBO Group");
    static INSTAFOREX:Broker = new Broker(5, "InstaForex");
    static LITEFOREX:Broker = new Broker(18, "LiteForex");
    static ROBOFOREX:Broker = new Broker(13, "RoboForex");
    static TENKOFX:Broker = new Broker(15, "TenkoFX");
    static WELTRADE:Broker = new Broker(12, "WELTRADE");
    static MOEX:Broker = new Broker(30, "ММВБ-РТС");

    static ActiveBrokers:Array<Broker> = [
        Broker.ALFAFOREX,
        Broker.AMARKETS,
        Broker.ALPARI,
        Broker.COMON,
        Broker.FOREX4YOU,
        Broker.FXOPEN,
        Broker.FRESHFOREX,
        Broker.FIBOGROUP,
        Broker.INSTAFOREX,
        Broker.LITEFOREX,
        Broker.ROBOFOREX,
        Broker.TENKOFX,
        Broker.WELTRADE,
        Broker.MOEX
    ];

    static getBrokerById(id:number):?Broker {
        return Broker.ActiveBrokers.find((b)=>b.id === id);
    }
}

Object.freeze(Broker);

