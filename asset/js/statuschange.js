// Paper Bootstrap Wizard Functions

searchVisible = 0;
transparent = true;

$(document).ready(function() {

    /*  Activate the tooltips      */
    $('[rel="tooltip"]').tooltip();

    // Wizard Initialization
    $('.wizard-card').bootstrapWizard({
        'tabClass': 'nav nav-pills',

        onInit: function(tab, navigation, index) {

            //check number of tabs and fill the entire row
            var $total = navigation.find('li').length;
            $width = 100 / $total;

            navigation.find('li').css('width', $width + '%');

        },

        onTabClick : function(tab, navigation, index){

            return false;

        },

        onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;

            var $wizard = navigation.closest('.wizard-card');

            // If it's the last tab then hide the last button and show the finish instead
            // if($current >= $total) {
            //     $($wizard).find('.btn-next').hide();
            //     $($wizard).find('.btn-finish').show();
            // } else {
            //     $($wizard).find('.btn-next').show();
            //     $($wizard).find('.btn-finish').hide();
            // }

            //update progress
            var move_distance = 100 / $total;
            move_distance = move_distance * (index) + move_distance / 2;

            $wizard.find($('.progress-bar')).css({
                width: move_distance + '%'
            });
            //e.relatedTarget // previous tab

            $wizard.find($('.wizard-card .nav-pills li.active a .icon-circle')).addClass('checked');

        }
    });

});