import Ember from 'ember';

export default Ember.Mixin.create({
    init() {
        this._super(...arguments);
    },
    headerToggleOnScroll() {
        let main = document.querySelectorAll('.page__main')[0],
            header = document.querySelectorAll('.header')[0];
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
    actions: {
        willTransition: function () {
            this._super(...arguments);
            let main = document.querySelectorAll('.page__main')[0],
                header = document.querySelectorAll('.header')[0];
            if (main && header) {
                if (main.scrollHeight > 0 && header.classList.contains('header_short')) {
                    main.scrollTop = 1;
                } else {
                    main.scrollTop = 0;
                }
            }
        }
    }
});