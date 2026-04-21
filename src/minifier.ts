interface JSMinifierInterface {
  minify(code: string): string;
}

const JSMinifier: JSMinifierInterface = {
  minify(code: string): string {
    const reserved: string[] = ['module', 'exports', 'rules', 'require'];
    const vars: Record<string, string> = {};
    let nextId = 0;

    const getNextName = (): string => {
      let name = '', n = nextId++;
      while (n >= 0) {
        name = String.fromCharCode(97 + (n % 26)) + name;
        n = Math.floor(n / 26) - 1;
      }
      return name;
    };

    return code
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
      .replace(
        /((['"])(?:(?=(\\?))\3.)*?\2)|(\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\b)|(\b[a-zA-Z_$][\w$]*\b)|(\s+)|(\s*([{}()\[\]=+\-*/,;:])\s*)/g,
        (match, string, q, e, decl, declName, ident, space, symbol, char) => {
          if (string) return string;
          if (declName && !reserved.includes(declName)) {
            if (!vars[declName]) vars[declName] = getNextName();
            return match.replace(declName, vars[declName]);
          }
          if (ident && vars[ident]) {
            return vars[ident];
          }
          if (char) return char;
          if (space) return ' ';
          return match;
        }
      )
      .replace(/\s+/g, ' ')
      .trim();
  }
};
