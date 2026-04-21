declare const JSMinifier: {
  minify: (code: string) => string;
};

document.addEventListener('DOMContentLoaded', (): void => {
  const btn = document.getElementById('runMinify') as HTMLButtonElement | null;
  const input = document.getElementById('sourceCode') as HTMLTextAreaElement | null;
  const output = document.getElementById('resultCode') as HTMLTextAreaElement | null;

  if (!btn || !input || !output) return;

  btn.addEventListener('click', (): void => {
    const raw: string = input.value;

    if (!raw) {
      alert('コードを入力してください');
      return;
    }

    const minified: string = JSMinifier.minify(raw);
    output.value = minified;
  });
});
