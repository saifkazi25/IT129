# Infinite Tsukuyomi – AI Fantasy Selfie Quiz

This is a **Next.js 14** demo that:

1. Asks the user a question about their favorite fantasy world  
2. Captures a selfie **directly from the webcam** (no upload dialog)  
3. Sends the answers + selfie to an API route that:
   - Generates a fantasy background with **stability-ai/sdxl**
   - Merges the user's face onto the background with **lucataco/modelscope-facefusion**
4. Displays the final image.

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Replicate key
cp .env.example .env
# then edit .env and set REPLICATE_API_TOKEN

# 3. Run locally
npm run dev

# 4. Deploy
#   Push to GitHub and import the repo in Vercel.  
#   Set the REPLICATE_API_TOKEN environment variable in Vercel dashboard.
```

## 📂 Project Structure

```
app/             → Next.js app directory
  api/generate   → Edge function calling Replicate
  selfie/        → Webcam capture page
  result/        → Result page
components/      → Reusable React components
tailwind.config.js
postcss.config.js
```

## 🤖 Models Used

| Purpose | Replicate Model | Docs |
| ------- | -------------- | ---- |
| Background generation | `stability-ai/sdxl` | https://replicate.com/stability-ai/sdxl |
| Face fusion | `lucataco/modelscope-facefusion` | https://replicate.com/lucataco/modelscope-facefusion |

Both models are called via Replicate's REST API.

---

Happy hacking! ✨
