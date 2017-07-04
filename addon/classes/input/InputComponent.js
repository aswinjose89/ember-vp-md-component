import Ember from 'ember';

export default Ember.Object.create({
    iconPosition: 'left',
    isActive: false,
    classNameBindings: ['isError:input-row_status_error'],
    didRender() {
        if (!this.get('isDestroying')) {
            Ember.tryInvoke(this, 'checkForHelpTextOverflow');
            if (this.get('multiline')) {
                this.calculateInputLength();
            }
        }
    },
    initInput() {
        if (this.get('isFormatted')) {
            this.set('formattedValue', this.get('value'));
            if (Ember.isPresent(this.get('value')) && this.get('type') === 'number') {
                this.set('valueName', 'formattedValue');
                if (!this.get('disableDecimal')) {
                    this.handleDecimalPrecision();
                } else if (this.get('isFormatted')) {
                    this.handleFormatting('formattedValue');
                }
            }
        }
    },
    /**
     * On user input the fixSearchInputWidth method is invoked to calculate the width of HTML input
     * @method input
     * @param {event} The event object emitted from the element
     * @return {}. this method does not return any value
     */
    input() {
        if (this.get('multiline')) {
            this.calculateInputLength();
        }

        if (!this.get('isSearchable')) {
            let formattedValue = (this.get('isFormatted')) ? 'formattedValue' : 'value',
                value = this.get(formattedValue);
            if (Ember.isPresent(value) && this.get('isNegative') && value.toString().lastIndexOf('-') > 0) {
                let i = 0;
                this.set(formattedValue, this.get(formattedValue).replace(/-/g, function (match) {
                    return ++i > 1 ? "" : match;
                }));
            }
            this.validateInputValue(this.get(formattedValue), formattedValue);
        }
        if (Ember.isPresent(this.get('value'))) {
            this.isRequiredValidationPassed();
        }
        return true;
    },
    keyDown() {
        this.set('previousValue', this.get('value'));
        return true;
    },
    handleMaxValue(valueName) {
        let maxValue = this.get('max'),
            value = this.get(valueName);
        if (this.get('type') !== 'number' || Ember.isEmpty(maxValue)) {
            return;
        }
        if (value.indexOf('-') >= 0) {
            value = value.replace('-', '');
        }
        if (maxValue < value) {
            if (Ember.isEmpty(this.get('previousValue'))) {
                this.set(valueName, maxValue);
            } else {
                this.set(valueName, this.get('previousValue'));
            }
        }
    },
    handleInputPattern(valueName) {
        if (Ember.isPresent(this.get('validationPattern'))) {
            try {
                let regexp = new RegExp(this.get('validationPattern')),
                    replacedValue = this.get(valueName).match(regexp);
                this.set(valueName, replacedValue.join());
            } catch (error) {
                Ember.Logger.error(error);
            }
        }
    },
    calculateInputLength() {
        let calculatedLength = this.getTextCount(this.get('value'));
        this.set('textCount', calculatedLength);
        this.elasticHeight();
    },
    getTextCount(value) {
        let adjustedValue = this.adjustLineBreak(value);
        if (Ember.isEmpty(adjustedValue)) {
            return 0;
        } else {
            adjustedValue = this.handleMaxLength(adjustedValue);
            this.set('value', adjustedValue);
        }
        return Ember.getWithDefault(adjustedValue, 'length', 0);
    },
    elasticHeight() {
        let element = this.get('element').querySelectorAll('textarea')[0];
        element.setAttribute('rows', '1');
        element.setAttribute('style', 'height: auto');
        element.setAttribute('style', 'height:' + element.scrollHeight + 'px');
    },
    validateInputValue(value, valueName = 'value') {
        let target = event.target,
            originalValueLength = Ember.get(this.get(valueName), 'length'),
            selectionStart = target.selectionStart,
            disableDecimal = this.get('disableDecimal') || (this.get('precision') === 0),
            type = this.get('type');
        originalValueLength = Ember.isPresent(originalValueLength) ? originalValueLength : selectionStart;
        if (value && type === 'number') {
            if (!this.get('isNegative') && disableDecimal && !this.get('numberRegexPattern').test(value)) {
                let replacedValue = value.match(/\d+/g);
                this.set(valueName, (Ember.isEmpty(replacedValue)) ? '' : replacedValue.join(''));
            } else if (this.get('isNegative') && disableDecimal && !this.get('numberRegexPattern').test(value)) {
                let replacedValue = value.match(/-|\d+/g);
                this.set(valueName, (Ember.isEmpty(replacedValue)) ? '' : replacedValue.join(''));
            } else if (!this.get('numericRegexPattern').test(value)) {
                this.validateDecimalValue(value, valueName);
            } else if (!disableDecimal) {
                this.validateDecimalPrecision(valueName);
            } else if (this.get('isNegative') && !this.get('negativeNumberRegexPattern').test(value)) {
                this.validateDecimalValue(value, valueName);
            } else if (!disableDecimal && this.get('isNegative') && !this.get('negativeNumericRegexPattern').test(value)) {
                this.validateDecimalPrecision(valueName);
            }
        }
        if (Ember.isPresent(value)) {
            this.set('valueName', valueName);
            this.handleMaxValue(valueName);
            this.handleInputPattern(valueName);
            if (this.get('isFormatted') && !(this.get('isNegative') && this.get('formattedValue') === '-')) {
                this.handleFormatting(valueName);
            }
        } else if (this.get('isFormatted') && type === 'number') {
            this.set('value', this.get(valueName));
        }
        this.setCursorPosition(target, selectionStart, originalValueLength, valueName);
        return true;
    },
    handleDecimalPrecision() {
        if (Ember.isEmpty(this.get('value'))) {
            return;
        }
        if (this.get('isFormatted') && this.get('valueName')) {
            let valueName = this.get('valueName'),
                nonFormattedValue = this.removeFormatting(this.get(valueName)),
                formattedDecimal = this.formatNumber(nonFormattedValue);
            this.set(valueName, formattedDecimal);
            this.set('value', nonFormattedValue);
        } else {
            let value = this.formatNumber(this.get('value'));
            this.set('value', this.removeFormatting(value));
        }
    },
    handleFormatting(valueName) {
        let value = this.get(valueName),
            nonFormattedValue = this.removeFormatting(value),
            formattedValue = this.formatNumber(nonFormattedValue, false);
        if (Ember.isPresent(value) && this.hasTerminatingDecimal(value) && (value.toString().split('').pop() !== '.')) {
            formattedValue = `${formattedValue}.`;
        }
        this.set(valueName, formattedValue);
        this.set('value', nonFormattedValue);
    },
    //handle terminating decimal input
    hasTerminatingDecimal(value) {
        let decimalMatch = value.toString().match(/\./g);
        return decimalMatch && decimalMatch.length === 1 && (value.toString().split('').pop() === '.');
    },
    setCursorPosition(target, selectionStart, originalValueLength, valueName) {
        if (Ember.isEmpty(this.get(valueName))) {
            return;
        }
        Ember.run.next(this, function () {
            let cursorPosition = selectionStart + Ember.get(this.get(valueName).toString(), 'length') - originalValueLength;
            target.setSelectionRange(cursorPosition, cursorPosition);
        });
    },
    validate() {
        if (this.get('type') === 'select') {
            return false;
        }
        if (this.isRequiredValidationPassed()) {
            let errorMessage = this.validateInput(this.get('value'));
            this.set('componentErrorMessage', errorMessage);
        }
    },
    validateDecimalValue(value, valueName) {
        value = this.get('isNegative') ? value.replace(/(?!^)-|[^0-9\.-]/g, '') : value.replace(/[^0-9\.]/g, '');
        if (value.indexOf('.', value.indexOf('.') + 1) !== -1) {
            value = value.replace(/\./g, function (a, n, str) { return str.indexOf(a) === n ? a : ""; });
        }
        this.set(valueName, value);
    },
    formatNumber(value, isIncludePrecision = true) {
        if (Ember.isEmpty(value) || (this.get('isNegative') && (value === '-') || !(/[1-9]/.test(value)))) {
            return value;
        }
        if (!isIncludePrecision && this.hasTerminatingDecimal(value)) {
            let formattedValue = new Intl.NumberFormat(this.get('numberFormatRegion')).format(value);
            return this.hasTerminatingDecimal(value) ? formattedValue + '.' : value;
        }
        let precision = isIncludePrecision ? this.get('precision') : 0;
        //check if the value has a decimal value or whole number
        if (!isIncludePrecision && value && this.isDecimal(value)) {
            let fractionDigits = /\d*$/.exec(value.toString())[0].length;
            precision = (fractionDigits > this.get('precision')) ? this.get('precision') : fractionDigits;
            value = this.truncate(value, precision);
        }
        return new Intl.NumberFormat(this.get('numberFormatRegion'), {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
        }).format(value);
    },
    isDecimal(value) {
        return !(/^-?[0-9]+$/.test(value.toString()));
    },
    removeFormatting(value) {
        if (Ember.isEmpty(value)) {
            return;
        }
        let unFormattedValue = value.toString().replace(/,/g, '');
        return this.isDecimal(value) ? this.truncate(unFormattedValue, this.get('precision')) : unFormattedValue;
    },
    validateDecimalPrecision(valueName) {
        let value = this.get(valueName),
            precision = this.get('precision');
        if (Ember.isEmpty(precision) || (value.length > 1 && value.toString().split('').pop() === '.') || (this.get('isNegative') && value === '-')) {
            return;
        }
        value = this.removeFormatting(value);
        this.set(valueName, this.truncate(value, precision));
    },
    truncate(num, places) {
        let deciamalParts = String(num).split(".");
        if (num === ".") {
            return '0.';
        }
        if (num === "-.") {
            return '-0.';
        }
        // check for decimal part
        if (num % 1 === 0) {
            return num;
        }
        const newDecimals = deciamalParts[1].slice(0, places),
            newString = `${deciamalParts[0]}.${newDecimals}`;
        return Number(newString).toFixed(newDecimals.length);
    },
    focusIn(event) {
        this.triggerFocusIn(event);
    },
    focusOut() {
        this.triggerFocusOut();
    },
    clickOutside() {
        if (this.get('isSearchable')) {
            this.handleClickOutside();
        }
        this.triggerFocusOut();
    },
    triggerFocusIn(event) {
        if (Ember.isPresent(event) && event.target.tagName === 'A') {
            return true;
        }
        if (!this.get('isActive')) {
            this.handleClickEvent(event, 'input, textarea', this.get('datepicker'));
        }
        return true;
    },
    triggerFocusOut() {
        if (!this.get('disableDecimal') && this.get('type') === 'number') {
            this.handleDecimalPrecision();
        }
        if (this.get('isActive')) {
            this.set('isActive', false);
            this.validate();
        }
    },
    actions: {
        setOpen() {
            this.triggerFocusIn(event);
        },
        innerFocusIn(event) {
            Ember.tryInvoke(this, 'focusIn', [event]);
        },
        innerFocusOut(event) {
            Ember.tryInvoke(this, 'focusOut', [event]);
        }
    }
});