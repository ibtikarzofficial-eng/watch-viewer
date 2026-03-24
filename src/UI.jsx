import React from 'react'

export default function UI({ setActiveColor, activeColor }) {
    const colors = [
        { name: 'Racing Red', hex: '#FF2A2A' },
        { name: 'Electric Cyan', hex: '#00E5FF' },
        { name: 'Neon Volt', hex: '#D4FF00' },
        { name: 'Rose Gold', hex: '#E0A96D' },
        { name: 'Diver Orange', hex: '#FF6B00' }
    ];

    return (
        <>
            {/* Minimalist Top Branding */}
            <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 10 }}>
                <h1 style={{ color: '#fff', fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0, fontWeight: '300', fontFamily: 'sans-serif' }}>
                    Edifice <span style={{ fontWeight: '800', opacity: 0.5 }}>Configurator</span>
                </h1>
            </div>

            {/* Bottom Floating Control Bar */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                background: 'rgba(10, 10, 10, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '12px 25px',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                width: 'fit-content',
                maxWidth: '90vw'
            }}>
                {colors.map((color) => (
                    <button
                        key={color.name}
                        onClick={() => setActiveColor(color.hex)}
                        title={color.name}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: color.hex,
                            border: activeColor === color.hex ? '3px solid white' : '2px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            padding: 0,
                            transform: activeColor === color.hex ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: activeColor === color.hex ? `0 0 15px ${color.hex}` : 'none'
                        }}
                    />
                ))}
            </div>
        </>
    )
}