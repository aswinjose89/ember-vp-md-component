import Ember from 'ember';

export default Ember.Object.create({
    isSearch: true,
    classNames: ['input-search'],
    isActive: false,
    placeholder: 'Search',
    focusIn() {
        this.set('isSearchActive', true);
        Ember.tryInvoke(this, 'onFocusIn');
    },
    focusOut() {
        this.set('isSearchActive', false);
        Ember.tryInvoke(this, 'onFocusOut');
    },
    change() {
        Ember.tryInvoke(this, 'onChange');
    },
    input() {
        Ember.tryInvoke(this, 'onInput');
    },
    clickOutside() {
        if (this.get('isSearchActive')) {
            this.set('isSearchActive', false);
        }
    },
    keyDown(e) {
        if (e.keyCode === 9) {
            this.clickOutside();
            Ember.tryInvoke(this, 'onFocusOut');
        }
    },
    handleSearch() {
        let searchKey = this.get('value');
        if (Ember.typeOf(this.get('searchAction')) === 'function') {
            Ember.tryInvoke(this, 'searchAction', [searchKey]);
        } else {
            this.set(this.get('searchAction'), this.get('searchAction'));
            this.sendAction(this.get('searchAction'), searchKey);
        }
    },
    actions: {
        clearSearch() {
            this.set('isSearchActive', true);
            this.set('value', '');
            Ember.tryInvoke(this, 'onClear');
        },
        triggerSearch() {
            if (Ember.isPresent(this.get('searchAction')) && (this.get('value.length') >= this.get('minimumInputLength'))) {
                Ember.run.debounce(this, this.handleSearch, this.get('debounceTime'));
            }
        }
    }
});