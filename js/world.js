/**
 * Created by tomek on 28.04.2017.
 */

define(function () {
    let wallTexture;

    return {
        createGround : (size) => {
            let wireframe = THREE.ImageUtils.loadTexture( 'img/floor.png' );
            wireframe.wrapS = wireframe.wrapT = THREE.RepeatWrapping;
            wireframe.repeat.set( size.width*4, size.height *4);
            let planeGeometry = new THREE.PlaneGeometry( size.width *8, size.height *8, 1, 1 );
            let planeMaterial = new THREE.MeshLambertMaterial( { map: wireframe } );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial);

            plane.rotation.x = -Math.PI/2;
            plane.position.y = -2;
            plane.position.z = -size.height / 2;
            plane.position.x = size.width / 2;

            return plane;
        },
        createLight : () => {
            let light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.x = -10;
            light.position.y = 100;
            light.position.z = 0;
            return light;
        },
        createWall : (size, position) => {
            return new Promise((resolve,reject) => {
                if (!wallTexture) {
                    wallTexture = new Promise((resolve, reject) => {
                        new THREE.TextureLoader().load('img/wall.png', (texture) => {
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set( 1, size.y );
                            resolve(texture);
                        })
                    });
                }
                wallTexture.then((texture) => {
                    let geometry = new THREE.BoxGeometry( size.x, size.y, size.z);
                    let material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide} );
                    let wall = new THREE.Mesh( geometry, material );
                    wall.position.y = position.y;
                    wall.position.x = position.x+=0.5;
                    wall.position.z = position.z-=0.5;
                    resolve(wall);
                });
            });
        },
        createSky : () => {
            return new Promise((resolve,reject) => {
                new THREE.CubeTextureLoader().load([
                    'img/right-sky.png', 'img/left-sky.png',
                    'img/top-sky.png', 'img/bottom-sky.png',
                    'img/front-sky.png', 'img/back-sky.png'
                ],(textureCube) => {
                    let geometry = new THREE.CubeGeometry( 100000, 100000, 100000);
                    var material = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        envMap: textureCube,
                        side: THREE.BackSide,
                        overdraw: true
                    });
                    resolve(new THREE.Mesh( geometry, material ));
                });
            });
        }

    }
});
