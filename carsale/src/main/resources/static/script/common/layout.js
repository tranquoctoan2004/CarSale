async function loadLayout() {
    // load header
    const header = await fetch("../components/header.html")
        .then(res => res.text());
    document.getElementById("header").innerHTML = header;

    // load footer
    const footer = await fetch("../components/footer.html")
        .then(res => res.text());
    document.getElementById("footer").innerHTML = footer;
}

loadLayout();
