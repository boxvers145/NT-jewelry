"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

export function TemporaryJewelryModel() {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    // Gentle idle rotation
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <Float
            speed={2} // Animation speed
            rotationIntensity={0.5} // XYZ rotation intensity
            floatIntensity={0.5} // Up/down float intensity
            floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within
        >
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                castShadow
                receiveShadow
                scale={hovered ? 1.05 : 1}
            >
                {/* Using a TorusKnot to simulate a complex jewelry piece */}
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                <meshStandardMaterial
                    color={hovered ? "#D4AF37" : "#C4A484"} // Gold base color
                    metalness={1}
                    roughness={0.15}
                    envMapIntensity={2}
                />
            </mesh>
        </Float>
    );
}

interface JewelryViewer3DProps {
    /** The model URL. In the future, this will be a .glb/.gltf file path */
    modelUrl?: string;
    /** Optional background override. Default is transparent for modal usage */
    background?: string;
}

export function JewelryViewer3D({ modelUrl, background = "transparent" }: JewelryViewer3DProps) {
    return (
        <div className="w-full h-full min-h-[400px] relative bg-transparent" style={{ background }}>
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, antialias: true }}
            >
                <color attach="background" args={["#0A0A0A"]} />

                {/* Lighting setup for jewelry */}
                <ambientLight intensity={0.5} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* The actual jewelry piece */}
                <TemporaryJewelryModel />

                {/* High quality environment map for metallic reflections */}
                <Environment preset="city" />

                {/* Soft shadow underneath the object */}
                <ContactShadows
                    position={[0, -2, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4}
                />

                {/* Interactivity */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={8}
                    autoRotate={false}
                />
            </Canvas>

            {/* Overlay UI hints */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none text-white/50 text-sm font-sans tracking-widest">
                GLISSEZ POUR TOURNER • PINCEZ POUR ZOOMER
            </div>
        </div>
    );
}
