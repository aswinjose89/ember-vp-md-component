import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super(...arguments);
        controller.set('staticInfoConfig', this.getStaticInfoConfig());
        controller.set('staticInfoComponentConfig', this.getStaticInfoComponentConfig());
        controller.set('staticInfoListConfig', this.getStaticInfoListConfig());
        controller.set('staticInfoLongTextConfig', this.getStaticInfoLongTextConfig());
        controller.set('staticInfoPreTextConfig', this.getStaticInfoPreTextConfig());
        controller.set('staticInfoListLimitConfig', this.getStaticInfoListLimitConfig());
    },
    getStaticInfoConfig() {
        return {
            value: 'Some very old ',
            size: 'medium',
            iconName: 'airline_seat_recline_normal',
            label: 'Static info value'
        };
    },
    getStaticInfoComponentConfig() {
        return {
            size: 'small',
            label: 'Show component',
            component: {
                name: 'wb-md-tag',
                config: {
                    label: 'test tag',
                    circle: 'orange'
                }
            }
        };
    },
    getStaticInfoListConfig() {
        return {
            iconName: 'people',
            label: 'Show list',
            size: 'small',
            list: [
                '1533593 - Joseph Stevenson - Joseph Stevenson - Joseph Stevenson - Joseph Stevenson - Joseph Stevenson',
                '1309881 - Victoria Chavez',
                '<a href="mailto:info@info.com" title="Mail to">info@info.com</a>'
            ]
        };
    },
    getStaticInfoLongTextConfig() {
        return {
            iconName: 'people',
            label: 'Show long text',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a sapien sed dui egestas lobortis. Sed viverra, risus vitae lacinia eleifend, enim quam luctus turpis, sit amet tincidunt ligula est at metus. Donec lectus ipsum, iaculis sodales elementum at, ullamcorper vitae odio. Pellentesque eu pellentesque nunc. Cras leo felis, pretium at aliquam sed, euismod a ligula. Etiam iaculis bibendum lacus, tempus commodo urna laoreet vitae. Nullam dapibus lacus id neque elementum, vel gravida lectus aliquam. Suspendisse justo augue, finibus nec mauris a, tincidunt facilisis dolor. Pellentesque at nulla eget ex bibendum tempus. Nulla at aliquet sem. Vivamus vestibulum mi sit amet nunc semper ornare. Etiam pellentesque, lacus in fringilla luctus, enim sem bibendum dolor, in suscipit augue nisi in neque. Sed aliquet nisi sed luctus auctor. Cras hendrerit lorem euismod, pellentesque metus at, consectetur ligula. Pellentesque placerat vulputate mauris, ut eleifend dui malesuada et. Etiam fermentum elit in felis lacinia, fermentum condimentum sem ultricies. Nam vel ante dapibus, vulputate ipsum non, lacinia magna. Praesent sed viverra augue, in feugiat nulla. Pellentesque sollicitudin metus ac finibus interdum. Phasellus non tincidunt nunc. Proin interdum ligula at placerat porta. Phasellus et lacinia nisi. Integer vel mi odio. Ut at justo dictum, ullamcorper lorem in, ultricies tellus. Vestibulum vitae nibh dui. Cras turpis justo, hendrerit in diam ut, fermentum tincidunt ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas at aliquet ligula. Nam tincidunt tincidunt ex id blandit. In laoreet magna eget iaculis lobortis. Nulla accumsan ligula in accumsan bibendum. Sed ut imperdiet nisi. Curabitur eu est venenatis, ultrices leo a, euismod tortor. Praesent a augue eu massa varius vehicula. Cras ut arcu non velit congue volutpat non in eros. Nullam sed pellentesque metus.',
            showMore: true
        };
    },
    getStaticInfoPreTextConfig() {
        return {
            iconName: 'people',
            label: 'Show Pre text',
            content: 'Lorem ipsum dolor sit amet,\n consectetur adipiscing elit.\n Sed a sapien sed dui egestas lobortis. Sed viverra, risus vitae lacinia eleifend, enim quam luctus turpis, sit amet tincidunt ligula est at metus. Donec lectus ipsum, iaculis sodales elementum at, ullamcorper vitae odio. Pellentesque eu pellentesque nunc. Cras leo felis, pretium at aliquam sed, euismod a ligula. Etiam iaculis bibendum lacus, tempus commodo urna laoreet vitae. Nullam dapibus lacus id neque elementum, vel gravida lectus aliquam. Suspendisse justo augue, finibus nec mauris a, tincidunt facilisis dolor. Pellentesque at nulla eget ex bibendum tempus. Nulla at aliquet sem. Vivamus vestibulum mi sit amet nunc semper ornare. Etiam pellentesque, lacus in fringilla luctus, enim sem bibendum dolor, in suscipit augue nisi in neque. Sed aliquet nisi sed luctus auctor. Cras hendrerit lorem euismod, pellentesque metus at, consectetur ligula. Pellentesque placerat vulputate mauris, ut eleifend dui malesuada et. Etiam fermentum elit in felis lacinia, fermentum condimentum sem ultricies. Nam vel ante dapibus, vulputate ipsum non, lacinia magna. Praesent sed viverra augue, in feugiat nulla. Pellentesque sollicitudin metus ac finibus interdum. Phasellus non tincidunt nunc. Proin interdum ligula at placerat porta. Phasellus et lacinia nisi. Integer vel mi odio. Ut at justo dictum, ullamcorper lorem in, ultricies tellus. Vestibulum vitae nibh dui. Cras turpis justo, hendrerit in diam ut, fermentum tincidunt ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas at aliquet ligula. Nam tincidunt tincidunt ex id blandit. In laoreet magna eget iaculis lobortis. Nulla accumsan ligula in accumsan bibendum. Sed ut imperdiet nisi. Curabitur eu est venenatis, ultrices leo a, euismod tortor. Praesent a augue eu massa varius vehicula. Cras ut arcu non velit congue volutpat non in eros. Nullam sed pellentesque metus.',
            showMore: true
        };
    },
    getStaticInfoListLimitConfig() {
        return {
            label: 'List with limit',
            listLimit: '1',
            list: [
                '1533593 - Joseph Stevenson',
                '1309881 - Victoria Chavez',
                '1309881 - Victoria Chavez',
                '1309881 - Victoria Chavez',
                '1309881 - Victoria Chavez',
                '1309881 - Victoria Chavez'
            ]
        };
    }
});