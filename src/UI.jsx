import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function UI({ setActiveColor, activeColor, viewCamera }) {
    const uiRef = useRef(null)
    const colors = [
        { name: 'Racing Red', hex: '#FF2A2A' },
        { name: 'Electric Cyan', hex: '#00E5FF' },
        { name: 'Neon Volt', hex: '#D4FF00' },
        { name: 'Racing Green', hex: '#13d813' },
        { name: 'Diver Orange', hex: '#FF6B00' }
    ];

    const views = ['Face', 'Side', 'Buckle'];

    useEffect(() => {
        // Subtle GSAP entrance animation for UI components
        if (uiRef.current && uiRef.current.children.length > 0) {
            const elements = uiRef.current.children;
            gsap.fromTo(elements,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.5 }
            );
        }
    }, []);

    const handleColorSelect = (hex) => {
        setActiveColor(hex);
        window.dispatchEvent(new CustomEvent('watchColorChanged', {
            detail: { color: hex }
        }));
    };

    return (
        <div ref={uiRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            <div className="view-switcher">
                {views.map((v) => (
                    <button
                        key={v}
                        onClick={() => viewCamera(v.toLowerCase())}
                        className="view-btn"
                    >
                        {v}
                    </button>
                ))}
            </div>

            <div className="color-picker">
                {colors.map((color) => (
                    <button
                        key={color.name}
                        onClick={() => handleColorSelect(color.hex)}
                        className={`color-btn ${activeColor === color.hex ? 'active' : ''}`}
                        style={{
                            backgroundColor: color.hex,
                            transform: activeColor === color.hex ? 'scale(1.2)' : 'scale(1)',
                            boxShadow: activeColor === color.hex ? `0 0 20px ${color.hex}` : 'none'
                        }}
                        title={color.name}
                        aria-label={color.name}
                    />
                ))}
            </div>
        </div>
    )
}