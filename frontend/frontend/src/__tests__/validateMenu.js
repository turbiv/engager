import { validateMenuData } from "../validateMenu";
import * as menuactions from "../MenuCreatorActions";

  it("reports errors  correctly", () => {
    let res;
    const clientData = {
      profile: {
        categories: []
      }
    };

    //Test 1
  res = validateMenuData(clientData);
  expect(res.status).toBe(false);
  expect(res.errors.globals.length).toBe(1);

  clientData.profile.categories.push({ id: "49",oldprice: [] ,name: "", sellables: [] });

  //Test 2
  res = validateMenuData(clientData);

  expect(res.status).toBe(false);
  expect(res.errors.globals.length).toBe(0);
  expect(res.errors.categories[0].errors.length).toBe(2);

  clientData.profile.categories[0].sellables.push(
    menuactions.createNewSellable(clientData.profile.categories[0])
  );

  const category = clientData.profile.categories[0];
  const sellable = category.sellables[0];

  //Helper function to revert back to default values
  function default_values(sellable = category.sellables[0]){
    sellable.name = "";
    sellable.desc = "";
    sellable.intro.size = {};
    sellable.promo.message = "";
    sellable.promo.path = "";
    sellable.promo.push = false;
    sellable.promo.square.path = "";
    sellable.promo.square.size = {};
    sellable.promo.time.days = [];
    sellable.promo.time.time_between[0] = "00:00";
    sellable.promo.time.time_between[1] = "23:59";
    sellable.bonuses = [];
    sellable.price = [];
    sellable.oldprice = [];
  }
  res = validateMenuData(clientData);

  expect(res.status).toBe(false);
  expect(res.errors.globals.length).toBe(0);
  expect(res.errors.categories[0].errors.length).toBe(1);
  expect(res.errors.sellables[0].errors.length).toBe(4);

  //Test 3
  category.name = "test name 1";
  sellable.name = "test name 2";
  sellable.desc = "test desc";
  sellable.intro.path = "<path>";
  sellable.price = [49, 19];

  res = validateMenuData(clientData);
  expect(res.status).toBe(true);

  //Test 4
  default_values();
  category.name = "test name 1";
  sellable.name = "test name 2";
  sellable.desc = "test desc";
  sellable.intro.path = "<path>";
  sellable.price = [49, 19];
  sellable.promo.path = "Path";
  sellable.promo.push = true;


  res = validateMenuData(clientData);
  expect(res.status).toBe(false);
  expect(res.errors.sellables[0].errors.length).toBe(2);

  //Test 5
  default_values();
  category.name = "test name 1";
  sellable.name = "test name 2";
  sellable.desc = "test desc";
  sellable.intro.path = "<path>";
  sellable.price = [49, 19];
  sellable.promo.path = "Path";
  sellable.promo.square.path = "Path";
  sellable.promo.push = true;
  sellable.promo.message = "Test message";


  res = validateMenuData(clientData);
  expect(res.status).toBe(true);


  //Test 6
  default_values();
  category.name = "test name 1";
  sellable.name = "test name 2";
  sellable.desc = "test desc";
  sellable.intro.path = "<path>";
  sellable.price = [10, 101];


  res = validateMenuData(clientData);
  expect(res.status).toBe(false);
  expect(res.errors.sellables[0].errors.length).toBe(1);

  //Test 7
  default_values();

  sellable.bonuses.push({condition: "happy_hour",
    display: {big:{subtext: "test", text: ""}, small:{text: "test2"}},
    interest:{percent: 2, total:[]},
    interest_type: "percent",
    time:{days: [], time_between:["00:00", "23:59"]}
  });

  category.name = "test name 1";
  sellable.name = "test name 2";
  sellable.desc = "test desc";
  sellable.intro.path = "<path>";
  sellable.price = [49, 19];


  res = validateMenuData(clientData);
  expect(res.status).toBe(true);



  //Test 8
    default_values();
    category.name = "test name 1";
    sellable.name = "test name 2";
    sellable.desc = "test desc";
    sellable.intro.path = "<path>";
    sellable.price = [0, 98];
    sellable.oldprice = [0,99];


    res = validateMenuData(clientData);
    expect(res.status).toBe(true);


    //Test 9
    default_values();

    sellable.bonuses.push({condition: "happy_hour",
      display: {big:{subtext: "test", text: ""}, small:{text: "test2"}},
      interest:{percent: 2, total:[1000, 99]},
      interest_type: "total",
      time:{days: [], time_between:["00:00", "23:59"]}
    });

    category.name = "test name 1";
    sellable.name = "test name 2";
    sellable.desc = "test desc";
    sellable.intro.path = "<path>";
    sellable.price = [1000, 98];



    res = validateMenuData(clientData);
    expect(res.status).toBe(false);
    expect(res.errors.sellables[0].errors.length).toBe(1);

    //Test 10 (Free is allowed?)
    default_values();

    sellable.bonuses.push({condition: "happy_hour",
      display: {big:{subtext: "test", text: ""}, small:{text: "test2"}},
      interest:{percent: 2, total:[1, 1]},
      interest_type: "total",
      time:{days: [], time_between:["00:00", "23:59"]}
    });

    category.name = "test name 1";
    sellable.name = "test name 2";
    sellable.desc = "test desc";
    sellable.intro.path = "<path>";
    sellable.price = [1, 1];


    res = validateMenuData(clientData);
    expect(res.status).toBe(true);

    //Test 11
    default_values();

    sellable.bonuses.push({condition: "happy_hour",
      display: {big:{subtext: "test", text: ""}, small:{text: "test2"}},
      interest:{percent: 2, total:[1, 1]},
      interest_type: "total",
      time:{days: [1], time_between:["11:00", "10:00"]}
    });

    category.name = "test name 1";
    sellable.name = "test name 2";
    sellable.desc = "test desc";
    sellable.intro.path = "<path>";
    sellable.price = [1000, 99];


    res = validateMenuData(clientData);
    expect(res.status).toBe(false);
    expect(res.errors.sellables[0].errors.length).toBe(1);

    //Test 12
    default_values();

    sellable.bonuses.push({condition: "",
      display: {big:{subtext: "test", text: ""}, small:{text: "test2"}},
      interest:{percent: 2, total:[]},
      interest_type: "percent",
      time:{days: [], time_between:["00:00", "23:59"]}
    });

    category.name = "test name 1";
    sellable.name = "test name 2";
    sellable.desc = "test desc";
    sellable.intro.path = "<path>";
    sellable.price = [1000, 99];


    res = validateMenuData(clientData);
    expect(res.status).toBe(false);
    expect(res.errors.sellables[0].errors.length).toBe(1);

    //Test 13
    default_values();

    sellable.bonuses.push({condition: "",
      display: {big:{subtext: "", text: ""}, small:{text: ""}},
      interest:{percent: 2, total:[1, 1]},
      interest_type: "percent",
      time:{days: [], time_between:["00:00", "23:59"]}
    });

    category.name = "test name 1";
    sellable.name = "test name 2";
    sellable.desc = "test desc";
    sellable.intro.path = "<path>";
    sellable.price = [1000, 99];


    res = validateMenuData(clientData);
    expect(res.status).toBe(false);
    expect(res.errors.sellables[0].errors.length).toBe(3);



  });
