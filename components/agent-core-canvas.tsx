"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

const nodes: [number, number, number][] = [
  [-2.25, 1.05, 0],
  [0, 1.65, 0.55],
  [2.3, 0.45, 0],
  [0, -1.5, 0.3],
];

function CoreSystem({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const pointPositions = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const loop = [...nodes, nodes[0]];
    for (let index = 0; index < loop.length - 1; index += 1) {
      points.push(new THREE.Vector3(...loop[index]), new THREE.Vector3(...loop[index + 1]));
    }
    for (const node of nodes) {
      points.push(new THREE.Vector3(...node), new THREE.Vector3(0, 0, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame(({ clock, pointer }, delta) => {
    if (!active || reducedMotion || !root.current) return;
    const t = clock.getElapsedTime();
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x * 0.16, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointer.y * 0.1, 3, delta);
    root.current.position.y = Math.sin(t * 0.45) * 0.06;
    if (core.current) {
      const scale = 1 + Math.sin(t * 1.2) * 0.035;
      core.current.scale.setScalar(scale);
    }
    nodeRefs.current.forEach((node, index) => {
      if (!node) return;
      const scale = 1 + Math.sin(t * 1.7 - index * 0.7) * 0.08;
      node.scale.setScalar(scale);
    });
  });

  return (
    <group ref={root} rotation={[-0.08, 0, -0.08]}>
      <gridHelper args={[13, 24, "#153a32", "#14211c"]} position={[0, -2.6, -1.7]} />
      <lineSegments geometry={pointPositions}>
        <lineBasicMaterial color="#2f8f78" transparent opacity={0.42} />
      </lineSegments>

      <group>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.72, 2]} />
          <meshStandardMaterial
            color="#b9ff66"
            emissive="#4c7e22"
            emissiveIntensity={0.8}
            metalness={0.18}
            roughness={0.32}
            wireframe
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.12, 0.015, 8, 80]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 2.7, 0.5, 0]}>
          <torusGeometry args={[1.52, 0.009, 8, 80]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} />
        </mesh>
      </group>

      {nodes.map((position, index) => (
        <group key={index} position={position}>
          <mesh ref={(mesh) => { nodeRefs.current[index] = mesh; }}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshStandardMaterial
              color={index === 3 ? "#b9ff66" : "#67e8f9"}
              emissive={index === 3 ? "#6ca32e" : "#1d7580"}
              emissiveIntensity={1.4}
            />
          </mesh>
          <mesh>
            <ringGeometry args={[0.34, 0.35, 40]} />
            <meshBasicMaterial
              color={index === 3 ? "#b9ff66" : "#67e8f9"}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function AgentCoreCanvas({
  active = true,
  reducedMotion = false,
}: {
  active?: boolean;
  reducedMotion?: boolean;
}) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.2, 7.2], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={active && !reducedMotion ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[2, 4, 4]} intensity={24} color="#67e8f9" />
      <pointLight position={[-3, -2, 3]} intensity={18} color="#b9ff66" />
      <CoreSystem active={active} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
