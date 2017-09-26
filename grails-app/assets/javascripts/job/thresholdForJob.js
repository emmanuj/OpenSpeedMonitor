
"use strict";

var OpenSpeedMonitor = OpenSpeedMonitor || {};

OpenSpeedMonitor.thresholdforJobs = (function(){
    
    var initVueComponent = function (data) {
        var jobId = data.jobId;
        var scriptId = data.scriptId;

        new Vue({
            el: '#threshold',
            data: {
                thresholds: null,
                measuredEvents: [],
                measurands: [],
                newThreshold: {}
            },
            computed: {
            },
            created: function () {
                this.getMeasurands("/job/getMeasurands")
                this.getMeasuredEvents(scriptId, "/script/getMeasuredEventsForScript")
                this.fetchData()
            },
            methods: {
                fetchData: function () {
                     var self = this;
                     getThresholdsForJob(jobId).success(function(result) {
                         self.thresholds = result;
                     }).error(function(e) {
                         console.log(e);
                     });
                },
                getMeasuredEvents: function (scriptId, targetUrl) {
                    var self = this;
                    if(scriptId && targetUrl){
                        $.ajax({
                            type: 'POST',
                            url: targetUrl,
                            data: { scriptId: scriptId },
                            success : function(result) {
                               self.measuredEvents = result;
                            }
                            ,
                            error : function() {
                                return ""
                            }
                        });
                    }
                },
                getMeasurands: function (targetUrl) {
                    var self = this;
                    if(targetUrl){
                        $.ajax({
                            type: 'POST',
                            url: targetUrl,
                            data: {},
                            success : function(result) {
                                self.measurands = result;
                            }
                            ,
                            error : function() {
                                return ""
                            }
                        });
                    }
                },
                addThreshold: function (job, createThresholdUrl) {
                    this.thresholds.push({
                        measurand: this.newThreshold.measurand,
                        measuredEvent: this.newThreshold.measuredEvent,
                        lowerBoundary: this.newThreshold.lowerBoundary,
                        upperBoundary: this.newThreshold.upperBoundary
                    });
                    this.newThreshold = {};
                    //errorContainer.addClass("hidden");

                    /*$.ajax({
                        type: 'POST',
                        data: {
                            job: job,
                            measurand: measurand,
                            measuredEvent: measuredEvent,
                            lowerBoundary: lowerBoundary,
                            upperBoundary: upperBoundary
                        },
                        url: createThresholdUrl,
                        success: function () {

                            console.log("success");
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });*/
                }
            }
        });
    };

    var getThresholdsForJob = function (jobId) {
        var targetUrl = "/job/getThresholdsForJob";
           return $.ajax({
                type: 'GET',
                url: targetUrl,
                data: { jobId: jobId }
            });
    };

    return{
        initVue: initVueComponent
    }
})();