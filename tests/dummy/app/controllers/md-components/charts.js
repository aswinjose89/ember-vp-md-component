import Ember from 'ember';

export default Ember.Controller.extend({
    getChartType: Ember.observer("buttonTabsContentIndex", function(){
        var type = "column", stacking = null;
        if(this.get("buttonTabsContentIndex") === 1){
            type = "column";
            stacking = "normal";
        }
        else if(this.get("buttonTabsContentIndex") === 2){
            type = "bar";
            stacking = null;
        }
        this.set("columnChart.options.chart.type", type);
        this.set("columnChart.options.plotOptions.series.stacking", stacking);
    }),
    getRandomNumber(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },
    actions:{
        changeChartType(item){
            var type = "column";
            if(item === 1){
                type = "bar";
            }
            else if(item === 2){
                type = "normal";
            }
            this.set("columnChart.options.plotOptions.series.stacking", type);

        },
        updateData(){
            // this.set('columnChart.series',[{
            //     name: "Feedback",
            //     data: [10, 3, 6, 7, 2, 6, 4, 3, 0]
            // }, {
            //     name: "Compliment",
            //     data: [2, 2, 3, 2, 1, 6, 8, 1, 9]
            // }, {
            //     name: "Request",
            //     data: [3, 4, 9, 1, 5, 6, 2, 10, 0]
            // }, {
            //     name: "Enquiry",
            //     data: [3, 9, 11, 9, 5, 6, 8, 1, 3]
            // }, {
            //     name: "Complaint",
            //     data: [1, 4, 4, 0, 2, 6, 1, 9, 2]
            // }, {
            //     name: "Error",
            //     data: [3, 2, 1, 6, 2, 8, 2, 3, 9]
            // }])
            this.set('timeLine.series',Ember.A([
            Ember.Object.create({
                name: "High Priority",
                data: 5
            }), Ember.Object.create({
                name: "Medium Priority",
                data: 10
            }), Ember.Object.create({
                name: "Low Priority",
                data: 1
            }), Ember.Object.create({
                name: "NA",
                data: 2
            })]))
        }
    }
});
