$(document).ready(function () {
    let orderTable;
    $("#order_tab_btn").click(function () {
        const isDataTablesPresent = $("#order_table").attr('isDataTablesPresent');
        if (isDataTablesPresent == "Yes") {
            return;
        }
        orderTable = $("#order_table").DataTable({
            ajax: {
                url: "/order",
                type: "POST",
                dataType: "json",
                dataSrc: ''
            },
            columns: [
                { title: "Order ID", data: "orderID" },
                { title: "Product ID", data: "productID" },
                { title: "Order Date", data: "orderDate" },
                { title: "Order Status", data: "orderStatus" },
                { title: "Order Quantity", data: "orderQuantity" },
            ],
            pageLength: 5,
            initComplete: function () {
                $("#order_table").attr('isDataTablesPresent', "Yes");
            }
        })
    });
    $("#order_insert_btn").click(function () {
        $("#order_insert_modal").css("display", 'flex');
    });

    $(".close-modal").click(function () {
        $("#order_insert_modal").css("display", 'none');
        $("#insert_order_form")[0].reset();
    });


    // This inserts new order data to the order table 
    $("#insert_order_form").on("submit", function (e) {
        const orderSubmitBtn = document.getElementById('orderSubmitBtn');
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: "/order/insert",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#insert_order_form")[0].reset();
                orderSubmitBtn.textContent = '✔ Order Added';
                setTimeout(() => {
                    orderSubmitBtn.textContent = 'Submit';
                }, 2000);
                orderTable.ajax.reload(null, false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error:", textStatus, errorThrown);
            }
        });
    });

});