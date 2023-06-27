const { fetchData, InsertData } = require("./Setup");

module.exports = function ProductDetails(app, db) {

  app.get("/product-detail/:productid", async (req, res) => {
    let responseContext = {
      json: {
        status: "denied",
        field: {},
      },
      status: 404,
    };

    let {productid} = req.params;

    let ProductInfo = await fetchData(
      `
        SELECT p.*
        FROM Product as p
        WHERE p.id == ${parseInt(productid)}
      `,
      db
    );

    let Review = await fetchData(
      `
        SELECT u.username, u.fullname, r.title, r.desciption, r.rating
        FROM Product as p INNER JOIN Review as r ON p.id = r.PdId
                          INNER JOIN Users as u ON r.UserId = u.id
        WHERE p.id == ${parseInt(productid)}
      `,
      db
    );

    let relatedProduct = await fetchData(
      `
        SELECT p.*
        FROM Product as p INNER JOINN TypeProduct_Product as tp_p ON p.id =tp_p.PdId
        WHERE tp_p.type IN (SELECT TypeId
                            FROM Product as p INNER JOINN TypeProduct_Product as tp_p ON p.id =tp_p.PdId
                            WHERE p == ${parseInt(productid)})
        ORDER BY p.PdName ASC
      `,
      db
    );

    if (ProductInfo.length !== 0) {
      responseContext = {
        json: {

          status: "accepted",
          field: {
            
            productInfo: ProductInfo,
            review: Review,
            relatedProduct: relatedProduct

          }

        },
        status: 200,
      };
    }

    res.status(responseContext.status).json({ ...responseContext.json });
  });

  app.post("/product-detail/:productid/addtocart", async (req, res) => {
    let responseContext = {
      json: {
        status: "denied",
        field: {},
      },
      status: 404,
    };

    let { productid } = req.params;
    let { quantity, userid } = req.body;

    let GetItemInCart = await fetchData(`
      SELECT c.*
      FROM Cart as c
      WHERE UserId == ${parseInt(userid)} AND PdId == ${parseInt(productid)}
    `,db)

    if(GetItemInCart.length !==0 ) {
      let UpdateQuantity = await InsertData(`
        UPDATE Cart SET quantity = quantity + ${quantity} WHERE UserId == ${parseInt(userid)} AND PdId == ${parseInt(productid)}
      `, db);
    }
    else {
      let InsertToCart = await InsertData(
        `
          INSERT INTO Cart (UserId, PdId, quantity)
          VALUES (${userid}, ${productid}, ${quantity});
        `,
        db
      );      
    }

    responseContext = {
      json: {
        status: "accepted",
      },
      status: 200,
    };

    res.status(responseContext.status).json({ ...responseContext.json });
  });

  app.post("/product-detail/:productid/submit-review", async (req, res) => {
    let responseContext = {
      json: {
        status: "denied",
        field: {},
      },
      status: 404,
    };

    let { productid } = req.params;
    let ReviewInfo = req.body;

    let insertReview = await InsertData(
      `
        INSERT INTO Review ( PdId, UserId, title, description, rating)
        VALUES (${productid}, ${ReviewInfo.userid}, '${ReviewInfo.title}', '${ReviewInfo.description}', ${ReviewInfo.rating});
      `,
      db
    );

    responseContext = {
      json: {
        status: "accepted"
      },
      status: 200,
    };

    res.status(responseContext.status).json({ ...responseContext.json });
  });

  app.post("/product-detail/:productid/addwishlist", async (req, res) => {
    let responseContext = {
      json: {
        status: "denied",
        field: {},
      },
      status: 404,
    };

    let { productid } = req.params;
    let { userid } = req.body;

    let WishListCheck = await fetchData(
      `
        SELECT *
        FROM WishList
        WHERE UserId == ${parseInt(userid)} AND PdId == ${parseInt(productid)}
      `,
      db
    );

    if (WishListCheck.length === 0) {
      let insertItemToWishList = await InsertData(`
        INSERT INTO WishList (UserId, PdId)
        VALUES (${parseInt(userid)}, ${parseInt(productid)});
      `);
    }
    responseContext = {
      json: {
        status: "accepted"
      },
      status: 200,
    };

    res.status(responseContext.status).json({ ...responseContext.json });
  });
  
};
