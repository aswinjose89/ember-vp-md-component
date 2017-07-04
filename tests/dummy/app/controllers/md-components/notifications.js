import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        showSnackBar(position) {
            //isClose: set false to hide close icon
            //isAutoClose: set false to ignore timer to hide the bar.
            //Use this.mdSnackBarManager.onClose(); to hide the bar.
            this.mdSnackBarManager.open({
                position: position,
                autoCloseTimer: 10000,
                isAutoClose: false,
                text: "Successfully submitted",
                links: [{
                        "text": "VIEW",
                        "action": function () { console.log("View"); },
                        "color": "orange"
                    },
                    {
                        "text": "EDIT",
                        "action": function () { console.log("Edit"); },
                        "color": "white"
                    }
                ]
            });
        }
    }
});
