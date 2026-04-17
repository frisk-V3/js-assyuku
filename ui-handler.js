// UIのイベントを管理する
document.getElementById('minifyBtn').addEventListener('click', async () => {
    const input = document.getElementById('inputCode').value;
    
    // 本来はサーバー(Node.js)へ送信するが、
    // ここではロジックを分離した関数として呼び出す想定
    const output = await window.compressor.minify(input);
    document.getElementById('outputCode').value = output;
});
