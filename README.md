# Vampire: The Masquerade Character Sheet

A modern, interactive character sheet application for Vampire: The Masquerade tabletop role-playing game. This application helps players create and manage their characters with an intuitive interface and automatic experience point (EP) calculation.

## Features

- **Interactive Character Creation**: Create and customize your vampire character with ease
- **Automatic EP Calculation**: Track and calculate experience points automatically
- **Clan Selection**: Choose from various vampire clans with their unique disciplines
- **Discipline Management**: 
  - Prefilled clan disciplines
  - Custom discipline selection
  - Visual dot rating system
- **Attribute Tracking**:
  - Physical attributes (Körperlich)
  - Social attributes (Sozial)
  - Mental attributes (Geistig)
- **Skill Management**:
  - Talents (Talente)
  - Skills (Fertigkeiten)
  - Knowledge (Kenntnisse)
- **Background and Virtues**:
  - Prefilled backgrounds (Hintergründe)
  - Virtues (Tugenden)
  - Custom backgrounds
- **Save/Load Functionality**: Save your character sheet and load it later
- **Visual Feedback**: 
  - Gray prefilled dots (non-deselectable)
  - Black selectable dots
  - Two-step deselection process

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vampire-character-sheet.git
cd vampire-character-sheet
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Character

1. Select your clan from the dropdown menu
2. The application will automatically populate your clan disciplines
3. Fill in your attributes, skills, and backgrounds
4. Use the dot system to indicate levels in various traits
5. Track your EP as you build your character

### Saving and Loading

- Click "Save Character" to download your character sheet as a JSON file
- Click "Load Character" to upload a previously saved character sheet

### Dot System

- **Gray Dots**: Prefilled values that cannot be changed
- **Black Dots**: Selectable values
- **Deselection**: 
  - Click the first non-prefilled dot to deselect additional dots
  - Click again to deselect the first dot completely

## Technical Details

### Built With

- React
- TypeScript
- Vite
- CSS Modules

### Project Structure

```
src/
├── components/         # React components
├── domain.tsx         # Game-specific data and logic
├── types.tsx          # TypeScript type definitions
├── utils.tsx          # Utility functions
└── styles/            # CSS styles
```

### Key Features Implementation

- **EP Calculation**: Automatic tracking of experience points based on trait levels
- **Clan Disciplines**: Pre-populated based on clan selection
- **Prefilled Values**: Non-deselectable gray dots for initial character traits
- **Save/Load System**: JSON-based character sheet persistence

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Vampire: The Masquerade and its creators
- The World of Darkness universe
