async function loadLayoutAdmin() {
    try {
        // Load header
        const headerResponse = await fetch("../components/headeradmin.html");
        const headerHtml = await headerResponse.text();
        document.getElementById("header").innerHTML = headerHtml;

        // Load sidebar
        const sidebarResponse = await fetch("../components/sidebaradmin.html");
        const sidebarHtml = await sidebarResponse.text();
        document.getElementById("sidebar").innerHTML = sidebarHtml;

        // Highlight menu active dựa trên data-page
        const sidebarLinks = document.querySelectorAll(".sidebar ul li");

        // Lấy tên path hiện tại, từ root /screen/admin/... để khớp với data-page
        // window.location.pathname ví dụ: "/screen/admin/adminhome.html"
        // data-page ví dụ: "../admin/adminhome.html"
        // Chúng ta convert window.location.pathname thành dạng "../admin/adminhome.html" để so sánh
        const pathParts = window.location.pathname.split("/"); 
        // Lấy folder + file cuối cùng
        const folderFile = pathParts.slice(-2).join("/"); // "admin/adminhome.html"
        const currentPath = "../" + folderFile;           // "../admin/adminhome.html"

        sidebarLinks.forEach(li => {
            li.classList.remove("active");
            if(li.dataset.page === currentPath) {
                li.classList.add("active");
            }
        });

    } catch (error) {
        console.error("Error loading admin layout:", error);
    }
}

// Gọi hàm khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", loadLayoutAdmin);
