import React from 'react'

export default function UI({ setActiveColor, activeColor }) {
    // Array of your selected high-contrast colors
    const colors = [
        { name: 'Racing Red', hex: '#FF2A2A' },
        { name: 'Electric Cyan', hex: '#00E5FF' },
        { name: 'Neon Volt', hex: '#D4FF00' },
        { name: 'Rose Gold', hex: '#E0A96D' },
        { name: 'Diver Orange', hex: '#FF6B00' }
    ];

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '40px',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            background: 'rgba(25, 25, 25, 0.4)', // Dark glass effect
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
        }}>
            <div>
                <h2 style={{ color: '#ffffff', fontFamily: 'sans-serif', margin: '0', fontSize: '1.4rem', fontWeight: '400', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    Edifice
                </h2>
                <p style={{ color: '#888888', fontFamily: 'sans-serif', margin: '5px 0 0 0', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Select Edition
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                {colors.map((color) => (
                    <div
                        key={color.name}
                        style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', group: 'hover' }}
                        onClick={() => setActiveColor(color.hex)}
                    >
                        {/* Circular Color Swatch */}
                        <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: color.hex,
                            boxShadow: activeColor === color.hex ? `0 0 12px ${color.hex}` : 'none',
                            border: activeColor === color.hex ? '2px solid #ffffff' : '2px solid transparent',
                            transition: 'all 0.3s ease'
                        }} />
                        {/* Label */}
                        <span style={{
                            color: activeColor === color.hex ? '#ffffff' : '#777777',
                            fontFamily: 'sans-serif',
                            fontSize: '0.85rem',
                            fontWeight: activeColor === color.hex ? '600' : '400',
                            transition: 'color 0.3s ease'
                        }}>
                            {color.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}