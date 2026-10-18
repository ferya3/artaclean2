"use client";

import { ContactShadows, Grid, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

/**
 * صحنه سه‌بعدی Hero — یک اسکرابر انتزاعی روی کف صنعتی.
 *
 * دو قید که شکل صحنه را تعیین کرده‌اند:
 *
 * ۱) هیچ دارایی بیرونی لود نمی‌شود. <Environment preset> و useGLTF فایل را
 *    از CDN می‌گیرند؛ روی سروری که دسترسی محدود دارد صحنه سیاه می‌ماند و
 *    هیچ خطایی هم در لاگ نیست. پس همه چیز با نور و هندسه پایه ساخته شده.
 *
 * ۲) تصویر باید معنا داشته باشد، نه فقط «سه‌بعدی باشد». دستگاه روی کف حرکت
 *    می‌کند و پشت سرش نواری تمیز و روشن باقی می‌گذارد — همان کاری که
 *    اسکرابر واقعاً انجام می‌دهد.
 */

const ACCENT = "#ff6a1a";

function Scrubber() {
  const group = useRef<Group>(null);
  const trail = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // رفت‌وبرگشت آرام روی محور X
    const x = Math.sin(t * 0.3) * 1.75;
    if (group.current) {
      group.current.position.x = x;
      // دستگاه عمداً دور نمی‌زند: چرخش ۱۸۰ درجه، دسته را پشت بدنه می‌برد و
      // نیم‌رخ ناخوانا می‌شود. به‌جایش یک yaw بسیار کوچک، حس هدایت دستی می‌دهد.
      group.current.rotation.y = Math.sin(t * 0.3) * 0.07;
      group.current.position.y = Math.sin(t * 1.6) * 0.01;
    }
    if (trail.current) {
      trail.current.position.x = x;
    }
  });

  return (
    <>
      {/* مسیر تمیزشده — دستگاه روی همین نوار حرکت می‌کند.
          بدون این، صحنه فقط «یک جعبه روی شبکه» خوانده می‌شود. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <planeGeometry args={[13, 1.45]} />
        <meshBasicMaterial color="#8aa3bd" transparent opacity={0.14} />
      </mesh>
      {/* لبه روشن نوار، تا مرز تمیز و کثیف دیده شود */}
      <mesh ref={trail} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2.6, 1.45]} />
        <meshBasicMaterial color="#cfe0f2" transparent opacity={0.1} />
      </mesh>

      <group ref={group} position={[0, 0, 0]} scale={1.3}>
        {/* مخزن */}
        <RoundedBox args={[1.5, 0.78, 1.05]} radius={0.12} smoothness={4} position={[0, 0.55, 0]}>
          <meshStandardMaterial color="#e8eaec" metalness={0.25} roughness={0.42} />
        </RoundedBox>

        {/* پنل رنگی بالای مخزن */}
        <RoundedBox args={[0.82, 0.14, 0.78]} radius={0.05} smoothness={4} position={[-0.18, 1.0, 0]}>
          <meshStandardMaterial color={ACCENT} metalness={0.1} roughness={0.35} />
        </RoundedBox>

        {/* دسته — بلند و با دستگیره عرضی.
            نسخه کوتاه‌تر در نیم‌رخ مثل یک زائده از بدنه خوانده می‌شد. */}
        <mesh position={[1.12, 1.3, 0]} rotation={[0, 0, -0.72]}>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 16]} />
          <meshStandardMaterial color="#b9bec4" metalness={0.65} roughness={0.3} />
        </mesh>
        <mesh position={[1.6, 1.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.72, 16]} />
          <meshStandardMaterial color="#2f343b" metalness={0.4} roughness={0.55} />
        </mesh>
        {/* پنل کنترل روی دسته */}
        <mesh position={[1.42, 1.62, 0]} rotation={[0, 0, -0.72]}>
          <boxGeometry args={[0.26, 0.08, 0.3]} />
          <meshStandardMaterial color="#3a4149" metalness={0.3} roughness={0.5} />
        </mesh>

        {/* برس دیسکی — جلوتر از بدنه تا در نیم‌رخ دیده شود */}
        <mesh position={[-0.78, 0.1, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.16, 32]} />
          <meshStandardMaterial color="#d8dde1" metalness={0.15} roughness={0.65} />
        </mesh>
        <mesh position={[-0.78, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 20]} />
          <meshStandardMaterial color={ACCENT} metalness={0.1} roughness={0.4} />
        </mesh>

        {/* تیغه مکش پشت دستگاه */}
        <mesh position={[0.78, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.1, 1.5, 0.12]} />
          <meshStandardMaterial color="#3a4149" metalness={0.3} roughness={0.6} />
        </mesh>

        {/* چرخ‌ها */}
        {[-0.38, 0.38].map((z) => (
          <mesh key={z} position={[0.56, 0.18, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 20]} />
            <meshStandardMaterial color="#2a2f36" metalness={0.3} roughness={0.7} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function Rig() {
  useFrame((state) => {
    // حرکت بسیار کند دوربین، فقط به‌اندازه‌ای که صحنه زنده به‌نظر برسد
    const t = state.clock.elapsedTime * 0.12;
    state.camera.position.x = Math.sin(t) * 0.7 + 4.2;
    state.camera.position.y = 2.6 + Math.sin(t * 0.7) * 0.12;
    state.camera.lookAt(0, 0.55, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      // سقف dpr: روی نمایشگر رتینا، رندر ۳x بدون سود بصری محسوس، فقط باتری می‌برد.
      dpr={[1, 1.6]}
      camera={{ position: [3.3, 1.75, 3.6], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 4]} intensity={1.25} />
      <directionalLight position={[-6, 3, -3]} intensity={0.35} color="#8fb6dd" />
      <pointLight position={[-2.2, 1.4, 2.2]} intensity={16} color={ACCENT} distance={8} />
      {/* نور لبه آبی از پشت، تا بدنه روشن از پس‌زمینه تیره جدا شود */}
      <pointLight position={[2.6, 1.8, -2.4]} intensity={14} color="#7fb0e6" distance={9} />

      <Scrubber />

      <Grid
        args={[26, 26]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#39414c"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#4e5a69"
        fadeDistance={22}
        fadeStrength={1.4}
        infiniteGrid
        position={[0, 0, 0]}
      />

      <ContactShadows position={[0, 0.012, 0]} opacity={0.5} scale={10} blur={2.2} far={3.5} />

      <Rig />
    </Canvas>
  );
}
