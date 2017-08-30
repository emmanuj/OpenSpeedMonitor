//= require /bower_components/d3/d3.min.js
"use strict";

var OpenSpeedMonitor = OpenSpeedMonitor || {};
OpenSpeedMonitor.ChartModules = OpenSpeedMonitor.ChartModules || {};

OpenSpeedMonitor.ChartModules.JobGroupAggregationData = (function (svgSelection) {
    var svg = svgSelection;
    var sideLabelData = [];
    var rawSeries = [];
    var orderedSeries = [];
    var activeFilter = "desc";
    var headerText = "";
    var i18n = {};
    var chartSideLabelsWidth = 200;
    var chartBarsWidth = 700;
    var chartBarsHeight = 400;
    var fullWidth = chartSideLabelsWidth + chartBarsWidth;
    var autoWidth = true;
    var labelList = [];

    var setData = function (data) {
        activeFilter = data.activeFilter || activeFilter;
        rawSeries = data.series || rawSeries;
        orderedSeries = orderData(rawSeries) || orderedSeries;
        i18n = data.i18nMap || i18n;
        labelList = !orderedSeries ? labelList : [];
        if (orderedSeries) {
            orderedSeries.groupData.forEach(function(element) {
                labelList.push({
                    jobGroup: element.jobGroup,
                    measurand: rawSeries.measurand
                });
            });
        }

        var chartLabelUtils = OpenSpeedMonitor.ChartModules.ChartLabelUtil(labelList, data.i18nMap);
        headerText = chartLabelUtils.getCommonLabelParts(false);
        sideLabelData = chartLabelUtils.getSeriesWithShortestUniqueLabels(true).map(function (s) { return s.label;});
        fullWidth = autoWidth ? getActualSvgWidth() : fullWidth;
        chartSideLabelsWidth = d3.max(OpenSpeedMonitor.ChartComponents.utility.getTextWidths(svg, sideLabelData));
        chartBarsWidth = fullWidth - OpenSpeedMonitor.ChartModules.JobGroupAggregationData.ComponentMargin - chartSideLabelsWidth;
        chartBarsHeight = calculateChartBarsHeight();
    };

    var getDataForHeader = function () {
        return {
            width: fullWidth,
            text: headerText
        };
    };

    var getDataForBarScore = function () {
        var minVal = 0;
        var maxVal = 0;
        if(rawSeries.measurandGroup === "LOAD_TIMES") {
            var extent = d3.extent(rawSeries.groupData, function(entry) { return entry.value; });
            minVal = Math.min(extent[0], 0);
            maxVal = Math.max(extent[1], 0);
        }
        return {
            width: chartBarsWidth,
            min: minVal,
            max: maxVal
        };
    };

    var getDataForSideLabels = function () {
        return {
            height: chartBarsHeight,
            labels: sideLabelData
        };
    };

    var getDataForBars = function () {
        var extent = d3.extent(rawSeries.groupData, function(entry) { return entry.value; });
        return {
            values: getMappedValues(rawSeries),
            min: Math.min(extent[0], 0),
            max: Math.max(extent[1], 0),
            height: chartBarsHeight,
            width: chartBarsWidth
        }
    };

    var orderData = function (unorderedSeries) {
        var compareFunction = (activeFilter === "asc") ? d3.ascending : d3.descending;
        unorderedSeries.groupData.sort(function (a,b) {
            return compareFunction(a.value, b.value);
        })
        return unorderedSeries;
    };

    var getMappedValues = function(rawValues) {
        var mappedValues = [];
        rawValues.groupData.forEach(function (series){
            var mappedSeries = {};
            mappedSeries.id = series.jobGroup;
            mappedSeries.value = series.value;
            mappedSeries.unit = rawValues.unit;
            mappedValues.push(mappedSeries);
        });
        return mappedValues;
    };

    var getActualSvgWidth = function() {
        return svg.node().getBoundingClientRect().width;
    };

    var hasLoadTimes = function () {
        return rawSeries.measurandGroup === "LOAD_TIMES";
    };

    var getChartBarsHeight = function () {
        return chartBarsHeight;
    };

    var getChartSideLabelsWidth = function () {
        return chartSideLabelsWidth;
    };

    var needsAutoResize = function () {
        return autoWidth && (Math.abs(getActualSvgWidth() - fullWidth) >= 1);
    };

    var calculateChartBarsHeight = function () {
        var barBand = OpenSpeedMonitor.ChartComponents.ChartBars.BarBand;
        var barGap = OpenSpeedMonitor.ChartComponents.ChartBars.BarGap;
        var numberOfBars = rawSeries.groupData.length;
        return ((numberOfBars - 1) * barGap) + numberOfBars * barBand;
    };

    return {
        setData: setData,
        getDataForHeader: getDataForHeader,
        getDataForBarScore: getDataForBarScore,
        getDataForSideLabels: getDataForSideLabels,
        getDataForBars: getDataForBars,
        hasLoadTimes: hasLoadTimes,
        needsAutoResize: needsAutoResize,
        getChartBarsHeight: getChartBarsHeight,
        getChartSideLabelsWidth: getChartSideLabelsWidth
    }
});
OpenSpeedMonitor.ChartModules.JobGroupAggregationData.ComponentMargin = 15;
