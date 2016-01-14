import * as Vue from "vue";
import AddAccountForm from "./../component/add-account/AddAccountForm";
import AddPammAccountPanel from "./../component/add-account/AddPammAccountPanel";
import AddFreeAccountPanel from "./../component/add-account/AddFreeAccountPanel";


export default {
    create: function (selector:string):void {
        Vue.component("add-account-form", AddAccountForm);
        Vue.component("add-pamm-account", AddPammAccountPanel);
        Vue.component("add-free-account", AddFreeAccountPanel);
        new Vue({el: selector});
    }
};

