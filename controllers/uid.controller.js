const Uid = require("../models/uid.model");

const genNextID = async (thisCounterType) => {
  try {
    console.log("in genNextID thisCounterType:" + thisCounterType);
    const firstrun = await Uid.findOne({ counterType: thisCounterType });
    let nextID = {};
    if (firstrun === null) {
      nextID = new Uid({ counterType: thisCounterType, idCounter: 1 });
      console.log(
        `creating a new Counter for ${thisCounterType} value ${nextID.idCounter}`
      );
      await nextID.save();
    } else {
      nextID = await Uid.findOneAndUpdate(
        { counterType: thisCounterType },
        { $inc: { idCounter: 1 } },
        { new: true }
      );
    }
    console.log(nextID.idCounter);
    return nextID.idCounter;
  } catch (err) {
    err.statusCode = 403;
  }
};

module.exports = {
  genNextID,
};
