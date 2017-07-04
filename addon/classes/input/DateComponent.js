import Ember from 'ember';

export default Ember.Object.create({
    classNameBindings: ['isInputRow:input-row_datepicker'],
    isInputRow: true,
    showOnTop: false,
    datepicker: null,
    dateValue: null,
    isDatePicker: true,
    isActive: false,
    dropdownPosition: null,
    dateView: 'days',
    didDateChange: Ember.observer('dateValue', function () {
        let inputDate = Date.parse(this.get('dateValue'));
        if (!Ember.isEmpty(inputDate) && !isNaN(inputDate)) {
            this.set('value', inputDate);
            Ember.tryInvoke(this, 'validate');
        } else {
            this.set('value', null);
        }
    }),
    didSettingChange: Ember.observer('showDays', 'startDate', 'endDate', 'dateView', function () {
        if (this.get('isActive')) {
            this.clickOutside();
        }
    }),
    didInputDateChange: Ember.observer('value', function () {
        this.clickOutside();
        if (Ember.isEmpty(this.get('value'))) {
            this.set('dateValue', null);
            Ember.tryInvoke(this, 'validate');
        } else {
            this.initDate();
        }

    }),
    focusIn() {
        return true;
    },
    triggerFocusOut() {
        Ember.tryInvoke(this, 'validate');
    },
    initDate() {
        if (!Ember.isEmpty(this.get('value'))) {
            let date = new Date(parseInt(this.get('value'))),
                formatDate;
            if (this.get('showDays')) {
                formatDate = ("0" + date.getDate().toString()).substr(-2) + " " + (date.toString()).substr(4, 3) + " " + (date.getFullYear().toString());
            } else {
                formatDate = (date.toString()).substr(4, 3) + " " + (date.getFullYear().toString());
            }
            this.set('dateValue', formatDate);
        }
    },
    setDropdownPosition() {
        let element = this.get('element'),
            dropDownReference = element.querySelector('.input-row__element') || element,
            dropDownElement = document.getElementById(`${this.get('elementId')}-dropdown`);
        if (dropDownReference && dropDownElement) {
            let position = dropDownReference.getBoundingClientRect(),
                left = position.left,
                dropdownHeight = dropDownElement.clientHeight,
                dropdownWidth = dropDownElement.clientWidth,
                totalHeight = position.bottom + dropdownHeight,
                top;
            //first time setup
            if (Ember.isEmpty(this.get('modalAnimationTop')) || Ember.isEmpty('modalAnimationBottom')) {
                if (totalHeight > window.innerHeight) {
                    this.set('modalAnimationTop', true);
                    this.set('modalAnimationBottom', false);
                } else {
                    this.set('modalAnimationBottom', true);
                    this.set('modalAnimationTop', false);
                }
            }
            if (left + dropdownWidth > window.innerWidth) {
                left = window.innerWidth - dropdownWidth;
            }
            //set position based on setup
            if (this.get('modalAnimationTop')) {
                top = position.top - dropdownHeight;
            }
            if (this.get('modalAnimationBottom')) {
                top = position.top + position.height;
            }
            dropDownElement.style.cssText = `left: ${left}px; top: ${top}px;`;
        }
    },
    handleScroll(e) {
        let target = e.target,
            element = this.get('element');
        if (element.getBoundingClientRect().top < target.getBoundingClientRect().top) {
            this.clickOutside();
        }
        this.setDropdownPosition();

    },
    setupDatePicker() {
        let dropDown = document.getElementById(`${this.get('elementId')}-dropdown`) || this.get('element'),
            datepicker = dropDown.querySelector('.pickmeup_wrap');
        if (dropDown) {
            this.set('datepicker', datepicker);
            let min = new Date(parseInt(this.get('startDate'))),
                max = new Date(parseInt(this.get('endDate'))),
                showDays = Ember.isEmpty(this.get('showDays')) ? true : this.get('showDays'),
                view = this.get('dateView');
            window.pickmeup(this.get('datepicker'), {
                format: showDays ? "d b Y" : "b Y",
                flat: true,
                min: min,
                max: max,
                select_day: showDays,
                view: view
            });
            if (!Ember.isEmpty(this.get('dateValue'))) {
                pickmeup(this.get('datepicker')).set_date(this.get('dateValue'));
            }
            this.get('datepicker').addEventListener('pickmeup-change', function (e) {
                this.set('dateValue', e.detail.formatted_date);
                this.set('isActive', false);
                Ember.run.debounce(this, this.triggerOnChangeAction, 200);
            }.bind(this));
            if (!this.get('modalInside')) {
                this.setDropdownPosition();
            }
        }
    },
    triggerOnChangeAction() {
        this.wbActionHandler('onChange', [this.get('value'), this.get('elementId')]);
    },
    clickOutside() {
        Ember.run.next(() => {
            if (this.get('isActive') && !this.get('isDestroying')) {
                if (window.pickmeup(this.get('datepicker'))) {
                    window.pickmeup(this.get('datepicker')).destroy();
                }
                this.set('modalAnimationTop', null);
                this.set('modalAnimationBottom', null);
                Ember.tryInvoke(this, 'validate');
                this.set('isActive', false);
            }
        });
    },
    didRender() {
        if (!this.get('isDestroying')) {
            Ember.tryInvoke(this, 'checkForHelpTextOverflow');
        }
        if (this.get('isActive')) {
            this.setupDatePicker();
        }
    },
    keyPress() {
        return false;
    },
    actions: {
        setOpen() {
            this.toggleProperty('isActive');
        },
        clearDate(e) {
            e.stopPropagation();
            this.set('dateValue', null);
            this.triggerOnChangeAction();
            this.wbActionHandler('onClearDate', [this.get('dateValue'), this.get('label'), this.get('elementId')]);
        }
    }
});