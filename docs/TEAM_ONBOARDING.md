# VISIO CS42 — How teammates contribute

1. Send your **exact GitHub username** to Rimaz so he can invite you to this private repository.
2. Open your GitHub invitation and click **Accept**.
3. Clone the repository: git clone https://github.com/rimaz1554/visio-cs42.git.
4. Install dependencies: npm ci; run locally with npm run dev.
5. Start your task from the develop branch:
   - git switch develop
   - git pull origin develop
   - git switch -c feature/your-task-name
6. Make your actual change and test with npm run build.
7. Stage and commit: git add . then git commit -m "feat: short description".
8. Push: git push -u origin feature/your-task-name.
9. On GitHub, open a pull request into **develop** and request teammate review.
10. After review, merge into develop. Open a separate reviewed PR from develop into main for approved stable updates.

**Where to see commits:** Repository → Commits, or use git log --oneline --graph --all.

**Permissions:** Collaborators need GitHub Write access. The repository owner invites them under Settings → Collaborators. Team members can clone only after accepting an invitation.

**Privacy/security:** Do not commit actual CCTV recordings, passwords, tokens, private camera feed URLs, customer data, or server deployment secrets.

**Note:** An accepted PR changes GitHub code. It does not automatically update visio.codevertexelite.com.
