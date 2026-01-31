# 🦖 George's Weekend

A beautiful website showing weekly family activities in London, tailored for George (3yo) who loves dinosaurs, trains, and construction!

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Create a GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Name it `georges-weekend`
   - Keep it private if you prefer
   - Click "Create repository"

2. **Push this code to GitHub**
   ```bash
   cd georges-weekend-site
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/georges-weekend.git
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up/log in with GitHub
   - Click "Add New Project"
   - Import your `georges-weekend` repository
   - Click "Deploy"
   - Done! You'll get a URL like `georges-weekend.vercel.app`

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts

## 📁 Project Structure

```
georges-weekend-site/
├── app/
│   ├── globals.css    # Tailwind styles
│   ├── layout.js      # Root layout with metadata
│   └── page.js        # Main page component
├── package.json       # Dependencies
├── next.config.js     # Next.js config
├── tailwind.config.js # Tailwind config
└── postcss.config.js  # PostCSS config
```

## 🔗 Connecting to Live Data

The website fetches data from your Google Drive JSON file. The URL is configured in `app/page.js`:

```javascript
const DATA_URL = 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID/georges-weekend-data.json';
```

**Note:** After the first newsletter script runs, it will create the JSON file in your Google Drive folder. The website will automatically pick it up.

## 🔄 How It Works

1. **Friday**: Google Apps Script runs automatically
2. **Script**: Calls Claude API with web search to find activities
3. **Output**: 
   - Sends HTML email to you and Ashleigh
   - Saves JSON to Google Drive
4. **Website**: Fetches JSON and displays activities beautifully

## 🛠️ Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Features

- ☀️ Weather integration (shows weekend forecast)
- 🚇 Transport info from Hackney
- 🎭 Filter by type (dinosaurs, vehicles, theatre, etc.)
- ✨ Free activities filter
- 🏠 Indoor activities filter (for rainy days!)
- 📱 Fully responsive (works on mobile)

---

Made with ❤️ for George's adventures 🦖🚂🏗️
