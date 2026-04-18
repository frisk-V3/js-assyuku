const JSMinifier = {
  minify(code) {
    return code
      // 1. コメントを削除（URLの // に反応しないよう工夫）
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
      // 2. 文字列リテラル以外（空白や改行）を安全に置換
      .replace(/((['"])(?:(?=(\\?))\3.)*?\2)|(\s+)|(\s*([{}()\[\]=+\-*/,;:])\s*)/g, (match, string, quote, escape, space, symbol, char) => {
        if (string) return string; // 文字列の中身はそのまま返す
        if (char) return char;     // 記号周りの空白は詰める
        if (space) return ' ';     // 連続する空白は1つにする
        return match;
      })
      .replace(/\s+/g, ' ') // 最後に全体の余計な空白を調整
      .trim();
  }
};
