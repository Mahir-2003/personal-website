const CareerCard = ({ status, company, position, description, img }) => {
    const statusSlug = status.toLowerCase();

    return (
        <article className={`career-card career-card--${statusSlug}`}>
            {/* Colored top accent bar — color driven by status via CSS modifier class */}
            <div className="career-card-topbar" aria-hidden="true" />

            <div className="career-card-body">
                {/* Logo box with LCARS corner accent */}
                <div className="career-card-logo-wrap" aria-hidden="true">
                    <img src={img} alt="" />
                </div>

                {/* Main content */}
                <div className="career-card-content">
                    <div className="career-card-header">
                        <div>
                            <p className="career-card-company">{company}</p>
                            <p className="career-card-position">{position}</p>
                        </div>
                        <span className={`career-card-status career-card-status--${statusSlug}`}>
                            {status}
                        </span>
                    </div>

                    <div className="career-card-divider" aria-hidden="true" />

                    <ul className="career-card-desc">
                        {description.map((d, idx) => (
                            <li key={idx}>
                                <span className="career-chevron" aria-hidden="true">▶</span>
                                {d}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
};

export default CareerCard;
