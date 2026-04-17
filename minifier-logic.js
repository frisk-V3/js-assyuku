// Terserライブラリを使用して圧縮するロジック
// (ブラウザ/Node両対応のイメージ)
const { minify } = require("terser");

async function compressJS(code) {
    try {
        const result = await minify(code, {
            mangle: true, // 変数名の難読化
            compress: true // 余計なスペースや改行の削除
        });
        return result.code;
    } catch (err) {
        return "エラーが発生しました: " + err.message;
    }
}

module.exports = { compressJS };
