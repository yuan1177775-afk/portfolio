"use client";

import { useEffect, useRef } from "react";

const SOURCES = [
  ["tree", "/assets/tree.png"],
  ["village", "/assets/village.png"],
  ["bridge", "/assets/bridge.png"],
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const smoothstep = (start, end, value) => {
  const amount = clamp((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", reject, { once: true });
    image.src = url;
  });
}

function makeTransparentArtwork(image) {
  const layer = document.createElement("canvas");
  layer.width = image.naturalWidth;
  layer.height = image.naturalHeight;
  const context = layer.getContext("2d", { willReadFrequently: true });
  if (!context) return image;

  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, layer.width, layer.height);
  const data = pixels.data;
  const corners = [
    0,
    (layer.width - 1) * 4,
    layer.width * (layer.height - 1) * 4,
    (layer.width * layer.height - 1) * 4,
  ];
  const paper = corners.reduce(
    (sum, index) => ({
      r: sum.r + data[index],
      g: sum.g + data[index + 1],
      b: sum.b + data[index + 2],
    }),
    { r: 0, g: 0, b: 0 },
  );
  paper.r /= corners.length;
  paper.g /= corners.length;
  paper.b /= corners.length;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index] - paper.r;
    const green = data[index + 1] - paper.g;
    const blue = data[index + 2] - paper.b;
    const distance = Math.sqrt(red * red + green * green + blue * blue);
    const pigment = Math.pow(clamp((distance - 4) / 34), 0.72);
    data[index + 3] = Math.round(data[index + 3] * pigment);
  }

  context.putImageData(pixels, 0, 0);
  return layer;
}

export default function WatercolorWorld() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const artwork = new Map();
    let width = window.innerWidth;
    let height = window.innerHeight;
    let ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    let scrollTarget = window.scrollY;
    let scrollCurrent = window.scrollY;
    let previousScroll = scrollCurrent;
    let pointerTarget = { x: 0.5, y: 0.5 };
    let pointerCurrent = { x: 0.5, y: 0.5 };
    let ready = false;
    let frameId = 0;
    let disposed = false;

    const brushCursor = document.createElement("div");
    brushCursor.className = "brush-cursor";
    document.body.appendChild(brushCursor);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const drawArtwork = (image, options) => {
      const { x, y, drawWidth, opacity = 1, rotation = 0, pivotX = 0.5, pivotY = 0.5 } = options;
      const drawHeight = (drawWidth * image.height) / image.width;
      const pivot = { x: x + drawWidth * pivotX, y: y + drawHeight * pivotY };

      context.save();
      context.translate(pivot.x, pivot.y);
      context.rotate(rotation);
      context.translate(-pivot.x, -pivot.y);
      context.globalAlpha = opacity;
      context.globalCompositeOperation = "multiply";
      context.drawImage(image, x, y, drawWidth, drawHeight);
      context.restore();
    };

    const renderWorld = (time) => {
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.075;
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.045;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.045;

      const scrollVelocity = scrollCurrent - previousScroll;
      previousScroll = scrollCurrent;
      const maxScroll = Math.max(document.documentElement.scrollHeight - height, 1);
      const progress = clamp(scrollCurrent / maxScroll);
      const pointerX = (pointerCurrent.x - 0.5) * 25;
      const pointerY = (pointerCurrent.y - 0.5) * 14;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      if (ready) {
        const mobile = width < 700;
        const treeWidth = mobile ? width * 1.08 : width * 0.62;
        const villageWidth = mobile ? width * 1.14 : width * 0.76;
        const bridgeWidth = mobile ? width * 1.2 : width * 0.76;
        const treeOpacity = 1 - smoothstep(0.18, 0.43, progress);
        const villageOpacity = smoothstep(0.1, 0.28, progress) * (1 - smoothstep(0.56, 0.78, progress));
        const bridgeOpacity = smoothstep(0.48, 0.7, progress);
        const villageJourney = clamp((progress - 0.1) / 0.64);
        const bridgeJourney = clamp((progress - 0.48) / 0.52);
        const treeSway =
          (pointerCurrent.x - 0.5) * 0.012 +
          clamp(scrollVelocity * 0.00038, -0.013, 0.013) +
          Math.sin(time * 0.0007) * 0.0018;

        drawArtwork(artwork.get("tree"), {
          x: width * (mobile ? 0.28 : 0.36) + pointerX * 0.72,
          y: height * (mobile ? 0.46 : 0.12) - progress * height * 0.72 + pointerY * 0.35,
          drawWidth: treeWidth,
          opacity: treeOpacity * 0.94,
          rotation: treeSway,
          pivotX: 0.63,
          pivotY: 0.83,
        });
        drawArtwork(artwork.get("village"), {
          x: -width * 0.16 + pointerX * 0.28,
          y: height * (mobile ? 0.34 : 0.16) - villageJourney * height * (mobile ? 0.12 : 0.18) - pointerY * 0.12,
          drawWidth: villageWidth,
          opacity: villageOpacity * 0.88,
          rotation: (pointerCurrent.x - 0.5) * -0.0015,
          pivotX: 0.5,
          pivotY: 0.72,
        });
        drawArtwork(artwork.get("bridge"), {
          x: width * (mobile ? -0.08 : 0.28) + pointerX * 0.12,
          y: height * (mobile ? 0.52 : 0.62) - bridgeJourney * height * (mobile ? 0.3 : 0.45) + pointerY * 0.08,
          drawWidth: bridgeWidth,
          opacity: bridgeOpacity * 0.82,
        });
      }

      frameId = window.requestAnimationFrame(renderWorld);
    };

    const onScroll = () => {
      scrollTarget = window.scrollY;
    };
    const onPointerMove = (event) => {
      pointerTarget = { x: clamp(event.clientX / width), y: clamp(event.clientY / height) };
      const isMouse = event.pointerType === "mouse";
      document.documentElement.classList.toggle("leaf-cursor-enabled", isMouse);
      if (!isMouse) {
        brushCursor.classList.remove("visible", "interactive");
        return;
      }
      brushCursor.style.setProperty("--cursor-x", `${event.clientX}px`);
      brushCursor.style.setProperty("--cursor-y", `${event.clientY}px`);
      brushCursor.classList.toggle(
        "interactive",
        event.target instanceof Element && Boolean(event.target.closest('a, button, [role="button"], input, textarea, select')),
      );
      brushCursor.classList.add("visible");
    };
    const onMouseLeave = () => {
      pointerTarget = { x: 0.5, y: 0.5 };
      brushCursor.classList.remove("visible");
    };

    Promise.all(
      SOURCES.map(async ([key, url]) => {
        const image = await loadImage(url);
        artwork.set(key, makeTransparentArtwork(image));
      }),
    ).then(() => {
      if (!disposed) ready = true;
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    frameId = window.requestAnimationFrame(renderWorld);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resizeCanvas);
      document.documentElement.classList.remove("leaf-cursor-enabled");
      brushCursor.remove();
    };
  }, []);

  return <canvas ref={canvasRef} className="watercolor-world" aria-hidden="true" />;
}
