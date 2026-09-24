import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
nProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
});

const RouteProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    // Start progress bar on location change
    nProgress.start();

    // Finish progress bar after a short delay to simulate page load
    const timer = setTimeout(() => {
      nProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      nProgress.done();
    };
  }, [location]);

  return null;
};

export default RouteProgressBar;
