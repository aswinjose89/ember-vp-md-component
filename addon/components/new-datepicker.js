import Ember from 'ember';
import layout from '../templates/components/new-datepicker';

export default Ember.Component.extend({
    layout,
    classNames: ['global-datepicker'],
    startDate: null,
    endDate: null,
    currentDate: Date.now(),
    initDate: Ember.computed('shownDate', 'selectedDate', 'currentDate', function () {
        return this.get('shownDate') || this.get('selectedDate') || this.get('currentDate');
    }),
    selectedDate: null,
    selectedMonth: Ember.computed('selectedDate', function () {
        if (!Ember.isEmpty(this.get('selectedDate'))) {
            return new Date(this.get('selectedDate')).getMonth();
        }
        return null;
    }),
    selectedYear: Ember.computed('selectedDate', function () {
        if (!Ember.isEmpty(this.get('selectedDate'))) {
            return new Date(this.get('selectedDate')).getFullYear();
        }
        return null;
    }),
    selectedDay: Ember.computed('selectedDate', function () {
        if (!Ember.isEmpty(this.get('selectedDate'))) {
            return new Date(this.get('selectedDate')).getDate();
        }
        return false;
    }),
    shownDate: null,
    currentLocal: 'en',
    shownYear: Ember.computed('initDate', function () {
        return new Date(this.get('initDate')).getFullYear();
    }),
    shownMonth: Ember.computed('initDate', function () {
        return new Date(this.get('initDate')).getMonth();
    }),
    shownDay: Ember.computed('initDate', function () {
        return new Date(this.get('initDate')).getDate();
    }),
    locales: {
        en: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
    },
    dateView: true,
    monthView: false,
    yearsView: false,
    days: Ember.computed('initDate', function () {
        return this.setupDays();
    }),
    years: Ember.computed('initDate', function () {
        return this.setupYears();
    }),
    isFirstMonth: Ember.computed('initDate', function () {
        let currentDate = new Date(this.get('initDate')),
            monthNumber = currentDate.getMonth();
        if (monthNumber === 0) {
            return true;
        }
        return false;
    }),
    isLastMonth: Ember.computed('initDate', function () {
        let currentDate = new Date(this.get('initDate')),
            monthNumber = currentDate.getMonth();
        if (monthNumber === 11) {
            return true;
        }
        return false;
    }),
    init() {
        this._super(...arguments);
    },
    getDayCount(year, month) {
        let days = new Date(year, month + 1, 0);
        return days.getDate();
    },
    setupYears() {
        let currentDate = new Date(this.get('initDate')),
            startDate = new Date(this.get('startDate') || '1900, 1, 1'),
            endDate = new Date(this.get('endDate') || '2100, 12'),
            startYear = startDate.getFullYear(),
            endYear = endDate.getFullYear(),
            initYear = currentDate.getFullYear(),
            years = [];
        for (let i = startYear; i <= endYear; i++) {

            years.push(i);
        }
        return years;
    },
    setupDays() {
        let currentDate = new Date(this.get('initDate')),
            monthNumber = currentDate.getMonth(),
            currentYear = currentDate.getFullYear(),
            dayNumber = (new Date(currentYear, monthNumber, 1)).getDay(),
            daysArray = [],
            thisMonthDays = this.getDayCount(currentYear, currentDate.getMonth()),
            prevMonthDays,
            nextMonthDays,
            date,
            selectedYear = this.get('selectedYear'),
            selectedMonth = this.get('selectedMonth'),
            selectedDay = this.get('selectedDay'),
            lastMonth = this.get('isLastMonth'),
            firstMonth = this.get('isFirstMonth');

        if (firstMonth) {
            prevMonthDays = this.getDayCount(currentYear - 1, 11);
        } else {
            prevMonthDays = this.getDayCount(currentYear, monthNumber - 1);
        }
        if (lastMonth) {
            nextMonthDays = this.getDayCount(currentYear + 1, 0);
        } else {
            nextMonthDays = this.getDayCount(currentYear, monthNumber + 1);
        }
        if (dayNumber !== 1) {
            let limit = prevMonthDays - dayNumber;
            do {
                limit++;
                date = {
                    number: limit,
                    isDisable: true
                };
                daysArray.push(date);
            }
            while (limit < prevMonthDays);
        }
        for (let i = 1; i <= thisMonthDays; i++) {
            date = {
                number: i,
                isDisable: false
            };
            if (selectedDay === i && this.get('selectedDate')) {
                date.isCurrent = true;
            }
            daysArray.push(date);
        }
        if (dayNumber + thisMonthDays < 35) {
            let i = 0,
                total = dayNumber + thisMonthDays;
            do {
                total++;
                i++;
                date = {
                    number: i,
                    isDisable: true
                };
                daysArray.push(date);
            }
            while (total < 35);
        }
        return daysArray;

    },
    actions: {
        selectDay(year, month, day) {
            let selectedMonth = month + 1,
                selectDate = new Date(`${year}, ${selectedMonth}, ${day}`);
            if (selectDate) {
                this.set('selectedDate', selectDate);
            }
        },
        selectMonth(year, month) {
            let selectedMonth = month + 1,
                selecDay = this.get('selectedDay') || 1,
                shownDate = new Date(`${year}, ${selectedMonth}, 1`);
            if (shownDate) {
                if (selecDay) {
                    this.set('selectedDate', shownDate);
                } else {
                    this.set('shownDate', shownDate);
                }
                this.send('showDays');
            }
        },
        selectYear(year) {
            let shownDate = new Date(`${year}`);
            if (shownDate) {
                this.set('shownDate', shownDate);
                this.send('showMonth');
            }
        },
        showDays() {
            this.set('dateView', true);
            this.set('monthView', false);
            this.set('yearsView', false);
        },
        showMonth() {
            this.set('dateView', false);
            this.set('monthView', true);
            this.set('yearsView', false);
        },
        showYears() {
            this.set('dateView', false);
            this.set('monthView', false);
            this.set('yearsView', true);
        },
        yearClick() {
            let dayView = this.get('dateView'),
                monthView = this.get('monthView'),
                yearsView = this.get('yearsView');
            if (dayView) {
                this.send('showMonth');
            } else if (monthView) {
                this.send('showYears');
            }
        },
        prevMonth(year, month) {
            let newMonth = month - 1;
            this.send('selectMonth', year, newMonth);
        },
        nextMonth(year, month) {
            let newMonth = month + 1;
            this.send('selectMonth', year, newMonth);
        }
    }
});
