const userController = require("../controller/userController");
const User = require("../dbUser"); 

describe("User Controller Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all users from the database", async () => {
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  
    await userController.getAllUsers(req, res);
    
  
    console.log(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ users: expect.arrayContaining() });
  });
  
});
