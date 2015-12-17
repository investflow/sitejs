module.exports = {
    create: function (elementId) {
        var Vue = require('vue');
        var AddAccountForm = require("./../component/add-account/AddAccountForm");
        var form = new AddAccountForm();
        form.el = elementId;
        return new Vue(form);
    }
};

