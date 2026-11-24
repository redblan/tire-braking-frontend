import "./ModelViewer.css";
import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DEFAULT_MODEL } from "../config";

// модель масштабируется до размера 2, при повороте она не выходит за сферу такого радиуса
const MODEL_RADIUS = 1.25;

interface Props {
  modelUrl: string; // ссылка на 3D модель (.glb)
  angleX: number; // углы поворота модели в градусах
  angleY: number;
}

// Просмотр 3D модели услуги через Three.js. Модель поворачивается на углы angleX и angleY;
// когда углы меняются (их обновил асинхронный сервис), модель плавно доворачивается в новое положение
export const ModelViewer: FC<Props> = ({ modelUrl, angleX, angleY }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pivotRef = useRef<THREE.Group | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const snapRef = useRef(true); // новая модель сразу ставится в своё положение, без доворота

  // сцена, камера, свет и цикл отрисовки — один раз на весь срок жизни компонента
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffa366, 1.5);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const pivot = new THREE.Group();
    scene.add(pivot);
    pivotRef.current = pivot;

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      // камера отодвигается так, чтобы модель (радиус MODEL_RADIUS) помещалась и по высоте, и по ширине
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const fit = MODEL_RADIUS / Math.tan(halfFov);
      camera.position.z = Math.max(fit, fit / camera.aspect);
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    renderer.setAnimationLoop(() => {
      const target = targetRef.current;
      if (snapRef.current) {
        pivot.rotation.x = target.x;
        pivot.rotation.y = target.y;
        snapRef.current = false;
      } else {
        pivot.rotation.x += (target.x - pivot.rotation.x) * 0.06;
        pivot.rotation.y += (target.y - pivot.rotation.y) * 0.06;
      }
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      pivotRef.current = null;
    };
  }, []);

  // загрузка модели; если файл недоступен или это не .glb — модель по умолчанию из проекта
  useEffect(() => {
    const pivot = pivotRef.current;
    if (!pivot) return;

    let cancelled = false;
    const loader = new GLTFLoader();

    const show = (model: THREE.Object3D) => {
      if (cancelled) return;
      // модель центрируется и масштабируется так, чтобы целиком помещаться в кадр
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 2 / Math.max(size.x, size.y, size.z, 0.001);
      model.position.sub(center).multiplyScalar(scale);
      model.scale.setScalar(scale);

      pivot.clear();
      pivot.add(model);
      snapRef.current = true;
    };

    const loadDefault = () => {
      if (cancelled || modelUrl === DEFAULT_MODEL) return;
      loader.load(DEFAULT_MODEL, (gltf) => show(gltf.scene));
    };

    loader.load(modelUrl, (gltf) => show(gltf.scene), undefined, loadDefault);

    return () => {
      cancelled = true;
    };
  }, [modelUrl]);

  // новые углы (градусы) — цель поворота в радианах
  useEffect(() => {
    targetRef.current = {
      x: THREE.MathUtils.degToRad(angleX),
      y: THREE.MathUtils.degToRad(angleY),
    };
  }, [angleX, angleY]);

  return <div className="modelViewer" ref={containerRef} />;
};
