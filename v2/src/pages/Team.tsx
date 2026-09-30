import { Link, useSearchParams } from 'react-router-dom';
import Page from '../components/public/Page';
import Inquiry from '../components/public/Inquiry';
import { publicContent } from '../services/publicContent';
export default function Team() {
  const [params] = useSearchParams();
  const group = params.get('group') || '';
  const query = params.get('q') || '';
  return (
    <Page title={publicContent.team.title} intro={publicContent.team.subtitle}>
      <nav className="cec-tabs" aria-label="Team groups">
        <Link to="/team" aria-current={!group ? 'page' : undefined}>
          All people
        </Link>
        {Object.keys(publicContent.teamCategories).map((category) => (
          <Link
            key={category}
            to={'/team?group=' + encodeURIComponent(category)}
            aria-current={group === category ? 'page' : undefined}
          >
            {category}
          </Link>
        ))}
      </nav>
      <form className="cec-filter" method="get">
        <input type="hidden" name="group" value={group} />
        <label>
          Find a team member
          <input name="q" type="search" defaultValue={query} key={query} />
        </label>
        <button type="submit" className="cec-button cec-button--dark">
          Search
        </button>
      </form>
      {Object.entries(publicContent.teamCategories)
        .filter(([category]) => !group || group === category)
        .map(([category, members]) => {
          const filtered = members.filter((member) =>
            member.name.toLowerCase().includes(query.toLowerCase()),
          );
          return (
            <section key={category}>
              <h2>{category}</h2>
              {!filtered.length && <p>No matching team members.</p>}
              <ul className="cec-team-grid">
                {filtered.map((member: any) => (
                  <li key={member.slug}>
                    <article>
                      {member.image_url && (
                        <img src={member.image_url} alt={member.name} loading="lazy" />
                      )}
                      <h3>{member.name}</h3>
                      <p className="cec-person-role">{member.designation}</p>
                      <p>{member.education}</p>
                      <p>{member.experience}</p>
                      {(member.bio || member.more_info) && (
                        <details>
                          <summary>
                            About {member.name.replace(/^(Mr\.|Ms\.|Mrs\.)\s*/, '')}
                          </summary>
                          <p>{member.bio || member.more_info}</p>
                        </details>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      <Inquiry subject="joining our team" />
    </Page>
  );
}
