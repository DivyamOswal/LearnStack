import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  Float,
  Points,
  PointMaterial,
} from "@react-three/drei";

import {
  Box,
  useTheme,
} from "@mui/material";

import {
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";

import {
  useMemo,
  useRef,
} from "react";

import * as THREE from "three";

/* =======================================================
      CONSTANTS
======================================================= */

const PARTICLE_COUNT = 10000;

const GRID_SIZE = 60;

const GRID_DIVISIONS = 120;

/* =======================================================
      PARTICLE FIELD
======================================================= */

function ParticleField() {

  const theme = useTheme();

  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {

    const arr = new Float32Array(
      PARTICLE_COUNT * 3
    );

    for (let i = 0; i < PARTICLE_COUNT; i++) {

      arr[i * 3] =
        (Math.random() - .5) * 45;

      arr[i * 3 + 1] =
        (Math.random() - .5) * 24;

      arr[i * 3 + 2] =
        (Math.random() - .5) * 35;
    }

    return arr;

  }, []);

  useFrame((state) => {

    if (!ref.current) return;

    ref.current.rotation.y =
      state.clock.elapsedTime * .02;

    ref.current.rotation.x =
      Math.sin(
        state.clock.elapsedTime * .08
      ) * .04;

  });

  return (

    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >

      <PointMaterial
        transparent
        color={theme.palette.primary.main}
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />

    </Points>

  );

}

/* =======================================================
      FLOATING LIGHTS
======================================================= */

function FloatingLight({

  color,

  position,

  speed,

}:{

  color:string;

  position:[number,number,number];

  speed:number;

}){

  const ref =
    useRef<THREE.Mesh>(null);

  useFrame((state)=>{

    if(!ref.current) return;

    ref.current.position.y =
      position[1] +
      Math.sin(
        state.clock.elapsedTime * speed
      ) * .6;

    ref.current.rotation.y += .005;

  });

  return(

    <Float
      speed={speed}
      rotationIntensity={1}
      floatIntensity={2}
    >

      <mesh
        ref={ref}
        position={position}
      >

        <sphereGeometry
          args={[.28,32,32]}
        />

        <meshBasicMaterial
          color={color}
        />

      </mesh>

      <pointLight
        color={color}
        intensity={6}
        distance={7}
      />

    </Float>

  );

}

/* =======================================================
      CAMERA
======================================================= */

function CameraRig(){

  const {camera,mouse}=useThree();

  useFrame(()=>{

    camera.position.x =
      THREE.MathUtils.lerp(
        camera.position.x,
        mouse.x*1.3,
        .02
      );

    camera.position.y =
      THREE.MathUtils.lerp(
        camera.position.y,
        mouse.y*.8,
        .02
      );

    camera.lookAt(0,0,0);

  });

  return null;

}

/* =======================================================
      WAVE GRID
======================================================= */

function WaveGrid() {

  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {

    if (!ref.current) return;

    const time = state.clock.elapsedTime;

    const geometry =
      ref.current.geometry as THREE.PlaneGeometry;

    const position =
      geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {

      const x = position.getX(i);

      const y = position.getY(i);

      const z =
        Math.sin(x * 0.35 + time) * 0.25 +
        Math.cos(y * 0.4 + time * 0.7) * 0.2;

      position.setZ(i, z);
    }

    position.needsUpdate = true;

    geometry.computeVertexNormals();

  });

  return (

    <mesh
      ref={ref}
      rotation={[-Math.PI / 2.4, 0, 0]}
      position={[0, -5, -10]}
    >

      <planeGeometry
        args={[
          GRID_SIZE,
          GRID_SIZE,
          GRID_DIVISIONS,
          GRID_DIVISIONS,
        ]}
      />

      <meshStandardMaterial
        wireframe
        transparent
        opacity={0.08}
        color="#2DD4BF"
      />

    </mesh>

  );

}

/* =======================================================
      FLOATING TORUS
======================================================= */

function FloatingRing() {

  const ref =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {

    if (!ref.current) return;

    ref.current.rotation.x += 0.002;

    ref.current.rotation.y += 0.004;

    ref.current.position.y =
      Math.sin(state.clock.elapsedTime) * .5;

  });

  return (

    <Float
      speed={1.5}
      floatIntensity={2}
    >

      <mesh
        ref={ref}
        position={[0,1,-6]}
      >

        <torusGeometry
          args={[1.2,.08,32,120]}
        />

        <meshStandardMaterial
          color="#2DD4BF"
          metalness={1}
          roughness={0.15}
          emissive="#2DD4BF"
          emissiveIntensity={1.5}
        />

      </mesh>

    </Float>

  );

}

/* =======================================================
      AURORA
======================================================= */

function Aurora() {

  const theme = useTheme();

  return (

    <>

      <mesh position={[-12,5,-12]}>

        <planeGeometry
          args={[18,18]}
        />

        <meshBasicMaterial
          transparent
          opacity={0.12}
          color={
            theme.palette.primary.main
          }
        />

      </mesh>

      <mesh position={[12,-2,-14]}>

        <planeGeometry
          args={[15,15]}
        />

        <meshBasicMaterial
          transparent
          opacity={0.08}
          color="#6366F1"
        />

      </mesh>

      <mesh position={[0,8,-20]}>

        <planeGeometry
          args={[25,12]}
        />

        <meshBasicMaterial
          transparent
          opacity={0.05}
          color="#ffffff"
        />

      </mesh>

    </>

  );

}

/* =======================================================
      LIGHTS
======================================================= */

function SceneLights() {

  const theme = useTheme();

  return (

    <>

      <ambientLight intensity={0.6} />

      <directionalLight
        intensity={2}
        position={[5,6,6]}
      />

      <pointLight
        color={theme.palette.primary.main}
        intensity={4}
        position={[-5,4,2]}
      />

      <pointLight
        color="#6366F1"
        intensity={3}
        position={[6,-2,-4]}
      />

      <fog
        attach="fog"
        args={[
          theme.palette.mode === "dark"
            ? "#050816"
            : "#F8FAFC",
          10,
          40,
        ]}
      />

    </>

  );

}

/* =======================================================
      MAIN SCENE
======================================================= */

function Scene() {
  const theme = useTheme();

  return (
    <>
      <color
        attach="background"
        args={[
          theme.palette.mode === "dark"
            ? "#030712"
            : "#F8FAFC",
        ]}
      />

      <SceneLights />

      <CameraRig />

      <Aurora />

      <ParticleField />

      <WaveGrid />

      <FloatingRing />

      <FloatingLight
        color={theme.palette.primary.main}
        position={[-6, 3, -6]}
        speed={1.2}
      />

      <FloatingLight
        color="#6366F1"
        position={[6, -1, -8]}
        speed={1.6}
      />

      <FloatingLight
        color="#06B6D4"
        position={[0, 5, -10]}
        speed={1.1}
      />

      <EffectComposer>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}

/* =======================================================
      BACKGROUND
======================================================= */

export default function ThreeBackground() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Large Aurora */}
      <Box
        sx={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -350,
          top: -250,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: theme.palette.mode === "dark" ? 0.45 : 0.25,
          background: `radial-gradient(circle,
            ${theme.palette.primary.main} 0%,
            transparent 70%)`,
          animation: "aurora1 18s ease-in-out infinite alternate",
        }}
      />

      {/* Right Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 650,
          height: 650,
          right: -250,
          bottom: -180,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: theme.palette.mode === "dark" ? 0.35 : 0.18,
          background:
            "radial-gradient(circle,#6366F1 0%,transparent 70%)",
          animation: "aurora2 22s ease-in-out infinite alternate",
        }}
      />

      {/* Top Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          left: "35%",
          top: "-180px",
          borderRadius: "50%",
          filter: "blur(140px)",
          opacity: 0.18,
          background:
            "radial-gradient(circle,#06B6D4 0%,transparent 70%)",
          animation: "aurora3 16s ease-in-out infinite alternate",
        }}
      />

      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 8],
          fov: 55,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene />
      </Canvas>

      <style>
        {`
        @keyframes aurora1{
          from{
            transform:translate(-60px,-40px) scale(1);
          }
          to{
            transform:translate(80px,40px) scale(1.25);
          }
        }

        @keyframes aurora2{
          from{
            transform:translate(40px,30px) scale(1);
          }
          to{
            transform:translate(-80px,-50px) scale(1.3);
          }
        }

        @keyframes aurora3{
          from{
            transform:translateY(-30px) scale(1);
          }
          to{
            transform:translateY(60px) scale(1.2);
          }
        }
        `}
      </style>
    </Box>
  );
}