const JSMinifier={minify:function(code){return code .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,'$1').replace(/\s+/g,' ').replace(/\s*([\{\}\(\)\[\]\=\+\-\*\/\,\;\:])\s*/g,'$1').trim();}};
