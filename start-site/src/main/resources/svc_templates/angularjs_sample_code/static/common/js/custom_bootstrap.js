if ($("input[type=date]").prop('type') != 'date'
		|| $("input[type=number]").prop('type') != 'number')
	// loadFilesNeededForJQueryUI();
	if ($("input[type=time]").prop('type') != 'time')
		// loadFilesForTimeEntry();
		// script for navbar
		$('ul.nav-left-ml').toggle();
$('label.nav-toggle span').click(
		function() {
			$(this).parent().parent().children('ul.nav-left-ml').toggle(300);
			var cs = $(this).attr("class");
			if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-right') {
				$(this).removeClass('glyphicon-chevron-right').addClass(
						'glyphicon-chevron-down');
			}
			if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-down') {
				$(this).removeClass('glyphicon-chevron-down').addClass(
						'glyphicon-chevron-right');
			}
		});

$('label.nav-toggle a').click(
		function() {
			$(this).parent().parent().children('ul.nav-left-ml').toggle(300);
			var cs = $(this).parent().children('span').attr("class");
			if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-right') {
				$(this).parent().children('span').removeClass(
						'glyphicon-chevron-right').addClass(
						'glyphicon-chevron-down');
			}
			if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-down') {
				$(this).parent().children('span').removeClass(
						'glyphicon-chevron-down').addClass(
						'glyphicon-chevron-right');
			}
		});

// to scroll up on iframe load
$('iframe').on('load', function(e) {
	$('html, body').animate({
		scrollTop : 0
	}, 'slow');
});
// Load files for timeentry
function loadFilesForTimeEntry() {
	if (typeof jQuery.timeentry !== 'undefined')
		return;
	var path = window.location.pathname;
	path = path.split('menu_structure')[1];
	var newpath = '';
	for (i = 0; i < (path.match(/\//ig) || []).length; i++)
		newpath += '../';
	$.getScript(newpath + "external_lib/timeEntry/jquery.plugin.js").done(
			function(script, textStatus) {
				console.log(textStatus);
			}).fail(function(jqxhr, settings, exception) {
		console.log(exception);
	});
	$.getScript(newpath + "external_lib/timeEntry/jquery.timeentry.js").done(
			function(script, textStatus) {
				console.log(textStatus);
			}).fail(function(jqxhr, settings, exception) {
		console.log(exception);
	});
	$('head')
			.append(
					'<link rel="stylesheet" href="'
							+ newpath
							+ 'external_lib/jquery/css/jquery.timeentry.css" type="text/css" />');

}

// load jquery ui files
function loadFilesNeededForJQueryUI() {
	if (typeof jQuery.ui !== 'undefined')
		return;
	var path = window.location.pathname;
	path = path.split('menu_structure')[1];
	var newpath = '';
	for (i = 0; i < (path.match(/\//ig) || []).length; i++)
		newpath += '../';
	$.getScript(newpath + "external_lib/jquery/jquery-ui.min.js").done(
			function(script, textStatus) {
				console.log(textStatus);
			}).fail(function(jqxhr, settings, exception) {
		console.log(exception);
	});
	$('head')
			.append(
					'<link rel="stylesheet" href="'
							+ newpath
							+ 'external_lib/jquery/css/jquery-ui.min.css" type="text/css" />');
	$('head')
			.append(
					'<link rel="stylesheet" href="'
							+ newpath
							+ 'external_lib/jquery/css/jquery-ui.structure.min.css" type="text/css" />');
	$('head')
			.append(
					'<link rel="stylesheet" href="'
							+ newpath
							+ 'external_lib/jquery/css/jquery-ui.theme.min.css" type="text/css" />');
	$('head')
			.append(
					'<style>.ui-datepicker { width: 17em; padding: .2em .2em 0; z-index: 9999 !important; }<style/>');
}
// assign respective classes to control on document load !multiselect-search
// !multiselect-clear-filter
function assignInputControlClassess() {
	$("input:not(.multiselect-search)").each(
			function() {
				if (!($(this).is(':checkbox') || $(this).is(':file')
						|| $(this).is(':submit') || $(this).is(':button')
						|| $(this).is(':radio') || $(this).is(':reset')))
					$($(this).addClass("form-control"));
				if ($(this).is(':not(.multiselect-clear-filter):button')
						|| $(this).is(':not(.multiselect-clear-filter):submit')
						|| $(this).is(':not(.multiselect-clear-filter):reset'))
					$($(this).addClass("btn btn-default btn-sm"));
			});
	$("select").each(function() {
		$($(this).addClass("form-control"));
	});
	$("textarea").each(function() {
		$($(this).addClass("form-control"));
	});
	$("table")
			.each(
					function() {
						$($(this)
								.addClass(
										"table table-striped table-bordered table-hover table-condensed"));
					});
	$("form").each(function() {
		$($(this).addClass("form-horizontal"));
		$($(this).attr("role", "form"));
	});
	$("button:not(.multiselect-clear-filter)").each(function() {
		$($(this).addClass("btn btn-default btn-sm"));
	});

	$("input[name*='pin']").each(function() {
		$(this).addClass('pincode');
	});
	$("input[name*='PinCode']").each(function() {
		$(this).addClass('pincode');
	});

	$("input[name*='phone']").each(function() {
		$(this).addClass('ph-no');
	});
	$("input[name*='Phone']").each(function() {
		$(this).addClass('ph-no');
	});
	$("input[name*='mob']").each(function() {
		$(this).addClass('ph-no');
	});
	/*
	 * $("input[type=date]").each(function() { if ($(this).prop('type') !=
	 * 'date') { $(this).datepicker(); } });
	 * $("input[type=number]").each(function() { if ($(this).prop('type') !=
	 * 'number') { var min = $(this).attr('min'); var step =
	 * $(this).attr('step'); var max = $(this).attr('max'); $(this).spinner({
	 * min: min, max: max, step: step }); } });
	 * $("input[type=time]").each(function() { if ($(this).prop('type') !=
	 * 'time') { $(this).timeEntry({show24Hours: true, showSeconds: true}); }
	 * });
	 */
	$('div.req div.input-group-addon').css('margin-right', '15px');
}
$(document).ready(function() {
	assignInputControlClassess();

	// assign class if new element is added
	$(".container").bind("DOMSubtreeModified", function() {
		assignInputControlClassess();
	});
});
// open link in iframe on click
$(".openInIFrame").click(function(e) {
	e.preventDefault();
	$("#changingIFrame").attr("src", $(this).attr("href"));
	$('.nav-list-main > li.active ').removeClass('active');
	$('.nav-left-ml > li.active ').removeClass('active');
	$(this).parent().addClass('active');
});

// input file control
$(document)
		.on(
				'change',
				'.btn-file :file',
				function() {
					var input = $(this), numFiles = input.get(0).files ? input
							.get(0).files.length : 1, label = input.val()
							.replace(/\\/g, '/').replace(/.*\//, '');
					input.trigger('fileselect', [ numFiles, label ]);
				});
$(document).ready(
		function() {
			$('.btn-file :file').on(
					'fileselect',
					function(event, numFiles, label) {

						var input = $(this).parents('.input-group').find(
								':text'), log = numFiles > 1 ? numFiles
								+ ' files selected' : label;

						if (input.length) {
							input.val(log);
						} else {
							if (log)
								alert(log);
						}

					});
		});

// close dropdown on outside click
$(document).on('click', function() {
	$('.collapse').collapse('hide');
});
var myConfObj = {
	iframeMouseOver : false
}
window.addEventListener('blur', function() {
	if (myConfObj.iframeMouseOver) {
		$('.dropdown').click()
	}
});
