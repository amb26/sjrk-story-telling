/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */


(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.ui.menu", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            languageLinkEnglish: ".sjrkc-storyTelling-menu-languages-en",
            languageLinkSpanish: ".sjrkc-storyTelling-menu-languages-es"
        },
        events: {
            onInterfaceLanguageChangeRequested: null
        },
        listeners: {
            "onReadyToBind.bindLanguageLinkEnglish": {
                "this": "{that}.dom.languageLinkEnglish",
                "method": "click",
                "args": ["en", "{that}.events.onInterfaceLanguageChangeRequested.fire"]
            },
            "onReadyToBind.bindLanguageLinkSpanish": {
                "this": "{that}.dom.languageLinkSpanish",
                "method": "click",
                "args": ["es", "{that}.events.onInterfaceLanguageChangeRequested.fire"]
            }
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/menu.handlebars"
                    }
                }
            }
        }
    });
})(jQuery, fluid);
