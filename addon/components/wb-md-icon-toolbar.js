import Ember from 'ember';
import layout from '../templates/components/wb-md-icon-toolbar';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout,
    tagName: 'ul',
    classNames: ['global-icon-toolbar'],
    visibleItems: 1,
    toggleShowMoreHelpText: 'Show More',
    toggleShowLessHelpText: 'Show Less',
    moreActionsHelpText: 'More Actions',
    actionMenuConfig: Ember.computed(function () {
        return Ember.Object.create({
            triggerElement: Ember.Object.create({
                componentName: 'wb-md-icon',
                config: Ember.Object.create({
                    helpText: this.get('moreActionsHelpText'),
                    iconName: 'more_vert',
                    color: this.get('color')
                })
            })
        });
    }),
    toggleElement: Ember.Object.create({
        iconDefault: 'unfold_more',
        iconAlternative: 'unfold_less'
    }),
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
        this.setActionMenuItems();
        this.registerActions();
    },
    willUpdate() {
        this.setActionMenuItems();
    },
    toggleExist: Ember.computed('toggledProperty', function () {
        if (Ember.isPresent(this.get('toggledProperty'))) {
            return true;
        }
        return false;
    }),
    toogleHelpText: Ember.computed('toggledProperty', {
        get() {
            return this.get('toggledProperty') ? this.get('toggleShowLessHelpText') : this.get('toggleShowMoreHelpText');
        }
    }),
    registerActions() {
        let items = this.get('items'),
            actionsArray = Ember.A(),
            objectTypes = ['object', 'instance'];

        function findType(item) {
            let itemType = Ember.typeOf(item),
                isObject = objectTypes.includes(itemType);
            if (isObject) {
                queryObject(item);
            }
            if (itemType === 'array') {
                queryArray(item);
            }
            return;
        }

        function queryArray(items) {
            items.forEach(item => {
                if (Ember.get(item, 'action') || Ember.get(item, 'config.action')) {
                    actionsArray.pushObject(item);
                }
                findType(item);
            });
        }

        function queryObject(items) {
            Object.keys(items).forEach(item => {
                findType(Ember.get(items, item));
            });
        }
        findType(items);
        //Remove dublicated actions
        actionsArray = [...new Set(actionsArray)];
        actionsArray.forEach(item => {
            let action = item.get('action') || item.get('config.action'),
                //register Actions on component for proxy it upper
                func = new Function("return function " + action + "(item){ this.send('triggerSendAction', item.get('action'), item); }")(item);
            this.get('actions')[action] = func;
        });
    },
    setActionMenuItems() {
        let items = this.get('items'),
            total = Ember.isPresent(items) ? items.length : 0,
            visible = this.get('visibleItems'),
            actionMenuItems = Ember.A();
        if (total <= visible) {
            return false;
        }
        let slicedItems = items.slice(visible, total);
        slicedItems.forEach(item => {
            let actionMenu = item.get('config.items');
            //Create line item
            if (actionMenu) {
                actionMenuItems = Ember.A([...actionMenuItems, ...actionMenu]);
            } else {
                let obj = Ember.Object.create({
                    item: item
                });
                obj.setProperties({
                    label: Ember.computed.alias('item.config.label'),
                    isDisabled: Ember.computed.alias('item.config.isDisabled'),
                    iconName: Ember.computed.alias('item.config.iconName'),
                    isSelected: Ember.computed.alias('item.config.isSelected'),
                    action: (item.get('config.onClickAction')) ? item.get('config.onClickAction') : item.get('config.action')
                });
                actionMenuItems.pushObject(obj);
            }
        });
        //return configuration;
        this.set('actionMenuConfig.items', actionMenuItems);
    },
    actions: {
        triggerSendAction(actionName, item) {
            this.set(actionName, actionName);
            this.sendAction(actionName, item);
        }
    }
});