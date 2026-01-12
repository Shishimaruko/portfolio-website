// ====================================================
// 重整頁面強制置頂
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
// 元件淡入模組
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
// 文字字母 hover 跳動
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

// let lastScrollTop = 0;
// const delta = 5; // 捲動超過 5px 才觸發，防手機誤觸
// const navbar = document.getElementById('navbar');

// window.addEventListener('scroll', function() {
//   let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//   // 如果捲動距離小於 delta，則不執行
//   if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

//   if (scrollTop > lastScrollTop && scrollTop > 60) {
//     // 往下捲且超過 navbar 高度時才隱藏
//     navbar.classList.add('nav-hidden');
//   } else {
//     // 往上捲
//     navbar.classList.remove('nav-hidden');
//   }

//   lastScrollTop = scrollTop;
// });

// ====================================================
// 滑動視窗 Navigation 上滑隱藏 - 優化版 > 觀察
// ====================================================

let lastScrollTop = 0;
const delta = 5;
const navbar = document.getElementById('navbar');
let ticking = false;

window.addEventListener('scroll', function() {
  if (!ticking) {
    // 讓瀏覽器在「準備畫下一幀」時才執行計算
    window.requestAnimationFrame(function() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 1. 確保捲動距離超過 delta
      if (Math.abs(lastScrollTop - scrollTop) > delta) {
        // 2. 往下捲 (scrollTop 變大) 且 超過一定距離
        if (scrollTop > lastScrollTop && scrollTop > 60) {
          navbar.classList.add('nav-hidden');
        } 
        // 3. 往上捲 (scrollTop 變小)
        else {
          navbar.classList.remove('nav-hidden');
        }
        // 4. 更新上次的位置
        lastScrollTop = scrollTop;
      }
      
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true }); // 優化：告訴瀏覽器不會阻止捲動，提升流暢度

// ====================================================
// Hero 點點交錯動態背景
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
// 中心旋轉粒子背景
// ===================================================

const PARTICLE_CONFIG = {
    particleRGB: { r: 255, g: 255, b: 255 },
    count: 5000,
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
// 標題描邊填色動畫
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
// 版面格線動畫
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
// UI 作品細節說明開關
// ===================================================

// 等待 DOM 載入
document.addEventListener('DOMContentLoaded', () => {
  // 選取所有在 .label 裡面的功能按鈕
  const detailBtns = document.querySelectorAll("button[data-icon='view']");

  detailBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // 防止事件冒泡（如果你外層 .item 也有點擊事件的話）
      e.stopPropagation();

      // 1. 尋找目前點擊按鈕所屬的那個 .item 容器
      const parentItem = this.closest('.item');
      
      // 2. 找到該容器內的 .details 區塊
      const details = parentItem.querySelector('.details');

      // 3. 切換 class (如果原本有就移除，沒有就加上)
      details.classList.toggle('visible');
      
      // 4. 按鈕自己也加上 active class (用來改 icon 顏色或背景)
      this.classList.toggle('is-active');
      
      // 選擇性：如果點開一個要關閉其他人的話，可以取消下方註解
      /*
      detailBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.classList.remove('is-active');
          otherBtn.closest('.item').querySelector('.details').classList.remove('visible');
        }
      });
      */
    });
  });
});

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
            // pinSpacing: false,
            anticipatePin: 1
        }
    });

    // 動畫序列
    tl.to(cards[0], {
        x: "0vw",                  // 第一張滑入原點位置
        ease: "power2.out",
        duration: 4
    })
    .to(cards[1], {
        x: "3vw",                  // 第二張滑入原點位置
        ease: "power2.out",
        duration: 4
    }, "-=1.5");                   // 在第一張還沒跑完時就開始 (重疊進場)

};

window.addEventListener('load', initGraphicAnimation);

// ===================================================
// 開關表單、送出表單回饋訊息
// ===================================================  

window.addEventListener('load', () => {
    const contactModal = document.getElementById('contact-modal');
    const contactOpenTrigger = document.getElementById('open-contact');
    const contactCloseTrigger = document.getElementById('close-contact');
    const contactMainForm = document.getElementById('contact-form');
    const contactStatusMsg = document.getElementById('result');
    const contactSubmitBtn = document.getElementById('submit-btn');

    if (!contactModal || !contactOpenTrigger) return;

    // 輔助函式：保持原有的 GSAP 結構相容
    const updateBtnText = (btn, newText) => {
        const textLayers = btn.querySelectorAll('.text-layer');
        if (textLayers.length > 0) {
            textLayers.forEach(layer => { layer.innerText = newText; });
        } else {
            btn.innerText = newText;
        }
    };

    // --- 彈窗顯示控制 (改為 Class 模式) ---
    contactOpenTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        // 重置狀態
        contactStatusMsg.style.display = 'none';
        contactSubmitBtn.disabled = false;
        updateBtnText(contactSubmitBtn, "Send Message");
        
        // 啟動動畫
        contactModal.classList.add('is-open');
    });

    const closeModal = () => {
        contactModal.classList.remove('is-open');
    };

    if (contactCloseTrigger) {
        contactCloseTrigger.addEventListener('click', closeModal);
    }

    // 點擊背景關閉
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
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
            const formJson = JSON.stringify(Object.fromEntries(formData));

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
                    
                    // 成功後延遲關閉
                    setTimeout(closeModal, 2000);
                } else {
                    contactStatusMsg.innerHTML = resData.message || "Error occurred.";
                    contactStatusMsg.style.color = "#e74c3c";
                    updateBtnText(contactSubmitBtn, "Try Again");
                    contactSubmitBtn.disabled = false;
                }
            })
            .catch(err => {
                contactStatusMsg.innerHTML = "Connection error!";
                contactStatusMsg.style.color = "#e74c3c";
                updateBtnText(contactSubmitBtn, "Error");
                contactSubmitBtn.disabled = false;
            });
        });
    }
});

