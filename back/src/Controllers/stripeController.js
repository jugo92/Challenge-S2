const OrderStatus = require("../Enum/orderStatus");
const PaymentStatus = require("../Enum/paymentStatus");
const { generateDataFacture } = require("../Helper/Utils");
const {
  Order,
  Product,
  ProductOrder,
  Payment,
  Invoice,
  User
} = require("../Models/");
const { uuidv7 } = require("uuidv7");
const PdfService = require("../Services/pdfService");
const { sendMail } = require("../Controllers/mailController");

module.exports.initPayment = async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

    const storeItems = new Map([]);

    const order = await Order.create({
      id: uuidv7(),
      TTC: req.body.TTC,
      city: req.body.city,
      zip: req.body.zip,
      phone: req.body.phone,
      address: req.body.address,
      UserId: req.user.id,
      email: req.user.email,
    });

    await Promise.all(
      req.body.items.map(async item => {
        const product = await Product.findByPk(item.id, {});

        await ProductOrder.create({
          id: uuidv7(),
          quantity: item.quantity,
          ProductId: item.id,
          OrderId: order.id,
        });

        storeItems.set(product.dataValues.id, {
          priceInCents:
            product.dataValues.price * 100 +
            product.dataValues.price * 100 * (product.dataValues.tva / 100),
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
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.client_reference_id;
    const order = await Order.findByPk(orderId);

    const user = await User.findOne({
      where: {
        email: order.email
      }
    })

    const invoice = await Invoice.create({
      id: uuidv7(),
      path: `invoice_${orderId}.pdf`,
      OrderId: orderId,
    });

    await Payment.update(
      {
        status: PaymentStatus.Succeeded,
        payment_stripe_id: session.payment_intent,
      },
      { where: { OrderId: orderId }, individualHooks: true }
    );

    const bodySendcloud = {
      parcel: {
        name:"parcel",
        address: order.dataValues.address,
        city: order.dataValues.city,
        country: "FR",
        postal_code: order.dataValues.zip,
        shipment: {
          id: 8,
          name: "unstamped letter",
        },
        request_label: true,
      },
    };
    const authHeader =
      "Basic " +
      Buffer.from(
        process.env.SENDCLOUD_API_USERNAME +
          ":" +
          process.env.SENDCLOUD_API_PASSWORD
      ).toString("base64");
    await fetch(process.env.SENDCLOUD_API + "parcels", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodySendcloud),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        await Order.update(
          {
            state: OrderStatus.VALIDATE,
            InvoiceId: invoice.id,
            tracking_url: data.parcel.tracking_url,
          },
          { where: { id: orderId }, individualHooks: true }
        );
      });

    const getDataFacture = await generateDataFacture(orderId);
    const pdfService = new PdfService(getDataFacture);
    await pdfService.invoicePdf();

    //sendMail with invoice
    console.log("le user : ", req.user);
    await sendMail(
      user,
      "validateOrder",
      "Votre facture",
      "./invoice/invoice_" + orderId + ".pdf"
    );
  }
  res.json({
    success: true,
  });
};

module.exports.refundPayment = async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
    const refund = await stripe.refunds.create({
      payment_intent: req.body.payment_intent,
      amount: req.body.amount,
    });
    res.status(200).json({ refund });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
