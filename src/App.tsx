import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import routes from './routes';

import { PageLoaderProvider } from './contexts/PageLoaderContext';
import { AuthProvider } from './contexts/AuthContext';

import PageTitle from './components/PageTitle';

import DefaultLayout from './layout/DefaultLayout';
import PageNotFound from './pages/Errors/PageNotFound';

import SignIn from './pages/Authentication/SignIn';
import SaleInvoiceDocument from './pages/Transaction/prints/SaleInvoiceDocument';
import DeliveryNoteDocument from './pages/Transaction/prints/DeliveryNoteDocument';

const App: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <PageLoaderProvider>
      <AuthProvider>
        <Routes>
          <Route
            path={'/'}
            element={<DefaultLayout />}
          >
            {routes.map((route, idx) => {
              return (
                <Route
                  key={`app-route-item-${idx}`}
                  {...route.index && { index: route.index }}
                  path={route.path}
                  element={
                    <>
                      <PageTitle title={route.title} />
                      {route.element}
                    </>
                  }
                />
              )
            })}
          </Route>
          <Route
            path={'/transaction/sale-invoice/print/:transaction_id'}
            element={<SaleInvoiceDocument />}
          />
          <Route
            path={'/transaction/delivery-note/print'}
            element={<DeliveryNoteDocument />}
          />
          <Route
            path={'/auth/sign-in'}
            element={<SignIn />}
          />
          <Route
            path={'*'}
            element={<PageNotFound />}
          />
        </Routes>
      </AuthProvider>
    </PageLoaderProvider>
  );
};

export default App;
