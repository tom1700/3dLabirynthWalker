
define(function () {
    return {
        initCanvasPanel : (params) => {
            const canvasSelector = params.selector + " canvas";
            let ctx = $(canvasSelector)[0].getContext("2d");
            if(params.file) {
                let URL = window.webkitURL || window.URL;
                params.url = URL.createObjectURL(params.file);
            }

            let img = new Image();

            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            img.src = params.url;
            img.onload = () => {
                $(params.selector + " .canvas-width").text(img.width);
                $(params.selector + " .canvas-height").text(img.height);
                $(canvasSelector)[0].width = img.width;
                $(canvasSelector)[0].height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
            }
        }
    }
});
