const cron = require("node-cron");
const { UserSession } = require("../models");
const { Op } = require("sequelize");

cron.schedule("* * * * *", async () => {
  try {
    await UserSession.update(
      {
        is_active: false,
        logout_time: new Date()
      },
      {
        where: {
          is_active: true,
          session_expiry_time: {
            [Op.lte]: new Date()
          }
        }
      }
    );

    console.log("Expired sessions updated");
  } catch (err) {
    console.error(err);
  }
});