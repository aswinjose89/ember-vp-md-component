import Ember from 'ember';

const { computed, K } = Ember;
const bound = function (fnName) {
    return computed(fnName, function () {
        return this.get(fnName).bind(this);
    });
};
export default Ember.Mixin.create({
    handleScroll: K,
    scrollListener: bound('scrollHandler'),
    scrollHandler(e) {
        let target = e.target,
            element = this.get('element');
        if (e && (target === element || target.contains(element))) {
            this.handleScroll(e);
        }
    },
    findClosestScrolledParent(el) {
        let parent = el.parentElement;
        if (!parent) return el;
        let targetScrollHeight = parent.scrollHeight,
            targetHeight = parent.clientHeight,
            targetCss = window.getComputedStyle(parent),
            overflowY = window.getComputedStyle(parent)['overflow-y'],
            targetCssScroll = (overflowY === 'scroll' || overflowY === 'auto'),
            parentHasScroll = targetScrollHeight > targetHeight && targetCssScroll
        return parentHasScroll ? parent : this.findClosestScrolledParent(parent);
    },
    setupScrollListener: Ember.on('didInsertElement', function () {
        if (!this.get('enableScrollListener')) {
            return;
        }
        window.addEventListener('scroll', this.get('scrollListener'), true);
    }),
    removeScrollListener: Ember.on('willDestroyElement', function () {
        window.removeEventListener('scroll', this.get('scrollListener'), true);
    })
});