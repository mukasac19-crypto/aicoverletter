// types/global.d.ts

interface Window {
  gtag: (
    command: 'config' | 'js' | 'event',
    action: string | Date,
    options?: { [key: string]: any }
  ) => void;
}