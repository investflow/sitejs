export class Broker {
    public static ALPARI: Broker = new Broker(3, 'Альпари', '82,110,13', 'alpari', 'alpari_')
    public static AMARKETS: Broker = new Broker(4, 'AMarkets', '134,92,56', 'amarkets', 'amarkets_')
    public static INSTAFOREX: Broker = new Broker(5, 'InstaForex', '134,55,55', 'instaforex', 'insta_')
    public static FOREX4YOU: Broker = new Broker(9, 'Forex4you', '6,108,69', 'forex4you', 'f4y_')
    public static FXOPEN: Broker = new Broker(10, 'FxOpen', '187,105,12', 'fxopen', 'fxopen_')
    public static ALFAFOREX: Broker = new Broker(11, 'Альфа-Форекс', '167,43,37', 'alfaforex', 'alfa_')
    public static WELTRADE: Broker = new Broker(12, 'WELTRADE', '17,117,169', 'weltrade', 'weltrade_')
    public static ROBOFOREX: Broker = new Broker(13, 'RoboForex', '7,75,110', 'roboforex', 'robo_')
    public static TENKOFX: Broker = new Broker(15, 'TenkoFX', '94,87,81', 'tenkofx', 'tenko_')
    public static LITEFOREX: Broker = new Broker(18, 'LiteForex', '0,145,107', 'liteforex', 'lite_')
    public static FRESHFOREX: Broker = new Broker(21, 'FreshForex', '111,160,44', 'freshforex', 'fresh_')
    public static FIBOGROUP: Broker = new Broker(22, 'FIBO Group', '186,83,89', 'fibo-group', 'fibo_')
    public static MYFXBOOK: Broker = new Broker(24, 'Myfxbook', '176,85,20', 'myfxbook', 'myfxbook_')
    public static COMON: Broker = new Broker(28, 'Comon', '184,147,0', 'comon', 'comon_')
    public static MOEX: Broker = new Broker(30, 'ММВБ-РТС', '0,0,0', 'moex', 'moex_')
    public static SHARE4YOU: Broker = new Broker(31, 'Share4you', '6,108,69', 'share4you', 's4y_')
    public static MQL5_COM: Broker = new Broker(32, 'MQL5.com', '0,0,0', 'mql5', 'mql_')
    public static GERCHIK: Broker = new Broker(33, 'Gerchik&Co', '169,63,0', 'gerchik', 'gerchik_')
    public static ICEFX: Broker = new Broker(35, 'ICE-FX', '0,136,204', 'icefx', 'ice_')
    public static ETORO: Broker = new Broker(36, 'eToro', '4,79,123', 'etoro', 'etoro_')
    public static BTCE: Broker = new Broker(37, 'BTC-e', '91, 192, 222', 'btce', 'btce_')
    public static NASDAQ: Broker = new Broker(38, 'Nasdaq', '91, 192, 222', 'nasdaq', 'nasdaq_')
    public static NYSE: Broker = new Broker(39, 'NYSE', '91, 192, 222', 'nyse', 'nyse_')

    public static ACTIVE_BROKERS: Array<Broker> = [
        Broker.ALFAFOREX,
        Broker.AMARKETS,
        Broker.ALPARI,
        Broker.COMON,
        Broker.ETORO,
        Broker.FOREX4YOU,
        Broker.FXOPEN,
        Broker.FRESHFOREX,
        Broker.FIBOGROUP,
        Broker.INSTAFOREX,
        Broker.LITEFOREX,
        Broker.MYFXBOOK,
        Broker.ROBOFOREX,
        Broker.SHARE4YOU,
        Broker.TENKOFX,
        Broker.WELTRADE,
        Broker.MOEX,
        Broker.MQL5_COM,
        Broker.GERCHIK,
        Broker.ICEFX,
        Broker.BTCE,
        Broker.NASDAQ,
        Broker.NYSE
    ]

    constructor(public id: number, public name: string, public rgb: string, public mount, public keyPrefix) {
    }

    public static getBrokerById(id: number): Broker {
        if (typeof id === 'undefined') {
            return undefined
        }
        for (let b of Broker.ACTIVE_BROKERS) {
            if (b.id === id) {
                return b
            }
        }
        return undefined
    }

    public static getBrokerByMount(mount: string): Broker {
        if (typeof mount === 'undefined') {
            return undefined
        }
        for (let b of Broker.ACTIVE_BROKERS) {
            if (b.mount == mount) {
                return b
            }
        }
        return undefined
    }

    public isPercentBasedPrice() {
        return this != Broker.MOEX && this != Broker.NASDAQ && this != Broker.NYSE
    }
}

