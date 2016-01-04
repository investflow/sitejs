import addPammAccountPanel from "./AddPammAccountPanel";
import addFreeAccountPanel from "./AddFreeAccountPanel";

export default {
    template: `
        <div>
            <a href v-on:click="showPamms">ПАММ</a>
            <a href v-on:click="showFree" style="margin-left: 20px;">Свободные средства</a>
            <div>
                <add-pamm-account v-show="tab == 0"></add-pamm-account>
                <add-free-account v-show="tab == 1"></add-free-account>
            </div>
        </div>`,
    components: {
        "add-pamm-account": addPammAccountPanel,
        "add-free-account": addFreeAccountPanel
    },
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
};