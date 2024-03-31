import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Book3D = ({ thumbnail }) => {
  const mountRef = useRef(null);

  // use proxy to bypass CORS
  const proxyUrl = `/api/proxy/proxy?url=${encodeURIComponent(thumbnail)}`;

  useEffect(() => {
    if (!mountRef.current) return;

    // get the width and height of the container
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // render according to the size of the container
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    const scale = 0.5; // scale the book size
    const geometry = new THREE.BoxGeometry(3 * scale, 4.5 * scale, 0.3 * scale);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(proxyUrl, (texture) => {
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const book = new THREE.Mesh(geometry, material);
      scene.add(book);

      camera.position.z = 5;

      const animate = function () {
        requestAnimationFrame(animate);
        book.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [proxyUrl]);

  return <div ref={mountRef} className="w-full h-full"></div>;
};

export { Book3D };
