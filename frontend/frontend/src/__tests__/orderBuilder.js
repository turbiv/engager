import { buildOrders } from "../orderBuilder";

it("builds order correctly", () => {
  let res;

  const submitted1 = {
    orders: [
      {
        create_time: "1558154235",
        client_valid_to_time: "49494949",
        user_code: "4919",
        json:
          '{"checkedOut":{"total":{"dollars":18,"cents":79},"subtotal":{"dollars":19,"cents":79},"bonus":{"dollars":1,"cents":0},"haveBonus":true},"orders":[{"id":"bb737f7e-1d13-41f3-9985-cc7531833cb6","total":2},{"id":"beaec4c4-3559-420a-bc3d-1ab03208ba89","total":1},{"id":"b1462b4f-99d8-4f03-8fa4-e8a5da8d257f","total":2}]}'
      },
      {
        create_time: "1558154235",
        client_valid_to_time: "49494949",
        user_code: "1949",
        json:
          '{"checkedOut":{"total":{"dollars":18,"cents":79},"subtotal":{"dollars":49,"cents":19},"bonus":{"dollars":0,"cents":0},"haveBonus":false},"orders":[{"id":"beaec4c4-3559-420a-bc3d-1ab03208ba89","total":1},{"id":"b1462b4f-99d8-4f03-8fa4-e8a5da8d257f","total":2}]}'
      }
    ],
    profile:
      '{"categories":[{"name":"test","id":"9572dc5b-574f-4fce-95d3-40c4ed64836c","sellables":[{"cat":"9572dc5b-574f-4fce-95d3-40c4ed64836c","id":"bb737f7e-1d13-41f3-9985-cc7531833cb6","name":"vegan","desc":"ssss","intro":{"size":{"w":340,"h":340},"path":"9b480c61-1853-4538-aee4-f011b5666993"},"promo":{"size":{},"square":{"size":{}},"time":{"days":[],"time_between":["00:00","23:59"]},"push":false,"message":""},"bonuses":[],"price":[1,20]},{"cat":"9572dc5b-574f-4fce-95d3-40c4ed64836c","id":"beaec4c4-3559-420a-bc3d-1ab03208ba89","name":"hamp","desc":"mmmm","intro":{"size":{"w":340,"h":340},"path":"d3b3c547-794a-425f-ba47-1869b124e73d"},"promo":{"size":{},"square":{"size":{}},"time":{"days":[],"time_between":["00:00","23:59"]},"push":false,"message":""},"bonuses":[],"price":[2,20]},{"cat":"9572dc5b-574f-4fce-95d3-40c4ed64836c","id":"b1462b4f-99d8-4f03-8fa4-e8a5da8d257f","name":"cap","desc":"s","intro":{"size":{"w":340,"h":340},"path":"c49a5409-8e88-4f77-9321-46a655499519"},"promo":{"size":{},"square":{"size":{}},"time":{"days":[],"time_between":["00:00","23:59"]},"push":false,"message":""},"bonuses":[],"price":[4,0]}]}]}',
    timenow: 1558154656
  };

  res = buildOrders(submitted1);
  expect(res.length).toBe(2);
  expect(res[0].expire).toBe(false);
  expect(res[0].user_code).toBe("4919");
  expect(res[0].total.dollars).toBe(18);
  expect(res[0].total.cents).toBe(79);
  expect(res[0].subtotal.dollars).toBe(19);
  expect(res[0].subtotal.cents).toBe(79);
  expect(res[0].bonus.dollars).toBe(1);
  expect(res[0].bonus.cents).toBe(0);
  expect(res[0].haveBonus).toBe(true);
  expect(res[0].purchases.length).toBe(3);
  expect(res[1].purchases.length).toBe(2);
  expect(res[1].purchases[0].name).toBe("hamp");
  expect(res[1].purchases[0].price.dollars).toBe(2);
  expect(res[1].purchases[1].amount).toBe(2);
  expect(res[1].purchases[1].priceDisplay).toBe("4,00");
  expect(res[1].purchases[1].totalDisplay).toBe("8,00");

  const submittedExpired = {
    orders: [
      {
        create_time: "10",
        client_valid_to_time: "100",
        user_code: "4919",
        json:
          '{"checkedOut":{"total":{"dollars":18,"cents":79},"subtotal":{"dollars":19,"cents":79},"bonus":{"dollars":1,"cents":0},"haveBonus":true},"orders":[{"id":"bb737f7e-1d13-41f3-9985-cc7531833cb6","total":2},{"id":"beaec4c4-3559-420a-bc3d-1ab03208ba89","total":1},{"id":"b1462b4f-99d8-4f03-8fa4-e8a5da8d257f","total":2}]}'
      },
      {
        create_time: "10",
        client_valid_to_time: "121",
        user_code: "4919",
        json:
          '{"checkedOut":{"total":{"dollars":18,"cents":79},"subtotal":{"dollars":19,"cents":79},"bonus":{"dollars":1,"cents":0},"haveBonus":true},"orders":[{"id":"bb737f7e-1d13-41f3-9985-cc7531833cb6","total":2},{"id":"beaec4c4-3559-420a-bc3d-1ab03208ba89","total":1},{"id":"b1462b4f-99d8-4f03-8fa4-e8a5da8d257f","total":2}]}'
      }
    ],
    profile:
      '{"categories":[{"name":"test","id":"9572dc5b-574f-4fce-95d3-40c4ed64836c","sellables":[{"cat":"9572dc5b-574f-4fce-95d3-40c4ed64836c","id":"bb737f7e-1d13-41f3-9985-cc7531833cb6","name":"vegan","desc":"ssss","intro":{"size":{"w":340,"h":340},"path":"9b480c61-1853-4538-aee4-f011b5666993"},"promo":{"size":{},"square":{"size":{}},"time":{"days":[],"time_between":["00:00","23:59"]},"push":false,"message":""},"bonuses":[],"price":[1,20]},{"cat":"9572dc5b-574f-4fce-95d3-40c4ed64836c","id":"beaec4c4-3559-420a-bc3d-1ab03208ba89","name":"hamp","desc":"mmmm","intro":{"size":{"w":340,"h":340},"path":"d3b3c547-794a-425f-ba47-1869b124e73d"},"promo":{"size":{},"square":{"size":{}},"time":{"days":[],"time_between":["00:00","23:59"]},"push":false,"message":""},"bonuses":[],"price":[2,20]},{"cat":"9572dc5b-574f-4fce-95d3-40c4ed64836c","id":"b1462b4f-99d8-4f03-8fa4-e8a5da8d257f","name":"cap","desc":"s","intro":{"size":{"w":340,"h":340},"path":"c49a5409-8e88-4f77-9321-46a655499519"},"promo":{"size":{},"square":{"size":{}},"time":{"days":[],"time_between":["00:00","23:59"]},"push":false,"message":""},"bonuses":[],"price":[4,0]}]}]}',
    timenow: 120
  };

  res = buildOrders(submittedExpired);
  expect(res.length).toBe(2);
  expect(res[0].expire).toBe(true);
  expect(res[1].expire).toBe(false);
});
