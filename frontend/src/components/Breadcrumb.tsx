import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
            <ol style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                listStyle: 'none',
                padding: 0,
                margin: 0
            }}>
                {items.map((item, index) => (
                    <li key={item.path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {index > 0 && (
                            <span style={{ color: '#9ca3af' }}>/</span>
                        )}
                        {index === items.length - 1 ? (
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                style={{
                                    color: '#3b82f6',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#2563eb';
                                    e.currentTarget.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#3b82f6';
                                    e.currentTarget.style.textDecoration = 'none';
                                }}
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
