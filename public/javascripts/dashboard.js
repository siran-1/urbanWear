
$(document).ready(function () {
    let selectedMonth, selectedYear, source;

    // to hold the data in the local
    let totalOrders;
    let totalStock;
    let supplierMetric;
    // holding all three charts canvas elements
    let canvasElement_orders = document.getElementById('productSalesChart');
    let canvasElement_stock = document.getElementById('allSizeStockChart');
    let canvasElement_supplier = document.getElementById('supplierMetric');

    //holding all three chart instances
    let generateOrderChart;
    let generateStockChart;
    let generateSupplierMetric;


    $("#dashboard_dateSubmit").click(function () {
        selectedMonth = $('#dashboard_month_dropdown').val();
        selectedYear = $('#dashboard_year_dropdown').val();
        $(".dashboard_quote").css('display', 'none');
        $(".dashboard_controls").css('display', 'flex');
        let checkbutton = $('.viewChartBtn').attr('button');
        checkbutton == 'on' ? $('.viewChartBtn').click() :null;
    });
    $("#totalOrderBtn, #totalStockBtn,#supplierPerformanceBtn").click(function () {
        if ($(this).text() === "Hide") {
            if ($(this).attr('data-attribute') == "getTotalOrders") {
                $('#productSalesChart_Div').css('display', 'none');
                $(this).text('View Total Approved Orders');
                $("#productSalesChart_chartSwitcher").prop('selectedIndex', 0);
            }
            else if ($(this).attr('data-attribute') == "getTotalStock") {
                $('#allSizeStockChart_Div').css('display', 'none');
                $(this).text('View Total Stock');
                $("#allSizeStockChart_chartSwitcher").prop('selectedIndex', 0);
            }
            else if ($(this).attr('data-attribute') == "getSupplierMetric") {
                $('#supplierMetric_Div').css('display', 'none');
                $(this).text('View Supplier Metrics');
                $("#supplierMetric_chartSwitcher").prop('selectedIndex', 0);
            }
        } else {
            $(this).text('Hide');
            $('.viewChartBtn').attr('button','on');
            if ($(this).attr('data-attribute') == "getTotalOrders") {
                source = "totalOrders";
                let title = "Total Approved Orders";
                ajax(selectedMonth, selectedYear, source).done(function (data) {
                    totalOrders = data[0];
                    $('#productSalesChart_Div').css('display', 'flex');
                    generateOrderChart?.destroyChart();
                    generateOrderChart = new GenerateChart({ data: totalOrders, source, canvasElement: canvasElement_orders, title });
                }).fail(function (xhr, status, error) {
                    console.error("Error: " + status + " - " + error);
                });
            }

            else if ($(this).attr('data-attribute') == "getTotalStock") {
                source = "totalStock";
                let title = "Available Stock"
                ajax(selectedMonth, selectedYear, source).done(function (data) {
                    totalStock = data[0];
                    $('#allSizeStockChart_Div').css('display', 'flex');
                    generateStockChart?.destroyChart();
                    generateStockChart = new GenerateChart({ data: totalStock, source, canvasElement: canvasElement_stock, title });
                }).fail(function (xhr, status, error) {
                    console.error("Error: " + status + " - " + error);
                });
            }

            else if ($(this).attr('data-attribute') == "getSupplierMetric") {
                source = "supplierMetric";
                let title = "Total Damaged Units - By Product ID";
                ajax(selectedMonth, selectedYear, source).done(function (data) {
                    supplierMetric = data[0];
                    $('#supplierMetric_Div').css('display', 'flex');
                    generateSupplierMetric?.destroyChart();
                    generateSupplierMetric = new GenerateChart({ data: supplierMetric, source, canvasElement: canvasElement_supplier, title });
                }).fail(function (xhr, status, error) {
                    console.error("Error: " + status + " - " + error);
                });
            }
        }
    });

    // chart switch 
    $("#productSalesChart_chartSwitcher").on('change', function () {
        let chartType = $(this).val();
        source = "totalOrders";
        let title = "Total Approved Orders";
        generateOrderChart.destroyChart();
        generateOrderChart = new GenerateChart({ chartType, data: totalOrders, source, canvasElement: canvasElement_orders, title });
    });
    $("#allSizeStockChart_chartSwitcher").on('change', function () {
        let chartType = $(this).val();
        source = "totalStock";
        let title = "Available Stock"
        generateStockChart.destroyChart();
        generateStockChart = new GenerateChart({ chartType, data: totalStock, source, canvasElement: canvasElement_stock, title });
    });
    $("#supplierMetric_chartSwitcher").on('change', function () {
        let chartType = $(this).val();
        let supplierMetricCompare;
        if (chartType == 'comparebar') {
            let title = "Damaged Rate Analysis For Individual Suppliers For The Total stock";
            source = 'supplierMetricCompare';
            ajax(selectedMonth, selectedYear, source).done(function (data) {
                supplierMetricCompare = data[0];
                generateSupplierMetric?.destroyChart();
                generateSupplierMetric = new GenerateChart({chartType, data: supplierMetricCompare, source, canvasElement: canvasElement_supplier, title });
            }).fail(function (xhr, status, error) {
                console.error("Error: " + status + " - " + error);
            });
        }
        else if (chartType == 'bar') {
            source = "supplierMetric";
            let title = "Total Damaged Units - By Product ID";
            generateSupplierMetric?.destroyChart();
            generateSupplierMetric = new GenerateChart({ chartType, data: supplierMetric, source, canvasElement: canvasElement_supplier, title });
        }
    });
});

// ajax for dashboard
function ajax(selectedMonth, selectedYear, source) {
    return $.ajax({
        type: "POST",
        url: "/dashboard",
        dataType: "json",
        data: { selectedMonth, selectedYear, source }
    });
}


 