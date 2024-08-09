/**
 * Section scroll pager
 * It includes : 
 * Pager
 * Add active class to a section if it is visible
 * Element can detect if a section is active (useful for menu on top)
 * Add attribute  data-section-anchor="section-id" to a menu to add active class when the section is visible
 * ------------
 * Version : 0.1
 * 
 * default container class : sections-pager
 * default section class : section
 */

; (function () {
    'use strict'

    var sectionPager

    class SectionPager {

        constructor(element, config) {
            // Support instantiation without the `new` keyword.
            if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== SectionPager.prototype) {
                return new SectionPager(element, config);
            }
            sectionPager = this; // Save reference to instance.
            sectionPager.version = '1.0';
            sectionPager.container = _resolveContainer(element);
            sectionPager.initialized = false;
            if (config) {
                // sectionPager.config = config;
                sectionPager.config.sectionClass = config.sectionClass || sectionPager.config.sectionClass
                sectionPager.config.containerClass = config.containerClass || sectionPager.config.containerClass
            }

            return sectionPager;
        }
        init() {
            if (sectionPager && sectionPager.container) {
                _init();
            } else {
                console.log('SectionPager: initiation failed.');
            }
            return sectionPager;
        }
    }

        /**
         * Configuration
         * -------------
         * This object signature can be passed directly to the SectionPager constructor,
         * or as the second argument of the `reveal()` method.
         */
        SectionPager.prototype.config = {
        container: document.querySelector('.scroll-slider'),
        sectionClass: 'section',
        containerClass: 'sections-pager',
    }


    /**
     * Private Methods
     */
    function _init() {
        // Sections list
        sectionPager.sections = sectionPager.container.querySelectorAll(`.${sectionPager.config.sectionClass}`);
        sectionPager.activeSectionIndex = 0;

        // Section that will change on content-color
        sectionPager.changeColorItems = document.querySelectorAll(`.change-color-pager`);

        // Add dotnav
        sectionPager.dotNavWrapper = document.createElement('ul')
        sectionPager.dotNavWrapper.classList.add('nav-dots')
        sectionPager.sections.forEach(function (section, index) {
            let dotNavItem = document.createElement('li');
            dotNavItem.classList.add('nav-item');
            let dotNavLink = document.createElement('a');
            dotNavLink.classList.add('nav-link');
            // Use id a attribute
            if (section.getAttribute('id')) {
                dotNavLink.setAttribute('href', `#${section.getAttribute('id')}`)
            } else {
                dotNavLink.addEventListener('click', function () {
                    window.scrollTo(0, section.offsetTop)
                })
            }
            dotNavItem.appendChild(dotNavLink);
            sectionPager.dotNavWrapper.appendChild(dotNavItem);

        });
        // document.querySelector('.nav-dot-container').appendChild(dotNavWrapper)
        let navDotContainer = document.createElement('nav')
        navDotContainer.classList.add('nav-dot-container')
        navDotContainer.appendChild(sectionPager.dotNavWrapper)
        document.body.appendChild(navDotContainer)

        // Section event on scroll
        sectionPager.dotNavItems = sectionPager.dotNavWrapper.querySelectorAll('.nav-item');
        sectionPager.sectionAnchorItems = document.querySelectorAll('[data-section-anchor]');
        // First active section will be the first section
        sectionPager.activeSection = document.querySelector('.page-main > .section');;
        window.addEventListener('scroll', function () {

        })



        if (!sectionPager.initialized) {
            _scrollHandler()
            window.addEventListener('scroll', _scrollHandler)
            sectionPager.initialized = true
        }
        return sectionPager
    }

    function _scrollHandler() {
        sectionPager.sections.forEach(function (section, index) {
            // console.log('active')
            // add active class to active section
            if (_isScrolledIntoSection(section)) {
                sectionPager.activeSectionIndex = index;
                sectionPager.activeSection = section;
                if (!section.classList.contains('active')) {
                    section.classList.add('active');
                }
                
            } else {
                section.classList.remove('active');
            }

            /* if (_isScrolledIntoSection(section, 1/4)) {
                if (section.classList.contains('content-white')) {
                    // console.log('content-white')
                    sectionPager.changeColorItems.forEach(function (changeColorItem) {
                        if (!changeColorItem.classList.contains('content-white')) {
                            changeColorItem.classList.add('content-white');
                        }
                    });
                } else {
                    sectionPager.changeColorItems.forEach(function (changeColorItem) {
                        changeColorItem.classList.remove('content-white');
                    });
                }
            } */

            sectionPager.changeColorItems.forEach(function (changeColorItem) {
                if (_isElementSuperposed(section, changeColorItem)) {
                    console.log('super posed items')
                    if (section.classList.contains('content-white')){
                        if (!changeColorItem.classList.contains('content-white')) {
                            changeColorItem.classList.add('content-white');
                        }
                    } else {
                        changeColorItem.classList.remove('content-white');
                    }
                }                
            });

            

            // add active class to active dot-navs
            // let dotNavItems = dotNavWrapper.children;
            sectionPager.dotNavItems.forEach(function (dotNavItem, index) {
                if (index === sectionPager.activeSectionIndex) {
                    if (!dotNavItem.classList.contains('active')) {
                        dotNavItem.classList.add('active');
                    };
                } else {
                    dotNavItem.classList.remove('active')
                }
            })
            // dotNavWrapper.children[activeSectionIndex]
        });

        // section anchor link
        sectionPager.sectionAnchorItems.forEach(function (sectionAnchorItem, index) {
            if (sectionPager.activeSection.getAttribute('id') === sectionAnchorItem.getAttribute('data-section-anchor')) {
                if (!sectionAnchorItem.classList.contains('active')) {
                    sectionAnchorItem.classList.add('active');
                };
            } else {
                sectionAnchorItem.classList.remove('active')
            }
        })
    }

    function _resolveContainer(container) {
        if (container) {
            if (typeof container === 'string') {
                return window.document.documentElement.querySelector(container)
            } else if (_isNode(container)) {
                return container
            } else {
                console.log('SectionPager: invalid container "' + container + '" provided.')
                console.log('SectionPager: falling back to default container.')
            }
        }
        // return document.querySelector('.scroll-slider')
        return sectionPager.config.container
    }

    function _isElementSuperposed(el1, el2) {
        let el1Rect = el1.getBoundingClientRect();
        let el2Rect = el2.getBoundingClientRect();
        if (el1Rect.top <= el2Rect.bottom && 
            el2Rect.top <= el1Rect.bottom) 
        {
            return true;
        }
        return false
    }

    // JS Helpers and utilities 
    function _isScrolledIntoSection(el, boundary = 1/3) {
        let rect = el.getBoundingClientRect();
        let elemTop = rect.top;
        let elemBottom = rect.bottom;

        let viewLimit = window.innerHeight * boundary;
        let isVisible = false;
        // isVisible = rect.top < 0 && rect.top 
        // completely visible
        // isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        // partially visible
        // isVisible = elemTop < window.innerHeight*(1/3) && elemBottom >=0
        // isVisible = elemTop < window.innerHeight*(1/3) && elemBottom >=window.innerHeight*(1/3)
        isVisible = elemTop < viewLimit && elemBottom >= viewLimit
        return isVisible
    }

    /* Utilities */
    function _isNode(object) {
        return typeof window.Node === 'object'
            ? object instanceof window.Node
            : object && typeof object === 'object' &&
            typeof object.nodeType === 'number' &&
            typeof object.nodeName === 'string'
    }


    /**
     * Module Wrapper
     * --------------
     */
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SectionPager
    } else {
        window.SectionPager = SectionPager
    }
    // if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    //     define(function () {
    //         return SectionPager
    //     })
    // } else if (typeof module !== 'undefined' && module.exports) {
    //     module.exports = SectionPager
    // } else {
    //     window.SectionPager = SectionPager
    // }
})();
