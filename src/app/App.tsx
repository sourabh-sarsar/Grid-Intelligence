import React, { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TopNavBar } from './components/layout/TopNavBar';
import { SideNav } from './components/layout/SideNav';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { GenericPage } from './pages/GenericPage';
import { ConsumersPage } from './pages/ConsumersPage';
import { AssetsPage } from './pages/AssetsPage';
import { RevenuePage } from './pages/RevenuePage';
import { LoadPage } from './pages/LoadPage';
import { ForecastPage } from './pages/ForecastPage';
import { StudiesPage } from './pages/StudiesPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';
import { GridExplorerPage } from './pages/GridExplorerPage';
import { IAPage } from './pages/IAPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { Toaster } from 'sonner';

const PAGE_CONFIGS: Record<string, { title: string; subtitle: string; icon: string }> = {
  consumers: { title: 'Consumer Management', subtitle: 'Manage residential, commercial, agricultural and industrial consumers', icon: '👥' },
  assets: { title: 'Grid Assets', subtitle: 'Transformers, substations, feeders and smart meters', icon: '⚡' },
  load: { title: 'Load Monitoring', subtitle: 'Real-time load analysis and demand tracking', icon: '📊' },
  revenue: { title: 'Revenue Analytics', subtitle: 'Billing, collections and revenue insights', icon: '💰' },
  forecast: { title: 'Forecasting', subtitle: 'AI-powered demand forecasting and load prediction', icon: '🔮' },
  studies: { title: 'Studies & Simulations', subtitle: 'Power flow analysis and engineering simulations', icon: '🧪' },
  alerts: { title: 'Alerts & Faults', subtitle: 'System alerts, fault management and incident tracking', icon: '🚨' },
  reports: { title: 'Reports', subtitle: 'Comprehensive reports and data exports', icon: '📄' },
};

function AppInner() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [navMode, setNavMode] = useState<'side' | 'top'>('side');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { settings } = useTheme();

  const navBg = settings.darkMode ? '#141414' : '#f0f4ff';
  const topBarBg = settings.darkMode ? '#141414' : '#ffffff';
  const outerBg = settings.darkMode ? '#0a0a0a' : '#e8effc';
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(21,101,192,0.1)';

  const EXPANDED_WIDTH = 220;
  const COLLAPSED_WIDTH = 64;
  const sideNavWidth = sideNavCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  // MotionConfig: pass a reduced/disabled transition when motion ≠ 'full'
  const motionTransition =
    settings.motion === 'none'
      ? { duration: 0 }
      : settings.motion === 'reduced'
      ? { duration: 0.12, ease: 'easeOut' }
      : undefined;

  const renderContent = () => {
    if (activePage === 'dashboard')     return <Dashboard onNavigate={setActivePage} />;
    if (activePage === 'settings')      return <Settings />;
    if (activePage === 'consumers')     return <ConsumersPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'assets')        return <AssetsPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'revenue')       return <RevenuePage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'load')          return <LoadPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'forecast')      return <ForecastPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'studies')       return <StudiesPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'alerts')        return <AlertsPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'reports')       return <ReportsPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'grid-explorer') return <GridExplorerPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'ia-map')        return <IAPage onBack={() => setActivePage('dashboard')} />;
    if (activePage === 'thankyou')      return <ThankYouPage />;
    const config = PAGE_CONFIGS[activePage];
    if (config) return <GenericPage {...config} />;
    return <Dashboard onNavigate={setActivePage} />;
  };

  return (
    <MotionConfig transition={motionTransition}>
      <Toaster
        position="bottom-right"
        richColors
        theme={settings.darkMode ? 'dark' : 'light'}
      />

      {/* ── Login gate ── */}
      <AnimatePresence>
        {!isLoggedIn && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          >
            <LoginPage onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="w-screen h-screen overflow-hidden"
        style={{
          background: outerBg,
          fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
          display: 'grid',
          gridTemplateColumns: navMode === 'top' ? '0px 1fr' : `${sideNavWidth}px 1fr`,
          gridTemplateRows: '56px 1fr',
          rowGap: '6px',
          columnGap: navMode === 'top' ? '0' : '6px',
          padding: '6px',
          transition: 'grid-template-columns 0.35s cubic-bezier(0.4, 0, 0.2, 1), column-gap 0.35s ease',
        }}
      >
        {/* TOP NAV BAR - spans full width */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            gridColumn: '1 / -1',
            gridRow: '1',
            background: topBarBg,
            borderRadius: '20px',
            border: `1px solid ${borderColor}`,
            boxShadow: settings.darkMode ? 'none' : '0 2px 16px rgba(21,101,192,0.08)',
            overflow: 'visible',
          }}
        >
          <TopNavBar
            onNavigate={setActivePage}
            onToggleSideNav={() => setSideNavCollapsed(prev => !prev)}
            sideNavCollapsed={sideNavCollapsed}
            navMode={navMode}
            onNavModeChange={setNavMode}
            activePage={activePage}
            onLogout={() => {
              setIsLoggedIn(false);
              setActivePage('dashboard');
            }}
          />
        </motion.div>

        {/* SIDE NAV — hidden when navMode === 'top' */}
        <AnimatePresence>
          {navMode === 'side' && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              style={{
                gridColumn: '1',
                gridRow: '2',
                background: navBg,
                borderRadius: '20px',
                border: `1px solid ${borderColor}`,
                overflow: 'hidden',
              }}
            >
              <SideNav
                activePage={activePage}
                onNavigate={setActivePage}
                collapsed={sideNavCollapsed}
                onToggle={() => setSideNavCollapsed(prev => !prev)}
                navMode={navMode}
                onNavModeChange={setNavMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{
            gridColumn: '2',
            gridRow: '2',
            borderRadius: '20px',
            border: `1px solid ${borderColor}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}