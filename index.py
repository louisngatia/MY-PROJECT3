import streamlit as ui

# Page configuration for a clean layout
ui.set_page_config(
    page_title="Clean Canvas",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom minimalist styling
ui.markdown("""
    <style>
        .main { background-color: #fafafa; color: #222222; font-family: 'Helvetica Neue', sans-serif; }
        h1 { font-weight: 700; color: #111111; letter-spacing: -1px; }
        .stButton>button { 
            background-color: #111111; color: white; border-radius: 6px; 
            padding: 10px 24px; border: none; font-weight: 500;
        }
        .stButton>button:hover { background-color: #333333; color: white; }
        .card { 
            background: white; padding: 24px; border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 16px; 
        }
    </style>
""", unsafe_html=True)

# Navigation Bar
ui.markdown("""
    <div style='display: flex; justify-content: space-between; align-items: center; padding: 10px 0 30px 0;'>
        <div style='font-size: 20px; font-weight: 700;'>⚡ CANVAS</div>
        <div style='display: flex; gap: 20px; font-size: 14px; font-weight: 500;'>
            <a href='#features' style='color: #666; text-decoration: none;'>Features</a>
            <a href='#analytics' style='color: #666; text-decoration: none;'>Dashboard</a>
            <a href='#contact' style='color: #666; text-decoration: none;'>Contact</a>
        </div>
    </div>
""", unsafe_html=True)

# Hero Section
ui.markdown("<h1>Build beautiful web apps instantly.</h1>", unsafe_html=True)
ui.markdown("<p style='color: #666; font-size: 18px; margin-bottom: 24px;'>A clean, minimalist template engineered for rapid prototyping and deployment.</p>", unsafe_html=True)

if ui.button("Get Started"):
    ui.balloons()

ui.markdown("<hr style='border-top: 1px solid #eee; margin: 40px 0;'>", unsafe_html=True)

# Features Section
ui.markdown("<h3 id='features' style='margin-bottom: 20px;'>Core Features</h3>", unsafe_html=True)
col1, col2, col3 = ui.columns(3)

with col1:
    ui.markdown("""
        <div class='card'>
            <h4 style='margin-top:0;'>Minimal Design</h4>
            <p style='color: #555; font-size: 14px;'>Stripped of clutter. Focused purely on content execution and layout readability.</p>
        </div>
    """, unsafe_html=True)

with col2:
    ui.markdown("""
        <div class='card'>
            <h4 style='margin-top:0;'>Pure Python</h4>
            <p style='color: #555; font-size: 14px;'>No HTML, CSS, or JavaScript layout configuration required to scale up functions.</p>
        </div>
    """, unsafe_html=True)

with col3:
    ui.markdown("""
        <div class='card'>
            <h4 style='margin-top:0;'>Instant Updates</h4>
            <p style='color: #555; font-size: 14px;'>Any variable adjustments automatically compute and refresh on screen live.</p>
        </div>
    """, unsafe_html=True)

ui.markdown("<hr style='border-top: 1px solid #eee; margin: 40px 0;'>", unsafe_html=True)

# Interactive Dashboard Section
ui.markdown("<h3 id='analytics' style='margin-bottom: 20px;'>Interactive Metric Tool</h3>", unsafe_html=True)
col_left, col_right = ui.columns([1, 2])

with col_left:
    user_input = ui.text_input("Enter your project name:", "Alpha Project")
    scale_factor = ui.slider("Select scaling intensity:", 1, 100, 50)
    metric_val = scale_factor * 12.5

with col_right:
    ui.markdown(f"""
        <div class='card' style='height: 100%;'>
            <h5 style='margin-top:0; color:#888;'>LIVE INSIGHTS</h5>
            <h2>{user_input}</h2>
            <p style='font-size: 36px; font-weight: 700; color: #111; margin: 10px 0;'>{metric_val:,.2f} XP</p>
            <p style='color: #22c55e; font-size: 14px; font-weight: 500;'>↑ Optimized efficiency matrix active</p>
        </div>
    """, unsafe_html=True)
