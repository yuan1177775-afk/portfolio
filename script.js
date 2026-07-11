const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.site-header nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.classList.toggle('open');
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuButton.classList.remove('open');
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.querySelectorAll('[data-resume-placeholder]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    window.alert('简历 PDF 将在上传后开放下载。');
  });
});

document.querySelectorAll('.project-card a[href="#"]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

const insightTabs = document.querySelectorAll('.insights-tab');
const insightPanels = document.querySelectorAll('.insights-list-panel');

insightTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    insightTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    insightPanels.forEach(panel => {
      const active = panel.dataset.panel === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  });
});

const canvas = document.querySelector('#watercolor-world');
const context = canvas.getContext('2d');
const sources = [
  { key: 'tree', url: 'assets/tree.png' },
  { key: 'village', url: 'assets/village.png' },
  { key: 'bridge', url: 'assets/bridge.png' }
];

const artwork = new Map();
let width = window.innerWidth;
let height = window.innerHeight;
let ratio = Math.min(window.devicePixelRatio || 1, 1.5);
let scrollTarget = window.scrollY;
let scrollCurrent = window.scrollY;
let previousScroll = scrollCurrent;
let pointerTarget = { x: .5, y: .5 };
let pointerCurrent = { x: .5, y: .5 };
let ready = false;
const brushCursor = document.createElement('div');
brushCursor.className = 'brush-cursor';
document.body.appendChild(brushCursor);

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const smoothstep = (start, end, value) => {
  const amount = clamp((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

const loadImage = url => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener('load', () => resolve(image));
  image.addEventListener('error', reject);
  image.src = url;
});

// 去掉每张原图自带的纸张底色，只保留真实的水彩颜料。
const makeTransparentArtwork = image => {
  const layer = document.createElement('canvas');
  layer.width = image.naturalWidth;
  layer.height = image.naturalHeight;
  const layerContext = layer.getContext('2d', { willReadFrequently: true });
  layerContext.drawImage(image, 0, 0);

  const pixels = layerContext.getImageData(0, 0, layer.width, layer.height);
  const data = pixels.data;
  const cornerPoints = [
    0,
    (layer.width - 1) * 4,
    (layer.width * (layer.height - 1)) * 4,
    (layer.width * layer.height - 1) * 4
  ];
  const paper = cornerPoints.reduce((sum, index) => ({
    r: sum.r + data[index],
    g: sum.g + data[index + 1],
    b: sum.b + data[index + 2]
  }), { r: 0, g: 0, b: 0 });
  paper.r /= cornerPoints.length;
  paper.g /= cornerPoints.length;
  paper.b /= cornerPoints.length;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index] - paper.r;
    const green = data[index + 1] - paper.g;
    const blue = data[index + 2] - paper.b;
    const distance = Math.sqrt(red * red + green * green + blue * blue);
    const pigment = Math.pow(clamp((distance - 4) / 34), .72);
    data[index + 3] = Math.round(data[index + 3] * pigment);
  }

  layerContext.putImageData(pixels, 0, 0);
  return layer;
};

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
  const {
    x,
    y,
    drawWidth,
    opacity = 1,
    rotation = 0,
    pivotX = .5,
    pivotY = .5
  } = options;
  const drawHeight = drawWidth * image.height / image.width;
  const pivot = {
    x: x + drawWidth * pivotX,
    y: y + drawHeight * pivotY
  };

  context.save();
  context.translate(pivot.x, pivot.y);
  context.rotate(rotation);
  context.translate(-pivot.x, -pivot.y);
  context.globalAlpha = opacity;
  context.globalCompositeOperation = 'multiply';
  context.drawImage(image, x, y, drawWidth, drawHeight);
  context.restore();
};

const renderWorld = time => {
  scrollCurrent += (scrollTarget - scrollCurrent) * .075;
  pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * .045;
  pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * .045;

  const scrollVelocity = scrollCurrent - previousScroll;
  previousScroll = scrollCurrent;
  const maxScroll = Math.max(document.documentElement.scrollHeight - height, 1);
  const progress = clamp(scrollCurrent / maxScroll);
  const pointerX = (pointerCurrent.x - .5) * 25;
  const pointerY = (pointerCurrent.y - .5) * 14;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  if (ready) {
    const mobile = width < 700;
    const treeWidth = mobile ? width * 1.08 : width * .62;
    const villageWidth = mobile ? width * 1.14 : width * .76;
    const bridgeWidth = mobile ? width * 1.2 : width * .76;
    const treeOpacity = 1 - smoothstep(.18, .43, progress);
    const villageOpacity =
      smoothstep(.1, .28, progress) *
      (1 - smoothstep(.56, .78, progress));
    const bridgeOpacity = smoothstep(.48, .7, progress);
    const villageJourney = clamp((progress - .1) / .64);
    const bridgeJourney = clamp((progress - .48) / .52);
    const treeSway = (
      (pointerCurrent.x - .5) * .012 +
      clamp(scrollVelocity * .00038, -.013, .013) +
      Math.sin(time * .0007) * .0018
    );

    drawArtwork(artwork.get('tree'), {
      x: width * .36 + pointerX * .72,
      y: height * .12 - progress * height * .72 + pointerY * .35,
      drawWidth: treeWidth,
      opacity: treeOpacity * .94,
      rotation: treeSway,
      pivotX: .63,
      pivotY: .83
    });

    drawArtwork(artwork.get('village'), {
      x: -width * .16 + pointerX * .28,
      y: height * .16 - villageJourney * height * .18 - pointerY * .12,
      drawWidth: villageWidth,
      opacity: villageOpacity * .88,
      rotation: (pointerCurrent.x - .5) * -.0015,
      pivotX: .5,
      pivotY: .72
    });

    drawArtwork(artwork.get('bridge'), {
      x: width * .28 + pointerX * .12,
      y: height * .62 - bridgeJourney * height * .45 + pointerY * .08,
      drawWidth: bridgeWidth,
      opacity: bridgeOpacity * .82,
      rotation: 0
    });
  }

  brushCursor.style.transform =
    `translate3d(${pointerCurrent.x * width}px, ${pointerCurrent.y * height}px, 0) rotate(-18deg)`;
  requestAnimationFrame(renderWorld);
};

Promise.all(sources.map(async source => {
  const image = await loadImage(source.url);
  artwork.set(source.key, makeTransparentArtwork(image));
})).then(() => {
  ready = true;
});

window.addEventListener('scroll', () => {
  scrollTarget = window.scrollY;
}, { passive: true });

window.addEventListener('pointermove', event => {
  pointerTarget = {
    x: clamp(event.clientX / width),
    y: clamp(event.clientY / height)
  };
  brushCursor.classList.add('visible');
}, { passive: true });

document.documentElement.addEventListener('mouseleave', () => {
  pointerTarget = { x: .5, y: .5 };
  brushCursor.classList.remove('visible');
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(renderWorld);
