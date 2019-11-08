// $(document).ready(()=>{
//     $("#embargo").on("change", function(){
//         if($(this).is(":checked")){
//             // console.log("tete")
//             $("#embargoDateField").show();
//         } else {
//             // console.log("oweowro")
//             $("#embargoDateField").hide();
//         }
//     })
// })

var btnCancel = $('<button></button>')
.text('Cancel') .addClass('btn btn-danger') 
.on('click', function(){
    location.href = "/"
});

var btnFinish = $('<button></button>').text('Finish')
                                             .addClass('btn btn-info btn-finish disabled')
                                             .on('click', function(){
                                                    if( !$(this).hasClass('disabled')){
                                                        var elmForm = $("#wizard");
                                                        $('form[name="form-wizard"]').parsley().validate()
                                                        if(elmForm){
                                                            // elmForm.validator('validate');
                                                            var elmErr = elmForm.find('.parsley-error');
                                                            if(elmErr && elmErr.length > 0){
                                                                alert('Oops we still have error in the form');
                                                                return false;
                                                            }else{
                                                                alert('Great! we are ready to submit form');
                                                                $('form[name="form-wizard"]').parsley().submit();
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                });
var handleBootstrapWizardsValidation = function() {
    "use strict";
    $("#wizard").smartWizard({
        selected: 0,
        theme: "default",
        transitionEffect: "",
        transitionSpeed: 0,
        useURLhash: !1,
        showStepURLhash: !1,
        toolbarSettings: {
            toolbarPosition: "bottom", toolbarExtraButtons: [btnFinish, btnCancel]
        }
    }), $("#wizard").on("leaveStep", function(t, a, i, r) {
        return $('form[name="form-wizard"]').parsley().validate("step-" + (i + 1))
    }), $("#wizard").keypress(function(t) {
        13 == t.which && $("#wizard").smartWizard("next")
    }),$("#wizard").on("showStep", function(e, anchorObject, stepNumber, stepDirection) {
        // Enable finish button only on last step
        if(stepNumber == 2){
            console.log("fkfdk")
            $('.btn-finish').removeClass('disabled');
        }else{
            console.log("lslkkk")
            $('.btn-finish').addClass('disabled');
        }
    })
},
FormWizardValidation = function() {
    "use strict";
    return {
        init: function() {
            handleBootstrapWizardsValidation()
        }
    }
}();