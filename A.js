document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('runMinify');
    const input = document.getElementById('sourceCode');
    const output = document.getElementById('resultCode');

    btn.addEventListener('click', () => {
        const raw = input.value;
        if (!raw) return alert('コードを入力してください');
        
        const minified = JSMinifier.minify(raw);
        output.value = minified;
    });
});
