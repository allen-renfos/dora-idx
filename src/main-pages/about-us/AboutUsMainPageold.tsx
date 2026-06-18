import Image from "next/image";

export default function AboutUsMainPageold() {
    return (
        <>
            <section className="hero" style={{ backgroundImage: "url('images/aboutus-coverpic.png')" }}>
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <div>
                                <span className="menu-div yellow-text">About Us</span>

                            </div>
                            <span className="heading-text">Presenting Robert Story</span>
                            <p className="heading-sub-text">Get to know Robert leading luxury real estate agents.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exclusive Network Section */}
            <section className="network-section">
                <div className="container">
                    <div className="network-grid">
                        <div className="network-left">
                            <h2 className="second-header-text">Exclusive Network for the<br />World\'s Most Successful Agent</h2>
                        </div>
                        <div className="network-right">
                            <p>Top priority, and she is committed to walking with them</p>
                        </div>
                    </div>
                    <div className="network-logos">
                        <Image src="/images/aboutus-banner.png" alt="Network logos" width={1400} height={120} style={{ width: "100%", height: "auto" }} />

                    </div>
                </div>
            </section>

            {/* Advisor Video & Quote Section */}
            <section className="advisor-section">
                <div className="advisor-video">
                    <Image src="/images/property-1.png" alt="Luxury Property" width={1735} height={900} />
                    <button className="play-button">Play ▶</button>
                </div>

                <div className="advisor-quote-container">
                    <span className="quote-icon">“</span>
                    <div className="advisor-quote">
                        <p>With a strong foundation in real estate since 2002, combined with expertise in corporate law, this professional has built a distinguished career in the industry. Recognized among the Best Real Estate with expertise in corporate law, this professional has built a distinguished career.</p>
                        <h3>Mr George John</h3>
                        <span>Trusted Global Advisor.</span>
                    </div>
                </div>
            </section>

            {/* Advisor Profile Section */}
            <section className="profile-section bg-[#171717]">
                <div className="profile-grid">
                    <div className="profile-image">
                        <Image src="/images/globaladvisorimage.png" alt="Advisor" width={500} height={500} />
                    </div>
                    <div className="profile-content">
                        <h2 className="second-header-text">Mr George John</h2>
                        <h4>Trusted Global Advisor.</h4>
                        <p>With a strong foundation in real estate since 2002, combined with expertise in corporate law, this professional has built a distinguished career in the industry. Recognized among the Best Real Estate with expertise in corporate law, this professional has built a distinguished career.</p>
                        <p>The Wall Street Journal, they rank in the <strong>top 1.5%</strong> of all agents, consistently delivering exceptional results.</p>
                        <button className="btn-primary">Send Inquire</button>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="mission-section">
                <h2 className="second-header-text">Our Mission and Vission</h2>
                <p className="section-sub">We've been representing buyers and sellers in Santa Barbara County for over twenty years and we're the top-producing independently owned real estate company in the area.</p>
                <div className="mission-grid">
                    <div className="mission-row">
                        <div className="mission-label">Community<br />Involvement</div>
                        <div className="mission-card">Our agents do more than just sell homes. They teach, coach, volunteer, fundraise, and champion non-profits to make a difference in the community that they serve.</div>
                    </div>
                    <div className="mission-row">
                        <div className="mission-label">Agent<br />Development</div>
                        <div className="mission-card">We've always been our agent’s biggest advocates. To foster their growth and success we ensure they’re supported with superior staff, the latest technology tools, an accessible management team, and ongoing training and education.</div>
                    </div>
                    <div className="mission-row">
                        <div className="mission-label">Passionate<br />Professionals</div>
                        <div className="mission-card">We love what we do. And it shows. We’re passionate about working together collaboratively with the singular goal of achieving our client’s objectives. Whatever they may be.</div>
                    </div>
                    <div className="mission-row">
                        <div className="mission-label">Excellence<br />in Service</div>
                        <div className="mission-card">We pride ourselves on unparalleled customer service. In a word, combining premier agents, with excellent support staff, a dynamic management team, and the most progressive marketing techniques.</div>
                    </div>
                </div>
            </section>

            {/* Work With Us Section */}
            <section className="work-section">
                <div className="work-grid">
                    <div className="work-left">
                        <Image src="/images/workwithusimg.png" alt="Property" width={800} height={600} />
                    </div>
                    <div className="work-right">
                        <h2>Work with us</h2>
                        <p className="sub">We are always looking to partner with the brand that elevate the experience for our member</p>
                        <div className="info-block">
                            <div className="info-title">Partner Email:</div>
                            <div className="info-value">Info@Robert.com</div>
                        </div>
                        <div className="info-block">
                            <div className="info-title">Membership Email:</div>
                            <div className="info-value">Info@gmail.com</div>
                        </div>
                        <button className="btn-primary">Connect</button>
                        <p className="call-text">Call us at <span className="call-number">(214) 518-2366</span></p>
                    </div>
                </div>
            </section>

            {/* Proven Results Section */}
            <section className="results-section">
                <h2 className="second-header-text">Proven Results</h2>
                <p className="section-sub">We've been representing buyers and sellers in Santa Barbara</p>
                <div className="results-grid">
                    <div className="result-item">
                        <div className="result-number">$ 2.5B</div>
                        <div className="result-label">In Career Sales</div>
                    </div>
                    <div className="result-item">
                        <div className="result-number">#1</div>
                        <div className="result-label">Sotheby’s International Reality<br />Agent Worldwide</div>
                    </div>
                    <div className="result-item">
                        <div className="result-number">$561 M</div>
                        <div className="result-label">Total Sales in 2024</div>
                    </div>
                    <div className="result-item">
                        <div className="result-number">#1</div>
                        <div className="result-label">Real Estate Agent in USA</div>
                    </div>
                </div>
            </section>


        </>
    )
}