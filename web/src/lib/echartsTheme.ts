import * as echarts from 'echarts';
import { palette, seriesPalette } from './palette';

export const ECHARTS_THEME_NAME = 'cadastre-dark';

echarts.registerTheme(ECHARTS_THEME_NAME, {
  color: seriesPalette,
  backgroundColor: 'transparent',
  textStyle: { fontFamily: "'IBM Plex Sans', sans-serif" },
  title: { textStyle: { color: palette.ink } },
  legend: { textStyle: { color: palette.inkMuted } },
  tooltip: {
    backgroundColor: palette.surfaceHover,
    borderColor: palette.borderStrong,
    textStyle: { color: palette.ink },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: palette.borderStrong } },
    axisTick: { lineStyle: { color: palette.borderStrong } },
    axisLabel: { color: palette.inkMuted, fontFamily: "'IBM Plex Mono', monospace" },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: palette.inkMuted, fontFamily: "'IBM Plex Mono', monospace" },
    splitLine: { lineStyle: { color: palette.surfaceHover } },
  },
  line: { lineStyle: { color: palette.accent, width: 2 }, itemStyle: { color: palette.accent } },
  bar: { itemStyle: { color: palette.accent } },
});
