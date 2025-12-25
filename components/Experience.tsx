
import React, { useMemo, useRef, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState, HandData, OrnamentData } from '../types';
import { SETTINGS, COLORS } from '../constants';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import Polaroids from './Polaroids';
import TreeTopStar from './TreeTopStar';
import Snowflakes from './Snowflakes';
import ChristmasLetter from './ChristmasLetter';

interface ExperienceProps {
  treeState: TreeState;
  handData: HandData;
}

// Helper function for linear interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Experience: React.FC<ExperienceProps> = ({ treeState, handData }) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const lerpProgressRef = useRef(0);

  // Initialize ornament data with target and chaos positions
  const ornaments = useMemo(() => {
    const items: OrnamentData[] = [];
    const types: ('gift' | 'ball' | 'light')[] = ['gift', 'ball', 'light'];
    
    for (let i = 0; i < SETTINGS.ORNAMENT_COUNT; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const h = Math.random() * SETTINGS.TREE_HEIGHT;
      const r = (1 - h / SETTINGS.TREE_HEIGHT) * SETTINGS.TREE_RADIUS * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      
      const target: [number, number, number] = [Math.cos(theta) * r, h, Math.sin(theta) * r];
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const cR = SETTINGS.CHAOS_RADIUS * (0.5 + Math.random() * 0.5);
      
      const chaos: [number, number, number] = [
        cR * Math.sin(cPhi) * Math.cos(cTheta),
        cR * Math.sin(cPhi) * Math.sin(cTheta) + 5,
        cR * Math.cos(cPhi)
      ];

      items.push({
        type,
        chaos,
        target,
        color: i % 2 === 0 ? COLORS.GOLD_LUXURY : COLORS.RED_LUXURY,
        weight: type === 'gift' ? 1.0 : type === 'ball' ? 0.6 : 0.2
      });
    }
    return items;
  }, []);

  // Initialize foliage point cloud positions
  const foliagePositions = useMemo(() => {
    const chaos = new Float32Array(SETTINGS.FOLIAGE_COUNT * 3);
    const target = new Float32Array(SETTINGS.FOLIAGE_COUNT * 3);

    for (let i = 0; i < SETTINGS.FOLIAGE_COUNT; i++) {
      const h = Math.pow(Math.random(), 1.2) * SETTINGS.TREE_HEIGHT;
      const r = (1 - h / SETTINGS.TREE_HEIGHT) * SETTINGS.TREE_RADIUS;
      const theta = Math.random() * Math.PI * 2;
      
      target[i * 3] = Math.cos(theta) * r;
      target[i * 3 + 1] = h;
      target[i * 3 + 2] = Math.sin(theta) * r;

      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const cR = SETTINGS.CHAOS_RADIUS * (0.3 + Math.random() * 0.7);
      
      chaos[i * 3] = cR * Math.sin(cPhi) * Math.cos(cTheta);
      chaos[i * 3 + 1] = cR * Math.sin(cPhi) * Math.sin(cTheta) + 5;
      chaos[i * 3 + 2] = cR * Math.cos(cPhi);
    }
    return { chaos, target };
  }, []);

  // Smoothly update transition progress and group position every frame
  useFrame((state) => {
    const target = treeState === TreeState.CHAOS ? 1 : 0;
    lerpProgressRef.current = THREE.MathUtils.lerp(lerpProgressRef.current, target, 0.05);

    if (groupRef.current) {
      // Gentle floating animation and vertical centering adjustment
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 - 6;
    }
  });

  return (
    <group ref={groupRef}>
      <Foliage data={foliagePositions} progressRef={lerpProgressRef} />
      <Ornaments items={ornaments} progressRef={lerpProgressRef} />
      <Polaroids count={SETTINGS.POLAROID_COUNT} progressRef={lerpProgressRef} />
      <TreeTopStar progressRef={lerpProgressRef} />
      <Snowflakes progressRef={lerpProgressRef} />
      <ChristmasLetter progressRef={lerpProgressRef} />
    </group>
  );
};

export default Experience;
