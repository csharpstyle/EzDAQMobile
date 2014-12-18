var realtime_timeout;
var realtime_filter = "";
var realtime_filterUrl = "";
var realtime_filterDataSource;
var realtime_DataSource;

function realtimeView_init() {
    realtime_DataSource = new kendo.data.DataSource({
                                                   transport: {
            read: function(options) {
                // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                $.ajax({
                           type: "GET",
                           url: getServerRoot() + "api/Realtime" + realtime_filterUrl,
                           headers: {"Authorization": "bearer " + token},
                           success: function(result) {
                               options.success(result);
                           },
                           fail: function(result) {
                               // notify the data source that the request failed
                               //alert(result);
                               options.error(result);
                           }
                       });
            }

        }
                                               });
    
    $("#realtimeListView").kendoMobileListView({
                                                   dataSource: realtime_DataSource,
                                                   pullToRefresh: true,            
                                                   template: $("#realtimeListViewTemplate").text(),
                                                   pullTemplate: "下拉可以更新...",
                                                   releaseTemplate: "松开立即更新...",
                                                   refreshTemplate: "更新中..."
                                               });
    
    realtime_filterDataSource = new kendo.data.DataSource({
                                                   transport: {
            read: function(options) {
                // make JSONP request to http://demos.telerik.com/kendo-ui/service/products
                $.ajax({
                           type: "GET",
                           url: getServerRoot() + "api/Realtime?filter=" + realtime_filter,
                           headers: {"Authorization": "bearer " + token},
                           success: function(result) {
                               options.success(result);
                           },
                           fail: function(result) {
                               // notify the data source that the request failed
                               //alert(result);
                               options.error(result);
                           }
                       });
            }

        }
                                               });
    
    $("#fliterListView").kendoMobileListView({
                                                 dataSource: realtime_filterDataSource,
                                                 pullToRefresh: true,            
                                                 template: $("#fliterListViewTemplate").text(),
                                                 pullTemplate: "下拉可以更新...",
                                                 releaseTemplate: "松开立即更新...",
                                                 refreshTemplate: "更新中...",
                                                 click: function(e) {
                                                     filterModalView1_close();
                                                     realtime_filterUrl = "?filter=" + e.dataItem.Type + "&id=" + e.dataItem.Id;
                                                     alarmListView_refresh();
                                                 }
                                             });    
    
    realtime_timeout = setTimeout('realtimeView_init()', 60000);
}

function alarmListView_refresh() {
    //$("#realtimeListView").data("kendoMobileListView").refresh();
    realtime_DataSource.read();
    realtime_timeout = setTimeout('alarmListView_refresh()', 3000);
}

function realtimeView_show() {
}

function getAlarmCss(alarmType) {
    var css = "";
    switch (alarmType) {
        case 0:
            css = "alarm0";
            break;
        case 1:
            css = "alarm1";
            break;
        case 2:
            css = "alarm2";
            break;
        case 3:
            css = "alarm3";
            break;
        case 4:
            css = "alarm4";
            break;
        case 5:
            css = "alarm5";
            break;
        case 6:
            css = "alarm6";
            break;
        case 7:
            css = "alarm7";
            break;
    }
    
    return css;
}

function realtime_searchSelect(e) {
    switch (e.index) {
        case 0:
            realtime_filterUrl = "";
            alarmListView_refresh();
            return;
        case 1:
            realtime_filter = "Area";
            title = "区域";
            break;
        case 2:
            realtime_filter = "MeasurementType";
            title = "子系统";
            break;
        case 3:
            realtime_filter = "DataType";
            title = "数据类型";
            break;
        case 4:
            realtime_filter = "AlarmType";
            title = "报警类型";
            break;
    }
    
    $("#filterModalView1").data("kendoMobileModalView").open();
    $("#filterModalView1_title").text(title);
    realtime_filterDataSource.read();
}

function filterModalView1_close() {
    $("#filterModalView1").kendoMobileModalView("close");
}

function fliterListView_Click(e) {
    filterModalView1_close();
    realtime_filterUrl = "?filter=" + e.dataItem.Type + "&id=" + e.dataItem.Id;
    alarmListView_refresh();
}