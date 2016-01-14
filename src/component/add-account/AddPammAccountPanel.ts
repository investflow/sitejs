import brokerSelector from "../common/broker-selector";

export default Vue.extend({
    template: `
        <div>
            <form>
                <broker-selector></broker-selector>
            </form>
         </div>`,
    components: {
        "broker-selector": brokerSelector
    },
    data: function () {
        return {};
    }
});