use animatar::{avatar, AvatarOptions};
use std::fs;

fn main() {
    // Custom duck-like colors
    let duck_colors = &["#ffcc00", "#ffd700", "#ffaa00", "#ff9500"];
    
    // State-specific background colors
    let states = [
        ("hungry", &["#ff9800", "#ffb74d", "#ffe0b2"][..], "🍞 Hungry Duck"),
        ("thirsty", &["#2196f3", "#64b5f6", "#bbdefb"][..], "💧 Thirsty Duck"),
        ("tired", &["#9c27b0", "#ba68c8", "#e1bee7"][..], "😴 Tired Duck"),
        ("wet", &["#607d8b", "#90a4ae", "#cfd8dc"][..], "🌧️ Wet Duck"),
    ];

    // Create output directory
    fs::create_dir_all("avatars").expect("Failed to create avatars directory");

    println!("🦆 CompliQuest Duck Avatar Generator");
    println!("====================================\n");

    for (state, bg_colors, label) in states {
        let options = AvatarOptions {
            size: 200,
            round: true,
            blackout: true,
            avatar_colors: duck_colors,
            background_colors: bg_colors,
        };

        // Generate unique avatar for each state
        let seed = format!("duck-{}", state);
        let svg = avatar(&seed, &options);

        // Save to file
        let filename = format!("avatars/duck_{}.svg", state);
        fs::write(&filename, &svg).expect("Failed to write SVG file");

        println!("{}", label);
        println!("  Saved to: {}\n", filename);
    }

    println!("✅ All duck avatars generated successfully!");
    println!("\nOpen the SVG files in a browser to view your ducks.");
}

