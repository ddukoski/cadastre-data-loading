import { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Page, Grid, Card, Select, Input, Text, Spacer, Loading, Divider } from './lib/geist';
import { ECHARTS_THEME_NAME } from './lib/echartsTheme';
import { palette } from './lib/palette';
import { USAGE_TYPES, CLASSIFICATIONS } from '../../shared/cadastre-options';
import {
  fetchApplicationsOverTime,
  fetchBuildYears,
  fetchParcelAreaDistribution,
  fetchPropertiesByMunicipality,
  fetchUsageBreakdown,
  type ApplicationsPoint,
  type BuildYearPoint,
  type MunicipalityCount,
  type ParcelAreaBucket,
  type UsageBreakdown,
} from './lib/statsApi';

const ALL = '__all__';

const CHART_STYLE = { height: '320px', width: '100%' };

function Chart(props: { option: object }) {
  return <ReactECharts option={props.option} style={CHART_STYLE} theme={ECHARTS_THEME_NAME} notMerge />;
}

function EmptyState() {
  return (
    <div className="chart-empty">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" strokeDasharray="2 3" />
      </svg>
      No data for this filter
    </div>
  );
}

function ChartCard({
  title,
  loading,
  empty,
  children,
}: {
  title: string;
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card width="100%">
      <Text h4 my={0}>{title}</Text>
      <Divider y={0.6} />
      {loading ? <Loading /> : empty ? <EmptyState /> : children}
    </Card>
  );
}

export default function Dashboard() {
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2026-07-01');
  const [usageType, setUsageType] = useState<string>('');
  const [classification, setClassification] = useState<string>('');

  const [buildYears, setBuildYears] = useState<BuildYearPoint[] | null>(null);
  const [municipalities, setMunicipalities] = useState<MunicipalityCount[] | null>(null);
  const [usageBreakdown, setUsageBreakdown] = useState<UsageBreakdown[] | null>(null);
  const [applications, setApplications] = useState<ApplicationsPoint[] | null>(null);
  const [areaDistribution, setAreaDistribution] = useState<ParcelAreaBucket[] | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [showNavTitle, setShowNavTitle] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowNavTitle(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchPropertiesByMunicipality().then(setMunicipalities);
  }, []);

  useEffect(() => {
    setBuildYears(null);
    fetchBuildYears(dateFrom.slice(0, 4), dateTo.slice(0, 4)).then(setBuildYears);
  }, [dateFrom, dateTo]);

  useEffect(() => {
    setApplications(null);
    fetchApplicationsOverTime(dateFrom, dateTo, classification || undefined).then(setApplications);
  }, [dateFrom, dateTo, classification]);

  useEffect(() => {
    setUsageBreakdown(null);
    fetchUsageBreakdown(usageType || undefined).then(setUsageBreakdown);
  }, [usageType]);

  useEffect(() => {
    setAreaDistribution(null);
    fetchParcelAreaDistribution(usageType || undefined).then(setAreaDistribution);
  }, [usageType]);

  const buildYearsOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 24, bottom: 32 },
    xAxis: { type: 'category', data: buildYears?.map((d) => d.year) ?? [] },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      data: buildYears?.map((d) => d.count) ?? [],
      smooth: true,
      areaStyle: { color: palette.accentDark, opacity: 0.35 },
    }],
  }), [buildYears]);

  const municipalitiesOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 100, right: 16, top: 24, bottom: 32 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: municipalities?.map((d) => d.opstina) ?? [], inverse: true },
    series: [{ type: 'bar', data: municipalities?.map((d) => d.count) ?? [] }],
  }), [municipalities]);

  const usageBreakdownOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      label: { show: false },
      data: usageBreakdown?.map((d) => ({ name: d.usageType, value: d.count })) ?? [],
    }],
  }), [usageBreakdown]);

  const applicationsOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 24, bottom: 48 },
    xAxis: { type: 'category', data: applications?.map((d) => d.month) ?? [], axisLabel: { rotate: 45 } },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: applications?.map((d) => d.count) ?? [], smooth: true }],
  }), [applications]);

  const areaDistributionOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 24, bottom: 32 },
    xAxis: { type: 'category', data: areaDistribution?.map((d) => `${d.bucket} m²`) ?? [] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: areaDistribution?.map((d) => d.count) ?? [] }],
  }), [areaDistribution]);

  return (
    <>
      <nav className="filters-nav" ref={navRef}>
        <div className="filters-nav__inner">
          <span className="filters-nav__title-slot">
            <span className={`filters-nav__title filters-nav__title--default${showNavTitle ? '' : ' is-visible'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Set Global Filters:
            </span>
            <span className={`filters-nav__title filters-nav__title--scroll${showNavTitle ? ' is-visible' : ''}`}>
              Cadastre data overview
            </span>
          </span>
          <Input htmlType="date" label="From" value={dateFrom} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)} />
          <Input htmlType="date" label="To" value={dateTo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)} />
          <Select width="220px" value={usageType || ALL} onChange={(v: string) => setUsageType(v === ALL ? '' : v)} getPopupContainer={() => navRef.current}>
            <Select.Option value={ALL}>All land usage types</Select.Option>
            {USAGE_TYPES.map((type) => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
          <Select width="220px" value={classification || ALL} onChange={(v: string) => setClassification(v === ALL ? '' : v)} getPopupContainer={() => navRef.current}>
            <Select.Option value={ALL}>All citizen application types</Select.Option>
            {CLASSIFICATIONS.map((type) => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
        </div>
      </nav>

      <Page>
        <div ref={headingRef}>
          <Text h2>Cadastre data overview</Text>
        </div>
        <Text p type="secondary">
          Aggregated statistics across the national cadastre dataset. Filters apply only to the charts they're relevant to.
        </Text>

        <Grid.Container gap={2}>
          <Grid xs={24} md={12}>
            <ChartCard title="Buildings by construction year" loading={!buildYears} empty={buildYears?.length === 0}>
              <Chart option={buildYearsOption} />
            </ChartCard>
          </Grid>
          <Grid xs={24} md={12}>
            <ChartCard title="Properties by municipality" loading={!municipalities} empty={municipalities?.length === 0}>
              <Chart option={municipalitiesOption} />
            </ChartCard>
          </Grid>
          <Grid xs={24} md={8}>
            <ChartCard title="Land usage breakdown" loading={!usageBreakdown} empty={usageBreakdown?.length === 0}>
              <Chart option={usageBreakdownOption} />
            </ChartCard>
          </Grid>
          <Grid xs={24} md={16}>
            <ChartCard title="Citizen applications over time" loading={!applications} empty={applications?.length === 0}>
              <Chart option={applicationsOption} />
            </ChartCard>
          </Grid>
          <Grid xs={24}>
            <ChartCard title="Parcel area distribution" loading={!areaDistribution} empty={areaDistribution?.length === 0}>
              <Chart option={areaDistributionOption} />
            </ChartCard>
          </Grid>
        </Grid.Container>
        <Spacer h={2} />
      </Page>
    </>
  );
}
