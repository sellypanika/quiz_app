import * as statisticsService from "../../services/statisticsService.js";

const showMain = async ({ render }) => {
  const statistics = await statisticsService.getStatistics();

  render("index.eta", { statistics });
};

export { showMain };
