# VISIO — Smart Crowd Monitoring (Landing Page)

Source for the VISIO undergraduate Agile Team Project website:
https://visio.codevertexelite.com

This repository includes the React/TypeScript landing page and interactive simulated
occupancy demo, along with the six-member team section. It does not contain
production camera credentials, private server configuration, a live video pipeline,
or a production backend. Only authorised camera inputs may be used in any future work.

## Getting started

1. Install Node.js (20.19+ or 22.12+ is recommended for Vite 7).
2. Clone this repository: git clone https://github.com/binupa450/landing-page.git
3. Run npm ci.
4. Start the local developer server: npm run dev.
5. Run npm run build before creating a pull request.

## Contributing

- Fetch latest main before starting: git checkout main && git pull origin main.
- Create your own feature branch, e.g. git checkout -b feature/camera-dashboard.
- Make focused changes, run npm run build, then commit with a clear message.
- Push the feature branch: git push -u origin feature/camera-dashboard.
- Open a pull request to main on GitHub and request another team member's review.
- Avoid committing passwords, private keys, camera RTSP URLs, .env files, real footage,
  client data or unrelated coursework.
- The live website is deployed separately; merging to main does not deploy the VPS.

## Commit history

Click Commits on GitHub, or run: git log --oneline --graph --all --decorate.
To examine code changes: git show <commit-sha>.
