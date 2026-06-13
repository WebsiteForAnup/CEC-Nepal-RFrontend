-- Create table for news and events
CREATE TABLE IF NOT EXISTS news_events (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('news', 'event')),
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    image TEXT,
    category VARCHAR(100),
    author VARCHAR(100) DEFAULT 'CEC Nepal Team',
    content TEXT,
    rich_content JSONB DEFAULT '[]'::jsonb, -- list of block-type objects (e.g. paragraphs, images, videos)
    related_news_slugs JSONB DEFAULT '[]'::jsonb, -- array of related news slugs
    is_demo BOOLEAN DEFAULT FALSE,
    
    -- Optional fields for events and project updates
    location VARCHAR(255),
    cec_role VARCHAR(255),
    capacity VARCHAR(100),
    status VARCHAR(100),
    project_specs JSONB DEFAULT '{}'::jsonb, -- dynamic specifications for projects/events
    
    -- Additional fields from feed.json
    start_date DATE,
    breakthrough_date DATE,
    registration VARCHAR(255),
    award_name VARCHAR(255),
    trainer VARCHAR(255),
    team VARCHAR(255),
    coordinator VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_news_events_slug ON news_events(slug);

-- Enable Row-Level Security (RLS)
ALTER TABLE news_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow read-only access to everyone
CREATE POLICY "Allow public read access" 
ON news_events 
FOR SELECT 
USING (true);

-- Allow write access only to authenticated users (admin panel)
CREATE POLICY "Allow authenticated insert" 
ON news_events 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update" 
ON news_events 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" 
ON news_events 
FOR DELETE 
TO authenticated 
USING (true);

-- View to retrieve related news and events for each record
CREATE OR REPLACE VIEW related_news_events AS
SELECT 
    ne.id AS news_event_id,
    ne.slug AS news_event_slug,
    r.id AS related_id,
    r.slug AS related_slug,
    r.title AS related_title,
    r.type AS related_type,
    r.date AS related_date,
    r.image AS related_image,
    r.category AS related_category
FROM news_events ne
JOIN news_events r ON ne.related_news_slugs ? r.slug;

-- Seed data from feed.json
INSERT INTO news_events (
    id, slug, type, title, date, description, image, category, author, content, 
    rich_content, related_news_slugs, is_demo, start_date, breakthrough_date, 
    cec_role, project_specs, location, status, capacity, registration, 
    award_name, trainer, team, coordinator
) VALUES 
(
    1, 
    'breakthrough-upper-kabeli-hydropower-tunnel', 
    'news', 
    'Breakthrough of 4896 m long Headrace Tunnel of Upper Kabeli Hydropower Project, 28.10 MW', 
    '2026-06-07', 
    'A major milestone was achieved on 7th June 2026 with the breakthrough of the 4896 m long Headrace Tunnel of Upper Kabeli Hydropower Project (28.10 MW) in eastern Nepal, where CEC Nepal is acting as the Design and Supervision Consultant.', 
    '/images/news/viber_image_2026-06-07_17-20-29-514.jpg', 
    'Project Milestone', 
    'CEC Nepal Team', 
    'We are thrilled to report a landmark achievement for CEC Nepal and the Upper Kabeli Hydropower Project (28.10 MW). On 7th June 2026, the breakthrough of the 4896 m long Headrace Tunnel was successfully completed, marking the culmination of intense engineering effort, dedication, and expertise since construction commenced on 1st April 2024.

As the Design and Supervision Consultant for this vital renewable energy initiative, CEC Nepal has provided comprehensive technical supervision, quality control, and detailed engineering design throughout the tunneling process. The successful connection of the tunnel headings is a testament to the robust planning, precise surveying, and coordinated action between the developers, contractors, and our supervisory team.

This breakthrough brings us one step closer to commissioning the 28.10 MW run-of-the-river project, which will feed clean energy into Nepal''s national grid, contributing to the country''s sustainable development and energy security goals.', 
    '[
        {"type": "paragraph", "value": "We are thrilled to report a landmark achievement for CEC Nepal and the Upper Kabeli Hydropower Project (28.10 MW). On <strong>7th June 2026</strong>, the breakthrough of the 4,896-meter-long Headrace Tunnel was successfully completed, marking the culmination of intense engineering effort, dedication, and expertise since construction commenced on <strong>1st April 2024</strong>."},
        {"type": "image", "url": "/images/news/viber_image_2026-06-07_17-23-08-251.jpg", "caption": "Breakthrough of 4896 m long Headrace Tunnel of Upper Kabeli Hydropower Project, 28.10 MW"},
        {"type": "paragraph", "value": "As the <strong>Design and Supervision Consultant</strong> for this vital renewable energy initiative, CEC Nepal has provided comprehensive technical supervision, quality control, and detailed engineering design throughout the tunneling process. The successful connection of the tunnel headings is a testament to the robust planning, precise surveying, and coordinated action between the developers, contractors, and our supervisory team."},
        {"type": "paragraph", "value": "This breakthrough brings us one step closer to commissioning the 28.10 MW run-of-the-river project, which will feed clean energy into Nepal''s national grid, contributing to the country''s sustainable development and energy security goals."},
        {"type": "youtube-shorts", "url": "https://youtube.com/shorts/cbQLjEED2aE?feature=share", "caption": "Breakthrough of 4896 m long Headrace Tunnel of Upper Kabeli Hydropower Project, 28.10 MW"}
    ]'::jsonb, 
    '[]'::jsonb, 
    false, 
    '2024-04-01', 
    '2026-06-07', 
    'Design and Supervision Consultant', 
    '{
        "title": "Upper Kabeli Hydropower Specifications",
        "capacity": "28.10 MW",
        "tunnelLength": "4896 m",
        "location": "Taplejung/Panchthar, Nepal",
        "startDate": "2024-04-01",
        "breakthroughDate": "2026-06-07",
        "cecRole": "Design and Supervision Consultant",
        "stakeholders": "Kabeli Energy Limited / Nepal Electricity Authority"
    }'::jsonb, 
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
),
(
    2, 
    'cec-nepal-completes-major-infrastructure-project', 
    'news', 
    'CEC Nepal Completes Major Infrastructure Project', 
    '2026-01-28', 
    'CEC Nepal successfully delivered the final phase of the hydroelectric project, setting new industry standards for engineering excellence and sustainable development.', 
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=60', 
    'Project Update', 
    'CEC Nepal Team', 
    'CEC Nepal is proud to announce the successful completion of the major infrastructure project. This milestone represents years of dedicated work, innovative engineering solutions, and commitment to sustainable development.

The project involved multiple phases and complex engineering challenges that were overcome through our team''s expertise and dedication. We implemented cutting-edge technologies and best practices in hydroelectric project development.

Key achievements include:
- 150 MW hydroelectric capacity
- Sustainable power generation for 500,000 households
- Environmental impact mitigation strategies
- Community engagement and support
- International standard compliance

This project demonstrates CEC Nepal''s capability to deliver world-class infrastructure solutions that meet both technical and environmental standards. We remain committed to advancing Nepal''s energy sector while maintaining our high standards of engineering excellence.', 
    '[
        {"type": "paragraph", "value": "CEC Nepal is proud to announce the successful completion of the major infrastructure project. This milestone represents years of dedicated work, innovative engineering solutions, and commitment to sustainable development."},
        {"type": "image", "url": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80", "caption": "Clean energy generator turbine at completion site"},
        {"type": "paragraph", "value": "The project involved multiple phases and complex engineering challenges that were overcome through our team''s expertise and dedication. We implemented cutting-edge technologies and best practices in hydroelectric project development."},
        {"type": "youtube-shorts", "url": "https://youtube.com/shorts/cbQLjEED2aE?feature=share", "caption": "Breakthrough of 4896 m long Headrace Tunnel of Upper Kabeli Hydropower Project, 28.10 MW"},
        {"type": "paragraph", "value": "<strong>Key achievements of this installation include:</strong><br/>• 150 MW clean hydroelectric capacity<br/>• Sustainable power generation for over 500,000 households<br/>• Comprehensive environmental impact mitigation strategies<br/>• Complete local community engagement and structural support<br/>• Full international safety and engineering standard compliance"},
        {"type": "video", "url": "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4", "caption": "Simulation: Flow velocity and turbine test parameters"},
        {"type": "paragraph", "value": "This project demonstrates CEC Nepal''s capability to deliver world-class infrastructure solutions that meet both technical and environmental standards. We remain committed to advancing Nepal''s energy sector while maintaining our high standards of engineering excellence."},
        {"type": "facebook", "url": "https://www.facebook.com/20531316728/posts/10154009990506729/", "caption": "Official announcement share from social media channels"}
    ]'::jsonb, 
    '["industry-seminar-future-of-renewable-energy", "cec-nepal-receives-international-engineering-award"]'::jsonb, 
    true, 
    NULL, NULL, NULL, '{}'::jsonb, 
    'Eastern Nepal', 
    'Completed', 
    NULL, NULL, NULL, NULL, NULL, NULL
),
(
    3, 
    'industry-seminar-future-of-renewable-energy', 
    'event', 
    'Industry Seminar: Future of Renewable Energy', 
    '2026-02-15', 
    'Join us for an exclusive seminar featuring industry experts discussing the latest trends in renewable energy and sustainable engineering solutions.', 
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60', 
    'Workshop', 
    'CEC Events', 
    'CEC Nepal invites you to attend our Industry Seminar on the Future of Renewable Energy. This is a unique opportunity to gain insights from leading experts in the renewable energy sector.

Event Details:
- Date: February 15, 2026
- Time: 9:00 AM - 5:00 PM
- Location: CEC Nepal Headquarters, Kathmandu
- Duration: Full Day

Topics Covered:
- Latest trends in hydropower development
- Solar and wind energy integration
- Smart grid technologies
- Environmental sustainability practices
- Financing and investment opportunities

Speakers include:
- International hydropower consultants
- Government regulatory officials
- Project developers and investors
- Academic researchers

This seminar is an excellent platform for networking, learning, and exploring collaboration opportunities in the renewable energy sector.', 
    '[]'::jsonb, 
    '["cec-nepal-receives-international-engineering-award", "career-development-workshop"]'::jsonb, 
    true, 
    NULL, NULL, NULL, '{}'::jsonb, 
    'Kathmandu', 
    NULL, 
    '200 participants', 
    'Available on website', 
    NULL, NULL, NULL, NULL
),
(
    4, 
    'cec-nepal-receives-international-engineering-award', 
    'news', 
    'CEC Nepal Receives International Engineering Award', 
    '2026-01-20', 
    'Our innovative approach to sustainable infrastructure development has been recognized with the prestigious International Engineering Excellence Award 2026.', 
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60', 
    'Recognition', 
    'CEC Nepal', 
    'CEC Nepal has been honored with the prestigious International Engineering Excellence Award 2026, recognizing our outstanding contributions to sustainable infrastructure development.

This award acknowledges:
- Excellence in engineering design and implementation
- Commitment to environmental sustainability
- Innovation in renewable energy solutions
- Professional ethics and integrity
- Community impact and social responsibility

The award was presented at the International Engineering Conference in recognition of our work on multiple hydroelectric projects and our commitment to advancing Nepal''s energy infrastructure.

Awards and recognition are a testament to our team''s dedication, expertise, and unwavering commitment to excellence. As we continue to grow, we remain committed to delivering world-class engineering solutions that benefit society and the environment.', 
    '[]'::jsonb, 
    '["cec-nepal-completes-major-infrastructure-project", "career-development-workshop"]'::jsonb, 
    true, 
    NULL, NULL, NULL, '{}'::jsonb, 
    'International', 
    NULL, NULL, NULL, 
    'International Engineering Excellence Award 2026', 
    NULL, NULL, NULL
),
(
    5, 
    'career-development-workshop', 
    'event', 
    'Career Development Workshop', 
    '2026-02-20', 
    'Enhance your career prospects with our comprehensive workshop on professional development, leadership, and technical skills in the engineering sector.', 
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60', 
    'Workshop', 
    'HR Department', 
    'Join CEC Nepal for an intensive Career Development Workshop designed to enhance your professional skills and advance your career in the engineering sector.

Workshop Agenda:
- Module 1: Leadership and Management Skills
- Module 2: Technical Excellence and Innovation
- Module 3: Project Management Best Practices
- Module 4: Communication and Professional Development
- Module 5: Networking and Career Advancement

Benefits:
- Learn from industry experts
- Develop practical skills
- Network with professionals
- Receive certification
- Explore career advancement opportunities

This workshop is open to engineers, project managers, and professionals looking to advance their careers in the renewable energy and infrastructure sectors.', 
    '[]'::jsonb, 
    '["industry-seminar-future-of-renewable-energy"]'::jsonb, 
    true, 
    NULL, NULL, NULL, '{}'::jsonb, 
    'Kathmandu', 
    NULL, 
    '50 participants', 
    NULL, NULL, 
    'Expert Consultants', 
    NULL, NULL
),
(
    6, 
    'expansion-announcement-new-office-in-pokhara', 
    'news', 
    'Expansion Announcement: New Office in Pokhara', 
    '2026-01-15', 
    'CEC Nepal announces the opening of a new regional office in Pokhara to better serve clients and expand our engineering services across Nepal.', 
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60', 
    'Company News', 
    'Management', 
    'CEC Nepal is excited to announce the opening of a new regional office in Pokhara, expanding our presence and services across Nepal.

This expansion marks a significant milestone in our growth strategy and demonstrates our commitment to serving clients throughout the country.

New Office Details:
- Location: Pokhara Metropolitan Area
- Services: Engineering consultation, project management, feasibility studies
- Team: Experienced professionals with local expertise
- Opening: Q2 2026

Benefits of the Pokhara Office:
- Closer proximity to clients in Western Nepal
- Enhanced service delivery
- Local employment opportunities
- Support for regional development projects
- Strengthened relationships with local stakeholders

This expansion will enable us to better serve our growing client base and contribute to infrastructure development in Western Nepal.', 
    '[]'::jsonb, 
    '["cec-nepal-completes-major-infrastructure-project", "expansion-announcement-new-office-in-pokhara"]'::jsonb, 
    true, 
    NULL, NULL, NULL, '{}'::jsonb, 
    'Pokhara', 
    NULL, NULL, NULL, NULL, NULL, 
    'To be announced', 
    NULL
),
(
    7, 
    'community-outreach-engineering-for-change', 
    'event', 
    'Community Outreach: Engineering for Change', 
    '2026-03-05', 
    'Participate in our community outreach program dedicated to bringing sustainable engineering solutions to underserved communities in Nepal.', 
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60', 
    'Community', 
    'Social Responsibility Team', 
    'CEC Nepal''s Community Outreach Program - Engineering for Change aims to bring sustainable engineering solutions to underserved communities across Nepal.

Program Overview:
- Provide technical expertise and resources
- Implement sustainable water and energy solutions
- Build local capacity through training
- Support community development initiatives
- Create lasting positive impact

Target Communities:
- Remote rural areas
- Underserved municipalities
- Communities affected by resource scarcity
- Youth development programs

How to Participate:
- Volunteer opportunities for professionals
- Community engagement
- Partnership opportunities
- Sponsorship possibilities

Through this program, we aim to leverage our engineering expertise to create positive change and contribute to sustainable development in Nepal''s communities.', 
    '[]'::jsonb, 
    '["cec-nepal-completes-major-infrastructure-project", "cec-nepal-receives-international-engineering-award"]'::jsonb, 
    true, 
    NULL, NULL, NULL, '{}'::jsonb, 
    'Multiple Locations', 
    NULL, NULL, NULL, NULL, NULL, NULL, 
    'CSR Department'
)
ON CONFLICT (slug) DO NOTHING;

-- Adjust sequence if manual ids are inserted
SELECT setval('news_events_id_seq', COALESCE((SELECT MAX(id)+1 FROM news_events), 1), false);
