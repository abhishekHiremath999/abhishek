// import { useGLTF } from "@react-three/drei";

export default function HelmetModel(props) {
  // const { scene } = useGLTF("/");

  return (
    <primitive
      // object={scene}
      scale={2.3}
      position={[0, -1.15, 0]}
      {...props}
    />
  );
}