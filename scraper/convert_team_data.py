"""
Team Data to React Component Converter
======================================
Converts CSV/JSON team data into a React-compatible format
"""

import json
import csv
import sys
from pathlib import Path

def csv_to_react_component(csv_file):
    """Convert CSV to React component data format."""
    
    team_data = []
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for idx, row in enumerate(reader, 1):
                team_data.append({
                    'id': idx,
                    'name': row.get('name', 'Unknown').strip(),
                    'position': row.get('position', 'Unknown').strip(),
                    'image_url': row.get('image_url', '').strip(),
                    'bio': row.get('bio', '').strip()
                })
        
        return team_data
    
    except FileNotFoundError:
        print(f"Error: File '{csv_file}' not found.")
        return None
    except Exception as e:
        print(f"Error reading CSV: {str(e)}")
        return None


def generate_react_code(team_data):
    """Generate React component code with team data."""
    
    # Create the team data string
    team_data_str = json.dumps(team_data, indent=6, ensure_ascii=False)
    
    react_code = f'''import React, {{ useState }} from 'react';
import styles from './Team.module.css';

const Team = () => {{
  const [teamMembers] = useState({team_data_str});
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className={{styles.team}}>
      <div className={{styles.container}}>
        <div className={{styles.sectionHeader}}>
          <h2>Our Team</h2>
          <p>Meet the experts behind CEC Nepal's success</p>
          <div className={{styles.line}}></div>
        </div>

        <div className={{styles.teamGrid}}>
          {{teamMembers.map(member => (
            <div 
              key={{member.id}} 
              className={{styles.teamCard}}
              onClick={{() => setSelectedMember(selectedMember?.id === member.id ? null : member)}}
            >
              <div className={{styles.imageContainer}}>
                <img src={{member.image_url}} alt={{member.name}} onError={{(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Profile'}} />
                <div className={{styles.overlay}}>
                  <button className={{styles.readMoreBtn}}>
                    {{selectedMember?.id === member.id ? 'Less' : 'More'}}
                  </button>
                </div>
              </div>
              <div className={{styles.memberInfo}}>
                <h3>{{member.name}}</h3>
                <p className={{styles.position}}>{{member.position}}</p>
                {{selectedMember?.id === member.id && (
                  <p className={{styles.bio}}>{{member.bio}}</p>
                )}}
              </div>
            </div>
          ))}}
        </div>

        <div className={{styles.teamStats}}>
          <div className={{styles.statItem}}>
            <h4>{{teamMembers.length}}+</h4>
            <p>Expert Team Members</p>
          </div>
          <div className={{styles.statItem}}>
            <h4>20+</h4>
            <p>Years Combined Experience</p>
          </div>
          <div className={{styles.statItem}}>
            <h4>50+</h4>
            <p>Projects Completed</p>
          </div>
        </div>

        <div className={{styles.joinTeamBox}}>
          <h3>Join Our Team</h3>
          <p>We're always looking for talented engineers and consultants passionate about clean energy.</p>
          <a href="#contact" className={{styles.ctaButton}}>Contact Us for Opportunities</a>
        </div>
      </div>
    </section>
  );
}};

export default Team;
'''
    
    return react_code


def save_react_component(react_code, output_file='Team_Generated.js'):
    """Save generated React component to file."""
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(react_code)
        print(f"✓ React component saved to: {output_file}")
        return True
    except Exception as e:
        print(f"Error saving React component: {str(e)}")
        return False


def save_team_json(team_data, output_file='team_data.json'):
    """Save team data as JSON file."""
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(team_data, f, indent=2, ensure_ascii=False)
        print(f"✓ Team data saved to: {output_file}")
        return True
    except Exception as e:
        print(f"Error saving team JSON: {str(e)}")
        return False


def main():
    """Main function."""
    
    print("\n" + "="*80)
    print("TEAM DATA TO REACT COMPONENT CONVERTER")
    print("="*80 + "\n")
    
    # Check if CSV file exists
    csv_file = 'cec_team_members.csv'
    
    if not Path(csv_file).exists():
        print(f"Error: {csv_file} not found in current directory.")
        print("\nSteps to fix:")
        print("1. Run: python team_scraper.py")
        print("2. Then run: python convert_team_data.py")
        return
    
    print(f"Converting {csv_file}...\n")
    
    # Convert CSV to team data
    team_data = csv_to_react_component(csv_file)
    
    if not team_data:
        print("Failed to convert CSV data.")
        return
    
    print(f"✓ Successfully loaded {len(team_data)} team members\n")
    
    # Save as JSON
    save_team_json(team_data)
    
    # Generate React component
    react_code = generate_react_code(team_data)
    save_react_component(react_code)
    
    # Display sample
    print("\nSample team member data:")
    print("-" * 80)
    if team_data:
        sample = team_data[0]
        print(f"ID: {sample['id']}")
        print(f"Name: {sample['name']}")
        print(f"Position: {sample['position']}")
        print(f"Image URL: {sample['image_url']}")
        if sample['bio']:
            print(f"Bio: {sample['bio'][:100]}...")
    print("-" * 80)
    
    print("\n" + "="*80)
    print("CONVERSION COMPLETE!")
    print("="*80)
    print("\nNext steps:")
    print("1. Copy the generated Team.js content to src/components/Sections/Team.js")
    print("2. Or import team_data.json in your React component")
    print("3. Restart the development server")
    print("\n")


if __name__ == '__main__':
    main()
