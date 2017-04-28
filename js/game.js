
define(function () {

    let renderer;
    let virtualBoard;
    let scene;
    let camera;
    let middle = window.innerWidth / 2;
    let oldX = middle;
    function render() {
        requestAnimationFrame( render );
        renderer.render( scene, camera );
    }

    function mouseMove (ev) {
        let vector = ev.clientX - oldX;
        oldX = ev.clientX;
        camera.rotation.y += -1* Math.PI * vector / window.innerWidth;
    }

    return {
        init: (params) => {
            virtualBoard = params.virtualBoard;
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            renderer = new THREE.WebGLRenderer();

            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );

            let material = new THREE.MeshLambertMaterial({color: 0xFF0000});
            let geometry = new THREE.BoxGeometry( 1, 1, 1 );
            let cube1 = new THREE.Mesh( geometry, material );
            cube1.rotateY(Math.PI/4);
            scene.add( cube1 );
            scene.add( new THREE.AmbientLight( 0x111111) );

            let light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.x = 0;
            light.position.y = 0;
            light.position.z = 5;
            scene.add(light);

            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 5;

            document.addEventListener("mousemove", mouseMove);
            render();

        }
    }
})

