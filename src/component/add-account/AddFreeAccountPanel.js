import currencySelector from "../common/currency-selector";

export default {
    template: `
        <div>
            <form>
                <currency-selector></currency-selector>
            </form>
        </div>`,
    components: {
        "currency-selector": currencySelector
    },
    data: function () {
        return {};
    }
};