import {
    Mesh,
    Vector3
} from "three";
import * as THREE from "three";



const fragment = `
uniform sampler2D iChannel0;
uniform vec3 uCameraPosition;

varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    vec3 worldPosition = vWorldPosition;
    vec3 worldNormal = normalize(vNormal);

    vec3 I = normalize(worldPosition - uCameraPosition);
    vec3 R = reflect(I, worldNormal);

    vec3 reflectColor = texture2D(iChannel0, vec2(0.5) - 0.5 * R.xy / R.z).rgb;

    float zoomFactor = 0.6;

    // Adjust refractive indices for a smaller chromatic dispersion
    float refractiveIndexR = 1.02;
    float refractiveIndexG = 1.015;
    float refractiveIndexB = 1.01;

    vec3 refractColorR = texture2D(iChannel0, vec2(0.5) - zoomFactor * refract(I, worldNormal, 1.0 / refractiveIndexR).xy / (refract(I, worldNormal, 1.0 / refractiveIndexR).z)).rgb;
    vec3 refractColorG = texture2D(iChannel0, vec2(0.5) - zoomFactor * refract(I, worldNormal, 1.0 / refractiveIndexG).xy / (refract(I, worldNormal, 1.0 / refractiveIndexG).z)).rgb;
    vec3 refractColorB = texture2D(iChannel0, vec2(0.5) - zoomFactor * refract(I, worldNormal, 1.0 / refractiveIndexB).xy / (refract(I, worldNormal, 1.0 / refractiveIndexB).z)).rgb;

    vec3 refractionColor = vec3(refractColorR.r, refractColorG.g, refractColorB.b);

    gl_FragColor = vec4(mix(refractionColor, reflectColor, 0.1), 1.0);
}
`

const vertex = `
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export function createDiamond() {
    // set up the sphere
    const geometry = new THREE.OctahedronGeometry(2.5);

    const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
            iChannel0: {
                value: null
            },
            uCameraPosition: {
                value: new THREE.Vector3()
            },
        },
    });

    const mesh = new THREE.Mesh(geometry, material);

    const update = (texture, camera) => {
        // mesh.rotation.x += 0.01 / 2;
        // mesh.rotation.y += 0.01 / 2;
        material.uniforms.iChannel0.value = texture;
        material.uniforms.uCameraPosition.value.copy(camera.position);
    };

    return {
        mesh,
        update
    };
}