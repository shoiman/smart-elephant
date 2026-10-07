import { useState } from 'react';
import { useI18n } from '../shared/i18n';
import { useProgress, useProgressAnalysis } from '../services/useApi';
import './ProgressPage.css';

// Mock child ID - TODO: Replace with actual child selection
const MOCK_CHILD_ID = 1;

export function ProgressPage() {
  const { t } = useI18n();
  const [childId] = useState(MOCK_CHILD_ID);
  
  // Fetch progress data
  const progressHook = useProgress(childId);
  const { data: progress, loading: progressLoading, error: progressError } = progressHook;
  
  // Fetch LLM analysis (manual trigger)
  const analysisHook = useProgressAnalysis(null);
  const { data: analysis, loading: analysisLoading, error: analysisError } = analysisHook;

  const handleRequestAnalysis = () => {
    analysisHook.retry();
  };

  // Calculate level color based on difficulty string
  const getLevelColor = (level: string) => {
    if (level === 'EASY') return '#4CAF50'; // Green
    if (level === 'MEDIUM') return '#FFC107'; // Amber
    return '#F44336'; // Red (HARD)
  };

  if (progressLoading) {
    return (
      <div className="progress-page">
        <div className="progress-loading">
          <div className="spinner"></div>
          <p>{t('progress.loading')}</p>
        </div>
      </div>
    );
  }

  if (progressError || !progress) {
    return (
      <div className="progress-page">
        <div className="progress-error">
          <h2>{t('progress.error')}</h2>
          <p>{progressError?.message || 'Failed to load progress'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <div className="progress-container">
        {/* Header */}
        <div className="progress-header">
          <h1>{t('progress.title')}</h1>
          <p className="subtitle">{t('progress.subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Total Games */}
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <h3>{t('progress.totalGames')}</h3>
              <p className="stat-value">{progress.totalGames}</p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{t('progress.successRate')}</h3>
              <p className="stat-value">{Math.round(progress.successRate)}%</p>
            </div>
          </div>

          {/* Current Level */}
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{t('progress.currentLevel')}</h3>
              <p className="stat-value" style={{ color: getLevelColor(progress.currentLevel) }}>
                {progress.currentLevel}
              </p>
            </div>
          </div>

          {/* Total Correct */}
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>{t('progress.correctAnswers')}</h3>
              <p className="stat-value">{progress.totalCorrect}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <h2>{t('progress.overallProgress')}</h2>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.successRate}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {progress.totalCorrect} / {progress.totalGames} {t('progress.correct')}
            </p>
          </div>
        </div>

        {/* Recent Games */}
        {progress.recentGames && progress.recentGames.length > 0 && (
          <div className="progress-section">
            <h2>{t('progress.recentGames')}</h2>
            <div className="recent-games-list">
              {progress.recentGames.map((game, index) => (
                <div key={index} className="game-item">
                  <span className="game-date">
                    {new Date(game.completedAt).toLocaleDateString()}
                  </span>
                  <div className="game-stats">
                    <span className={`game-score ${game.correctAnswers === game.totalQuestions ? 'perfect' : ''}`}>
                      {game.correctAnswers}/{game.totalQuestions}
                    </span>
                    <span className="game-score-points">{game.finalScore} {t('progress.points')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LLM Analysis Section */}
        <div className="progress-section">
          <div className="analysis-header">
            <h2>{t('progress.analysis')}</h2>
            <button
              className="btn-analyze"
              onClick={handleRequestAnalysis}
              disabled={analysisLoading}
            >
              {analysisLoading ? t('progress.analyzing') : t('progress.analyzeProgress')}
            </button>
          </div>

          {analysisError && (
            <div className="analysis-error">
              <p>{analysisError.message}</p>
            </div>
          )}

          {analysis && (
            <div className="analysis-content">
              {/* Strengths */}
              <div className="analysis-box strengths">
                <h3>💪 {t('progress.strengths')}</h3>
                <ul>
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="analysis-box improvements">
                <h3>📈 {t('progress.improvements')}</h3>
                <ul>
                  {analysis.areasForImprovement.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="analysis-box recommendations">
                <h3>🎯 {t('progress.recommendations')}</h3>
                <ul>
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Next Difficulty & Projected Level */}
              <div className="analysis-footer">
                <div className="footer-item">
                  <span className="label">{t('progress.nextDifficulty')}:</span>
                  <span className="value">{analysis.nextDifficulty}</span>
                </div>
                <div className="footer-item">
                  <span className="label">{t('progress.projectedLevel')}:</span>
                  <span className="value">{analysis.projectedLevel}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Last Game Info */}
        {progress.lastGameAt && (
          <div className="progress-section last-game">
            <p className="muted-text">
              {t('progress.lastGameAt')}: {new Date(progress.lastGameAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressPage;
