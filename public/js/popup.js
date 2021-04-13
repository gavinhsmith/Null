const popup = document.getElementById("popup");

const rawUrlData = location.href.split("?")[1].split("&");
const urlData = {};
for (let i = 0; i < rawUrlData.length; i++) {
    urlData[rawUrlData[i].split("=")[0]] = rawUrlData[i].split("=")[1];
};

if (urlData.msgId) {
    popup.innerHTML = "Test Text"
    popup.style.display = "inline-block";
};