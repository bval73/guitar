const express = require('express'),
      app = express(),
      path = require("path"),
      bodyParser = require('body-parser'),
      config = require('./config'),
      mongoose = require('mongoose'),
//      FakeDb = require('./fake-db'),
      cookieParser = require('cookie-parser'),
      formidable = require('express-formidable'),
      cloudinary = require('cloudinary'),
      async = require('async'),
      SHA1 = require('crypto-js/sha256'),
      multer = require('multer')
      moment = require('moment'),
      fs = require('fs');



require('dotenv').config();

mongoose.Promise = global.Promise;

mongoose.set("useCreateIndex", true);
mongoose.connect(config.GUITAR_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Mongo DB Connected"))
    .catch((err) => console.log("Err is", err));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('client/build'));

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_API_KEY,
  api_secret: config.CLOUD_API_SECRET
})

//===========================================
//              Models
//===========================================
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');
const { Payment } = require('./models/payment');
const { Site } = require('./models/site')

//Middleware
const { auth } =require('./middleware/auth');
const { admin } =require('./middleware/admin');

//UTILS
const { sendEmail } = require('./utils/mail/index');

// const date = new Date();
// const po = `PO-${Date.now()}-${SHA1("39e1yj6ety6j9tyeJ").toString().substring(0,8)}`;

// console.log(po);

// const smptTransport = mailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "billvalentine73@gmail.com",
//     pass: config.GMAIL_PASS
//   }
// });

// var mail = {
//   from: "Guitars <billvalentine73@gmail.com>",
//   to: "bvalentineii@hotmail.com",
//   subject: "Welcome",
//   text: "Testing the guitar site mail",
//   html:"<b>Testing the site mail </b>"
// }

// smptTransport.sendMail(mail, function(err, res) {
//   if(err) {
//     console.log(err)
//   } else {
//     console.log(res)
//   }
//   smptTransport.close();
// });

// Storage Multer Config
let storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req,file,cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
  // fileFilter:(req,file,cb)=>{

    //     const ext = path.extname(file.originalname)
    //     if(ext !== '.jpg' && ext !== '.png'){
    //         return cb(res.status(400).end('only jpg, png is allowed'),false);
    //     }

    //     cb(null,true)
    // }
});
const upload = multer({storage: storage}).single('file');

app.post('/api/users/uploadfile', auth, admin, (req,res) => {
  upload(req, res, (err) => {
    if(err) {
      return res.json({success: false, err})
    }
    return res.json({success:true})
  })
})

app.get('/api/users/admin_files', auth, admin, (req, res) => {
  const dir = path.resolve(".")+'/uploads';
  fs.readdir(dir, (err,items) => {
    return res.status(200).send(items);
  })
})

app.get('/api/users/download/:id', auth, admin, (req, res) => {
  const file = path.resolve(".")+`/uploads/${req.params.id}`;
  console.log('file is ',file);
  res.download(file);
})


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
      if(key === 'price') {
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
console.log('product in server.js', product);  
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


app.post('/api/users/reset_user', (req, res) => {
  User.findOne(
    {'email': req.body.email},
    (err, user) =>{
      if(!user) return res.json({succes: false, err});
      user.generateResetToken((err,user) => {
        if(err) return res.json({succes: false, err});
        sendEmail(user.email,user.name,null,"reset_password",user)
        return res.json({success:true})

      })
    }
  )
})

app.post('/api/users/reset_password', (req,res) => {
  const today = moment().startOf('day').valueOf();
  User.findOne({
    resetToken: req.body.resetToken,
    resetTokenExp:{
      $gte: today
    }
  }, (err, user) => {
    if(!user)  return res.json({success: false, message: 'Time limit has passed, pleae go to reset page againand create a new token'})

    user.password = req.body.password;
    user.resetToken = '';
    user.resetTokenExp = '';

    user.save((err,doc) => {
      if(err) return res.json({success: false, err});
      return res.status(200).json({
        success: true
      })
    })

  })

})

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history,
    user: req.user._id
  })
})


app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if(err) return res.json({success: false, err});
    sendEmail(doc.email, doc.name, null, "welcome");
    return res.status(200).json({
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
});

app.post('/api/users/uploadimage', auth, admin, formidable(), (req, res) => {
  cloudinary.uploader.upload(req.files.file.path, (result) => {
//    console.log(result);
    res.status(200).send({
      public_id: result.public_id,
      url: result.url
    })
  }, {
    public_id:`${Date.now()}`,
    resource_type: 'auto'
  })
})

app.get('/api/users/removeimage', auth, admin, (req,res) => {
  let image_id = req.query.public_id;

  cloudinary.uploader.destroy(image_id, (error, result) => {
    if(error) return res.json({success: false, error});
    res.status(200).send('Image has been removed')
  });
})

app.post('/api/users/addToCart/', auth, (req,res) => {

  User.findOne({ _id: req.user._id}, (err,doc) => {
    let duplicate = false;

    doc.cart.forEach((item) => {
      if(item.id == req.query.productId) {
        duplicate = true;
      }
    })

    if(duplicate) {
      User.findOneAndUpdate(
        {_id: req.user._id, "cart.id": mongoose.Types.ObjectId(req.query.productId)},
        { $inc: {"cart.$.quantity":1} },
        {new:true},
        (err,doc) => {
          if(err) return res.json({success: false, err}); 
          res.status(200).json(doc.cart)
        }
      )
    } else {
      User.findOneAndUpdate(
        {_id: req.user._id},
        {$push:{ cart: {
          id: mongoose.Types.ObjectId(req.query.productId),
          quantity:1,
          date: Date.now()
        } }},
        //this sends current cart with new product added and not prev one...
        { new: true }, 
        (err,doc) => {
          if(err) return res.json({success: false, err}); 
          res.status(200).json(doc.cart)
        }
      )
    }
  })
})

app.get('/api/users/removeFromCart', auth, (req,res) => {

  User.findByIdAndUpdate(
    {_id: req.user._id},
    { "$pull": 
      { "cart": {"id": mongoose.Types.ObjectId(req.query._id) } } 
    },
    { new: true },
    (err,doc) => {
      let cart = doc.cart;
      let array = cart.map(item => {
        return mongoose.Types.ObjectId(item.id)
      });

      Product.find({"_id": {$in: array}})
      .populate('brand')
      .populate('wood')
      .exec((err, cartDetail) => {
        return res.status(200).json({
          cartDetail,
          cart
        })
      })
    }
  );
})

app.post('/api/users/successBuy', auth, (req, res) => {

  let history = [];
  let transactionData = {};
  const userD = req.user;
  const date = new Date();
  const po = `PO-${Date.now()}-${SHA1(userD._id).toString().substring(0,8)}`;

  req.body.cartDetail.forEach((item) => {
    history.push({
      porder: po,
      dateOfPurchase: Date.now(),
      name: item.name,
      brand: item.brand.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID
    })
  })

  //TODO payment info
  transactionData.user = {
    id: userD._id,
    name: userD.name,
    lastname: userD.lastname,
    email: userD.email
  }
  transactionData.data = {
    ...req.body.paymentData,
    porder: po
  };
  transactionData.product = history;

  User.updateOne(
    { _id: userD._id },
    { $push: {history: history}, $set:{cart: [] } },
    { new: true },
    (err, user) => {
      if(err) return res.status(401).json({succes: false, err});
        
        const payment = new Payment(transactionData);
        payment.save((err,doc) => {
          if(err) return res.status(401).json({succes: false, err});

          let products = [];
          
          doc.product.forEach(item => {
            products.push({id: item.id, quantity: item.quantity})
          })

          async.eachSeries(products, (item, callback) => {
            Product.update(
              {_id: item.id},
              {$inc: {
                "sold": item.quantity
              }},
              {new: false},
              callback
            )
          },(err) => {
            if(err) res.status(401).json({succes: false, err});
            sendEmail(userD.email, userD.name, null, "purchase", transactionData)
            res.status(200).json({
              success: true,
              cart: user.cart,
              cartDetail: []
            })
          })
        })
    }
  )
})

app.post('/api/users/update_profile', auth, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      "$set": req.body
    },
    { new: true},
    (err, doc) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success:true
      })
    }
  );
})

//===========================================
//              Site Info
//===========================================

app.get('/api/site/site_data', (req, res) => {
  Site.find({}, (err, site) => {
    if(err) res.status(401).send(err);
    res.status(200).send(site[0].siteInfo);
  });
});

app.post('/api/site/site_data', auth, admin, (req, res) => {
  Site.findOneAndUpdate(
    {name: 'Site'},
    {"$set": {siteInfo: req.body}},
    {new: true},
    (err,doc) => {
      if(err) return res.json({success:false, err});
      return res.status(200).send({
        success: true,
        siteInfo: doc.siteInfo
      })
    }
  )
})

//DEFAULT
if( process.env.NODE_ENV === 'production' ) {
  const appPath = path.join(__dirname, '../client', 'build');  
  app.get('/*', (req,res) => {
      res.sendfile(path.resolve(appPath,'index.html'));
  })
  console.log('appPath ', appPath);
}

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
})

