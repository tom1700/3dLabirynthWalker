
define(['world', 'controls'],
function (World) {
    let renderer;
    let virtualBoard;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    let directionVector = new THREE.Vector3();
    let controls;

    const SPEED = 0.12;
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
        let x = position.x;
        let z = -1 * position.z;
        return {
            x:x >= 0 ? Math.floor(x) : Math.ceil(x),
            z:z >= 0 ? Math.floor(z) : Math.ceil(z)
        };
    }

    function checkCollisions (move) {
        const position = controls.getObject().position;
        let newVector = position.clone();
        let moveCopy = move.clone();
        newVector.add(moveCopy.multiplyScalar(SPEED*2));
        const cord = positionToCords(newVector);
        if(cord.z >= virtualBoard.board.length || cord.z < 0) {
            return true;
        }
        if (cord.x >= virtualBoard.board[0].length || cord.x < 0) {
            return true;
        }
        if (virtualBoard.board[cord.z][cord.x] === 1) {
            return false;
        }
        return true;
    }

    function keyPressed (ev) {
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
            if (!checkCollisions(directionVector)) {
                const position = controls.getObject().position.clone();
                const newPosition = position.clone().add(directionVector.multiplyScalar(SPEED));
                const cords = positionToCords(position);
                const newCords = positionToCords(newPosition);

                if (cords.x !== newCords.x) {
                    if (cords.z === newCords.z) {
                        directionVector.x = 0;
                    }
                    else if (cords.z < newCords.z && virtualBoard.board[newCords.z-1] && virtualBoard.board[newCords.z-1][newCords.x] === 1) {
                        directionVector.x = 0;
                    }
                    else if (cords.z > newCords.z && virtualBoard.board[newCords.z+1] && virtualBoard.board[newCords.z+1][newCords.x] === 1) {
                        directionVector.x = 0;
                    }
                }
                if (cords.z !== newCords.z) {
                    if (cords.x === newCords.x) {
                        directionVector.z = 0;
                    }
                    else if (cords.x < newCords.x && virtualBoard.board[newCords.z][newCords.x-1] === 1) {
                        directionVector.z = 0;
                    }
                    else if (cords.x > newCords.x && virtualBoard.board[newCords.z][newCords.x+1] === 1) {
                        directionVector.z = 0;
                    }
                }
                directionVector.multiplyScalar(8);
            }
            controls.getObject().position.add(directionVector.multiplyScalar(SPEED));
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
                            { x:j, y:0, z:-i }
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

            virtualBoard = params.virtualBoard;
            let ground = World.createGround({ width:virtualBoard.board[0].length, height:virtualBoard.board.length });
            let light = World.createLight();
            let ambientLight = new THREE.AmbientLight(0x555555);


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
            World.createSky().then(sky => scene.add(sky));
        }
    }
})

