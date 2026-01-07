// ===================================================
// 送出/開關表單 (整合修正版 - 解決按鈕重組失效問題)
// =================================================== 

window.addEventListener('load', () => {
    // 1. 獲取彈窗與表單相關元素
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-contact');
    const closeBtn = document.getElementById('close-contact');
    const form = document.getElementById('contact-form');
    const result = document.getElementById('result');
    const submitBtn = document.getElementById('submit-btn');

    // 檢查元素是否存在，避免在沒有表單的頁面噴錯
    if (!modal || !openBtn) return;

    // --- 彈窗顯示控制 ---

    // 點擊按鈕開啟
    openBtn.addEventListener('click', (e) => {
        e.preventDefault(); // 防止 a 標籤的預設跳轉行為
        modal.style.display = 'flex';
        // 每次開啟時重置狀態
        result.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Message"; // 恢復按鈕文字
    });

    // 點擊 X 關閉
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // 點擊彈窗外黑背景處也能關閉
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- 表單發送邏輯 (Web3Forms AJAX) ---

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止頁面跳轉

            // 顯示傳送中狀態 (英文文案)
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
                    // 成功時 (英文文案)
                    result.innerHTML = "✨ Message sent! I'll be in touch shortly.";
                    result.style.color = "#2ecc71"; // 成功綠
                    form.reset(); // 清空表單
                    
                    // 成功送出 2 秒後自動關閉彈窗，優化 UX
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 2000);
                    
                } else {
                    // 伺服器錯誤
                    console.error("Form Error:", jsonResponse);
                    result.innerHTML = jsonResponse.message || "Something went wrong. Please try again.";
                    result.style.color = "#e74c3c"; // 錯誤紅
                }
            })
            .catch(error => {
                // 網路連線錯誤
                console.error("Network Error:", error);
                result.innerHTML = "Sorry, connection error. Please try again later!";
                result.style.color = "#e74c3c";
            })
            .then(function() {
                // 恢復按鈕狀態
                submitBtn.disabled = false;
                
                // 5 秒後自動隱藏提示訊息
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
            });
        });
    }
});
