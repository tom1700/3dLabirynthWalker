
define(['world', 'controls'],
function (World) {
    let renderer;
    let virtualBoard;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    let directionVector = new THREE.Vector3();
    let controls;

    const SPEED = 0.4;
    const KEY_UP = 119;
    const KEY_RIGHT = 100;
    const KEY_DOWN = 115;
    const KEY_LEFT = 97;
    const yAxis = new THREE.Vector3(0,1,0).normalize();

    function render() {
        renderer.render( scene, camera );
        requestAnimationFrame( render );
    }

    function positionToCords(position) {
        let x = position.x + virtualBoard.board[0].length / 2;
        let z = -1 * position.z;
        return {
            x:x >= 0 ? Math.floor(x) : Math.ceil(x),
            z:z >= 0 ? Math.floor(z) : Math.ceil(z)
        };
    }

    function checkCollisions (move) {
        let newVector = controls.getObject().position.clone();
        newVector.add(move.multiplyScalar(SPEED));
        const position = positionToCords(newVector);
        console.log(position);
        if(position.z > virtualBoard.board.length || position.z < 0) {
            return true;
        }
        if (position.x > virtualBoard.board[0].length || position.x < 0) {
            return true;
        }
        if (virtualBoard.board[position.z][position.x] === 1) {
            return false;
        }
        return true;
    }

    function keyPressed (ev) {
        directionVector = camera.getWorldDirection(directionVector);
        if (ev.which === KEY_RIGHT) {
            directionVector.applyAxisAngle(yAxis, 3*Math.PI/2);
        }
        if (ev.which === KEY_DOWN) {
            directionVector.applyAxisAngle(yAxis, Math.PI);
        }
        if (ev.which === KEY_LEFT) {
            directionVector.applyAxisAngle(yAxis, Math.PI/2);
        }
        if (ev.which === KEY_UP || ev.which === KEY_RIGHT || ev.which === KEY_DOWN || ev.which === KEY_LEFT) {
            directionVector.y = 0;
            if (checkCollisions(directionVector)) {
                controls.getObject().position.add(directionVector.multiplyScalar(SPEED));
            }
        }
    }

    function attachEvents () {
        $(document).keypress(keyPressed);
        $(document).keydown(keyPressed);
    }

    function generateWalls () {
        let result = [];
        for (let i = 0; i < virtualBoard.board.length; i++) {
            for (let j = 0; j < virtualBoard.board[i].length; j++) {
                if(virtualBoard.board[i][j] === 1) {
                    result.push(
                        World.createWall(
                            { x:1, y:4, z:1 },
                            { x:j - virtualBoard.board[i].length / 2, y:0, z:-i }
                        )
                    );
                }
            }
        }

        return Promise.all(result);
    }

    return {
        init: (params) => {
            renderer = new THREE.WebGLRenderer({canvas: params.canvas/*,antialias:true*/});
            renderer.setSize( window.innerWidth, window.innerHeight );

            let ground = World.createGround({ width:10, height:10 });
            let light = World.createLight();
            let ambientLight = new THREE.AmbientLight(0x555555);

            virtualBoard = params.virtualBoard;

            generateWalls().then((walls) => {

                controls = new THREE.PointerLockControls( camera );
                controls.enabled = true;

                scene.add( controls.getObject() );

                scene.add(light);
                scene.add(ground);
                walls.forEach((wall) => scene.add(wall));
                scene.add(ambientLight);
                attachEvents();
                render();
            });
        }
    }
})

