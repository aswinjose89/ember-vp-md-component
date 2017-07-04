import Ember from 'ember';
const { computed, K } = Ember;
const bound = function (fnName) {
    return computed(fnName, function () {
        return this.get(fnName).bind(this);
    });
};

export default Ember.Mixin.create({
    isMaterialContentArea: true,
    hideGlobalToolbar: true,
    tempMaterialParam: null,
    getMaterial(route) {
        let routeArray = route.split('.'),
            routeLength = routeArray.length;
        for (let i = routeLength; i > 0; i--) {
            let testRoute = routeArray.slice(0, i).join('.');
            let isMaterialDesignLayout = Ember.getOwner(this).lookup(`route:${testRoute}`).get('isMaterialDesignLayout'),
                isMaterialContentArea = Ember.getOwner(this).lookup(`route:${testRoute}`).get('isMaterialContentArea');
            if (isMaterialDesignLayout || isMaterialContentArea) {
                return testRoute;
            }
        }
        return false;
    },
    updateApplicationProperty(property, value) {
        var applicationController = Ember.getOwner(this).lookup('controller:application');
        applicationController.set(property, value);
    },
    setPropertiesOnTransition() {
        let isMaterialDesignLayout = false,
            isMaterialContentArea = false,
            isMDFluidLayout = false,
            showMDToggleSideBar = false,
            applicationController = Ember.getOwner(this).lookup('controller:application');
        if (!Ember.isEmpty(applicationController.get('tempMaterialParam'))) {
            let materialRoute = applicationController.get('tempMaterialParam');
            isMaterialDesignLayout = materialRoute.get('isMaterialDesignLayout');
            isMaterialContentArea = materialRoute.get('isMaterialContentArea');
            isMDFluidLayout = materialRoute.get('isMDFluidLayout');
            showMDToggleSideBar = materialRoute.get('showMDToggleSideBar');
        }
        applicationController.setProperties({
            isMaterialDesignLayout: isMaterialDesignLayout,
            isMaterialContentArea: isMaterialContentArea,
            isMDFluidLayout: isMDFluidLayout,
            showMDToggleSideBar: showMDToggleSideBar
        });
    },
    nullScrollPosition() {
        let main = document.querySelector('.page__container-scroll'),
            header = document.querySelector('.header');
        if (main) {
            if (header) {
                if (main.scrollHeight > 0 && header.classList.contains('header_short')) {
                    main.scrollTop = 1;
                } else {
                    main.scrollTop = 0;
                }
            } else {
                main.scrollTop = 0;
            }
        }
    },
    headerToggleOnScroll() {
        let main = document.querySelector('.page__container-scroll'),
            header = document.querySelector('.header');
        if (main && header) {
            main.addEventListener('scroll', function () {
                let mainFullHeight = main.scrollHeight,
                    mainVisibleHeight = main.offsetHeight,
                    headerOpenOffset = 80;
                if (mainFullHeight > (mainVisibleHeight + headerOpenOffset) && this.scrollTop > 0) {
                    header.classList.add('header_short');
                } else if (this.scrollTop === 0) {
                    header.classList.remove('header_short');
                }

            });
            window.addEventListener('resize', function () {
                if (main.scrollTop === 1) {
                    header.classList.remove('header_short');
                }
            });
        }
    },
    tabFixListener: bound('tabFixHandler'),
    tabFixHandler(e) {
        if (Ember.isEmpty(e) || e.target === document) {
            return;
        }
        if (e.target.classList.contains('page__container-limiter')) {
            e.target.scrollLeft = 0;
        }
    },
    setupTabFix: Ember.computed('showMDToggleSideBar', 'isMDLayoutFullWidth', {
        get() {
            let showMDToggleSideBar = this.get('showMDToggleSideBar'),
                isMDLayoutFullWidth = this.get('isMDLayoutFullWidth');
            if (showMDToggleSideBar || !isMDLayoutFullWidth) {
                window.addEventListener('scroll', this.get('tabFixListener'), true);
            } else {
                window.removeEventListener('scroll', this.get('tabFixListener'), true);
            }
        }
    }),
    setupOnActivate: Ember.on('activate', function () {
        this.setPropertiesOnTransition();
        this.get('setupTabFix');
    }),
    setupOnDeactivte: Ember.on('deactivate', function () {
        this.setPropertiesOnTransition();
        this.get('setupTabFix');
    }),
    actions: {
        didTransition() {
            this._super(...arguments);
            let applicationController = Ember.getOwner(this).lookup('controller:application'),
                isMaterialDesignLayout = this.get('isMaterialDesignLayout');
            applicationController.set('isMaterialDesignLayout', isMaterialDesignLayout);
            applicationController.set('hideGlobalToolbar', this.get('hideGlobalToolbar'));
            applicationController.set('applicationModuleName', this.get('applicationModuleName'));
            applicationController.set('isMaterialContentArea', !isMaterialDesignLayout);
            applicationController.set('isMDLayoutFullWidth', this.get('isMDLayoutFullWidth'));
            applicationController.set('isMDFluidLayout', this.get('isMDFluidLayout'));
            applicationController.set('showMDToggleSideBar', this.get('showMDToggleSideBar'));
            Ember.run.schedule('afterRender', this, function () {
                /* Handle static info auto scroll */
                this.nullScrollPosition();
                this.headerToggleOnScroll();
            });
            return true;
        },
        willTransition(transition) {
            this._super(...arguments);
            let materialRoute = this.getMaterial(transition.targetName);
            if (materialRoute) {
                this.updateApplicationProperty('tempMaterialParam', Ember.getOwner(this).lookup(`route:${materialRoute}`));
            } else {
                this.updateApplicationProperty('tempMaterialParam', null);
            }
            /* Sets the value to false, if not defined in the entering route */
            return true;
        }
    }
});