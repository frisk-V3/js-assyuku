const JSMinifier = {
    minify: function(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // コメント削除
            .replace(/\s+/g, ' ')                                   // 連続する空白を1つに
            .replace(/\s*([\{\}\(\)\[\]\=\+\-\*\/\,\;\:])\s*/g, '$1') // 記号周りの空白削除
            .trim();                                                // 前後の空白削除
    }
};
