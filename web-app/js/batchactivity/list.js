/**
 * Refreshes the table data every 5 seconds
 * @param updateTableUrl
 *          url to update complete table (method updateTableMethod within BatchActivityController)
 * @param checkUrl
 *          url to check if active BatchActivities exist (method checkForUpdate within BatchActivityController)
 * @param rowUpdateUrl
 *          url to update all rows (method getUpdate within BatchActivityController)
 */
function updateIfNecessary(updateTableUrl, checkUrl, rowUpdateUrl) {
    setInterval(function () {
        var ids = collectActiveIds();

        if (ids.length == 0 && isPageOne()) {
            jQuery.ajax({
                type: 'GET',
                url: checkUrl,
                success: function (content) {
                    if (content == "true") {
                        updateBatchActivityTable(updateTableUrl);
                    }
                }
            });
        } else {
            updateRows(ids,rowUpdateUrl);
        }
    }, 5000);
}

/**
 * updates the batchActivity table
 * @param updateTableUrl url to updateTableMethod within BatchActivityController
 */
function updateBatchActivityTable(updateTableUrl) {
    jQuery.ajax({
        type: 'GET',
        url: updateTableUrl,
        success: function (content) {
            $("#tabelle").html(content);
        },
        error: function (content) {
        }
    });
}

/**
 * Replaces all rows with the given id with a new version
 * @param ids row ids to update
 * @param rowUpdateUrl url to get a row update
 */
function updateRows(ids, rowUpdateUrl) {

    jQuery.ajax({
        type: 'GET',
        url: rowUpdateUrl,
        traditional: true,
        data: {activeIds: ids},
        async: false,
        success: function (content) {
            $.each(content, function(i, update){
                updateRow(update);
            });
        },
        error: function (content) {
        }
    });

}
/**
 * Checks if active page is page 1
 * @returns {boolean}
 */
function isPageOne() {
    var content = $(".active").text();
    return content == "1";
}
/**
 * replaces a single row with the given id with the content
 * @param id
 * @param content
 */
function updateRow(rowObject) {
    console.log("will be activated: " + JSON.stringify(rowObject))
    var idxFieldActivity = 1;
    var idxFieldStatus = 2;
    //TODO: update all fields
    $("tr#" + rowObject.htmlId + " td")[idxFieldActivity].innerText=rowObject.activity;
}
/**
 * Returns an array with all row ids where status = active
 * @returns {Array}
 */
function collectActiveIds() {
    var ids = [];
    $("[status='ACTIVE']").each(function (index, element) {
        ids.push([$(element).attr("id").replace("batchActivity_", "")]);
    });
    return ids;
}
