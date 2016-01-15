import {Currency} from "../../api/currency";

const formOptions = [];

Currency.ALL_CURRENCIES.forEach((c:Currency) => {
    formOptions.push({text: c.name, value: c.id});
});

export default Vue.extend({
    replace: true,
    template: `
        <select v-model='selected'>
            <option v-for="c in options" v-bind:value="c.value">
                {{ c.text }}
            </option>
        </select>
        `,
    data: function () {
        return {
            selected: Currency.RUB.id,
            options: formOptions
        };
    }
});