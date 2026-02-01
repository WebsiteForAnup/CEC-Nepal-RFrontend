import React, { useState } from 'react';
import styles from './FAQ.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

  const faqData = [
    {
      question: 'What services does CEC provide?',
      answer: 'CEC provides comprehensive consulting services including feasibility studies, detailed project reports (DPR), environmental impact assessments, design services for hydropower, solar, and wind projects, as well as bank monitoring and technical audits.'
    },
    {
      question: 'How many projects has CEC studied?',
      answer: 'CEC has successfully studied and consulted on 66 hydropower projects with a combined capacity exceeding 1,200 MW across Nepal, covering various project stages from feasibility to commissioning.'
    },
    {
      question: 'What is the typical timeline for a feasibility study?',
      answer: 'A comprehensive feasibility study typically takes 2-4 months depending on project complexity, site accessibility, and data requirements. The timeline may vary based on project size and environmental factors.'
    },
    {
      question: 'Do you provide bank monitoring services?',
      answer: 'Yes, we provide comprehensive bank monitoring and supervision services including progress monitoring, financial oversight, technical audits, and bill verification for ongoing hydropower and renewable energy projects.'
    },
    {
      question: 'What regions in Nepal do you operate in?',
      answer: 'CEC operates throughout Nepal with projects across eastern, central, and western regions. Our project portfolio includes sites in districts from far-western to far-eastern Nepal, demonstrating our nationwide presence and expertise.'
    },
    {
      question: 'How can I engage CEC for my project?',
      answer: 'You can reach out through our contact form, email, or phone. Our team will discuss your project requirements, provide a proposal, and guide you through the engagement process.'
    },
    {
      question: 'What makes CEC different from other consultancies?',
      answer: 'With 18+ years of experience since 2006, CEC brings proven expertise in Nepal\'s hydropower sector. We offer comprehensive services from conception to commissioning, with a successful track record of 66 studied projects.'
    },
    {
      question: 'Do you handle solar and wind projects as well?',
      answer: 'Yes, beyond our core hydropower expertise, we also provide consulting services for solar, wind, and other renewable energy projects, offering integrated sustainable energy solutions.'
    },
  ];

  const toggleFAQ = (index) => {
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
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${expandedIndex === index ? styles.expanded : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div 
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span className={styles.icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
