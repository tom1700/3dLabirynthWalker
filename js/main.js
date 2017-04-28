requirejs.config({
    baseUrl: 'js',
});

requirejs(['options', 'game', 'bitmapconverter','canvas'],
function   (Options, Game, BitmapConverter, Canvas) {
    $(document).ready(() => {

        Canvas.initCanvasPanel({
            selector: "#default",
            url:"img/labirynth1.bmp"
        });

        $("#custom input[type='file']").on("change",(ev) => {
            Canvas.initCanvasPanel({
                selector: "#custom",
                file: ev.target.files[0]
            });
        });

        $("#default input[type='radio']").click(() => $("#custom input[type='file']").attr("disabled",""));

        $("#custom input[type='radio']").click(() => $("#custom input[type='file']").removeAttr("disabled"));

        $("#optionsForm").submit((ev) => {
            ev.preventDefault();
            let options = Options.getOptions();
            if(options.selector === "#custom"){
                if(! $("#custom input[type='file']")[0].files || ! $("#custom input[type='file']")[0].files[0]){
                    return;
                }
            }
            $("#optionsPage").hide();
            let virtualBoard = BitmapConverter.convert(options);
            Game.init({
                virtualBoard: virtualBoard
            })
        });
    });
});
/*
$(document).ready(() => {

    function startLabirynth () {

        render();

        function render() {
            console.log("render");
            renderer.render(scene, camera);
        }
    }
});
*/
