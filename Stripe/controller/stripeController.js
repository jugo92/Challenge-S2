const Product = require("../../Product/dbProduct");
const Order = require("../../Order/dbOrder");
const ProductOrder = require("../../Order/dbProductOrder");
const OrderStatus = require("../../Order/orderStatus");

module.exports.initPayment = async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

    //check if product are availables
    const storeItems = new Map([]);

    const order = await Order.create({
      HT: 1,
      deliveryAddress: "Rue de Paris",
      deliveryType: "Domicile",
      idTVA: 1,
      email: req.body.email,
    });

    await Promise.all(
      req.body.items.map(async item => {
        const product = await Product.findByPk(item.id);
        storeItems.set(product.dataValues.id, {
          priceInCents: product.dataValues.prix,
          name: product.dataValues.nom,
        });
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id);
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
      client_reference_id: JSON.stringify({
        orderId: order.id,
        items: req.body.items,
      }),
    });
    console.log(session);
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
    const session = event.data.object;
    const detailsOrder = JSON.parse(session.client_reference_id);
    const email = session.customer_details.email;

    await Order.update(
      { state: OrderStatus.VALIDATE },
      { where: { id: detailsOrder.orderId } }
    );

    await Promise.all(
      detailsOrder.items.map(async item => {
        await ProductOrder.create({
          email: email,
          idProduct: item.id,
          idOrder: detailsOrder.orderId,
        });
      })
    );

    console.log(`Details commande : ${detailsOrder}`);
  }
  res.json({
    success: true,
  });
};
