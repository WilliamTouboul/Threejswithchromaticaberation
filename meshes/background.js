import * as THREE from 'three';


export function createBackground() {
    const loadShader = (url) => {
        return fetch(url)
            .then(response => response.text())
            .catch(error => {
                console.error(`Failed to load shader: ${url}`, error);
            });
    };

    return Promise.all([
        loadShader('../shaders/grid/vertex.glsl'),
        loadShader('../shaders/grid/fragment.glsl')
    ]).then(([vertex, fragment]) => {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uGridSize: {
                    value: 20.0
                },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            side: THREE.DoubleSide,
        });
        const geometry = new THREE.SphereGeometry(20, 20, 20); // Radius, width, height

        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    });
}