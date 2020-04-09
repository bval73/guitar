const express = require('express'),
      bodyParser = require('body-parser'),
      config = require('./config'),
      mongoose = require('mongoose'),
//      FakeDb = require('./fake-db'),
      cookieParser = require('cookie-parser');

const app = express();
require('dotenv').config();

mongoose.Promise = global.Promise;
//mongoose.connect(config.DB_URI);

mongoose.connect(config.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//              Models
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');

//Middleware
const { auth } =require('./middleware/auth');
const { admin } =require('./middleware/admin');

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  next();
});

//================================================
//          PRODUCTS
//================================================

app.post('/api/product/shop', (req,res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {
    'publish': true
  };
  let filters = req.body.filters;

  for(let key in filters) {
    if(filters[key].length > 0) {
      if(key === 'prices') {
        findArgs[key] = {
          $gte: filters[key][0],
          $lte: filters[key][1]
        }
      } else {
        findArgs[key] = filters[key]
      }
    }
  }


    Product
    .find(findArgs)
    .populate('brand') 
    .populate('wood')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, articles) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({
        size: articles.length,
        articles
      })
    })

  res.status(200)
})

//By Arrival
// /article?sortBy=createdAt&order=desc&lemit=4
//By sold
// /article?sortBy=sold&order=desc&limit=4

app.get('/api/product/articles', (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product
  .find()
  .populate('brand') //pull info from the brand collection
  .populate('wood')
  .sort([[sortBy, order]])
  .limit(limit)
  .exec((err, articles) => {
    if(err) return res.status(400).send(err);
    res.send(articles)
  })

})


// /api/product/atricle?id=qrgqrhg,qrhqth,qthqthqth&type=array or single
app.get('/api/product/articles_by_id', (req, res) => {
  let type = req.query.type;
  let items = req.query.id;

  if(type === "array") {
    let ids = req.query.id.split(',');
    items =[];
    items = ids.map(item => {
      return mongoose.Types.ObjectId(item);
    })
  }

  Product
  .find({ '_id': {$in: items}})
  .populate('brand') //pull info from the brand collection
  .populate('wood')
  .exec((err, docs) => {
    return res.status(200).send(docs)
  })
  
});

app.post('/api/product/article', auth, admin, (req, res) => {
  const product = new Product(req.body);

  product.save((err, doc) => {
    if(err) return res.json({success: false, err});
    res.status(200).json({
      success: true,
      article: doc
    })
  })
});

app.get('/api/product/getarticles', (req, res) => {
  Product.find({}, (err, articles) => {
    if(err) return res.status(400).send(err);
    res.status(200).send({articles})
  })
})

//================================================
//          WOODS
//================================================

app.post('/api/product/woods', auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood.save((err, doc) => {
    if(err) return res.json({success: false, err});
    res.status(200).json({
      success: true,
      wood: doc
    })
  })
});

app.get('/api/product/getwoods', (req, res) => {
  Wood.find({}, (err, woods) => {
    if(err) return res.status(400).send(err);
    res.status(200).send({woods})
  })
})


//================================================
//          BRANDS
//================================================

app.post('/api/product/brands', auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand.save((err, doc) => {
    if(err) return res.json({success: false, err});
    res.status(200).json({
      success: true,
      brand: doc
    })
  })

})

app.get('/api/product/getbrands', (req, res) => {
  Brand.find({}, (err, brands) => {
    if(err) return res.status(400).send(err);
    res.status(200).send({brands})
  })
})



//================================================
//          USERS
//================================================

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history
  })
})


app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if(err) return res.json({success: false, err});
    res.status(200).json({
      success: true
    })
  })
});

app.post('/api/users/login', (req, res) => {

  User.findOne({'email': req.body.email}, (err, user) => {
    if(!user) {
      return res.json({loginSuccess: false, message: 'Auth failed, email not found'})
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({loginSuccess: false, message: 'Incorrect password'});
      }

      user.generateToken((err, user) => {
        if(err) {return res.status(400).send(err)};
        res.cookie('g_auth', user.token).status(200).json({
          loginSuccess: true
        })
      })

    })

  })

})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    {_id: req.user._id},
    { token: '' },
    (err, doc) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    }
  )
})


// if(process.env.NODE_ENV === 'production'){
//   const appPath = path.join(__dirname, '..', 'dist');
//   app.use(express.static(appPath))

//   app.get('*', function(req, res){
//       res.sendFile(path.resolve(appPath, 'index.html'));
//   });
// }


const port = process.envPORT || 3001;

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
})
