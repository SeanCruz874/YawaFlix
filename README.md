# YawaFlix

## Business Description

YawaFlix is a video-sharing website where registered users can upload and watch videos, manage video-related activity, and control whether their videos are public or private. Administrators have additional permissions for managing content.

## Problem Being Solved

YawaFlix gives users one place to share and discover videos. It also separates regular-user permissions from administrator permissions so that private content and content-management actions are handled according to each user's role and ownership.

## Features

- **Landing page:** Introduces YawaFlix and provides access to the video platform.
- **User accounts:** Registration, login, and logout through Supabase Authentication.
- **Roles and access rules:** Administrator and regular-user permissions.
- **Video upload and viewing:** Users can upload and watch videos according to their permissions.
- **Public and private videos:** Supports different visibility settings.
- **Video activity:** Includes liked videos, watch history, and watch-later features.
- **Content management:** Supports the video-management actions implemented in the submitted version, including deletion with a confirmation dialog.
- **Persistent data and storage:** Uses Supabase Database and Storage.

## Video Compression and Upload Limit

YawaFlix uses Supabase Storage. On the Supabase Free plan, the maximum file upload size is **50 MB per file**. Project-wide or bucket-specific settings may impose a lower limit, so a file larger than the configured limit may not upload successfully.

**Before uploading a video, compress it so the resulting file is smaller than 50 MB.** In YawaFlix, the video-compression button is located at the **top-right of the page, next to the Upload button**. Select that button and compress the video before uploading it.

For details, see the [official Supabase Storage file limits documentation](https://supabase.com/docs/guides/storage/uploads/file-limits).

## Technology Stack

- HTML
- CSS
- JavaScript
- Supabase Authentication
- Supabase PostgreSQL Database
- Supabase Storage
- Git and GitHub

## Setup and Run Instructions

### Requirements

- A modern web browser
- Git
- A code editor, such as Visual Studio Code
- A Supabase account and project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SeanCruz874/YawaFlix.git
   cd YawaFlix
   ```

2. Make sure the project's HTML pages, shared JavaScript files (including `supabase.js`), styles, and other referenced assets are present in the repository.

3. Configure `supabase.js` with the Supabase project URL and the intended publishable/anonymous client key. Never put a Supabase service-role key in browser-side code or commit secrets to GitHub.

4. Configure the required database tables, Row Level Security (RLS) policies, and Storage buckets for the application. Include the SQL/setup instructions needed to recreate these in the repository.

5. Run the site with a local web server. For example, open the project in Visual Studio Code and use the Live Server extension if appropriate for the project.

6. Open the landing page in your browser and test registration, login, logout, video upload, video viewing, visibility permissions, and the administrator functions.

> Follow the configuration and database instructions included with the actual project. Before submission, test these steps from a clean environment to confirm that the repository contains everything required to run the system.

## Test Accounts

Create dedicated demonstration accounts in the demonstration Supabase project and confirm their roles and permissions before submission. Do not use personal or production credentials.

- **Administrator**
  - Email: `admin123@gmail.com`
  - Password: `admin123`

- **Regular user**
  - Email: `user123@gmail.com`
  - Password: `user123`

Replace these placeholders with working, dedicated demo account credentials before submission, and ensure the accounts contain no personal or sensitive data.

## AI Tools Used

ChatGPT and Gemini was used to assist with coding, debugging, page styling, and reviewing application behavior and access-control logic. AI-generated suggestions were reviewed and adapted as part of the development process. The developer is responsible for understanding, testing, and explaining the final implementation.

## Testing Checklist

Before submitting the repository, verify:

- Registration, login, and logout work.
- Protected pages and role-based access rules work as expected.
- Regular users cannot perform actions restricted to administrators or other users.
- Video creation, reading, updating, and deletion work where implemented.
- Delete confirmation appears before content is removed.
- Public and private video permissions work as expected.
- Uploads respect the configured file-size limit; compress videos to under 50 MB when using the Supabase Free pl an.
- The setup instructions work from a clean environment.

## Security Notes

Never commit personal passwords, Supabase service-role keys, or other secrets. Use only the appropriate publishable/anonymous key in browser code and configure Row Level Security and Storage policies correctly. Use dedicated test accounts for evaluation.
