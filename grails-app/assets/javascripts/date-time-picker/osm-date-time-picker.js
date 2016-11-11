/* 
* OpenSpeedMonitor (OSM)
* Copyright 2014 iteratec GmbH
* 
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
* 	http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software 
* distributed under the License is distributed on an "AS IS" BASIS, 
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
* See the License for the specific language governing permissions and 
* limitations under the License.
*/

"use strict";

OpenSpeedMonitor = OpenSpeedMonitor || {};

OpenSpeedMonitor.DateTimePicker = function(dateTimePickerElement, autoTime) {
	dateTimePickerElement = $(dateTimePickerElement);
	autoTime = autoTime || "00:00";

	var dateInput = dateTimePickerElement.find(".date-control input[type='text']");
	var timeInput = dateTimePickerElement.find(".time-control input[type='text']");
	var timeManualCheckbox = dateTimePickerElement.find(".time-control input[type='checkbox']");
	var dateHiddenValue = dateTimePickerElement.find("input.date-hidden");
	var timeHiddenValue = dateTimePickerElement.find("input.time-hidden");
    var defaultDatePickerOptions = { endDate: "+0d" };

	var init = function () {
		dateInput.datepicker(defaultDatePickerOptions);
		timeInput.timepicker({showMeridian: false});

		registerEvents();
	};

	var registerEvents = function () {
		dateInput.datepicker().on('changeDate', function(ev){
			if (!ev.date) { // invalid date set
				return;
			}
			dateHiddenValue.val(formatDateForHiddenValue(ev.date));
			dateInput.datepicker("hide");
			if (!timeManualCheckbox.is(':checked')) {
				setTime(autoTime);
			}
			triggerChangeEvent();
		});
		timeManualCheckbox.on('change', function(ev) {
			var manualSelection = timeManualCheckbox.is(':checked');
			timeInput.attr("disabled", !manualSelection);
			triggerChangeEvent();
		});
		timeInput.on('changeTime.timepicker', function(ev) {
			timeHiddenValue.val(ev.time.value);
			triggerChangeEvent();
		});
	};

	var setTime = function(time) {
		var pattern = new RegExp("([0-9]|[01][0-9]|2[0-3]):([0-5][0-9])");
		if (!pattern.test(time)) {
			console.log("Invalid time to set. Expected in format hh:mm");
			time = autoTime;
		}

		timeInput.val(time);
		timeHiddenValue.val(time);
		var timePickerValue = time;

		// workaround for the bootstrap timepicker
		if (timePickerValue == '00:00' || timePickerValue == '0:00') {
			timePickerValue = "00:001";
		}

		timeInput.timepicker('setTime', timePickerValue);
	};

	var setDate = function (date) {
		var dateObject = parseDateFromHiddenValue(date);
		dateHiddenValue.val(date);
		dateInput.datepicker("setDate", dateObject);
	};

	var parseDateFromHiddenValue = function (dateString) {
		var pattern = new RegExp("([0-2][0-9]|3[01]).(0[1-9]|1[0-2]).[0-9]{4}");
		if (!pattern.test(dateString)) {
			console.log("Invalid date to set. Expected in format dd.mm.yyyy");
			return new Date();
		}
		var parts = dateString.split(".");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	};

	var formatDateForHiddenValue = function(date) {
		return twoDigitString(date.getDate()) + "." + twoDigitString(date.getMonth() + 1) + "." + date.getFullYear();
	};

	var twoDigitString = function(number) {
		return ("00" + number).substr(-2,2);
	};

	var triggerChangeEvent = function() {
		dateTimePickerElement.trigger("changeDateTime", values());
	};
	
	var values = function(newValues) {
		if (newValues === undefined) {
			return {
				date: dateHiddenValue.val(),
				manualTime: timeManualCheckbox.is(':checked'),
				time: timeHiddenValue.val()
			};
		}

		if (newValues.manualTime !== undefined) {
			var isManual = OpenSpeedMonitor.stringUtils().stringToBoolean(newValues.manualTime);
			timeManualCheckbox.prop('checked', isManual);
			timeInput.attr("disabled", !isManual);
		}
		if (newValues.time) {
			setTime(newValues.time);
		}
		if (newValues.date) {
			setDate(newValues.date);
		}
	};

	var setStartDate = function(startDate) {
		var dateObject = startDate ? parseDateFromHiddenValue(startDate) : null;
		dateInput.datepicker("setStartDate", dateObject);
	};

	init();
	return {
		values : values,
		setStartDate : setStartDate
	};
};
