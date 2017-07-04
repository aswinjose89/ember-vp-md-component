import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        openAlert() {
            this.mdDialogManager.alert({
                message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                title: 'Lorem Ipsum',
                buttonLabel: 'OK'
            });
        },
        openAlertWithBorder() {
            this.mdDialogManager.alert({
                message: `<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry.</p>
                        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                        <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
                title: 'Lorem Ipsum',
                showTopBar: true,
                size: 'medium',
                showActionBar: true,
                buttonLabel: 'OK'
            });
        },
        openConfirmation() {
            this.mdDialogManager.confirm({
                    cancelButtonLabel: 'Reject',
                    confirmButonLabel: 'Confirm',
                    title: 'Discard Changes?',
                    message: "Are you sure you want to discard your latest unsaved changes?"
                })
                .then(() => Ember.Logger.log('Confirmed'))
                .catch(() => Ember.Logger.log('Rejected'));
        }
    }
});