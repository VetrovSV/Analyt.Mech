// всяческая инициализация. навешивание событий и т.д.
$(function () {
    // пробегаем по всем ссылкам 'сообщить об ошибке'
    jQuery("a[id^=report_message]").click(function() {
            var taskid = this.id.replace(/report_message_/, '');		// извлекаем taskid
            var e_area_id = "#error_area_"+taskid;
            var jErrorArea = jQuery(e_area_id);
            jErrorArea											// к текстовому полям #error_area_[0-9]+ навешиваем...
                    .slideToggle(250)									// эффект slide
                    .find("input[name=cancel]").unbind('click').click(function() {			// на кнопки 'Отмена' - эффект slideUp
                            jQuery(e_area_id).slideUp(250);
                    })
                    .end()													// переходим снова к текстовому полю
                    .find("input[name=send_message]").unbind('click').click(function() {
                            ajaxSendMessage(jErrorArea);
                    });
    });
});

function ajaxSendMessage(jErrorArea)
{
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var fioid = jErrorArea.find("input[name=fioid]").val();
    var taskid = jErrorArea.find("input[name=taskid]").val();
    var email = jErrorArea.find("input[name=email]").val();
    var message = jErrorArea.find("textarea[name=message]").val();

    if (regex.test(email)){
        jQuery.post('/ajax/ajax_messages.php',
                {action: 'addTaskErrorMessage', taskid: taskid, fioid: fioid, message: message, email: email},
        function(data)
        {
            if (data.result == 0) {
                if (data.errors) {
                    jErrorArea.slideUp(250, function() {// Пришла ошибка
                    showStatusMessage(jQuery("p#status_message_" + taskid),
                        data.errors[0].text,
                        function() {
                            jErrorArea.slideDown(1000);
                        }, "unsuccess");
                    });
                } else {
                    jErrorArea.slideUp(250, function() {
                        showStatusMessage(jQuery("p#status_message_" + taskid),
                                "Сообщение успешно добавлено");
                    });
                }
            } else {
                jErrorArea.slideUp(250, function() {// Пришла ошибка
                    showStatusMessage(jQuery("p#status_message_" + taskid),
                            "К сожалению, ваше сообщение не удалось добавить. Обратитесь в техподдержку",
                            function() {
                                jErrorArea.slideDown(1000);
                            }, "unsuccess");
                });
            }
        }, 'json'
        );
    } else {
        jErrorArea.slideUp(250, function() {// Пришла ошибка
            showSlowStatusMessage(jQuery("p#status_message_" + taskid),
                    "К сожалению, ваше сообщение не удалось добавить. Пожалуйста, проверьте правильность написания e-mail!",
                    function() {
                        jErrorArea.slideDown(1000);
                    }, "unsuccess");
        });
     }
}// function ajaxSendMessage(jErrorArea)

// отобразить сообщение на панели статуса
function showStatusMessage(jPanelObject, message, fn, className) {
	className = typeof(className) == "undefined" ? "success" : className;		// эмуляция параметра по умолчанию
	jPanelObject.addClass(className).html("&nbsp;").slideDown(200, function() {
		jPanelObject.text(message).oneTime(1000, function() {
			if (fn) {
				jPanelObject.slideUp(50, function() {fn; jPanelObject.removeClass(className);});
			} else {
				jPanelObject.slideUp(50, function() {jPanelObject.removeClass(className); });
			}
		});
	});
}
// отобразить сообщение в замедленном темпе на панели статуса
function showSlowStatusMessage(jPanelObject, message, fn, className) {
	className = typeof(className) == "undefined" ? "success" : className;
	jPanelObject.addClass(className).html("&nbsp;").slideDown(200, function() {
		jPanelObject.text(message).oneTime(4000, function() {
			if (fn) {
				jPanelObject.slideUp(250, function() {fn; jPanelObject.removeClass(className);});
			} else {
				jPanelObject.slideUp(250, function() {jPanelObject.removeClass(className); });
			}
		});
	});
}

function short_notation() {
    $('#sn').toggle();
}