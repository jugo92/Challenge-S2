const OrderStatus = require("../Enum/orderStatus");
const PaymentStatus = require("../Enum/paymentStatus");
const { generateDataFacture } = require("../Helper/Utils");
const {
  Tva,
  Order,
  Product,
  ProductOrder,
  Payment,
  Invoice,
} = require("../Models/");
const { uuidv7 } = require("uuidv7");
const PdfService = require("../Services/pdfService");

module.exports.initPayment = async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

    const storeItems = new Map([]);

    const order = await Order.create({
      id: uuidv7(),
      HT: req.body.HT,
      deliveryAddress: req.body.deliveryAddress,
      deliveryType: req.body.deliveryType,
      UserId: req.user.id,
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
      client_reference_id: order.id,
    });

    const payment = await Payment.create({
      id: uuidv7(),
      session_stripe_id: session.id,
      currency: "EUR",
      OrderId: order.id,
      UserId: req.user.id,
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

module.exports.getEventPayment = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

  let signingkey =
    "whsec_5f2b38115e8a5de5ea0b95d872511de0352af0372fb4a1d8489c03be91eb4659";
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, signingkey);
  } catch (error) {
    res.status(400).json({ success: false });
    return;
  }
  console.log("HEREEEEEE")

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session)
    const orderId = session.client_reference_id;
    const email = session.customer_details.email;

    const invoice = await Invoice.create({
      id: uuidv7(),
      path: `invoice_${orderId}.pdf`,
      OrderId: orderId,
    });

    await Payment.update(
      { status: PaymentStatus.Succeeded, payment_stripe_id: session.payment_intent },
      { where: { OrderId: orderId }, individualHooks: true }
    );

    await Order.update(
      { state: OrderStatus.VALIDATE, email: email, InvoiceId: invoice.id },
      { where: { id: orderId }, individualHooks: true }
    );

    const getDataFacture = await generateDataFacture(orderId);
    const pdfService = new PdfService(getDataFacture);
    await pdfService.invoicePdf();
  }else if(event.type === "charge.refunded"){
    const session = event.data.object;
    //ici on à la confirmation du succes de remboursement il faut adapter les tables
    //
    console.log(session);
  }else{
    console.log(event.type)
  }
  res.json({
    success: true,
  });
}

module.exports.refundPayment = async (req, res) => {
    try {
      const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
      const refund = await stripe.refunds.create({
        payment_intent: req.body.payment_intent,
        amount: req.body.amount
      });
      res.status(200).json({ refund });
  }catch (e) {
    res.status(500).json({ error: e.message });
  }
}
