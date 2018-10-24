export function baseFontSize() {
    const clientWidth = document.documentElement.clientWidth;
    return clientWidth / 7.5;
}

function setFontSize() {
    const clientWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = baseFontSize() + 'px';
}

document.addEventListener('DOMContentLoaded', setFontSize);
window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', setFontSize);