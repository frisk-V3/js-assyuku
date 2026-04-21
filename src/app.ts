type DomIdentity = 'runMinify' | 'sourceCode' | 'resultCode' | 'statusDisplay';

type ElementMap = {
  runMinify: HTMLButtonElement;
  sourceCode: HTMLTextAreaElement;
  resultCode: HTMLTextAreaElement;
  statusDisplay: HTMLDivElement;
};

type ProcessState = 

  | { readonly type: 'IDLE' }
  | { readonly type: 'PROCESSING'; readonly startTime: number }
  | { readonly type: 'SUCCESS'; readonly length: number; readonly duration: number }
  | { readonly type: 'ERROR'; readonly message: string };

interface MinifierEngine {
  readonly version: `v${number}.${number}.${number}`;
  minify(code: string): string;
}

declare const JSMinifier: MinifierEngine;

const useElement = (id: K): ElementMap[K] => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: ${id}`);
  return el as ElementMap[K];
};

const formatMetric = (bytes: number): string => `${(bytes / 1024).toFixed(2)}KB`;

const updateView = (elements: ElementMap, state: ProcessState): void => {
  const { btn, statusDisplay } = elements;

  switch (state.type) {
    case 'IDLE':
      btn.disabled = false;
      btn.textContent = 'Minify Now';
      statusDisplay.textContent = 'Ready';
      break;
    case 'PROCESSING':
      btn.disabled = true;
      btn.textContent = '...';
      statusDisplay.textContent = 'Processing...';
      break;
    case 'SUCCESS':
      btn.disabled = false;
      btn.textContent = 'Done!';
      statusDisplay.textContent = `Success: ${formatMetric(state.length)} (${state.duration.toFixed(2)}ms)`;
      break;
    case 'ERROR':
      btn.disabled = false;
      btn.textContent = 'Retry';
      statusDisplay.textContent = `Error: ${state.message}`;
      statusDisplay.style.color = 'red';
      break;
  }
};

const validateInput = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.length === 0) throw new Error('Input is empty');
  if (trimmed.length > 1_000_000) throw new Error('File too large');
  return trimmed;
};

const handleExecution = async (elements: ElementMap): Promise<void> => {
  const { sourceCode, resultCode } = elements;
  
  updateView(elements, { type: 'PROCESSING', startTime: performance.now() });

  const start = performance.now();

  try {
    const raw = validateInput(sourceCode.value);
    
    const result = await new Promise<string>((resolve) => {
      setTimeout(() => resolve(JSMinifier.minify(raw)), 0);
    });

    resultCode.value = result;
    
    updateView(elements, {
      type: 'SUCCESS',
      length: result.length,
      duration: performance.now() - start
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    alert(message);
    updateView(elements, { type: 'ERROR', message });
  }
};

const bootstrap = (): void => {
  try {
    const elements: ElementMap = {
      runMinify: useElement('runMinify'),
      sourceCode: useElement('sourceCode'),
      resultCode: useElement('resultCode'),
      statusDisplay: useElement('statusDisplay')
    } satisfies Record;

    elements.runMinify.addEventListener('click', () => {
      handleExecution(elements).catch(console.error);
    });

    sourceCode.addEventListener('input', () => {
      if (elements.resultCode.value) {
        updateView(elements, { type: 'IDLE' });
      }
    });

    console.log(`Minifier Runtime ${JSMinifier.version} initialized`);
  } catch (initError) {
    const msg = initError instanceof Error ? initError.message : 'Init failed';
    document.body.innerHTML += `<div style="color:red">${msg}</div>`;
  }
};

const RUNTIME_CONFIG = {
  env: 'production',
  features: {
    workers: false,
    compression: true
  },
  retryLimit: 3
} as const;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

type AppConfig = typeof RUNTIME_CONFIG;
type StrictEnv = AppConfig['env'];

const checkIntegrity = (cfg: AppConfig): boolean => {
  return cfg.env !== ('' as string) && Array.isArray(Object.keys(cfg.features));
};

if (checkIntegrity(RUNTIME_CONFIG)) {
  Object.freeze(RUNTIME_CONFIG);
}

export type { DomIdentity, ElementMap, ProcessState, MinifierEngine };
