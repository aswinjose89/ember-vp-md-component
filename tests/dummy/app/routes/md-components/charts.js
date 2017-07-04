import Ember from 'ember';

export default Ember.Route.extend({
    setupController(controller) {
        this._super.apply(this, arguments);
        controller.setProperties({
            "buttonHeaderContent": Ember.A([
                Ember.Object.create({
                    label: "Grouped Column"
                }),
                Ember.Object.create({
                    label: "Stacked Column"
                })
            ])
        });

        controller.setProperties({
            timeLine: {
                options: {
                    chart: {
                        type: 'timeline'
                    },
                    colors: ["#5D97ED", "#CE8589", "#5FE1C2", "#75AD5B"],
                    isShowTotal: true,
                    legend: {
                        isShow: true,
                        legendItemClick: function (item) {
                            console.log(item);
                        }
                    },
                    onClick: function (item) {
                        console.log(item)
                    }
                },
                series: Ember.A([
                    Ember.Object.create({
                        name: "High Priority",
                        data: 10
                    }), Ember.Object.create({
                        name: "Medium Priority",
                        data: 3
                    }), Ember.Object.create({
                        name: "Low Priority",
                        data: 2
                    })
                ])
            },
            columnChart: {
                options: {
                    chart: {
                        type: "column"
                    },
                    colors: ["#5D97ED", "#CE8589", "#5FE1C2", "#4B4B4B", "#ECBE41", "#75AD5B", "#E06E2C"],
                    title: {
                        text: "Service Requests From Aug'15 to APR'16"
                    },
                    xAxis: {
                        categories: ["AUG'15", "SEP'15", "OCT'15", "NOV'15", "DEC'15", "JAN'16", "FEB'16", "MAR'16", "APR'16"]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Months'
                        },
                        allowDecimals: false,
                        stackLabels: {
                            enabled: true,
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: false
                            },
                            point: {
                                events: {
                                    click: function (item) {
                                        console.log(item);
                                    }
                                }
                            }
                        },
                        column: {
                            borderWidth: 0,
                            pointWidth: 10
                        }
                    },
                    legend: {
                        itemDistance: 70,
                        itemMarginTop: 20
                    }
                },
                series: [{
                    name: "Feedback",
                    data: [5, 3, 4, 7, 2, 6, 4, 3, 0]
                }, {
                    name: "Compliment",
                    data: [2, 2, 3, 2, 1, 6, 8, 1, 9]
                }, {
                    name: "Request",
                    data: [3, 4, 9, 2, 5, 6, 2, 1, 0]
                }, {
                    name: "Enquiry",
                    data: [3, 9, 11, 2, 5, 6, 8, 1, 3]
                }, {
                    name: "Complaint",
                    data: [3, 4, 4, 0, 2, 6, 1, 3, 2]
                }, {
                    name: "Error",
                    data: [3, 2, 1, 6, 2, 1, 2, 3, 9]
                }]
            },
            buttonTabsConfig: {
                "isButton": true,
                "isDeletable": true,
                "tabs": controller.get("buttonHeaderContent")
            },
            "buttonTabsContentIndex": 0
        });
    },
    actions: {

    }
});