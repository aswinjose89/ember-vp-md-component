import Ember from 'ember';
import layout from '../templates/components/wb-md-login-box';
import ComponentHelper from '../mixins/component-helper';

export default Ember.Component.extend(ComponentHelper, {
    layout: layout,
    activeSlide: 0,
    carouselInterval: 6000,
    classNames: ['global-login'],
    showWelcomeMessage: true,
    onMaintenance: false,
    maintenanceTitle: `WorkBench is currently unavailable<br>due to Scheduled Maintenance.`,
    maintenanceMessage: `Please be informed that the<br> WorkBench will be unavailable to<br> all users during the following times:`,
    maintenanceStartLabel: `Start time`,
    maintenanceStartTime: null,
    maintenanceEndLabel: `Target End Time`,
    maintenanceEndTime: null,
    nameIsValid: true,
    passwordIsValid: true,
    news: [],
    promise:null,
    init() {
        this._super(...arguments);
        this.setupConfig(this.get('config'));
    },
    showError: Ember.computed('errorMessage', {
        get() {
            return !Ember.isBlank(this.get('errorMessage'));
        }
    }),
    carouselTimer: null,
    setCarouselAuto() {
        this.set('carouselTimer', setInterval(() => {
            this.changeSlide();
        }, this.get('carouselInterval')));
    },
    startCarousel() {
        if (this.get('carouselInterval') > 0) {
            this.setCarouselAuto();
        }
    },
    stopCarousel() {
        clearInterval(this.get('carouselTimer'));
    },
    restartCarousel() {
        this.stopCarousel();
        this.startCarousel();
    },
    updateNewsRedirection() {
      Ember.run.next(this, function() {
        this.$(".global-login__news a").on("click", function (e) {
            e.preventDefault();
        });
      });
    },
    changeSlide() {
        if (this.isDestroyed) {
            return;
        }
        let total,
            current = this.get('activeSlide');
        if (this.get('news')) {
            total = this.get('news.length') - 1;
        }
        if (current === total) {
            this.set('activeSlide', 0);
        } else {
            this.set('activeSlide', ++current);
        }
    },

    newsUpdated: Ember.on('init', Ember.observer('news', function() {
      if (this.get('news.length') > 1) {
          this.updateNewsRedirection();
          this.startCarousel();
      }
    })),

    disableSubmitButton: Ember.computed('nameIsValid', 'passwordIsValid', 'identification', 'password', {
        get() {
            let nameIsValid = !this.get('nameIsValid'),
                passwordIsValid = !this.get('passwordIsValid'),
                nameExist = Ember.isEmpty(this.get('identification')),
                passwordExist = Ember.isEmpty(this.get('password'));
            return nameIsValid || passwordIsValid || nameExist || passwordExist;
        }
    }),
    authPromiseStateChanged: Ember.observer('promise', function () {
        let promise = Ember.get(this, 'promise');
        if (promise && typeof promise.then === 'function') {
            promise
                .then(() => {})
                .catch((error) => {
                    if (!this.isDestroyed) {
                        Ember.Logger.error(`${this.get('label')}, async action:`, error);
                    }
                });
        }
    }),

    actions: {
        isValidName(value) {
            this.set('nameIsValid', value);
        },
        isValidPassword(value) {
            this.set('passwordIsValid', value);
        },
        authenticate(cb) {
            let callbackHandler = (promise) => {
                if (!Ember.isEmpty(cb)) {
                  cb(promise);
                }
                Ember.set(this, 'promise', promise);
            },
            actionArguments = ['action', callbackHandler];
            this.sendAction(...actionArguments);
        },
        changeSlide(index) {
            this.set('activeSlide', index);
            this.restartCarousel();
        },
        closeError() {
            this.set('errorMessage', '');
        },
        closeWelcome() {
            this.set('showWelcomeMessage', false);
        }
    }
});
