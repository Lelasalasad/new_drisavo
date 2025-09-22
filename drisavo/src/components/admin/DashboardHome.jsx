import React, { useState, useEffect } from "react";
import {
  User,
  MessageSquare,
  Settings,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../App.css";

const DashboardHome = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [quickStats, setQuickStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardData, quickStatsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getQuickStats(),
      ]);

      /*by lelas alasad*/
      const mappedQuickStats = (quickStatsData || [])
        .map((item) => {
          switch (item.metric) {
            case "totalInquiries":
              return {
                title: t("dashboardh.totalInquiries"),
                value: item.value,
                icon: MessageSquare,
                color: "blue",
              };
            case "activeServices":
              return {
                title: t("dashboardh.activeServices"),
                value: item.value,
                icon: Settings,
                color: "green",
              };
            case "monthlyGrowth":
              return {
                title: t("dashboardh.monthlyGrowth"),
                value: `${item.value}%`,
                icon: TrendingUp,
                color: "purple",
              };
            case "satisfiedClients":
              return {
                title: t("dashboardh.satisfiedClients"),
                value: item.value,
                icon: User,
                color: "orange",
              };
            default:
              return null;
          }
        })
        .filter(Boolean);

      setQuickStats(mappedQuickStats);
      if (dashboardData) setStats(dashboardData);
    } catch (error) {
      console.error(t("dashboardh.loadError"), error);
    } finally {
      setLoading(false);
    }
  };

  const defaultStats = [
    {
      title: t("dashboardh.totalInquiries"),
      value: "0",
      icon: MessageSquare,
      color: "blue",
    },
    {
      title: t("dashboardh.activeServices"),
      value: "0",
      icon: Settings,
      color: "green",
    },
    {
      title: t("dashboardh.monthlyGrowth"),
      value: "0%",
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: t("dashboardh.satisfiedClients"),
      value: "0",
      icon: User,
      color: "orange",
    },
    
  ];

  const displayStats = quickStats.length > 0 ? quickStats : defaultStats;

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="page-header">
          <h1 className="page-title">{t("dashboardh.title")}</h1>
          <p className="page-subtitle">{t("dashboardh.loadingData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="page-header">
        <h1 className="page-title">{t("dashboardh.title")}</h1>
        <p className="page-subtitle">{t("dashboardh.welcome")}</p>
      </div>

      <div className="stats-grid">
        {displayStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="stat-card-content">
                <div className="stat-info">
                  <p>{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={24} color="white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="card-header">
            <h2>{t("dashboardh.recentInquiries")}</h2>
          </div>
          <div className="card-content">
            {stats?.recent_inquiries?.length > 0 ? (
              stats.recent_inquiries.map((inquiry, i) => (
                <div key={i} className="inquiry-item">
                  <div className="inquiry-details">
                    <p className="inquiry-name">{inquiry.name}</p>
                    <p className="inquiry-service">
                      {inquiry.service?.title || t("dashboardh.generalService")}
                    </p>
                    <p className="inquiry-date">
                      {new Date(inquiry.created_at).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                  <span
                    className={`inquiry-status ${
                      inquiry.status === "new"
                        ? "status-new"
                        : inquiry.status === "in_progress"
                        ? "status-in-progress"
                        : "status-completed"
                    }`}
                  >
                    {inquiry.status === "new"
                      ? t("dashboardh.statusNew")
                      : inquiry.status === "in_progress"
                      ? t("dashboardh.statusInProgress")
                      : t("dashboardh.statusCompleted")}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">{t("dashboardh.noRecentInquiries")}</p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="card-header">
            <h2>{t("dashboardh.quickActions")}</h2>
          </div>
          <div className="card-content">
            <button
              className="action-button inquiries"
              onClick={() => navigate("/admin/inquiries")}
            >
              <MessageSquare size={16} />
              {t("dashboardh.viewAllInquiries")}
            </button>
            <button
              className="action-button services"
              onClick={() => navigate("/admin/services")}
            >
              <Settings size={16} />
              {t("dashboardh.manageServices")}
            </button>
            <button
              className="action-button content"
              onClick={() => navigate("/admin/content")}
            >
              <Calendar size={16} />
              {t("dashboardh.updateContent")}
            </button>
            <button
              className="action-button content"
              onClick={() => navigate("/admin/cities")}
            >
              {t("dashboardh.addcities")}
            </button>
            
            
            
          </div>
        </div>

        {stats?.overview && (
          <div className="stat-card">
            <div className="card-header">
              <h2>{t("dashboardh.detailedStats")}</h2>
            </div>
            <div className="card-content">
              <div className="overview-grid">
                <div className="overview-item">
                  <p className="overview-value">
                    {stats.overview.new_inquiries}
                  </p>
                  <p className="overview-label">
                    {t("dashboardh.newInquiries")}
                  </p>
                </div>
                <div className="overview-item">
                  <p className="overview-value">
                    {stats.overview.in_progress_inquiries}
                  </p>
                  <p className="overview-label">{t("dashboardh.inProgress")}</p>
                </div>
                <div className="overview-item">
                  <p className="overview-value">
                    {stats.overview.completed_inquiries}
                  </p>
                  <p className="overview-label">{t("dashboardh.completed")}</p>
                </div>
                <div className="overview-item">
                  <p className="overview-value">
                    {stats.overview.today_inquiries}
                  </p>
                  <p className="overview-label">{t("dashboardh.today")}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
