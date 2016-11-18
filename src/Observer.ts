export interface Observer<T> {
  next: (x: T) => void;
  error?: (e: Error) => void;
  complete?: () => void;
}
