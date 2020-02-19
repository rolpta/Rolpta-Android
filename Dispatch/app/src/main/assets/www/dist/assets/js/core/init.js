$(function() {

if(typeof(use_map)!='undefined' && use_map==true) {
    loadjs_once("dist/assets/js/core/maploader.js");
} else {
    loadjs_once("dist/assets/js/core/apploader.js");
}

});
