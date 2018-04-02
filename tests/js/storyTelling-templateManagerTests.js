/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testTemplateManager", {
        gradeNames: ["sjrk.storyTelling.templateManager"],
        templateConfig: {
            templatePath: "../html/templates/testTemplate.handlebars",
            messagesPath: "../json/messages/testLocalizationMessages.json"
        },
        testValues: {
            testValue: " a dynamic test value!"
        }
    });

    fluid.defaults("sjrk.storyTelling.templateManagerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test template manager.",
            tests: [{
                name: "Test template manager template rendering",
                expect: 2,
                sequence: [{
                    "event": "{templateManagerTest testTemplateManager}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerTester.testTemplateRendering",
                    args: ["{testTemplateManager}", "<span class=\"sjrkc-testTemplateManager-testMessage\">Hello, world!</span>"]
                },
                {
                    func: "{testTemplateManager}.renderTemplateOnSelf",
                    args: ["{testTemplateManager}.options.testValues"]
                },
                {
                    "event": "{testTemplateManager}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerTester.testTemplateRendering",
                    args: ["{testTemplateManager}", "<span class=\"sjrkc-testTemplateManager-testMessage\">Hello, world! a dynamic test value!</span>"]
                }]
            }]
        }]
    });

    // TODO: consider combining this and sjrk.storyTelling.templateManagerTesterBase.testLocalization
    sjrk.storyTelling.templateManagerTester.testTemplateRendering = function (templateManager, expectedContent) {
        var actualContent = templateManager.container.html().trim();

        jqUnit.assertEquals("Generated markup is inserted into specified container", expectedContent, actualContent);
    };

    fluid.defaults("sjrk.storyTelling.templateManagerTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templateManager: {
                type: "sjrk.storyTelling.testTemplateManager",
                container: "#testTemplateManager",
                createOnEvent: "{templateManagerTester}.events.onTestCaseStart"
            },
            templateManagerTester: {
                type: "sjrk.storyTelling.templateManagerTester"
            }
        }
    });

    jqUnit.test("Test resolveTerms function", function () {
        jqUnit.expect(1);

        var inputTerms = {
            testTemplate2: "%testTemplate",
            testTemp3: "%testTemplate2",
            testString: "testValue",
            testTemplate: "%testString"//,
            // testA: "%testArray.2",
            // testArray: ["value1", "value2", "value3", "%testTemplate"],
            // testB: "%testObject.testSubObject1",
            // testObject: {
            //     testSubObject1: "testValue1",
            //     testSubObject2: "%testObject.testSubObject1"
            // },
            // testObject2: {
            //     testSubObject3: "%testObject.testSubObject1"
            // }
        };

        var expectedResult = {
            testTemplate2: "testValue",
            testTemp3: "testValue",
            testString: "testValue",
            testTemplate: "testValue"//,
            // testA: "value3",
            // testArray: ["value1", "value2", "value3", "testValue"],
            // testB: "testValue1",
            // testObject: {
            //     testSubObject1: "testValue1",
            //     testSubObject2: "testValue1"
            // },
            // testObject2: {
            //     testSubObject3: "testValue1"
            // }
        };

        var actualResult = sjrk.storyTelling.templateManager.resolveTerms(inputTerms, inputTerms);

        jqUnit.assertDeepEq("Resolved terms are as expected", expectedResult, actualResult);
    });

    // Abstract, see implementations below
    // TODO: does this need to be abstract? could be defined within the generator function instead
    fluid.defaults("sjrk.storyTelling.templateManagerTesterBase", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test template manager localization.",
            tests: [{
                name: "Test locale translation",
                expect: 1,
                sequence: [{
                    "event": "{templateManagerTestBase templateManagerLocalized}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerTesterBase.testLocalization",
                    args: ["{templateManagerLocalized}", "testMessage", "{that}.options.expectedMessage"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.templateManagerTesterBase.testLocalization = function (component, selector, expected) {
        var actual = component.locate(selector).text().trim();
        jqUnit.assertEquals("Selector text matches expected value", expected, actual);
    };

    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest = function (languageCode, expected) {
        fluid.defaults("sjrk.storyTelling.templateManagerTester." + languageCode, {
            gradeNames: ["sjrk.storyTelling.templateManagerTesterBase"],
            expectedMessage: expected,
            modules: [{
                name: "Test templated component with localization (" + languageCode + ")"
            }]
        });
    };

    // TODO: Consider adding further languages that have differing
    //       character sets or right-to-left scripts
    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("en", "Hello, world!");
    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("fr", "Bonjour le monde!");
    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("es", "\u00A1Hola Mundo!");
    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("chef", "bork bork bork!");

    // Abstract, see factory function below for generating usable
    // test environment grades
    fluid.defaults("sjrk.storyTelling.templateManagerTestBase", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templateManagerLocalized: {
                type: "sjrk.storyTelling.testTemplateManager",
                // Set by implementing test environment grade
                // container: "#testTemplateManager",
                createOnEvent: "{templateManagerTesterLocalized}.events.onTestCaseStart",
                options: {
                    selectors: {
                        testMessage: ".sjrkc-testTemplateManager-testMessage"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment = function (languageCode) {
        fluid.defaults("sjrk.storyTelling.templateManagerTest." + languageCode, {
            gradeNames: ["sjrk.storyTelling.templateManagerTestBase"],
            components: {
                templateManagerLocalized: {
                    container: "#testTemplateManager_" + languageCode,
                    options: {
                        templateConfig: {
                            locale: languageCode
                        }
                    }
                },
                templateManagerTesterLocalized: {
                    type: "sjrk.storyTelling.templateManagerTester." + languageCode
                }
            }
        });
    };

    fluid.defaults("sjrk.storyTelling.testTemplateManagerHelper", {
        gradeNames: ["sjrk.storyTelling.templateManager"],
        templateConfig: {
            templatePath: "../html/templates/testHandleBarsHelperTemplate.handlebars",
            messagesPath: "../json/messages/testLocalizationMessages.json"
        },
        selectors: {
            testId1: ".sjrkc-testTemplateManager-testId1",
            testId2: ".sjrkc-testTemplateManager-testId2"
        }
    });

    fluid.defaults("sjrk.storyTelling.templateManagerHelperTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test template manager.",
            tests: [{
                name: "Test template manager Handlebars helper",
                expect: 2,
                sequence: [{
                    "event": "{templateManagerHelperTest testTemplateManagerHelper}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerHelperTester.testHandlebarsIdHelper",
                    args: ["{testTemplateManagerHelper}", "testId1", "testId2", "test"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.templateManagerHelperTester.testHandlebarsIdHelper = function (component, selector1, selector2, prefix) {
        var generatedId1 = component.locate(selector1).text().trim();
        var generatedId2 = component.locate(selector2).text().trim();

        jqUnit.assertNotEquals("Two generated IDs are not identical", generatedId1, generatedId2);

        jqUnit.assertEquals("Generated ID begins with prefix and dash", 0, generatedId1.indexOf(prefix + "-"));
    };

    fluid.defaults("sjrk.storyTelling.templateManagerHelperTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templateManagerHelper: {
                type: "sjrk.storyTelling.testTemplateManagerHelper",
                container: "#testTemplateManagerHelper",
                createOnEvent: "{templateManagerHelperTester}.events.onTestCaseStart"
            },
            templateManagerHelperTester: {
                type: "sjrk.storyTelling.templateManagerHelperTester"
            }
        }
    });

    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("en");
    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("fr");
    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("es");
    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("chef");

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.templateManagerTest",
            "sjrk.storyTelling.templateManagerTest.en",
            "sjrk.storyTelling.templateManagerTest.fr",
            "sjrk.storyTelling.templateManagerTest.es",
            "sjrk.storyTelling.templateManagerTest.chef",
            "sjrk.storyTelling.templateManagerHelperTest"
        ]);
    });

})(jQuery, fluid);
