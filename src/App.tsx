import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import News from './pages/News';
import About from './pages/About';
import History from './pages/History';
import CityOfficials from './pages/CityOfficials';
import ProvincialOfficialProfile from './pages/ProvincialOfficialProfile';
import Contact from './pages/Contact';
import Hotlines from './pages/Hotlines';
import Barangays from './pages/Barangays';
import Procurements from './pages/Procurements';
import FloodControl from './pages/FloodControl';
import RegionalDirectory from './pages/RegionalDirectory';
import Tourism from './pages/Tourism';
import Transparency from './pages/Transparency';
import CitizensCharter from './pages/CitizensCharter';
import Sources from './pages/Sources';
import Search from './pages/Search';
import { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Statistics pages are lazy-loaded so the recharts charting library stays out
// of the initial bundle and only loads when a visitor opens a statistics page.
const Demographics = lazy(() => import('./pages/statistics/Demographics'));
const Competitiveness = lazy(
  () => import('./pages/statistics/Competitiveness')
);
const MunicipalIncome = lazy(
  () => import('./pages/statistics/MunicipalIncome')
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/history" element={<History />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/hotlines" element={<Hotlines />} />
              <Route path="/barangays" element={<Barangays />} />
              <Route path="/procurements" element={<Procurements />} />
              <Route path="/flood-control" element={<FloodControl />} />
              <Route
                path="/regional-directory"
                element={<RegionalDirectory />}
              />
              <Route path="/tourism" element={<Tourism />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/citizens-charter" element={<CitizensCharter />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/provincial-officials"
                element={<Navigate to="/government/city-officials" replace />}
              />
              <Route
                path="/provincial-officials/:slug"
                element={<ProvincialOfficialProfile />}
              />
              <Route
                path="/statistics"
                element={
                  <Suspense fallback={<div className="min-h-screen" />}>
                    <Demographics />
                  </Suspense>
                }
              />
              <Route
                path="/statistics/competitiveness"
                element={
                  <Suspense fallback={<div className="min-h-screen" />}>
                    <Competitiveness />
                  </Suspense>
                }
              />
              <Route
                path="/statistics/municipal-income"
                element={
                  <Suspense fallback={<div className="min-h-screen" />}>
                    <MunicipalIncome />
                  </Suspense>
                }
              />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/services" element={<Services />} />
              <Route
                path="/services/:category/:documentSlug"
                element={<Document categoryType="service" />}
              />
              <Route path="/government/news" element={<News />} />
              <Route
                path="/government/city-officials"
                element={<CityOfficials />}
              />
              <Route
                path="/government/transparency-documents"
                element={<Navigate to="/transparency" replace />}
              />
              <Route path="/government/:category" element={<Government />} />
              <Route path="/government" element={<Government />} />
              <Route
                path="/government/:category/:documentSlug"
                element={<Document categoryType="government" />}
              />
              <Route path="/:lang/:documentSlug" element={<Document />} />
              <Route path="/:documentSlug" element={<Document />} />
            </Routes>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
