// ====================================================
// 在頁面載入時強制置頂
// ====================================================

window.scrollTo(0, 0);

window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
});

// ====================================================
// 行動導覽列開關
// ====================================================

// 1. 取得主要元素
const navElement = document.querySelector('#navbar'); 
const navBtn = document.querySelector('.nav-button');

// 2. 點擊按鈕：切換（開啟/關閉）選單
navBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // 關鍵：防止點擊按鈕的事件傳遞給 navbar 本身
  navElement.classList.toggle('nav_open');
});

// 3. 點擊整個 navbar 區域：直接關閉
// 這裡包含了 .logo 和 整個 <ul> 區域
navElement.addEventListener('click', (e) => {
  // 檢查點擊的目標如果不是按鈕（或按鈕內的圖示），就執行關閉
  if (!navBtn.contains(e.target)) {
    navElement.classList.remove('nav_open');
  }
});

// ====================================================
// Button hover 字母跳動
// ====================================================

document.querySelectorAll('.arflex-btn').forEach(btn => {
  const text = btn.getAttribute('data-text') || btn.innerText.trim();
  const hasIcon = btn.getAttribute('data-icon') === 'true';

  const createTextLayer = (content) => {
    return content.split('').map((char, i) => {
      const displayChar = char === ' ' ? '\u00A0' : char;
      return `<span class="char" style="--i: ${i}">${displayChar}</span>`;
    }).join('');
  };

  btn.innerHTML = `
    <span class="btn-content-wrapper">
      <span class="text-container">
        <span class="text-layer original">${createTextLayer(text)}</span>
        <span class="text-layer hover">${createTextLayer(text)}</span>
      </span>
      ${hasIcon ? `
        <span class="icon-container">
          <span class="icon original">→</span>
          <span class="icon hover">→</span>
        </span>
      ` : ''}
    </span>
  `;
});

// ====================================================
// 滑動視窗 Navigation 上滑隱藏
// ====================================================

let lastScrollTop = 0;
const delta = 5; // 捲動超過 5px 才觸發，防手機誤觸
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // 如果捲動距離小於 delta，則不執行
  if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

  if (scrollTop > lastScrollTop && scrollTop > 60) {
    // 往下捲且超過 navbar 高度時才隱藏
    navbar.classList.add('nav-hidden');
  } else {
    // 往上捲
    navbar.classList.remove('nav-hidden');
  }

  lastScrollTop = scrollTop;
});

// ====================================================
// Hero 動態背景
// ====================================================

const heroCanvas = document.getElementById('dotCanvas');
if (heroCanvas) {
    const heroCtx = heroCanvas.getContext('2d');
    let hW, hH;
    const spacing = 100;
    const dotRadius = 1.5;
    const speed = 0.2;
    let offset = 0;

    function initHero() {
        hW = heroCanvas.width = window.innerWidth;
        hH = heroCanvas.height = window.innerHeight;
    }

    function drawHero() {
        heroCtx.clearRect(0, 0, hW, hH);
        heroCtx.fillStyle = "#D3D3D3";
        offset += speed;

        for (let y = spacing; y < hH; y += spacing) {
            const rowIndex = Math.floor(y / spacing);
            const direction = (rowIndex % 2 === 0) ? 1 : -1;
            const rowOffset = (offset * direction) % spacing;

            for (let x = -spacing; x < hW + spacing; x += spacing) {
                heroCtx.beginPath();
                heroCtx.arc(x + rowOffset, y, dotRadius, 0, Math.PI * 2);
                heroCtx.fill();
            }
        }
        requestAnimationFrame(drawHero);
    }

    window.addEventListener('resize', initHero);
    initHero();
    drawHero();
}

// ===================================================
// UX 旋轉粒子背景
// ===================================================

const PARTICLE_CONFIG = {
    particleRGB: { r: 255, g: 255, b: 255 },
    count: 8000,
    attractionStrength: 0.05,
    influenceRadius: 0.3
};

let pScene, pCamera, pRenderer, pPoints;
let pPositions, pOriginalPositions;
let pMouse = new THREE.Vector2(-999, -999);

function initParticles() {
    const container = document.getElementById('particle-section');
    if (!container) return;

    pScene = new THREE.Scene();
    pCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    pCamera.position.z = 30;

    const geometry = new THREE.BufferGeometry();
    pPositions = new Float32Array(PARTICLE_CONFIG.count * 3);
    pOriginalPositions = new Float32Array(PARTICLE_CONFIG.count * 3);

    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        const i3 = i * 3;
        const isMain = Math.random() > 0.3;
        const radius = isMain ? (Math.random() * 15 + 5) : (Math.random() * 40);
        const angle = Math.random() * Math.PI * 2;
        
        pPositions[i3] = Math.cos(angle) * radius;
        pPositions[i3 + 1] = (Math.random() - 0.5) * 20;
        pPositions[i3 + 2] = Math.sin(angle) * radius;

        pOriginalPositions[i3] = pPositions[i3];
        pOriginalPositions[i3 + 1] = pPositions[i3 + 1];
        pOriginalPositions[i3 + 2] = pPositions[i3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const material = new THREE.PointsMaterial({
        color: new THREE.Color(`rgb(${PARTICLE_CONFIG.particleRGB.r},${PARTICLE_CONFIG.particleRGB.g},${PARTICLE_CONFIG.particleRGB.b})`),
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        map: createCircleTexture(),
        depthWrite: false,
        sizeAttenuation: true
    });

    pPoints = new THREE.Points(geometry, material);
    pScene.add(pPoints);

    pRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    pRenderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(pRenderer.domElement);

    window.addEventListener('mousemove', (e) => {
        pMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        pMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
        pCamera.aspect = window.innerWidth / window.innerHeight;
        pCamera.updateProjectionMatrix();
        pRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    const obs = new IntersectionObserver(e => {
        if(e[0].isIntersecting) container.classList.add('is-visible');
    });
    obs.observe(container);
}

function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    if (!pPoints) return;

    const time = Date.now() * 0.001;
    const posArray = pPoints.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        const i3 = i * 3;
        posArray[i3] += Math.sin(time * 0.5 + posArray[i3+1] * 0.1) * 0.005;
        posArray[i3+1] += Math.cos(time * 0.4 + posArray[i3] * 0.1) * 0.005;

        const tempVec = new THREE.Vector3(posArray[i3], posArray[i3+1], posArray[i3+2]);
        const screenVec = tempVec.clone().project(pCamera);

        const dx = pMouse.x - screenVec.x;
        const dy = pMouse.y - screenVec.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < PARTICLE_CONFIG.influenceRadius) {
            posArray[i3] += dx * PARTICLE_CONFIG.attractionStrength;
            posArray[i3 + 1] += dy * PARTICLE_CONFIG.attractionStrength;
        } else {
            posArray[i3] += (pOriginalPositions[i3] - posArray[i3]) * 0.02;
            posArray[i3+1] += (pOriginalPositions[i3+1] - posArray[i3+1]) * 0.02;
        }
    }

    pPoints.geometry.attributes.position.needsUpdate = true;
    pPoints.rotation.y += 0.0005;
    pRenderer.render(pScene, pCamera);
}

// 啟動粒子背景
initParticles();
animateParticles();

// ===================================================
// 文字描邊進場動畫
// ===================================================

function initPremiumStrokeText() {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.animation-wrapper').forEach((wrapper) => {
        const svg = wrapper.querySelector('svg');
        const linesBase = wrapper.querySelectorAll('.base');
        const stopSolid = wrapper.querySelector('.stop-solid');
        const stopEdge = wrapper.querySelector('.stop-edge');

        if (!linesBase.length || !svg) return;

        /**
         * 1. 初始化防止塗黑
         * 在任何計算之前，先將漸層推到左側外面
         */
        gsap.set([stopSolid, stopEdge], { 
            attr: { offset: (i) => i === 0 ? "-30%" : "-10%" } 
        });

        /**
         * 2. 多行 viewBox 自動動態修正
         * 讓 SVG 畫布完美貼合 CSS 設定的字體大小
         */
        const calculateViewBox = () => {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            linesBase.forEach(line => {
                const b = line.getBBox();
                minX = Math.min(minX, b.x);
                minY = Math.min(minY, b.y);
                maxX = Math.max(maxX, b.x + b.width);
                maxY = Math.max(maxY, b.y + b.height);
            });
            
            const w = maxX - minX;
            const h = maxY - minY;
            const padding = 0; // 留白空間

            svg.setAttribute('viewBox', `${minX - padding} ${minY - padding} ${w + padding * 2} ${h + padding * 2}`);
        };

        calculateViewBox();

        /**
         * 3. 建立動畫時間軸 (仿 Property Agent 節奏)
         */
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: "top 45%", // 距離頂部多少觸發
                once: true
            }
        });

        // A. 描邊：快速啟動，悠長收尾
        linesBase.forEach((line, index) => {
            const len = line.getComputedTextLength();
            gsap.set(line, {
                strokeDasharray: len,
                strokeDashoffset: len,
                visibility: "visible"
            });

            tl.to(line, {
                strokeDashoffset: 0,
                duration: 4.6,
                ease: "expo.out"
            }, index * 0.15); // 每行微小交錯
        });

        // B. 填色：大面積刷入，與描邊高度重疊
        tl.to(stopSolid, {
            attr: { offset: "100%" },
            duration: 8,
            ease: "expo.out"
        }, "-=5") // 大量重疊是質感關鍵
        .to(stopEdge, {
            attr: { offset: "130%" },
            duration: 10,
            ease: "expo.out"
        }, "<");
    });
}

// 監聽 window load 確保字體載入後再計算 BBox，否則字體大小會跑掉
window.addEventListener('load', initPremiumStrokeText);

// ===================================================
// 數字碼表
// ===================================================

// 格式化成 K / M / B
function formatKMB(value) {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return value.toString();
}

function animateNumber(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * (target - start) + start);
    el.textContent = formatKMB(value);

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// 進入視窗高度 50% 才觸發
const options = {
  root: null,
  threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const dataEl = entry.target;
      const targetValue = Number(dataEl.dataset.target);
      const numberEl = dataEl.querySelector(".number");

      animateNumber(numberEl, targetValue, 1000);  // 動畫秒數

      observer.unobserve(dataEl); // 只執行一次
    }
  });
}, options);

// 啟用觀察
document.querySelectorAll(".data").forEach(el => observer.observe(el));

// ===================================================
// 版面劃線
// ===================================================

document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.7 // 看到多少 % 時觸發
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const svg = entry.target;
        const lines = svg.querySelectorAll('line');
        
        // 加上啟用類名
        svg.classList.add('is-active');



        // 如果想要更細膩的時間差（Stagger）
        lines.forEach((line, index) => {
          // 根據索引增加延遲，讓線一根根劃出來
          line.style.transitionDelay = `${index * 0.05}s`;
        });

        // 觸發後就停止觀察該元素
        observer.unobserve(svg);
      }
    });
  }, observerOptions);

  // 監測畫面上所有的網格線層
  document.querySelectorAll('.grid-layout-lines').forEach(svg => {
    observer.observe(svg);
  });
});

// ===================================================
// UI 作品圖片滾動切換邏輯
// ===================================================

/**
 * 互動設計：UI 區塊長圖捲動 (含 Class 動態切換)
 */
const initPortfolioScroll = () => {
    gsap.registerPlugin(ScrollTrigger);

    const uiSection = document.querySelector('section#ui');
    if (!uiSection) return;

    const items = uiSection.querySelectorAll('.gallery_menu .item');
    const wrappers = uiSection.querySelectorAll('.gallery .img-wrapper');
    const images = uiSection.querySelectorAll('.gallery img');

    // 確保圖片完全載入後才計算高度
    const loadImagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    });

    Promise.all(loadImagePromises).then(() => {
        createScrollTimeline(uiSection, items, wrappers);
    });
};

const createScrollTimeline = (uiSection, items, wrappers) => {
    // 輔助函式：切換 Class (這會解決你 .selected 移動的問題)
    const updateMenuClass = (index) => {
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });
    };

    // 1. 初始化狀態
    // 將所有圖片隱藏，除了第一張
    gsap.set(wrappers, { opacity: 0, visibility: 'hidden' });
    gsap.set(wrappers[0], { opacity: 1, visibility: 'visible', y: 0 });
    
    // 初始化第一個項目的 Class (不需要在 Pug 寫死)
    updateMenuClass(0);
    gsap.set(items[0], { opacity: 1 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: uiSection,
            start: "top top",
            end: "+=12000",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
        }
    });

    wrappers.forEach((wrapper, index) => {
        // --- A. 處理圖片進入與選單同步 ---
        if (index > 0) {
            const enterLabel = `enter_${index}`;
            tl.add(enterLabel);
            
            // 前一張淡出
            tl.to(wrappers[index - 1], { opacity: 0, autoAlpha: 0, duration: 1 }, enterLabel);
            tl.to(items[index - 1], { opacity: 0.15, duration: 1 }, enterLabel);
            
            // 這一張淡入
            tl.to(wrapper, { opacity: 1, autoAlpha: 1, duration: 1 }, enterLabel);
            tl.to(items[index], { 
                opacity: 1, 
                duration: 1,
                onStart: () => updateMenuClass(index),
                onReverseComplete: () => updateMenuClass(index - 1)
            }, enterLabel);
        }

        // --- B. 處理長圖捲動 (維持原邏輯) ---
        const scrollDistance = wrapper.scrollHeight - uiSection.offsetHeight;
        if (scrollDistance > 0) {
            tl.to(wrapper, {
                y: -(scrollDistance + 2), 
                duration: 8, 
                ease: "none"
            });
        }

        // --- C. 關鍵頓點：底部停留機制 ---
        tl.to({}, { duration: 3 }); 

        // --- D. 準備切換的緩衝 ---
        if (index < wrappers.length - 1) {
            tl.to({}, { duration: 1 });
        }
    });
};

window.addEventListener('load', initPortfolioScroll);


// ===================================================
// Graphic 卡片滑入進場
// =================================================== 

const initGraphicAnimation = () => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('section#graphic');
    const cards = section.querySelectorAll('.card');

    if (!section || cards.length === 0) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",      // 當 section 頂部碰到視窗頂部時開始
            end: "+=2000",         // 增加這個數值可以讓動畫變慢（需要滑更久）
            pin: true,             // 固定住 section
            scrub: 1,              // 動畫跟隨滾輪
            anticipatePin: 1
        }
    });

    // 動畫序列
    tl.to(cards[0], {
        x: "3.3vw",                  // 第一張滑入原點位置
        ease: "power2.out",
        duration: 4
    })
    .to(cards[1], {
        x: "6vw",                  // 第二張滑入原點位置
        ease: "power2.out",
        duration: 4
    }, "-=1.5");                   // 在第一張還沒跑完時就開始 (重疊進場)

};

window.addEventListener('load', initGraphicAnimation);

// ===================================================
// 送出/開關表單
// =================================================== 

// 獲取彈窗相關元素
const modal = document.getElementById('contact-modal');
const openBtn = document.getElementById('open-contact');
const closeBtn = document.getElementById('close-contact');

// 獲取表單相關元素 (你原本的部分)
const form = document.getElementById('contact-form');
const result = document.getElementById('result');
const submitBtn = document.getElementById('submit-btn');

// --- 1. 彈窗顯示/隱藏控制 ---

// 點擊按鈕開啟
openBtn.addEventListener('click', () => {
modal.style.display = 'flex';
// 每次開啟時重置狀態
result.style.display = 'none';
submitBtn.disabled = false;
});

// 點擊 X 關閉
closeBtn.addEventListener('click', () => {
modal.style.display = 'none';
});

// 點擊彈窗外黑背景處也能關閉
window.addEventListener('click', (e) => {
if (e.target === modal) {
  modal.style.display = 'none';
}
});

// --- 2. 表單發送邏輯 (原本的功能) ---

form.addEventListener('submit', function(e) {
e.preventDefault(); // 阻止頁面跳轉

// 顯示傳送中狀態
result.style.display = "block";
result.innerHTML = "Sending...";
result.style.color = "#888"; 
submitBtn.disabled = true; // 防止重複點擊

const formData = new FormData(form);
const object = Object.fromEntries(formData);
const json = JSON.stringify(object);

fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: json
})
.then(async (response) => {
    let jsonResponse = await response.json();
    if (response.status == 200) {
        // 成功時
        result.innerHTML = "Thanks for reaching out! I'll be in touch shortly.";
        result.style.color = "#2ecc71"; // 成功綠
        form.reset(); // 清空表單
        
        // 💡 加強體驗：成功送出 2 秒後自動關閉彈窗
        setTimeout(() => {
            modal.style.display = 'none';
        }, 2000);
        
    } else {
        // 伺服器錯誤
        console.log(response);
        result.innerHTML = jsonResponse.message;
        result.style.color = "#e74c3c"; // 錯誤紅
    }
})
.catch(error => {
    // 網路連線錯誤
    console.log(error);
    result.innerHTML = "Sorry, we couldn't send your message. Please check your connection.";
})
.then(function() {
    // 恢復按鈕狀態
    submitBtn.disabled = false;
    
    // 5秒後自動消失狀態訊息 (可選)
    setTimeout(() => {
        result.style.display = "none";
    }, 5000);
});
});



