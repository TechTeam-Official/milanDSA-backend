export const passService = {

  async processPost(payload: unknown) {
    /**
     * Business logic for pass POST
     */
    return {
      module: "pass",
      action: "POST",
      status: "success",
      payload,
    };
  },

  async processGet(query: unknown) {
    /**
     * Business logic for pass GET
     */
    return {
      module: "pass",
      action: "GET",
      status: "success",
      query,
    };
  },

};
