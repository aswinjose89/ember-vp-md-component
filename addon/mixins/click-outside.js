import Ember from 'ember';

const { computed, K } = Ember;
const bound = function (fnName) {
    return computed(fnName, function () {
        return this.get(fnName).bind(this);
    });
};

export default Ember.Mixin.create({
    clickOutside: K,
    clickHandler: bound('outsideClickHandler'),
    outsideClickHandler(e) {
        if (e) {
            let element = this.get('element'),
                wormHole = document.getElementById(`${this.get('elementId')}-dropdown`);
            if (!Ember.isEmpty(this.get('outSideComponent')) && this.get('element').querySelector(this.get('outSideComponent'))) {
                element = this.get('element').querySelector(this.get('outSideComponent'));
            }
            const target = e.target;
            if (target) {
                let targetWidth = target.clientWidth,
                    targetScrollHeight = target.scrollHeight,
                    targetHeight = target.clientHeight,
                    targetCss = window.getComputedStyle(target),
                    overflowY = window.getComputedStyle(target)['overflow-y'],
                    overflowX = window.getComputedStyle(target)['overflow-x'],
                    targetCanBeScrolled = (overflowY === 'scroll' || overflowY === 'auto');
                if (targetWidth <= e.clientX && targetScrollHeight > targetHeight && targetCanBeScrolled) {
                    return false;
                }
            };
            //detect for scroll bar existing and click on him
            let checkChildComponent = false;
            this.childViews.map(item => {
                if (Ember.get(item, "element") === target) {
                    checkChildComponent = true;
                }
            });
            const isOutside = element === target || element.contains(target) || (wormHole && wormHole === target) || (wormHole && wormHole.contains(target));
            if (!isOutside) {
                this.clickOutside(e);
            }
        }
    },
    setupOutsideClickListener: Ember.on('didInsertElement', function () {
        window.addEventListener('mouseup', this.get('clickHandler'));
        // window.addEventListener('mousedown', this.get('clickHandler'));
    }),
    removeOutsideClickListener: Ember.on('willDestroyElement', function () {
        window.removeEventListener('mouseup', this.get('clickHandler'));
        // window.removeEventListener('mousedown', this.get('clickHandler'));
    })
});