import {Currency} from  "../../api/currency";

const formOptions = Object.values(Currency).map((val) => {
    return {text: val.name, value: val.id};
});

export default {
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
};