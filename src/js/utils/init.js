function setFontSize() {
    const clientWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSzie = clientWidth / 4.8 + 'px';
}

document.addEventListener('DOMConetentLoad', setFontSize);
window.addEventListener('orientationchange' in window ? 'orientationchange' : 'reszie', setFontSize);