const nodemailer = require('nodemailer');


let sendMailMock;
let originalEnv;

beforeAll(() => {
  originalEnv = process.env;
  process.env = { ...originalEnv, MAIL_USER: 'opc@gmail.com' };
});

afterAll(() => {
  process.env = originalEnv;
});
jest.mock('../../src/Controllers/mailController', () => {
    const originalModule = jest.requireActual('../../src/Controllers/mailController');
    return {
      ...originalModule,
      sendMail: (mail, subject, attachments, content) => {
        return originalModule.sendMail(mail, subject, attachments, content, 'opc@gmail.com');
      },
    };
  });
const { sendMail, sendNotification } = require('../../src/Controllers/mailController');

jest.mock('nodemailer', () => {
    const sendMailMock = jest.fn((mailOptions, callback) => callback(null, true));
    return {
      createTransport: jest.fn(() => ({
        sendMail: (mailOptions, callback) => {
          mailOptions.from = 'opc@gmail.com';
          sendMailMock(mailOptions, callback);
        },
      })),
      sendMailMock, 
    };
  });

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(() => Promise.resolve('Hello, {{content}}')),
  },
}));

describe('mailController', () => {
  beforeEach(() => {
    sendMailMock = nodemailer.sendMailMock; 
  });

  it('should send an email', async () => {
    const mailOptions = {
      to: 'masiviady7@gmail.com',
      subject: 'Test',
      html: 'Hello, {{content}}',
      attachments: [],
    };
    const content = '{{content}}';
    const mail = 'masiviady7@gmail.com';
    const subject = 'Test';
  
    const result = await sendMail(mail, subject, null, content);
  
    expect(result).toEqual({ success: true, message: 'E-mail envoyé' });
  
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  
    expect(sendMailMock).toHaveBeenCalledWith({ ...mailOptions, from: 'opc@gmail.com' }, expect.any(Function));
  });
});