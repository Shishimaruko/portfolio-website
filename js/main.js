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
// 淡入模組
// ====================================================

// 頁面初始化動畫函式
function initEntryAnimations() {
  const fadeElements = document.querySelectorAll('[data-fade]');

  fadeElements.forEach((el) => {
    // 讀取屬性，若沒設定則使用預設值
    const effect = el.dataset.fade; // 'in' or 'up'
    const delay = parseFloat(el.dataset.delay) || 0; // 時間差 (預設 0)
    const duration = parseFloat(el.dataset.duration) || 0.9; // 進場時長 (預設 0.8s)

    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%", // 當元素頂部進入視窗 90% 位置
        once: true        // 僅觸發一次，避免重複閃爍
      },
      opacity: 1,
      y: 0,
      duration: duration,
      delay: delay,
      ease: "power2.out"
    });
  });
}

// 確保在頁面載入完成後執行
window.addEventListener('load', initEntryAnimations);

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
// UI 作品圖片滾動切換邏輯 純滾動版
// ===================================================

gsap.registerPlugin(ScrollTrigger);

const uiSection = document.querySelector('#ui');
const menuItems = document.querySelectorAll('.gallery_menu .item');
const imgWrappers = document.querySelectorAll('.gallery .img-wrapper');

// --- 預設狀態 ---
function setActive(index) {
  menuItems.forEach((item, i) => {
    item.classList.toggle('selected', i === index);
  });
  imgWrappers.forEach((img, i) => {
    img.classList.toggle('show', i === index);
  });
}

// --- 核心捲動邏輯 ---
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: uiSection,
    start: "top top",         // 當 section 頂部碰到視窗頂部
    end: "+=3000",            // 決定滾動多久才切換完 4 個項目（可依手感調整）
    pin: true,                // 釘住整個 section
    scrub: 0.5,               // 讓切換跟隨手指滾動的速度，0.5 帶點平滑感
    onUpdate: (self) => {
      // 依據捲動進度 (0~1) 計算 Index
      // 0~0.25 為第一個, 0.25~0.5 為第二個...以此類推
      const progress = self.progress;
      const total = menuItems.length;
      const index = Math.min(Math.floor(progress * total), total - 1);
      
      setActive(index);
    }
  }
});

// --- 需求 1：進入視窗 20% 處先加載第一個 selected ---
ScrollTrigger.create({
  trigger: uiSection,
  start: "top 80%", // 視窗底部算上來 20% (即 top 80%)
  onEnter: () => setActive(0),
  onLeaveBack: () => {
    // 往回滑出視窗時可以移除 selected，保持乾淨
    menuItems.forEach(item => item.classList.remove('selected'));
  }
});

// ===================================================
// UI 作品圖片滾動切換邏輯 滾動加點擊版 *閃跳待修
// ===================================================

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// const uiSection = document.querySelector('#ui');
// const menuItems = document.querySelectorAll('.gallery_menu .item');
// const imgWrappers = document.querySelectorAll('.gallery .img-wrapper');

// // 1. 封裝切換函式
// function goToSection(index) {
//   // 切換選單
//   menuItems.forEach((item, i) => item.classList.toggle('selected', i === index));
//   // 切換圖片
//   imgWrappers.forEach((img, i) => img.classList.toggle('show', i === index));
// }

// // 2. 建立主 Pin 效果
// ScrollTrigger.create({
//   trigger: uiSection,
//   start: "top top",
//   end: "+=3000", // 總滾動距離
//   pin: true,
//   scrub: true
// });

// // 3. 建立 4 個子區間來觸發 class 切換
// menuItems.forEach((item, index) => {
//   ScrollTrigger.create({
//     trigger: uiSection,
//     // 將 3000px 的總距離平均分配
//     start: () => `top+=${(3000 / menuItems.length) * index} top`,
//     end: () => `top+=${(3000 / menuItems.length) * (index + 1)} top`,
    
//     // 當滾動進入此區間
//     onToggle: self => {
//       if (self.isActive) {
//         goToSection(index);
//       }
//     },
    
//     // 解決點擊衝突：點擊時捲動到該區間的起始位置
//     onRefresh: self => {
//       item.onclick = (e) => {
//         e.preventDefault();
//         gsap.to(window, {
//           duration: 0.8,
//           scrollTo: self.start + 2, // 加 2 像素確保觸發在區間內
//           ease: "power2.inOut",
//           overwrite: "auto" // 重要：覆蓋掉正在進行的捲動
//         });
//       };
//     }
//   });
// });

// ===================================================
// Graphic 卡片滑入進場
// =================================================== 

// const initGraphicAnimation = () => {
//     gsap.registerPlugin(ScrollTrigger);

//     const section = document.querySelector('section#graphic');
//     const cards = section.querySelectorAll('.card');

//     if (!section || cards.length === 0) return;

//     const tl = gsap.timeline({
//         scrollTrigger: {
//             trigger: section,
//             start: "top top",      // 當 section 頂部碰到視窗頂部時開始
//             end: "+=2000",         // 增加這個數值可以讓動畫變慢（需要滑更久）
//             pin: true,             // 固定住 section
//             scrub: 1,              // 動畫跟隨滾輪
//             // pinSpacing: false,
//             anticipatePin: 1
//         }
//     });

//     // 動畫序列
//     tl.to(cards[0], {
//         x: "3.3vw",                  // 第一張滑入原點位置
//         ease: "power2.out",
//         duration: 4
//     })
//     .to(cards[1], {
//         x: "6vw",                  // 第二張滑入原點位置
//         ease: "power2.out",
//         duration: 4
//     }, "-=1.5");                   // 在第一張還沒跑完時就開始 (重疊進場)

// };

// window.addEventListener('load', initGraphicAnimation);

// ===================================================
// 送出/開關表單
// ===================================================  

window.addEventListener('load', () => {
    const contactModal = document.getElementById('contact-modal');
    const contactOpenTrigger = document.getElementById('open-contact');
    const contactCloseTrigger = document.getElementById('close-contact');
    const contactMainForm = document.getElementById('contact-form');
    const contactStatusMsg = document.getElementById('result');
    const contactSubmitBtn = document.getElementById('submit-btn');

    if (!contactModal || !contactOpenTrigger) return;

    // 輔助函式：安全地更新按鈕文字 (不破壞 GSAP 字母跳動結構)
    const updateBtnText = (btn, newText) => {
        const textLayers = btn.querySelectorAll('.text-layer');
        if (textLayers.length > 0) {
            textLayers.forEach(layer => {
                // 如果你有用之前的 createTextLayer 函式，這裡也要重新生成字母
                // 簡單做法：直接更換層內文字
                layer.innerText = newText;
            });
        } else {
            btn.innerText = newText;
        }
    };

    // --- 彈窗顯示控制 ---
    contactOpenTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.style.display = 'flex';
        // 重置狀態
        contactStatusMsg.style.display = 'none';
        contactSubmitBtn.disabled = false;
        updateBtnText(contactSubmitBtn, "Send Message");
    });

    if (contactCloseTrigger) {
        contactCloseTrigger.addEventListener('click', () => {
            contactModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });

    // --- 表單發送邏輯 ---
    if (contactMainForm) {
        contactMainForm.addEventListener('submit', function(e) {
            e.preventDefault();

            contactStatusMsg.style.display = "block";
            contactStatusMsg.innerHTML = "Sending...";
            contactStatusMsg.style.color = "#888"; 
            contactSubmitBtn.disabled = true;
            updateBtnText(contactSubmitBtn, "Sending...");

            const formData = new FormData(contactMainForm);
            const formObject = Object.fromEntries(formData);
            const formJson = JSON.stringify(formObject);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: formJson
            })
            .then(async (res) => {
                let resData = await res.json();
                if (res.status == 200) {
                    contactStatusMsg.innerHTML = "✨ Message sent! I'll be in touch shortly.";
                    contactStatusMsg.style.color = "#2ecc71";
                    contactMainForm.reset();
                    updateBtnText(contactSubmitBtn, "Success!");
                    
                    setTimeout(() => {
                        contactModal.style.display = 'none';
                    }, 2000);
                } else {
                    contactStatusMsg.innerHTML = resData.message || "Error occurred.";
                    contactStatusMsg.style.color = "#e74c3c";
                    updateBtnText(contactSubmitBtn, "Try Again");
                }
            })
            .catch(err => {
                contactStatusMsg.innerHTML = "Connection error!";
                contactStatusMsg.style.color = "#e74c3c";
                updateBtnText(contactSubmitBtn, "Error");
            })
            .then(() => {
                contactSubmitBtn.disabled = false;
                setTimeout(() => {
                    contactStatusMsg.style.display = "none";
                }, 5000);
            });
        });
    }
});


