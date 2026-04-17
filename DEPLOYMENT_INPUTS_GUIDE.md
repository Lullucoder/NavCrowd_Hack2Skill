# VenueFlow From-Scratch Setup and Deployment Inputs Guide

Use this guide if you want to create everything from zero and then send me the exact details needed for final setup and deployment.

## 0) What I Need From You (Final Inputs)

I need these 8 items in chat:

1. GitHub repository URL
2. Firebase project ID
3. GCP project ID
4. Cloud Run region
5. Gemini API key status (READY or PENDING)
6. Gemini secret storage choice (Secret Manager or Env Var)
7. Deployment mode (PREP ONLY or FULL DEPLOY)
8. Permission confirmation (you can run Firebase and gcloud deploy commands)

You can send all 8 items using the template in section 8.

---

## 1) Create GitHub Repository From Scratch

### 1.1 Create repository
1. Open https://github.com/new
2. Repository name: choose your final name.
3. Visibility: Public (required by many hackathons).
4. Keep it empty or initialize with README if you prefer.
5. Click Create repository.

### 1.2 Clone locally
1. Copy repo URL from GitHub.
2. Open terminal.
3. Run:

```powershell
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_FOLDER>
```

4. Confirm remote:

```powershell
git remote -v
```

Expected result: origin points to your GitHub repo.

---

## 2) Create Google Cloud Project From Scratch

### 2.1 Create project
1. Open https://console.cloud.google.com
2. Click project selector near top bar.
3. Click New Project.
4. Enter Project name.
5. Note Project ID (this is important and often auto-generated).
6. Click Create.

### 2.2 Enable billing
1. Open Billing in GCP console.
2. Link billing account to this project.
3. Confirm billing is Active.

Without billing, Cloud Run and Cloud Build deployment may fail.

### 2.3 Verify project ID via CLI
Run:

```powershell
gcloud projects list
```

Copy your exact GCP project ID from output.

---

## 3) Create Firebase Project From Scratch

### 3.1 Create Firebase project
1. Open https://console.firebase.google.com
2. Click Add project.
3. Enter project name.
4. If prompted, connect to existing GCP project or create new.
5. Finish wizard.

### 3.2 Get Firebase project ID
1. Open Project settings in Firebase.
2. Copy Project ID.

### 3.3 Verify via CLI
Run:

```powershell
firebase projects:list
```

Copy Firebase project ID.

Note: Firebase ID and GCP project ID are often same, but not always.

---

## 4) Install Local Tools (If Not Installed)

### 4.1 Install Node.js LTS
1. Download from https://nodejs.org
2. Install LTS version.
3. Verify:

```powershell
node -v
npm -v
```

### 4.2 Install Firebase CLI
Run:

```powershell
npm install -g firebase-tools
firebase --version
```

### 4.3 Install Google Cloud CLI
1. Install from https://cloud.google.com/sdk/docs/install
2. Verify:

```powershell
gcloud --version
```

### 4.4 Optional but useful: Docker Desktop
Install Docker if you want local container build checks.

---

## 5) Authenticate and Configure CLI

### 5.1 Login to Firebase
Run:

```powershell
firebase login
```

### 5.2 Login to gcloud
Run:

```powershell
gcloud auth login
```

### 5.3 Set active GCP project
Run:

```powershell
gcloud config set project <YOUR_GCP_PROJECT_ID>
gcloud config get-value project
```

Expected result: current project equals your deployment project.

---

## 6) Gemini API Key Setup

### 6.1 Create Gemini key
1. Open Google AI Studio or Google AI API console.
2. Create API key for Gemini.
3. Copy key and store safely.

### 6.2 Choose where to store key
Option A (recommended): Secret Manager
Option B: Cloud Run environment variable

Tell me your choice. I will configure deployment commands accordingly.

### 6.3 Status value to send me
- READY: key is created and storage choice decided.
- PENDING: key is not created yet.

---

## 7) Choose Cloud Run Region

If you are unsure, use:

- us-central1

To list available regions:

```powershell
gcloud run regions list
```

Pick one region and send it to me.

---

## 8) Copy-Paste This Template In Chat

Fill and send exactly:

```text
GitHub repository URL: <https://github.com/your-user/your-repo>
Firebase project ID: <your-firebase-project-id>
GCP project ID: <your-gcp-project-id>
Cloud Run region: <example us-central1>
Gemini API key status: <READY or PENDING>
Gemini secret storage: <Secret Manager or Env Var>
Deployment mode: <PREP ONLY or FULL DEPLOY>
Permission confirmation: <YES I can run deploy commands>
```

---

## 9) Micro-Step Deployment Flow (After You Send Inputs)

I will do this sequence with your confirmation:

1. Validate project IDs and region.
2. Verify local scripts and deployment config files.
3. Run final build checks.
4. Wire Firebase hosting project value.
5. Wire backend deployment project and region.
6. Configure Gemini key injection method.
7. Deploy backend to Cloud Run.
8. Deploy frontend to Firebase Hosting.
9. Run post-deploy smoke checks.
10. Update task checklist and deployment notes.

---

## 10) Common Errors and Fixes

### Error: permission denied on deploy
Fix:
1. Ensure your account has Editor or required IAM roles.
2. Re-run gcloud auth login.
3. Re-run gcloud config set project.

### Error: billing not enabled
Fix:
1. Enable billing in GCP Billing section.
2. Wait 1-2 minutes.
3. Retry deploy command.

### Error: Firebase project not found
Fix:
1. Confirm firebase projects:list output.
2. Ensure .firebaserc project id is correct.
3. Run firebase use <project-id>.

### Error: Gemini key missing
Fix:
1. Create key.
2. Confirm storage choice.
3. Re-run backend deploy with key attached.

---

## 11) What Happens Next

After you send section 8 template, I can:

1. Finish final polish and QA pass.
2. Complete deployment wiring.
3. Give exact deploy commands for your environment.
4. Mark remaining task items complete.
