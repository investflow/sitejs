import currencySelector from "../common/currency-selector";

export default Vue.extend({
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
});