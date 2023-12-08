const {
  Order,
  Product,
  ProductOrder,
  Payment,
  User,
  Basket,
  ProductBasket,
} = require("../Models/");
const { uuidv7 } = require("uuidv7");
const ValidationError = require("../errors/ValidationError");

module.exports.initPayment = async (req, res, next) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

    const storeItems = [];
    // const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const user = await User.findOne({ where: { id: req.user.id } });
    console.log(user);
    const basket = await Basket.findByPk(req.body.BasketId);
    // if (!basket || basket.createdAt < fifteenMinutesAgo) {
    //   return next(
    //     new ValidationError({
    //       basket: "Panier expire.",
    //     })
    //   );
    // }
    const productsBaskets = await ProductBasket.findAll({
      where: {
        BasketId: req.body.BasketId,
      },
    });
    console.log(user.dataValues.email);
    const order = await Order.create({
      id: uuidv7(),
      TTC: 0,
      city: user.city,
      zip: user.zip,
      phone: user.phone,
      address: user.address,
      UserId: req.user.id,
      email: user.email,
    });

    await Promise.all(
      productsBaskets.map(async item => {
        const product = await Product.findByPk(item.ProductId, {});
        if (!product.isPublished) {
          return next(
            new ValidationError({
              accountLocked: "Produit non publie.",
            })
          );
        }
        await ProductOrder.create({
          id: uuidv7(),
          quantity: item.quantity,
          ProductId: product.id,
          OrderId: order.id,
        });

        storeItems.push({
          priceInCents: product.price * 100 + product.price * 100 * 0.2,
          name: product.name,
          quantity: item.quantity,
        });
      })
    );
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: storeItems.map(item => {
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
            },
            unit_amount: item.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/failed`,
      client_reference_id: order.id,
    });

    const payment = await Payment.create({
      id: uuidv7(),
      session_stripe_id: session.id,
      currency: "EUR",
      OrderId: order.id,
      UserId: req.user.id,
      amount: req.body.TTC,
    });

    await Order.update(
      { PaymentId: payment.id },
      { where: { id: order.id }, individualHooks: true }
    );

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
