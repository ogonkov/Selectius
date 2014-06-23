requirejs.config({
    baseUrl: 'js/lib',

    paths: {
        jquery: '../vendor/jquery/jquery',
        backbone: '../vendor/backbone/backbone',
        underscore: '../vendor/underscore/underscore'
    }
});

require(['underscore'], function () {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
});