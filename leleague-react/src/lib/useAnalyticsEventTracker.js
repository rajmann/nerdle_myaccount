import ReactGA from "react-ga4";

const useAnalyticsEventTracker = (category) => {
  const eventTracker = (action) => {
    ReactGA.event({category, action});
  }
  return eventTracker;
}
export default useAnalyticsEventTracker;