// Biến lưu trữ danh sách news để tìm kiếm nhanh mà không cần gọi lại API
let allNewsData = [];

async function fetchPublicNews() {
  const container = document.getElementById("news-container");
  try {
    const response = await fetch("/api/news/public");
    const result = await response.json();

    if (response.ok && result.data) {
      allNewsData = result.data; // Lưu lại dữ liệu
      container.innerHTML = ""; 

      allNewsData.forEach((news) => {
        const newsCard = document.createElement("div");
        newsCard.className = "content-card news-item";

        const imageSrc = news.imageUrl || "/images/default-news.jpg";
        const summaryText = news.content ? news.content.substring(0, 150) + "..." : "";

        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${imageSrc}" alt="${news.title}">
            </div>
            <div class="news-info">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-summary">${summaryText}</p>
                <div class="news-meta">
                    <span>📅 ${new Date(news.date).toLocaleDateString("vi-VN")}</span>
                    <button onclick="showDetail(${news.newsId})" class="btn-readmore">Xem thêm</button>
                </div>
            </div>
        `;
        container.appendChild(newsCard);
      });
    }
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

// Hàm hiển thị Modal chi tiết
function showDetail(newsId) {
  const news = allNewsData.find(item => item.newsId === newsId);
  if (!news) return;

  const modal = document.getElementById("news-modal");
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `
    <img src="${news.imageUrl || '/images/default-news.jpg'}" class="modal-detail-img">
    <h2 class="modal-detail-title">${news.title}</h2>
    <p class="text-muted mb-3">Ngày đăng: ${new Date(news.date).toLocaleDateString("vi-VN")} | Tác giả: ${news.author?.fullName || 'Admin'}</p>
    <hr>
    <div class="modal-detail-content">${news.content}</div>
  `;

  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Chặn cuộn trang chính khi đang mở modal
}

// Hàm đóng Modal
function closeModal() {
  const modal = document.getElementById("news-modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Cho phép cuộn lại trang chính
}

// Đóng modal khi click ra ngoài vùng trắng
window.onclick = function(event) {
  const modal = document.getElementById("news-modal");
  if (event.target == modal) {
    closeModal();
  }
}

// Chạy load tin tức khi trang sẵn sàng
document.addEventListener("DOMContentLoaded", fetchPublicNews);