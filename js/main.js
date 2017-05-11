requirejs.config({
    baseUrl: 'js',
});

requirejs(['options', 'game', 'bitmapconverter','canvas'],
function   (Options, Game, BitmapConverter, Canvas) {
    $(document).ready(() => {
        $("#board").hide();
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

        $("#submit").click(() => {
            let canvas = $("#board");
            $("#board").show();
            let options = Options.getOptions();
            if(options.selector === "#custom"){
                if(! $("#custom input[type='file']")[0].files || ! $("#custom input[type='file']")[0].files[0]){
                    return;
                }
            }
            $("#optionsPage").hide();
            canvas[0].requestPointerLock = canvas[0].requestPointerLock ||
                canvas[0].mozRequestPointerLock;
            canvas[0].requestPointerLock();
            Game.init({
                virtualBoard: BitmapConverter.convert(options),
                canvas: canvas[0]
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
