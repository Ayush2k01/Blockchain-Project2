const manager = require('../manager');
const commonManager = manager.commonManager;
const ownerOp = require('../chainop/ownerOp');
const ownerController = {
  addProduct: async function (req, res, next) {
    try {
      if (!req.body) {
        throw new Error('Nothing in request object');
      }

      const {values}  = req.body;
      console.log(values);
      const email = req.email
      console.log(email);
      if (!email || !values) {
        // console.log(email);
        console.log(values);
        throw new Error('Details incomplete');
      }

      const privateKey = await commonManager.getPrivateKeyByEmail(email, 'owner');
      await ownerOp.addProduct(values, privateKey);
      console.log('product added');
      res.send('Product added successfully');
    } catch (error) {
      return next(error);
    }
  },
  unblockSeller: async function (req, res, next) {
    try {
      if (!req.body) {
        throw new Error('Nothing in request object');
      }

      const { sellerAddress, email } = req.body;

      if (!sellerAddress || !email) {
        throw new Error('Details incomplete');
      }

      const privateKey = commonManager.getPrivateKeyByEmail(email, 'owner');
      await ownerOp.unblockSeller(sellerAddress, privateKey);
      res.send('Seller unblocked successfully');
    } catch (error) {
      return next(error);
    }
  },
  async transferOwnership(req, res, next) {
    try {
      return res.send('FUNCTION not ready yet');
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Failed to transfer ownership');
    }
  },
  async addOwner(req,res,next){
    try{
      if (!req.body) {
        throw new Error('Nothing in request object');
      }

      const { email } = req.body;
      const currentOwner = req.email

      if (!email || ! currentOwner) {
        throw new Error('Details incomplete');
      }

      const seller = await commonManager.checkSeller(email, 'seller');
      const ownerPrivateKey = commonManager.getPrivateKeyByEmail(currentOwner, 'owner');
      // console.log(seller);
      // console.log(ownerPrivateKey);
      //so seller is registered next step to make him owner
      await commonManager.updateDetails({type:'owner'},email)


      await ownerOp.transferOwner(seller.privateKey,ownerPrivateKey)
      
    }
    catch (error){
      console.log(error.message);
      return res.status(500).send('Failed to add owner');
    }
  }
};

module.exports = ownerController;
