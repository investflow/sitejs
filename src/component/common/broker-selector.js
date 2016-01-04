import {Broker} from "../../api/broker"

let formOptions = Object.values(Broker).map((v) => {
    return {text: v.name, value: v.id};
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