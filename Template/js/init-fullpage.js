document.addEventListener('DOMContentLoaded', function () {
    var sections = document.querySelectorAll('.page-fullpage > .section');
    var sectionsNames = [];
    sections.forEach(function(section, index) {
        sectionsNames.push(section.getAttribute('data-section'));
    })

    // move all bootsrap modal at the end of the body tag
    var modals = document.querySelectorAll('.section .modal');
    modals.forEach(function(modal, index) {
        document.body.appendChild(modal);
    })

    // Init fullpage js
    var mainPage = $('.page-fullpage');
    var arrowElem = $('.p-footer .arrow-d');
    var pageElem = $('.section');
	var slideElem = $('.slide');
	var siteFooter = $('.page-footer');
	var siteHeader = $('.navbar-top-alpha');
	var siteHeaderFooter = $('.navbar-top-alpha,.page-footer,.section-footer');
    if (mainPage.width()) {
        // config fullpage.js
        mainPage.fullpage({
            menu: '.fp-menu',
            anchors: sectionsNames,
            verticalCentered: false,
            css3: true,
            navigation: true,
            responsiveWidth: 1024,
            responsiveHeight: 480,
            scrollOverflow: true,
            scrollBar: false,
            // scrollOverflow: scrollOverflow,
            scrollOverflowOptions: {
                // scrollbars: false,
                click: false,
                submit: true,
            },
            normalScrollElements: '.section .scrollable',
            afterRender: function () {
                // init parallax 
                var parallaxCover = document.getElementById('parallax-cover')
                if (parallaxCover) {
                    if (contextWindow.width() > 1024) {
                        var parallaxInstance = new Parallax(parallaxCover);
                    }
                }


            },
            afterResize: function () {
                var pluginContainer = $(this);
                $.fn.fullpage.reBuild();
                // uncomment below to force reload windows on screen resize
                if (contextWindow.width() > 1023) {
                    location.reload();
                }
            },
            onLeave: function (index, nextIndex, direction) {
                // Behavior when a full page is leaved
                arrowElem.addClass('gone');
                pageElem.addClass('transition');
                slideElem.removeClass('transition');
                pageElem.removeClass('transition');
            },
            afterLoad: function (anchorLink, index) {
                // Behavior after a full page is loaded
                var pageCover = $('.page-cover');
                if (index > 1 ){
                    if (!pageCover.hasClass('scrolled')) {
                        pageCover.addClass('scrolled');
                    }
                    if (!siteHeader.hasClass('fp-scrolled')) {
                        siteHeader.addClass('fp-scrolled');
                    }
                    if (!siteFooter.hasClass('fp-scrolled')) {
                        siteFooter.addClass('fp-scrolled');
                    }
                }  else {
                    pageCover.removeClass('scrolled');
                    siteHeader.removeClass('fp-scrolled');
                    siteFooter.removeClass('fp-scrolled');
                }
                var activeSection = $('.section.active');
                var fpNav = $('#fp-nav');
                if (!activeSection.hasClass('section-anim')) {
                    // uncomment below for onetime animation
                    activeSection.addClass('section-anim');
                } 
                if (activeSection.hasClass('section-text-bright')) {
                    // uncomment below for onetime animation
                    siteHeaderFooter.addClass('text-bright');
                    fpNav.addClass('text-bright');
                } else {
                    siteHeaderFooter.removeClass('text-bright');
                    fpNav.removeClass('text-bright');
                }
                if (activeSection.hasClass('section-text-dark')) {
                    // uncomment below for onetime animation
                    siteHeaderFooter.addClass('text-dark');
                    fpNav.addClass('text-dark');
                } else {
                    siteHeaderFooter.removeClass('text-dark');
                    fpNav.removeClass('text-dark');
                }
            }
        });
    }
});