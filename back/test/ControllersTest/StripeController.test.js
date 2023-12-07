jest.mock('stripe', () => {
    const stripeMock = {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com', id: 'session1' }),
        },
      },
      paymentIntents: {
        create: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com', id: 'session1' }),
      },
    };
  
    return () => stripeMock;
  });
  
  jest.mock('../../src/Models/', () => ({
    Order: { create: jest.fn() },
    Product: { findByPk: jest.fn() },
    ProductOrder: { create: jest.fn() },
    Payment: { create: jest.fn() },
  }));
  

  
  const { initPayment } = require('../../src/Controllers/stripeController');
  const { Order, Product, ProductOrder, Payment } = require('../../src/Models/');
  
  describe('initPayment', () => {
    it('should create a new order and payment', async () => {

        const req = {
            body: {
            TTC: 100,
            city: 'Paris',
            zip: '75001',
            phone: '0123456789',
            address: '1 rue du test',
            items: [
                {
                id: 1,
                quantity: 1,
                },
            ],
            },
            user: {
            id: 1,
            email: 'test@test.com',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();

        const order = {
            id: 1,
            TTC: 100,
            city: 'Paris',
            zip: '75001',
            phone: '0123456789',
            address: '1 rue du test',
            UserId: 1,
            email: 'test@test.com',
        };

        const product = {
            id: 1,
            name: 'Test product',
            price: 100,
            isPublished: true,
        };

        const productOrder = {
            id: 1,
            quantity: 1,
            ProductId: 1,
            OrderId: 1,
        };

        const payment = {
            id: 1,
            amount: 100,
            OrderId: 1,
        };

        Order.create.mockResolvedValue(order);
        Product.findByPk.mockResolvedValue(product);
        ProductOrder.create.mockResolvedValue(productOrder);
        Payment.create.mockResolvedValue(payment);

        await initPayment(req, res, next);

        expect(Order.create).toHaveBeenCalledWith({
            id: expect.any(String),
            TTC: 100,
            city: 'Paris',
            zip: '75001',
            phone: '0123456789',
            address: '1 rue du test',
            UserId: 1,
            email: 'test@test.com',
        });

        expect(Product.findByPk).toHaveBeenCalledWith(1, {});


    });
  });
  