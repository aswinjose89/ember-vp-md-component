import Ember from 'ember';
import layout from 'wb-ui-md-components/templates/components/wb-md-attachment-list-slider';
const { computed } = Ember;

export default Ember.Component.extend({
    layout: layout,
    readonly: false,
    deleteConfirmationMessage: 'This file will be deleted. Do you want to proceed?',
    deleteConfirmationMessageTitle: 'Delete File?',
    classNames: ['card-attachment-list'],
    min: 0,
    max: 50,
    range: 10,
    slider: null,
    init() {
        this._super(...arguments);
    },
    addSlider: Ember.on('didInsertElement', function () {
        this.setupSlider();
    }),
    removeSlider: Ember.on('willDestroyElement', function () {
        let mySwiper = this.get('slider');
        if (mySwiper) {
            mySwiper.destroy(true, true);
        }
    }),
    setupSlider() {
        let mySwiper = new Swiper(this.get('element'), {
            direction: 'horizontal',
            wrapperClass: 'card-attachment-list__slide',
            slideClass: 'card-attachment-list__element',
            slidesPerView: 'auto',
            prevButton: '.card-attachment-list__control_prev',
            nextButton: '.card-attachment-list__control_next',
            buttonDisabledClass: 'card-attachment-list__control_disabled'
        });
        this.set('slider', mySwiper);
    },
    updateSlideOnRerender: Ember.on('didRender', function () {
        let mySwiper = this.get('slider');
        if (mySwiper) {
            mySwiper.update(true);
        }
    }),
    actions: {
        confirmRemoveFileAction(deletingFile) {
            this.set('deletingFile', deletingFile);
            this.mdDialogManager.confirm({
                cancelButtonLabel: 'CANCEL',
                confirmButonLabel: 'DELETE',
                title: this.get('deleteConfirmationMessageTitle'),
                message: this.get('deleteConfirmationMessage')
            }).then(() => {
                this.send('removeFileAction');
            });
        },
        removeFileAction() {
            let deletingFile = this.get('deletingFile');
            if (deletingFile) {
                this.sendAction('deleteFileAction', deletingFile);
                Ember.tryInvoke(this, 'setAttachmentFlag');
            }
            this.set('deletingFile', null);
        },
        downloadFile(item) {
            this.sendAction('downloadFileAction', item);
        },
        openAttachmentFlyout(item, readonlyFlag) {
            if (!Ember.get(item, 'isFileUploading')) {
                this.sendAction('openAttachmentAction', item, readonlyFlag);
            }
        },
        showToolTip(data) {
            this.mdTooltipManager.open({
                label: data,
                shownOnOverflow: true
            });
        },
        hideToolTip() {
            this.mdTooltipManager.close();
        }
    }
});