"""
CompliQuest - Streamlit Demo
A gamified compliance questionnaire game with LSEGling character
"""

import streamlit as st
import json
import random
from datetime import datetime
from typing import Dict, List, Optional
import boto3
from botocore.exceptions import ClientError

# Page configuration
st.set_page_config(
    page_title="CompliQuest - Compliance Game",
    page_icon="🦆",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for game-like appearance
st.markdown("""
<style>
    .main-header {
        text-align: center;
        color: #4A90E2;
        font-size: 3em;
        margin-bottom: 0.5em;
    }
    .lsegling-container {
        text-align: center;
        margin: 2em 0;
    }
    .lsegling-avatar {
        font-size: 5em;
        animation: bounce 2s infinite;
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    .game-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        padding: 1.5em;
        color: white;
        margin: 1em 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .progress-bar {
        height: 20px;
        background-color: #e0e0e0;
        border-radius: 10px;
        margin: 1em 0;
        overflow: hidden;
    }
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        border-radius: 10px;
        transition: width 0.5s ease;
    }
    .achievement-badge {
        display: inline-block;
        background: gold;
        color: #333;
        padding: 0.5em 1em;
        border-radius: 20px;
        margin: 0.5em;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .compliance-question {
        background: #f8f9fa;
        border-left: 5px solid #4A90E2;
        padding: 1.5em;
        margin: 1em 0;
        border-radius: 0 10px 10px 0;
    }
</style>
""", unsafe_allow_html=True)

# Game state management
if 'game_state' not in st.session_state:
    st.session_state.game_state = {
        'current_framework': None,
        'current_project': None,
        'current_control_index': 0,
        'score': 0,
        'completed_controls': [],
        'achievements': [],
        'conversation_history': [],
        'lsegling_mood': 'happy'
    }

if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

# Mock data for demonstration
COMPLIANCE_FRAMEWORKS = {
    "gdpr": {
        "name": "GDPR",
        "description": "General Data Protection Regulation",
        "controls": 5,
        "emoji": "🌍",
        "color": "#4A90E2"
    },
    "hipaa": {
        "name": "HIPAA", 
        "description": "Health Insurance Portability and Accountability Act",
        "controls": 5,
        "emoji": "🏥",
        "color": "#7B68EE"
    },
    "pci-dss": {
        "name": "PCI-DSS",
        "description": "Payment Card Industry Data Security Standard",
        "controls": 5,
        "emoji": "💳",
        "color": "#FF6B6B"
    }
}

COMPLIANCE_CONTROLS = {
    "gdpr": [
        {
            "id": "gdpr-1",
            "title": "How does your system obtain and record user consent for data processing?",
            "category": "Consent Management",
            "severity": "high",
            "hint": "Think about explicit opt-in mechanisms and audit trails"
        },
        {
            "id": "gdpr-2", 
            "title": "What measures are in place for data subject access requests (DSAR)?",
            "category": "Data Subject Rights",
            "severity": "medium",
            "hint": "Consider automated workflows for data access, rectification, and deletion"
        },
        {
            "id": "gdpr-3",
            "title": "How is data minimization principle implemented in your data collection?",
            "category": "Data Protection",
            "severity": "high",
            "hint": "Only collect data necessary for specific purposes"
        },
        {
            "id": "gdpr-4",
            "title": "Describe your data breach notification process",
            "category": "Incident Response",
            "severity": "critical",
            "hint": "72-hour notification requirement to authorities"
        },
        {
            "id": "gdpr-5",
            "title": "How do you ensure data protection by design and by default?",
            "category": "Privacy Engineering",
            "severity": "medium",
            "hint": "Integrate privacy from the initial design stage"
        }
    ],
    "hipaa": [
        {
            "id": "hipaa-1",
            "title": "How is protected health information (PHI) encrypted at rest and in transit?",
            "category": "Data Security",
            "severity": "high",
            "hint": "Consider AES-256 encryption and TLS 1.3"
        },
        {
            "id": "hipaa-2",
            "title": "Describe your access control mechanisms for PHI",
            "category": "Access Management",
            "severity": "high",
            "hint": "Role-based access control and audit logging"
        },
        {
            "id": "hipaa-3",
            "title": "How do you handle business associate agreements (BAAs)?",
            "category": "Third-Party Management",
            "severity": "medium",
            "hint": "Contractual requirements for service providers"
        },
        {
            "id": "hipaa-4",
            "title": "What is your process for risk analysis and management?",
            "category": "Risk Management",
            "severity": "medium",
            "hint": "Regular security risk assessments"
        },
        {
            "id": "hipaa-5",
            "title": "How are workforce members trained on HIPAA compliance?",
            "category": "Training & Awareness",
            "severity": "low",
            "hint": "Annual training and policy acknowledgment"
        }
    ]
}

ACHIEVEMENTS = [
    {"id": "first_step", "name": "First Quest", "description": "Started your first compliance quest", "icon": "🎯"},
    {"id": "halfway", "name": "Halfway Hero", "description": "Completed 50% of controls", "icon": "🏆"},
    {"id": "perfect_score", "name": "Perfect Protector", "description": "Achieved 100% compliance score", "icon": "⭐"},
    {"id": "quick_thinker", "name": "Quick Thinker", "description": "Completed a quest in under 5 minutes", "icon": "⚡"},
    {"id": "framework_master", "name": "Framework Master", "description": "Completed all controls in a framework", "icon": "👑"}
]

# LSEGling character moods and messages
LSEGLING_MOODS = {
    "happy": {"emoji": "🦆", "message": "Hello! I'm LSEGling, ready to help you protect your community!"},
    "thinking": {"emoji": "🤔", "message": "Hmm, let me think about that compliance question..."},
    "excited": {"emoji": "🎉", "message": "Wow! Great answer! You're really protecting the community!"},
    "concerned": {"emoji": "😟", "message": "I'm a bit concerned about this compliance gap..."},
    "celebrating": {"emoji": "🎊", "message": "Congratulations! You've completed the quest!"}
}

# Game functions
def calculate_progress():
    """Calculate game progress percentage"""
    total_controls = 5  # Each framework has 5 controls
    completed = len(st.session_state.game_state['completed_controls'])
    return (completed / total_controls) * 100 if total_controls > 0 else 0

def get_current_control():
    """Get the current control based on game state"""
    framework = st.session_state.game_state['current_framework']
    index = st.session_state.game_state['current_control_index']
    
    if framework and framework in COMPLIANCE_CONTROLS:
        controls = COMPLIANCE_CONTROLS[framework]
        if index < len(controls):
            return controls[index]
    return None

def evaluate_response(control_id: str, response: str) -> Dict:
    """Evaluate a compliance response (mock implementation)"""
    # Simple scoring logic for demo
    score = random.randint(70, 95)  # Mock score
    keywords = ["consent", "encrypt", "access", "audit", "policy", "training", "risk"]
    
    keyword_count = sum(1 for keyword in keywords if keyword.lower() in response.lower())
    score = min(95, score + (keyword_count * 5))
    
    status = "compliant" if score >= 80 else "needs_improvement"
    
    feedback_options = [
        "Excellent response demonstrating strong compliance practices!",
        "Good answer, but consider adding more specific controls.",
        "You're on the right track, but need more detail about implementation.",
        "Strong understanding of requirements, could use more examples.",
        "Well-articulated response with clear compliance focus."
    ]
    
    lsegling_messages = [
        "Your LSEGling was given shelter! 🏠",
        "LSEGling feels safer with your answer! 🦆",
        "Great protection for the community! 🌟",
        "LSEGling is doing a happy dance! 💃",
        "Another step toward a secure community! 🔒"
    ]
    
    return {
        "control_id": control_id,
        "score": score,
        "status": status,
        "feedback": random.choice(feedback_options),
        "lsegling_message": random.choice(lsegling_messages),
        "suggestions": [
            "Consider documenting specific procedures",
            "Add metrics for monitoring effectiveness",
            "Include regular review cycles",
            "Document evidence collection process"
        ]
    }

def unlock_achievement(achievement_id: str):
    """Unlock an achievement if not already unlocked"""
    if achievement_id not in [a['id'] for a in st.session_state.game_state['achievements']]:
        achievement = next((a for a in ACHIEVEMENTS if a['id'] == achievement_id), None)
        if achievement:
            st.session_state.game_state['achievements'].append(achievement)
            st.session_state.chat_history.append({
                "sender": "system",
                "message": f"🎉 Achievement Unlocked: {achievement['name']}! {achievement['description']}",
                "timestamp": datetime.now().strftime("%H:%M:%S")
            })
            return True
    return False

def add_chat_message(sender: str, message: str):
    """Add a message to chat history"""
    st.session_state.chat_history.append({
        "sender": sender,
        "message": message,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })

# UI Components
def render_header():
    """Render the game header"""
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col1:
        st.metric("Score", f"{st.session_state.game_state['score']}")
    
    with col2:
        st.markdown('<h1 class="main-header">CompliQuest 🦆</h1>', unsafe_allow_html=True)
        st.markdown('<p style="text-align: center; color: #666;">Protect your community with compliance quests!</p>', unsafe_allow_html=True)
    
    with col3:
        progress = calculate_progress()
        st.metric("Progress", f"{progress:.0f}%")

def render_lsegling():
    """Render LSEGling character"""
    mood = st.session_state.game_state['lsegling_mood']
    lsegling = LSEGLING_MOODS.get(mood, LSEGLING_MOODS["happy"])
    
    st.markdown(f"""
    <div class="lsegling-container">
        <div class="lsegling-avatar">{lsegling['emoji']}</div>
        <div style="font-size: 1.2em; margin-top: 0.5em; font-weight: bold; color: #4A90E2;">
            {lsegling['message']}
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_progress_bar():
    """Render progress bar"""
    progress = calculate_progress()
    st.markdown(f"""
    <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%;"></div>
    </div>
    <div style="text-align: center; margin-bottom: 1em;">
        {len(st.session_state.game_state['completed_controls'])} of 5 controls completed
    </div>
    """, unsafe_allow_html=True)

def render_achievements():
    """Render unlocked achievements"""
    if st.session_state.game_state['achievements']:
        st.subheader("🏆 Achievements")
        cols = st.columns(3)
        for idx, achievement in enumerate(st.session_state.game_state['achievements']):
            with cols[idx % 3]:
                st.markdown(f"""
                <div style="text-align: center; padding: 1em; background: #f0f8ff; border-radius: 10px;">
                    <div style="font-size: 2em;">{achievement['icon']}</div>
                    <div style="font-weight: bold; margin: 0.5em 0;">{achievement['name']}</div>
                    <div style="font-size: 0.9em; color: #666;">{achievement['description']}</div>
                </div>
                """, unsafe_allow_html=True)

def render_framework_selection():
    """Render framework selection"""
    st.markdown('<div class="game-card">', unsafe_allow_html=True)
    st.subheader("🎯 Choose Your Compliance Quest")
    
    cols = st.columns(3)
    for idx, (framework_id, framework) in enumerate(COMPLIANCE_FRAMEWORKS.items()):
        with cols[idx]:
            if st.button(
                f"{framework['emoji']} {framework['name']}",
                key=f"framework_{framework_id}",
                use_container_width=True
            ):
                st.session_state.game_state['current_framework'] = framework_id
                st.session_state.game_state['current_project'] = f"proj-{framework_id}"
                st.session_state.game_state['current_control_index'] = 0
                st.session_state.game_state['completed_controls'] = []
                st.session_state.game_state['lsegling_mood'] = 'excited'
                
                add_chat_message("system", f"Started {framework['name']} compliance quest! {framework['emoji']}")
                unlock_achievement("first_step")
                st.rerun()
            
            st.caption(framework['description'])
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_compliance_questionnaire():
    """Render the compliance questionnaire"""
    framework_id = st.session_state.game_state['current_framework']
    if not framework_id:
        return
    
    framework = COMPLIANCE_FRAMEWORKS.get(framework_id)
    current_control = get_current_control()
    
    if not current_control:
        # All controls completed
        render_completion_screen()
        return
    
    st.markdown('<div class="game-card">', unsafe_allow_html=True)
    
    # Framework header
    col1, col2 = st.columns([3, 1])
    with col1:
        st.subheader(f"{framework['emoji']} {framework['name']} Quest")
    with col2:
        st.metric("Control", f"{st.session_state.game_state['current_control_index'] + 1}/5")
    
    # Current control
    st.markdown(f"""
    <div class="compliance-question">
        <h3>Control {st.session_state.game_state['current_control_index'] + 1}: {current_control['title']}</h3>
        <p><strong>Category:</strong> {current_control['category']} | <strong>Severity:</strong> {current_control['severity'].upper()}</p>
        <p><em>💡 Hint: {current_control['hint']}</em></p>
    </div>
    """, unsafe_allow_html=True)
    
    # Response input
    response = st.text_area(
        "Your Response:",
        placeholder="Describe how your organization addresses this control...",
        height=150,
        key=f"response_{current_control['id']}"
    )
    
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col1:
        if st.button("🔄 Get AI Guidance", use_container_width=True):
            st.session_state.game_state['lsegling_mood'] = 'thinking'
            add_chat_message("LSEGling", "Let me think about some guidance for this control...")
            st.rerun()
    
    with col2:
        if st.button("📋 Show Example", use_container_width=True):
            examples = [
                "We implement explicit opt-in consent through checkboxes with clear explanations.",
                "All PHI data is encrypted using AES-256 at rest and TLS 1.3 in transit.",
                "Access controls follow principle of least privilege with regular access reviews.",
                "We conduct annual risk assessments and maintain a risk register.",
                "All employees complete mandatory compliance training upon hire and annually."
            ]
            st.info(f"**Example response:** {random.choice(examples)}")
    
    with col3:
        if st.button("✅ Submit Answer", type="primary", use_container_width=True, disabled=not response):
            if response:
                # Evaluate response
                evaluation = evaluate_response(current_control['id'], response)
                
                # Update game state
                st.session_state.game_state['score'] += evaluation['score']
                st.session_state.game_state['completed_controls'].append(current_control['id'])
                st.session_state.game_state['current_control_index'] += 1
                st.session_state.game_state['lsegling_mood'] = 'excited'
                
                # Add to chat
                add_chat_message("You", response)
                add_chat_message("LSEGling", f"{evaluation['lsegling_message']} Score: {evaluation['score']}/100")
                add_chat_message("System", f"**Feedback:** {evaluation['feedback']}")
                
                # Check for achievements
                progress = calculate_progress()
                if progress >= 50:
                    unlock_achievement("halfway")
                if progress >= 100:
                    unlock_achievement("framework_master")
                
                st.rerun()
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_completion_screen():
    """Render completion screen"""
    framework_id = st.session_state.game_state['current_framework']
    framework = COMPLIANCE_FRAMEWORKS.get(framework_id, {})
    
    st.markdown('<div class="game-card">', unsafe_allow_html=True)
    
    st.balloons()
    st.markdown(f"# 🎊 Quest Complete! {framework.get('emoji', '🎉')}")
    st.markdown(f"### You've completed the {framework.get('name', 'Compliance')} Quest!")
    
    # Score summary
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Final Score", f"{st.session_state.game_state['score']}")
    with col2:
        st.metric("Controls Completed", "5/5")
    with col3:
        st.metric("Achievements", f"{len(st.session_state.game_state['achievements'])}")
    
    # Remediation guidance
    st.subheader("📋 Recommended Next Steps")
    st.info("""
    1. **Document your responses** in a compliance register
    2. **Schedule follow-up reviews** in 6 months
    3. **Share findings** with relevant stakeholders
    4. **Consider external audit** for validation
    5. **Explore other frameworks** to expand compliance coverage
    """)
    
    if st.button("🔄 Start New Quest", type="primary", use_container_width=True):
        st.session_state.game_state['current_framework'] = None
        st.session_state.game_state['current_project'] = None
        st.session_state.game_state['current_control_index'] = 0
        st.session_state.game_state['lsegling_mood'] = 'happy'
        st.rerun()
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_chat_history():
    """Render chat history"""
    if st.session_state.chat_history:
        st.subheader("💬 Quest Log")
        chat_container = st.container()
        
        with chat_container:
            for chat in reversed(st.session_state.chat_history[-10:]):  # Show last 10 messages
                if chat['sender'] == 'You':
                    st.markdown(f"""
                    <div style="text-align: right; margin: 0.5em 0;">
                        <div style="background: #4A90E2; color: white; padding: 0.8em; border-radius: 15px 15px 0 15px; display: inline-block; max-width: 80%;">
                            {chat['message']}
                        </div>
                        <div style="font-size: 0.8em; color: #666; text-align: right;">
                            {chat['timestamp']} • You
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                elif chat['sender'] == 'LSEGling':
                    st.markdown(f"""
                    <div style="text-align: left; margin: 0.5em 0;">
                        <div style="background: #f0f0f0; padding: 0.8em; border-radius: 15px 15px 15px 0; display: inline-block; max-width: 80%;">
                            <strong>🦆 LSEGling:</strong> {chat['message']}
                        </div>
                        <div style="font-size: 0.8em; color: #666;">
                            {chat['timestamp']}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                else:  # System messages
                    st.markdown(f"""
                    <div style="background: #fff8e1; padding: 0.8em; border-radius: 10px; margin: 0.5em 0; border-left: 4px solid #ffc107;">
                        {chat['message']}
                        <div style="font-size: 0.8em; color: #666; text-align: right;">
                            {chat['timestamp']}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

# Main app layout
def main():
    render_header()
    render_lsegling()
    
    # Sidebar
    with st.sidebar:
        st.image("https://cdn-icons-png.flaticon.com/512/1998/1998678.png", width=100)
        st.title("CompliQuest Game")
        st.markdown("---")
        
        st.subheader("Game Stats")
        st.metric("Total Score", st.session_state.game_state['score'])
        st.metric("Completed", f"{len(st.session_state.game_state['completed_controls'])}/5")
        
        st.markdown("---")
        st.subheader("How to Play")
        st.markdown("""
        1. **Choose a compliance framework** to protect
        2. **Answer 5 controls** with detailed responses
        3. **Get AI feedback** and LSEGling reactions
        4. **Earn achievements** as you progress
        5. **Complete quests** to become a compliance hero!
        """)
        
        if st.button("🔄 Reset Game", type="secondary"):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()
    
    # Main content area
    if not st.session_state.game_state['current_framework']:
        # Framework selection screen
        render_framework_selection()
        render_achievements()
    else:
        # Questionnaire screen
        render_progress_bar()
        render_compliance_questionnaire()
    
    # Chat history (always visible when there's content)
    render_chat_history()
    
    # Footer
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    with col2:
        st.markdown(
            "<div style='text-align: center; color: #666; font-size: 0.9em;'>"
            "🦆 CompliQuest - Protecting communities through gamified compliance<br>"
            "Powered by LSEGling's guidance • Demo Version"
            "</div>",
            unsafe_allow_html=True
        )

if __name__ == "__main__":
    main()