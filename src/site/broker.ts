export class Broker {
    public static ALFAFOREX: Broker = new Broker(11, "Альфа-Форекс", "167,43,37", "alfaforex");
    public static AMARKETS: Broker = new Broker(4, "AMarkets", "134,92,56", "amarkets");
    public static ALPARI: Broker = new Broker(3, "Альпари", "82,110,13", "alpari");
    public static COMON: Broker = new Broker(28, "Comon", "184,147,0", "comon");
    public static FOREX4YOU: Broker = new Broker(9, "Forex4you", "6,108,69", "forex4you");
    public static FXOPEN: Broker = new Broker(10, "FxOpen", "187,105,12", "fxopen");
    public static FRESHFOREX: Broker = new Broker(21, "FreshForex", "111,160,44", "freshforex");
    public static FIBOGROUP: Broker = new Broker(22, "FIBO Group", "186,83,89", "fibo-group");
    public static INSTAFOREX: Broker = new Broker(5, "InstaForex", "134,55,55", "instaforex");
    public static LITEFOREX: Broker = new Broker(18, "LiteForex", "0,145,107", "liteforex");
    public static ROBOFOREX: Broker = new Broker(13, "RoboForex", "7,75,110", "roboforex");
    public static TENKOFX: Broker = new Broker(15, "TenkoFX", "94,87,81", "tenkofx");
    public static WELTRADE: Broker = new Broker(12, "WELTRADE", "17,117,169", "weltrade");
    public static MOEX: Broker = new Broker(30, "ММВБ-РТС", "0,0,0", "moex");
    public static SHARE4YOU: Broker = new Broker(31, "Share4you", "6,108,69", "share4you");
    public static MQL5_COM: Broker = new Broker(32, "MQL5.com", "0,0,0", "mql5");
    public static GERCHIK: Broker = new Broker(33, "Gerchik&Co", "169,63,0", "gerchik");
    public static TELETRADE: Broker = new Broker(34, "TeleTrade", "0,136,204", "teletrade");
    public static ICEFX: Broker = new Broker(35, "ICE-FX", "0,136,204", "icefx");

    public static ACTIVE_BROKERS: Array<Broker> = [
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
        Broker.GERCHIK,
        Broker.TELETRADE,
        Broker.ICEFX,
    ];

    constructor(public id: number, public name: string, public rgb: string, public mount) {
    }

    public static getBrokerById(id: number): Broker {
        if (typeof id === 'undefined') {
            return undefined;
        }
        for (let b of Broker.ACTIVE_BROKERS) {
            if (b.id === id) {
                return b;
            }
        }
        return undefined;
    }

    public static getBrokerByMount(mount: string): Broker {
        if (typeof mount === 'undefined') {
            return undefined;
        }
        for (let b of Broker.ACTIVE_BROKERS) {
            if (b.mount == mount) {
                return b;
            }
        }
        return undefined;
    }

    public isPercentBasedPrice() {
        return this != Broker.MOEX;
    }
}

