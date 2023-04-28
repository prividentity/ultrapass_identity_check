const config = {
  clientConfig: {
    successUrl: window.location.origin,
    failureUrl: window.location.origin,
    type: "IDENTITY",
    productGroupId: "intergalactic",
    customizations:{
      skin:"primary"
    }
  },
};

export default config;
