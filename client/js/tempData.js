export const ingredientInfo = {
  tomato: {
    name: "Tomato",
    icon: "🍅",
    info: 'Tomato plants are vines, initially decumbent, typically growing 180 cm (6 ft) or more above the ground if supported, although erect bush varieties have been bred, generally 100 cm (3 ft 3 in) tall or shorter. Indeterminate types are "tender" perennials, dying annually in temperate climates (they are originally native to tropical highlands), although they can live up to three years in a greenhouse in some cases. Determinate types are annual in all climates.',
    learnUrl: "https://en.wikipedia.org/wiki/Tomato",
  },
  mozzarella: {
    name: "Mozzarella",
    icon: "🧀",
    info: "Mozzarella (English: /ˌmɒtsəˈrɛlə/, Italian: [mottsaˈrɛlla]; Neapolitan: muzzarella [muttsaˈrɛllə]) is a southern Italian cheese traditionally made from Italian buffalo's milk by the pasta filata method. Fresh mozzarella is generally white but when seasoned it turns to a light yellow depending on the animal's diet.[1] Due to its high moisture content, it is traditionally served the day after it is made[2] but can be kept in brine for up to a week[3] or longer when sold in vacuum-sealed packages. Low-moisture mozzarella can be kept refrigerated for up to a month,[4] though some shredded low-moisture mozzarella is sold with a shelf life of up to six months.[5] Mozzarella is used for most types of pizza and several pasta dishes or served with sliced tomatoes and basil in Caprese salad.    ",
    learnUrl: "https://en.wikipedia.org/wiki/Mozzarella",
  },
  cheese: {
    name: "Cheese",
    icon: "🧀",
    info: "Fresh cheese is generally white but when seasoned it turns to a light yellow depending on the animal's diet.[1] Due to its high moisture content, it is traditionally served the day after it is made[2] but can be kept in brine for up to a week[3] or longer when sold in vacuum-sealed packages. Low-moisture mozzarella can be kept refrigerated for up to a month,[4] though some shredded low-moisture mozzarella is sold with a shelf life of up to six months.[5] Mozzarella is used for most types of pizza and several pasta dishes or served with sliced tomatoes and basil in Caprese salad.    ",
    learnUrl: "https://en.wikipedia.org/wiki/Mozzarella",
  },
  basil: {
    name: "Basil",
    icon: "🌿",
    info: "Basil is an annual, or sometimes perennial, herb used for its leaves. Depending on the variety, plants can reach heights of between 30 and 150 cm (1 and 5 ft).[8] Its leaves are richly green and ovate, but otherwise come in a wide variety of sizes and shapes depending on cultivar. Leaf sizes range from 3 to 11 cm (1 to 4+1⁄2 in) long, and between 1 and 6 cm (1⁄2 and 2+1⁄2 in) wide. Basil grows a thick, central taproot. Its flowers are small and white, and grow from a central inflorescence, or spike, that emerges from the central stem atop the plant.[citation needed] Unusual among Lamiaceae, the four stamens and the pistil are not pushed under the upper lip of the corolla, but lie over the inferior lip. After entomophilous pollination, the corolla falls off and four round achenes develop inside the bilabiate calyx.",
    learnUrl: "https://en.wikipedia.org/wiki/Basil",
  },
  salami: {
    name: "Salami",
    icon: "🍖",
    info: "The quality of salami is dependent on the quality of the raw materials and the level of technology used in its production.[24] The aroma and taste of salami are developed by enzymatic and non-enzymatic reactions.[24] The characteristic fermented meat flavour is believed to be developed by a combination of endogenous enzymatic activities and the lactic acid produced by the starter culture.[24] Lactic acid bacteria develop the tangy flavor of salami through the fermentation of carbohydrates and produces an appealing red color to the meat after fermentation, while coagulase-negative cocci can catabolize amino acids and fatty acids to produce volatile compounds.[22] The flavour itself consists of odour properties, which comes from volatile substances, and taste and tactile properties, which comes from non-volatile substances that are a result of enhancers and synergists.",
    learnUrl: "https://en.wikipedia.org/wiki/Salami",
  },
};

export const menu = `
  [
    {
      "id": "967857456345423",
      "name": "Pierogi with cheese",
      "image": "https://assets.kanapka.eu/images/pierogiCheckoutApp.png",
      "ingredients": ["cheese", "basil"],
      "properties": [
        {
          "name": "lactose",
          "icon": "🥛"
        },
        {
          "name": "w/ meat",
          "icon": "🍖"
        }
      ],
      "sizes": {
        "small": {
          "price": 1000,
          "size": "2 pcs"
        },
        "medium": {
          "price": 7000,
          "size": "5 pcs"
        },
        "large": {
          "price": 10000,
          "size": "8 pcs"
        }
      },
      "nutrition": [
        {
          "name": "calories",
          "value": "400cal"
        },
        {
          "name": "fat",
          "value": "40g"
        },
        {
          "name": "salt",
          "value": "7g"
        },
        { "name": "sugar", "value": "10g" }
      ],
      "nutritionInfo": "Values per piece."
    },
    {
      "id": "576643475346",
      "name": "Kebab",
      "image": "https://assets.kanapka.eu/images/kebabCheckoutApp.png",
      "ingredients": ["tomato", "mozzarella", "basil"],
      "properties": [
        {
          "name": "vegetarian",
          "icon": "🥕"
        },
        {
          "name": "w/ meat",
          "icon": "🍖"
        }
      ],
      "sizes": {
        "no meat": {
          "price": 499,
          "size": "20cm"
        },
        "meat": {
          "price": 699,
          "size": "25cm"
        },
        "meat XL": {
          "price": 999,
          "size": "40cm"
        }
      },
      "nutrition": [
        {
          "name": "calories",
          "value": "1700cal"
        },
        {
          "name": "fat",
          "value": "260g"
        },
        { "name": "sugar", "value": "23g" }
      ],
      "nutritionInfo": "Values per kebab."
    },
    {
      "id": "756785658556",
      "name": "Pizza Salami",
      "image": "https://assets.kanapka.eu/images/pizzaCheckoutApp.png",
      "ingredients": ["salami"],
      "properties": [
        {
          "name": "spicy",
          "icon": "🌶️"
        },
        {
          "name": "w/ meat",
          "icon": "🍖"
        }
      ],
      "sizes": {
        "small": {
          "price": 649,
          "size": "2 pcs"
        },
        "medium": {
          "price": 799,
          "size": "3 pcs"
        },
        "large": {
          "price": 999,
          "size": "4 pcs"
        }
      },
      "nutrition": [
        {
          "name": "calories",
          "value": 1000
        },
        {
          "name": "fat",
          "value": 20
        },
        { "name": "sugar", "value": 20 }
      ],
      "nutritionInfo": "Values per slice."
    },
    {
      "id": "67646537364343",
      "name": "Apple Juice",
      "image": "https://assets.kanapka.eu/images/drinkCheckoutApp.png",
      "ingredients": ["tomato", "mozzarella", "basil", "salami"],
      "properties": [
        {
          "name": "cold",
          "icon": "❄️"
        }
      ],
      "sizes": {
        "small": {
          "price": 500,
          "size": "250ml"
        },
        "large": {
          "price": 1100,
          "size": "800ml"
        }
      },
      "nutrition": [
        {
          "name": "calories",
          "value": "700cal"
        },
        { "name": "sugar", "value": "36g" }
      ],
      "nutritionInfo": "Values per 100ml."
    },
    {
      "id": "389343932898523",
      "name": "Kaktus Ice Cream",
      "image": "https://assets.kanapka.eu/images/icecreamCheckoutApp.png",
      "ingredients": [],
      "properties": [
        {
          "name": "cold",
          "icon": "❄️"
        }
      ],
      "sizes": {
        "normal": {
          "price": 500,
          "size": "100ml"
        }
      },
      "nutrition": [
        {
          "name": "calories",
          "value": "700cal"
        },
        { "name": "sugar", "value": "36g" }
      ],
      "nutritionInfo": "Values per 100ml."
    },
    {
      "id": "1232435235",
      "name": "Pizza Margherita",
      "image": "https://assets.kanapka.eu/images/pizzaCheckoutApp2.png",
      "ingredients": ["tomato", "mozzarella", "basil"],
      "properties": [
        {
          "name": "vegetarian",
          "icon": "🥕"
        }
      ],
      "sizes": {
        "small": {
          "price": 599,
          "size": "20cm"
        },
        "medium": {
          "price": 799,
          "size": "30cm"
        },
        "large": {
          "price": 999,
          "size": "40cm"
        }
      },
      "nutrition": [
        {
          "name": "calories",
          "value": "220cal"
        },
        {
          "name": "fat",
          "value": "20g"
        },
        { "name": "sugar", "value": "20g" }
      ],
      "nutritionInfo": "Values per slice."
    },
    {
      "id": "2546756846452",
      "name": "Pizza Siciliana",
      "image": "https://assets.kanapka.eu/images/pizzaCheckoutApp3.png",
      "ingredients": ["tomato", "mozzarella", "basil", "salami"],
      "properties": [
        {
          "name": "w/ meat",
          "icon": "🍖"
        },
        {
          "name": "lactose",
          "icon": "🥛"
        }
      ],
      "sizes": {
        "standard": {
          "price": 899,
          "size": "3 pcs"
        },
        "extra": {
          "price": 1199,
          "size": "4 pcs"
        }
      },
      "nutrition": [
        {
          "name": "calories",
          "value": "2600cal"
        },
        {
          "name": "salt",
          "value": "20g"
        },
        { "name": "sugar", "value": "15g" }
      ],
      "nutritionInfo": "Values per slice."
    }
  ]
`;
