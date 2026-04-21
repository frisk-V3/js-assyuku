type MinifyResult = {
  readonly code: string;
  readonly mapping: ReadonlyMap<string, string>;
  readonly stats: {
    readonly originalSize: number;
    readonly minifiedSize: number;
    readonly ratio: string;
  };
};

interface MinifierOptions {
  preserve?: readonly string[];
  mangle?: boolean;
}

class AdvancedMinifier {
  static #DEFAULT_RESERVED = new Set(['break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'module', 'exports', 'require']);

  #nextId = 0;
  #vars = new Map<string, string>();
  #reserved: Set<string>;

  constructor(options: MinifierOptions = {}) {
    this.#reserved = new Set([...AdvancedMinifier.#DEFAULT_RESERVED, ...(options.preserve ?? [])]);
  }

  #generateId(): string {
    let name = '';
    let n = this.#nextId++;
    while (n >= 0) {
      name = String.fromCharCode(97 + (n % 26)) + name;
      n = Math.floor(n / 26) - 1;
    }
    return name;
  }

  #getMangledName(original: string): string {
    if (this.#reserved.has(original)) return original;
    const existing = this.#vars.get(original);
    if (existing) return existing;
    const newName = this.#generateId();
    this.#vars.set(original, newName);
    return newName;
  }

  execute(source: string): MinifyResult {
    const pattern = /((['"])(?:(?=(\\?))\3.)*?\2)|(\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$)|(\b(?:const|let|var|function|class)\s+([a-zA-Z_$][\w$]*)\b)|(\b[a-zA-Z_$][\w$]*\b)|(\s+)|(\s*([{}()\[\]=+\-*/,;:])\s*)/gm;

    const processed = source.replace(pattern, (match, str, _q, _e, comment, _prefix, decl, declName, ident, space, symbol, char) => {
      if (str) return str;
      if (comment) return '';
      if (declName) {
        return match.replace(declName, this.#getMangledName(declName));
      }
      if (ident) {
        return this.#vars.get(ident) ?? ident;
      }
      if (char) return char;
      if (space) return ' ';
      return match;
    });

    const finalCode = processed.replace(/\s+/g, ' ').replace(/\s*([{}()\[\]=+\-*/,;:])\s*/g, '$1').trim();

    return {
      code: finalCode,
      mapping: new Map(this.#vars),
      stats: {
        originalSize: source.length,
        minifiedSize: finalCode.length,
        ratio: `${((1 - finalCode.length / source.length) * 100).toFixed(2)}%`
      }
    } satisfies MinifyResult;
  }
}

const processor = new AdvancedMinifier({
  preserve: ['customGlobal', 'specialFunc']
});

const rawCode = `
  const myLongVariableName = 42;
  function calculateTotal(price, tax) {
    const result = price + (price * tax);
    console.log(result);
    return result;
  }
  calculateTotal(myLongVariableName, 0.1);
`;

const result = processor.execute(rawCode);

const output = {
  success: true,
  data: result.code,
  performance: result.stats
} as const;

console.log(output.data);
console.log(output.performance);

export type { MinifyResult, MinifierOptions };
export { AdvancedMinifier };

