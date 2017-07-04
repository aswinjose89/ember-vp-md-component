import Ember from 'ember';

const { computed, K } = Ember;
const bound = function (fnName) {
    return computed(fnName, function () {
        return this.get(fnName).bind(this);
    });
};

export default Ember.Mixin.create({
    onKeyUp: K,
    onKeyDown: K,
    onKeyPress: K,
    keyUpListener: bound('keyUpHandler'),
    keyDownListener: bound('keyDownHandler'),
    keyPresListener: bound('keyPressHandler'),
    keyUpHandler(e) {
        this.onKeyUp(e);
    },
    keyDownHandler(e) {
        this.onKeyDown(e);
    },
    keyPressHandler(e) {
        this.onKeyPress(e);
    },
    setupKeyBoardEvents: Ember.on('didInsertElement', function () {
        if (this.get('enableKeyUpListener')) {
            window.addEventListener('keyup', this.get('keyUpListener'), true);
        }
        if (this.get('enableKeyDownListener')) {
            window.addEventListener('keydown', this.get('keyDownListener'), true);
        }
        if (this.get('enableKeyPressListener')) {
            window.addEventListener('keypress', this.get('keyPresListener'), true);
        }
    }),
    removeKeyBoardEvents: Ember.on('willDestroyElement', function () {
        window.removeEventListener('keyup', this.get('keyUpListener'), true);
        window.removeEventListener('keydown', this.get('keyDownListener'), true);
        window.removeEventListener('keypress', this.get('keyPresListener'), true);
    })
});