import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './StatisticsSection.module.css';

const StatisticsSection = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const docRef = doc(db, 'settings', 'statistics');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStatistics(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.statisticsSection}>Loading...</div>;
  }

  if (!statistics) {
    return null;
  }

  const { leftStats = [], rightStats = [] } = statistics;

  const StatCard = ({ icon, title, description }) => (
    <div className={styles.statCard}>
      <div className={styles.iconContainer}>
        {icon}
      </div>
      <h3 className={styles.statTitle}>
        {title}
      </h3>
      <p className={styles.statDescription}>
        {description}
      </p>
      <span className={styles.learnMore}>
        Learn More →
      </span>
    </div>
  );

  return (
    <div className={styles.statisticsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          oncode is the Leading Higher Education Institute in Sri Lanka
        </h2>
        
        <div className={styles.grid}>
          <div>
            {leftStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          <div>
            {rightStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
