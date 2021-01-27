export default class ExpressRouterAdapter {
  static adapt = router => async (req, res) => {
    const httpRequest = {
      token: (req.get('authorization')) ? req.get('authorization').substr(7) : null,
      query: req.query,
      params: req.params,
      body: req.body
    }

    router(httpRequest)
      .then((httpResponse) => res
        .status(httpResponse.statusCode)
        .json(httpResponse.body))
  }
}
