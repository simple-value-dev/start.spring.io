/**
 * this module has directives needed for angularjs SPA.
 * these custom directives help to create typical SPA home with following structure
 * 
 * 
 * -------------------------------------------------------------------------------------------------------------------------------------
 * |app name																										any string			|
 * |------------------------------------------------------------------------------------------------------------------------------------|
 * | brand logo	| 				[simple-nav-bar]												[simple-nav-bar]						|
 * |			| left nav-bar controls (home and other options)  			right nav-bar controls (typically language oprions & logout)|
 * |------------------------------------------------------------------------------------------------------------------------------------|
 * |> Parent menu1						|																								|
 * |	> Parent sub-menu				|																								|
 * |		> menu-page1				|																								|
 * |		> menu-page2				|																								|
 * |> Parent menu2						|																								|
 * |	> menu-page3					|																								|
 * |	> menu-page4					|																								|
 * |	> menu-page5					|																								|
 * |									|																								|
 * |									|																								|
 * |									|																								|
 * |									|																								|
 * |									|																								|
 * |									|																								|
 * -------------------------------------------------------------------------------------------------------------------------------------
 */

/*******************************************************************************
 * nav-bar beans
 * ************************************************************************************************************************
 */
function HrefData(name, href, pathName, isHome) {
	/*
	 * name as it appears for the link
	 */
	this.name = name;
	/*
	 * typically click handler is needed when href is null - for the links
	 * which'd navigate to home pages. href also has pathName in it... though it
	 * also has the list of parameters that are needed for the path.
	 */
	this.href = href;
	/*
	 * pathName is non-null for home page uri's. so that its navigation-scope
	 * can be fetched from server
	 */
	this.pathName = pathName;
	/*
	 * whether this is for home page or not (true/false)
	 */
	this.isHome = isHome;
}

function DropDownMenu(name, href, pathName, isSelected) {
	this.hrefData = new HrefData(name, href, pathName);
	this.isSelected = isSelected;
}

/*
 * holds data for dropdown to be shown in nav-bar
 */
function DropDownData(name, selectionGlyphicon, dropDownMenus) {
	this.name = name;
	this.selectionGlyphicon = selectionGlyphicon;
	this.dropDownMenus = dropDownMenus;
}

function LinkData(name, glyphicon, href, pathName) {
	this.hrefData = new HrefData(name, href, pathName);
	this.glyphicon = glyphicon;
}

/*
 * this structure holds item type, and object of only one of its other members
 * at any point in time all other members except itemType are null
 */
function NavBarItem(itemType, linkData, dropDownData) {
	this.itemType = itemType;
	this.linkData = linkData;
	this.dropDownData = dropDownData;
}

/*
 * lets implement breadscrub later it is not really a must have feature in UI. i
 * think we'd need to intercept/handle something similar to home-page change,
 * and fetch everything for SPA home for that home-page
 */
function BreadCrumbWithAddFavorites(addFavString) {
	this.hrefDataCollection = [];
	this.addFavString = addFavString;
	this.handleAddFavorite = handleAddFavorite;

	this.addHrefData = function(hrefData) {

	}

	this.updateHrefData = function(hrefDataCollection) {

	}
}

/*******************************************************************************
 * menu builder beans
 * ************************************************************************************************************************
 */
function MenuTreeNode(name, href, pathName, children) {
	this.hrefData = new HrefData(name, href, pathName);
	this.children = children;
}

(function(angular) {
	'use strict';
	var spaHomeModule = angular.module('spaHome', []);

	/*
	 * this directive should be used to create nav-bars in the navigation bar of
	 * the SPA home. this is custom designed directive, which is supposed to be
	 * used only with apps which have REST APIs to fetch beans needed in this
	 * directive.
	 */
	spaHomeModule
			.directive(
					'simpleNavBar',
					function($compile) {
						return {
							restrict : 'E',
							link : function(scope, element, attrs) {
								function updateNavBar() {
									var navbarSide = "";
									if (attrs.navBarSide != null)
										navbarSide = "navbar-"
												+ attrs.navBarSide;
									var navbarHtmlString = '<ul class="nav navbar-nav '
											+ navbarSide + '">';
									/*
									 * we cannot use ng-repeat for the li in
									 * navbar ul, because bootstrap expects li
									 * in ul and we need to treat every li
									 * differently based on item type in the
									 * navbar. so here we construct html string
									 * of entire navbar and compile it
									 */
									console.log(scope.navBarData);
									var itemDataIndex;
									console.log("iterating navbar items...");
									for (itemDataIndex in scope.navBarData) {
										console
												.log(scope.navBarData[itemDataIndex]);
										switch (scope.navBarData[itemDataIndex].itemType) {
										case "link":
											navbarHtmlString += '<li> '
													+ '<a ng-if="navBarData['
													+ itemDataIndex
													+ '].linkData.hrefData.isHome" '
													+ ' ng-click="localClickHandler(navBarData['
													+ itemDataIndex
													+ '].linkData.hrefData)">'
													+ '	<span class="glyphicon {{navBarData['
													+ itemDataIndex
													+ '].linkData.glyphicon}}"></span>'
													+ '{{navBarData['
													+ itemDataIndex
													+ '].linkData.hrefData.name}}'
													+ '</a>'
													+ '<a ng-href="#/{{navBarData['
													+ itemDataIndex
													+ '].linkData.hrefData.href}}"'
													+ '		ng-if="!navBarData['
													+ itemDataIndex
													+ '].linkData.hrefData.isHome">'
													+ '	<span class="glyphicon {{navBarData['
													+ itemDataIndex
													+ '].linkData.glyphicon}}"></span>'
													+ '{{navBarData['
													+ itemDataIndex
													+ '].linkData.hrefData.name}}'
													+ '</a>' + '</li>';
											break;
										case "dropdown":
											navbarHtmlString += '<li class="dropdown" ng-hide="navBarData==undefined">'
													+ '<a class="dropdown-toggle" data-toggle="dropdown">{{navBarData['
													+ itemDataIndex
													+ '].dropDownData.name}}<span class="caret"></span></a>'
													+ '<ul class="dropdown-menu">'
													+ '	<li ng-repeat="dropDownMenu in navBarData['
													+ itemDataIndex
													+ '].dropDownData.dropDownMenus">'
													+ '		<a ng-if="dropDownMenu.hrefData.isHome" '
													+ '				ng-click="localClickHandler(dropDownMenu.hrefData)">'
													+ '			{{dropDownMenu.hrefData.name}}'
													+ '			<span ng-if="dropDownMenu.isSelected" class="glyphicon {{dropDownMenu.selectionGlyphicon}}">'
													+ '		</a>'
													+ '		<a ng-if="!dropDownMenu.hrefData.isHome" href="#/{{dropDownMenu.hrefData.href}}">'
													+ '			{{dropDownMenu.hrefData.name}}'
													+ '			<span ng-if="dropDownMenu.isSelected" class="glyphicon {{dropDownMenu.selectionGlyphicon}}">'
													+ '		</a>'
													+ '	</li>'
													+ '</ul>' + '</li>';
											break;
										default:
											console
													.log('what type of nv-bar item this is: navBarData['
															+ itemDataIndex
															+ '].itemType ?');
											break;
										}
									}
									navbarHtmlString += '</ul>';
									element.html(navbarHtmlString);
									$compile(element.contents())(scope);
								}
								// link function gets executed only once since
								// we want to change nav bar data with
								// navigation scope change
								// hence adding watcher for nav bar data to
								// watch nav bar data change
								scope.$watch('navBarData', function(newValue,
										oldValue) {
									if (newValue) {
										updateNavBar();
									}
								}, true);

							},
							scope : {
								navBarData : '=', // we need to bind the
													// variable
								/*
								 * the click handler function provided by parent
								 * scope. this gets called for the hrefs which
								 * need click handling ex. the href that doesn't
								 * navigate to a URI, but changes the home
								 * page... would need a handler function where
								 * it'd change instance of SPA-home
								 */
								hrefClickHandler : '&'
							},

							replace : true,

							controller : function($scope) {
								$scope.localClickHandler = function(hrefData) {
									console
											.log('click handler in SimpleNavBar directive');
									/*
									 * here the syntax in html is important, it
									 * just gives reference of the function
									 * without parameters we pass the parameter
									 * from here
									 */
									$scope.hrefClickHandler()(hrefData);
								}
							}
						};
					});

	spaHomeModule
			.directive(
					'menuTreeStructure',
					function() {
						return {
							template : '<menu-node ng-repeat="menuNode in menuNodes"></menu-node>',
							replace : true,
							restrict : 'E',
							scope : {
								menuNodes : '=menuNodes',
								/*
								 * the click handler function provided by parent
								 * scope. this gets called for the hrefs which
								 * need click handling ex. the href that doesn't
								 * navigate to a URI, but changes the home
								 * page... would need a handler function where
								 * it'd change instance of SPA-home
								 */
								hrefClickHandler : '&'
							},
							link : function(scope, element, attributes) {
								scope.hrefClickHandlerString = attributes.hrefClickHandler;
							}
						};
					});

	spaHomeModule
			.directive(
					'menuNode',
					function($compile) {
						return {
							restrict : 'E',
							replace : true,
							link : function(scope, element) {

								var childNodeStr = "";
								/*
								 * Here we are checking that if current node has
								 * children then compiling/rendering children.
								 */
								if (scope.menuNode && scope.menuNode.children
										&& scope.menuNode.children.length > 0) {
									/*
									 * TODO: the functions registered for
									 * onclick below are defined in
									 * js/custom-bootstrap.js we need to figure
									 * out how to incorporate such custom
									 * functions in directive
									 */
									var hrefClickHandlerString = scope.$parent.hrefClickHandlerString;
									childNodeStr = '<li>'
											+ '<label class="nav-toggle nav-header">'
											+ '<span ng-click="arrowClicked($event);"'
											+ 'class="nav-toggle-icon glyphicon glyphicon-chevron-right"></span>'
											+ '<a ng-click="dropDownMenuLinkClicked($event);">{{menuNode.name}}</a></label>'
											+ '<ul class="nav nav-list nav-left-ml" style="display: none;">'
											+ '<menu-tree-structure menu-nodes="menuNode.children" href-click-handler="'
											+ hrefClickHandlerString
											+ '"></menu-tree-structure>'
											+ '</ul>' + '</li>';
								} else {
									childNodeStr = '<li>'
											+ '<a ng-if="menuNode.isHome" ng-click="localClickHandler(menuNode)">{{menuNode.name}}</a>'
											+ '<a ng-if="!menuNode.isHome" target="_self" ng-href="#/{{menuNode.href}}">{{menuNode.name}}</a>'
											+ '</li>';
								}
								element.html(childNodeStr);
								$compile(element.contents())(scope);
							},

							/*
							 * we've added controller to modify behavior of
							 * bootstrap elements/css
							 */
							controller : [
									'$scope',
									function menuNodeController($scope) {
										/*
										 * when the dropdown arrow is clicked,
										 * we need to toggle the arrow
										 */
										$scope.arrowClicked = function(e) {
											console.log('arrowClicked');
											var element = angular
													.element(e.currentTarget);
											e.stopPropagation();
											element.parent().parent().children(
													'ul.nav-left-ml').toggle(
													300);
											var cs = element.attr("class");
											if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-right') {
												element
														.removeClass(
																'glyphicon-chevron-right')
														.addClass(
																'glyphicon-chevron-down');
											}
											if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-down') {
												element
														.removeClass(
																'glyphicon-chevron-down')
														.addClass(
																'glyphicon-chevron-right');
											}
										}
										/*
										 * when the dropdown menu link is
										 * clicked, we need to toggle the arrow
										 */
										$scope.dropDownMenuLinkClicked = function(
												e) {
											console
													.log('dropDownMenuLinkClicked');
											var element = angular
													.element(e.currentTarget);
											e.stopPropagation();
											element.parent().parent().children(
													'ul.nav-left-ml').toggle(
													300);
											var cs = element.parent().children(
													'span').attr("class");
											if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-right') {
												element
														.parent()
														.children('span')
														.removeClass(
																'glyphicon-chevron-right')
														.addClass(
																'glyphicon-chevron-down');
											}
											if (cs == 'nav-toggle-icon glyphicon glyphicon-chevron-down') {
												element
														.parent()
														.children('span')
														.removeClass(
																'glyphicon-chevron-down')
														.addClass(
																'glyphicon-chevron-right');
											}
										}

										/*
										 * call href click handler of the parent
										 */
										$scope.localClickHandler = function(
												hrefData) {
											console
													.log('click handler in MenuNode directive');
											/*
											 * here the syntax in html is
											 * important, it just gives
											 * reference of the function without
											 * parameters we pass the parameter
											 * from here
											 */
											$scope.$parent.hrefClickHandler()(
													hrefData);
										}
									} ]
						};
					});

	/*
	 * TBD: ********* this is not complete yet ********** we'd need to keep the
	 * links in breadcrumb updated whenever the home page changes need to think
	 * through it. this can be done once all nav-bar and menus are functioning
	 */
	spaHomeModule
			.directive(
					'breadCrumbWithAddFavorites',
					function() {
						return {
							template : '<ol class="breadcrumb">'
									+ '<li hrefData in breadCrumbData.hrefDataCollection >'
									+ '<a href="#/{{hrefData.href}}">{{hrefData.name}}</a></li>'
									+ '<span class="glyphicon glyphicon-star-empty" '
									+ 'title="{{breadCrumbData.addFavString}}"'
									+ 'ng-click="launchAddFavorites()">'
									+ '</span>' + '</ol>',
							replace : true,
							restrict : 'E',
							scope : {
								breadCrumbData : '=breadCrumbData',
								addFavoritesTemplate : '='
							},
							controller : [
									'$scope',
									"$uibModal",
									function breadCrmbController($scope,
											$uibModal) {
										var self = this;
										$scope.launchAddFavorites = function() {
											console
													.log("trying to open modal for "
															+ $scope.addFavoritesTemplate);
											self.liveModal = $uibModal
													.open({
														animation : true,
														ariaLabelledBy : 'modal-title',
														ariaDescribedBy : 'modal-body',
														scope : $scope,
														templateUrl : $scope.addFavoritesTemplate,
														windowClass : 'center-modal',
														backdrop : 'static'
													});
										}
									} ]
						};
					});
}(window.angular));
