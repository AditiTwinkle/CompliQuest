import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface ConfettiRef {
    fire: (options?: ConfettiOptions) => void;
}

interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x: number; y: number };
    colors?: string[];
    shapes?: ('square' | 'circle')[];
    scalar?: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
    shape: 'square' | 'circle';
    size: number;
    life: number;
    decay: number;
    gravity: number;
    drift: number;
}

export const Confetti = forwardRef<ConfettiRef>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>();

    useImperativeHandle(ref, () => ({
        fire: (options?: ConfettiOptions) => {
            createConfetti(options);
        },
    }));

    const createConfetti = (options?: ConfettiOptions) => {
        const {
            particleCount = 50,
            angle = 90,
            spread = 45,
            startVelocity = 45,
            decay = 0.9,
            gravity = 1,
            drift = 0,
            origin = { x: 0.5, y: 0.5 },
            colors = ['#58cc02', '#1cb0f6', '#ff4b9a', '#ffc800', '#ffffff'],
            shapes = ['square', 'circle'],
            scalar = 1,
        } = options || {};

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const originX = rect.width * origin.x;
        const originY = rect.height * origin.y;

        for (let i = 0; i < particleCount; i++) {
            const angleRad = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
            const velocity = startVelocity * (0.5 + Math.random() * 0.5);

            particlesRef.current.push({
                x: originX,
                y: originY,
                vx: Math.cos(angleRad) * velocity,
                vy: -Math.sin(angleRad) * velocity,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                size: (5 + Math.random() * 5) * scalar,
                life: 1,
                decay,
                gravity,
                drift,
            });
        }

        if (!animationFrameRef.current) {
            animate();
        }
    };

    const animate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current = particlesRef.current.filter((particle) => {
            particle.x += particle.vx + particle.drift;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.vx *= particle.decay;
            particle.vy *= particle.decay;
            particle.rotation += particle.rotationSpeed;
            particle.life -= 0.01;

            if (particle.life <= 0 || particle.y > canvas.height) {
                return false;
            }

            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate((particle.rotation * Math.PI) / 180);
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;

            if (particle.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            }

            ctx.restore();
            return true;
        });

        if (particlesRef.current.length > 0) {
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            animationFrameRef.current = undefined;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        updateSize();
        window.addEventListener('resize', updateSize);

        return () => {
            window.removeEventListener('resize', updateSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
});

Confetti.displayName = 'Confetti';
