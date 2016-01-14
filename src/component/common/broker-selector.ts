import {Broker} from "../../api/broker";

let formOptions = Broker.ACTIVE_BROKERS.forEach((b:Broker) => {
    return {text: b.name, value: b.id};
});

export default {
    template: `
        <select v-model="selected">
            <option v-for="c in options" v-bind:value="c.value">
                {{ c.text }}
            </option>
        </select>`,

    data: function () {
        return {
            selected: Broker.ALFAFOREX.id,
            options: formOptions
        };
    }
};