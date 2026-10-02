import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import {
  AuthProvider,
  MessagingProvider,
  FavoritesProvider,
  RecentlyViewedProvider,
  SavedSearchProvider,
  ReviewsProvider,
  InquiryProvider,
} from './context';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <MessagingProvider>
            <InquiryProvider>
              <FavoritesProvider>
                <RecentlyViewedProvider>
                  <SavedSearchProvider>
                    <ReviewsProvider>
                      <AppRoutes />
                    </ReviewsProvider>
                  </SavedSearchProvider>
                </RecentlyViewedProvider>
              </FavoritesProvider>
            </InquiryProvider>
          </MessagingProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
