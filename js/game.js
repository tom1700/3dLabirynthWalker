
define(['world', 'controls'],
function (World) {
    let renderer;
    let virtualBoard;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    let directionVector = new THREE.Vector3();
    let controls;

    const SPEED = 0.3;
    const KEY_UP = 87;
    const KEY_RIGHT = 68;
    const KEY_DOWN = 83;
    const KEY_LEFT = 65;
    const yAxis = new THREE.Vector3(0,1,0).normalize();

    let moveDirections = {
        forward : false,
        left: false,
        right: false,
        backward: false
    };

    function render() {
        move();
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

        console.log(ev.which);
        if (ev.which === KEY_RIGHT) {
            moveDirections.right = true;
        }
        else if (ev.which === KEY_DOWN) {
            moveDirections.backward = true;
        }
        else if (ev.which === KEY_LEFT) {
            moveDirections.left = true;
        }
        else if (ev.which === KEY_UP) {
            moveDirections.forward = true;
        }
    }

    function keyReleased (ev) {
        if (ev.which === KEY_RIGHT) {
            moveDirections.right = false;
        }
        else if (ev.which === KEY_DOWN) {
            moveDirections.backward = false;
        }
        else if (ev.which === KEY_LEFT) {
            moveDirections.left = false;
        }
        else if (ev.which === KEY_UP) {
            moveDirections.forward = false;
        }
    }

    function move () {
        console.log(moveDirections);
        directionVector = camera.getWorldDirection(directionVector);

        if (moveDirections.forward && !moveDirections.backward) {
            if (moveDirections.left && !moveDirections.right) {
                directionVector.applyAxisAngle(yAxis, Math.PI/4);
            }
            else if (moveDirections.right && !moveDirections.left) {
                directionVector.applyAxisAngle(yAxis, 7*Math.PI/4);
            }
            else {/*No need to do anything*/}
        }
        else if (moveDirections.backward && !moveDirections.forward) {
            if (moveDirections.left && !moveDirections.right) {
                directionVector.applyAxisAngle(yAxis, 3*Math.PI/4);
            }
            else if (moveDirections.right && !moveDirections.left) {
                directionVector.applyAxisAngle(yAxis, 5*Math.PI/4);
            }
            else {
                directionVector.applyAxisAngle(yAxis, Math.PI);
            }
        }
        else if (moveDirections.left && !moveDirections.right) {
            directionVector.applyAxisAngle(yAxis, Math.PI/2);
        }
        else if (moveDirections.right && !moveDirections.left) {
            directionVector.applyAxisAngle(yAxis, 3*Math.PI/2);
        }

        directionVector.y = 0;
        if (moveDirections.forward || moveDirections.left || moveDirections.right || moveDirections.backward) {

            if (checkCollisions(directionVector)) {
                controls.getObject().position.add(directionVector.multiplyScalar(SPEED));
            }
        }
    }

    function attachEvents () {
        $(document).keydown(keyPressed);
        $(document).keyup(keyReleased);
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

