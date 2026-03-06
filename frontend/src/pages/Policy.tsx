import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

export const Policy: React.FC = () => {
    const { policyId } = useParams<{ policyId: string }>();
    const navigate = useNavigate();

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const policy = policyId ? POLICIES[policyId] : null;

    const handleAnswerClick = (option: string) => {
        if (isSubmitting || !policy) return;

        setIsSubmitting(true);

        // Check if answer is correct (compliant)
        const isCompliant = option === policy.correctAnswer;

        // Set compliance property in localStorage
        localStorage.setItem(policy.complianceProperty, isCompliant.toString());

        if (isCompliant) {
            // Show success and redirect to dashboard
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else {
            // Show error and redirect back to dashboard (policy will still show)
            setShowError(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    };

    if (!policy) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', color: '#dc2626', fontWeight: 'bold' }}>
                        Policy not found
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: '1rem',
                            color: '#2563eb',
                            textDecoration: 'underline',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'white',
            padding: '3rem 2rem'
        }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
                {/* Success Animation */}
                {showSuccess && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>✅</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '1rem' }}>
                            Correct!
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
                            {policy.successMessage} {policy.icon}
                        </p>
                        <p style={{ fontSize: '1rem', color: '#16a34a', marginTop: '1rem' }}>
                            Policy is now compliant. Redirecting...
                        </p>
                    </div>
                )}

                {/* Error Animation */}
                {showError && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>❌</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>
                            Incorrect
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
                            That answer does not meet compliance requirements.
                        </p>
                        <p style={{ fontSize: '1rem', color: '#dc2626', marginTop: '1rem' }}>
                            Policy remains non-compliant. Redirecting...
                        </p>
                    </div>
                )}

                {/* Policy Section */}
                {!showSuccess && !showError && (
                    <>
                        {/* Policy Title */}
                        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                                {policy.icon} Policy {policy.id}: {policy.title}
                            </h1>
                            <p style={{ fontSize: '1.25rem', color: '#374151' }}>
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

                        {/* Back Button */}
                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    color: '#6b7280',
                                    textDecoration: 'underline',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#111827';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#6b7280';
                                }}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Policy;
