import Ember from 'ember';

export default Ember.Route.extend({

    actions: {
        showSnackBar(position) {
            this.mdSnackBarManager.open({
                position: position,
                "text": "Successfully submitted",
                "links": [{
                        "text": "VIEW",
                        "action": function () { console.log("View"); },
                        "className": "global-snackbar__links-element_color_orange"
                    },
                    {
                        "text": "EDIT",
                        "action": function () { console.log("Edit"); },
                        "className": "global-snackbar__links-element_color_white"
                    }
                ]
            });
        }
    }
});