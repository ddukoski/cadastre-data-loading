import * as GeistCore from '@geist-ui/core';
import { palette } from './palette';

const Themes = (GeistCore as any).Themes;

const FONT_SANS =
  "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace";

export const theme = Themes.createFromDark({
  type: 'cadastre-dark',
  font: { sans: FONT_SANS, mono: FONT_MONO },
  palette: {
    background: palette.bg,
    foreground: palette.ink,
    accents_1: palette.surface,
    accents_2: palette.surfaceHover,
    accents_3: palette.inkMuted,
    accents_4: palette.borderStrong,
    accents_5: palette.inkFaint,
    accents_6: palette.inkMuted,
    accents_7: '#c7c8cc',
    accents_8: '#eaeaea',
    border: palette.border,
    secondary: palette.inkMuted,
    selection: palette.accent,
    link: palette.accent,
  },
});
