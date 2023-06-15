import {
    Mesh,
    MeshBasicMaterial,
    Scene
} from "three";

import {
    FontLoader
} from 'three/addons/loaders/FontLoader';

import {
    TextGeometry
} from 'three/addons/geometries/TextGeometry';



export function addText(text, scene) {
    const fontLoader = new FontLoader();
    let mesh;
    fontLoader.load("/font/Hanson_bold.json", (font) => {
        // Create text geometry
        const textGeometry = new TextGeometry(text, {
            font: font,
            size: 1.3,
            height: 0.001,
            curveSegments: 12,
            bevelEnabled: false,
        });

        textGeometry.computeBoundingBox();

        // Create a material for the text
        const textMaterial = new MeshBasicMaterial({
            color: 0x000000
        });

        // Create a mesh with the geometry and material
        mesh = new Mesh(textGeometry, textMaterial);

        const scale = (.9 * window.innerWidth) / 951;

        // Scale and position the text mesh
        mesh.scale.set(scale, scale, scale);
        // I want to set the mesh position at the center of the screen
        mesh.position.set(
            (-textGeometry.boundingBox?.max.x / 2) * scale,
            (-textGeometry.boundingBox?.max.y / 2) * scale,
            -6
          );
        // Add the text mesh to the scene
        scene.add(mesh);
    });
}