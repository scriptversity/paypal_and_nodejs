const axios = require("axios");

async function generateAccessToken() {
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
  });

  return response.data.access_token;

  // alternatively
  // const response = await axios.post(
  //   process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
  //   "grant_type=client_credentials",
  //   {
  //     auth: {
  //       username: process.env.PAYPAL_CLIENT_ID,
  //       password: process.env.PAYPAL_CLIENT_SECRET,
  //     },
  //   }
  // );

  // return response.data.access_token;
}

exports.createOrder = async () => {
  const accessToken = await generateAccessToken();

  // const response = await axios.post(
  //   process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
  //   {
  //     intent: "CAPTURE",
  //     purchase_units: [
  //       {
  //         amount: {
  //           currency_code: "USD",
  //           value: "100.00",
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   }
  // );

  // return response.data.links[1].href;

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: [
            {
              name: "Node.js Complete Course",
              description: "Node.js Complete Course with Express and MongoDB",
              unit_amount: {
                currency_code: "USD",
                value: "100.00",
              },
              quantity: "1",
            },
          ],
          amount: {
            currency_code: "USD",
            value: "100.00",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "100.00",
              },
            },
          },
        },
      ],

      application_context: {
        return_url: process.env.BASE_URL + "/complete-order",
        cancel_url: process.env.BASE_URL + "/cancel-order",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "manfra.io",
      },
    }),
  });
  console.log(response.data);
};

this.createOrder();
