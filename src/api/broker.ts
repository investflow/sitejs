export class Broker {
    public static ALFAFOREX:Broker = new Broker(11, "Альфа-Форекс");
    public static AMARKETS:Broker = new Broker(4, "AMarkets");
    public static ALPARI:Broker = new Broker(3, "Альпари");
    public static COMON:Broker = new Broker(28, "Comon");
    public static FOREX4YOU:Broker = new Broker(9, "Forex4you");
    public static FXOPEN:Broker = new Broker(10, "FxOpen");
    public static FRESHFOREX:Broker = new Broker(21, "FreshForex");
    public static FIBOGROUP:Broker = new Broker(22, "FIBO Group");
    public static INSTAFOREX:Broker = new Broker(5, "InstaForex");
    public static LITEFOREX:Broker = new Broker(18, "LiteForex");
    public static ROBOFOREX:Broker = new Broker(13, "RoboForex");
    public static TENKOFX:Broker = new Broker(15, "TenkoFX");
    public static WELTRADE:Broker = new Broker(12, "WELTRADE");
    public static MOEX:Broker = new Broker(30, "ММВБ-РТС");
    public static SHARE4YOU:Broker = new Broker(31, "Share4you");
    public static MQL5_COM:Broker = new Broker(32, "MQL5.com");

    public static ACTIVE_BROKERS:Array<Broker> = [
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
        Broker.SHARE4YOU,
        Broker.TENKOFX,
        Broker.WELTRADE,
        Broker.MOEX,
        Broker.MQL5_COM,
    ];

    constructor(public id:number, public name:string) {
        this.id = id;
        this.name = name;
        Object.freeze(this);
    }

    public static getBrokerById(id:number):Broker {
        if (!id) {
            return undefined;
        }
        for (let b of Broker.ACTIVE_BROKERS) {
            if (b.id === id) {
                return b;
            }
        }
        return undefined;
    }
}

