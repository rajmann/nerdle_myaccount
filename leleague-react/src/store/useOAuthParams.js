import create from "zustand";

const useOAuthParams = create((set) => ({
  clientID: null,
  returnURI: null,
  setOAuthParams: (clientID, returnURI) => set(() => ({ clientID, returnURI })),
  clearOAuthParams: () => set(() => ({ clientID: null, returnURI: null })),
}));

export default useOAuthParams;