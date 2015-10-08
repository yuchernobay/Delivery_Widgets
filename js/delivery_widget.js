function screenHeight() {
    return window.innerHeight; // $(window).height();
};
function screenWidth() {
    return window.innerWidth; // $(window).width();
};

function updateCounter(type) {
    $.post('http://www.delivery-auto.com/api/v4/Public/PostWidgetCounterInformation', { type: type, url: location.hostname }, function (data) {
    });
};

(function ($) {
$.fn.delivery_search_receipt = function (options) {
    var culture = $.delivery_resources.culture;

    var parent_div = $(this);

    var type = 'vertical_small';
    if (options != undefined && options.type != undefined)
        type = options.type;

    var name = $(this).attr('id');

    $(this).addClass('delivery_panel');
    var delivery_link = $('<a class="delivery_link" href="http://www.delivery-auto.com">www.delivery-auto.com</a>');
    var delivery_child_panel = $('<div class="delivery_child_panel"></div>');
    var delivery_receipt_number = $('<input placeholder="' + $.delivery_resources.find_receipt.input_number_placeholder + '" type="text">');
    var delivery_search_button = $('<a href="javascript:void(0)">' + $.delivery_resources.find_receipt.button_find_label + '</a>');
    var container = $('<div style="float:left;"></div>');

    var delivery_loader = $('<div class="delivery_loader"><b>' + $.delivery_resources.find_receipt.loading + '</b></div>');

    if (type == 'horizontal_small')
    {
        delivery_child_panel.css("border-top-style", "none");
        $(this).append(delivery_child_panel);

        var delivery_label_title = $('<div class="delivery_label_title"><div class="delivery_label_title_horizontal">' + $.delivery_resources.find_receipt.dialog_title_horizontal + '</div></div>');
        delivery_label_title.css('padding', '0px').css('display', 'inline-block');
        delivery_child_panel.append(delivery_label_title);

        delivery_label_title.append(container);

        container.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main_horizontal');

        //container.append(delivery_link);

        delivery_search_button.css("float", "left");
        delivery_label_title.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main_horizontal');

        delivery_loader.css('top', '-36px');
    } else if (type == 'vertical_large')
    {
        $(this).append('<div class="delivery_label_title_logo"><img class="delivery_logo" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/></div>');//<div>' + $.delivery_resources.find_receipt.logo_text + '</div></div>');
        $(this).append(delivery_child_panel);

        var sub_title = $('<div class="delivery_sub_title">' + $.delivery_resources.find_receipt.sub_title + '</div>');
        delivery_child_panel.append(sub_title);
        delivery_child_panel.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main');

        delivery_child_panel.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main');

        delivery_child_panel.append(delivery_link);

        delivery_loader.css('top', '-135px');
    }
    else if(type == 'horizontal_large')
    {
        delivery_child_panel.css("border-top-style", "none");
        $(this).append(delivery_child_panel);

        var delivery_label_title = $('<div class="delivery_label_title"><img class="delivery_logo delivery_logo_horizontal" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><div class="delivery_label_title_horizontal">' + $.delivery_resources.find_receipt.dialog_title_horizontal + '</div></div>');
        delivery_label_title.css('padding', '0px').css('display', 'inline-block');
        delivery_child_panel.append(delivery_label_title);

        delivery_label_title.append(container);

        container.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main_horizontal');

        //container.append(delivery_link);

        delivery_search_button.css("float", "left");
        delivery_label_title.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main_horizontal');

        var hot_line = $('<div class="delivery_label_title_horizontal"></div>');
        delivery_label_title.append(hot_line);

        hot_line.append('<div class="hot_line">' + $.delivery_resources.find_receipt.hot_line + '</div>');
        hot_line.append('<div class="hot_line_phone">' + $.delivery_resources.find_receipt.hot_line_phone + '</div>');
        hot_line.append('<div class="hot_line_comment">' + $.delivery_resources.find_receipt.hot_line_comment + '</div>');

        delivery_loader.css('top', '-41px');
    }
    else
    {
        $(this).append('<div class="delivery_label_title">' + $.delivery_resources.find_receipt.dialog_title + '</div>');
        $(this).append(delivery_child_panel);

        delivery_child_panel.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main');

        delivery_child_panel.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main');

        delivery_child_panel.append(delivery_link);
    }
    
    
    $(this).append(delivery_loader);


    var printable_area = $('<div style="display:none;" ></div>');
    $(this).append(printable_area);
    var dialog_parent = $('<div id="delivery_dialog_'+name+'" style="display:none; padding:0px;"/>');
    $(this).append(dialog_parent);
    var dialog = $('<div style="border-collapse: collapse; text-align: left; width:auto; border: none; min-height: 70px;" class="delivery_panel_dialog"/>');
    $(dialog_parent).append(dialog);

    var errorMessageFunc = function (data) {
        delivery_loader.css('visibility', 'hidden');
        parent_div.removeClass('disable');
        alert(data.status.toString() + ' ' + data.statusText);
    };

    var show_message = function (message) {
        dialog.html('');
        dialog.append('<div class="delivery_label">' + message + '</div>');
        $(dialog_parent).delivery_dialog({
            width: "auto",
            title: $.delivery_resources.find_receipt.dialog_title
        });
    };

    var send_request = function () {
        var receipt_number = delivery_receipt_number.val();
        receipt_number = receipt_number.replace(/ /g, "");
        if (receipt_number.length != 10) {
            show_message($.delivery_resources.find_receipt.receipt_not_correct_format);
            return;
        };

        var url = 'http://www.delivery-auto.com/api/Receipts/GetReceiptInfo?culture=' + culture + '&number=' + receipt_number;
        $.ajax({
            url: url,
            type: "GET",
            data: {},//data,
            dataType: 'json',

            beforeSend: function (request) {
                parent_div.addClass('disable');
                delivery_loader.css('visibility', 'visible');
            },
            success: function (res) {
                delivery_loader.css('visibility', 'hidden');
                parent_div.removeClass('disable');
                if (res.status == true && res.data != null) {
                    dialog.html('');

                    var currency = $.delivery_resources.find_receipt.uah;
                    var currencyInsurance = $.delivery_resources.find_receipt.uah;
                    if (res.data.Currency == 100000001)
                        currency = $.delivery_resources.find_receipt.rub;

                    if (res.data.InsuranceCurrency == 100000001)
                        currencyInsurance = $.delivery_resources.find_receipt.rub;

                    var row = addTableRow(dialog);
                    $(row).append('<div style="display:table-cell;" class="delivery_label"><b>' + $.delivery_resources.find_receipt.receipt_number + '</b></div>');
                    $(row).append('<div style="display:table-cell;" class="delivery_label">' + res.data.SerialNumber + '</div>');
                    $(row).append('<div style="display:table-cell;" class="delivery_label"><b>' + $.delivery_resources.find_receipt.status + '</b></div>');

                    var status_text = "";
                    switch (res.data.Status) {
                        case 0:
                            status_text = $.delivery_resources.find_receipt.state0;
                            break;
                        case 1:
                            status_text = $.delivery_resources.find_receipt.state1;
                            break;
                        case 2:
                            status_text = $.delivery_resources.find_receipt.state2;
                            break;
                        case 3:
                            status_text = $.delivery_resources.find_receipt.state3;
                            break;
                        case 4:
                            status_text = $.delivery_resources.find_receipt.state4;
                            break;
                        case 5:
                            status_text = $.delivery_resources.find_receipt.state5;
                            break;
                        case 6:
                            status_text = $.delivery_resources.find_receipt.state6;
                            break;
                        case 7:
                            status_text = $.delivery_resources.find_receipt.state7;
                            break;
                        case 8:
                            status_text = $.delivery_resources.find_receipt.state8;
                            break;
                        case 9:
                            status_text = $.delivery_resources.find_receipt.state9;
                            break;

                    };

                    $(row).append('<div style="display:table-cell;" class="delivery_label">' + status_text + '</div>');
                    $(dialog).append('<hr class="delivery_hr"/>');

                    var row = addTableRow(dialog);
                    var elem = addField(row, $.delivery_resources.find_receipt.date_send, dateFormat(res.data.SendDate));
                    $(elem).css('margin-right', '26px');
                    addField(row, $.delivery_resources.find_receipt.date_receive, dateFormat(res.data.ReceiveDate));

                    row = addTableRow(dialog);
                    addField(row, $.delivery_resources.find_receipt.warehouse_send, res.data.SenderWarehouseName);
                    addField(row, $.delivery_resources.find_receipt.warehouse_receive, res.data.RecepientWarehouseName);

                    row = addTableRow(dialog);
                    addField(row, $.delivery_resources.find_receipt.phone_number, res.data.SenderWarehousePhone);
                    addField(row, $.delivery_resources.find_receipt.warehouse_address, res.data.RecepientWarehouseAddress);

                    row = addTableRow(dialog);
                    addField(row, null);
                    addField(row, $.delivery_resources.find_receipt.warehouse_work_time, res.data.RecepientWarehouseTimeWork);

                    row = addTableRow(dialog);
                    addField(row, null);
                    addField(row, $.delivery_resources.find_receipt.phone_number, res.data.RecepientWarehousePhone);
                    row.css('border-bottom', '2px solid #E9E9E9');

                    row = addTableRow(dialog);
                    addField(row, $.delivery_resources.find_receipt.count_place, res.data.Sites);
                    addField(row, $.delivery_resources.find_receipt.payment_status, res.data.PaymentStatus == true ? $.delivery_resources.find_receipt.payed : $.delivery_resources.find_receipt.unpaid);
                    row.css('border-bottom', '2px solid #E9E9E9');

                    row = addTableRow(dialog);
                    addField(row, $.delivery_resources.find_receipt.delivery_cost + currency + ':', res.data.TotalCost == null ? '0.00' : res.data.TotalCost.toFixed(2));
                    addField(row, $.delivery_resources.find_receipt.insurance_cost + currencyInsurance + ':', res.data.InsuranceCost == null ? '0.00' : res.data.InsuranceCost.toFixed(2));

                    row = addTableRow(dialog);
                    addField(row, $.delivery_resources.find_receipt.total_discount + currency + ':', res.data.AmountLossesDiscounts == null ? '0.00' : res.data.AmountLossesDiscounts.toFixed(2));
                    addField(row, '<b>' + $.delivery_resources.find_receipt.total_cost + currency + ':' + '</b>', res.data.AllReceiptsTotalCost == null ? '0.00' : res.data.AllReceiptsTotalCost.toFixed(2));


                    $(dialog).append('<div class="delivery_label" style="margin-left:0px; margin-top:18px;">' + $.delivery_resources.find_receipt.message + '</div>');
                    $(dialog).append('<hr style="margin-bottom:16px;" class="delivery_hr"/>');

                    var delivery_print_button = $('<a id="delivery_print_button" class="delivery_button" href="javascript:void(0)">' + $.delivery_resources.find_receipt.print + '</a>');
                    $(dialog).append(delivery_print_button);
                    $(dialog).append('<hr style="border: none;"/>');

                    delivery_print_button.click(function () {
                        printable_area.html("");
                        var content = dialog_parent.clone();
                        var inputArray = $(content).find(".delivery_text_box");

                        for (var i = 0; i < inputArray.length; i++) {
                            $(inputArray[i]).css("padding", "5px").css("margin", "7px").css('font-size', '13px').css('width', 'auto').css('border', '1px solid black');
                        };
                        var labelArray = $(content).find(".delivery_label");

                        for (var i = 0; i < labelArray.length; i++) {
                            $(labelArray[i]).css("margin", "7px").css("padding", "5px").css("overflow", "hidden").css('font-size', '13px');
                        };
                        var print_button = $(content).find("#delivery_print_button");
                        print_button.hide();

                        printable_area.append(content.html());
                        printable_area.printThis({
                            debug: false, //show the iframe for debugging
                            importCSS: true, // import page CSS
                            printContainer: false
                        });
                    });

                    $(dialog_parent).delivery_dialog({
                        width: "auto",
                        title: $.delivery_resources.find_receipt.dialog_title
                    });
                }
                else {
                    show_message($.delivery_resources.find_receipt.receipt_not_found);
                }
            },
            error: errorMessageFunc
        });
    };

    delivery_receipt_number.keypress(function (e) {
        if (e.which == 13) {
            send_request();
            return false;    
        }
    });

    delivery_search_button.click(send_request);

    var addField = function (obj, label, value) {
        if (label != null) {
            var element = $('<div style="display:table-cell" class="delivery_label">' + label + '</div>' +
                            '<input style="display:table-cell" class="delivery_text_box" value="' + value + '"/>');
            $(obj).append(element);
            return element;
        }
        else {
            var element = $('<div style="display:table-cell"></div><div style="display:table-cell"></div>');
            $(obj).append(element);
            return element;
        }

    };

    updateCounter(0);
}
})(jQuery);

function dateFormat(date) {
    var dt = new Date(date.replace(/-/g, "/").replace(/T/g, " ").substring(0, 19));//new Date(date);
    if (dt != 'Invalid Date')
    {
        var day = dt.getDate().toString();
        var month = (dt.getMonth() + 1).toString();
        var year = dt.getFullYear();
        return (day.length == 1 ? '0' : '') + day + '.' + (month.length == 1 ? '0' : '') + month + '.' + year;
    }
    else
    {
        return date;
    }
    
}

function addTableRow(obj) {
    var element = $('<div style="display:table-row;"></div>');
    $(obj).append(element);
    return element;
}

(function ($) {
$.fn.delivery_view_tracking = function (options) {
    var culture = $.delivery_resources.culture;

    var parent_div = $(this);

    var rows = 10;
    if (options.rows != undefined)
        rows = options.rows;

    var type = 'vertical_small';
    if (options != undefined && options.type != undefined)
        type = options.type;

    var name = $(this).attr('id');

    var page = 1;
    var data_rows = null;
    var total_pages = 1;

    $(this).addClass('delivery_panel');
    var delivery_link = $('<a class="delivery_link" href="http://www.delivery-auto.com">www.delivery-auto.com</a>');
    var delivery_child_panel = $('<div class="delivery_child_panel"></div>');
    var delivery_receipt_number = $('<input placeholder="' + $.delivery_resources.find_receipt.input_number_placeholder + '" type="text">');
    var delivery_search_button = $('<a href="javascript:void(0)">' + $.delivery_resources.view_tracking.button_tracking + '</a>');
    var container = $('<div style="float:left;"></div>');

    var delivery_loader = $('<div class="delivery_loader"><b>' + $.delivery_resources.find_receipt.loading + '</b></div>');

    if (type == 'horizontal_small') {
        delivery_child_panel.css("border-top-style", "none");
        $(this).append(delivery_child_panel);

        var delivery_label_title = $('<div class="delivery_label_title"><div class="delivery_label_title_horizontal">' + $.delivery_resources.view_tracking.dialog_title_horizontal + '</div></div>');
        delivery_label_title.css('padding', '0px').css('display', 'inline-block');
        delivery_child_panel.append(delivery_label_title);

        delivery_label_title.append(container);

        container.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main_horizontal');

        //container.append(delivery_link);

        delivery_search_button.css("float", "left");
        delivery_label_title.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main_horizontal');

        delivery_loader.css('top', '-36px');

    } else if (type == 'vertical_large') {
        $(this).append('<div class="delivery_label_title_logo"><img class="delivery_logo" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/></div>');//<div>' + $.delivery_resources.find_receipt.logo_text + '</div></div>');
        $(this).append(delivery_child_panel);

        var sub_title = $('<div class="delivery_sub_title">' + $.delivery_resources.view_tracking.sub_title + '</div>');
        delivery_child_panel.append(sub_title);
        delivery_child_panel.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main');

        delivery_child_panel.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main');

        delivery_child_panel.append(delivery_link);

        delivery_loader.css('top', '-135px');
    }
    else if (type == 'horizontal_large') {
        delivery_child_panel.css("border-top-style", "none");
        $(this).append(delivery_child_panel);

        var delivery_label_title = $('<div class="delivery_label_title"><img class="delivery_logo delivery_logo_horizontal" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/><div class="delivery_label_title_horizontal">' + $.delivery_resources.view_tracking.dialog_title_horizontal + '</div></div>');
        delivery_label_title.css('padding', '0px').css('display', 'inline-block');
        delivery_child_panel.append(delivery_label_title);

        delivery_label_title.append(container);

        container.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main_horizontal');

        //container.append(delivery_link);

        delivery_search_button.css("float", "left");
        delivery_label_title.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main_horizontal');

        var hot_line = $('<div class="delivery_label_title_horizontal"></div>');
        delivery_label_title.append(hot_line);

        hot_line.append('<div class="hot_line">' + $.delivery_resources.find_receipt.hot_line + '</div>');
        hot_line.append('<div class="hot_line_phone">' + $.delivery_resources.find_receipt.hot_line_phone + '</div>');
        hot_line.append('<div class="hot_line_comment">' + $.delivery_resources.find_receipt.hot_line_comment + '</div>');

        delivery_loader.css('top', '-41px');
    }
    else {
        $(this).append('<div class="delivery_label_title">' + $.delivery_resources.view_tracking.dialog_title + '</div>');
        $(this).append(delivery_child_panel);

        delivery_child_panel.append(delivery_receipt_number);
        delivery_receipt_number.addClass('delivery_text_box_main');

        delivery_child_panel.append(delivery_search_button);
        delivery_search_button.addClass('delivery_button_main');

        delivery_child_panel.append(delivery_link);
    };

    $(this).append(delivery_loader);


    //var printable_area = $('<div style="display:none;" ></div>');
    //$(this).append(printable_area);
    var dialog_parent = $('<div id="delivery_dialog_'+name+'" style="display:none; padding:0px;"/>');
    $(this).append(dialog_parent);
    var dialog = $('<div style="border-collapse: collapse; text-align: left; width:auto; border: none; min-height: 70px;" class="delivery_panel_dialog"/>');
    $(dialog_parent).append(dialog);

    var show_message = function (message) {
        dialog.html('');
        dialog.append('<div class="delivery_label">' + message + '</div>');
        $(dialog_parent).delivery_dialog({
            width: "auto",
            title: $.delivery_resources.view_tracking.dialog_title
        });
    };

    function errorMessageFunc(data) {
        delivery_loader.css('visibility', 'hidden');
        parent_div.removeClass('disable');
        alert(data.status.toString() + ' ' + data.statusText);
    };

    var send_request = function () {
        var receipt_number = delivery_receipt_number.val();
        receipt_number = receipt_number.replace(/ /g, "");
        if (receipt_number.length != 10) {
            show_message($.delivery_resources.find_receipt.receipt_not_correct_format);
            return;
        };

        var url = 'http://www.delivery-auto.com/api/Receipts/GetTracking?culture=' + culture + '&number=' + receipt_number + '&page=' + '1' + '&rows=' + '1000';
        $.ajax({
            url: url,
            type: "GET",
            data: {},//data,
            dataType: 'json',

            beforeSend: function (request) {
                parent_div.addClass('disable');
                delivery_loader.css('visibility', 'visible');
            },
            success: function (res) {
                delivery_loader.css('visibility', 'hidden');
                parent_div.removeClass('disable');
                if (res != null && res.rows != null && res.rows.length > 0) {
                    dialog.html('');
                    page = 1;
                    var table = $('<div style="display: table; min-width: 700px"></div>');
                    dialog.append(table);

                    data_rows = res.rows;
                    total_pages = Math.ceil(res.rows.length / rows);

                    set_page(page.toString(), table);

                    if (total_pages > 1) {
                        row = addTableRow(dialog);
                        row.addClass('padding_panel').css('display', 'block');
                        var prev_btn = $('<a value="-1" href="javascript:void();" class="paging_disable">◄</a>').click(function () { paging_click(this, table); });
                        row.append(prev_btn);
                        for (var j = 1; j <= total_pages; j++) {
                            var num_btn = $('<a value="' + j.toString() + '" href="javascript:void();" class="' + (j == 1 ? 'paging_active' : 'paging_disable') + '">' + j.toString() + '</a>').click(function () { paging_click(this, table); });
                            row.append(num_btn);
                        };
                        var next_btn = $('<a value="+1" href="javascript:void();" class="paging_disable">►</a>').click(function () { paging_click(this, table); });
                        row.append(next_btn);
                    };

                    $(dialog_parent).delivery_dialog({
                        width: "auto",
                        title: $.delivery_resources.view_tracking.dialog_title + ' ' + receipt_number
                    });


                }
                else {
                    show_message($.delivery_resources.find_receipt.receipt_not_found);
                }
            },
            error: errorMessageFunc
        });
    };

    delivery_receipt_number.keypress(function (e) {
        if (e.which == 13) {
            send_request();
            return false;    
        }
    });

    delivery_search_button.click(send_request);

    var addCells = function (obj, time, warehouse, operation, type) {
        var class_name = "delivery_cell";
        if (type == "header")
            class_name = "delivery_header";
        var element = $('<div class="' + class_name + '" style="width:20%;">' + dateFormat(time) + '</div>' +
                        '<div class="' + class_name + '" style="width:30%;">' + warehouse + '</div>' +
                        '<div class="' + class_name + '" style="width:50%;">' + operation + '</div>');
        $(obj).append(element);
        return element;
    };

    var paging_click = function (pg, table) {
        set_page($(pg).attr('value'), table);
    };

    var set_page = function(pg, table) {
        if ((pg == '+1' && page == total_pages) || (pg == '-1' && page == 1))
            return;

        if (pg == '+1')
            page++;
        else if (pg == '-1')
            page--;
        else
            page = parseInt(pg);

        var start_index = (page - 1) * rows;

        table.html("");

        dialog.find('.paging_active').removeClass('paging_active').addClass('paging_disable');
        dialog.find('a[value=' + page.toString() + '][class="paging_disable"]').addClass('paging_active');

        row = addTableRow(table);
        addCells(row, $.delivery_resources.view_tracking.time, $.delivery_resources.view_tracking.warehouse, $.delivery_resources.view_tracking.operation, "header");

        
        for (var i = start_index; i < start_index + rows; i++) {
            if (data_rows[i] == undefined)
                break;
            row = addTableRow(table);
            addCells(row, data_rows[i].CreatedOn, data_rows[i].WarehouseName, data_rows[i].OperationName, "cell");
        }
    };
    updateCounter(1);
}
})(jQuery);

(function ($) {
$.fn.delivery_dialog = function (options) {
    //var parent = $(this).parent();
    var name = 'delivery_dialog_' + $(this).attr('id');

    if ($('#'+name))
        $('#'+name).detach();

    var delivery_dialog = $('<div id="' + name + '" class="delivery_dialog" hidden="hidden"></div>');
    $(delivery_dialog).appendTo(document.body);
    //parent.append(delivery_dialog);

    var width = screenWidth();
    var height = screenHeight();

    
    var content = $(this);
    if (options.clone == true) {
        content = $(this).clone();
    };

    var title = $('<div class="delivery_dialog_title"></div>');
    delivery_dialog.append(title);
    var title_text = $('<div class="delivery_dialog_title_text">' + options.title + '</div>');
    title.append(title_text);
    var button = $('<a href="javascript:void(0);" class="delivery_dialog_close_button">X</a>');
    button.click(function () {
        delivery_dialog.detach();
    });
    title.append(button);

    delivery_dialog.append(content.show().css("float", "left").css('clear', 'both'));

    var footer = $('<div class="delivery_dialog_title"></div>');
    delivery_dialog.append(footer);
    var footer_link = $('<a class="delivery_link_footer" href="http://www.delivery-auto.com">www.delivery-auto.com</a>');
    footer.append(footer_link);

    var clientX = 0;
    var clientY = 0;
    var clicking = false;

    title.mousedown(function (event) {
        clientX = event.clientX;
        clientY = event.clientY;
        clicking = true;
    });

    $(document).mouseup(function () {
        clicking = false;
    });
    $(document).mousemove(function () {
        if (clicking == false) return;
        if (window.getSelection) { window.getSelection().removeAllRanges(); }
        else if (document.selection && document.selection.clear)
            document.selection.clear();
    });

    $(document).mousemove(function (event) {
        if (clicking == false) return;

        var offsetX = clientX - event.clientX;
        var offsetY = clientY - event.clientY;
        var left = parseInt(delivery_dialog.css('left'));
        var top = parseInt(delivery_dialog.css('top'));

        left -= offsetX;
        top -= offsetY;

        delivery_dialog.css('left', left.toString() + 'px');
        delivery_dialog.css('top', top.toString() + 'px');

        clientX = event.clientX;
        clientY = event.clientY;
       // $('.movestatus').text('mouse moving');
    });

    delivery_dialog.show();

    var top = Math.ceil(height / 2) - Math.ceil(parseInt(this.css('height')) / 2);
    var left = Math.ceil(width / 2) - Math.ceil(parseInt(this.css('width')) / 2);

    top = top + window.pageYOffset;
    left = left + window.pageXOffset;

    if (top < 0)
        top = 0;
    if (left < 0)
        left = 0;

    delivery_dialog.css('top', top.toString() + 'px');
    delivery_dialog.css('left', left.toString() + 'px');
}
})(jQuery);

var receive = null;

(function ($) {
$.fn.delivery_view_map = function (options) {
    var culture = $.delivery_resources.culture;
    var parent_div = $(this);

    var script = document.createElement('script');
    script.src = 'http://api-maps.yandex.ru/2.0/?load=package.full&mode=debug&lang=' + culture;
   
    document.getElementsByTagName('body')[0].appendChild(script);
    script.onload = function () {
        
        var id = parent_div.attr("id");
        var width = 500;
        if (options.width != undefined)
            width = options.width;
        var height = 350;
        if (options.height != undefined)
            height = options.height;
        var longitude = 50.2700;
        if (options.longitude != undefined)
            longitude = options.longitude;
        var latitude = 30.3124;
        if (options.latitude != undefined)
            latitude = options.latitude;
        var count = 20;
        if (options.count != undefined)
            count = options.count;
        var ip = null;
        if (options.ip != undefined)
            ip = options.ip;

        parent_div.css("width", width.toString() + "px");
        parent_div.css("height", height.toString() + "px");
        parent_div.addClass("delivery_map");

        ymaps.ready(function () {
            var delivery_map = new ymaps.Map(id, {
                center: [longitude, latitude],
                zoom: 4//,
                //type: "yandex#satellite"
            });

            var redMarker = null;

            delivery_map.behaviors.enable('scrollZoom');
            delivery_map.controls
            .add('zoomControl')
            .add('typeSelector');

            var buildWarehouseBaloon = function (item) {
                var privat = "";
                   if (item.WarehouseType == 2) {
                       privat = $('<div class="delivery_postomat_message">').append($('<span>').text($.delivery_resources.calculator.postamat_message));
            }

                var header = $('<div class="delivery_warehouse_title">').attr('id', 'header-container').text(item.name);
                var address = item.address != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.address)).append($('<div class="delivery_label_map">').text(item.address)) : null;
                var phones = item.phone != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.phone)).append($('<div class="delivery_label_map">').text(item.phone)) : null;
                var workingTime = item.working_time != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.work_time)).append($('<div class="delivery_label_map">').text(item.working_time)) : null;
                var info = $('<a class="info_button" style="display: block;" target="_blank" href="http://delivery-auto.com/' + culture + '/Representatives/Details/' + item.id + '">' + $.delivery_resources.view_map.read_more + '</a>');
                return $('<div>').append($('<div>').attr('id', 'baloon-container').append(privat).append(header).append(address).append(phones).append(workingTime).append(info));
            };
            var clearMapGeoObjects = function (map) {
                if (map == undefined)
                    return;
                map.geoObjects.each(function (geoObject) {
                    map.geoObjects.remove(geoObject);
                });
            };

            var load_warehouses = function (culture, longitude, latitude, count) {
                $.get('http://www.delivery-auto.com/api/v4/Public/GetFindWarehouses',
                //{ type: 0, culture: $.delivery_resources.culture, country: country },
                //$.get('http://localhost:51630/api/v4/Public/GetFindWarehouses',
               { culture: culture, Longitude: longitude, Latitude: latitude, count: count },
                function (object, textStatus, jqXHR) {
                    var geoObjectsDataCollection = new ymaps.GeoObjectCollection();
                    var data = object.data;
                    var geoObjectsData = [];
                    for (var i = 0; i < data.length; i++) {
                        var wr_placemark = new ymaps.Placemark([data[i].longitude, data[i].latitude],
                        {
                            clusterCaption: data[i].name,
                            balloonContent: buildWarehouseBaloon(data[i]).html()
                        },
                        {
                            iconImageHref: data[i].WarehouseType == 0 ? (data[i].IsRegionalCentre ? 'http://www.delivery-auto.com/Content/Images/office.png' : 'http://www.delivery-auto.com/Content/Images/store.png') : 'http://www.delivery-auto.com/Content/Images/postamate.png',
                            iconImageSize: [67, 63],
                            iconImageOffset: [-23, -63],
                            balloonCloseButton: false,
                            balloonOffset: [0, -40],
                            hideIconOnBalloonOpen: false
                        });

                        wr_placemark.events.add("balloonopen", function (event) {
                            var bal = event.get("balloon");
                            //ymaps-b-balloon__sprite ymaps-b-balloon__sprite_type_tail
                            $('.ymaps-b-balloon__sprite_type_tail').hide();
                            //  $('.ymaps-b-balloon__tr').hide();
                            //  $('.ymaps-b-balloon__tl').hide();
                        });

                        wr_placemark.events.add('click', function (e) {
                            if (redMarker != null) {
                                redMarker.options.set('iconImageHref', redMarker.options.get('iconImageHref').replace('ered.', 'e.'));
                            }

                            var placemark = e.get('target');
                            if (placemark.balloon && !placemark.balloon.isOpen()) {
                                redMarker = placemark;
                                redMarker.options.set('iconImageHref', redMarker.options.get('iconImageHref').replace('e.', 'ered.'));
                            }
                        });

                        geoObjectsData[i] = wr_placemark;
                        geoObjectsDataCollection.add(wr_placemark);
                    }
                    delivery_map.geoObjects.add(geoObjectsDataCollection);
                    delivery_map.setBounds(geoObjectsDataCollection.getBounds());

                    var clusterer = new ymaps.Clusterer({ maxZoom: [16], clusterDisableClickZoom: false, openBalloonOnClick: true });
                    clusterer.add(geoObjectsData);
                    clearMapGeoObjects(delivery_map);
                    delivery_map.geoObjects.add(clusterer);

                    var logo = $('<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="logo_map delivery_logo">');
                    logo.css('top', '-' + (height - 10) + 'px');
                    logo.css("height", "36px");
                    parent_div.append(logo);

                }).error(function () {
                    //showDialog('Error', '@Delivery.Web.App_GlobalResources.GlobalStrings.DefaultErrorMessage');
                });

            };

            if(ip != null)
            {
             /*   $.get('http://ipinfo.io/'+ip+'/json', {  },
                    function (object, textStatus, jqXHR) {
                        try{
                            var locArr = object.loc.split(',');
                            longitude = parseFloat(locArr[0]);
                            latitude = parseFloat(locArr[1]);
                        }
                        catch(ex){}
                        load_warehouses($.delivery_resources.culture, longitude, latitude, count);
                    });*/

                receive = function(object) {
                    try {
                        longitude = parseFloat(object.latitude);
                        latitude = parseFloat(object.longitude);
                    }
                    catch (ex) { }
                    load_warehouses($.delivery_resources.culture, longitude, latitude, count);
                };

                $.ajax({
                    url: 'http://api.ipinfodb.com/v3/ip-city/?key=8f7e9d6d2bceeba809a99da70bfaeb9e2d739bc21ce99bcd5ca4070d704237f2&format=json&ip=' + ip + '&callback=receive?',
                    type: 'GET',
                    crossDomain: true, // enable this
                    dataType: 'jsonp',
                    jsonpCallback: "receive",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    }
                });
                
            }
            else
            {
                load_warehouses($.delivery_resources.culture, longitude, latitude, count);
            }
        });    
    };
    updateCounter(2);
}
})(jQuery);



function toggle_panel (obj) {
    $(obj).parent().find('.delivery_du_panel').slideToggle("slow");
}

(function ($) {
    $.fn.delivery_calculator = function (options) {

        var culture = $.delivery_resources.culture;
        var parent_div = $(this);

        var settings = options.initial_settings;
        if (settings == undefined)
            settings = {};

        var display_none = "display:none;";
        if (settings.isDebug == true)
            display_none = "";

        var type = 'vertical_small';
        if (options != undefined && options.type != undefined)
            type = options.type;

        var app = $('<div ng-app="delivery_app" class="delivery_panel"></div>');
        parent_div.append(app);

        if (type == 'vertical_large')
        {
            var title = $('<div class="delivery_label_title_logo"><img class="delivery_logo" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/></div>');//<div>' + $.delivery_resources.find_receipt.logo_text + '</div></div>');
            app.append(title);
        }
        else
        {
            var title = $('<div class="delivery_label_title">' + $.delivery_resources.calculator.dialog_title + '</div>');
            app.append(title);
        }


        var script = document.createElement('script');
        script.src = 'http://api-maps.yandex.ru/2.0/?load=package.full&mode=debug&lang=' + culture;
        document.getElementsByTagName('body')[0].appendChild(script);

        var form = $('<form name="deliv_frm" class="delivery-form" ng-controller="delivery_controller" novalidate></form>');
        app.append(form);
        var controller = $('<div class="delivery_child_panel" style="display: inline-block; width:500px;"></div>').css('text-align', 'left');
        form.append(controller);

        var add_tooltip = function (obj, parameter) {
            var span = $('<span class="tooltip" style="float:left; clear:both;"></span>');
            span.append(obj);
            span.append('<span ng-show="deliv_frm.' + parameter.replace('.', '_') + '_{{$index}}n.$invalid">' +
                     '<span ng-show="deliv_frm.' + parameter.replace('.', '_') + '_{{$index}}n.$error.required">' + $.delivery_resources.calculator.error_require + '</span>' +
                     '<span ng-show="deliv_frm.' + parameter.replace('.', '_') + '_{{$index}}n.$error.min">' + $.delivery_resources.calculator.error_min + '</span>' +
                     '<span ng-show="deliv_frm.' + parameter.replace('.', '_') + '_{{$index}}n.$error.max">' + $.delivery_resources.calculator.error_max + '</span>' +
                     '<span ng-show="deliv_frm.' + parameter.replace('.', '_') + '_{{$index}}n.$error.number">' + $.delivery_resources.calculator.error_number + '</span>' +
                     '<span ng-show="deliv_frm.' + parameter.replace('.', '_') + '_{{$index}}n.$error.pattern">' + $.delivery_resources.calculator.error_pattern + '</span>' +

                     '</span>');

            return span;
        };

        var add_drop_down = function (obj, label, parameter, function_name, array, fl_show) {
            var parent_div = $('<div style="float:left;' + (fl_show != undefined ? display_none : '') + '"></div>');
            $(obj).append(parent_div);
            var label = $('<div class="delivery_label">' + label + '</div>').css('margin-bottom', '0px');
            parent_div.append(label);
            //  var select = $('<select class="delivery_drop_down"  name="' + parameter.replace('.', '_') + '_{{$index}}n" ng-model="' + parameter + '" ng-change="' + function_name + '()" required>' +
            //           '<option ng-repeat="item in ' + array + '" value="{{item.id}}">{{item.name}}</option></select>').css('margin-top', '0px');
            var select = $('<select class="delivery_drop_down"  name="' + parameter.replace('.', '_') + '_{{$index}}n" ng-options="t.id as t.name for t in ' + array + '" ng-model="' + parameter + '" ng-change="' + function_name + '()" required></select>').css('margin-top', '0px');;
            parent_div.append(add_tooltip(select, parameter));
            return parent_div;
        };

        var add_input = function (obj, label, parameter, additional_parameters, width, container_behavor, fl_show) {
            var parent_div = $('<div style="float:left;' + (fl_show != undefined ? display_none : '') + '" ' + container_behavor + '></div>');
            $(obj).append(parent_div);
            var label = $('<div  style="float:left;" class="delivery_label">' + label + '</div>').css('margin-bottom', '0px');
            parent_div.append(label);
            var span = $('<span class="tooltip" style="float:left; clear:both;"></span>');
            parent_div.append(span);
            var input = $('<input class="delivery_text_box_calc" ng-model="' + parameter + '" name="' + parameter.replace('.', '_') + '_{{$index}}n" ' + additional_parameters + '/>').css('margin-top', '0px');
            if (width != undefined)
                input.css('width', width + 'px');
            parent_div.append(add_tooltip(input, parameter));

            return parent_div;
        };

        var add_checkbox = function (obj, label, parameter, additional_parameters, width, container_behavor, fl_show) {
            var parent_div = $('<div style="float:left;' + (fl_show != undefined ? display_none : '') + '" ' + container_behavor + '></div>');
            $(obj).append(parent_div);
            var input = $('<input class="delivery_checkbox" type="checkbox" ng-model="' + parameter + '" ' + additional_parameters + '/>');
            parent_div.append(input);
            var label = $('<div  style="float:left;" class="delivery_label">' + label + '</div>').css('margin-left', '0px');
            parent_div.append(label);
            return parent_div;
        };
        var line_break = function (obj) {
            var div = $('<div style="float:left; clear:both;"></div>');
            $(obj).append(div);
            return div;
        };

        var bold_div = function (obj) {
            var div = $('<div style="font-weight:bold;"><div>');
            $(obj).append(div);
            return div;
        };

        var add_result_row = function (obj, label, parameter) {
            var parent_div = $('<div class="delivery_label" style="float:left; clear:both;">' + label + '</div>' +
                               '<div class="delivery_label" style="width: 90px; float: right;">{{' + parameter + ' | number:2}}{{data.currencyStr}}</div>');
            $(obj).append(parent_div);
            return parent_div;
        };
        var add_economy = function (obj, label, parameter) {
            var parent_div = $('<div ng-show="' + parameter + '>0"></div>');
            $(obj).append(parent_div);
            var label = $('<div class="delivery_label" style="float: left; clear: both; margin-left: 25px;">' + label + '</div>');
            parent_div.append(label);
            var input = $('<div class="delivery_label" style="width: 110px; float: right;">{{' + parameter + ' | number:2}}{{data.currencyStr}}</div>');
            parent_div.append(input);
            return parent_div;
        };

        var delivery_loader = $('<div class="delivery_loader"><b>' + $.delivery_resources.find_receipt.loading + '</b></div>').css("top", "-26px");

        add_drop_down(controller, $.delivery_resources.calculator.city_send, 'data.areasSendId', 'SitySendChange', 'SityList', settings.citySendId == undefined ? settings.citySend : settings.citySendId);
        add_drop_down(controller, $.delivery_resources.calculator.warehouse_send, 'data.warehouseSendId', 'WarehouseSendChange', 'WarehouseSendList', settings.warehouseSendId == undefined ? settings.warehouseSend : settings.warehouseSendId);
        line_break(controller);

        add_drop_down(controller, $.delivery_resources.calculator.city_receive, 'data.areasResiveId', 'SityReceiveChange', 'SityList', settings.cityReceiveId == undefined ? settings.cityReceive : settings.cityReceiveId);
        add_drop_down(controller, $.delivery_resources.calculator.warehouse_receive, 'data.warehouseResiveId', 'WarehouseReceiveChange', 'WarehouseReceiveList', settings.warehouseReceiveId == undefined ? settings.warehouseReceive : settings.warehouseReceiveId).find("select").css("width", "197px");
        var map_icon = $('<a class="delivery_map_icon" href="javascript:void(0)" ng-click="ShowMap();"></a>');
        controller.append(map_icon);

        line_break(controller);

        add_drop_down(controller, $.delivery_resources.calculator.pay_currency, 'data.currency', 'CurrencyChange', 'CurrencyList', settings.currency);
        add_drop_down(controller, $.delivery_resources.calculator.delivery_scheme, 'data.deliveryScheme', null, 'DeliverySchemeList').attr("ng-hide", "data.onlyOneScheme");
        line_break(controller);

        add_input(controller, $.delivery_resources.calculator.date_send, 'data.dateSend', 'type="date" required', undefined, undefined, settings.dateSend);
        line_break(controller);
        var InsuranceValue = add_input(controller, $.delivery_resources.calculator.inshurance_cost, 'data.InsuranceValue', 'type="number" min="0" required ng-blur="reloadInsuranceCost()"', undefined, undefined, settings.InsuranceValue);

        var InsuranceCost = $('<div class="delivery_label" style="float:left;" ng-show="data.InsuranceCost>0">{{data.InsuranceCost | number:2}}{{data.currencyStr}}</div>');
        InsuranceValue.append(InsuranceCost);

        add_input(controller, $.delivery_resources.calculator.cash_on_delvery, 'data.CashOnDeliveryValue', 'type="number" required', undefined, undefined, settings.cashOnDelivery != undefined || settings.banDelivery == true ? 1 : undefined);
        
        line_break(controller);
        add_input(controller, $.delivery_resources.calculator.climbing_to_floor, 'data.climbingToFloor', 'type="number" required min="0" max="40"', undefined, undefined, undefined).attr("ng-show", "data.deliveryScheme==1 || data.deliveryScheme==2");

        

        var cargo = $('<div class="delivery_eg_panel" style="float:left; clear:both;' + (((settings.cargo != undefined && settings.cargo.length > 0) || settings.cargo_url != undefined) ? display_none : '') + '" ng-repeat=" eg in data.category" ></div>');
        controller.append(cargo);
        var deleteButton = $('<div style="float:right;" ng-click=" remove(data.category, $index)" ng-hide="$index==0"><a class="delivery_dialog_close_button" style="margin:3px;"><b>X</b></div>');
        cargo.append(deleteButton);
        add_drop_down(cargo, $.delivery_resources.calculator.tarif_category, 'eg.categoryId', "changeCargoCategory(data.category, $index)", 'TariffCategoryList');

        add_input(cargo, $.delivery_resources.calculator.count_places, "eg.countPlace", 'type="number" min="1" max="100" required ng-readonly="data.isPostamat"', 95, 'ng-show="eg.show_count"');
        add_input(cargo, $.delivery_resources.calculator.cargo_weight, "eg.helf", 'type="number" min="0" max="9999" required', 95, 'ng-show="eg.show_helf"');
        add_input(cargo, $.delivery_resources.calculator.length, "eg.length", 'type="number" min="1" max="1000" ng-pattern="regexInteger" ng-blur="onblurSize(data.category, $index)"', 95, 'ng-show="eg.show_size"').css("clear", "both").css('margin-left', '24px');

        add_input(cargo, $.delivery_resources.calculator.width, "eg.width", 'type="number" min="1" max="1000" ng-pattern="regexInteger" ng-blur="onblurSize(data.category, $index)"', 95, 'ng-show="eg.show_size"');
        add_input(cargo, $.delivery_resources.calculator.height, "eg.height", 'type="number" min="1" max="1000" ng-pattern="regexInteger" ng-blur="onblurSize(data.category, $index)"', 95, 'ng-show="eg.show_size"');
        add_input(cargo, $.delivery_resources.calculator.carho_size, "eg.size", 'type="number" min="0" max="9999" required ng-readonly="data.isPostamat"', 95, 'ng-show="eg.show_size"');

        add_checkbox(cargo, $.delivery_resources.calculator.economcal_tarif, "eg.isEconom", ' ng-change="economClick(data.category, $index)" ', undefined, 'ng-show="eg.show_econom"');

        var add_category = $('<div class="delivery_eg_panel"><a class="delivery_button_calculator" style="float:left; clear:both; line-height:inherit; ' + (settings.cargo != undefined && settings.cargo.length > 0 ? display_none : '') + '" ng-hide="data.isPostamat" ng-click="add(data.category)">' + $.delivery_resources.calculator.add_category + '</a></div>');
        controller.append(add_category);

        var dopUslugaClassificator = $('<div style="float:left; clear:both; width:100%;" ng-repeat="du_cl in data.dopUslugaClassificator"></div>');
        controller.append(dopUslugaClassificator);
        var classificatorLabel = $('<div class="delivery_accordion" ng-bind="du_cl.name" onclick="toggle_panel(this);"></div>');
        dopUslugaClassificator.append(classificatorLabel);
        var classificatorPanel = $('<div class="delivery_du_panel" style="display:none;"></div>');
        dopUslugaClassificator.append(classificatorPanel);
        var duRow = $('<div class="tooltip" style="display:table-row;" ng-repeat="du in du_cl.dopUsluga"></div>');
        classificatorPanel.append(duRow);
        var duHiddenInformation = $('<div style="display:none">{{du.uslugaId}}</div><div style="display:none">{{du.cost}}</div>');
        duRow.append(duHiddenInformation);
        var duIformation = $('<div class="delivery_label" style="width:50%; display: table-cell; text-align:left;">{{du.name}}</div>' +
                             '<div class="delivery_label" style="width: 17%;  display: table-cell; text-align: left; ">{{du.cost | number:2}}{{data.currencyStr}}</div>' +
                             '<div class="tooltip" style="width:17%; display: table-cell;"><input class="delivery_text_box_du_count" name="du_count_{{$index}}_{{$parent.$index}}n" ng-model="du.count" type="number"  min="0" max="{{$parent.$index==1 ? 1 : 100}}" />' +
                             '<span ng-show="deliv_frm.du_count_{{$index}}_{{$parent.$index}}n.$invalid">' +
                             '<span ng-show="deliv_frm.du_count_{{$index}}_{{$parent.$index}}n.$error.min">' + $.delivery_resources.calculator.error_min + '</span>' +
                             '<span ng-show="deliv_frm.du_count_{{$index}}_{{$parent.$index}}n.$error.max">' + $.delivery_resources.calculator.error_max + '</span>' +
                             '<span ng-show="deliv_frm.du_count_{{$index}}_{{$parent.$index}}n.$error.number">' + $.delivery_resources.calculator.error_number + '</span>' +
                             '</span></div><div class="delivery_label" style="width: 17%;  display: table-cell; text-align: left; ">{{du.cost * du.count | number:2}}{{data.currencyStr}}</div>');

        duRow.append(duIformation);

        var clculateButton = $('<a class="delivery_button_calculator" style="float:left; clear:both;" ng-click="send(data)">' + $.delivery_resources.calculator.calculate + '</a>');
        clculateButton.css('line-height', 'inherit');
        controller.append(clculateButton);

        var message_dialog = $('<div id="message_dialog" class="delivery_message"></div>');
        var delivery_calculator_map = $('<div id="delivery_calculator_map" style="width:700px; height:400px; display:none;"></div>');

        controller.append(message_dialog);
        controller.append(delivery_calculator_map);

        var delivery_map = null;
        var redMarker = null;

        script.onload = function () {
            ymaps.ready(function () {
                delivery_map = new ymaps.Map("delivery_calculator_map", {
                    center: [50, 2700, 30, 3124],
                    zoom: 4//,
                    //type: "yandex#satellite"
                });
                delivery_map.behaviors.enable('scrollZoom');
                delivery_map.controls
                .add('zoomControl')
                .add('typeSelector');

            });
        };

        var calculate_dialog = $('<div id="calculate_dialog" class="delivery_panel_dialog" style="width: 580px; float:left; clear:both; text-align:left; display:none;"></div>');
        controller.append(calculate_dialog);

        calculate_dialog.append('<div class="delivery_calculator_result_message" ng-bind="result.message" ng-show="result.messageCode==101"></div>');

        var bold1 = bold_div(calculate_dialog);
        add_result_row(bold1, $.delivery_resources.calculator.cost_war_war, 'result.SummaryTransportCost');
        add_result_row(bold1, $.delivery_resources.calculator.cost_formalization, 'result.SummaryOformlenieCost');
        add_result_row(bold1, $.delivery_resources.calculator.cost_insuranse, 'result.InsuranceCost');
        add_result_row(bold1, $.delivery_resources.calculator.cost_total_economy, 'result.EconomySummary');

        var economy_panel = $('<div style="float: left; clear: both; width:100%;"></div>');
        calculate_dialog.append(economy_panel);
        add_economy(economy_panel, $.delivery_resources.calculator.cost_tarif_economy, 'result.EconomyEconomTarifValuta');
        add_economy(economy_panel, $.delivery_resources.calculator.cost_stock_economy, 'result.EconomyAktsiyaValuta');
        add_economy(economy_panel, $.delivery_resources.calculator.cost_weight_economy, 'result.EconomyVesovojTarifValuta');
        
        var bold2 = bold_div(calculate_dialog);
        add_result_row(bold2, $.delivery_resources.calculator.cost_add_services, 'result.SummaryDuCost');

        var du_array = $('<div style="float: left; clear: both; width:100%;" ng-repeat="du in result.dus">'+
                            '<div class="delivery_label" style="margin-left: 25px; float: left; clear: both;" ng-bind="du.Name"></div>' +
                            '<div class="delivery_label" style="width: 110px; float: right;">{{du.SummaryCost | number:2}}{{data.currencyStr}}</div>'+
                            '<div class="delivery_label" style="width: 50px; float: right;">{{du.Count | number:0}}' + $.delivery_resources.calculator.unit + '</div>' +
                        '</div>');
        calculate_dialog.append(du_array);

        var total_cost = $('<div style="font-weight:bold;">'+
                            '<div class="delivery_label" style="float: left; clear: both;">' + $.delivery_resources.calculator.date_arrival + '{{result.dateResive | date:\'dd.MM.yyyy\'}}</div>' +
                            '<div class="delivery_label" style="width: 90px; float: right;">{{result.allSumma | number:2}}{{data.currencyStr}}</div>'+
                            '<div class="delivery_label" style="float: right;">' + $.delivery_resources.calculator.total + '</div>'+
                        '</div>');

        calculate_dialog.append(total_cost);

        form.append(delivery_loader);

        var app = angular.module('delivery_app', []);
        app.controller('delivery_controller', function ($scope) {
            $scope.data = {};
            $scope.data.category = [];
              
            $scope.data.InsuranceValue = settings.InsuranceValue == undefined ? 0 : settings.InsuranceValue;
            $scope.data.isPostamat = false;

            var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;

            $scope.data.dateSend = settings.dateSend == undefined ? new Date() : new Date(settings.dateSend.replace(pattern, '$3-$2-$1'));
            $scope.data.CashOnDeliveryValue = settings.cashOnDelivery == undefined ? 0 : settings.cashOnDelivery;
            $scope.data.CashOnDeliveryValuta = 100000000;
            $scope.data.climbingToFloor = 0;

            $scope.regexInteger = /^[0-9]{1,4}$/;
            $scope.regexDate = /^[0-9]{2,2}.[0-9]{2,2}.[0-9]{2,2}$/;

            var delivery_url = 'http://www.delivery-auto.com/api/v4/Public/';
            //var delivery_url = 'http://localhost:51630/api/v4/Public/';

            var GetDropDownListAjax = function (url, data, success) {
                $.ajax({
                    url: url,
                    type: "GET",
                    //  dataType: 'json',
                    data: data,
                    success: function (data) {
                        var result = null;
                        if (data.status == true) {
                            if (data.data == undefined)
                                result = data;
                            else
                                result = data.data;
                        }
                        else if (data.status == undefined) {
                            result = data;
                            if (success != undefined)
                                success(data);
                        }
                        if (result == null)
                            return;
                        if (success != undefined)
                            success(result);
                    },
                    error: function (data) {
                        alert(data.status.toString() + ' ' + data.statusText);
                    }
                });
            };

            var getCity = function () {

                var data = {
                    culture: culture,
                    fl_all: true,
                    include_region_name: true
                };

                GetDropDownListAjax(delivery_url + 'GetAreasList', data, function (data) {
                    $scope.SityList = data;
                    if (data.length > 0) {
                        $scope.data.areasSendId = settings.citySendId == undefined ? data[0].id : settings.citySendId;
                        $scope.data.areasResiveId = settings.cityReceiveId == undefined ? data[0].id : settings.cityReceiveId;
                    }
                    //$scope.$digest();
                    //$scope.$digest();
                    $scope.$apply();
                    $scope.SitySendChange(true);
                    $scope.SityReceiveChange(true);
                    reloadCurrency();
                });
            };

            
            var init_cargo = function()
            {
                if (settings.cargo != undefined)
                {
                    for(i=0; i<settings.cargo.length; i++)
                    {
                        var obj = { "countPlace": 1, "categoryId": "00000000-0000-0000-0000-000000000000", "helf": 0, "size": 0, "show_count": true, "show_helf": true, "show_size": true, "show_econom": true };

                        if (settings.cargo[i].count != undefined)
                            obj.countPlace = settings.cargo[i].count;
                        if (settings.cargo[i].categoryId != undefined)
                            obj.categoryId = settings.cargo[i].categoryId;
                        if (settings.cargo[i].weight != undefined)
                            obj.helf = settings.cargo[i].weight;
                        if (settings.cargo[i].size != undefined)
                            obj.size = settings.cargo[i].size;
                        if (settings.cargo[i].isEconom != undefined)
                            obj.isEconom = settings.cargo[i].isEconom;
                        $scope.data.category.push(obj);
                    }
                }
                else
                {
                    var obj = { "countPlace": 1, "categoryId": "00000000-0000-0000-0000-000000000000", "helf": 0, "size": 0, "show_count": true, "show_helf": true, "show_size": true, "show_econom": true };

                    $scope.data.category.push(obj);
                }

            };

            if (settings.cargo_url != undefined)
            {
                $.ajax({
                    url: settings.cargo_url,
                    type: "GET",
                    dataType: 'json',
                    success: function (data) {
                        settings.cargo = data;
                        init_cargo();
                    },
                    error: function (data) {
                        alert($.delivery_resources.calculator.cargo_error);
                    }
                });
            }
            else
                init_cargo();

            if (settings.citySend != undefined || settings.cityReceive != undefined || settings.warehouseSend != undefined || settings.warehouseReceive != undefined) {
                var data = {
                    CitySend: settings.citySend == undefined ? "" : settings.citySend,
                    CityReceive: settings.cityReceive == undefined ? "" : settings.cityReceive,
                    WarehouseSend: settings.warehouseSend == undefined ? "" : settings.warehouseSend,
                    WarehouseReceive: settings.warehouseReceive == undefined ? "" : settings.warehouseReceive,
                };

                $.ajax({
                    url: delivery_url + 'GetIdsFromName',
                    type: "GET",
                    //  dataType: 'json',
                    data: data,
                    success: function (data) {

                        if (data.citySendId != null)
                            settings.citySendId = data.citySendId;
                        if (data.cityReceiveId != null)
                            settings.cityReceiveId = data.cityReceiveId;
                        if (data.warehouseSendId != null)
                            settings.warehouseSendId = data.warehouseSendId;
                        if (data.warehouseReceiveId != null)
                            settings.warehouseReceiveId = data.warehouseReceiveId;

                        getCity();
                    },
                    error: function (data) {
                        alert(data.status.toString() + ' ' + data.statusText);
                    }
                });
            }
            else {
                getCity();
            };

            $scope.ShowMap = function() {

                var buildWarehouseBaloon = function (item) {
                    var privat = "";
                    if (item.WarehouseType == 2) {
                        privat = $('<div  class="delivery_postomat_message">').append($('<span>').text($.delivery_resources.calculator.postamat_message));
                    }

                    var header = $('<div class="delivery_warehouse_title">').attr('id', 'header-container').text(item.name);
                    var address = item.address != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.address)).append($('<div class="delivery_label_map">').text(item.address)) : null;
                    var phones = item.phone != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.phone)).append($('<div class="delivery_label_map">').text(item.phone)) : null;
                    var workingTime = item.working_time != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.work_time)).append($('<div class="delivery_label_map">').text(item.working_time)) : null;
                    var info = $('<a class="info_button" style="display: block;" target="_blank" href="http://delivery-auto.com/' + culture + '/Representatives/Details/' + item.id + '">' + $.delivery_resources.view_map.read_more + '</a>');
                    return $('<div>').append($('<div>').attr('id', 'baloon-container').append(privat).append(header).append(address).append(phones).append(workingTime).append(info));
                };
                var clearMapGeoObjects = function (map) {
                    if (map == undefined)
                        return;
                    map.geoObjects.each(function (geoObject) {
                        map.geoObjects.remove(geoObject);
                    });
                };

                 $.get('http://www.delivery-auto.com/api/v4/Public/GetFindWarehouses',
                //$.get('http://localhost:51630/api/v4/Public/GetFindWarehouses',
                    { culture: culture, Longitude: 0, Latitude: 0, count: 1000, CityId: $scope.data.areasResiveId },
                function (object, textStatus, jqXHR) {
                    var geoObjectsDataCollection = new ymaps.GeoObjectCollection();
                    var data = object.data;
                    var geoObjectsData = [];
                    redMarker = null;
                    for (var i = 0; i < data.length; i++) {
                        var wr_placemark = new ymaps.Placemark([data[i].longitude, data[i].latitude],
                        {
                            clusterCaption: data[i].name,
                            balloonContent: buildWarehouseBaloon(data[i]).html()
                        },
                        {
                            iconImageHref: data[i].WarehouseType == 0 ? (data[i].IsRegionalCentre ? 'http://www.delivery-auto.com/Content/Images/office.png' : 'http://www.delivery-auto.com/Content/Images/store.png') : 'http://www.delivery-auto.com/Content/Images/postamate.png',
                            iconImageSize: [67, 63],
                            iconImageOffset: [-23, -63],
                            balloonCloseButton: false,
                            balloonOffset: [0, -40],
                            hideIconOnBalloonOpen: false
                        });
                        if (data[i].id == $scope.data.warehouseResiveId)
                        {
                            redMarker = wr_placemark;
                            redMarker.options.set('iconImageHref', redMarker.options.get('iconImageHref').replace('e.', 'ered.'));
                        }

                        wr_placemark.events.add("balloonopen", function (event) {
                            var bal = event.get("balloon");
                            //ymaps-b-balloon__sprite ymaps-b-balloon__sprite_type_tail
                            $('.ymaps-b-balloon__sprite_type_tail').hide();
                            //  $('.ymaps-b-balloon__tr').hide();
                            //  $('.ymaps-b-balloon__tl').hide();
                        });

                        wr_placemark.events.add('click', function (e) {
                            if (redMarker != null) {
                                redMarker.options.set('iconImageHref', redMarker.options.get('iconImageHref').replace('ered.', 'e.'));
                            }

                            var placemark = e.get('target');
                            if (placemark.balloon && !placemark.balloon.isOpen()) {
                                redMarker = placemark;
                                redMarker.options.set('iconImageHref', redMarker.options.get('iconImageHref').replace('e.', 'ered.'));
                            }
                        });

                        geoObjectsData[i] = wr_placemark;
                        geoObjectsDataCollection.add(wr_placemark);
                    }
                    if (data.length > 0)
                    {
                        if (redMarker == null) {
                            delivery_map.geoObjects.add(geoObjectsDataCollection);
                            delivery_map.setBounds(geoObjectsDataCollection.getBounds());
                        }
                        else
                            delivery_map.setCenter(redMarker.geometry.getCoordinates());

                        delivery_map.setZoom(16);

                        var clusterer = new ymaps.Clusterer({ maxZoom: [16], clusterDisableClickZoom: false, openBalloonOnClick: true });
                        clusterer.add(geoObjectsData);
                        clearMapGeoObjects(delivery_map);
                        delivery_map.geoObjects.add(clusterer);

                        delivery_calculator_map.delivery_dialog({
                            width: "auto",
                            title: $.delivery_resources.calculator.dialog_title,
                            clone: false
                        });
                    }
                    else
                    {
                        $('#message_dialog').html($.delivery_resources.calculator.message_no_warehouse);
                        $('#message_dialog').delivery_dialog({
                            width: "auto",
                            title: $.delivery_resources.calculator.dialog_title,
                            clone: true
                        });
                    }
                    

                }).error(function () {
                    //showDialog('Error', '@Delivery.Web.App_GlobalResources.GlobalStrings.DefaultErrorMessage');
                });

            }

            $scope.SitySendChange = function (fl_init) {
                var data = {
                    culture: culture,
                    CityId: $scope.data.areasSendId,
                    DirectionType: 0
                };

                GetDropDownListAjax(delivery_url + 'GetWarehousesListByCity', data, function (data) {
                    $scope.WarehouseSendList = data;
                    if (data.length > 0)
                        $scope.data.warehouseSendId = settings.warehouseSendId == undefined ? data[0].id : settings.warehouseSendId;
                    $scope.$digest();
                    $scope.WarehouseSendChange();
                });
                if (!fl_init) {
                    reloadCurrency();
                    reloadDeliveryScheme();
                }
            };
            $scope.SityReceiveChange = function (fl_init) {
                var data = {
                    culture: culture,
                    CityId: $scope.data.areasResiveId,
                    DirectionType: 1
                };

                GetDropDownListAjax(delivery_url + 'GetWarehousesListByCity', data, function (data) {
                    $scope.WarehouseReceiveList = data;
                    if (data.length > 0)
                        $scope.data.warehouseResiveId = settings.warehouseReceiveId == undefined ? data[0].id : settings.warehouseReceiveId;
                    $scope.$digest();
                    $scope.WarehouseReceiveChange();
                });
                if (!fl_init)
                    reloadCurrency();
            };
            var reloadCurrency = function () {
                if ($scope.data.areasSendId == undefined || $scope.data.areasResiveId == undefined)
                    return;
                var data = {
                    culture: culture,
                    CitySendId: $scope.data.areasSendId,
                    CityReceiveId: $scope.data.areasResiveId,
                    PayerType: 2,
                    PayerId: null
                };

                GetDropDownListAjax(delivery_url + 'GetCurrency', data, function (data) {
                    $scope.CurrencyList = data;
                    if (data.length > 0)
                        $scope.data.currency = settings.currency == undefined ? data[0].id : settings.currency;
                    $scope.$digest();
                    $scope.CurrencyChange();
                });
            };

            var reloadDeliveryScheme = function () {
                if ($scope.data.areasSendId == undefined || $scope.data.areasResiveId == undefined || $scope.data.warehouseResiveId == undefined)
                    return;
                var data = {
                    culture: culture,
                    CitySendId: $scope.data.areasSendId,
                    CityReceiveId: $scope.data.areasResiveId,
                    WarehouseReceiveId: $scope.data.warehouseResiveId
                };

                GetDropDownListAjax(delivery_url + 'GetDeliveryScheme', data, function (result) {
                    var data = [];
                    for (i = 0; i < result.length; i++) {
                        if (settings.pickup != true || result[i].id == "1" || result[i].id == "3")
                            data.push(result[i]);
                    }
                    $scope.DeliverySchemeList = data;
                    if (data.length > 0)
                        $scope.data.deliveryScheme = data[0].id;
                    $scope.data.onlyOneScheme = data.length == 1 ? true : false;
                    $scope.$digest();
                });

                GetDropDownListAjax(delivery_url + 'GetTariffCategory', data, function (data) {
                    $scope.TariffCategoryList = data;
                    if (data.length > 0) {
                        if (data[0].id == '5c88e93b-73f8-e411-a12e-000d3a200160' ||
                            data[0].id == '79476428-73f8-e411-a12e-000d3a200160' ||
                            data[0].id == 'defe301c-73f8-e411-a12e-000d3a200160') {
                            var first_categoty = $scope.data.category[0];
                            $scope.data.category = [];
                            $scope.data.category.push(first_categoty);
                            $scope.data.isPostamat = true;
                        }
                        else
                            $scope.data.isPostamat = false;
                        for (i = 0; i < $scope.data.category.length; i++) {
                            var fl_find = false;
                            if (settings.cargo[i].categoryId != undefined) {
                                for (j = 0; j < data.length; j++) {
                                    if (settings.cargo[i].categoryId == data[j].id) {
                                        fl_find = true;
                                        break;
                                    }
                                }
                            }
                            $scope.data.category[i].categoryId = fl_find == true ? settings.cargo[i].categoryId : ($scope.data.isPostamat == true ? 'defe301c-73f8-e411-a12e-000d3a200160' : data[0].id);
                            $scope.changeCargoCategory($scope.data.category, i);
                        }
                        $scope.$digest();
                    }

                });
            };

            $scope.reloadInsuranceCost = function () {
                $scope.data.InsuranceCost = 0;
                if ($scope.data.warehouseResiveId == undefined)
                    return;
                var data = {
                    culture: culture,
                    CitySendId: $scope.data.areasSendId,
                    CityReceiveId: $scope.data.areasResiveId,
                    WarehouseSendId: $scope.data.warehouseSendId,
                    WarehouseReceiveId: $scope.data.warehouseResiveId,
                    InsuranceValue: $scope.data.InsuranceValue,
                    InsuranceCurrency: $scope.data.currency
                };

                GetDropDownListAjax(delivery_url + 'GetInsuranceCost', data, function (data) {
                    $scope.data.InsuranceValue = data.MinValue;
                    $scope.data.InsuranceCost = data.Value;
                    $scope.$digest();
                });
            };

            $scope.onblurSize = function (array, index) {

                var length = array[index].length;
                var width = array[index].width;
                var height = array[index].height;
                var size = length / 100 * width / 100 * height / 100;
                var rezult = "";
                if (!isNaN(size)) {
                    if (size < 0.01) { size = 0.01; }
                    rezult = size.toFixed(2).toString().replace(".", ",");
                    array[index].size = size;
                    $scope.$digest();
                }
            };

            $scope.economClick = function (array, index) {
                var value = array[index].isEconom;
                for (i = 0; i < array.length; i++) {
                    array[i].isEconom = value;
                }
            };

            var reloadDopUslugiClassification = function () {
                var data = {
                    culture: culture,
                    CitySendId: $scope.data.areasSendId,
                    CityReceiveId: $scope.data.areasResiveId,
                    currency: $scope.data.currency,
                    forWidget: true
                };

                GetDropDownListAjax(delivery_url + 'GetDopUslugiClassification', data, function (data) {
                    $scope.data.dopUslugaClassificator = data;
                    $scope.$digest();
                });
            };

            $scope.WarehouseSendChange = function (data) {
            };
            $scope.WarehouseReceiveChange = function (data) {
                reloadDeliveryScheme();
            };

            $scope.CurrencyChange = function (data) {
                $scope.data.currencyStr = $scope.data.currency == 100000000 ? ' грн.' : ' руб.';
                reloadDopUslugiClassification();
            };

            $scope.changeCargoCategory = function (array, index) {
                if (array[index].categoryId == '38d56f00-2c79-e311-be8c-00155d015107' || //документы
                   array[index].categoryId == 'ebe885b1-e648-e211-ab75-00155d012d0d' ||
                   array[index].categoryId == 'a94106c3-e648-e211-ab75-00155d012d0d'
                ) {
                    array[index].show_count = false;
                    array[index].show_helf = false;
                    array[index].show_size = false;
                    array[index].countPlace = 1;
                    array[index].size = 0;
                    array[index].helf = 0;
                    array[index].show_econom = false;
                }
                else if (array[index].categoryId == 'ef32f833-e648-e211-ab75-00155d012d0d' || //шины
                         array[index].categoryId == '38475e48-e648-e211-ab75-00155d012d0d' ||
                         array[index].categoryId == '3556f95e-e648-e211-ab75-00155d012d0d' ||
                         array[index].categoryId == '112ead71-e648-e211-ab75-00155d012d0d' ||
                         array[index].categoryId == '81cd9253-e648-e211-ab75-00155d012d0d'
                ) {
                    array[index].show_helf = false;
                    array[index].show_size = false;
                    array[index].show_count = true;
                    array[index].size = 0;
                    array[index].helf = 0;
                    array[index].show_econom = false;
                }
                else if (array[index].categoryId == '5c88e93b-73f8-e411-a12e-000d3a200160' || //почтоматы
                         array[index].categoryId == '79476428-73f8-e411-a12e-000d3a200160' ||
                         array[index].categoryId == 'defe301c-73f8-e411-a12e-000d3a200160') {
                    array[index].show_helf = true;
                    array[index].show_size = true;
                    array[index].show_count = true;
                    array[index].countPlace = 1;
                    // array[index].size = "";
                    // array[index].helf = 0;
                    array[index].show_econom = false;
                }
                else //груз и палеты
                {
                    if (array[index].categoryId == '00000000-0000-0000-0000-000000000000')
                        array[index].show_econom = true;
                    else
                        array[index].show_econom = false;
                    array[index].show_helf = true;
                    array[index].show_size = true;
                    array[index].show_count = true;
                }
            };

            $scope.remove = function (array, index) {
                array.splice(index, 1);
            };

            $scope.add = function (array) {
                var obj = { "countPlace": 1, "categoryId": "00000000-0000-0000-0000-000000000000", "helf": 0, "size": 0, "show_count": true, "show_helf": true, "show_size": true, "show_econom": true, "isEconom": array[0].isEconom };
                array.push(obj);
            };

            $scope.send = function (data) {

                if (!$scope.deliv_frm.$valid) {
                    //$('.delivery-form input.ng-invalid').addClass('ng-touched');
                    angular.forEach($scope.deliv_frm.$error, function (field) {
                        angular.forEach(field, function (errorField) {
                            errorField.$setTouched();
                        })
                    });
                    return;
                }

                var deepCopy = function (obj, fl_filter) {
                    if (obj == null || typeof (obj) !== 'object') {
                        return obj;
                    }
                    //make sure the returned object has the same prototype as the original
                    var target = null;
                    if (fl_filter != undefined && fl_filter == true)
                        target = [];
                    else
                        if (typeof obj.getMonth === 'function')
                            target = obj;
                        else
                            target = obj.constructor();

                    for (var prop in obj) {
                        if (fl_filter != undefined && fl_filter == true) {
                            if (obj[prop].count != 0)
                                target.push(deepCopy(obj[prop]));
                        }
                        else
                            if (typeof obj[prop] === 'object') {
                                target[prop] = deepCopy(obj[prop], prop == "dopUsluga");
                            } else {
                                target[prop] = obj[prop];
                            }
                    }
                    return target;
                };
                if ($scope.data.CashOnDeliveryValue > $scope.data.InsuranceValue)
                    $scope.data.InsuranceValue = $scope.data.CashOnDeliveryValue;

                data.culture = culture;

                var copy_object = deepCopy(data);

                copy_object.descentFromFloor = settings.descentFromFloor == undefined ? 0 : settings.descentFromFloor;
                copy_object.denyIssue = settings.banDelivery == undefined ? false : settings.banDelivery;
                copy_object.ReturnDocuments = settings.returnDocuments == undefined ? false : settings.returnDocuments;

                var object = JSON.stringify(copy_object, function (key, value) {
                    if ($.isNumeric(value))
                        return value.toString().replace(",", ".");
                    else
                        return value;
                });

                delivery_loader.css('visibility', 'visible');
                form.addClass('disable');

                $.support.cors = true;

                $.ajax({
                    url: delivery_url + 'PostReceiptCalculate',
                    type: "POST",
                    method: "POST",
                    contentType: 'application/json',
                    dataType: "json",
                    data: object,
                    crossDomain: true,
                    useDefaultXhrHeader: false,
                    success: function (data) {
                        if (data.status == true && data.data.status == true) {
                            $scope.result = data.data;
                            if (data.data.messageCode == 101)
                                $scope.result.message = $.delivery_resources.calculator.message_101 + $scope.result.warehouseResiveIdName;
                            $scope.$digest();
                            $('#calculate_dialog').delivery_dialog({
                                width: "auto",
                                title: $.delivery_resources.calculator.dialog_title,
                                clone: true
                            });
                            
                        }
                        else {
                            $('#message_dialog').html(data.message == "" ? data.data.comment : data.message);
                            $('#message_dialog').delivery_dialog({
                                width: "auto",
                                title: $.delivery_resources.calculator.dialog_title,
                                clone: true
                            });

                        }
                        delivery_loader.css('visibility', 'hidden');
                        form.removeClass('disable');
                    },
                    error: function (data) {
                        alert(data.status.toString() + ' ' + data.statusText);
                        delivery_loader.css('visibility', 'hidden');
                        form.removeClass('disable');
                    }
                });

            };
        });
        updateCounter(3);
    }
})(jQuery);


