# API contract conventions (shared by all OpenAPI files)
Success `{data}`; lists `{data:[], meta:{page,limit,total}}`; errors `{error:{code,message,details[]}}`.
Money = integer minor units. Ids = UUID. Header `x-request-id` is echoed/generated. Protected routes: `Authorization: Bearer <accessToken>`.
Specs: [auth](auth.openapi.yaml) (implemented) · [catalog](catalog.openapi.yaml) · [cart](cart.openapi.yaml) · [order](order.openapi.yaml) (contracts; implemented on their days).
