function setFontSize() {
    const clientWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = clientWidth / 7.5 + 'px';
}

document.addEventListener('DOMContentLoaded', setFontSize);
window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', setFontSize);