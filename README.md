<h1 align="center">
   Discord Bot Status Embed
</h1>
<h4 align="center">Made with love by William2sober</h4>

---------

## 💡 About
This is a **Discord bot** that monitors the status of various bots and sends an embed message to a specific channel. The embed shows whether each bot is online or offline and updates every **30 seconds**.

### Features:
- Displays the status (online/offline) of multiple bots.
- Auto-updates the embed every **30 seconds**.
- Saves the embed ID in a JSON file for easy editing without sending a new message.

## 🚀 Getting Started

### Prerequisites:
- [Node.js](https://nodejs.org/) (v16 or higher)
- A **Discord Bot Token** (Create one on [Discord Developer Portal](https://discord.com/developers/applications))

### Installation:

1. **Clone the Repository**:
   ```
   git clone https://github.com/william2sober/Discord-Bot-Status.git
   cd Discord-Bot-Status
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Create a `.env` File**:
   Add your bot token:
   ```
   TOKEN=your_discord_bot_token
   ```

4. **Update the `index.js` File**:
   - Set the channel ID where you want the embed to appear.
   - Add the bot user IDs for each bot you want to track.

5. **Run the Bot**:
   ```
   node index.js
   ```

---
