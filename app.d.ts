interface Window {
  IMP: any;
  ethereum: any;
  immutable: any;
}

export type NullAble<T> = {
  [P in keyof T]: T[P] | null;
};