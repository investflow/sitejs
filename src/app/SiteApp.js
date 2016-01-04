import Vue from "vue";
import AddAccountForm from "./../component/add-account/AddAccountForm";

export default {
    create: function (elementId) {
        Vue.component("add-account-form", AddAccountForm);
        new Vue({el: elementId});
    }
};

