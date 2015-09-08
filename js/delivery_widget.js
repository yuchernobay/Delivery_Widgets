function screenHeight() {
    return window.innerHeight; // $(window).height();
}
function screenWidth(){
    return window.innerWidth; // $(window).width();
}

function updateCounter(type) {
    $.post('http://www.delivery-auto.com/api/v4/Public/PostWidgetCounterInformation', { type: type, url: location.hostname }, function (data) {
    });

}

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
    }

    var show_message = function (message) {
        dialog.html('');
        dialog.append('<div class="delivery_label">' + message + '</div>')
        $(dialog_parent).delivery_dialog({
            width: "auto",
            title: $.delivery_resources.find_receipt.dialog_title
        });
    }

    var send_request = function () {
        var receipt_number = delivery_receipt_number.val();
        receipt_number = receipt_number.replace(/ /g, "");
        if (receipt_number.length != 10) {
            show_message($.delivery_resources.find_receipt.receipt_not_correct_format);
            return;
        }

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

                    }

                    $(row).append('<div style="display:table-cell;" class="delivery_label">' + status_text + '</div>');
                    $(dialog).append('<hr class="delivery_hr"/>')

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
                    addField(row, '<b>'+$.delivery_resources.find_receipt.total_cost + currency + ':'+'</b>', res.data.AllReceiptsTotalCost == null ? '0.00' : res.data.AllReceiptsTotalCost.toFixed(2));


                    $(dialog).append('<div class="delivery_label" style="margin-left:0px; margin-top:18px;">' + $.delivery_resources.find_receipt.message + '</div>');
                    $(dialog).append('<hr style="margin-bottom:16px;" class="delivery_hr"/>')

                    var delivery_print_button = $('<a id="delivery_print_button" class="delivery_button" href="javascript:void(0)">' + $.delivery_resources.find_receipt.print + '</a>')
                    $(dialog).append(delivery_print_button);
                    $(dialog).append('<hr style="border: none;"/>')

                    delivery_print_button.click(function () {
                        printable_area.html("");
                        var content = dialog_parent.clone();
                        var inputArray = $(content).find(".delivery_text_box");

                        for (var i = 0; i < inputArray.length; i++) {
                            $(inputArray[i]).css("padding", "5px").css("margin", "7px").css('font-size', '13px').css('width', 'auto').css('border', '1px solid black');
                        }
                        var labelArray = $(content).find(".delivery_label");

                        for (var i = 0; i < labelArray.length; i++) {
                            $(labelArray[i]).css("margin", "7px").css("padding", "5px").css("overflow", "hidden").css('font-size', '13px');
                        }
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
    }

    delivery_receipt_number.keypress(function (e) {
        if (e.which == 13) {
            send_request();
            return false;    //<---- Add this line
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

    }

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
    }

    $(this).append(delivery_loader);


    //var printable_area = $('<div style="display:none;" ></div>');
    //$(this).append(printable_area);
    var dialog_parent = $('<div id="delivery_dialog_'+name+'" style="display:none; padding:0px;"/>');
    $(this).append(dialog_parent);
    var dialog = $('<div style="border-collapse: collapse; text-align: left; width:auto; border: none; min-height: 70px;" class="delivery_panel_dialog"/>');
    $(dialog_parent).append(dialog);

    var show_message = function (message) {
        dialog.html('');
        dialog.append('<div class="delivery_label">' + message + '</div>')
        $(dialog_parent).delivery_dialog({
            width: "auto",
            title: $.delivery_resources.view_tracking.dialog_title
        });
    }

    function errorMessageFunc(data) {
        delivery_loader.css('visibility', 'hidden');
        parent_div.removeClass('disable');
        alert(data.status.toString() + ' ' + data.statusText);
    }

    var send_request = function () {
        var receipt_number = delivery_receipt_number.val();
        receipt_number = receipt_number.replace(/ /g, "");
        if (receipt_number.length != 10) {
            show_message($.delivery_resources.find_receipt.receipt_not_correct_format);
            return;
        }

        var url = 'http://www.delivery-auto.com/api/Receipts/GetTracking?culture=' + culture + '&number=' + receipt_number + '&page='+'1'+'&rows='+'1000';
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

                    set_page(page.toString(),table);

                    if (total_pages > 1)
                    {
                        row = addTableRow(dialog);
                        row.addClass('padding_panel').css('display','block');
                        var prev_btn = $('<a value="-1" href="javascript:void();" class="paging_disable">◄</a>').click(function () { paging_click(this, table); });
                        row.append(prev_btn);
                        for (var j = 1; j <= total_pages; j++) {
                            var num_btn = $('<a value="' + j.toString() + '" href="javascript:void();" class="' + (j == 1 ? 'paging_active' : 'paging_disable') + '">' + j.toString() + '</a>').click(function () { paging_click(this, table); });
                            row.append(num_btn);
                        }
                        var next_btn = $('<a value="+1" href="javascript:void();" class="paging_disable">►</a>').click(function () { paging_click(this, table); });
                        row.append(next_btn);
                    }

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
    }

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
    }

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
    })
    $(document).mousemove(function () {
        if (clicking == false) return;
        if (window.getSelection) { window.getSelection().removeAllRanges(); }
        else if (document.selection && document.selection.clear)
            document.selection.clear();
    })

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

(function ($) {
$.fn.delivery_view_map = function (options) {
    var culture = $.delivery_resources.culture;
    var parent_div = $(this);

    var script = document.createElement('script');
    script.src = 'http://api-maps.yandex.ru/2.0/?load=package.full&mode=debug&lang=' + culture
   
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
                /*   if (item.WarehouseType == 1) {
                       privat = $('<div style="color:white; background-color:green;font-weight: bold;padding:5px;">').append($('<span>').text($.delivery_resources.view_map.address.postamat_message));
            }*/

                var header = $('<div class="delivery_warehouse_title">').attr('id', 'header-container').text(item.name);
                var address = item.address != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.address)).append($('<div class="delivery_label_map">').text(item.address)) : null;
                var phones = item.phone != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.phone)).append($('<div class="delivery_label_map">').text(item.phone)) : null;
                var workingTime = item.working_time != null ? $('<div>').append($('<div class="delivery_label_map" style="font-weight:bold;">').text($.delivery_resources.view_map.work_time)).append($('<div class="delivery_label_map">').text(item.working_time)) : null;
                var info = $('<a class="info_button" style="display: block;" target="_blank" href="http://delivery-auto.com/' + culture + '/Representatives/Details/' + item.id + '">' + $.delivery_resources.view_map.read_more + '</a>')
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

            }

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

                $.ajax({
                    url: 'http://api.ipinfodb.com/v3/ip-city/?key=8f7e9d6d2bceeba809a99da70bfaeb9e2d739bc21ce99bcd5ca4070d704237f2&format=json&ip=' + ip,
                    type: 'GET',
                    crossDomain: true, // enable this
                    dataType: 'jsonp',
                    success: function (object) {
                        try {
                            longitude = parseFloat(object.latitude);
                            latitude = parseFloat(object.longitude);
                        }
                        catch (ex) { }
                        load_warehouses($.delivery_resources.culture, longitude, latitude, count);
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
    $(obj).find('.du_panel').slideToggle("slow");
}

(function ($) {
    $.fn.delivery_calculator = function (options) {
        var culture = $.delivery_resources.culture;
        var parent_div = $(this);

        var app = $('<div ng-app="delivery_app"></div>');
        parent_div.append(app);

        var controller = $('<div ng-controller="delivery_controller" class="delivery_panel" style="width:500px;"></div>').css('text-align', 'left');
        app.append(controller);

        var add_drop_down = function (obj, label, parameter, function_name, array) {
            var parent_div = $('<div style="float:left;"></div>');
            $(obj).append(parent_div);
            var label = $('<div class="delivery_label">'+label+'</div>').css('margin-bottom', '0px');
            parent_div.append(label);
            var select = $('<select class="delivery_drop_down" ng-model="'+parameter+'" ng-change="'+function_name+'()">'+
                    '<option ng-repeat="item in ' + array + '" value="{{item.id}}">{{item.name}}</option></select>').css('margin-top', '0px');;
            parent_div.append(select);
            return parent_div;
        }

        var add_input = function (obj, label, parameter, additional_parameters, width) {
            var parent_div = $('<div style="float:left;"></div>');
            $(obj).append(parent_div);
            var label = $('<div  style="float:left;" class="delivery_label">' + label + '</div>').css('margin-bottom', '0px');
            parent_div.append(label);
            var input = $('<input style="float:left; clear:both;" class="delivery_text_box" ng-model="' + parameter + '" ' + additional_parameters + '/>').css('margin-top', '0px');
            if (width != undefined)
                input.css('width', width + 'px');
            parent_div.append(input);
            return parent_div;
        }
        var line_break = function(obj)
        {
            var div = $('<div style="float:left; clear:both;"></div>');
            $(obj).append(div);
            return div;
        }
        

        add_drop_down(controller, $.delivery_resources.calculator.city_send, 'data.areasSendId', 'SitySendChange', 'SityList');
        add_drop_down(controller, $.delivery_resources.calculator.warehouse_send, 'data.warehouseSendId', 'WarehouseSendChange', 'WarehouseSendList');
        line_break(controller);

        add_drop_down(controller, $.delivery_resources.calculator.city_receive, 'data.areasResiveId', 'SityReceiveChange', 'SityList');
        add_drop_down(controller, $.delivery_resources.calculator.warehouse_receive, 'data.warehouseResiveId', 'WarehouseReceiveChange', 'WarehouseReceiveList');
        line_break(controller);

        add_drop_down(controller, $.delivery_resources.calculator.pay_currency, 'data.currency', 'CurrencyChange', 'CurrencyList');
        add_drop_down(controller, $.delivery_resources.calculator.delivery_scheme, 'data.deliveryScheme', null, 'DeliverySchemeList');
        line_break(controller);

        add_input(controller, $.delivery_resources.calculator.date_send, 'data.dateSend');
        line_break(controller);
        var InsuranceValue = add_input(controller, $.delivery_resources.calculator.inshurance_cost, 'data.InsuranceValue', 'ng-blur="reloadInsuranceCost()"');

        var InsuranceCost = $('<div class="delivery_label" style="float:left;" ng-show="data.InsuranceCost>0">{{data.InsuranceCost | number:2}}{{data.currencyStr}}</div>');
        InsuranceValue.append(InsuranceCost);

        var cargo = $('<div style="float:left; clear:both;" ng-repeat=" eg in data.category"></div>');
        controller.append(cargo);
        var deleteButton = $('<div style="float:right;" ng-click=" remove(data.category, $index)"><b>X</b></div>');
        cargo.append(deleteButton);
        add_drop_down(cargo, $.delivery_resources.calculator.tarif_category, 'categoryId', null, 'TariffCategoryList');

        /*var cargoParameters = $('<input style="float:left; width:100px;" class="delivery_text_box" ng-model="eg.countPlace" />'+
                                '<input style="float: left; width: 100px;" class="delivery_text_box" ng-model="eg.helf" />'+
                                '<input style="float: left; width: 100px;" class="delivery_text_box" ng-model="eg.size" />');
        cargo.append(cargoParameters);*/
        add_input(cargo, $.delivery_resources.calculator.count_places, "eg.countPlace", undefined, 100);
        add_input(cargo, $.delivery_resources.calculator.cargo_weight, "eg.helf", undefined, 100);
        add_input(cargo, $.delivery_resources.calculator.carho_size, "eg.size", undefined, 100);

        var add_category = $('<a class="delivery_button" style="float:left; clear:both;" ng-click="add(data.category)">'+$.delivery_resources.calculator.add_category+'</a>');
        add_category.css('line-height', 'inherit');
        controller.append(add_category);

        var dopUslugaClassificator = $('<div style="float:left; clear:both; width:100%;" onclick="toggle_panel(this);" ng-repeat="du_cl in data.dopUslugaClassificator"></div>');
        controller.append(dopUslugaClassificator);
        var classificatorLabel = $('<div class="delivery_accordion" ng-bind="du_cl.name"></div>');
        dopUslugaClassificator.append(classificatorLabel);
        var classificatorPanel = $('<div class="du_panel" style="display:none;"></div>');
        dopUslugaClassificator.append(classificatorPanel);
        var duRow = $('<div style="display:table-row;" ng-repeat="du in du_cl.dopUsluga"></div>');
        classificatorPanel.append(duRow);
        var duHiddenInformation = $('<div style="display:none">{{du.uslugaId}}</div><div style="display:none">{{du.cost}}</div>');
        duRow.append(duHiddenInformation);
        var duIformation = $('<div style="width:66%; display: table-cell; text-align:left;">{{du.name}}</div>'+
                             '<input style="width:66%; display: table-cell;" class="delivery_text_box_du_count" ng-model="du.count" />' +
                             '<div style="width: 17%;  display: table-cell; text-align: left; ">{{du.cost * du.count | number:2}}{{data.currencyStr}}</div>');
        duRow.append(duIformation);

        var clculateButton = $('<a class="delivery_button" style="float:left; clear:both;" ng-click="send(data)">' + $.delivery_resources.calculator.calculate + '</a>');
        clculateButton.css('line-height', 'inherit');
        controller.append(clculateButton);

        var calculate_dialog = $('<div id="calculate_dialog" class="delivery_panel" style="float:left; clear:both; text-align:left; display:none;">')

        var app = angular.module('delivery_app', []);
        app.controller('delivery_controller', function ($scope) {
            $scope.data = {};
            var obj = { "countPlace": 1, "InvoiceCurrency": 100000001 };
            $scope.data.category = [];
            $scope.data.category.push(obj);
            $scope.data.InsuranceValue = 0;

            //var delivery_url_work = 'http://www.delivery-auto.com/api/v4/Public/';
            var delivery_url = 'http://localhost:51630/api/v4/Public/';

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
            }

            var data = {
                culture: culture,
                fl_all: true
            };

            GetDropDownListAjax(delivery_url + 'GetAreasList', data, function (data) {
                $scope.SityList = data;
                $scope.data.areasSendId = data[0].id;
                $scope.data.areasResiveId = data[0].id;
                $scope.$digest();
                //$scope.$digest();
                $scope.SitySendChange(true);
                $scope.SityReceiveChange(true);
                reloadCurrency();
            });

            $scope.SitySendChange = function (fl_init) {
                var data = {
                    culture: culture,
                    CityId: $scope.data.areasSendId,
                    DirectionType: 0
                };

                GetDropDownListAjax(delivery_url + 'GetWarehousesListByCity', data, function (data) {
                    $scope.WarehouseSendList = data;
                    $scope.data.warehouseSendId = data[0].id;
                    $scope.$digest();
                    $scope.WarehouseSendChange();
                });
                if (!fl_init) {
                    reloadCurrency();
                    reloadDeliveryScheme();
                }
            }
            $scope.SityReceiveChange = function (fl_init) {
                var data = {
                    culture: culture,
                    CityId: $scope.data.areasResiveId,
                    DirectionType: 1
                };

                GetDropDownListAjax(delivery_url + 'GetWarehousesListByCity', data, function (data) {
                    $scope.WarehouseReceiveList = data;
                    $scope.data.warehouseResiveId = data[0].id;
                    $scope.$digest();
                    $scope.WarehouseReceiveChange();
                });
                if (!fl_init)
                    reloadCurrency();
            }

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
                    $scope.data.currency = data[0].id;
                    $scope.$digest();
                    $scope.CurrencyChange();
                });
            }

            var reloadDeliveryScheme = function () {
                if ($scope.data.areasSendId == undefined || $scope.data.areasResiveId == undefined || $scope.data.warehouseResiveId == undefined)
                    return;
                var data = {
                    culture: culture,
                    CitySendId: $scope.data.areasSendId,
                    CityReceiveId: $scope.data.areasResiveId,
                    WarehouseReceiveId: $scope.data.warehouseResiveId
                };

                GetDropDownListAjax(delivery_url + 'GetDeliveryScheme', data, function (data) {
                    $scope.DeliverySchemeList = data;
                    $scope.data.deliveryScheme = data[0].id;
                    $scope.$digest();
                });

                GetDropDownListAjax(delivery_url + 'GetTariffCategory', data, function (data) {
                    $scope.TariffCategoryList = data;
                    $scope.data.category[0].categoryId = data[0].id;
                    $scope.$digest();
                });
            }

            $scope.reloadInsuranceCost = function () {
                $scope.data.InsuranceCost = 0
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
            }

            var reloadDopUslugiClassification = function () {
                var data = {
                    culture: culture,
                    CitySendId: $scope.data.areasSendId,
                    CityReceiveId: $scope.data.areasResiveId,
                    currency: $scope.data.currency
                };

                GetDropDownListAjax(delivery_url + 'GetDopUslugiClassification', data, function (data) {
                    $scope.data.dopUslugaClassificator = data;
                    $scope.$digest();
                });
            }

            $scope.WarehouseSendChange = function (data) {
            }
            $scope.WarehouseReceiveChange = function (data) {
                reloadDeliveryScheme();
            }

            $scope.CurrencyChange = function (data) {
                $scope.data.currencyStr = $scope.data.currency == 100000000 ? ' грн.' : ' руб.'
                reloadDopUslugiClassification();
            }

            $scope.remove = function (array, index) {
                array.splice(index, 1);
            }

            $scope.add = function (array) {
                var obj = { "countPlace": 1 };
                array.push(obj);
            }

            $scope.send = function (data) {
                var copy_object = deepCopy(data);

                var object = JSON.stringify(data, function (key, value) {
                    if ($.isNumeric(value))
                        return value.toString().replace(".", ",");
                    else
                        return value;
                });

                var object1 = JSON.stringify(copy_object, function (key, value) {
                    if ($.isNumeric(value))
                        return value.toString().replace(".", ",");
                    else
                        return value;
                });

                $.ajax({
                    url: delivery_url + 'PostReceiptCalculate',
                    type: "POST",
                    contentType: 'application/json',
                    dataType: "json",
                    data: object1,
                    success: function (data) {
                        if (data.status == true) {
                            $scope.result = data.data;
                            $scope.$digest();
                            $('#calculate_dialog').delivery_dialog({
                                width: "auto",
                                title: "Расчетная стоимость доставки"
                            });
                        }
                    },
                    error: errorMessageFunc
                });
                
            }
        });

    }
})(jQuery);
