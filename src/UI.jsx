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
            // Desktop: Middle-Left | Mobile: Bottom-Center
            top: window.innerWidth < 768 ? 'auto' : '50%',
            bottom: window.innerWidth < 768 ? '20px' : 'auto',
            left: window.innerWidth < 768 ? '50%' : '40px',
            transform: window.innerWidth < 768 ? 'translateX(-50%)' : 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'row' : 'column', // Horizontal on mobile
            overflowX: 'auto', // Allow swiping through colors on small screens
            maxWidth: '90vw',
            // Rest of your existing glassmorphism styles...
            background: 'rgba(25, 25, 25, 0.6)',
            backdropFilter: 'blur(12px)',
            padding: '20px',
            borderRadius: '16px',
            gap: '15px'
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