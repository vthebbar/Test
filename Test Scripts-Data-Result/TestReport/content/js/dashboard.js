/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6742064669237615, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4222389181066867, 500, 1500, "01_01_Open URL"], "isController": true}, {"data": [0.5, 500, 1500, "03_07_Click on Sign Out"], "isController": true}, {"data": [0.9375, 500, 1500, "03_07_Click on Sign Out-0"], "isController": false}, {"data": [0.84375, 500, 1500, "03_07_Click on Sign Out-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_06_Click on Add to Cart"], "isController": true}, {"data": [0.42333333333333334, 500, 1500, "02_01_Open Url"], "isController": true}, {"data": [0.5, 500, 1500, "04_03_Enter user name and password, Click on Login"], "isController": true}, {"data": [0.9172932330827067, 500, 1500, "02_03_Click on product id"], "isController": true}, {"data": [0.908, 500, 1500, "02_04_Click on Item Id"], "isController": true}, {"data": [1.0, 500, 1500, "04_04_Click on  Category"], "isController": true}, {"data": [0.8814589665653495, 500, 1500, "01_02_Search"], "isController": true}, {"data": [1.0, 500, 1500, "04_03_Enter user name and password, Click on Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_03_Enter user name and password, Click on Login-0"], "isController": false}, {"data": [0.4222972972972973, 500, 1500, "01_Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "04_05_Click on Product ID"], "isController": true}, {"data": [0.0, 500, 1500, "04_10_Click on Sign Out"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "03_05_Click on Product Id"], "isController": true}, {"data": [1.0, 500, 1500, "04_07_Click on Proceed to checkout"], "isController": true}, {"data": [0.8717948717948718, 500, 1500, "03_04_Click on Category"], "isController": true}, {"data": [0.8723404255319149, 500, 1500, "03_02_Click on Sign In"], "isController": true}, {"data": [0.48863636363636365, 500, 1500, "03_03_Key in user name and password click Login"], "isController": true}, {"data": [1.0, 500, 1500, "04_09_Click on Confirm"], "isController": true}, {"data": [1.0, 500, 1500, "04_10_Click on Sign Out-1"], "isController": false}, {"data": [0.5, 500, 1500, "04_10_Click on Sign Out-0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "03_03_Key in user name and password click Login-0"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "03_03_Key in user name and password click Login-1"], "isController": false}, {"data": [0.8819444444444444, 500, 1500, "02_02_Click on Category"], "isController": true}, {"data": [1.0, 500, 1500, "04_08_Key in payment details and click continue"], "isController": true}, {"data": [0.8787878787878788, 500, 1500, "03_06_Click on Add to Cart"], "isController": true}, {"data": [0.8831118060985145, 500, 1500, "02_Search"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "03_01_Open Url"], "isController": true}, {"data": [1.0, 500, 1500, "04_02_Click on Sign In"], "isController": true}, {"data": [0.5, 500, 1500, "04_01_Open Url"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3476, 0, 0.0, 797.5560989643269, 0, 5981, 640.5, 1434.0, 1573.1499999999996, 2243.15, 34.755829300483946, 59.97816394845118, 25.112123263958324], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["01_01_Open URL", 1331, 0, 0.0, 1260.8782870022555, 814, 2777, 1221.0, 1576.8, 1719.7999999999997, 2331.36, 13.302683524061765, 25.538570973464594, 7.776494412448153], "isController": true}, {"data": ["03_07_Click on Sign Out", 32, 0, 0.0, 813.8125, 556, 1338, 743.5, 1252.0, 1338.0, 1338.0, 0.4830990806020622, 1.0653891589546942, 0.6222731321426953], "isController": true}, {"data": ["03_07_Click on Sign Out-0", 16, 0, 0.0, 361.5625, 275, 617, 323.5, 614.2, 617.0, 617.0, 0.2679618154412996, 0.06018673589013566, 0.1737564897002177], "isController": false}, {"data": ["03_07_Click on Sign Out-1", 16, 0, 0.0, 451.93750000000006, 274, 826, 390.5, 802.9, 826.0, 826.0, 0.2669514148424986, 0.5287541085491191, 0.1707550553924186], "isController": false}, {"data": ["04_06_Click on Add to Cart", 2, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 0.2911208151382824, 0.6237490902474527, 0.19559679767103347], "isController": true}, {"data": ["02_01_Open Url", 300, 0, 0.0, 1227.443333333334, 831, 2743, 1153.0, 1604.1000000000004, 1751.0, 2593.0, 3.0663872847140596, 5.918367021004753, 1.76796391884295], "isController": true}, {"data": ["04_03_Enter user name and password, Click on Login", 2, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 0.2627775587964788, 0.5807281401918276, 0.43753490014452767], "isController": true}, {"data": ["02_03_Click on product id", 266, 0, 0.0, 390.90977443609023, 0, 994, 342.0, 547.1000000000001, 658.0, 837.2199999999963, 3.0249616193779496, 5.121814052993688, 1.9786676593506567], "isController": true}, {"data": ["02_04_Click on Item Id", 250, 0, 0.0, 386.48799999999994, 0, 1392, 345.0, 555.0, 640.0, 1141.5900000000045, 2.9722628431477456, 4.893668225618527, 1.8913576627908357], "isController": true}, {"data": ["04_04_Click on  Category", 2, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 0.3110419906687403, 0.5221495917573873, 0.1995650272161742], "isController": true}, {"data": ["01_02_Search", 1316, 0, 0.0, 424.37841945288744, 0, 2670, 363.5, 645.8999999999999, 748.1499999999999, 1459.5399999999972, 13.416934291685783, 20.956572265127186, 12.059026052021206], "isController": true}, {"data": ["04_03_Enter user name and password, Click on Login-1", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 6.941788680069931, 2.4687226835664338], "isController": false}, {"data": ["04_03_Enter user name and password, Click on Login-0", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 0.7085469242902208, 3.0251873028391167], "isController": false}, {"data": ["01_Open URL", 1332, 0, 0.0, 1260.8003003003014, 814, 2777, 1221.0, 1576.7, 1719.6999999999998, 2331.34, 13.318401791784986, 25.569783188517377, 7.785188824216094], "isController": false}, {"data": ["04_05_Click on Product ID", 2, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 0.341705108491372, 0.617338330770545, 0.22858203058260723], "isController": true}, {"data": ["04_10_Click on Sign Out", 2, 0, 0.0, 1559.0, 1559, 1559, 1559.0, 1559.0, 1559.0, 1559.0, 0.2385211687537269, 0.5257248807394156, 0.30304300834824094], "isController": true}, {"data": ["03_05_Click on Product Id", 36, 0, 0.0, 385.22222222222206, 0, 532, 408.5, 511.0, 532.0, 532.0, 0.48874528225040054, 0.8269054702136903, 0.30885986586657255], "isController": true}, {"data": ["04_07_Click on Proceed to checkout", 2, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 0.30441400304414007, 0.6989036339421613, 0.1982852929984779], "isController": true}, {"data": ["03_04_Click on Category", 39, 0, 0.0, 411.94871794871807, 0, 604, 410.0, 578.0, 604.0, 604.0, 0.49818609166624084, 0.8249211205354862, 0.3102186430177303], "isController": true}, {"data": ["03_02_Click on Sign In", 47, 0, 0.0, 401.6170212765957, 0, 739, 313.0, 706.6000000000001, 735.0, 739.0, 0.5092587576253372, 0.9472204426758839, 0.309080957243935], "isController": true}, {"data": ["03_03_Key in user name and password click Login", 44, 0, 0.0, 1008.5454545454543, 0, 5981, 882.5, 1128.0, 2242.0, 5981.0, 0.504107329033145, 1.0640674587262124, 0.8012057402357847], "isController": true}, {"data": ["04_09_Click on Confirm", 2, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 0.24154589371980675, 0.5144644474637682, 0.15190972222222224], "isController": true}, {"data": ["04_10_Click on Sign Out-1", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 6.73296662414966, 2.14578018707483], "isController": false}, {"data": ["04_10_Click on Sign Out-0", 1, 0, 0.0, 1264.0, 1264, 1264, 1264.0, 1264.0, 1264.0, 1264.0, 0.7911392405063291, 0.17769729034810128, 0.5060509790348101], "isController": false}, {"data": ["03_03_Key in user name and password click Login-0", 21, 0, 0.0, 458.1904761904762, 277, 1550, 393.0, 623.2, 1457.4999999999986, 1550.0, 0.25788387857353373, 0.05792313678897731, 0.24730661011641614], "isController": false}, {"data": ["03_03_Key in user name and password click Login-1", 21, 0, 0.0, 478.76190476190476, 306, 779, 477.0, 695.8, 770.6999999999998, 779.0, 0.2569561706188973, 0.5104948624060887, 0.1814251087475222], "isController": false}, {"data": ["02_02_Click on Category", 288, 0, 0.0, 479.7534722222221, 0, 5647, 355.5, 646.7000000000002, 777.4500000000016, 5409.040000000004, 2.9782217534280573, 4.788955373208413, 1.848926825453455], "isController": true}, {"data": ["04_08_Key in payment details and click continue", 2, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 0.23410979749502517, 0.4478721614187054, 0.2958379667564088], "isController": true}, {"data": ["03_06_Click on Add to Cart", 33, 0, 0.0, 423.75757575757575, 0, 798, 376.0, 746.0, 798.0, 798.0, 0.5038629492777964, 1.0491776918496352, 0.32821470287354565], "isController": true}, {"data": ["02_Search", 1279, 0, 0.0, 423.7888975762314, 265, 1548, 369.0, 641.0, 738.0, 1089.2000000000014, 13.317090439599342, 21.40235928682243, 12.315544973162783], "isController": false}, {"data": ["03_01_Open Url", 48, 0, 0.0, 1251.9166666666672, 897, 2098, 1193.5, 1787.8000000000004, 2075.0499999999997, 2098.0, 0.513248219670238, 0.9982611043390859, 0.2923777293043348], "isController": true}, {"data": ["04_02_Click on Sign In", 3, 0, 0.0, 217.33333333333331, 0, 326, 326.0, 326.0, 326.0, 326.0, 0.04631201951279755, 0.0586136496958844, 0.019145919525147426], "isController": true}, {"data": ["04_01_Open Url", 4, 0, 0.0, 1009.5, 869, 1150, 1009.5, 1150.0, 1150.0, 1150.0, 0.06067040800849386, 0.1190597508721371, 0.0340382318367966], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3476, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
