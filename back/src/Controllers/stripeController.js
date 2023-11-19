// const Order = require("../Models/dbOrder");
const OrderStatus = require("../Enum/orderStatus");
const { Tva, Order, Product, ProductOrder } = require("../Models/");
const { uuidv7 } = require("uuidv7");

module.exports.initPayment = async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

    const storeItems = new Map([]);

    const tva = await Tva.findAll({});
    const order = await Order.create({
      id: uuidv7(),
      HT: 1,
      deliveryAddress: req.body.deliveryAddress,
      deliveryType: req.body.deliveryType,
      TvaId: tva[0].dataValues.id,
      UserId: "018be7e8-cf53-7b0d-920a-c8701b350619",
      email: "",
    });

    await Promise.all(
      req.body.items.map(async item => {
        const product = await Product.findByPk(item.id, {
          include: [
            {
              model: Tva,
            },
          ],
        });

        await ProductOrder.create({
          id: uuidv7(),
          quantity: item.quantity,
          ProductId: item.id,
          OrderId: order.id,
          version: 1,
        });

        storeItems.set(product.dataValues.id, {
          priceInCents:
            product.dataValues.price * 100 +
            product.dataValues.price *
              100 *
              (product.dataValues.Tva.dataValues.rate / 100),
          name: product.dataValues.name,
        });
      })
    );

    console.log("ICIIIII : ", storeItems);
    console.log(order.id);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id);
        console.log("STORE ITEM FIND  : ", storeItem);
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/failed`,
      client_reference_id: order.id,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports.getEventPayment = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  let signingkey =
    "whsec_3ba2e17763269bf829ddd31b54250017b17bb6c63f4ceec54d8c39aaae9318fb";
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, signingkey);
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
    return;
  }

  if (event.type === "checkout.session.completed") {
    console.log("SUUUUUUUUUUUUUUUUUUUUUUCESSSSSSSSSSSSSSSS");
    const session = event.data.object;
    const orderId = session.client_reference_id;
    const email = session.customer_details.email;

    await Order.update(
      { state: OrderStatus.VALIDATE, email: email },
      { where: { id: orderId }, individualHooks: true }
    );
  }
  res.json({
    success: true,
  });
};
