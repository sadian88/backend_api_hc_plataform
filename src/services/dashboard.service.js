const dashboardRepository = require('../repositories/dashboard.repository');

const getDashboardData = async () => {
  const [summary, recentLeads, topCompanies] = await Promise.all([
    dashboardRepository.getSummary(),
    dashboardRepository.getRecentLeads(),
    dashboardRepository.getTopCompanies()
  ]);

  return {
    summary: {
      companies: Number(summary.company_count) || 0,
      leads: Number(summary.lead_count) || 0,
      searchResults: Number(summary.search_result_count) || 0,
      latestLeadUpdate: summary.latest_lead_update,
      latestSearchUpdate: summary.latest_search_result_update
    },
    recentLeads,
    topCompanies
  };
};

module.exports = {
  getDashboardData
};
