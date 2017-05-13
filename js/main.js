requirejs.config({
    baseUrl: 'js',
});

requirejs(['options', 'game', 'bitmapconverter','canvas'],
function   (Options, Game, BitmapConverter, Canvas) {

    const app = new Vue({
        el: '#app',
        data: {
            mapType: "defaultMap",
            bitmapLoaded: false,
            gameStarted: false
        },
        methods: {
            onFileChange (ev) {
                Canvas.initCanvasPanel({
                    selector: "#custom",
                    file: ev.target.files[0]
                });
                this.file = ev.target.files[0];
                this.bitmapLoaded = true;
                this.initCanvasPanel();
            },
            submit () {
                this.gameStarted = true;
                let canvas = $("#board");
                let options = Options.getOptions();

                canvas[0].requestPointerLock = canvas[0].requestPointerLock ||
                    canvas[0].mozRequestPointerLock;
                canvas[0].requestPointerLock();
                Game.init({
                    virtualBoard: BitmapConverter.convert(options),
                    canvas: canvas[0]
                })
            }
        }
    });

    $(document).ready(() => {
        Canvas.initCanvasPanel({
            selector: "#default",
            url:"img/labirynth1.bmp"
        });
    });
});
