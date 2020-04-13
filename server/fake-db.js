// const Rental = require('./models/rental');
// const User = require('./models/user');
// const Booking = require('./models/booking');
// const Payment = require('./models/payment');
// const Review = require('./models/review');

const fakeDbData = require('./data.json'),
      Product = require('./models/product'),
      User = require('./models/user')


class FakeDb{
    constructor(){
        this.products = fakeDbData.products;

        this.user = fakeDbData.users;
    }

    async cleanDb(){
        await User.remove({});
        // await Rental.remove({});
        // await Booking.remove({});
        // await Payment.remove({});
        // await Review.remove({});
        await Product.remove({});
    }


    pushDataToDb(){
         const user = new User(this.user[0]);
         const user2 = new User(this.user[1]);
        
        this.products.forEach((product) => {
            const newProduct = new Product(product);
            newProduct.user = user;

          user.product.push(newProduct);
            newProduct.save();
        });
        user.save();
        user2.save();
    }

    async seedDb(){
        await this.cleanDb();
        this.pushDataToDb();
    }
}

module.exports = FakeDb;