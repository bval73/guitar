// const Rental = require('./models/rental');
// const User = require('./models/user');
// const Booking = require('./models/booking');
// const Payment = require('./models/payment');
// const Review = require('./models/review');

const Brand = require('./models/brand');

const fakeDbData = require('./data.json')

class FakeDb{
    constructor(){
        this.brands = fakeDbData.brands;

//        this.user = fakeDbData.users;
    }

    async cleanDb(){
        // await User.remove({});
        // await Rental.remove({});
        // await Booking.remove({});
        // await Payment.remove({});
        // await Review.remove({});
    }

    pushDataToDb(){
        // const user = new User(this.user[0]);
        // const user2 = new User(this.user[1]);
        
        this.brands.forEach((rental) => {
            const newBrand = new Rental(rental);
//            newRental.user = user;

  //          user.rentals.push(newRental);
            newBrand.save();
        });
        // user.save();
        // user2.save();
    }

    async seedDb(){
//        await this.cleanDb();
        this.pushDataToDb();
    }
}

module.exports = FakeDb;