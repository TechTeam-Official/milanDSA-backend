export const webhookService = {

  async processPost(payload: unknown) {
    /**
     * Business logic for webhook POST
     */
    return {
      module: "webhook",
      action: "POST",
      status: "success",
      payload,
    };
  },

  async processGet(query: unknown) {
    /**
     * Business logic for webhook GET
     */
    return {
      module: "webhook",
      action: "GET",
      status: "success",
      query,
    };
  },

};
