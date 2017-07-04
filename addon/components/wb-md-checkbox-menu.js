import Ember from 'ember';
import layout from '../templates/components/wb-md-checkbox-menu';
import ClickOutside from '../mixins/click-outside';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, ClickOutside, {
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        let items = this.get('items');
        if (Ember.isPresent(items)) {
            items = items.map(item => Ember.Object.create(item));
        }
        this.set('items', Ember.A(items));
    },
    layout,
    classNames: ['checkbox-menu'],
    classNameBindings: [
        'isOpen:checkbox-menu_open'
    ],
    isViewSelected: false,
    isAllSelected: false,
    isOpen: false,
    disableSelectAction: false,
    position: "bottom",
    deafultSelection: Ember.computed('items.@each.deafultSelection', function () {
        return this.get('items').findBy('deafultSelection', true);
    }),
    isChecked: Ember.computed('items.@each.isSelected', function () {
        return this.get('items').isAny('isSelected');
    }),
    isIndeterminate: Ember.computed('items.@each.isIndeterminate', function () {
        let item = this.get('items').findBy('isSelected', true);
        return item && item.get('isIndeterminate') ? true : false;
    }),
    clickOutside() {
        this.set('isOpen', false);
    },
    setPosition() {
        var docPosition,
            modalPosition = this.get('element').querySelector('.checkbox-menu__modal').getBoundingClientRect().bottom;
        if (document.querySelector('.page__main').contains(this.get('element'))) {
            docPosition = document.querySelector('.page__main').getBoundingClientRect().bottom;
        } else {
            docPosition = document.body.getBoundingClientRect().bottom;
        }
        if (docPosition <= modalPosition) {
            this.set("position", "top");
        } else {
            this.set("position", "bottom");
        }
    },
    actions: {
        showModal() {
            this.toggleProperty('isOpen');
            if (this.get('isOpen')) {
                this.setPosition();
            }
        },
        toggleSelectAll() {
            if (this.get('isChecked')) {
                let item = this.get('items').findBy('isSelected', true);
                this.send('setSelection', item);
            } else {
                let deafultSelection = this.get('deafultSelection');
                this.send('setSelection', deafultSelection);
            }
        },
        setSelection(item) {
            if (Ember.get(item, 'isSelectAllPage') && !Ember.get(item, 'isSelected')) {
                this.get('items').setEach('isSelected', true);
            } else {
                let otherItems = this.get('items').without(item);
                otherItems.setEach('isSelected', false);
                item.toggleProperty('isSelected');
            }
            if (!this.get('disableSelectAction')) {
                Ember.run.next(this, function () {
                    this.wbActionHandler('selectAction', [this.get('action'), item, this.get('parentRecord')]);
                });
            }
        }
    }
});