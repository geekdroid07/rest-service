import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';

class CustomNodeEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  async setup(): Promise<void> {
    await super.setup();

    if (!this.global.localStorage) {
      const store = new Map<string, string>();
      this.global.localStorage = {
        getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
        removeItem: (key: string) => {
          store.delete(key);
        },
        clear: () => {
          store.clear();
        },
        key: (index: number) => Array.from(store.keys())[index] ?? null,
        get length() {
          return store.size;
        },
      } as Storage;
    }
  }
}

export default CustomNodeEnvironment;
