<div id="threshold" jobId="${job?.id}" scriptId="${job?.script?.id}">
    <div class="container">
        <div id="thresholdList" class="col-md-offset-1">
            <div v-for="thresholdItem in thresholds">
                <threshold-measured-event :thresholds="thresholdItem"
                                          :measurands="measurands"
                                          v-on:delete-threshold="deleteThreshold"
                                          v-on:update-threshold="updateThreshold"
                                          v-on:create-threshold="createThreshold"></threshold-measured-event>
                <br>
            </div>
        </div>
    </div>

    <br> <br>

    <div>
        <button type="button" class="btn btn-primary"
                @click="changeNewThresholdState()">
            <span v-if="newThresholdState">Hide new Threshold</span>
            <span v-else>New Threshold</span>
        </button>
        <button class="btn btn-default"
                type="button"
                id="copyToClipboard"
                @click="createScript()">
            <g:message code="job.threshold.copyToClipboard" default="Copy To Clipboard"/>
        </button><br>
    </div>
</div>

<g:render template="thresholdTabMeasuredEventVue"/>
<g:render template="thresholdTabNewThresholdVue"/>

<asset:javascript src="job/thresholdForJob.js"/>

%{--

<asset:script type="text/javascript">
    OpenSpeedMonitor.postLoader.loadJavascript('<g:assetPath src="job/thresholdForJob.js"/>');
    $(window).load(function() {
      OpenSpeedMonitor.thresholdforJobs.initVue({jobId: "${job?.id}", scriptId: "${job?.script?.id}"});
    });
</asset:script>--}%