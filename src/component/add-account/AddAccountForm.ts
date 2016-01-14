import * as Vue from "vue";
export default Vue.extend({
    template: `
        <div>
            <a href v-on:click="showPamms">ПАММ</a>
            <a href v-on:click="showFree" style="margin-left: 20px;">Свободные средства</a>
            <div>
                <div is="add-pamm-account" v-show="tab == 0"></div>
                <div is="add-free-account" v-show="tab == 1"></div>
            </div>
        </div>`,
    methods: {
        showPamms: function (event) {
            event.preventDefault();
            this.tab = 0;
        },
        showFree: function () {
            event.preventDefault();
            this.tab = 1;
        }
    },
    data: function () {
        return {tab: 0};
    }
});