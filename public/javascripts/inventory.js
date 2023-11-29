$(document).ready(function () {
    let inventoryTable;
    $("#inventory_tab_btn").click(function () {
        const isDataTablesPresent = $("#inventory_table").attr('isDataTablesPresent');
        if (isDataTablesPresent == "Yes") {
            return;
        }
        inventoryTable = $('#inventory_table').DataTable({
            ajax: {
                url: "/inventory",
                type: "POST",
                dataType: "json",
                dataSrc: ''
            },
            columns: [
                { title: "Inventory ID", data: "inventoryID" },
                { title: "Product Type", data: "productType" },
                { title: "Product ID", data: "productID" },
                { title: "Stock Level", data: "stockLevel" },
                { title: "Supplier ID", data: "supplierID" },
                { title: "Received Date", data: "receivedDate" },
                { title: "Damaged Units", data: "damagedUnits" },
            ],
            pageLength: 5,
            initComplete: function () {
                $("#inventory_table").attr('isDataTablesPresent', "Yes");
            }
        });

        //row click to fetch the specified inventory details
        inventoryTable.on('click', 'tbody tr', function () {
            var data = $('#inventory_table').DataTable().row(this).data();
            let inventoryID = data.inventoryID;
            let inventoryModalData = '';
            // inventory ajax
            inventoryAjax(inventoryID).done(function (data) {
                role == 'l4' ? $("#inventory_viewModal").css('display', 'flex') : null;
                inventoryModalData = `
                <div class='close_inventory_viewModal_div'><button class='btn btn-dark' id='close_inventory_viewModal'>Close</button></div>
                <div class="inventoryModalData_label_div"><label class="inventoryModalData_label">Product ID: </label>${data[0].productID}</div>
                <div class="inventoryModalData_label_div"><label class="inventoryModalData_label">Product Type:</label>${data[0].productType}</div>
                <div class="inventoryModalData_label_div"><label class="inventoryModalData_label">Supplier ID:</label>${data[0].supplierID}</div>
                <div class="inventoryModalData_label_div"><label class="inventoryModalData_label">Stock Level:</label>${data[0].stockLevel}</div>
                <div class="inventoryModalData_label_div"><label class="inventoryModalData_label">Received Date:</label>${data[0].receivedDate}</div>
                <div class="inventoryModalData_label_div"><label class="inventoryModalData_label">Damaged Units:</label>${data[0].damagedUnits}</div>`;
                if(data[0].imageData){
                    inventoryModalData+=`<div class="inventoryModalData_label_div">Damaged Unit Picture:<img class="inventoryModalData_img" src='${data[0].imageData}'></div>`;
                }
                $("#inventory_viewModal").html(inventoryModalData);
                $("#close_inventory_viewModal").click(function () {
                    $(this).parent().parent().html('').css('display', 'none')
                });
            }).fail(function (xhr, status, error) {
                console.error("Error: " + status + " - " + error);
            });
        });
    });

    // Util code for inventory insert btn - modal and close modal
    $("#inventory_insert_btn").click(function () {
        $("#inventory_insert_modal").css("display", 'flex');
    });

    $(".close-modal").click(function () {
        $("#inventory_insert_modal").css("display", 'none');
        $("#insert_inventory_form")[0].reset();
    });

    // This inserts new inventory data along wit images to AWS S3 
    $("#insert_inventory_form").on("submit", function (e) {
        const inventorySubmitBtn = document.getElementById('inventorySubmitBtn');
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: "/inventory/insert",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#insert_inventory_form")[0].reset();
                inventorySubmitBtn.textContent = '✔ Inventory Added';
                setTimeout(() => {
                    inventorySubmitBtn.textContent = 'Submit';
                }, 2000);
                inventoryTable.ajax.reload(null, false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error:", textStatus, errorThrown);
            }
        });
    });

    // ajax for inventory
    function inventoryAjax(inventoryID) {
        return $.ajax({
            type: "POST",
            url: "/inventory/getinventory",
            dataType: "json",
            data: { inventoryID }
        });
    }
});