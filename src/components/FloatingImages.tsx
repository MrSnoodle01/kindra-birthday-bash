import { useEffect, useRef } from "react";

const images = [
    "/sleepy/2.png",
    "/sleepy/3.png",
    "/sleepy/4.png",
    "/sleepy/5.png",
    "/sleepy/6.png",
    "/sleepy/7.png",
    "/sleepy/8.png",
    "/sleepy/9.png",
    "/sleepy/10.png",
    "/sleepy/11.png",
    "/sleepy/12.png",
    "/sleepy/13.png",
    "/sleepy/14.png",
    "/sleepy/15.png",
    "/sleepy/16.png",
]

interface ImageData {
    x: number;
    y: number;
    dx: number;
    dy: number;
}


export default function FloatingImages() {
    const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

    function createPositions() {
        const imageSize = Math.min(Math.max(window.innerWidth * 0.08, 50), 140);
        const speed = window.innerWidth / 1200;

        return images.map(() => ({
            x: Math.random() * (window.innerWidth - imageSize),
            y: Math.random() * (window.innerHeight - imageSize),
            dx: (Math.random() - 0.5) * speed,
            dy: (Math.random() - 0.5) * speed,
        }));
    }

    const positions = useRef<ImageData[]>(createPositions());

    useEffect(() => {
        let animationFrame: number;

        function handleResize() {
            positions.current.forEach((pos, index) => {
                const img = imageRefs.current[index];

                if (!img) return;

                const width = img.offsetWidth;
                const height = img.offsetHeight;

                // Keep images inside the new window size
                if (pos.x + width > window.innerWidth) {
                    pos.x = window.innerWidth - width;
                }

                if (pos.y + height > window.innerHeight) {
                    pos.y = window.innerHeight - height;
                }

                if (pos.x < 0) {
                    pos.x = 0;
                }

                if (pos.y < 0) {
                    pos.y = 0;
                }
            });
        }

        function animate() {
            positions.current.forEach((pos, index) => {
                const img = imageRefs.current[index];

                if (!img) return;

                const width = img.offsetWidth;
                const height = img.offsetHeight;

                pos.x += pos.dx;
                pos.y += pos.dy;

                // Bounce off left/right edges
                if (pos.x <= 0 || pos.x + width >= window.innerWidth) {
                    pos.dx *= -1;
                }

                // Bounce off top/bottom edges
                if (pos.y <= 0 || pos.y + height >= window.innerHeight) {
                    pos.dy *= -1;
                }

                img.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            });

            animationFrame = requestAnimationFrame(animate);
        }

        window.addEventListener("resize", handleResize);

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <div className="floatingContainer">
            {images.map((src, index) => (
                <img
                    key={src}
                    ref={(el) => {
                        imageRefs.current[index] = el;
                    }}
                    className="floatingImage"
                    src={src}
                />
            ))}
        </div>
    );
}