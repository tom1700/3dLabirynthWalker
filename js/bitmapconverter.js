
define(function () {

    function colorToBoolean (r,g,b,a) {
        if (r === 0 && g === 0 && b === 0 && a === 255) {
           return 1;
        }
        else if (r === 255 && g === 255 && b === 255 && a === 255) {
            return 0;
        }
        else {
            return -1;
        }
    }

    function findEntry (board) {
        let height = board.length;
        let width = board[0].length;
        for (let i = 0; i < width; i++) {
            if(board[0][i] === 0) {
                return {x:i,y:0};
            }
            if(board[height-1][i] === 0) {
                return {x:i,y:height-1};
            }
        }
        for (let i = 0; i < height; i++) {
            if(board[i][0] === 0) {
                return {x:0, y:i};
            }
            if(board[i][width-1] === 0) {
                return {x:width-1, y:i};
            }
        }
        return "error";
    }

    return {
        convert: (options) => {
            let selector = options.selector;
            let canvas = $(selector + " canvas")[0];
            let ctx = canvas.getContext("2d");
            let board = [];
            let data = ctx.getImageData(0,0,canvas.width,canvas.height);
            let entry;

            for (let i = 0; i < data.height; i++) {
                board.push([]);
                for (let j = 0; j < data.width; j++ ) {
                    let r = data.data[(i*data.width*4) + (j * 4)];
                    let g = data.data[(i*data.width*4) + (j * 4) + 1];
                    let b = data.data[(i*data.width*4) + (j * 4) + 2];
                    let a = data.data[(i*data.width*4) + (j * 4) + 3];

                    board[i].push(colorToBoolean(r,g,b,a));
                }
            }

            entry = findEntry(board);

            return {
                board:board,
                entry:entry
            };
        }
    }
})

