import Ember from 'ember';
import layout from '../templates/components/wb-md-header-section-static-info';

export default Ember.Component.extend({
    layout,
    classNames: ['entity-static-info'],
    isStaticInfoHeaderToggled: false,
    didStaticInfoToggled: Ember.observer('isStaticInfoHeaderToggled', function () {
        let element = this.get('element');
        if (this.get('isStaticInfoHeaderToggled')) {
            let height = element.scrollHeight;
            element.style.height = height + 'px';
        } else {
            element.removeAttribute('style');
        }
    })
});
