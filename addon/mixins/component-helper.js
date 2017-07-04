import Ember from 'ember';

export default Ember.Mixin.create({
    lightColors: ['light', 'white'],
    darkColors: ['blue', 'orange', 'dark'],
    primaryColor: 'blue',
    /* Keycode includes backspace, delete, enter and tab*/
    systemKeyCodes: Ember.A([8, 46, 13, 9, 37, 39, 38, 40]),
    numberRegexPattern: /^[0-9]+$|^$/,
    negativeNumberRegexPattern: /^-?[0-9]+$|^$/,
    numericRegexPattern: /^0$|^[1-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/,
    negativeNumericRegexPattern: /^-?0$|^[1-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/,
    isLightColor(color) {
        return this.get('lightColors').includes(color);
    },
    isDarkColor(color) {
        return this.get('darkColors').includes(color);
    },
    /* Focus to input element if clicked on label or wrapper component */
    handleClickEvent(event, elements) {
        event.preventDefault();
        if (this.get('isDisabled') || this.get('isReadOnly')) {
            return false;
        }
        if (event.target !== this.get('element')) {
            let input = this.get('element').querySelectorAll(elements)[0];
            this.set('isActive', true);
            if (Ember.isPresent(input)) {
                Ember.run.next(function () {
                    if (!Ember.isEmpty(input.value)) {
                        input.value = input.value; //trick to set cursor postion after input text
                    }
                    input.focus();
                });
            }
        }
    },
    /*
     Method is to adjust string for line break.
     New line is considered as 2 character by browser,
     But when we do .length the new line is considered as single character
     So to avoid the mix match, we had to do this.
     */
    adjustLineBreak(value) {
        if (!Ember.isEmpty(value)) {
            return value.replace(/\r(?!\n)|\n(?!\r)/g, '\n');
        }
        return value;
    },
    handleMaxLength(value) {
        if (Ember.isPresent(this.get('maxLength')) && Ember.isPresent(value)) {
            return value.substring(0, this.get('maxLength'));
        }
        return value;
    },
    formatTextCount(number) {
        let formatter = new Intl.NumberFormat('ru');
        return formatter.format(number);
    },
    validateInput(value) {
        let errorMessage = '',
            min = this.get('min'),
            max = this.get('max');
        if (this.get('type') === 'number' && Ember.isPresent(value)) {
            value = parseFloat(value);
            if (!isNaN(value)) {
                if (max && max < value) {
                    errorMessage = 'Input is exceeding the allowable value';
                } else if (min && min > value) {
                    errorMessage = 'Input is below the specified value';
                }
            } else {
                errorMessage = 'Input is not a number';
            }
        } else if (this.get('type') === 'text' && Ember.isPresent(value)) {
            value = value.toString();
            if (max < value.length) {
                errorMessage = 'Input is exceeding the allowable value';
            } else if (min > value.length) {
                errorMessage = 'Input is below the specified value';
            }
        } else if (this.get('type') === 'email' && Ember.isPresent(value)) {
            let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            value = value.toString();
            if (!value.match(pattern)) {
                errorMessage = 'Invalid value';
            }
        } else if (this.get('type') === 'select' && !this.get('multiple') && this.get('required')) {
            errorMessage = (this.isSelectedItemPresent(value, this.get('optionValuePath'))) ? '' : this.get('requiredErrorMessage');
        } else if (this.get('type') === 'select' && this.get('required') && Ember.isEmpty(value)) {
            errorMessage = this.get('requiredErrorMessage');
        }
        return errorMessage;
    },
    isRequiredValidationPassed() {
        let value = this.get('value'),
            errorMessage = this.get('requiredErrorMessage');
        if ((Ember.isEmpty(value) || Ember.get(value, 'length') === 0) && this.get('required')) {
            this.set('componentErrorMessage', errorMessage);
            return false;
        }
        this.set('componentErrorMessage', '');
        return true;
    },
    /**
     * The setupConfig takes the config object which has all the config proprties
     * and assign each property to the component
     * All the properties will be available inside the component's scope
     * This method has to be manully invoked at the component initiation time
     * @method setupConfig
     * @param {Object} List of all Config properties, example { label: 'Name', multiple: false}
     * @return {}. this method does not return anything
     */
    setupConfig(config, configParam = 'config') {
        if (Ember.isEmpty(config)) {
            return;
        }
        let configItems = Object.keys(Ember.Object.create(config));
        configItems.forEach((configPropertyKey) => {
            if (!this.attrs.hasOwnProperty(configPropertyKey) && this.isAliasableAttribute(configPropertyKey)) {
                Ember.defineProperty(this, configPropertyKey, Ember.computed.alias(`${configParam}.${configPropertyKey}`));
            }
        });
    },
    isAliasableAttribute(property) {
        return (!['toString'].includes(property) && !['null', 'undefined', 'function', 'error'].includes(Ember.typeOf(property)));
    },
    //TODO: Rewrite using Ember
    addRippleEffect(element) {
        Ember.run.scheduleOnce('afterRender', function () {
            var ripple, d, x, y, parent, timeout;
            parent = Ember.$(element);
            if (parent.find(".global-ripple").length === 0) {
                parent.prepend((parent.hasClass("global-icon") || parent.hasClass("input-checkbox__icon") || parent.hasClass("input-radio__icon")) ? "<div class=\"global-ripple global-ripple_icon\"></div>" : "<div class=\"global-ripple__wrapper\"><div class=\"global-ripple\"></div></div>");
            }
            ripple = parent.find(".global-ripple");
            parent.on('mousedown', function (e) {
                clearTimeout(timeout);
                //incase of quick double clicks stop the previous animation
                ripple.removeClass("global-ripple_animate");
                //set size of .ripple
                //get click coordinates
                //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
                if (!ripple.hasClass('global-ripple_icon')) {
                    if (!ripple.height() && !ripple.width()) {
                        //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
                        d = Math.max(parent.outerWidth(), parent.outerHeight());
                        ripple.css({ height: d, width: d });
                    }

                    x = e.pageX - parent.offset().left - ripple.width() / 2;
                    y = e.pageY - parent.offset().top - ripple.height() / 2;

                    //set the position and add class .animate
                    ripple.css({ top: y + 'px', left: x + 'px' });
                }

                //set the position and add class .animate
                ripple.addClass("global-ripple_animate");
            }).on('mouseup', function () {
                timeout = setTimeout(function () {
                    ripple = parent.find(".global-ripple");
                    ripple.removeClass("global-ripple_animate");
                }, 150);
            });
        });
    },
    defineComputedProperty(propertyName, propertyType, propertyValue) {
        if (propertyType === 'array') {
            Ember.defineProperty(this, propertyName, Ember.computed(function () {
                return Ember.A();
            }));
        } else if (propertyType === 'object') {
            Ember.defineProperty(this, propertyName, Ember.computed(function () {
                return Ember.Object.create();
            }));
        } else {
            Ember.defineProperty(this, propertyName, propertyValue);
        }
    },
    wbActionHandler(actionName, params = []) {
        if (Ember.isEmpty(this.get(actionName))) {
            return;
        }
        if (Ember.typeOf(this.get(actionName)) === 'function') {
            Ember.tryInvoke(this, actionName, params);
        } else {
            this.set(actionName, actionName);
            this.sendAction(actionName, ...params);
        }
    },
    isSelectedItemPresent(item, optionValuePath) {
        if (Ember.isEmpty(item)) {
            return false;
        }
        if (Ember.typeOf(item === 'instance')) {
            return Ember.isPresent(Ember.get(item, optionValuePath)) || Ember.isPresent(Ember.get(item, 'content'));
        } else {
            return Object.keys(item).length > 0;
        }
    },
    setupClassNamesFromProperty(prefix, propertyString) {
        if (Ember.isEmpty(propertyString)) {
            return;
        }
        propertyString = propertyString.split(' ');
        propertyString = propertyString.map(item => {
            return `${prefix}${item}`;
        });
        propertyString = propertyString.join(' ');
        return propertyString;
    },
    actions: {
        triggerWBSendAction() {
            let arg = Array.prototype.slice.call(arguments, 0),
                actionName = arg[0];
            if (Ember.isEmpty(actionName)) {
                return;
            }
            this.set(actionName, actionName);
            this.sendAction(actionName, ...arg.slice(1), event);
        }
    }
});