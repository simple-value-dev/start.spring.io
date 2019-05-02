/*
 * How to use this directive -
 * Add following attributes to button onclick of which you want to print :- 
 * 1)ng-print  
 * 2)print-element-id="<id_of_element_to_print>"
 * 3)input-modifier="attr-name:functionName;"
 * 4)layout - landscape / portrait 
 * 				- default layout is portrait
 * 4)page_size - A5 - Equivalent to the size of ISO A5 media: 148mm wide and 210 mm high.
 *				A4 - Equivalent to the size of ISO A4 media: 210 mm wide and 297 mm high.
 *				A3 - Equivalent to the size of ISO A3 media: 297mm wide and 420mm high.
 *				B5 - Equivalent to the size of ISO B5 media: 176mm wide by 250mm high.
 *				B4 - Equivalent to the size of ISO B4 media: 250mm wide by 353mm high.
 *				letter - Equivalent to the size of North American letter media: 8.5 inches wide and 11 inches high
 *				legal - Equivalent to the size of North American legal: 8.5 inches wide by 14 inches high.
 *				ledger - Equivalent to the size of North American ledger: 11 inches wide by 17 inches high.
 * 				- default page_size is A4
 *  ---> input-modifier attribute will have value for "attr-name" as name of attribute given to html elements which are suppose to get modify
 *  and "functionName" is name of function which will be defined in resp. controller on $scope for modification action
 * e.g.
	  <input type="text" modify-add-textBoxValue name="textBox" >
	  <input type="radio" modify-add-glyphicon name="radioBtn">
	  <button type="button" 
				hide-for-print 
				ng-print 
				print-element-id="printThisElement" 
				input-modifier="modify-add-glyphicon:addGlyphicon;modify-add-textBoxValue:replaceTextBoxWithValues"
				layout = "landscape"
				page_size = "letter">
				Print</button> 
 * Add attribute "hide-for-print" on elements you want to hide
 * here for all elements with modify-add-textBoxValue, function  replaceTextBoxWithValues will be called
 * */

(function(angular) {
	'use strict';
	angular
			.module('ngPrint', [])
			.directive(
					'ngPrint',
					[ function() {
						var domCloneForPrinting = null;
						var printSection = document
								.getElementById('printSection');
						// if there is no printing section, create one
						if (!printSection) {
							printSection = document.createElement('div');
							printSection.id = 'printSection';
							printSection.innerHTML = '';
						}

						return {
							restrict : 'A',
							link : function(scope, element, attrs) {
								element
										.on(
												'click',
												function() {
													var elemToPrint = document
															.getElementById(attrs.printElementId);
													// clones the element you
													// want to print
													domCloneForPrinting = document
															.getElementById(
																	attrs.printElementId)
															.cloneNode(true);
													if (attrs.hideForPrint != null) {
														hideElement(domCloneForPrinting);
													}
													if (attrs.inputModifier != null) {
														var inputModifiers = attrs.inputModifier
																.split(';');
														modifier(
																domCloneForPrinting,
																inputModifiers,
																scope);
													}
													var layout = "portrait";
													if (attrs.layout != null) {
														layout = attrs.layout;
													}
													var page_size = "A4";
													if (attrs.page_size != null) {
														page_size = attrs.page_size;
													}
													printSection.innerHTML = '';
													printSection
															.appendChild(domCloneForPrinting);
													printModifiedHtml(
															printSection.innerHTML,
															layout, page_size);
												});
							}
						};

						// hide elements
						function hideElement(domCloneForPrinting) {
							$('[hide-for-print]', domCloneForPrinting).hide();
						}
						// this function will modify html contents
						function modifier(domCloneForPrinting, inputModifiers,
								scope) {
							// do changes in cloned dom element

							// loop over all functions
							for (var i = 0; i < inputModifiers.length; i++) {
								var attrsInputModifier = inputModifiers[i]
										.split(":");
								var attributeName = attrsInputModifier[0];
								var functionName = attrsInputModifier[1];
								if (functionName != undefined) {
									var functionToCall = "scope."
											+ functionName + "(this)";// creates
																		// string
																		// as -
																		// scope.fun1(this);
									$('[' + attributeName + ']',
											domCloneForPrinting).each(
											function() {
												eval(functionToCall);
											});
								}
							}

						}

						// Function to print modified html
						function printModifiedHtml(htmlToPrint, layout,
								page_size) {
							var popupWin = window.open('', '_blank');
							popupWin.document.open();
							popupWin.document
									.write('<html>'
											+ '<head> '
											+ '<link rel="stylesheet" href="external_libraries/bootstrap/css/bootstrap.min.css">'
											+ '<link rel="stylesheet" href="css/custom-bootstrap.css">'
											+ '</head>'
											+ '<link rel="stylesheet"href="css/custom-print.css">'
											+ '<style type="text/css" media="print">'
											+ '@page { size:  '
											+ page_size
											+ ' '
											+ layout
											+ ';}'
											+ '</style>'
											+ '<body onload="window.print();window.close();">'
											+ htmlToPrint + '</body>'
											+ '</html>');
							popupWin.document.close();
						}
					} ]);
}(window.angular));