import React, { useState } from 'react';
import styles from './FAQ.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

interface FAQItem {
  id?: string | number;
  question: string;
  answer: string;
}

interface FAQProps {
  faqs?: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <div 
          ref={headerRef}
          className={`${styles.sectionHeader} ${headerVisible ? styles.animate : ''}`}
        >
          <h2>Frequently Asked Questions</h2>
          <div className={styles.line}></div>
          <p>Find answers to common questions about our services and projects</p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`${styles.faqItem} ${expandedIndex === index ? styles.expanded : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div 
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.contactCTA}>
          <h3>Still have questions?</h3>
          <p>Contact our team to discuss your specific project requirements</p>
          <a href="#contact" className={styles.ctaButton}>Get in Touch</a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
