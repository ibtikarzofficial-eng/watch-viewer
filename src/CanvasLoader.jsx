import { Html, useProgress } from "@react-three/drei";

function CanvasLoader() {

    const { progress } = useProgress();

    return (
        <Html center>
            <div style={{
                color: 'Black',
                fontSize: '24px',
                fontWeight: 800,
                fontFamily: 'sans-serif'
            }}>Loading... {progress.toFixed(0)} %</div>
        </Html>
    )
}

export default CanvasLoader;
