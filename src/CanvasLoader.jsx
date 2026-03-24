import { Html, useProgress } from "@react-three/drei";

function CanvasLoader() {
    const { progress } = useProgress();

    return (
        <Html center>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '200px'
            }}>
                {/* Branding / Text */}
                <div style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 300,
                    fontFamily: 'sans-serif',
                    letterSpacing: '5px',
                    textTransform: 'uppercase',
                    marginBottom: '15px',
                    opacity: 0.8
                }}>
                    Loading {progress.toFixed(0)}%
                </div>

                {/* Elegant Progress Bar Container */}
                <div style={{
                    width: '100%',
                    height: '2px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    {/* The Moving Progress Fill */}
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'white',
                        transition: 'width 0.3s ease-out',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                    }} />
                </div>
            </div>
        </Html>
    )
}

export default CanvasLoader;