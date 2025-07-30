import create from "zustand";

const useOAuthParamsStore = create((set) => ({
  clientID: null,
  redirectURI: null,
  setOAuthParams: (clientID, redirectURI) => set(() => ({ clientID, redirectURI })),
  clearOAuthParams: () => set(() => ({ clientID: null, redirectURI: null })),
}));

export default useOAuthParamsStore;