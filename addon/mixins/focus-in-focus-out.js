import Ember from 'ember';
const { computed, K } = Ember;
const bound = function (fnName) {
    return computed(fnName, function () {
        return this.get(fnName).bind(this);
    });
};

export default Ember.Mixin.create({
    attributeBindings: ['getTabindex:tabindex'],
    getTabindex: Ember.computed('tabindex', 'isDisabled', 'isReadOnly', {
        get() {
            let tabIndex = this.get('tabindex'),
                disable = this.get('isDisabled') || this.get('isReadOnly');
            if (disable) {
                return '-1'
            }
            return tabIndex ? tabIndex : 0;
        }
    }),
    handleFocusIn: K,
    handleFocusOut: K,
    focusInListener: bound('focusInHandler'),
    focusOutListener: bound('focusOutHandler'),
    focusInHandler(e) {
        let target = e.target,
            element = this.get('element');
        if (e && (target === element || target.contains(element))) {
            this.handleFocusIn(e);
        }
    },
    focusOutHandler(e) {
        let target = e.target,
            element = this.get('element');
        if (e && (target === element || target.contains(element))) {
            this.handleFocusOut(e);
        }
    },
    setupFocusListener: Ember.on('didInsertElement', function () {
        this.get('element').addEventListener('focus', this.get('focusInListener'), true);
        this.get('element').addEventListener('blur', this.get('focusOutListener'), true);
    }),
    removeFocusListener: Ember.on('willDestroyElement', function () {
        this.get('element').removeEventListener('focus', this.get('focusInListener'), true);
        this.get('element').removeEventListener('blur', this.get('focusOutListener'), true);
    })
});