function checkForEasterEgg() {
    if (document.getElementById('easter-egg-input').value === "The Zere Zoom Project") {
        document.querySelector('.zere').classList.add('shown');
    }
    else {
        document.querySelector('.zere').classList.remove('shown');
    }
}

tippy('.zere', {
    content: '"Do you need help?" - Tech Support',
    theme: 'default',
});