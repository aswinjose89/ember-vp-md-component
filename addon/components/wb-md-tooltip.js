import Ember from 'ember';
import layout from '../templates/components/wb-md-tooltip';
import ComponentHelper from '../mixins/component-helper';

const { computed, K } = Ember;
const bound = function (fnName) {
    return computed(fnName, function () {
        return this.get(fnName).bind(this);
    });
};

export default Ember.Component.extend(ComponentHelper, {
    layout,
    classNames: ['global-tooltip'],
    classNameBindings: [
        'isOpen:global-tooltip_open',
        'vCard:global-vcard',
        'tags:global-tooltip_tags'
    ],
    mouseHandler: bound('setPosition'),
    originalTarget: null,
    isOpen: false,
    shownOnOverflow: false,
    componentConfig: Ember.computed.alias('config.componentConfig'),
    addMouseEnterEvent: Ember.on('didInsertElement', function () {
        window.addEventListener('mousemove', this.get('mouseHandler'));
    }),
    removeMouseEnterEvent: Ember.on('willDestroyElement', function () {
        window.removeEventListener('mousemove', this.get('mouseHandler'));
        this.set('isOpen', false);
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('componentConfig'), 'componentConfig');
    },
    didRender() {
        this.setPosition();
    },
    setPosition(e) {
        if (e) {
            let element = this.get('element'),
                limitEl = document.body.getBoundingClientRect(),
                rightLimit = limitEl.right,
                bottomLimit = limitEl.bottom,
                yBottomOffset = 20,
                yTopOffset = 10,
                xElementOffset = element.getBoundingClientRect().width / 2,
                yElementOffset = element.getBoundingClientRect().height,
                xPosition = e.clientX - xElementOffset,
                yPosition = e.clientY + yBottomOffset,
                target = e.target,
                originalTarget;
            if (Ember.isEmpty(this.get('originalTarget'))) {
                this.set('originalTarget', target);
            }
            originalTarget = this.get('originalTarget');
            if (target === originalTarget) {
                //set xOffset based on cursor position
                if (xPosition < 0) {
                    xPosition = 0;
                } else if (e.clientX + xElementOffset > rightLimit) {
                    xPosition = limitEl.width - xElementOffset * 2;
                }
                //set yOffset based on cursor position
                if (yPosition + yElementOffset > bottomLimit) {
                    yPosition = e.clientY - yTopOffset - yElementOffset;
                }
                if (this.get('shownOnOverflow') && target.scrollWidth <= target.offsetWidth) {
                    return;
                }
                this.set('isOpen', true);
                element.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0)`;
            } else {
                this.mdTooltipManager.close();
            }
        }
    }
});