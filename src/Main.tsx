import { useEffect, useRef } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import LoadingModal from "@component/loading/LoadingModal";
import LoadingManager from "@component/loading/LoadingManager";
import NetworkErrorModal from "@component/modal/NetworkErrorModal";
import NetworkErrorManager from "@component/network/NetworkErrorManager";
import SnackBarModal from "@component/alert/SnackBarModal";
import SnackBarManager from "@component/alert/SnackBarManager";
import AdvertisementsPage from "./StatusBadge";

const NavigationSetter = () => {
  const nav = useNavigate();
  useEffect(() => {
    // NavigationService.setNavigator(nav);
  }, [nav]);
  return null;
};

const MainNavigator = () => {
  const networkErrorRef = useRef<NetworkErrorModal>(null);
  const snackBarRef: any = useRef(null);

  const loadingRef = useRef<any>(null);

  useEffect(() => {
    loadingRef && LoadingManager.register(loadingRef);
    networkErrorRef && NetworkErrorManager.register(networkErrorRef);
    snackBarRef && SnackBarManager.register(snackBarRef);
    return () => {
      LoadingManager.unregister(loadingRef);
      NetworkErrorManager.unregister(networkErrorRef);
      SnackBarManager.unregister(snackBarRef);
    };
  }, []);

  return (
    <Router>
      <NavigationSetter />
      <SnackBarModal ref={snackBarRef} />
      <LoadingModal ref={loadingRef} />
      <NetworkErrorModal ref={networkErrorRef} />
      <Routes>
        <Route path="/" element={<AdvertisementsPage />} />
      </Routes>
    </Router>
  );
};

export default MainNavigator;

