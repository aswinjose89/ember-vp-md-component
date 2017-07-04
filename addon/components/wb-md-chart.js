import Ember from 'ember';
import layout from '../templates/components/wb-md-chart';
const {
    computed,
    run
} = Ember;

export default Ember.Component.extend({
    layout,
    classNames: ["chart-container"],
    defaultOptions: Ember.Object.create({
        chart: {
            type: 'column'
        },
        title: 'Column Chart',
        colors: ["#5D97ED", "#CE8589", "#5FE1C2", "#4B4B4B", "#ECBE41", "#75AD5B", "#E06E2C"],
        credits: {
            enabled: false
        }
    }),
    total: 0,
    init() {
        this._super(...arguments);
        this.mergeOptions();
    },
    chartType: computed('config', {
        get() {
            return this.get('config.chart.type');
        }
    }),
    mergeOptions() {
        this.set('chartOptions', '');
        if (typeof this.get("config") === "object" && typeof this.get("series") === "object") {
            this.set('chartOptions', Object.assign({}, this.get("defaultOptions"), this.get("config"), {
                series: this.get("series")
            }));
        }
        if (this.get('chartType') === 'timeline') {
            this.get('computeAttrs');
        }
    },
    computeAttrs: computed('series.@each', function () {
        this.set('total', this.get('series').reduce((sumValue, val) => {
            return sumValue + val.get('data');
        }, 0));
        this.get('series').forEach((item, index) => {
            item.set('color', this.get('chartOptions.colors')[index]);
            item.set('width', Math.round(item.get('data') / this.get('total') * 100));
        });
    }),
    didInsertElement() {
        this._super(...arguments);
        run.scheduleOnce('afterRender', this, () => {
            this.draw(this.get("chartOptions"));
        });
    },
    willUpdate() {
        this.destroyChart();
        this.mergeOptions();
        this.draw(this.get("chartOptions"));
    },
    draw(config) {
        if (config && this.get('chartType') !== 'timeline') {
            this.$().highcharts(config);
        }
    },
    willDestroyElement() {
        this._super(...arguments);
        this.destroyChart();
    },
    destroyChart() {
        if (this.$() && this.get('chartType') !== 'timeline') {
            this.$().highcharts().destroy();
        }
    },
    actions: {
        barClick(item) {
            if (this.get('chartOptions.onClick') && typeof this.get('chartOptions.onClick') === 'function') {
                this.get('chartOptions.onClick')(item);
            }
        },
        legendClick(item) {
            if (this.get('chartOptions.legend.legendItemClick') && typeof this.get('chartOptions.legend.legendItemClick') === 'function') {
                this.get('chartOptions.legend.legendItemClick')(item);
            }
        }
    }
});