$(document).ready(()=>{
    $("[name='embargo']").on("change", function(){
        console.log($(this).val(), "hjfdbfjdb")
        if($(this).val() === "1"){
            console.log("tete")
            $("#releaseDateDiv").show();
        } else {
            console.log("oweowro")
            $("#releaseDateDiv").hide()
        }
    })
})
$(document).ready(()=>{
    $("[name='published']").on("change", function(){
        if($(this).val() === "yes"){
            console.log("tete12")
            $("#doiReference").show();
        } else {
            console.log("oweowro12")
            $("#doiReference").hide();
        }
    })
})

$(document).on('change', '.custom-file-input', function (event) {
    $(this).next('.custom-file-label').html(event.target.files[0].name);
})

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