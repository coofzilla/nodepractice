const mongoose = require("mongoose");
const redis = require("redis");
const { promisify } = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.get = promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
  this.useCache = true;
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  //see if have a value for key in redis
  const cacheValue = await client.get(key);

  //if do, return
  if (cacheValue) {
    const document = JSON.parse(cacheValue);
    //this is hydrating (parsing) the values
    return Array.isArray(document)
      ? document.map((d) => new this.model(d))
      : new this.model(document);
  }
  //otherwise, issue query and store the result in redis
  const result = await exec.apply(this, arguments);

  client.set(key, JSON.stringify(result));

  return result;
};
