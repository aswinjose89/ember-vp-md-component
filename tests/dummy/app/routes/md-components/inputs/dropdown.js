import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.findAll('country');
    },
    setupController(controller, model) {
        this._super.apply(this, arguments);
        let newUser = this.store.createRecord('user');
        controller.set('newUser', newUser);
        controller.set('selectedCountry3', Ember.A());
        controller.set('selectedCountry4', Ember.A());
        controller.set('countries', Ember.A([
            Ember.Object.create({ id: 0, label: 'Set A', isGroupHeader: true }),
            Ember.Object.create({ id: 1, label: 'America', isReadOnly: true }),
            Ember.Object.create({ id: 2, label: 'Taiwan' }),
            Ember.Object.create({ id: 3, label: 'Singapore' }),
            Ember.Object.create({ id: 4, label: 'Thailand' }),
            Ember.Object.create({ id: 5, label: 'Philippines' }),
            Ember.Object.create({ id: 6, label: 'Africa' }),
            Ember.Object.create({ id: 7, label: 'China' }),
            Ember.Object.create({ id: 8, label: 'India' }),
            Ember.Object.create({ id: 13, label: 'Set B', isGroupHeader: true }),
            Ember.Object.create({ id: 9, label: 'New Zealand' }),
            Ember.Object.create({ id: 10, label: 'Indonesia' }),
            Ember.Object.create({ id: 11, label: 'Peru' }),
            Ember.Object.create({ id: 12, label: 'Malaysia' })
        ]));
        controller.set('customCountries', [
            Ember.Object.create({ id: 1, val: 'America' }),
            Ember.Object.create({ id: 2, val: 'Taiwan' }),
            Ember.Object.create({ id: 3, val: 'Singapore' })
        ]);
        controller.set('countryConfig', {
            enableGropuHeader: true,
            content: controller.get('countries'),
            label: 'Countries'
        });
        controller.set('dynamicCountryConfig', {
            label: 'Dynamic Countries',
            optionLabelPath: 'name',
            content: model
        });

        controller.set('customCountryConfig', {
            content: controller.get('customCountries'),
            label: 'Countries'
        });
        controller.set('selectedCountry1', Ember.Object.create({ id: 1, val: 'America' }));
        controller.set('selectedCountry3', controller.get('countries').objectsAt([1, 2]));
    },
    actions: {
        enterAction() {
            Ember.Logger.log('Enter Action', ...arguments);
        },
        selectionChanged() {
            Ember.Logger.log('Selection Changed', ...arguments);
        },
        clearSelection() {
            Ember.Logger.log('clearSelection called', this.get('controller.selectedCountry1'));
            this.controller.set('selectedCountry1', {});
        },
        reLoadCountries() {
            Ember.Logger.log('loadCountries content');
            this.controller.set('dynamicCountryConfig', {});
            this.controller.set('selectedCountry2', {});
            this.controller.set('dynamicCountryConfig', {
                label: 'Dynamic Countries',
                optionLabelPath: 'name',
                content: this.controller.get('model')
            });
        },
        showGuidance(helpText) {
            Ember.Logger.log('showGuidance', ...arguments);
            this.mdDialogManager.alert({
                message: helpText,
                title: 'Liabilities Help',
                showTopBar: true,
                showActionBar: true,
                buttonLabel: 'OK'
            });
        }
    }
});