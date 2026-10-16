# Personal & Upstream Git Workflow Guide

This guide explains how to safely work on your changes and push them to your **personal GitHub repository**, while keeping **Awais's repository (`origin`)** safe until you are ready to publish.

---

## 1. Create a New Empty Repo on Your Personal GitHub

1. Open [github.com/new](https://github.com/new).
2. Choose a repository name (e.g. `pizza` or `genz-pizza-pos`).
3. Set visibility to **Private** (or Public).
4. **Important**: Leave *"Add a README file"*, *"Add .gitignore"*, and *"Choose a license"* **unchecked** (keep it completely empty).
5. Click **Create repository** and copy the URL (e.g. `https://github.com/YOUR_USERNAME/pizza.git`).

---

## 2. Commit Your Current Work Locally

Open terminal in the `pizza` directory and run:

```bash
cd "/media/shahzaib/NewVolume/WIN backup/Shahzaib/Personal/Vault/Code OG/Food App/pizza"

# Check your current status
git status

# Stage all changes
git add .

# Commit changes locally
git commit -m "feat: complete modern POS UI overhaul, uniform padding and modals"
```

---

## 3. Add Your Personal GitHub Remote & Push

Add your personal repository as a new remote named `personal` so Awais's repository stays intact as `origin`:

```bash
# Add your personal repo (replace with your actual GitHub repo URL)
git remote add personal https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify both remotes are registered
git remote -v

# Push your main branch to your personal repository
git push -u personal main
```

> **Note:** Whenever you make new changes while working on the project, simply run:
> ```bash
> git add .
> git commit -m "your commit message"
> git push personal main
> ```

---

## 4. Push to Awais's Repo When Satisfied

Once you have tested everything and are ready to deliver to Awais:

### Option A: Push directly to Awais's `main` branch
```bash
git push origin main
```

### Option B: Push to a separate branch first (Recommended for PR / Review)
```bash
# Create and switch to a new branch
git checkout -b ui-redesign

# Push this branch to Awais's repository
git push origin ui-redesign
```

---

## 5. Summary of Useful Remote Commands

- Check configured remotes:
  ```bash
  git remote -v
  ```
- Change personal repo URL if needed:
  ```bash
  git remote set-url personal https://github.com/YOUR_USERNAME/NEW_REPO.git
  ```
- Fetch latest updates from Awais without overwriting local work:
  ```bash
  git fetch origin
  ```
