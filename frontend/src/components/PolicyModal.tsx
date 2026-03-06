import React, { useState, useRef, useEffect } from 'react';
import { Confetti, type ConfettiRef } from '../components/ui/confetti';
import { useNotifications } from '../contexts/NotificationContext';

interface PolicyConfig {
    id: string;
    title: string;
    question: string;
    answers: string[];
    correctAnswer: string;
    complianceProperty: string;
    icon: string;
    successMessage: string;
}

const POLICIES: Record<string, PolicyConfig> = {
    '1': {
        id: '1',
        title: 'Malnutrition',
        question: 'How does the system ensure adequate food resources are provided?',
        answers: [
            'Regular food distribution with nutritional tracking',
            'Monthly food vouchers without monitoring',
            'No formal food provision system',
            'Other',
        ],
        correctAnswer: 'Regular food distribution with nutritional tracking',
        complianceProperty: 'hungry-compliant',
        icon: '🍔',
        successMessage: 'Your LSEGling was given food!',
    },
    '2': {
        id: '2',
        title: 'Need shelter',
        question: 'How does the system ensure adequate shelter is provided?',
        answers: [
            'Permanent housing with safety standards',
            'Temporary shelter without standards',
            'No formal shelter provision',
            'Other',
        ],
        correctAnswer: 'Permanent housing with safety standards',
        complianceProperty: 'wet-compliant',
        icon: '🏠',
        successMessage: 'Your LSEGling was given shelter!',
    },
    '3': {
        id: '3',
        title: 'Need sleep',
        question: 'How does the system ensure adequate rest periods are provided?',
        answers: [
            'Mandatory rest periods with monitoring',
            'Suggested rest periods without enforcement',
            'No formal rest policy',
            'Other',
        ],
        correctAnswer: 'Mandatory rest periods with monitoring',
        complianceProperty: 'tired-compliant',
        icon: '😴',
        successMessage: 'Your LSEGling can now rest!',
    },
    '4': {
        id: '4',
        title: 'Need water',
        question: 'How does the system ensure adequate water access is provided?',
        answers: [
            'Clean water access with quality testing',
            'Water access without quality checks',
            'No formal water provision',
            'Other',
        ],
        correctAnswer: 'Clean water access with quality testing',
        complianceProperty: 'thirsty-compliant',
        icon: '💧',
        successMessage: 'Your LSEGling was given water!',
    },
};

interface PolicyModalProps {
    policyId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyId, isOpen, onClose }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const confettiRef = useRef<ConfettiRef>(null);
    const { refreshData } = useNotifications();

    const policy = policyId ? POLICIES[policyId] : null;

    useEffect(() => {
        if (showSuccess && confettiRef.current) {
            // Fire confetti multiple times for a fireworks effect
            const fireConfetti = () => {
                confettiRef.current?.fire({
                    particleCount: 100,
                    spread: 70,
                    origin: { x: 0.5, y: 0.5 },
                    colors: ['#58cc02', '#1cb0f6', '#ff4b9a', '#ffc800', '#ffffff'],
                });
            };

            // Initial burst
            fireConfetti();

            // Additional bursts for fireworks effect
            const timeouts = [
                setTimeout(() => fireConfetti(), 200),
                setTimeout(() => fireConfetti(), 400),
                setTimeout(() => {
                    confettiRef.current?.fire({
                        particleCount: 50,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0.3, y: 0.6 },
                    });
                }, 300),
                setTimeout(() => {
                    confettiRef.current?.fire({
                        particleCount: 50,
                        angle: 120,
                        spread: 55,
                        origin: { x: 0.7, y: 0.6 },
                    });
                }, 500),
            ];

            return () => {
                timeouts.forEach(timeout => clearTimeout(timeout));
            };
        }
    }, [showSuccess]);

    const handleAnswerClick = (option: string) => {
        if (isSubmitting || !policy) return;

        setIsSubmitting(true);

        const isCompliant = option === policy.correctAnswer;
        localStorage.setItem(policy.complianceProperty, isCompliant.toString());

        if (isCompliant) {
            setShowSuccess(true);
            // Refresh data immediately to update duck and project cards
            refreshData();
            setTimeout(() => {
                setShowSuccess(false);
                setIsSubmitting(false);
                onClose();
            }, 2000);
        } else {
            setShowError(true);
            // Refresh data to show the error state
            refreshData();
            setTimeout(() => {
                setShowError(false);
                setIsSubmitting(false);
                onClose();
            }, 2000);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setShowSuccess(false);
            setShowError(false);
            onClose();
        }
    };

    if (!isOpen || !policy) return null;

    return (
        <>
            <Confetti ref={confettiRef} />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}
                onClick={handleClose}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        maxWidth: '48rem',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '3rem',
                        position: 'relative'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    {!isSubmitting && (
                        <button
                            onClick={handleClose}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#6b7280',
                                padding: '0.5rem',
                                lineHeight: 1
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#6b7280';
                            }}
                        >
                            ✕
                        </button>
                    )}

                    {/* Success Animation */}
                    {showSuccess && (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            {/* Progress Bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '8px',
                                backgroundColor: '#e5e5e5',
                                overflow: 'hidden',
                                borderRadius: '1rem 1rem 0 0'
                            }}>
                                <div style={{
                                    height: '100%',
                                    backgroundColor: '#58cc02',
                                    animation: 'progressBar 2s linear forwards'
                                }} />
                            </div>
                            <style>
                                {`
                                    @keyframes progressBar {
                                        from { width: 100%; }
                                        to { width: 0%; }
                                    }
                                    @keyframes bounceIn {
                                        0% { transform: scale(0); opacity: 0; }
                                        50% { transform: scale(1.1); }
                                        100% { transform: scale(1); opacity: 1; }
                                    }
                                    @keyframes slideUp {
                                        from { transform: translateY(20px); opacity: 0; }
                                        to { transform: translateY(0); opacity: 1; }
                                    }
                                `}
                            </style>

                            {/* Success Icon */}
                            <div style={{
                                fontSize: '8rem',
                                marginBottom: '1.5rem',
                                animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                            }}>
                                ✅
                            </div>

                            {/* Success Title */}
                            <h2 style={{
                                fontFamily: '"Bricolage Grotesque", sans-serif',
                                fontSize: '3rem',
                                fontWeight: '800',
                                color: '#58cc02',
                                marginBottom: '1rem',
                                letterSpacing: '-0.02em',
                                animation: 'slideUp 0.5s ease-out 0.2s backwards'
                            }}>
                                Awesome!
                            </h2>

                            {/* Success Message */}
                            <div style={{
                                backgroundColor: '#d7ffb8',
                                border: '3px solid #58cc02',
                                borderRadius: '1rem',
                                padding: '1.5rem 2rem',
                                marginBottom: '1rem',
                                animation: 'slideUp 0.5s ease-out 0.3s backwards'
                            }}>
                                <p style={{
                                    fontFamily: '"Bricolage Grotesque", sans-serif',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#3c3c3c',
                                    margin: 0
                                }}>
                                    {policy.successMessage} {policy.icon}
                                </p>
                            </div>

                            {/* Status Message */}
                            <p style={{
                                fontFamily: '"Bricolage Grotesque", sans-serif',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#58cc02',
                                margin: 0,
                                animation: 'slideUp 0.5s ease-out 0.4s backwards'
                            }}>
                                Policy is now compliant ✨
                            </p>
                        </div>
                    )}

                    {/* Error Animation */}
                    {showError && (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            {/* Progress Bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '8px',
                                backgroundColor: '#e5e5e5',
                                overflow: 'hidden',
                                borderRadius: '1rem 1rem 0 0'
                            }}>
                                <div style={{
                                    height: '100%',
                                    backgroundColor: '#ff4b4b',
                                    animation: 'progressBar 2s linear forwards'
                                }} />
                            </div>

                            {/* Error Icon */}
                            <div style={{
                                fontSize: '8rem',
                                marginBottom: '1.5rem',
                                animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                            }}>
                                ❌
                            </div>

                            {/* Error Title */}
                            <h2 style={{
                                fontFamily: '"Bricolage Grotesque", sans-serif',
                                fontSize: '3rem',
                                fontWeight: '800',
                                color: '#ff4b4b',
                                marginBottom: '1rem',
                                letterSpacing: '-0.02em',
                                animation: 'slideUp 0.5s ease-out 0.2s backwards'
                            }}>
                                Not quite!
                            </h2>

                            {/* Error Message */}
                            <div style={{
                                backgroundColor: '#ffc1c1',
                                border: '3px solid #ff4b4b',
                                borderRadius: '1rem',
                                padding: '1.5rem 2rem',
                                marginBottom: '1rem',
                                animation: 'slideUp 0.5s ease-out 0.3s backwards'
                            }}>
                                <p style={{
                                    fontFamily: '"Bricolage Grotesque", sans-serif',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#3c3c3c',
                                    margin: 0
                                }}>
                                    That answer does not meet compliance requirements.
                                </p>
                            </div>

                            {/* Status Message */}
                            <p style={{
                                fontFamily: '"Bricolage Grotesque", sans-serif',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#ff4b4b',
                                margin: 0,
                                animation: 'slideUp 0.5s ease-out 0.4s backwards'
                            }}>
                                Policy remains non-compliant 💔
                            </p>
                        </div>
                    )}

                    {/* Policy Section */}
                    {!showSuccess && !showError && (
                        <>
                            {/* Policy Title */}
                            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                                <h1 style={{
                                    fontFamily: '"Bricolage Grotesque", sans-serif',
                                    fontSize: '2.5rem',
                                    fontWeight: '800',
                                    color: '#111827',
                                    marginBottom: '1rem',
                                    letterSpacing: '-0.02em'
                                }}>
                                    {policy.icon} Policy {policy.id}: {policy.title}
                                </h1>
                                <p style={{
                                    fontFamily: '"Bricolage Grotesque", sans-serif',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    {policy.question}
                                </p>
                            </div>

                            {/* Answer Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {policy.answers.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerClick(option)}
                                        disabled={isSubmitting}
                                        style={{
                                            width: '100%',
                                            padding: '1.5rem',
                                            fontSize: '1.125rem',
                                            fontWeight: '600',
                                            textAlign: 'left',
                                            border: '2px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            backgroundColor: 'white',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            opacity: isSubmitting ? 0.5 : 1,
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                                e.currentTarget.style.backgroundColor = '#eff6ff';
                                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                                e.currentTarget.style.backgroundColor = 'white';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default PolicyModal;
