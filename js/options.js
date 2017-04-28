
define(function () {
    return {
        getOptions : () => {
            let selector;
            if( $("#custom input[type='radio']")[0].checked ) {
                selector = "#custom";
            }
            else if( $("#default input[type='radio']")[0].checked ) {
                selector = "#default";
            }
            return { selector: selector };
        }
    }
});
