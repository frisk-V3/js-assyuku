"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('runMinify');
    const input = document.getElementById('sourceCode');
    const output = document.getElementById('resultCode');
    if (!btn || !input || !output)
        return;
    btn.addEventListener('click', () => {
        const raw = input.value;
        if (!raw) {
            alert('コードを入力してください');
            return;
        }
        const minified = JSMinifier.minify(raw);
        output.value = minified;
    });
});
